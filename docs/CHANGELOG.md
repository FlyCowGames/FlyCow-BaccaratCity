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

## Session 41 — 2026-03-21 (Automated Agent)
- Cotai Strip LED facade screens: 5 animated color-cycling LED displays on major Cotai Strip casino buildings
- Casinos: Venetian, Galaxy, City of Dreams, MGM Cotai, Studio City
- Canvas-drawn 96x48px LED grid pattern (12x6 cells) with hue-shifting color waves
- Color cycling updates every 500ms for smooth animation without per-frame overhead
- Night-only visibility tied to _currentGlowIntensity (neon glow system)
- Cotai LED Facades entry added to Shows section of Explore panel
- 15th entity animation system using CallbackProperty for scale + canvas image cycling
- File grew from ~5161 to ~5248 lines (+87 lines)

## Session 43 — 2026-03-21 (Automated Agent)
- Harbor seagulls: 18 animated seabird entities circling in 4 flocks over Macau's coastal areas
- Flock locations: Inner Harbour (5 birds), Outer Harbour (4), Nam Van Lake (4), Taipa waterfront (5)
- Canvas-drawn 20x12px white seagull silhouette icon with M-shaped wings-spread pose and body dot
- Circular orbiting animation via CallbackProperty with per-bird speed variation, orbit radius variation, and figure-eight wobble overlay
- Gentle vertical bob animation (8m amplitude) simulates thermal soaring
- Billboard rotation follows flight direction (tangent to orbit) for natural heading appearance
- Always active (not time-gated) — birds fly day and night, unlike most recent features
- Wildlife section added to Explore panel with Harbor Seagulls entry and "live" badge
- 16th entity animation system — fills the visual gap between ground-level entities and high-altitude aircraft
- File grew from ~5248 to ~5349 lines (+101 lines)

## Session 44 — 2026-03-21 (Automated Agent)
- Casino rooftop searchlights: 6 sweeping searchlight beams from major casino rooftops at night
- Casinos: Grand Lisboa, Venetian, Galaxy, Wynn Palace, MGM Cotai, Studio City
- Canvas-drawn 320x20px tapered beam icon with bright white core at source, colored gradient fading to transparent tip
- Sweeping arc animation via CallbackProperty — beams oscillate back and forth (not full rotation) with varied periods (10-15s) and sweep amplitudes
- Each searchlight has a distinct color (warm white, purple-white, gold, peach, cool blue, pink) for visual variety
- Night-only visibility tied to neon glow system (_currentGlowIntensity > 0.15)
- Casino Searchlights entry added to Shows section of Explore panel
- 17th entity animation system — reuses lighthouse rotating beam pattern with oscillating sweep variant
- File grew from ~5349 to ~5442 lines (+93 lines)

## Session 45 — 2026-03-21 (Automated Agent)
- Galaxy Macau rooftop wave pool: 7 animated wave entities on the Galaxy resort's Grand Resort Deck
- Canvas-drawn 64x32px elliptical pool icon with turquoise gradient water, white wave crests, and sparkle highlights
- Wave crest animation updates every 400ms via setInterval canvas regeneration (same hybrid approach as LED facades)
- Gentle scale pulse via CallbackProperty simulates wave swells (0.9-1.1x oscillation)
- 7 wave points cover the pool area and lazy river sections of the rooftop at 55m altitude
- Always active (not night-only) — one of the few daytime features, filling the gap where ~60% of content is night-only
- Galaxy Wave Pool entry added to Shows section of Explore panel
- 18th entity animation system using hybrid CallbackProperty + setInterval approach
- File grew from ~5442 to ~5543 lines (+101 lines)

