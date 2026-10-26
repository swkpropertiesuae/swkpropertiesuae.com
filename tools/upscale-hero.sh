#!/usr/bin/env bash
# Build a 3840x2160 delivery encode from the original 1080p master.
# This is a Lanczos upscale, not newly captured native 4K detail.
set -euo pipefail
cd "$(dirname "$0")/.."
test "$#" -eq 1 || { echo 'Provide the original 1080p master.' >&2; exit 1; }
mkdir -p src/assets/video
ffmpeg -y -v error -i "$1" \
  -vf "rotate='0.038397*max(0,1-t/4)':fillcolor=black,scale=w='trunc(1920*(1+0.075*max(0,1-t/4))/2)*2':h='trunc(1080*(1+0.075*max(0,1-t/4))/2)*2':eval=frame:flags=lanczos,crop=1920:1080,setsar=1,unsharp=5:5:0.35:3:3:0,scale=3840:2160:flags=lanczos" \
  -an -c:v libx264 -preset medium -crf 18 -maxrate 28M -bufsize 56M \
  -g 15 -keyint_min 15 -sc_threshold 0 -bf 0 -threads 4 \
  -pix_fmt yuv420p -movflags +faststart src/assets/video/hero-swk-4k.mp4
python3 build.py
