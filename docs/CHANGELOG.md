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

## Session 17 — 2026-03-21 (Automated Agent)
- Harbor water shimmer: ~23 animated light reflection points on water surfaces around Macau
- Shimmer points placed across Inner Harbour, Outer Harbour, Nam Van Lake, bridge area, Cotai waterfront, Taipa, Coloane
- Canvas radial gradient billboard icons (10px) at water level (2m altitude)
- Animated scale via CallbackProperty with sine-wave oscillation — each point has random phase and speed for independent twinkling
- Time-of-day intensity: subtle during day (30% — sun sparkle), bright at night (100% — casino reflections) tied to neon glow system
- Visible when zoomed in (translucencyByDistance fades at 10km)
- No new UI elements — purely visual atmosphere enhancement
- File grew from ~2880 to ~2978 lines (+98 lines)

## Session 18 — 2026-03-21 (Automated Agent)
- Casino sky beams: 5 vertical light beams from major casinos at night
- Canvas-drawn tapered beam billboards with bright core gradient
- Gentle sway animation via CallbackProperty (oscillating position)
- Visibility tied to neon glow intensity — appears/disappears with casino neon system
- Casinos: Grand Lisboa, Venetian, Galaxy, Wynn Palace, City of Dreams
- File grew from ~2978 to ~3073 lines (+95 lines)

## Session 19 — 2026-03-21 (Automated Agent)
- Wynn Palace Performance Lake fountain show: choreographed water jet animation
- 13 fountain jets (12 in semicircular arc + 1 center feature jet up to 90m)
- Choreographed height patterns: crescendo/diminuendo envelope with wave and pulse modulation
- 3-minute shows with 15-minute pauses, active at night (tied to neon glow system)
- 6 color palettes cycling per show: cool white-blue, gold, red, blue, warm amber, purple
- 5 mist/spray entities at fountain base for atmospheric effect
- "Shows" section added to Explore panel with Wynn Performance Lake entry
- File grew from ~3073 to ~3321 lines (+248 lines)

## Session 21 — 2026-03-21 (Automated Agent)
- Guia Circuit race cars: 5 animated F3 cars racing the iconic 6.2km street circuit around Macau Peninsula
- 15 waypoints tracing the real Guia Circuit: Start/Finish, Mandarin Bend, San Francisco Hill, Guia Fortress, Lisboa Bend, Melco Hairpin, R Bend
- 5 distinct car colors (red, blue, yellow, green, orange) with bright white-core 16px billboard icons
- One-way looping animation (not ping-pong — race cars always go forward around the circuit)
- Higher speed than regular traffic (18s per lap vs 20-28s for road traffic)
- Racing section added to Explore panel with "live" badge
- Fulfills near-term roadmap item: "Guia Circuit road path for F3 event"
- File grew from ~3321 to ~3422 lines (+101 lines)

## Session 22 — 2026-03-21 (Automated Agent)
- Traditional Chinese junk boats: 4 red-sailed junks cruising 3 harbour routes
- Routes: Inner Harbour, Outer Harbour, A-Ma Temple coastline
- Distinctive 32px canvas icon with red batten sails, wooden hull, fore and main sails
- Slow stately movement (85-100s per route) contrasting with fast modern ferries (50-55s)
- Ping-pong animation with staggered phases, reuses proven CallbackProperty pattern
- Heritage Junks entry added to Explore panel "On the Water" section with "live" badge
- File grew from ~3422 to ~3542 lines (+120 lines)

## Session 24 — 2026-03-21 (Automated Agent)
- Geographic district labels: 8 floating bilingual labels over major areas of Macau
- Districts: Macau Peninsula, Taipa, Cotai Strip, Coloane, Inner Harbour, Outer Harbour, Nam Van Lake, Airport
- Canvas-rendered billboard entities with bold gold English name, decorative underline, Chinese subtitle
- Visible from overview/bird's eye (translucencyByDistance: invisible < 600m, fully visible > 2500m)
- CesiumJS Label entities crash with Google 3D Tiles (RangeError: Invalid array length) — billboard canvas approach works
- File grew from ~3575 to ~3641 lines (+66 lines)