## Session 46 — 2026-03-22 (Automated Agent)
- A-Ma Temple incense coils: 6 hanging spiral incense coils at A-Ma Temple with rising smoke wisps
- Canvas-drawn 32x40px spiral coil icon with brown concentric rings, red prayer tag, amber ember glow at burning tip
- 6 rising smoke wisp entities using ascending CallbackProperty animation (20-35s rise cycle, quadratic ease-out)
- Smoke wisps fade in at launch, expand gradually while rising, and fade out at peak before recycling
- Canvas smoke icons regenerated every 500ms with horizontal drift animation (same hybrid pattern as LED facades/wave pool)
- Gentle sway animation on coils via scale CallbackProperty simulates temple breeze
- Temple Incense entry added to Heritage section of Explore panel with "live" badge
- 19th entity animation system using hybrid CallbackProperty + setInterval approach
- Always active (not night-gated) — cultural/atmospheric feature visible during daytime
- File grew from ~5543 to ~5714 lines (+171 lines)

## Session 48 — 2026-03-22 (Automated Agent)
- Camera position URL sharing: Share View button copies a URL that encodes current camera position
- URL hash format: `#v=lon,lat,alt,heading,pitch` (e.g. `#v=113.55000,22.16500,1600,211,-30`)
- Debounced URL hash updates on camera movement (500ms debounce, 1% position change threshold)
- Clicking Share View copies full URL to clipboard with gold toast notification ("Link copied to clipboard")
- Visiting a shared URL skips the cinematic flythrough and flies directly to the encoded position (2s flight)
- Sanity checks: validates lon/lat within Macau bounds, altitude 0-50000m, rejects malformed hashes
- Share button visibility managed alongside Replay/Tour (hidden during flythrough/tour, shown after)
- Hint text updated: "share your view"
- First UX/interactivity improvement since Session 34 (auto-tour) — breaks streak of billboard entity features
- File grew from ~5714 to ~5857 lines (+143 lines)

## Session 49 — 2026-03-22 (Automated Agent)
- Minimap navigation overlay: canvas-drawn minimap in bottom-left corner for spatial orientation
- Simplified Macau coastline outlines (Peninsula, Taipa/Cotai, Coloane) with gold border on dark background
- Three bridge lines connecting Peninsula to Taipa, matching real bridge positions
- Gold dots marking all 8 landmark positions for reference
- Camera position shown as bright gold dot with heading direction line and subtle FOV cone
- Click-to-fly: click anywhere on minimap to fly camera to that geographic location (800m altitude, 1.5s flight)
- Real-time tracking: minimap updates every 500ms to follow camera movement
- Hidden during cinematic flythrough, fades in after completion (same visibility pattern as Replay/Tour/Share)
- 2nd interactivity/UI feature in a row (after URL sharing in Session 48) — breaks the billboard entity pattern
- File grew from ~5857 to ~6090 lines (+233 lines)

## Session 51 — 2026-03-22 (Automated Agent)
- Explore panel search: real-time search/filter input at top of Explore panel
- Search input with gold-themed styling, placeholder "Search landmarks...", and clear (×) button
- Filters all 30+ attraction items by name or Chinese text as user types
- Sections with no matching items are hidden; sections with matches auto-expand from collapsed state
- Mobile-responsive: smaller font/padding at 600px breakpoint
- 4th UX/interactivity improvement in a row (after time slider S31, auto-tour S34, URL sharing S48, minimap S49)
- Fulfills IDEAS backlog item: "Search for landmarks"
- File grew from ~6204 to ~6249 lines (+45 lines)

## Session 53 — 2026-03-22 (Automated Agent)
- Keyboard shortcuts + help overlay: full keyboard navigation system with styled help panel
- Press `?` to toggle help overlay showing all shortcuts in dark/gold themed card
- Keys `1-8` fly directly to each of the 8 landmarks with info card popup on arrival
- `N` = night preview (22:00), `D` = day preview (12:00), `L` = return to live Macau time
- `T` = toggle auto-tour, `E` = toggle explore panel, `F` = replay flythrough
- `S` = share current view (copies URL), `M` = toggle sound on/off
- `Escape` closes help overlay, landmark cards, and baccarat overlay
- Input-aware: shortcuts disabled when typing in search field or other text inputs
- Help overlay is mobile-responsive with smaller text at 600px breakpoint
- Updated hint text to mention keyboard shortcuts (`press ? for keyboard shortcuts`)
- 5th UX/meta-feature (after time slider S31, auto-tour S34, URL sharing S48, minimap S49, search S51)
- File grew from ~6249 to ~6414 lines (+165 lines)

