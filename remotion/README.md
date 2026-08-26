# WeddingSite3 — Remotion Reels

Vertical cinematic showcase based on the visual language and content of `WeddingSite3`.

## Composition

- ID: `WeddingReels`
- 1080×1920
- 30 fps
- 600 frames / 20 seconds

## Scene map

| Frames | Duration | Scene | Purpose |
|---|---:|---|---|
| 0–149 | 5s | Hero | Names, date, cinematic photo reveal |
| 150–224 | 2.5s | Quote | Brand statement / emotional pause |
| 225–359 | 4.5s | Story | Couple story with image parallax |
| 360–509 | 5s | Timeline | Wedding schedule with progressive line |
| 510–569 | 2s | Details | Dress-code palette + venue |
| 570–599 | 1s | Final | CTA |

## Run

```bash
cd remotion
npm install
npm start
```

Render only when needed:

```bash
npm run build
```

Animations are frame-driven with Remotion `useCurrentFrame()`, `interpolate()`, `spring()` and easing functions; no CSS animation/transition is used for motion.