## Session 26 — 2026-03-21 (Automated Agent)
- Guia Lighthouse rotating beam: animated lighthouse at Guia Hill summit — oldest lighthouse on China coast (1865)
- Static lighthouse tower billboard entity (white tower, red dome, lantern room glow) at Guia Hill summit (108m)
- Rotating beam billboard entity sweeping 360° via CallbackProperty (8s rotation period)
- Horizontal tapered beam icon (256x16px canvas) with bright-to-transparent gradient
- Night-only visibility tied to neon glow system (_currentGlowIntensity > 0.1)
- Heritage section added to Explore panel with Guia Lighthouse entry and "live" badge
- File grew from ~3641 to ~3778 lines (+137 lines)

## Session 27 — 2026-03-21 (Automated Agent)
- Macau LRT (Light Rapid Transit): 3 animated trains on the real Taipa Line route
- Route follows the actual LRT path: Ocean Station (Galaxy) → Lotus → East Asian Games → Cotai East → Pai Kok → Airport → Taipa Ferry Terminal
- Distinctive 20px green canvas train icons with windows, headlight, and glow halo
- One-way loop animation at 15m altitude (elevated viaduct), 2-minute circuit time
- Transit section added to Explore panel with Macau LRT entry and "live" badge
- 8th entity animation system using proven CallbackProperty pattern
- File grew from ~3778 to ~3907 lines (+129 lines)

## Session 29 — 2026-03-21 (Automated Agent)
- Bridge night illumination: decorative LED-style light points along Macau's 3 iconic bridges
- 50 light points total: 18 on Ponte de Amizade (cool blue-white), 16 on Ponte de Sai Van (warm gold), 16 on Ponte Gov. Nobre de Carvalho (neutral white)
- Night-only visibility tied to neon glow system (_currentGlowIntensity), with gentle pulse animation
- Each bridge has a distinct color matching real-world bridge LED schemes
- Bridges section added to Explore panel with 3 entries (Ponte de Amizade, Ponte de Sai Van, Ponte Gov. Nobre de Carvalho) with bilingual names and "live" badges
- File grew from ~3907 to ~4046 lines (+139 lines)

## Session 31 — 2026-03-21 (Automated Agent)
- Time-of-day slider: interactive range slider in bottom-right clock area for previewing any hour
- Users can slide between 0h-24h (15-minute increments) to see day, sunset, night, dawn
- Overrides `getMacauHour()` so all time-gated features respond: neon glow, fireworks, bridge lights, lighthouse, sky beams, fountain shows
- Updates CesiumJS `viewer.clock.currentTime` for accurate sun/moon position and scene lighting
- LIVE button returns to real Macau time with animated clock
- Clock label shows "Preview" when time override is active vs "Macau Time (UTC+8)" when live
- Solves the problem of daytime visitors never seeing night-only features (~60% of content)
- File grew from ~4046 to ~4141 lines (+95 lines)

## Session 32 — 2026-03-21 (Automated Agent)
- Floating sky lanterns (kongming lanterns): 12 animated lanterns drifting over the Inner Harbour at night
- Canvas-drawn lantern icon (28px) with warm orange/gold paper balloon shape, inner flame glow, and outer halo
- CallbackProperty-driven ascent animation: lanterns rise 30m to 220m with quadratic ease-out, gentle horizontal drift, and wobble
- Night-only visibility tied to neon glow system (_currentGlowIntensity), with fade-in at launch and fade-out at peak
- Gentle flicker animation simulates the flame inside each lantern
- Each lantern has random phase, drift direction, rise duration (45-75s), and wobble pattern for natural variation
- Sky Lanterns entry added to Heritage section of Explore panel with "live" badge
- Cultural feature: kongming lanterns are traditional Chinese sky lanterns released during festivals for good fortune
- File grew from ~4188 to ~4313 lines (+125 lines)

## Session 33 — 2026-03-21 (Automated Agent)
- Macau helicopter service: 3 helicopter entities on 3 routes over the peninsula
- Routes: HK Shuttle Outbound (helipad → east toward Hong Kong), HK Shuttle Inbound (reverse), Scenic Tour (circular loop over peninsula landmarks)
- Heliport at Outer Harbour Terminal — real location of the Macau-Hong Kong helicopter shuttle service
- Canvas-drawn 24px helicopter icon with fuselage, cockpit, main rotor disc, tail boom, and position lights
- One-way loop animation at 200-350m altitude using proven lerpPositionWithAlt and CallbackProperty pattern
- Helicopter Service entry added to Transit section of Explore panel with "live" badge
- File grew from ~4313 to ~4469 lines (+156 lines)