## Session 54 — 2026-03-22 (Automated Agent)
- Baccarat betting system: full betting with virtual HK$ bankroll transforms passive card-viewing into real gameplay
- Virtual HK$10,000 starting bankroll displayed prominently above the baccarat table
- Three bet areas: Player (1:1 payout), Tie (8:1 payout), Banker (0.95:1 with 5% commission)
- Five chip denominations: $100 (blue), $500 (red), $1K (green), $5K (black), $10K (gold) with visual selection
- Click bet areas to place chips from selected denomination; Clear button to reset all bets
- Deal button requires a bet to be placed first (disabled until bet exists)
- Payout display shows green "+HK$X" for wins, red "-HK$X" for losses with bankroll flash animation
- Tie pushes Player/Banker bets back to bankroll (authentic Punto Banco rules)
- Bankrupt state shows "New Bankroll" reset button when balance hits zero
- Mobile-responsive betting UI with smaller chips and bet areas at 600px breakpoint
- Directly serves Prime Directive #8: "Baccarat is the Soul" — transforms the signature feature from viewing into playing
- File grew from ~6414 to ~6769 lines (+355 lines)

## Session 55 — 2026-03-22 (Automated Agent)
- Wynn Palace SkyCab cable cars: 4 animated cable car gondolas traveling over the Performance Lake
- Canvas-drawn 24x28px gondola icon with cable line, hanger arm, gold cabin body, roof, 3 windows, bottom edge
- 5 waypoints over the lake with altitude arc (38m → 45m → 38m) simulating the real cable trajectory
- Ping-pong animation with staggered phases (0.00, 0.25, 0.50, 0.75) for even distribution along the route
- Gentle sway animation via rotation CallbackProperty simulates wind/cable movement
- SkyCab entry added to Shows section of Explore panel with bilingual name (永利觀光纜車)
- 20th entity animation system using proven CallbackProperty + lerpPositionWithAlt pattern
- Complements existing Wynn Performance Lake fountain show (Session 19) — cable cars pass over the fountain area
- File grew from ~6769 to ~6900 lines (+131 lines)

## Session 56 — 2026-03-22 (Automated Agent)
- Event notification banner: visible red/gold gradient banner at top of screen showing current/upcoming Macau festivals
- 7 real Macau events with 2026 dates: Chinese New Year, Ching Ming, Dragon Boat, Fireworks Contest, Mid-Autumn, Grand Prix, Light Festival
- Banner shows event icon, name (English + Chinese), and countdown status ("HAPPENING NOW" or "IN X DAYS")
- Clickable banner flies camera to event location; dismissable with × button
- Enhanced fireworks during firework events: 2-4x launch frequency, extended hours (afternoon 14-16h + evening 19-02h)
- Global `_activeEvent` state allows all visual systems to respond to active festivals
- Events auto-refresh every 5 minutes; 30-day lookahead for upcoming events
- Mobile-responsive: smaller text, hidden Chinese at 600px breakpoint
- Updated subtitle to "Live Events"
- File grew from ~6900 to ~7035 lines (+134 lines)

## Session 57 — 2026-03-22 (Automated Agent)
- Casino water reflections: 10 elongated vertical light streaks on harbor water below waterfront casinos at night
- Reflection positions: Grand Lisboa bay, Wynn Macau, NAPE waterfront, Fisherman's Wharf, Nam Van Lake, Outer Harbour
- Canvas-drawn vertical streak icons (12x64-192px) with bright core gradient matching nearby casino colors
- Night-only visibility tied to `_currentGlowIntensity` with shimmer and wobble animation via CallbackProperty
- `verticalOrigin: TOP` makes streaks extend downward from water surface for natural reflection appearance
- Harbor Reflections entry added to Shows section of Explore panel with bilingual name (海港倒影)
- 21st entity animation system using proven CallbackProperty pattern
- Enhances nighttime harbor atmosphere — creates classic "city lights mirrored in water" effect
- File grew from ~7035 to ~7124 lines (+89 lines)

