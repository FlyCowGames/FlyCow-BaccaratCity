# Current State

*Rewritten each session to reflect what exists now.*

## Last Updated: 2026-03-22 (Session 48)

## Scene Description
- CesiumJS viewer with Google Photorealistic 3D Tiles -- real Macau photogrammetry
- Cinematic 5-stage flythrough: bird's eye > Cotai sweep > street level > Grand Lisboa orbit > casino district overview
- 8 landmark billboards: Grand Lisboa, Venetian, Macau Tower, Ruins of St. Paul's, Galaxy, Wynn Palace, A-Ma Temple, City of Dreams
- Real-time day/night cycle driven by actual Macau time (UTC+8) via CesiumJS sun position
- Live weather from Open-Meteo API: temperature, conditions, humidity, wind, cloud cover
- Weather-reactive atmosphere: rain overlay, fog, cloud-dimmed lighting
- **Animated ferry boats**: 5 ferries on 2 routes (Outer Harbour-Taipa, Inner Harbour-Taipa), continuously moving
- **Animated road traffic**: 19 vehicles on 5 routes (3 bridges, Cotai Strip, peninsula road), continuously moving
- **Airport flights**: 4 planes on 2 routes (approach from south descending, departure north climbing), continuously animating
- **Neon casino glow**: 11 glow zones with bloom post-processing, active at night (19:00-05:00) with dusk/dawn ramps
- **Ambient audio**: 3-layer procedural soundscape (ocean, wind, city hum) via Web Audio API, time-of-day + weather reactive
- **Landmark info cards**: click any landmark to see a rich popup with description, history, facts, type, and year
- **Interactive baccarat**: click any casino → "Enter Casino" → play baccarat with proper Punto Banco rules
- **Harbor fireworks**: particle-based firework display over the harbor at night (20:00-01:00), 6 color palettes, 3 burst types
- **Animated pedestrians**: ~26 walking figures near 6 popular areas (Senado Square, Ruins, Grand Lisboa, Cotai, A-Ma Temple, Macau Tower)
- **Construction cranes**: 5 crane sites with static tower billboards and orbiting warning lights (Zone A, Cotai East, Studio City, Taipa, Peninsula)
- **Harbor water shimmer**: ~23 animated light reflection points on water surfaces, subtle day sparkle / bright night casino reflections
- **Casino sky beams**: 5 vertical light beams from major casinos at night with gentle sway animation
- **Wynn Performance Lake**: Choreographed fountain show with 13 jets, 3-min shows every 15 min at night, 6 color palettes
- **Guia Circuit race cars**: 5 F3 cars racing the 6.2km street circuit around Macau Peninsula (15 waypoints, one-way loop, 5 distinct colors)
- **Traditional junk boats**: 4 red-sailed Chinese junks cruising 3 harbour routes (Inner Harbour, Outer Harbour, A-Ma Temple coast)
- **Geographic district labels**: 8 floating bilingual labels (English + Chinese) over major areas, visible from bird's eye for geographic orientation
- **Guia Lighthouse**: Rotating lighthouse beam at Guia Hill summit (oldest lighthouse on China coast, 1865), active at night with 8-second sweep
- **Macau LRT**: 3 animated light rail trains on the Taipa Line route (Ocean → Cotai → Airport → Taipa Ferry), elevated at 15m
- **Bridge night illumination**: 50 LED-style light points along 3 bridges (Amizade=blue-white, Sai Van=gold, Nobre de Carvalho=white), night-only with gentle pulse
- **Time-of-day slider**: interactive slider to preview any hour (0-24h), overrides sun position and all time-gated features, with LIVE button to return to real time
- **Floating sky lanterns**: 12 kongming lanterns drifting over Inner Harbour at night, slowly ascending 30-220m with warm golden glow and flicker, recycling at peak
- **Helicopter service**: 3 helicopters on routes from Outer Harbour heliport — 2 HK shuttle flights (inbound/outbound) and 1 scenic peninsula tour at 200-350m altitude
- **Auto-tour mode**: TOUR button that automatically flies camera through all 30+ attractions in random order, with bilingual location labels and 6-second dwell per stop
- **Dragon boat racing**: 5 colorful dragon boats racing parallel lanes on Nam Van Lake with team colors (red, blue, green, gold, purple)
- **Venetian canal gondolas**: 3 traditional gondolas gliding along canals near The Venetian Macao with black hulls, gold ferro prows, and gondoliers
- **Red lantern strings**: 10 traditional Chinese red lantern strings hanging across streets in 4 historic areas (Senado Square, Ruins of St. Paul's, A-Ma Temple, Taipa Village) with gentle sway and night glow
- **Macau Tower SkyJump**: 2 animated bungy jumpers leaping from 233m observation deck with multi-bounce physics, 12-second jump cycles
- **Cotai Strip LED facades**: 5 animated color-cycling LED screen displays on major Cotai casinos (Venetian, Galaxy, City of Dreams, MGM Cotai, Studio City) — night-only with hue-shifting grid patterns
- **Harbor seagulls**: 18 animated seabirds circling in 4 flocks over Inner Harbour, Outer Harbour, Nam Van Lake, and Taipa waterfront at 60-100m altitude
- **Casino rooftop searchlights**: 6 sweeping searchlight beams from major casino rooftops at night (Grand Lisboa, Venetian, Galaxy, Wynn, MGM Cotai, Studio City) with distinct colored beams oscillating back and forth
- **Galaxy Macau wave pool**: 7 animated wave entities on Galaxy's Grand Resort Deck rooftop (55m altitude) with turquoise water, animated wave crests, and sparkle highlights — always active (daytime feature)
- **A-Ma Temple incense coils**: 6 hanging spiral incense coils at A-Ma Temple courtyards with rising smoke wisps — canvas-drawn spiral coils with red prayer tags, ascending smoke animation, always active (cultural/daytime feature)
- **Camera position URL sharing**: Share View button copies a URL encoding camera lon/lat/alt/heading/pitch; visiting shared URLs skips flythrough and flies directly to the shared view; URL hash updates in real-time as users orbit
- Dark/gold branding overlay: "BACCARAT CITY" / "百家樂之城 - 澳門風雲"
- Real-time Macau clock with day/night/golden hour indicator

## Technical Stack
- CesiumJS 1.119 from CDN
- Google Photorealistic 3D Tiles (API key on mega-agent-flycow project 914103293251)
- Open-Meteo API (free, no key) for weather data
- CesiumJS bloom post-processing for neon glow
- Single HTML file (~5857 lines, ~207KB)
- Custom CSS overlay with Cinzel + Noto Sans SC + DM Mono fonts
- Deployed: S3 (baccaratcity-site) > CloudFront (E3V8V12C6EPFK6) > baccaratcity.com

## What Works
- Photorealistic 3D rendering of all Macau
- Cinematic flythrough with smooth camera transitions
- Landmark billboards with Chinese/English names
- Click landmark to fly to it
- Replay button for cinematic
- Drag to orbit, scroll to zoom
- Loading screen with progress bar
- Real-time day/night cycle (sun/moon position)
- Live weather display (temp, conditions, humidity, wind, clouds)
- Rain effect (CSS overlay) when weather is rainy
- Fog effect when weather is foggy or heavily overcast
- Light dimming based on cloud cover
- Ferry boats animating across the harbor between Peninsula and Taipa
- **Road traffic**: 19 cars on 5 routes (3 bridges, Cotai Strip, peninsula)
- **Airport flights**: 4 planes approaching and departing Macau International Airport
- **Neon casino glow** at night with radial light billboard entities
- **Ambient audio** soundscape with mute/unmute toggle
- **Landmark info cards** with descriptions, facts, history (click any landmark)
- **Interactive baccarat** at any casino (Punto Banco rules, animated dealing, session stats)
- **Harbor fireworks** at night (20:00-01:00) with particle physics, multiple burst types, brand-matching palettes
- **Animated pedestrians** near 6 popular areas (~26 walking figures, visible when zoomed in)
- **Construction cranes** at 5 development sites with orbiting warning lights
- **Harbor water shimmer** — animated light reflections on water surfaces (subtle day, bright night)
- **Casino sky beams** at night with gentle sway animation (5 major casinos)
- **Wynn Performance Lake** fountain show at night — 13 choreographed jets with color-changing light shows
- **Guia Circuit race cars** — 5 F3 cars with distinct colors racing the iconic street circuit (always active)
- **Traditional junk boats** — 4 red-sailed Chinese junks cruising Inner/Outer Harbour and A-Ma Temple coast
- **Geographic district labels** — 8 bilingual floating labels visible from overview for geographic orientation
- **Guia Lighthouse** — rotating beam at Guia Hill summit, active at night with 8-second sweep period
- **Macau LRT** — 3 light rail trains on the Taipa Line (Ocean to Airport to Taipa Ferry), always active
- **Bridge night illumination** — 50 LED light points across 3 bridges with distinct colors, night-only with pulse animation
- **Time-of-day slider** — preview any hour with sun/moon position, neon glow, fireworks, bridge lights all responding
- **Floating sky lanterns** — 12 kongming lanterns ascending over Inner Harbour at night with warm golden glow
- **Helicopter service** — 3 helicopters: 2 HK shuttle flights + 1 scenic tour from Outer Harbour heliport
- **Auto-tour mode** — TOUR button flies camera through all attractions automatically with location labels
- **Dragon boat racing** — 5 dragon boats racing parallel lanes on Nam Van Lake (red, blue, green, gold, purple teams)
- **Venetian canal gondolas** — 3 traditional gondolas on canals near The Venetian with gondoliers and passengers
- **Red lantern strings** — 10 lantern strings across 4 historic areas with sway animation and night glow boost
- **Macau Tower SkyJump** — 2 animated bungy jumpers with multi-bounce physics (233m → 40m → bounces → winch-back)
- **Cotai Strip LED facades** — 5 animated LED screen displays on Cotai casinos with color-cycling grid patterns, night-only
- **Harbor seagulls** — 18 animated seabirds in 4 flocks circling over coastal areas (60-100m altitude, always active)
- **Casino rooftop searchlights** — 6 sweeping searchlight beams from casino rooftops at night with distinct colors per casino
- **Galaxy Macau wave pool** — 7 animated wave entities on Galaxy's Grand Resort Deck rooftop with turquoise water and animated crests
- **A-Ma Temple incense coils** — 6 hanging spiral incense coils with rising smoke wisps at A-Ma Temple courtyards (always active)

- **Camera position URL sharing** — Share View button copies URL with camera position; shared URLs skip flythrough

## What's Missing (vs Prime Directive)
- Event system (F3, CNY, festivals)
- ~~Casino interior / baccarat tables~~ (Done Session 11 — interactive baccarat game overlay)
- ~~Audio~~ (Done Session 9 — ambient soundscape)
- ~~Interactive exploration (click buildings for info)~~ (Done Session 10 — landmark info cards)
- Typhoon signal weather effects (T1-T10)