## Session 34 — 2026-03-21 (Automated Agent)
- Auto-tour mode: TOUR button that automatically flies camera through all 30+ attractions
- Randomized visit order with Fisher-Yates shuffle, reshuffles each full cycle
- 4-second camera flight transitions with varied heading angles for cinematic variety
- 6-second dwell time at each location before moving to next
- Bilingual location label (English name + Chinese) displayed during each stop
- Button toggles between "Tour" (start) and "Stop Tour" (active gold state)
- Tour stops automatically on user interaction (left-click drag, scroll zoom, right-click)
- Replay Flythrough and Tour buttons positioned side by side at bottom center
- Meta-feature: makes all existing attractions discoverable without manual Explore panel navigation
- File grew from ~4469 to ~4569 lines (+100 lines)

## Session 36 — 2026-03-21 (Automated Agent)
- Dragon boat racing on Nam Van Lake: 5 dragon boats racing in parallel lanes
- 5 team colors: red, blue, green, gold, purple — each with distinctive canvas-drawn dragon boat icon (36x20px)
- Dragon head at bow, dragon tail at stern, team color stripe, and 6 paddler dots per boat
- Parallel racing lanes across Nam Van Lake with varied durations (22-26s) creating natural overtaking
- Ping-pong animation with staggered timing using proven CallbackProperty pattern
- Dragon Boat Racing entry added to "On the Water" section of Explore panel with "live" badge
- 11th entity animation system — adds life to the previously underutilized Nam Van Lake area
- Fulfills Events backlog item: "Dragon Boat Festival — races in Nam Van Lake"
- File grew from ~4624 to ~4786 lines (+162 lines)

## Session 37 — 2026-03-21 (Automated Agent)
- Venetian canal gondola rides: 3 gondola entities gliding along canals near The Venetian Macao
- Canvas-drawn 28x16px gondola icon with black hull, gold ferro prow ornament, red-shirted gondolier with oar, and seated passenger
- 3 canal routes around The Venetian's outdoor lagoon area with staggered phase offsets
- Slow stately ping-pong animation (65-75s per route) matching real gondola pace — much slower than ferries or dragon boats
- Venetian Gondolas entry added to Shows section of Explore panel with "live" badge
- 12th entity animation system using proven CallbackProperty pattern
- Adds iconic tourist experience to the world's largest casino by floor area
- File grew from ~4786 to ~4902 lines (+116 lines)

## Session 38 — 2026-03-21 (Automated Agent)
- Red lantern strings in historic district: 10 lantern string billboards across 4 historic areas of Macau
- Canvas-drawn lantern icons (64x32px) with 5-6 red lanterns on a catenary wire, gold ribs/tassels, warm inner glow
- Locations: Senado Square (3), Ruins of St. Paul's approach (3), A-Ma Temple district (2), Rua do Cunha Taipa Village (2)
- Gentle wind sway animation via CallbackProperty scale oscillation with random phase/speed per string
- Night brightness boost tied to _currentGlowIntensity — lanterns glow brighter at night
- Each string has a rotation angle matching street orientation for natural placement
- Red Lanterns entry added to Heritage section of Explore panel with "live" badge
- 13th entity system using proven billboard + CallbackProperty pattern
- Visible at medium zoom (translucencyByDistance 100m-5km) — between street-level and overview features
- File grew from ~4902 to ~5036 lines (+134 lines)

## Session 39 — 2026-03-21 (Automated Agent)
- Macau Tower SkyJump/Bungy animation: 2 animated jumpers leaping from the 233m observation deck
- Bungy physics simulation: free fall with quadratic acceleration, 3 damped bounces (70%, 40%, 15% rebound), winch-back up
- 12-second jump cycle + 8-second pause at top between jumps, 2 jumpers with staggered phases
- Canvas-drawn 16x24px jumper icon with bright yellow-gold radial gradient glow and bungy cord line
- Fade-in at jump start, fade-out during winch-back to prevent visual pop on reset
- Tower SkyJump entry added to Shows section of Explore panel with "live" badge
- 14th entity animation system using CallbackProperty — first with multi-bounce vertical physics
- File grew from ~5036 to ~5161 lines (+125 lines)

## Pre-Session Notes
- Current code is at /tmp/nxt49/baccarat-city.html (198KB, 5098 lines)
- Also deployed to s3://nxt49-ca-site/baccarat-city.html
- Needs migration to baccaratcity.com
- Fictional grid layout must be replaced with real Macau geography
