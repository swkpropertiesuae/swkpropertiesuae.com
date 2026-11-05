// Generates high-clarity favicons: the emblem is trimmed to its true bounds and
// scaled to fill the icon, on the brand onyx background, sharpened for small sizes.
import sharp from "sharp";
import pngToIco from "png-to-ico";
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
const OUT = path.resolve("public");
const BG = { r: 11, g: 11, b: 12, alpha: 1 };

// Render big, trim transparent margins -> tight emblem bitmap.
const big = await sharp(SRC, { density: 600 }).resize(2400, 2400).png().toBuffer();
const trimmed = await sharp(big).trim({ threshold: 5 }).png().toBuffer();

async function icon(size, { fill = 0.9, radius = 0.22, bg = true } = {}) {
  const inner = Math.round(size * fill);
  const emblem = await sharp(trimmed)
    .resize(inner, inner, { fit: "inside", kernel: "lanczos3" })
    .sharpen({ sigma: size <= 48 ? 0.9 : 0.5, m1: 1.2, m2: 2.2 })
    .modulate({ saturation: 1.18, brightness: 1.04 })
    .png()
    .toBuffer();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * radius}" fill="#fff"/></svg>`
  );
  let base = sharp({
    create: { width: size, height: size, channels: 4, background: bg ? BG : { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: emblem, gravity: "center" }]);
  const buf = await base.png().toBuffer();
  return bg ? sharp(buf).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer() : buf;
}

const targets = {
  "favicon-16.png": [16, { fill: 0.96, radius: 0.18 }],
  "favicon-32.png": [32, { fill: 0.95, radius: 0.2 }],
  "favicon-48.png": [48, { fill: 0.94 }],
  "favicon-96.png": [96, { fill: 0.92 }],
  "favicon-192.png": [192, { fill: 0.9 }],
  "favicon-512.png": [512, { fill: 0.88 }],
  // Apple touch icons are masked by iOS: full-bleed square.
  "apple-touch-icon.png": [180, { fill: 0.86, radius: 0 }],
};
for (const [name, [size, opts]] of Object.entries(targets)) {
  fs.writeFileSync(path.join(OUT, name), await icon(size, opts));
}
const ico = await pngToIco(
  await Promise.all([16, 32, 48].map((s) => icon(s, { fill: s === 16 ? 0.96 : 0.94 })))
);
fs.writeFileSync(path.join(OUT, "favicon.ico"), ico);

// Vector favicon: the emblem SVG, re-framed tightly on onyx.
const emblemSvg = fs.readFileSync(SRC, "utf8");
const meta = await sharp(trimmed).metadata();
const b = await sharp(big).trim({ threshold: 5 }).toBuffer({ resolveWithObject: true });
const { trimOffsetLeft: ox, trimOffsetTop: oy } = b.info;
const k = 1000 / 2400;
const x = Math.abs(ox) * k, y = Math.abs(oy) * k, w = meta.width * k, h = meta.height * k;
const side = Math.max(w, h) * 1.12;
const vx = x - (side - w) / 2, vy = y - (side - h) / 2;
const inner = emblemSvg.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
fs.writeFileSync(
  path.join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}"><rect x="${vx.toFixed(1)}" y="${vy.toFixed(1)}" width="${side.toFixed(1)}" height="${side.toFixed(1)}" rx="${(side * 0.22).toFixed(1)}" fill="#0b0b0c"/>${inner}</svg>`
);
console.log("favicons written", { trimmed: [meta.width, meta.height] });