## Session 58 — 2026-03-22 (Automated Agent)
- Baccarat sound effects: 6 procedural sound types via Web Audio API for the baccarat game
- Sounds: deal (papery noise burst), flip (high-pitched snap), chip (metallic clink with harmonic), win (ascending two-tone chime), lose (descending tone), tie (neutral double-tap)
- 13 sound trigger points: chip placement on bet, 4 face-down card deals, 2 initial card reveals, up to 3 third-card draws, and 1 result announcement
- Context-aware result sounds: win chime plays only if user bet on the winning side; lose tone otherwise
- Uses existing `_audioCtx` from Session 9's ambient audio system — requires sound to be enabled via toggle button
- All sounds procedurally generated using oscillators and noise buffers — no external audio files
- Directly enhances Prime Directive #8 ("Baccarat is the Soul") — transforms signature feature from visual-only to multi-sensory
- File grew from ~7124 to ~7204 lines (+80 lines)

## Session 60 — 2026-03-22 (Automated Agent) — QUALITY AUDIT
- Full quality audit session (60 % 10 == 0) — first completed audit (sessions 40, 50 were skipped)
- Screenshotted from multiple angles: overview, harbor, Cotai, casino district, night mode, mobile
- Found critical visual defects: large black rectangles from LED facades and oversized searchlight beams
- Root cause: CesiumJS CallbackProperty for billboard `image` returning canvas elements renders as solid black rectangles with Google 3D Tiles
- Fixed LED facades (Session 41): replaced CallbackProperty image with direct `billboard.image = canvas.toDataURL()` in setInterval
- Fixed Galaxy wave pool (Session 45): same CallbackProperty image fix — direct assignment instead
- Fixed incense smoke (Session 46): same CallbackProperty image fix — direct assignment instead
- Fixed searchlights (Session 44): reduced canvas from 320x20 to 256x12, billboard width from 600 to 250, height from 15 to 6, halved opacity values for subtlety
- All three CallbackProperty-for-image patterns eliminated across the codebase
- Verified fix across desktop day/night and mobile views — no more black artifacts

## Session 62 — 2026-03-22 (Automated Agent)
- Street-level exploration mode: "Street" button drops camera to ground level (5m altitude) for immersive first-person city exploration
- Saves and restores camera state: previous bird's-eye position restored when exiting street mode
- "Exit Street" button with active gold styling returns to saved camera position with smooth 1.5s fly animation
- Keyboard shortcut: G to toggle street mode, Escape to exit
- Street indicator overlay shows "STREET LEVEL" text with usage hints briefly on entry (fades after 2.5s)
- Camera position clamped to Macau bounds (lon 113.52-113.60, lat 22.11-22.22) for safety
- Button visibility management: hides Replay/Tour/Share during street mode, restores on exit
- Mobile-responsive: Share and Street buttons stack on second row at 600px breakpoint
- 6th UX/meta-feature (after time slider S31, auto-tour S34, URL sharing S48, minimap S49, search S51, shortcuts S53)
- Fulfills medium-term roadmap item: "Street-level exploration mode"
- File grew from ~7204 to ~7319 lines (+115 lines)

## Session 63 — 2026-03-22 (Automated Agent)
- Firework sound effects: procedural Web Audio API sounds for rocket launches and burst explosions
- Launch whoosh: rising sine sweep (200-1200Hz) combined with highpass-filtered noise for realistic rocket ascent sound
- Burst pop: short noise burst with lowpass filter for explosive thump, followed by delayed crackle tail (sparse random pops through bandpass filter)
- Randomized parameters: frequency ranges, gain levels, and crackle delays vary per firework for natural variation
- Uses shared _audioCtx from ambient audio system — only plays when audio is enabled (Sound On)
- Called from launchRocket() and burst handler inside fireworks IIFE
- 3rd audio feature (after ambient soundscape S9, baccarat sounds S58)
- File grew from ~7319 to ~7411 lines (+92 lines)

