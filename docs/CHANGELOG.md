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

## Session 8 — 2026-03-20 (Automated Agent)
- Airport approach & departure flights: 4 planes on 2 routes over Macau International Airport
- Routes: Approach South (descending 450m→15m over water), Departure North (climbing 15m→700m over peninsula)
- Altitude-interpolated `lerpPositionWithAlt()` for 3D flight paths (unlike flat ferry/car paths)
- One-way looping animation (not ping-pong — planes fly one direction and loop)
- 20px white-gold glow billboard icons with bright core, visible at distance
- Airport Flights entry in Explore panel with "live" badge
- Updated subtitle to "Live Traffic & Flights"
- File grew from ~1531 to ~1631 lines

## Session 9 — 2026-03-20 (Automated Agent)
- Ambient audio soundscape using Web Audio API (no external files)
- 3 procedural sound layers: ocean waves (LFO-modulated filtered noise), wind (bandpass noise with gusts), city hum (60/120Hz + shimmer)
- Time-of-day variation: louder city during day, more ocean at night
- Weather-reactive: wind volume scales with real wind speed, rain boosts noise
- Smooth 2-second gain ramps for transitions between mixes
- Mute/unmute toggle button in bottom-left UI (starts muted, respects browser autoplay policy)
- Updated subtitle to include "Ambient Sound"
- File grew from ~1631 to ~1842 lines

## Session 10 — 2026-03-20 (Automated Agent)
- Landmark info cards: click any landmark (3D billboard or Explore panel) to see a rich info popup
- 8 landmarks enriched with descriptions, historical facts, type, and year data
- Info card UI: dark/gold theme, emoji + name + Chinese, meta tags (type/year), description, diamond-bulleted facts
- Dismiss via close button, backdrop click, or Escape key
- Explore panel landmarks and casinos also trigger info cards via name matching
- Updated hint text: "click landmark for info"
- File grew from ~1842 to ~2027 lines

## Session 11 — 2026-03-20 (Automated Agent)
- Interactive baccarat table: click any casino landmark → "Enter Casino" button → full baccarat game
- Proper Punto Banco rules: 8-deck shoe, natural wins, third-card drawing rules for both Player and Banker
- Animated card dealing: face-down deal sequence → reveal → third card → result announcement
- Green felt table UI with gold border, classic rounded-top baccarat table shape
- Player (blue) vs Banker (red) color coding for hands, scores, and results
- Session stats tracking (Player/Banker/Tie win counts)
- "Enter Casino" button appears only on casino/resort landmark info cards (not heritage sites)
- 6 casino landmarks trigger baccarat: Grand Lisboa, Venetian, Galaxy, Wynn Palace, City of Dreams
- Updated subtitle to "Live Baccarat"
- Updated hints: "enter casino to play baccarat"
- File grew from ~2027 to ~2448 lines

## Session 13 — 2026-03-20 (Automated Agent)
- Harbor fireworks display: particle-based firework system over the harbor during night hours
- Canvas 2D overlay with full particle physics (rockets launch, burst into 60-100 particles)
- 6 color palettes: gold, red, purple, gold+red, amber, gold+purple (matching brand aesthetic)
- 3 burst types: spherical, ring, and willow (trailing) with gravity and sparkle effects
- Active 20:00-01:00 Macau time, launches every 4-10 seconds with occasional rapid multi-rocket salvos
- Rocket trail animation with gold particles rising from bottom of screen
- Particle fade, gravity, air resistance, and twinkle effects for realism
- Updated subtitle to include "Harbor Fireworks"
- File grew from ~2448 to ~2625 lines (+177 lines)

## Session 15 — 2026-03-21 (Automated Agent)
- Animated pedestrians: ~26 walking figures near 6 popular areas of Macau
- Zones: Senado Square, Ruins of St. Paul's, Grand Lisboa, Cotai Strip Promenade, A-Ma Temple, Macau Tower Waterfront
- Reuses proven CallbackProperty ping-pong pattern from ferries/traffic
- 8px warm-toned radial gradient billboard icons at 2m altitude (street level)
- Variable walking speeds (15-40s per path) with random phase offsets for natural staggering
- Only visible when zoomed in (translucencyByDistance fades out at 4km)
- Fulfills Prime Directive: "People walk" — first item under "Living & Breathing"
- File grew from ~2625 to ~2740 lines (+115 lines)

## Session 16 — 2026-03-21 (Automated Agent)
- Animated construction cranes: 5 crane sites at active development areas across Macau
- Static crane tower billboards (canvas-drawn lattice structure with red warning light)
- Orbiting warning light entities (red-amber glow) circling each crane top via CallbackProperty
- Crane sites: Zone A New Town, Cotai East Development, Studio City Phase 2, Taipa Waterfront, Peninsula Inner Harbour
- Variable rotation speeds (42-55 seconds per revolution) and arm radii for natural variation
- "Development" section added to Explore panel with 3 clickable sites and "live" badges
- Fulfills Prime Directive: "construction cranes move"
- File grew from ~2740 to ~2880 lines (+140 lines)

## Pre-Session Notes
- Current code is at /tmp/nxt49/baccarat-city.html (198KB, 5098 lines)
- Also deployed to s3://nxt49-ca-site/baccarat-city.html
- Needs migration to baccaratcity.com
- Fictional grid layout must be replaced with real Macau geography
