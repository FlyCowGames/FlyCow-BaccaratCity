# Current State

*Rewritten each session to reflect what exists now.*

## Last Updated: 2026-03-20 (Session 0)

## Scene Description
- Procedural 17x17 grid city (NOT real Macau geography)
- 289 building plots with 12 building types
- Dense but fictional layout
- Camera system is broken (cinematic conflicts with controls)

## Technical Stack
- Three.js 0.162.0 via CDN importmap
- Single HTML file (~198KB, ~5100 lines)
- PostProcessing: EffectComposer → RenderPass → UnrealBloomPass → OutputPass
- MeshToonMaterial for cel-shaded look

## What Works
- Building generation and placement
- Neon signs with bloom glow
- Day/night cycle (120s, starts at noon)
- Vehicle movement on road grid
- Pedestrian walking animation
- Baccarat table dealing animation
- Water/harbor on south side
- Light beams, fireworks (night), fountains, lanterns

## What's Broken
- Camera controls — stuck after cinematic sequence
- Cinematic camera replaces ortho with perspective but doesn't properly hand off controls

## What's Missing (vs Prime Directive)
- Real Macau geography (coastline, islands, bridges)
- Real landmarks
- Real time (UTC+8)
- Real weather
- Event system
- Working interactivity
- Audio
