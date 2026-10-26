# Hero video master

The available master is 1920 × 1080, 30 fps, 20.03 seconds. This edit keeps
that native output resolution; it does not claim recovered 4K detail.

The first shot receives a 2.2-degree clockwise roll correction, easing back
to the source framing over four seconds. A matching overscan crop prevents
black corners and returns to full framing over the same interval. This
levels the existing forward road approach; changing the physical camera
position would require a new source render.

Light luma sharpening and H.264 CRF 16 limit additional compression loss.
Six-frame GOPs and no B frames support scroll seeking. Fast-start metadata
allows early playback. The new file is approximately 34 MB versus 13 MB
for the previous encode, a deliberate bandwidth tradeoff for visual quality
and frequent random access. A new native 4K source would be the next
meaningful improvement; upscaling this compressed master adds no real detail.

The lossless WebP poster comes from the exact corrected first video frame.
Pointer-driven background zoom is removed to avoid additional resampling.
Media filenames change so browsers fetch the new assets. Reduced-motion
and data-saver visitors continue to receive the poster.

An opaque navy/gold SWK office signature covers the clip's lower-right
rendering patch on landscape desktop layouts. Its text repeats the office
address already used by this site. Portrait mobile cover framing crops the
patch outside the viewport, so the signature is hidden below 768px in portrait orientation.

Regenerate with `bash tools/master-hero.sh /path/to/original-hero.mp4`.
Use the original clip, not this edit, to avoid cumulative compression.

## 4K and idle playback

`bash tools/upscale-hero.sh /path/to/original-hero.mp4` creates a separate
3840 × 2160 Lanczos upscale, with a 28 Mbps bitrate ceiling. It increases
delivery resolution, but does not recover native 4K camera detail. Displays
with viewport width × pixel ratio of at least 2560 receive that encode;
other visitors retain 1080p. Data-saver and reduced-motion users keep the poster.

After 700 ms without scrolling, the muted video plays forward at 0.8× speed.
Its captions and closing reveal follow the video timeline. Scrolling pauses
playback and restores the scroll-position timeline; idle playback resumes
after the gesture. The final frame holds without looping, with a masked
gloss sweep and halo around the closing logo. Hidden tabs and an offscreen
hero pause playback. The source film remains identified as AI-generated.

`tools/hero-qa.cjs` verifies layout at nine viewport sizes, navigation and
mobile-menu behaviour, reduced motion, idle playback, scroll takeover and
the closing-logo state against the generated site in Chromium.