## Session 64 — 2026-03-22 (Automated Agent)
- WASD/arrow key walking controls for street-level exploration mode
- Camera moves forward/backward/strafes left-right based on heading direction at 8 m/s walking speed
- Movement computed via ENU coordinate offsets (east/north) from camera heading, clamped to Macau bounds
- Mobile virtual joystick: touch-draggable gold knob on dark circular base, appears automatically on touch devices in street mode
- Joystick input vector (-1 to 1) feeds into same movement system as WASD keys
- Keyboard shortcut conflicts resolved: WASD/arrow keys bypass shortcut handler when in street mode
- Help overlay updated with WASD shortcut row; street indicator hint mentions WASD
- 8th UX/meta-feature enhancing street-level exploration (S31 time slider, S34 auto-tour, S48 URL sharing, S49 minimap, S51 search, S53 shortcuts, S62 street mode)
- File grew from ~7411 to ~7620 lines (+209 lines)

## Session 65 — 2026-03-22 (Automated Agent)
- Typhoon signal weather effects: Macau's iconic typhoon warning system with dramatic visual effects
- Typhoon signal detection from real wind speed data: T1 (30+ km/h), T3 (41+), T8 (63+), T10 (118+)
- Color-coded signal badge (green/yellow/orange/red) with pulsing animation in weather block
- Red warning banner slides down from top of screen for T3+ signals
- Wind-driven rain: CSS skew transforms tilt rain drops at angle during strong winds
- Animated wind streaks: canvas overlay draws speed-proportional horizontal wind lines
- Reduced visibility: increased CesiumJS fog density + darkened scene lighting proportional to signal level
- Typhoon Demo button lets visitors simulate T8 conditions on calm days
- Keyboard shortcut Y toggles typhoon demo mode; help overlay updated
- Mobile-responsive: smaller badge/banner/button at 600px breakpoint
- Clean restore of all normal weather effects when simulation ends
- Fulfills roadmap item: "Typhoon signal weather effects"
- File grew from ~7620 to ~7894 lines (+274 lines)

## Session 66 — 2026-03-22 (Automated Agent)
- Night sky stars: enabled CesiumJS skyBox for real star field at night
- Shooting star canvas animation: occasional animated meteors streak across the night sky (19:00-05:00)
- Meteor trails use linear gradient (white head → blue tail) with bright glow dot at head
- Shooting stars spawn randomly (~every 3 seconds) with varied angles (0.5-1.1 rad), speeds (4-12px/frame), and trail lengths (40-140px)
- Fade-in/fade-out lifecycle: quick fade-in over first 20% of life, gradual fade-out over remaining 80%
- Canvas overlay at z-index 45 (behind wind streaks z48 and rain z50, in front of 3D scene)
- Respects time slider override — shooting stars appear when previewing nighttime hours
- No new billboard entities — uses proven canvas overlay pattern (like fireworks S13, wind streaks S65)
- Atmospheric improvement addressing "daytime/nighttime experience" feedback from S60 audit
- File grew from ~7894 to ~7975 lines (+81 lines)

## Session 67 — 2026-03-22 (Automated Agent)
- Feature tips discovery system: rotating tip overlay helps users discover 30+ hidden features
- 13 device-aware tips covering baccarat, street mode, tour, time slider, weather, fireworks, minimap, sharing, shortcuts, walking, typhoon demo, shooting stars, and landmarks
- Gold pill-shaped overlay at bottom center with backdrop blur, fade transitions every 10 seconds
- Touch-aware: shows tap instructions on mobile, keyboard shortcuts on desktop
- Auto-starts after cinematic flythrough (25s delay), auto-hides after 5 minutes
- Dismissable via X button; uses proven IIFE pattern
- Mobile-responsive: adjusted font size (0.65rem), padding, and positioning at 600px breakpoint
- 9th UX/meta-feature (after time slider, auto-tour, URL sharing, minimap, search, shortcuts, street mode, WASD walking)
- File grew from ~7975 to ~8065 lines (+90 lines)

