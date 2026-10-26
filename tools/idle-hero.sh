#!/usr/bin/env bash
# Usage: bash tools/idle-hero.sh /path/to/idle-clip.mp4
# Builds the desktop idle loop (hero-idle.mp4, 1080p) and a 3840x2160 delivery encode (hero-idle-4k.mp4),
# plus the first-frame poster. Audio is dropped. The Gemini sparkle (about x 1740, y 900 in the 1080p frame)
# is removed with delogo before upscaling. The 4K file is a Lanczos upscale, not native 4K detail.
# Each file stays under the 25 MiB static-asset cap.
set -euo pipefail
cd "$(dirname "$0")/.."
test "$#" -eq 1 || { echo 'Provide the idle source clip.' >&2; exit 1; }
CLEAN="delogo=x=1696:y=856:w=88:h=88"
SHARP="unsharp=5:5:0.45:3:3:0.0"
mkdir -p src/assets/video src/assets/images/hero
ffmpeg -y -v error -i "$1" -an -vf "$CLEAN,$SHARP,setsar=1" \
  -c:v libx264 -preset veryslow -profile:v high -crf 16 -maxrate 9M -bufsize 18M \
  -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart src/assets/video/hero-idle.mp4
ffmpeg -y -v error -i "$1" -an -vf "$CLEAN,scale=3840:2160:flags=lanczos,unsharp=7:7:0.6:3:3:0.0,setsar=1" \
  -c:v libx264 -preset veryslow -profile:v high -crf 16 -maxrate 16M -bufsize 32M \
  -g 30 -keyint_min 30 -pix_fmt yuv420p -movflags +faststart src/assets/video/hero-idle-4k.mp4
ffmpeg -y -v error -i src/assets/video/hero-idle.mp4 -frames:v 1 -c:v libwebp -quality 92 \
  src/assets/images/hero/hero-idle-poster.webp
