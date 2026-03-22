# Kaizen Project Config: Baccarat City

## Identity
- **Project:** Baccarat City — living digital twin of Macau
- **URL:** https://baccaratcity.com
- **Aesthetic:** Dark, gold, cinematic. Macau luxury casino culture.

## Deployment
- **S3 Bucket:** baccaratcity-site
- **CloudFront ID:** E3V8V12C6EPFK6
- **Main file:** src/index.html (single-file CesiumJS app with Google 3D Tiles)
- **Audit interval:** 10

## Tech Stack
- CesiumJS + Google Photorealistic 3D Tiles (real Macau photogrammetry)
- Single HTML file with inline CSS/JS
- No build step, no dependencies beyond CDN

## Quality Check Details
- Wait **10 seconds** after opening for 3D tiles to load before checking errors
- Desktop check: verify 3D scene renders, UI visible, no black screen, no oversaturation
- Mobile check: verify scene loads (WebGL works), controls are touch-friendly

## Domain Categories
`rendering|atmosphere|animation|landmarks|events|interactivity|audio|infrastructure`

---

## Project-Specific Rules

### Landmark Accuracy
- **Grand Lisboa is the hero landmark.** It MUST be visible and prominent in the initial camera view when the site loads. The opening shot should frame the Grand Lisboa tower.
- Grand Lisboa real coordinates: **22.1893N, 113.5399E**. All markers, glow effects, beams, and labels for Grand Lisboa must use these coordinates.
- All landmark positions must match their real-world locations. Look up coordinates — don't guess. Inaccurate placement breaks the "digital twin" promise.
- Verify new landmarks against Google Maps before placing them.

### Interaction Rules
- **Any hotkey press or menu/attraction click MUST interrupt whatever sequence is running** (flythrough, tour, orbit). The user is in control. Use `stopFlythrough()` to cancel running sequences.
- Escape key should stop the flythrough/tour/orbit before closing overlays.
- Never block user actions because a sequence is running. Never `return` early from a handler just because `flythroughRunning` is true — cancel the sequence and proceed.

### Upcoming Features (see ROADMAP.md)
- **Street-level guided tour** — Curated walking tour at 5-10m altitude visiting landmarks sequentially, pausing at each to show photos/video. Different from free-roam street mode (G key). Think: travel documentary camera.
- **Landmark photo/video gallery** — Each landmark info card should include real photos (3-5 per landmark) from Wikimedia Commons or similar freely-licensed sources. Swipeable gallery on mobile. Embedded video where available.
