#!/usr/bin/env python3
"""Dev-time: build favicon.ico and PWA icons from the brand logo (needs Pillow)."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
brand = ROOT / "src" / "assets" / "images" / "brand"
logo = Image.open(brand / "swk-logo-dark.png").convert("RGBA")  # gold lock-up (tools/make-gold-logo.py)
mark = Image.open(brand / "swk-mark.png").convert("RGBA")
NAVY = (23, 36, 60, 255)


def tile(size, pad, art=None):
    art = art or logo
    canvas = Image.new("RGBA", (size, size), NAVY)
    inner = int(size * (1 - 2 * pad))
    w, h = art.size
    scale = inner / max(w, h)
    lg = art.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
    canvas.alpha_composite(lg, ((size - lg.width) // 2, (size - lg.height) // 2))
    return canvas.convert("RGB")


tile(192, 0.12).save(brand / "icon-192.png", optimize=True)
tile(512, 0.12).save(brand / "icon-512.png", optimize=True)
tile(512, 0.22).save(brand / "icon-512-maskable.png", optimize=True)
tile(256, 0.08, mark).save(ROOT / "src" / "root" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
tile(32, 0.06, mark).save(brand / "favicon-32.png", optimize=True)
tile(180, 0.1, mark).save(brand / "favicon.png", optimize=True)
tile(180, 0.1, mark).save(brand / "favicon-app.png", optimize=True)
print("icons written")


# Circular favicons: gold ring, navy disc, the SWK mark filling the circle. Transparent outside the disc.
def disc(size, mark_w=0.8, ring=0.07, bg=NAVY):
    k = 4
    big = size * k
    canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    from PIL import ImageDraw
    d = ImageDraw.Draw(canvas)
    d.ellipse((0, 0, big - 1, big - 1), fill=(201, 154, 61, 255))
    r = int(big * ring)
    d.ellipse((r, r, big - 1 - r, big - 1 - r), fill=bg)
    w = int(big * mark_w)
    m = mark.resize((w, int(w * mark.height / mark.width)), Image.LANCZOS)
    canvas.alpha_composite(m, ((big - m.width) // 2, (big - m.height) // 2 + int(big * 0.015)))
    return canvas.resize((size, size), Image.LANCZOS)


# Favicons: the full SWK mark (roof, swoosh and the whole of SWK), tight-cropped, on a navy tile that carries no
# border so every pixel goes to the artwork. Small sizes get a brighter gold and a light sharpen so the letters stay
# readable in a browser tab. Each size is rendered natively from the artwork (not shrunk from one big bitmap).
import io
import struct
from PIL import ImageDraw, ImageEnhance, ImageFilter

_tight = mark.crop(mark.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())


def fav(size, fill=0.94, radius=0.2, lift=True):
    k = 8
    big = size * k
    c = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((0, 0, big - 1, big - 1), radius=int(big * radius), fill=NAVY)
    w = int(big * fill)
    m = _tight.resize((w, int(w * _tight.height / _tight.width)), Image.LANCZOS)
    if lift and size <= 64:
        rgb = ImageEnhance.Brightness(m.convert("RGB")).enhance(1.28)
        rgb = ImageEnhance.Contrast(rgb).enhance(1.12)
        m = Image.merge("RGBA", (*rgb.split(), m.getchannel("A")))
    c.alpha_composite(m, ((big - m.width) // 2, (big - m.height) // 2))
    out = c.resize((size, size), Image.LANCZOS)
    if size <= 64:
        out = out.filter(ImageFilter.UnsharpMask(radius=0.6, percent=110, threshold=0))
    return out


def write_ico(path, sizes):
    frames = []
    for s in sizes:
        buf = io.BytesIO()
        fav(s).save(buf, "PNG", optimize=True)
        frames.append((s, buf.getvalue()))
    head = struct.pack("<HHH", 0, 1, len(frames))
    offset = 6 + 16 * len(frames)
    entries, blobs = b"", b""
    for s, data in frames:
        entries += struct.pack("<BBBBHHII", s % 256, s % 256, 0, 0, 1, 32, len(data), offset + len(blobs))
        blobs += data
    path.write_bytes(head + entries + blobs)


fav(32).save(brand / "favicon-32.png", optimize=True)
fav(180, 0.92, 0.22, lift=False).save(brand / "favicon.png", optimize=True)
write_ico(ROOT / "src" / "root" / "favicon.ico", [16, 32, 48])
fav(180, 0.9, 0, lift=False).convert("RGB").save(brand / "favicon-app.png", optimize=True)   # iOS rounds and masks its own icon
print("favicons written")