## Session 68 — 2026-03-22 (Automated Agent)
- Golden hour & cinematic color grading: full-screen time-of-day color overlay adds atmospheric warmth
- 8 time phases: dawn pink/amber (4-7), morning fade (7-9), clear midday (9-15), afternoon warm (15-17), golden hour amber (17-18:30), dusk purple (18:30-20), twilight blue (20-21), night deep blue (21-4)
- CSS overlay at z-index 42 (below all canvas effects), 4-second opacity transition for smooth phase changes
- Updates every 5 seconds via setInterval, reads getMacauHour() for time slider compatibility
- Addresses recurring feedback (Sessions 60-67) that daytime experience was weaker than nighttime
- First purely atmospheric daytime improvement — makes time-of-day transitions cinematic and visible
- No new billboard entities — uses simple CSS div overlay with dynamic rgba background
- File grew from ~8065 to ~8192 lines (+127 lines)

## Session 69 — 2026-03-22 (Automated Agent)
- Live transport tracking on minimap: 16 animated colored dots for all transport systems
- Color-coded: cyan=ferries (5), red=junk boats (4), white=planes (4), green=LRT trains (3), yellow=helicopters (3)
- Each dot has a glow halo for visibility at mobile minimap sizes
- Transport legend at bottom of minimap (Ferry, Junk, Air, LRT)
- Uses same route data and lerp math as 3D entity animations
- Updated feature tip to mention live minimap tracking
- Deepens existing minimap feature rather than adding more 3D billboard entities
- File grew from ~8192 to ~8274 lines (+82 lines)

## Session 75 — 2026-03-23 (Automated Agent)
- Landmark photo gallery: swipeable image gallery in each landmark's info card with real Wikimedia Commons photos
- 3 verified photos per landmark (24 total): Grand Lisboa, Venetian, Macau Tower, Ruins of St. Paul's, Galaxy, Wynn Palace, A-Ma Temple, City of Dreams
- Horizontal gallery with CSS translateX transitions, left/right arrow navigation, clickable dot indicators
- Touch swipe support for mobile: touchstart/touchmove/touchend with 40px threshold for swipe detection
- Photo captions in gradient overlay at bottom of gallery area
- Graceful error handling: img.onerror replaces broken images with "Photo unavailable" placeholder
- Card now scrollable (max-height: 90vh desktop, 85vh mobile) to accommodate gallery + text content
- Mobile-responsive: 36px arrow buttons, adjusted caption font, proper touch targets
- Updated feature tip to mention photo galleries on mobile (swipe hint)
- Fulfills ROADMAP high-priority item: "Landmark photo/video gallery"
- File grew from ~8274 to ~8424 lines (+150 lines)

## Session 76 — 2026-03-23 (Automated Agent)
- Enhanced street-level walking tour into cinematic documentary-style experience
- Auto-opens landmark info cards with photo galleries (3 real photos each) at each of 8 tour stops
- Gentle slow orbit camera at each stop: camera slowly circles the landmark at ~30m radius for cinematic feel
- Gold progress bar at bottom of screen showing tour completion percentage with smooth transitions
- Stop counter "STOP N / 8" in bottom-right corner with DM Mono font
- Lowered camera altitude from 12m to 8m for more immersive street-level experience
- Tour sequence per stop: 5s fly → 2s pause → auto-open info card → 10s dwell with orbit → close card → 1s pause → next
- Walk tour orbit uses its own tick handler (separate from main orbit) for independent control
- Mobile-responsive: counter and progress bar respect safe-area-inset-bottom
- Updated help overlay description for W key shortcut
- Updated feature tips to mention photo gallery auto-opening
- Fulfills high-priority ROADMAP item: "Street-level guided tour"
- File grew from ~8424 to ~8494 lines (+70 lines)

