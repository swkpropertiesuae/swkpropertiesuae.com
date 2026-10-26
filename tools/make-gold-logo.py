#!/usr/bin/env python3
"""Dev-time: derive the corporate gold SWK logo set from the original navy artwork (needs Pillow + numpy).

Reads  src/assets/images/brand/swk-logo-navy.png (the original transparent artwork, used only as an alpha mask)
Writes swk-logo-dark.png / swk-logo-white.png (full lock-up, 2x), swk-logo.png (512 square, schema + watermark)
and swk-mark.png (house + SWK, no wordmark line, used by the chat launcher and small icons).
Run tools/make-icons.py afterwards to refresh the favicons and PWA icons.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

BRAND = Path(__file__).resolve().parent.parent / "src" / "assets" / "images" / "brand"
SRC = BRAND / "swk-logo-navy.png"
MARK_CROP_BOTTOM = 252  # keeps the roof, swoosh and the whole of SWK (letters end at row 238); drops the PROPERTIES line (starts at row 253)


def smooth_alpha(a, scale):
    im = Image.fromarray(a).resize((a.shape[1] * scale, a.shape[0] * scale), Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(scale * 0.55))
    x = np.asarray(im).astype(np.float32) / 255
    return np.clip((x - 0.5) * 2.6 + 0.5, 0, 1)  # re-sharpen the edge after the blur


def hexc(h):
    return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))


def ramp(t, stops):
    t = np.clip(t, 0, 1)
    xs = [s[0] for s in stops]
    return np.stack([np.interp(t, xs, [s[1][c] for s in stops]) for c in range(3)], -1).astype(np.float32)


def gold(alpha):
    h, w = alpha.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    yn, xn = yy / h, xx / w
    # Champagne -> rich gold -> antique gold: restrained metal, not a mirror.
    base = ramp(0.78 * yn + 0.22 * xn, [(0, hexc('#ebcf84')), (0.28, hexc('#cfa13f')), (0.52, hexc('#a67a22')),
                                         (0.74, hexc('#c79a38')), (1, hexc('#7a5518'))])
    # Soft bevel from a blurred height map, lit from the top left.
    px = h / 275
    height = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(px * 2.2))).astype(np.float32) / 255
    gy, gx = np.gradient(height)
    light = np.clip((-gx * 0.7 - gy * 0.7) * px * 5.0, -1, 1)
    hi, sh = np.clip(light, 0, 1)[..., None], np.clip(-light, 0, 1)[..., None]
    rgb = base * (1 - 0.55 * sh) + (1.0 - base) * 0.55 * hi * np.array([1, 0.96, 0.8])
    # One broad diagonal sheen.
    band = np.exp(-(((xn * 0.9 + yn * 0.5) - 0.62) / 0.07) ** 2) * 0.30
    rgb = rgb + (np.array([1, 0.97, 0.86]) - rgb) * band[..., None]
    return np.clip(rgb, 0, 1)


def build(crop_bottom=None, scale=3, final=2):
    im = Image.open(SRC).convert("RGBA")
    if crop_bottom:
        im = im.crop((0, 0, im.width, crop_bottom))
    a = np.asarray(im)[..., 3]
    al = smooth_alpha(a, scale)
    out = Image.fromarray(np.dstack([gold(al) * 255, al * 255]).astype(np.uint8), "RGBA")
    return out.resize((a.shape[1] * final, a.shape[0] * final), Image.LANCZOS)


full = build()
mark = build(MARK_CROP_BOTTOM)
for name in ("swk-logo-dark.png", "swk-logo-white.png"):
    full.save(BRAND / name, optimize=True)
mark.save(BRAND / "swk-mark.png", optimize=True)
square = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
fit = full.resize((448, round(448 * full.height / full.width)), Image.LANCZOS)
square.alpha_composite(fit, ((512 - fit.width) // 2, (512 - fit.height) // 2))
square.save(BRAND / "swk-logo.png", optimize=True)
print("gold logo set written")
