# Sheikh Zayed Road to SWK: media handoff

Status: integration ready; real footage has not been supplied. The default homepage retains its existing hero. No Google Earth imagery is included.

## Film delivery

Supply a commercially licensed, silent MP4 at `src/assets/video/swk-office-journey.mp4`, then run `python3 build.py`. The homepage automatically selects the film when that file exists. The browser scrubs its timeline with scrolling in both directions, retains the final frame, and falls back to a static hero on load failure. Reduced-motion and save-data users retain the existing fallback without loading the film.

Recommended edit: 12–18 seconds, 1920x1080 or higher, H.264, yuv420p, web faststart, frequent keyframes (roughly every 0.25 seconds) for responsive seeking. Keep important subjects in the center for mobile cropping. Prefer a separate portrait edit in a future delivery if cropping loses the tower.

Storyboard:
- 0–45%: oblique high aerial looking along Sheikh Zayed Road; actual moving traffic and metro captured together in the footage.
- 45–80%: controlled approach to the verified Al Saqr Business Tower exterior. Use a real reference to establish the correct building; do not substitute another tower.
- 80–100%: motivated cut or glass-reflection transition to the SWK office, ending on reception and signage. Use real office photos/video to establish its actual layout.

The supplied office image `src/assets/images/hero/swk-office-concept.webp` is an AI-generated proposed interior, not a photograph of SWK's actual office. It is intentionally not displayed as the real office on the public homepage. If used in an edited film, add an appropriate visualization disclosure to the film and update the visible credit in `39-hero-film.js`.

Generated with the built-in image tool. Prompt: photorealistic widescreen architectural interior concept for a compact SWK Properties high-rise office at the stated Sheikh Zayed Road location; eye-level 24mm camera entering reception, limestone and navy desk, champagne SWK PROPERTIES wall lettering, walnut and glass consultation room, property scale model, two navy client chairs, practical HVAC and door hardware, soft afternoon light; no people; proposed visualization rather than verified actual interior or exact tower view.

Google's Geo Guidelines prohibit Google Earth / Earth Studio imagery in promotional business content: https://about.google/brand-resource-center/products-and-services/geo-guidelines/

## Validation

Run `python3 build.py`, `node --check src/js/modules/39-hero-film.js`, and `python3 tools/check-static.py`. Full visual and seeking QA requires the final licensed film. Before publishing, check first/middle/final scroll positions and reverse scroll on desktop and mobile, missing/invalid video fallback, and reduced-motion/save-data behavior.