## Session 77 — 2026-03-23 (Automated Agent)
- Cinematic title cards during flythrough: upgraded plain-text stage labels to dramatic multi-line overlays
- Multi-line structure: large gold gradient title + Chinese subtitle + descriptive tagline + decorative accent lines
- Staggered CSS slide-up animations: accent lines scale in (0.1s delay), title slides up (0.15s), Chinese fades in (0.35s), tagline appears last (0.55s)
- Gold gradient text with drop-shadow matching BACCARAT CITY branding
- 9 bilingual labels with unique taglines: "Pearl of the Orient", "Asia's Las Vegas", "World's Largest Casino", "US$4.2 Billion Wonder", "The Lotus Tower", "UNESCO World Heritage", etc.
- Mobile-responsive: clamp() sizing, reduced letter-spacing at 600px breakpoint
- No new external dependencies — pure CSS animations with innerHTML rendering
- File grew from ~8746 to ~8792 lines (+46 lines)

## Session 79 — 2026-03-23 (Automated Agent)
- Animated neon Chinese signs: 8 glowing neon sign billboards at casinos and historic sites
- Locations: Grand Lisboa (葡京), Venetian (威尼斯人), Galaxy (銀河), Wynn Palace (永利皇宮), City of Dreams (新濠天地), Senado Square (議事亭), Ruins of St. Paul's (大三巴), A-Ma Temple (媽閣廟)
- Canvas-drawn neon text with Chinese characters, English subtitle, colored glow halos
- Flickering animation via setInterval (200ms) — subtle brightness variation per sign for realistic neon feel
- Night-only visibility tied to _currentGlowIntensity (> 0.1 threshold)
- Each sign has unique neon color: red (Lisboa), gold (Venetian), blue (Galaxy), amber (Wynn), purple (City of Dreams), warm yellow (Senado), orange (Ruins), red (A-Ma)
- Neon Signs entry added to Shows section of Explore panel
- 19th entity animation system using proven billboard + canvas + setInterval pattern
- File grew from ~9002 to ~9097 lines (+95 lines)

## Session 81 — 2026-03-23 (Automated Agent)
- Street food market stalls: 8 animated food vendor stalls at Macau's famous food streets
- Locations: Rua do Cunha/Taipa Village (蛋撻 egg tart, 杏仁餅 almond cookie, 豬扒包 pork chop bun), Senado Square (牛雜 beef offal, 雙皮奶 milk pudding), Three Lamps District (咖喱魚蛋 curry fishball, 竹升麵 bamboo noodle), Rua da Felicidade (鳳凰卷 phoenix roll)
- Canvas-drawn warm lantern awnings with Chinese food names and English subtitles
- Animated steam wisps rising above stalls with warm flicker glow effect (250ms setInterval)
- Always active (day and night) with brighter glow boost at night via _currentGlowIntensity
- Street-level visibility (scaleByDistance 30m-2km, translucencyByDistance 20m-3km)
- Street Food Stalls entry added to Heritage section of Explore panel
- 20th entity animation system using proven billboard + canvas + setInterval pattern
- Fulfills IDEAS backlog item: "Street markets and food stalls"
- File grew from ~9097 to ~9207 lines (+110 lines)

## Session 82 — 2026-03-23 (Automated Agent)
- Portuguese azulejo tile panels: 6 decorative blue-and-white Portuguese tile panel billboards at heritage sites
- Locations: Senado Square (Largo do Senado), Leal Senado, Ruins of St. Paul's (Ruínas de S. Paulo), St. Augustine's Square (Largo de S. Agostinho), Guia Fortress (Fortaleza da Guia), Barra Square (Largo da Barra)
- Canvas-drawn 128x96px tile panels with traditional blue-and-white azulejo patterns: cross, floral, diamond, wave motifs
- Portuguese place names in Cinzel font with Chinese subtitles in Noto Sans SC
- Gold corner accent decorations echoing Macau's fusion aesthetic
- Gentle shimmer animation via setInterval (400ms) — subtle pattern intensity variation
- Always active (day and night) with slight scale boost at night via _currentGlowIntensity
- Street-level visibility (scaleByDistance 30m-2km, translucencyByDistance 20m-3km)
- Azulejo Tiles entry added to Heritage section of Explore panel
- 21st entity animation system using proven billboard + canvas + setInterval pattern
- Balances cultural representation: adds Portuguese colonial heritage alongside existing Chinese elements
- File grew from ~9207 to ~9386 lines (+179 lines)

