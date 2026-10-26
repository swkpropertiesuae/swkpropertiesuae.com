#!/usr/bin/env bash
# Usage: bash tools/master-hero.sh /path/to/original-hero.mp4
# Original source is also available at commit 71beb03:src/assets/video/hero-swk.mp4.
# Always process the original, never a previously processed output.
set -euo pipefail
cd "$(dirname "$0")/.."
test "$#" -eq 1 || { echo 'Provide the original 1920x1080 source clip.' >&2; exit 1; }
ffmpeg -y -v error -i "$1" \
  -vf "rotate='0.038397*max(0,1-t/4)':fillcolor=black,scale=w='trunc(1920*(1+0.075*max(0,1-t/4))/2)*2':h='trunc(1080*(1+0.075*max(0,1-t/4))/2)*2':eval=frame:flags=lanczos,crop=1920:1080,setsar=1,unsharp=5:5:0.35:3:3:0" \
  -an -c:v libx264 -preset slow -crf 16 -g 6 -keyint_min 6 \
  -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart \
  src/assets/video/hero-swk-hq.mp4
ffmpeg -y -v error -i src/assets/video/hero-swk-hq.mp4 \
  -frames:v 1 -c:v libwebp -lossless 1 \
  src/assets/images/hero/hero-swk-poster-hq.webp
python3 build.py
