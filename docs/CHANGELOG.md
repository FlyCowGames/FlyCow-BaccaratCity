# Changelog

## Session 0 — 2026-03-20 (Manual)
- Initial project setup
- Created procedural city with 17x17 grid, 12 building types
- Three.js engine with OrthographicCamera, MeshToonMaterial, UnrealBloomPass
- Day/night cycle (120s), vehicles (35), pedestrians (45)
- 8 baccarat tables with card dealing animation
- Cinematic camera system (broken — conflicts with core engine)
- Visual effects: water, light beams, fireworks, fountains, lanterns
- Interaction system: hover tooltips, click-to-zoom
- **Known issue:** Camera controls stuck/non-functional after cinematic

## Session 3 — 2026-03-20 (Automated Agent)
- Real-time Macau weather via Open-Meteo API (free, no key needed)
- Weather UI: temperature, conditions icon, humidity, wind, cloud cover (top-right, gold theme)
- Rain overlay: CSS animated rain drops with 3 intensities (light/moderate/heavy) based on WMO weather codes
- Fog effect: CesiumJS scene fog enabled for fog/rime fog weather codes or heavy cloud cover
- Cloud dimming: sun light intensity reduced proportionally to cloud cover percentage
- WMO weather code mapping with day/night-aware icons
- Weather auto-refreshes every 15 minutes
- Updated subtitle to include "Live Weather"
- File grew from ~670 to ~850 lines

## Session 4 — 2026-03-20 (Automated Agent)
- Animated ferry boats: 5 ferries across 2 routes (Outer Harbour-Taipa, Inner Harbour-Taipa)
- Real Macau terminal coordinates for route waypoints
- CesiumJS CallbackProperty for smooth per-frame position updates
- Ping-pong animation: ferries travel forward then reverse at terminals
- Staggered phase offsets so ferries are spread across routes (always visible movement)
- Gold-themed boat billboard icons (canvas-drawn hull, cabin, smokestack)
- Scale/translucency by distance for clean appearance at all zoom levels
- Updated subtitle to "Living City"
- File grew from ~850 to ~967 lines
- First animated "life" in the digital twin — city is no longer static

## Session 6 — 2026-03-20 (Automated Agent)
- Neon casino glow system: 11 glow zones across Cotai Strip, Peninsula, and waterfront
- CesiumJS bloom post-processing (built-in `postProcessStages.bloom`) enabled at night
- Canvas radial gradient billboards as neon light sources (64px low + 96px high altitude)
- Time-of-day modulation: full glow 19:00-05:00, ramp at dusk/dawn, off during day
- Bloom parameters dynamically adjust with glow intensity (brightness, delta, sigma)
- Major casinos (intensity >= 0.85) get secondary high-altitude glow visible from afar
- Color-coded zones: gold for most casinos, purple for City of Dreams, warm amber for waterfront
- UI indicator shows "Casino Neon X%" in top-left during glow hours
- Updated subtitle to "Neon City"
- File grew from ~967 to ~1135 lines

## Session 7 — 2026-03-20 (Automated Agent)
- Animated road traffic: 19 vehicles on 5 routes across Macau
- Routes: Ponte de Amizade, Ponte de Sai Van, Ponte Gov. Nobre de Carvalho, Cotai Strip Boulevard, Avenida da Praia Grande
- Reuses ferry CallbackProperty ping-pong pattern for per-frame animation
- Canvas radial gradient car icons (12px glowing dots) at road level (5m altitude)
- Scale/translucency by distance, fade out at 8km
- Bridge Traffic entry in Explore panel with "live" badge
- Updated subtitle to "Live Traffic"
- File grew from ~1399 to ~1531 lines

## Pre-Session Notes
- Current code is at /tmp/nxt49/baccarat-city.html (198KB, 5098 lines)
- Also deployed to s3://nxt49-ca-site/baccarat-city.html
- Needs migration to baccaratcity.com
- Fictional grid layout must be replaced with real Macau geography