## Session 83 — 2026-03-23 (Automated Agent)
- Position-aware spatial audio zones: 4 new audio layers that respond to camera position over Macau
- Casino zone (Cotai Strip + NAPE): electronic chime triad (C6/E6/G6) with shimmer LFO + bandpass slot machine noise
- Temple zone (A-Ma Temple + Ruins of St. Paul's): deep bell tones (F3/F4/C5 harmonics) with slow tremolo
- Harbour zone (Inner Harbour + Outer Harbour + Nam Van Lake): low foghorn tone (85Hz) with wave-like LFO
- Proximity-based volume: smooth falloff from zone center with configurable radius per zone
- Altitude awareness: zone sounds fade out above 500m for realistic distance perception
- Time-sensitive mixing: casino sounds 1.5x louder at night, temple bells 1.5x at dawn, harbour foghorn boosted in fog
- Existing ocean/city layers also boosted near relevant zones (ocean near harbour, city hum near casinos)
- Audio mix update frequency increased from 30s to 3s for responsive position tracking
- Updated feature tips to mention spatial audio zones; help overlay updated
- 4th audio feature (after ambient soundscape S9, baccarat sounds S58, firework sounds S63)
- File grew from ~9386 to ~9547 lines (+161 lines)

## Session 84 — 2026-03-23 (Automated Agent)
- Floating lotus flowers: 10 animated lotus flower billboard entities on Nam Van Lake and Inner Harbour
- Lotus is Macau's official emblem (SAR flag, coat of arms) — Grand Lisboa is designed as a lotus bud
- 3 placement areas: Nam Van Lake cluster (6 flowers), Inner Harbour waterfront (2), A-Ma Temple coast (2)
- Canvas-drawn 48x48px lotus icon: green lily pad base, 5 outer petals, 3 inner white petals, golden seed pod center
- 4 color varieties: pink (#ff69b4), light pink (#ffb6c1), deep pink (#ff1493), white (#ffffff)
- Gentle circular drift animation via CallbackProperty (~40s full circle, ~5m radius) simulates water current
- Breathing scale pulse (6s cycle, ±8%) creates floating-on-water feel
- Always active (day and night) — adds daytime visual life to water areas
- Street-level visibility (scaleByDistance 50m-5km, translucencyByDistance 30m-6km)
- Lotus Flowers entry added to Heritage section of Explore panel with lotus emoji
- New feature tip: "Spot floating lotus flowers on Nam Van Lake — Macau's official emblem"
- 22nd entity animation system using proven billboard + CallbackProperty pattern
- File grew from ~9547 to ~9652 lines (+105 lines)

## Session 85 — 2026-03-23 (Automated Agent)
- Macau triciclo pedicabs: 4 traditional three-wheeled bicycle rickshaws navigating heritage district streets
- Triciclo (三輪車) is one of Macau's most iconic cultural symbols — once the primary mode of transport
- 3 routes: Senado Square to Hotel Lisboa (2 triciclos), Ruins district (1), Barra waterfront near A-Ma Temple (1)
- Canvas-drawn 28x28px triciclo icon: green curved canopy, brown frame, three wheels, driver figure, warm glow halo
- CallbackProperty ping-pong movement animation reusing proven ferry/junk pattern (45-60s per route)
- Ground-level at 3m altitude — visible when zoomed into heritage district, similar to pedestrians
- Always active (not time-gated) — triciclos operate during daytime hours as tourist attractions
- Triciclo Pedicabs entry added to Transit section of Explore panel
- Amber-colored triciclo dots added to minimap live transport tracking with legend entry
- 23rd entity animation system using proven billboard + CallbackProperty pattern
- File grew from ~9652 to ~9782 lines (+130 lines)

## Pre-Session Notes
- Current code is at /tmp/nxt49/baccarat-city.html (198KB, 5098 lines)
- Also deployed to s3://nxt49-ca-site/baccarat-city.html
- Needs migration to baccaratcity.com
- Fictional grid layout must be replaced with real Macau geography
