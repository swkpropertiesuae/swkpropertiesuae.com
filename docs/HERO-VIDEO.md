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
patch outside the viewport, so the signature is hidden on portrait phone and tablet layouts below 1024px.

Regenerate with `bash tools/master-hero.sh /path/to/original-hero.mp4`.
Use the original clip, not this edit, to avoid cumulative compression.

## 4K and idle playback

`bash tools/upscale-hero.sh /path/to/original-hero.mp4` creates a separate
3840 × 2160 Lanczos upscale, with a 28 Mbps bitrate ceiling. It increases
delivery resolution, but does not recover native 4K camera detail. Displays
with viewport width × pixel ratio of at least 2560 receive that encode;
other visitors retain 1080p. Data-saver and reduced-motion users keep the poster.

After 700 ms without scrolling, a separate muted road layer loops only the
first 1.05 seconds at 0.65× speed. That segment contains road traffic before
the camera turns toward the tower. Its restart blends through the matching
poster. The opening headline stays visible. The aerial/interior film remains
paused and is controlled exclusively by scrolling. At the closing logo chapter,
idle road playback stays off and the glossy finale holds. Hidden tabs and an
offscreen hero pause motion. Reduced-motion and data-saver visitors keep the poster.
The film remains identified as AI-generated; this edit does not add new footage.

`tools/hero-qa.cjs` verifies layout at nine viewport sizes, navigation and
mobile-menu behaviour, reduced motion, idle playback, scroll takeover and
the closing-logo state against the generated site in Chromium.

## Desktop idle loop

`bash tools/idle-hero.sh /path/to/idle-clip.mp4` builds `hero-idle.mp4` (1080p, about 9 Mbps) and
`hero-idle-4k.mp4` (3840 × 2160, about 17 Mbps) from the supplied 10 s clip, removes the Gemini sparkle
with `delogo`, drops the audio track and rewrites `hero-idle-poster.webp` from the first frame. Displays
with viewport width × pixel ratio of at least 2560 load the 4K file. It is a Lanczos upscale of a 1080p source, not
native 4K or 8K detail. Both files stay under the 25 MiB static-asset cap.

## Twilight theme

`src/css/twilight.css` loads last and restyles every page: midnight navy and charcoal surfaces, ivory text,
champagne hairlines, Raleway (headlines, navigation, buttons), Montserrat Light (body) and Bodoni Moda
(numerals, quotes). The legacy `Clash Display`, `General Sans` and `Instrument Serif` families are re-pointed at
those faces, so older rules resolve to the new type. The logo set comes from `tools/make-gold-logo.py` (white with a
champagne cast). The cinematic grade on the films and photography is a CSS filter plus gradient veil; the video files
themselves are not regraded.
