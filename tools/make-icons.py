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
