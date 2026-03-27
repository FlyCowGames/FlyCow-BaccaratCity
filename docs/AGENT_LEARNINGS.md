# Agent Learnings

*Auto-generated from data/knowledge.json — do NOT edit directly.*

## Patterns (What Works)

### Landmark-specific light signatures elevate hero buildings above generic effects
- **Weight:** 0.9 | **Domain:** rendering | **Applied:** 10/10 successful
- Each major landmark benefits from a unique animated light effect that matches its architectural identity — Eiffel Tower sparkle (S181), Sai Van cable harp (S183), Grand Lisboa lotus crown (S184), Macau Tower LED crown (S186), Morpheus exoskeleton LED (S187), Venetian campanile golden cascade (S188), Galaxy diamond LED canopy (S191), Studio City Golden Reel figure-8 (S192), MGM Macau golden wave facade (S197), Wynn Palace golden crescent (S198). These are more memorable than generic casino effects (neon glow, sky beams) and give each landmark its own visual fingerprint at night. The IIFE + canvas billboard + setInterval + window._init* pattern is now well-proven across 10 implementations.
- **Evidence:** S181 Eiffel sparkle, S183 Sai Van harp, S184 Lisboa crown, S186 Macau Tower LED, S187 Morpheus exoskeleton, S188 Venetian campanile, S191 Galaxy diamond, S192 Golden Reel figure-8, S197 MGM golden wave, S198 Wynn Palace crescent all deployed without JS errors. Pattern is stable and efficient across Peninsula, Cotai, bridge, and unique architectural forms.

### CSS particle effects are lightweight alternatives to WebGL
- **Weight:** 0.8 | **Domain:** rendering | **Applied:** 13/13 successful
- CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects.
- **Evidence:** Used across sessions 3, 65, 66 for rain, wind streaks, and shooting stars. Session 96: cloud wisps. Session 102: rain splashes. Session 106: sun rays. Session 107: rainbow arc. Session 109: harbor mist. Session 171: night bokeh lights. Session 173: heat shimmer. Session 174: city horizon glow (light pollution). Session 178: moonlit water path. Session 179: sunset/sunrise sky gradient bands.

### Staggered animation delays prevent mechanical feel
- **Weight:** 0.8 | **Domain:** animation | **Applied:** 10/10 successful
- Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion.
- **Evidence:** Applied in pedestrians, seagulls, sky lanterns, flythrough title cards, neon signs, food stalls, lotus flowers, cloud wisps, and other animation systems

### Web Audio API for procedural sound without external files
- **Weight:** 0.8 | **Domain:** audio | **Applied:** 5/5 successful
- Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy).
- **Evidence:** Sessions 9, 58, 63, 83, 98: ambient soundscape, baccarat sounds, firework sounds, spatial audio zones, thunder — all procedurally generated

### Enhancing existing features is high-impact with low risk
- **Weight:** 0.7 | **Domain:** interactivity | **Applied:** 21/21 successful
- Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing systems (landmark cards, photo gallery, orbit camera). Building on proven patterns is fast and reliable.
- **Evidence:** Session 76: enhanced walk tour in ~70 lines by reusing showLandmarkCard(), existing orbit pattern, and existing WALK_TOUR_STOPS data. Session 122: Studio City already had searchlight/LED/obstacle light — adding landmark data + billboard + glow + beam completed it as a full landmark with minimal new code. Session 123: Added observation deck viewpoint to existing Macau Tower landmark by reusing orbit pattern and showLandmarkCard button pattern. Session 125: Kun Iam Statue added as 15th landmark by simply adding to LANDMARKS array + ATTRACTIONS. Session 126: Golden Lotus Square added as 16th landmark with same pattern. Session 128: Grand Lisboa Sky Lounge viewpoint added by reusing exact tower/reel viewpoint pattern. Session 131: The Parisian Macao added as 17th landmark with all night-effect arrays. Session 132: Wynn Macau added as 18th landmark leveraging pre-existing neon glow and water reflection. Session 133: Sands Macao added as 19th landmark with all 5 night-effect arrays. Session 134: Monte Fort added as 20th landmark (heritage, no night-effect arrays needed). Session 135: Taipa Houses-Museum added as 21st landmark (Portuguese colonial heritage in Taipa). Session 137: Penha Church added as 22nd landmark (religious heritage on Penha Hill). Session 138: Guia Fortress added as 23rd landmark — ties existing Guia Lighthouse beam animation to a full clickable landmark. Session 139: Mandarin's House added as 24th landmark (Chinese residential heritage). Session 141: St. Dominic's Church added as 25th landmark (baroque religious heritage at Senado Square). Session 143: Lou Kau Mansion added as 26th landmark (Chinese merchant mansion heritage). Session 145: Na Tcha Temple added as 27th landmark (Chinese folk religion, behind Ruins of St. Paul's). Session 146: Sé Cathedral added as 28th landmark (mother church of Diocese of Macau). Session 148: Dom Pedro V Theatre added as 29th landmark (performing arts heritage, first Western theatre in China) — zero JS errors every time.

### Cultural balance through complementary heritage elements
- **Weight:** 0.7 | **Domain:** landmarks | **Applied:** 4/4 successful
- When a digital twin represents a multicultural city, actively balance representation of different cultural heritages. Macau has Chinese and Portuguese elements — adding Portuguese azulejo tile panels complements the extensive Chinese elements (lanterns, neon signs, food stalls, incense). This avoids cultural homogeneity and better represents the city's unique identity.
- **Evidence:** Session 82: 6 Portuguese azulejo tile panels. Session 114: 8 bilingual street name signs. Session 118: 5 Chinese paifang gateway arches. Session 135: Taipa Houses-Museum — Portuguese colonial residential architecture in Taipa adds geographic and cultural diversity. Balancing Portuguese (blue/white) and Chinese (red/gold) visual elements creates authentic multicultural feel.

### Time-of-day gated features fill temporal gaps and add realism
- **Weight:** 0.7 | **Domain:** animation | **Applied:** 4/4 successful
- Gating billboard entity visibility to specific time windows (e.g., morning 5-9 AM for tai chi) creates time-specific atmosphere that rewards exploration at different hours. Using getMacauHour() with smooth fade in/out at boundaries (0.5h ramp) prevents jarring appearance/disappearance. Most features are night-only or always-on — morning/afternoon-specific features fill temporal gaps.
- **Evidence:** Session 91: tai chi 5-9 AM. Session 93: fishing sampans 15-19 PM. Session 97: dinner cruise 19-23. Session 109: harbor mist 5-8:30 AM. All use getMacauHour() with fade ramps. Zero JS errors every time.

### New landmark integrates with all existing night-effect systems automatically
- **Weight:** 0.7 | **Domain:** landmarks | **Applied:** 4/4 successful
- Adding a new landmark to the LANDMARKS array plus entries in NEON_ZONES, SKY_BEAM_CASINOS, SEARCHLIGHT_CASINOS, CASINO_REFLECTIONS, and OBSTACLE_LIGHT_BUILDINGS gives the landmark a fully integrated nighttime presence with zero new code. Each system iterates its array and creates entities — the data-driven architecture means adding array entries is all that's needed. Session 133: Sands Macao added all 5 night-effect arrays in one pass.
- **Evidence:** Session 121: MGM Macau added to 6 arrays (LANDMARKS, ATTRACTIONS.casinos, NEON_ZONES, SKY_BEAM_CASINOS, SEARCHLIGHT_CASINOS, OBSTACLE_LIGHT_BUILDINGS, CASINO_REFLECTIONS). Session 131: The Parisian Macao added to 7 arrays. Session 132: Wynn Macau added to 6 arrays (LANDMARKS, ATTRACTIONS.casinos, SKY_BEAM_CASINOS, SEARCHLIGHT_CASINOS, OBSTACLE_LIGHT_BUILDINGS, TICKER_CASINOS) — neon glow and water reflection pre-existing. All systems picked it up automatically. Zero JS errors every time.

### Layered weather effects compound for immersion
- **Weight:** 0.65 | **Domain:** atmosphere | **Applied:** 5/5 successful
- Adding secondary effects to existing weather systems (splash ripples to rain drops, thunder to lightning, rainbow after rain, lens drops) compounds the immersion without replacing the original. Each layer adds a distinct sensory channel. Key: keep secondary effects subtle — they should enhance, not compete with, the primary effect.
- **Evidence:** Session 102: rain splash ripples added below existing rain drops. Session 98: thunder added to lightning bolts. Session 107: rainbow arc during/after rain. Session 157: wet neon road reflections during rainy nights. Session 159: camera lens raindrops during rain. All integrate into the same weather/typhoon activation flow with minimal new code. Session 173: heat shimmer gated by temperature + time + cloud cover.

### Staggered CSS transitions create cinematic reveal effects
- **Weight:** 0.6 | **Domain:** rendering | **Applied:** 1/1 successful
- Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s, subtitle at 0.35s, tagline at 0.55s). Combined with translateY slide-up, this creates an elegant staggered reveal without JavaScript animation.
- **Evidence:** Session 77: flythrough title cards use 4 staggered CSS transitions for a cinematic reveal. Gold gradient title, Chinese subtitle, tagline all animate independently with different delays.

### Canvas text with shadowBlur creates convincing neon glow
- **Weight:** 0.6 | **Domain:** rendering | **Applied:** 4/3 successful
- Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is smooth without being expensive.
- **Evidence:** Session 79: 8 neon signs with canvas-drawn Chinese text, colored glow halos, and flickering animation. Session 81: reused for food stall warm glow. Session 111: reused for string light bulb glow. Session 181: Eiffel Tower sparkle uses shadowBlur for sparkle glow points. Runs smoothly alongside 20+ other entity systems.

### Time-lapse mode showcases time-gated features visitors would otherwise miss
- **Weight:** 0.6 | **Domain:** interactivity | **Applied:** 1/1 successful
- A requestAnimationFrame-driven time-lapse that smoothly advances _timeOverride from 0 to 24 over ~48 seconds lets visitors see all time-gated features (dawn mist, tai chi, midday buses, afternoon sampans, golden hour, neon lights, fireworks) in one sitting. Reuses the existing time override system (slider input, updateCesiumClock, updateNeonGlow) so zero new infrastructure is needed. Placed next to the existing time slider for contextual discoverability.
- **Evidence:** Session 113: 72 lines of code, zero JS errors, smooth animation on desktop and mobile. Integrates cleanly with existing time slider, LIVE button, and all other sequences (Tour, Walk Tour, Flythrough).

### Static billboard entities for signage need no animation interval
- **Weight:** 0.6 | **Domain:** landmarks | **Applied:** 2/2 successful
- Street name signs, static plaques, and other non-animated signage billboards can use a single canvas.toDataURL() call at init time with no setInterval. This saves CPU compared to animated billboards (neon signs, food stalls) that redraw every 200-400ms. For static content, the simplest approach is best.
- **Evidence:** Session 114: 8 street name signs with one-time canvas draw, no setInterval. Session 118: 5 paifang arches same pattern. Zero JS errors both times.

### Adding missing landmarks to LANDMARKS array fixes walk tour gaps
- **Weight:** 0.6 | **Domain:** landmarks | **Applied:** 2/2 successful
- The walk tour auto-opens landmark cards via LANDMARKS.find(l => l.name === stop.name). If a walk tour stop exists but the matching LANDMARKS entry does not, the tour silently skips the info card at that stop. Adding the missing LANDMARKS entry automatically creates the billboard, enables click-to-fly, and fixes the walk tour card — all from a single array entry. Always check that walk tour stops have matching LANDMARKS entries.
- **Evidence:** Session 117: Senado Square was a walk tour stop but had no LANDMARKS entry. Adding the entry with photos, description, and facts instantly created billboard, info card, photo gallery, and fixed the walk tour gap. Zero JS errors, passed desktop/mobile checks.

### Landmark-specific action buttons extend info cards into interactive experiences
- **Weight:** 0.6 | **Domain:** interactivity | **Applied:** 2/2 successful
- Adding special-purpose buttons to landmark info cards (beyond Enter Casino) transforms passive info cards into interactive gateways. The landmark card is a natural place for contextual actions because the user is already engaged with that landmark. Different button colors (blue=tower, pink=reel, gold=casino) visually distinguish different action types. The same orbit pattern used elsewhere works perfectly for point-of-interest viewpoints.
- **Evidence:** Session 123: 'View from Observation Deck' button added to Macau Tower card (blue accent). Session 127: 'Ride the Golden Reel' button added to Studio City card (pink accent). Both reuse orbit pattern, zero JS errors, passed desktop/mobile checks.

### Non-casino cultural landmarks diversify the landmark collection
- **Weight:** 0.6 | **Domain:** landmarks | **Applied:** 5/5 successful
- Adding religious, cultural, or civic landmarks (Kun Iam Statue, Golden Lotus Square, Senado Square, A-Ma Temple) balances the casino-heavy landmark list and better represents Macau as a complete city. These landmarks follow the exact same LANDMARKS array pattern but don't need night-effect arrays (NEON_ZONES, SKY_BEAMS, etc.) — just the LANDMARKS entry and ATTRACTIONS entry are sufficient for a full experience with billboard, info card, photo gallery, and explore panel integration.
- **Evidence:** Session 125: Kun Iam Statue added with just 2 array entries (LANDMARKS + ATTRACTIONS.landmarks) + 1 feature tip. Session 126: Golden Lotus Square added same way — 16th landmark. Session 134: Monte Fort (大炮台) added as 20th landmark — UNESCO heritage fortress next to Ruins of St. Paul's, 3 Wikimedia photos. Session 135: Taipa Houses-Museum (龍環葡韻) added as 21st landmark — 1921 Portuguese colonial houses in Taipa, adds geographic diversity. Session 148: Dom Pedro V Theatre added as 29th landmark — performing arts heritage, first Western theatre in China (1860). All zero JS errors, passed desktop/mobile checks.

### Audit sessions catch mobile UI overlap regressions that accumulate over time
- **Weight:** 0.6 | **Domain:** interactivity | **Applied:** 1/1 successful
- As new UI elements are added over many sessions (action-prompt, feature-tips, minimap, clock, ticker), their absolute-positioned bottom offsets can gradually overlap on mobile viewports even though each was tested individually. Periodic audits with bounding-box overlap detection catch these cumulative layout regressions. Fix by restacking elements vertically: feature-tips above action-prompt, minimap/clock above ticker, with clear gaps.
- **Evidence:** Session 130 audit found 4 overlapping pairs in the 640-780px zone on 390px mobile viewport. Fixed by adjusting bottom offsets: feature-tips 120→210px, minimap 64→36px, clock 16→36px. Zero overlaps after fix.

### localStorage persistence for game state enhances engagement with minimal code
- **Weight:** 0.6 | **Domain:** interactivity | **Applied:** 2/2 successful
- Using localStorage to persist interactive feature state (bankroll, stats, history) across browser sessions makes features feel more meaningful. Key design: save after each action, load on init with null-checks for missing fields, graceful fallback if localStorage unavailable, clear on reset. The try/catch wrapper handles private browsing and quota errors. Tracking meta-stats (hands played, biggest win, peak) adds a sense of progression beyond the primary state.
- **Evidence:** Session 152: ~40 lines added saveBaccState()/loadBaccState() with JSON serialization. Bankroll, stats, road history, hands played, biggest win, and peak all persist. Welcome back indicator + session stats display. Zero JS errors, works on both desktop and mobile.

### Meta-UI that surfaces existing features increases perceived value
- **Weight:** 0.6 | **Domain:** interactivity | **Applied:** 1/1 successful
- Building a dashboard/status overlay that reads existing feature state (time-gated activations, weather conditions, etc.) and presents it as a live indicator adds perceived value without adding any new 3D entities. The City Pulse reads getMacauHour() against a simple feature time-window array and renders active/inactive status. Click-to-fly reuses the existing flyToAttraction pattern. This pattern works whenever a project has many features that visitors may not discover independently.
- **Evidence:** Session 155: City Pulse with 11 features, ~140 lines of CSS/JS. Reads getMacauHour(), integrates with time slider. Zero JS errors, passed desktop/mobile. The toggle button provides passive awareness (active count) while the expanded list provides active exploration.

### Themed heritage feature sets build cultural depth incrementally
- **Weight:** 0.6 | **Domain:** landmarks | **Applied:** 1/1 successful
- Grouping related cultural features into themed trilogies (or sets) creates a coherent heritage layer. Portuguese colonial heritage was built across 3 sessions: azulejo tiles (S82), bilingual street signs (S114), and calçada cobblestone pavement (S164). Each follows the same canvas + billboard pattern but adds a distinct visual element. Together they create a rich Portuguese colonial atmosphere without any single session being overwhelming.
- **Evidence:** Session 164: calçada cobblestones completed the Portuguese heritage trinity. Each uses canvas-drawn billboard entities with setInterval animation, Portuguese/Chinese bilingual text, and distance-based visibility. Zero new patterns needed — just different canvas art on the proven framework.

### Staggered CSS reveal animations create cinematic loading experiences
- **Weight:** 0.6 | **Domain:** interactivity | **Applied:** 1/1 successful
- Using incremental animation-delay values on loading screen elements creates a movie-title-sequence feel. Combined with CSS animation-fill-mode: forwards, elements stay visible after their reveal completes. Floating particle background divs with varying sizes, speeds, and delays add ambient depth. Rotating text content (Macau facts) keeps users engaged during longer loads. Gold gradient progress bar with glow provides premium feel.
- **Evidence:** Session 167: enhanced loading screen with 15 particles, staggered reveals (0-1.3s delays), rotating facts every 4s, gold gradient bar with glow. Zero JS errors, passed desktop+mobile. First thing every visitor sees — high-impact UX improvement.

### Dynamic color choreography via setInterval icon redraws enhances existing shows
- **Weight:** 0.6 | **Domain:** rendering | **Applied:** 1/1 successful
- Enhancing an existing billboard animation (fountain jets) with a setInterval that redraws icons with time-varying colors adds dramatic visual impact without creating new entity systems. Using per-element phase offsets and show-progress-based 'acts' creates choreographic variety. The lerpColor() interpolation between palette entries creates smooth transitions. A secondary 'glow' billboard averaging all element colors adds reflected light effect on surfaces below.
- **Evidence:** Session 194: Enhanced Wynn Performance Lake with 3-act color choreography (waves, fire bursts, rainbow finale) via 200ms setInterval. 8-color palette with smooth interpolation. Lake surface glow entity reflects average color. Zero JS errors on desktop and mobile. 122 lines added.

### Separate tick handlers for independent orbit systems
- **Weight:** 0.5 | **Domain:** interactivity | **Applied:** 1/1 successful
- When adding a new orbit behavior (walk tour orbit), use a separate onTick handler rather than reusing the global orbit system. This allows independent control — the walk tour orbit can be stopped/started without affecting the global orbit used after flythrough.
- **Evidence:** Session 76: _walkTourOrbitHandle is managed independently from orbitHandle. Clean start/stop lifecycle prevents interference.

### Progress indicators improve guided experience UX
- **Weight:** 0.5 | **Domain:** interactivity | **Applied:** 1/1 successful
- Adding a visual progress bar and stop counter to guided tours gives users context about where they are in the experience and how much is left. Simple CSS progress bar with width transition is effective.
- **Evidence:** Session 76: gold progress bar + 'STOP N/8' counter added to walk tour. Visible on both desktop and mobile.

### Canvas steam/smoke wisps add life to static billboards
- **Weight:** 0.5 | **Domain:** landmarks | **Applied:** 1/1 successful
- Drawing small animated circles with varying opacity on canvas creates convincing steam/smoke wisps. Using sin() with different phase offsets per wisp gives organic movement without complex physics. Works well for food stalls, incense coils, chimneys.
- **Evidence:** Session 81: 3 steam wisps per food stall with sin-based horizontal drift and opacity variation. Session 46: smoke wisps for incense coils. Both look natural and cost almost nothing performance-wise.

### Position-aware audio zones using proximity falloff with altitude gate
- **Weight:** 0.5 | **Domain:** audio | **Applied:** 1/1 successful
- Camera position relative to defined zone centers (lon/lat/radius) drives audio gain for zone-specific layers. Distance-based proximity (0-1 linear falloff from zone radius) combined with altitude gate (fade above threshold) creates convincing spatial audio without 3D panning. Enhancing existing gain nodes with position-aware modulation is non-breaking and additive.
- **Evidence:** Session 83: 3 zone types (casino, temple, harbour) with 4 new audio layers. Zero JS errors, smooth transitions via linearRampToValueAtTime, 3s update interval is responsive without performance cost.

### Official symbols and emblems add cultural depth
- **Weight:** 0.5 | **Domain:** landmarks | **Applied:** 1/1 successful
- Using a city's official symbols (like Macau's lotus emblem) as visual elements connects the digital twin to the real city's identity beyond just physical geography. The lotus is on Macau's flag and coat of arms, and Grand Lisboa is designed as a lotus bud — floating lotus flowers reinforce this symbolism naturally.
- **Evidence:** Session 84: 10 lotus flower billboards on Nam Van Lake and harbour. Culturally significant, visually beautiful, fills the day/night balance gap as an always-active feature.

### Heritage district ground-level transport adds cultural authenticity
- **Weight:** 0.5 | **Domain:** animation | **Applied:** 1/1 successful
- Adding unique transport types specific to a city's heritage (like Macau's triciclo pedicabs) fills animation gaps in areas dominated by static cultural elements (tiles, lanterns, signs). Ground-level moving entities (3m altitude) bring life to pedestrian zones that otherwise only have stationary billboard features.
- **Evidence:** Session 85: 4 triciclos on 3 heritage routes (Senado Square, Ruins, Barra). Follows proven CallbackProperty ping-pong pattern from ferries/junks. Zero JS errors, passed desktop/mobile checks.

### Distributed small light points create coastline-tracing glow effects
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Placing many small radial gradient billboard entities along geographic features (waterfronts, promenades, paths) creates a 'string of pearls' ambient glow visible from overview altitude. Using the bridge lights pattern (CallbackProperty scale tied to _currentGlowIntensity) ensures consistent night-only behavior. Per-path color variation within a warm palette prevents monotony.
- **Evidence:** Session 86: ~55 promenade lights across 5 waterfront paths. Follows bridge lights pattern exactly. Zero JS errors, passed desktop/mobile checks. Visible from bird's-eye at night.

### CSS cloud overlays are effective weather-reactive sky atmosphere
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- CSS div elements with blur filter and keyframe drift animation create convincing cloud wisps without CesiumJS entity overhead. Tying opacity to real weather API cloud_cover percentage makes them weather-reactive. Placing below color grading z-index means they automatically get time-of-day tinting. Staggered sizes, positions, speeds, and delays prevent mechanical feel.
- **Evidence:** Session 96: 7 cloud wisps with blur(40px), weather-reactive opacity. Zero JS errors, passed desktop/mobile. First sky-level atmospheric effect in the project.

### Larger canvas entities with detail reward night scenes
- **Weight:** 0.5 | **Domain:** animation | **Applied:** 1/1 successful
- Drawing a larger canvas (64x48 vs typical 32x32) allows more visual detail — multi-deck windows, string lights, hull details. Combined with higher scaleByDistance values and wider translucency range, large vessels are visible from bird's-eye view. Night-specific rendering (lit windows, glow halo, reflection gradient) creates dramatic visual difference from daytime.
- **Evidence:** Session 97: dinner cruise with 64x48 canvas, scale 1.2, scaleByDistance near=2.0/far=0.6. Warm interior glow and deck lights clearly visible at night from overview altitude.

### Canvas forked lightning with recursive branching creates realistic bolts
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Drawing lightning bolts via recursive canvas path segments with random horizontal jitter creates convincing forked bolts. Three-layer glow (wide dim outer, medium mid, thin bright core) per branch provides depth. Combined with double screen flash (bright 60ms + secondary 40ms) and delayed procedural thunder, it creates a complete storm effect. Integrating into existing weather/typhoon systems via simple start/stop lifecycle keeps it clean.
- **Evidence:** Session 98: forked lightning bolts up to 4 branch depth, double flash, procedural thunder with rumble + crackle layers. Zero JS errors, clean typhoon demo integration.

### CSS Grid with explicit row/column placement for tabular game data
- **Weight:** 0.5 | **Domain:** interactivity | **Applied:** 1/1 successful
- Using CSS Grid with grid-auto-flow: column and explicit grid-row/grid-column style on each cell allows precise placement of baccarat road scorecard data. The Big Road pattern requires cells to stack vertically within columns and dragon-tail horizontally when overflowing — grid placement handles this naturally without complex table/flex layout. Dynamic grid-template-columns via JS adapts to data size.
- **Evidence:** Session 101: Big Road scorecard with 6-row grid, column-based streaks, dragon tail overflow. 12 cells across 6 columns rendered correctly on both desktop and mobile.

### CSS particle celebrations reward user actions and reinforce engagement
- **Weight:** 0.5 | **Domain:** interactivity | **Applied:** 1/1 successful
- Spawning temporary CSS particle elements (chips, confetti, sparkles) on positive outcomes makes interactive features feel more rewarding. Key design choices: scale intensity with outcome magnitude, use CSS custom properties for per-particle randomization, auto-cleanup containers after animation, and respect prefers-reduced-motion. The celebration should enhance, not block, the underlying UI.
- **Evidence:** Session 103: golden chip cascade on baccarat wins. 8-28 chips based on net win amount. Staggered delays/durations/rotations via CSS custom properties. Zero JS errors, mobile-responsive, auto-cleanup at 3.5s.

### Regulatory/safety details add skyline authenticity
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Adding real-world regulatory elements (aviation obstacle lights, warning lights, signal markers) creates an 'uncanny familiarity' — visitors may not consciously notice them, but their absence would make the scene feel subtly wrong. These features are simple to implement (single billboard entity per location) but add significant authenticity to night scenes.
- **Evidence:** Session 105: 8 red beacon lights on tall buildings using bridge lights pattern. ~55 lines of code, zero JS errors, follows proven CallbackProperty + glow gating approach.

### CSS crepuscular rays enhance golden hour without entity overhead
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Multiple CSS div rays with linear-gradient backgrounds, blur filter, and transform rotation create convincing sun ray (god ray) effects. Time-gating to dawn and golden hour windows with smooth ramps, weather-reactive cloud dampening, and staggered pulse animations make them feel natural. Layering above color grading (z-index 43) lets rays shine 'through' the atmosphere overlay.
- **Evidence:** Session 106: 10 rays at varied angles (-35 to +38 deg), blur(6px), pulse animations 15-28s. Zero JS errors, visible on desktop and mobile, inactive during midday/night. Weather dampening from 1.0 (clear) to 0.2 (100% cloud cover).

### Multi-layer CSS fog with staggered drift creates convincing mist
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Multiple overlapping div elements with radial gradients, large blur filters (35-60px), and different keyframe drift animations at different viewport heights create convincing atmospheric fog/mist. Each layer has distinct size, opacity, blur radius, color, and animation speed — preventing the uniform look that a single fog overlay would produce. Weather-reactive opacity scaling (humidity, fog codes) adds realism. Bottom-anchored radial gradients with transparent falloff naturally simulate low-lying ground fog.
- **Evidence:** Session 109: 5 mist layers with 3 drift keyframes, blur 35-60px, radial-gradient anchored at bottom. Active class toggled by getMacauHour(). Zero JS errors, passes desktop and mobile checks.

### CSS radial-gradient creates natural rainbow bands
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Using radial-gradient with concentric color stops at 2% intervals creates convincing rainbow spectral bands. Centered at bottom of element with the element positioned low in viewport shows only the upper arc. blur(4px) softens the bands to look natural. Condition-gating (daytime + rain + partial sun) ensures it appears realistically. 12s transition creates a slow, natural fade matching real rainbow appearance.
- **Evidence:** Session 107: 7-band rainbow arc visible during/after rain. Zero JS errors, renders correctly on desktop and mobile. Integrates with existing weather data (currentWeather.cloud_cover, isRainyCode, isHeavyRain).

### Complementary features in the same area compound visual richness
- **Weight:** 0.5 | **Domain:** landmarks | **Applied:** 1/1 successful
- Adding string lights to areas that already have food stalls and red lanterns creates a layered, cohesive night market atmosphere. Each feature is simple alone, but together they produce a visually rich scene that feels authentic. When planning new features, check what already exists in the target area and design to complement it.
- **Evidence:** Session 111: 8 string light sets added to areas with existing food stalls (S81) and red lanterns (S38). Combined effect creates convincing night market ambiance at Rua do Cunha and Senado Square.

### Casino-branded shuttle buses with route-specific colors add transport variety
- **Weight:** 0.5 | **Domain:** animation | **Applied:** 1/1 successful
- Defining per-route color objects (body, accent, text) and passing them to a shared canvas drawing function creates visually distinct vehicles without duplicating drawing code. Casino text labels on the bus sides add identity. Always-active (24/7) shuttle buses fill a gap — most transit features are time-gated, but shuttles run continuously like real Macau.
- **Evidence:** Session 116: 6 shuttle buses on 3 routes with 3 distinct color schemes (gold/Lisboa, purple/Galaxy, blue/COD). Zero JS errors, passed desktop/mobile checks. Reuses proven CallbackProperty ping-pong pattern.

### Speed variation in transport entities adds visual dynamism
- **Weight:** 0.5 | **Domain:** animation | **Applied:** 1/1 successful
- Adding faster transport entities (water taxis at 28-35s cycles) alongside slower ones (ferries at 50-55s, junks at 85-100s) creates visible speed contrast on the harbour. The eye is drawn to the fastest-moving objects, making the harbour feel busier and more dynamic. Using the same CallbackProperty ping-pong pattern but with shorter durationSec is all that's needed.
- **Evidence:** Session 129: 3 water taxis on 2 routes with 28-35s cycles vs ferries at 50-55s. Same exact code pattern, just faster. Zero JS errors, passed desktop/mobile checks.

### Gamification via discovery tracking encourages exploration of existing content
- **Weight:** 0.5 | **Domain:** interactivity | **Applied:** 1/1 successful
- Adding a progress tracker that records which landmarks a user has visited turns passive browsing into active exploration. The key ingredients are: localStorage persistence (reuse baccarat pattern), hook into existing showLandmarkCard() to register discoveries automatically, progress bar + counter in the Explore panel for ambient awareness, toast notifications for immediate feedback, and checkmarks on discovered items for persistent visual status. The gamification layer adds engagement value without any new 3D entities or features — it purely leverages existing content.
- **Evidence:** Session 156: discovery tracker with ~110 lines. localStorage Set persistence, progress bar, checkmarks, toast notifications, completion celebration. Zero JS errors, passed desktop and mobile checks. Integrates cleanly with existing showLandmarkCard() and buildAttractionItem() functions.

### Conditional compound weather effects add cinematic depth
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Layering a new atmospheric effect that requires MULTIPLE conditions (night AND rain) creates rare, cinematic moments that reward exploration at the right time. The wet neon reflection effect compounds existing rain drops + splash ripples with a bottom-viewport neon glow layer. Using _currentGlowIntensity as the night gate (rather than hour check) ensures it responds correctly to the time slider. The IIFE-with-setInterval pattern (5s check cycle, 6s initial delay) matches rainbow and mist updaters. A base sheen layer under the neon streaks establishes the 'wet surface' foundation, making the colored streaks read as reflections rather than random color blobs.
- **Evidence:** Session 157: wet neon road reflections with 12 casino-matched colors, base sheen layer, gradient mask fade. Active during rainy nights + typhoon demo. ~85 lines of CSS+JS. Zero JS errors, passed desktop and mobile checks. Effect properly activates/deactivates when conditions change.

### CSS radial gradient drops with streaking animation simulate camera lens effect
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Creating water drop elements with radial-gradient (highlight at 35% 30% for refraction) and a separate 'streaking' variant that uses scaleY elongation + translateY creates convincing camera lens raindrop effects. Key techniques: two animation variants (static evaporation vs streak-down), CSS custom properties for per-drop randomization (--drop-dur, --streak-dist), will-change for GPU acceleration, and auto-removal via setTimeout matching animation duration. The IIFE-with-setInterval spawner pattern (matching rain splashes, neon reflections) keeps lifecycle simple.
- **Evidence:** Session 159: lens raindrops with 7-18 drops, 35% streaking ratio, mobile-responsive (60% fewer). Zero JS errors, passed desktop and mobile checks. Integrates with existing weather/typhoon activation flow.

### CSS bokeh orbs add cinematic depth to night scenes
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Soft-focus circular light orbs (radial gradients + CSS blur) drifting slowly across the viewport create a cinematic depth-of-field effect. Using a casino-inspired color palette (gold, pink, cyan, magenta, amber) ties the effect to the scene's identity. CSS custom properties for per-orb animation parameters (drift direction, opacity, scale) with staggered delays prevent mechanical feel. Night-gated via existing _currentGlowIntensity for smooth dusk/dawn transitions.
- **Evidence:** Session 171: 18 bokeh orbs with 7 colors, 20-70px sizes, 8-22px blur, 15-40s staggered animation cycles. Zero JS errors, passed desktop+mobile checks. Purely CSS-driven, no canvas or JS animation loop needed.

### Extending existing API calls for richer data displays
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Adding &hourly= parameters to the existing Open-Meteo API call extends the weather feature from current-only to a forecast timeline with minimal code. The API already supports forecast_hours to limit response size. Rendering the data in an expandable panel keeps the default UI clean while adding depth for engaged visitors.
- **Evidence:** Session 172: Added hourly forecast to existing fetchWeather() by appending &hourly=temperature_2m,weather_code,precipitation_probability&forecast_hours=12. Response size barely increased. 6-hour forecast panel with click-to-expand toggle, zero JS errors.

### CSS heat shimmer with temperature and time gating adds midday atmosphere
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Semi-transparent warm-amber gradient bands with CSS blur and scaleY animation create a convincing heat shimmer rising from the ground. Gating by both time-of-day (midday) AND real temperature from weather API creates a conditional atmospheric effect that only appears when conditions warrant it. CSS mask-image gradient fades the effect naturally from ground up.
- **Evidence:** Session 173: 8 heat wave bands active 9:30 AM-4 PM when temp > 22°C. Zero JS errors, renders on both desktop and mobile. Follows proven CSS overlay pattern from harbor mist, sun rays, and bokeh lights.

### Distributed radial gradient glow bands create convincing light pollution
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Multiple large, blurred radial-gradient CSS elements at different viewport positions create convincing urban light pollution effect. Key: position bands to represent real geographic light sources (casino districts), use CSS mask-image gradient to fade from horizon up, 60px blur for atmospheric diffusion, very low opacity (0.04-0.10) to enhance rather than obscure. Weather reactivity adds realism — fog increases scatter (brighter), heavy clouds dampen.
- **Evidence:** Session 174: 5 glow bands representing Cotai Strip, Peninsula, harbour, Taipa, and diffuse upper scatter. Night-only via _currentGlowIntensity, weather-reactive, zero JS errors on desktop and mobile.

### CSS compass dial with shortest-path rotation for wind direction
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- A compact CSS compass dial (38px circle with cardinal markers and a gold needle) visualizes wind direction data from the weather API. Key: track cumulative rotation in a JS variable and calculate shortest-path delta (normalize to ±180°) before adding to avoid the needle spinning 350° when it should go 10°. CSS transition handles the smooth animation. Border color states (calm/windy/gusty) provide at-a-glance wind intensity without reading numbers.
- **Evidence:** Session 175: wind compass dial with 1.8s cubic-bezier transition, cardinal labels, gust warnings. Extended Open-Meteo API to include wind_direction_10m and wind_gusts_10m. Zero JS errors on desktop and mobile.

### Inverted weather modulation creates complementary daytime effects
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Most atmospheric effects are dampened by clouds (heat shimmer, sun rays). Inverting this relationship — where cloud cover INCREASES the effect — creates a natural complement. Cloud shadows require clouds to exist, so more cloud cover = more visible shadows. This fills the gap where cloudy days previously reduced visual interest by removing other effects.
- **Evidence:** Session 177: Cloud shadows use cloudFactor that scales from 0 (clear sky < 15%) to 0.85 (overcast > 70%). When heat shimmer is dampened by clouds, cloud shadows pick up the slack, ensuring visual dynamism at all cloud levels during daytime.

### Cool-warm color temperature contrast adds visual depth to night scenes
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Adding a cool silver-blue element (moonlight) alongside warm amber/gold elements (casino glow, bokeh, neon) creates natural visual depth through color temperature contrast. The human eye perceives warm vs cool light as different distances and light sources, making the scene feel richer without adding complexity. Concentrating sparkle points in a central column (70% within 35-65% horizontal) creates a convincing moonlit water path without needing actual water surface rendering.
- **Evidence:** Session 178: Moonlit water path with 5-tone silver-blue palette (rgb 170-240, 195-245, 230-255) complements warm amber horizon glow (rgb 255,195-220,60-150) and gold bokeh lights. The cool/warm contrast is immediately visible at night.

### Dual-palette time-gated effects enhance dawn/dusk transitions
- **Weight:** 0.5 | **Domain:** atmosphere | **Applied:** 1/1 successful
- Using two distinct color palettes for sunrise vs sunset in the same CSS overlay system adds visual variety without doubling code. Sunrise palettes (warm gold, peach, pink) differ from sunset (deep orange, coral, rose, violet). Partial cloud cover (20-50%) actually enhances sunset/sunrise colors through atmospheric scattering — so weather modulation should boost at moderate clouds, not just dampen. This makes the effect weather-reactive in a more nuanced way than simple linear dampening.
- **Evidence:** Session 179: 5 sky gradient bands with separate SUNSET_BANDS and SUNRISE_BANDS palettes. Cloud cover 20-50% gets 0.9-1.0 multiplier (enhanced), while >75% gets 0.2 (dampened). Zero JS errors on desktop and mobile.

### Canvas tower silhouette with distributed sparkle points creates convincing light show
- **Weight:** 0.5 | **Domain:** rendering | **Applied:** 1/1 successful
- Drawing a structural outline (tower/building silhouette) on canvas and distributing animated sparkle points within the shape creates a convincing light show effect. Using isInsideTower() hit-testing during sparkle placement ensures lights only appear on the structure. Two-mode animation (idle twinkle + periodic cascade) creates a realistic light show cycle. Golden-white color shift at peak brightness makes individual sparkles pop.
- **Evidence:** Session 181: Parisian Eiffel Tower sparkle — 65 sparkle points on canvas-drawn tower outline, two animation modes, zero JS errors, visible from Cotai bird's-eye view.

### Canvas cable-stay fan pattern with sweep animation enhances bridge identity
- **Weight:** 0.5 | **Domain:** rendering | **Applied:** 1/1 successful
- Drawing cable-stay fan lines from a central tower apex to a horizontal deck line on a tall canvas, then animating which cable is 'active' (bright) by sweeping the active index left-to-right and back, creates a distinctive 'harp strum' visual. The sweep proximity glow (adjacent cables glow dimmer) creates a natural trailing effect. Reuses the proven IIFE + setInterval + canvas.toDataURL pattern from the Eiffel Tower sparkle. Sharing one canvas redraw across both tower entities halves the drawing cost.
- **Evidence:** Session 183: 2 tower entities for Sai Van Bridge with 16 cables each, 300ms setInterval, night-only. Zero JS errors on desktop and mobile. 127 lines added.

## Anti-Patterns (What to Avoid)

### CesiumJS bloom post-processing with Google 3D Tiles
- **Severity:** high
- CesiumJS bloom applies to entire scene causing severe oversaturation/washout with Google 3D Tiles. Tried contrast values 119 down to 40 — all caused unacceptable results.
- **Fix:** Use billboard entities with canvas radial gradients for glow effects instead of scene-wide bloom

### CallbackProperty for billboard image causes black rectangles
- **Severity:** high
- Using CesiumJS CallbackProperty to dynamically update billboard.image with canvas elements renders as solid black rectangles with Google 3D Tiles.
- **Fix:** Use direct billboard.image = canvas.toDataURL() assignment in setInterval instead

### Parallax on mobile breaks layout
- **Severity:** medium
- Parallax effects on mobile conflict with position:relative layouts and feel exaggerated on small viewports.
- **Fix:** Disable parallax on mobile via media query or JS check

### Accumulating absolute-positioned bottom UI elements cause mobile overlap
- **Severity:** high
- When multiple UI elements use position:absolute with bottom offsets on mobile, adding new elements over time causes overlaps that individual session tests miss. The action-prompt (bottom:130px), feature-tips (bottom:120px), and minimap (bottom:64px) all had similar heights, creating a 3-way overlap in the 640-780px zone.
- **Fix:** After adding any new bottom-positioned UI element, check ALL bottom elements for overlap — not just the new one vs its nearest neighbor. Use JS bounding-box intersection testing in audit sessions.

## Decisions

### How to represent Wynn Palace's curved facade as an LED light signature?
- **Chosen:** Use 4 parabolic arc tiers of LED nodes (14-18 per arc) with center-dip curvature, blooming center-outward cascade show, and Performance Lake reflection glow
- **Rationale:** Wynn Palace's most distinctive feature is its concave crescent-shaped golden glass curtain wall wrapping around the Performance Lake. Parabolic arcs with center-dip curvature naturally represent the crescent shape. Four gold tones (bright/warm/rich/deep) create vertical gradient matching the real building. Center-outward blooming cascade evokes a crescent opening or fan unfurling. Lake reflection glow at the base connects the LED signature to the adjacent Performance Lake fountain show. 13-minute cycle differentiates from MGM's 11-min and other signatures.

### How to represent MGM Macau's wave-shaped facade as an LED light signature?
- **Chosen:** Use 3 tiers of 16 sine-wave-positioned LED nodes with tier-specific gold tones, cascading ripple show from bottom-up, and Golden Lion entrance accent
- **Rationale:** The wave-shaped facade is MGM Macau's most distinctive architectural feature — three tiers of differently tinted gold glass. Sine wave node placement naturally represents the undulating facade. Three gold tones (light/medium/deep) map to the real building's glass tinting gradient. Bottom-up cascade with center-outward ripple evokes rising ocean waves matching the South China Sea inspiration. The Golden Lion entrance is the other iconic feature, represented as a warm radial glow at the base.

### How to create a figure-8 shaped LED light signature?
- **Chosen:** Use parametric lemniscate curve (cos(t)/(1+sin²(t))) to place 64 LED nodes, with dual chase lights as the show mode
- **Rationale:** The lemniscate of Bernoulli naturally produces the figure-8 shape. 64 nodes provide smooth curve resolution while keeping canvas draw cost low. Dual chase lights (180° offset) racing around the path create a more dynamic effect than a single trail and better suit the rotational nature of a Ferris wheel.

### How to add weather forecast to the digital twin?
- **Chosen:** Extend existing Open-Meteo API call with hourly parameters, render in expandable panel below weather block
- **Rationale:** Progressive disclosure — forecast toggle keeps the default weather display clean while adding depth for interested visitors. Reusing weatherCodeInfo() for icons and the existing weather block positioning avoided new layout complexity. 6 hours is enough to be useful without overwhelming the UI.

### How to enhance walk tour for documentary feel?
- **Chosen:** Compose existing systems: auto-open landmark cards (with S75 photo gallery), add slow orbit camera, add progress bar/counter
- **Rationale:** Reusing existing showLandmarkCard() and orbit patterns minimized new code while maximizing impact. The photo gallery from S75 already provides the visual richness needed.

### How to make flythrough labels more cinematic?
- **Chosen:** Multi-line HTML with staggered CSS transitions — title + Chinese + tagline + decorative lines
- **Rationale:** Pure CSS approach (no JS animation library) keeps it lightweight. innerHTML generation in showStageLabel() keeps the function signature simple while supporting rich content. Gold gradient text matches site branding.

### How to add neon signage to the city?
- **Chosen:** Canvas-drawn billboard entities with Chinese text + glow halos, setInterval for flicker animation
- **Rationale:** Follows proven billboard + canvas + setInterval pattern (used by incense coils, LED facades, smoke wisps). Canvas shadowBlur creates convincing neon glow without post-processing. Night-only via _currentGlowIntensity threshold.

### How to represent street food culture?
- **Chosen:** Canvas-drawn billboard entities with warm lantern awnings, Chinese food names, and animated steam wisps
- **Rationale:** Follows proven billboard + canvas + setInterval pattern. Warm orange/red color palette contrasts with cool blue/purple neon signs. Always-active visibility (not night-only) adds daytime life. Real Macau food names add cultural authenticity.

### How to represent Portuguese colonial heritage?
- **Chosen:** Canvas-drawn azulejo tile panel billboards with traditional blue-and-white patterns, Portuguese place names, and 4 tile motifs
- **Rationale:** Follows proven billboard + canvas + setInterval pattern. Blue-and-white color palette provides strong visual contrast to warm Chinese elements. Portuguese place names add linguistic authenticity. Multiple pattern types (cross, floral, diamond, wave) prevent visual monotony.

### How to add lotus flower cultural symbolism to the scene?
- **Chosen:** Canvas-drawn lotus billboard entities with CallbackProperty drift and scale animation on water surfaces
- **Rationale:** Follows proven billboard + CallbackProperty pattern. Lotus is Macau's official emblem — deeply meaningful. Placed on water surfaces (Nam Van Lake, Inner Harbour) for authenticity. Always-active to help balance the day/night feature ratio. Circular drift + breathing pulse creates natural floating-on-water feel without complex physics.

### How to add heritage district ground-level movement?
- **Chosen:** Triciclo pedicab billboard entities with CallbackProperty ping-pong movement on 3 heritage routes
- **Rationale:** Triciclos are uniquely Macau — once the primary transport, now a tourist icon. Fills animation gap in heritage district where most features are stationary billboards. Follows proven ferry/junk movement pattern. Transit section placement (not Heritage) distinguishes transport from static cultural elements.

### How to add waterfront ambient lighting?
- **Chosen:** Distributed small radial gradient billboard entities along 5 promenade paths at 3m altitude, night-only via _currentGlowIntensity
- **Rationale:** Follows proven bridge lights pattern exactly. Small light points are visible from bird's-eye but don't interfere with ground-level 3D tiles. Warm-amber palette with per-path variation creates organic coastline glow without oversaturation.

### How to add morning-specific cultural life to the scene?
- **Chosen:** Animated tai chi billboard groups at 5 park/waterfront locations, visible 5-9 AM with fade ramps, setInterval canvas redraw for pose animation
- **Rationale:** Tai chi is quintessential Chinese morning culture and very authentic for Macau parks. Fills temporal gap — all previous time-gated features were night-only. Canvas redraw at 400ms interval is smooth without being expensive. 5 locations across Peninsula and Taipa spread the feature geographically.

### How to fill the afternoon temporal gap (12-7 PM)?
- **Chosen:** Fishing sampan billboard entities on Inner Harbour routes, time-gated 15:00-19:00, with canvas bobbing animation and minimap tracking
- **Rationale:** Macau originated as a fishing village ('Bay of A-Ma') — fishing sampans are deeply historically significant. Afternoon is the natural time for fishers to return with catch. Follows proven tai chi time-gating pattern (getMacauHour + fade ramps) and junk boat movement pattern (CallbackProperty ping-pong). Now morning, afternoon, and night all have time-specific features.

### How to add sky-level atmosphere without more CesiumJS billboard entities?
- **Chosen:** CSS cloud div overlay with blur filter and keyframe drift animation at z-index below color grading
- **Rationale:** CSS approach avoids adding more CesiumJS entities (26 systems already), is more performant, and automatically inherits time-of-day color grading from the z-index layering. Weather-reactive via existing currentWeather global. First atmospheric effect targeting the sky rather than ground/water level.

### How to add a prominent evening harbour feature?
- **Chosen:** Large dinner cruise vessels with detailed canvas rendering, night-specific glow, and 19-23 time gate
- **Rationale:** Dinner cruises are authentic Macau harbour activity. Larger 64x48 canvas allows multi-deck detail. Evening time window (19-23) fills the post-sunset period between golden hour and late-night fireworks. Follows proven ferry/junk movement pattern with ping-pong route, plus proven sampan/bus time-gating pattern.

### How to add dramatic storm effects beyond rain and wind?
- **Chosen:** Canvas-drawn forked lightning bolts + CSS screen flash + Web Audio API thunder, triggered by WMO thunderstorm codes and typhoon T8+
- **Rationale:** Lightning is the most cinematic missing piece of the weather system. Canvas drawing allows recursive forked bolts with glow. CSS flash overlay is simpler than CesiumJS scene manipulation. Web Audio thunder reuses proven procedural audio pattern. Dual trigger (weather API + typhoon demo) ensures visibility since real thunderstorms are rare.

### How to deepen the baccarat experience beyond card dealing?
- **Chosen:** Big Road (大路) scorecard below stats — CSS Grid with explicit cell placement, column-based streaks, tie marks as green dot overlays
- **Rationale:** Big Road is THE most iconic visual element of Macau casinos — every baccarat table has electronic scorecards. Enhances existing feature rather than building new entity. CSS Grid handles the column/row placement naturally. Small visual footprint (54px height) doesn't crowd the already-full baccarat overlay. Future: could add Bead Plate, Big Eye Boy, Small Road, Cockroach Pig for complete scorecard set.

### How to add authentic skyline detail to tall buildings at night?
- **Chosen:** Red radial gradient billboard entities at building-top altitudes with slow blink via CallbackProperty, night-only glow gating
- **Rationale:** Aviation obstacle lights are mandatory on tall buildings worldwide — every Macau skyscraper has them. Follows exact bridge lights pattern (CallbackProperty scale, _currentGlowIntensity gating). Simple 3s blink cycle (1.5s on/1.5s dim) with staggered phases per building prevents synchronization. Small 12px canvas icon is visible from overview but unobtrusive.

### How to add early morning atmosphere beyond sun rays?
- **Chosen:** Multi-layer CSS fog/mist overlay with radial gradients, blur filters, and staggered drift animations at bottom of viewport
- **Rationale:** CSS approach avoids more CesiumJS entities. Multiple layers with different heights, speeds, and opacities create depth that a single fog div cannot. Humidity/fog weather reactivity makes it feel connected to real conditions. Complements (not competes with) the existing sun rays at dawn — rays are geometric beams above, mist is soft blanket below.

### How to add a rainbow weather effect to complement the rain system?
- **Chosen:** CSS radial-gradient div with 7 spectral bands, condition-gated to daytime + light rain + partial sun, with 10-min post-rain memory
- **Rationale:** CSS approach (no canvas/entity) follows proven weather overlay pattern. radial-gradient is simpler and more natural than conic-gradient for concentric rainbow bands. Post-rain memory (10 min window) is key — real rainbows often appear as rain stops, not during heavy rain. Cloud cover threshold (85%) ensures sun visibility is plausible.

### How to add night market ambiance to food areas?
- **Chosen:** Canvas-drawn string light billboard entities with catenary wire and warm golden twinkle bulbs at 7-9m altitude
- **Rationale:** String lights are universally recognizable night market signifiers. Canvas + setInterval pattern is proven reliable. Placing at existing food/heritage locations (Rua do Cunha, Senado Square, etc.) compounds with food stalls and red lanterns for layered richness. Always-active with night boost means visible in all conditions.

### How to let visitors experience all time-gated features without visiting at different hours?
- **Chosen:** requestAnimationFrame time-lapse animating _timeOverride 0-24 over 48 seconds, small play button next to time slider
- **Rationale:** Reuses existing time override system (slider, updateCesiumClock, updateNeonGlow) — zero new infrastructure. Placing the button in the clock block (next to LIVE) is contextually obvious. 48s duration (2s/hour) is long enough to appreciate changes but short enough to watch in full. Returns to live time on completion for clean UX.

### How to deepen Portuguese colonial heritage beyond decorative tiles?
- **Chosen:** Bilingual street name sign billboards at 8 famous intersections, canvas-drawn with tile border aesthetic, static (no animation)
- **Rationale:** Street name signs are one of the most photographed features of historic Macau. Blue-and-white tile style matches azulejo panels (S82). Static billboards (no setInterval) because signs don't animate. 6m altitude matches real sign height. Portuguese + Chinese text reinforces the bilingual identity. Complements azulejo tiles, food stalls, and red lanterns in the heritage district.

### How to add iconic Macau ground transport beyond tour buses and triciclos?
- **Chosen:** Casino free shuttle buses (發財車) on 3 routes between ferry terminals and casinos, always active with casino-branded colors
- **Rationale:** Casino shuttles are the most ubiquitous Macau transport — every tourist uses them. Always-active (24/7) fills gap since tour buses are midday-only. Per-route casino branding (gold/Lisboa, purple/Galaxy, blue/COD) adds visual variety. Follows proven CallbackProperty ping-pong pattern from ferries/triciclos.

### How to add traditional Chinese architectural elements to complement Portuguese heritage features?
- **Chosen:** Canvas-drawn paifang (牌坊) gateway arch billboards at 5 key Macau entrance locations, static (no animation)
- **Rationale:** Paifang are iconic Chinese architectural gateways found at important entrances throughout Macau. Complements Portuguese heritage (azulejo tiles, street signs) with Chinese counterpart. Static billboard pattern from S114 street signs — no setInterval needed for non-animated structures. Red/gold/green color palette provides warm contrast to blue-white Portuguese elements. 5 diverse locations (Border Gate, food street, temple, neighborhood, historic street) spread the feature geographically.

### Which landmark to add to complete the Prime Directive casino list?
- **Chosen:** MGM Macau (Peninsula) as a full LANDMARKS entry with info card, photos, and integration into all night-effect systems
- **Rationale:** MGM was the last casino explicitly named in the Prime Directive that was missing from LANDMARKS. The Peninsula location (not MGM Cotai) is the original and more iconic property with the wave-shaped golden facade and 10m lion. Adding it as a data-driven landmark (array entries only, no new code) leveraged the existing architecture for maximum impact with minimal risk.

### How to let visitors experience the iconic Macau Tower panoramic view?
- **Chosen:** Camera flight to 240m + slow onTick orbit with cinematic CSS overlay, triggered by landmark card button
- **Rationale:** The observation deck is Macau Tower's defining experience. Reusing the orbit pattern (separate _towerOrbitHandle like walk tour) keeps it independent from other sequences. Small orbit radius (0.0004°) keeps camera near the tower while rotating. Button in the existing landmark card is the natural discovery point. Blue accent color distinguishes from gold casino buttons. Future: could add similar viewpoints for other landmarks (e.g., Golden Reel ride at Studio City).

### How to add speed variety to harbour water traffic?
- **Chosen:** Water taxi speedboats with shorter cycle times (28-35s) on 2 harbour routes, same CallbackProperty ping-pong pattern as ferries
- **Rationale:** All existing water transport is slow (ferries 50-55s, junks 85-100s, dinner cruise 120s). Water taxis are authentic Macau harbour transport and their speed (nearly 2x ferries) creates visible contrast. Canvas wake spray trail differentiates them visually. Always-active (not time-gated) adds constant harbour dynamism. Bright blue minimap dot is distinct from cyan ferry dots.

### How to make baccarat more engaging for returning visitors?
- **Chosen:** Persist bankroll and game stats in localStorage, show session stats and welcome back indicator
- **Rationale:** Without persistence, every visit starts at HK$10,000 with no sense of history. localStorage is the simplest persistence mechanism — no server needed, works offline, instant. Tracking meta-stats (hands played, biggest win, peak bankroll) adds a sense of progression beyond just the current balance. The welcome back message is subtle (4s fade) — enough to feel personalized without being intrusive. Reset button provides a clean escape hatch.

### How to make the time-gated feature system more discoverable?
- **Chosen:** City Pulse expandable overlay with feature list, active/inactive status, click-to-fly, and next-up preview
- **Rationale:** The project has 11+ time-gated features but visitors only see what's active at the current Macau hour. A meta-UI that reads getMacauHour() against feature time windows surfaces the temporal system without adding entities. The collapsed toggle provides passive awareness (count), while the expanded list enables active exploration. Integration with the time slider means visitors can scrub through the day and see features light up. Click-to-fly reuses the existing flyToAttraction pattern for zero new camera logic.

### How to encourage visitors to explore all 30 landmarks?
- **Chosen:** Gamification via discovery progress tracker — localStorage Set, progress bar in Explore panel, checkmarks, toast notifications, completion celebration
- **Rationale:** With 30 landmarks, most visitors will only click a few. A progress tracker turns passive browsing into active exploration by showing how many remain undiscovered. The pattern follows the proven localStorage approach from Session 152 (baccarat bankroll). Hooking into the existing showLandmarkCard() means zero new user actions needed — any existing interaction counts. The Explore panel is the natural home for the progress bar since that's where landmarks are listed.

### How to add wet-road neon reflection effect during rainy nights?
- **Chosen:** CSS overlay at bottom 30% with gradient mask, base dark sheen layer + animated neon-colored gradient streaks, gated by _currentGlowIntensity > 0.1 AND rain detection, IIFE with 5s setInterval
- **Rationale:** CSS approach follows proven atmospheric effect pattern (rain splashes, harbor mist, sun rays). Using _currentGlowIntensity as night gate rather than raw hour check ensures consistency with time slider and existing neon system. Base sheen layer establishes the 'wet surface' so streaks read as reflections. IIFE self-containment matches rainbow/mist pattern. 12 casino-matched colors connect the effect to the city's actual landmarks.

### How to add Portuguese cobblestone calçada pavement to heritage areas?
- **Chosen:** Canvas-drawn billboard entities at 4-6m altitude with 3 motif types (wave, fan, compass), 500ms animation interval, distance-based visibility
- **Rationale:** Follows proven azulejo tile panel pattern exactly (canvas + billboard + setInterval). Ground-level altitude (4-6m) ensures visibility during street-level exploration without cluttering bird's-eye view. Three distinct motifs prevent visual monotony while matching real Macau locations — Mar Largo waves at Senado Square, fan shells at colonial squares, compass rose at Barra (navigational heritage). Completes the Portuguese heritage trinity alongside azulejo tiles (S82) and street signs (S114).

### How to visualize real-time wind direction in the weather display?
- **Chosen:** Compact CSS compass dial (38px) with gold needle, N/E/S/W cardinal markers, direction label, speed and gust display, integrated into existing weather block
- **Rationale:** Wind speed was already displayed as text but direction was neither fetched nor shown. A compass dial communicates direction instantly without reading numbers. CSS-only implementation (no canvas) keeps it lightweight. Placed between weather-details and typhoon-signal in the existing weather block for natural information flow. Shortest-path rotation math prevents jarring 350° spins. Visual states (calm/windy/gusty) via border-color changes give at-a-glance intensity without extra UI.

### How to add dynamic daytime atmospheric effects tied to cloud cover?
- **Chosen:** CSS overlay with 6 radial gradient shadow patches, drift keyframe animations, cloud cover drives intensity inversely from most effects
- **Rationale:** Most daytime atmospheric effects (heat shimmer, sun rays) are dampened by clouds, creating a visual gap on cloudy days. Cloud shadows fill this gap because they require clouds to exist — more cloud cover means more shadows. The inverted modulation creates a complementary system where visual dynamism is maintained regardless of cloud level. CSS overlay follows the proven heat-shimmer/city-glow pattern exactly. z-index 40 (lowest atmospheric layer) ensures shadows render behind other effects.

### How to add signature Eiffel Tower sparkle light show at The Parisian?
- **Chosen:** Canvas-drawn tower silhouette billboard with 65 distributed sparkle points, two-mode animation (idle twinkle + periodic cascade), night-only
- **Rationale:** The Parisian already has 5 generic casino effects (neon glow, sky beam, searchlight, LED facade, obstacle light) but nothing specific to its defining feature — the Eiffel Tower. Canvas billboard at 85m altitude with bottom-origin placement keeps the sparkle effect anchored to the tower location. Two animation modes (idle twinkle + 5-min cascade every 15 min) match the real tower's light show schedule. Using isInsideTower() hit-testing during sparkle placement ensures natural distribution. IIFE with window._initEiffelSparkle exposure follows the same pattern as other self-contained feature modules.

### How to add distinctive identity to the Sai Van cable-stayed bridge beyond deck lights?
- **Chosen:** Canvas-drawn cable-stay fan pattern with sweep animation on 2 tower billboard entities, night-only
- **Rationale:** The existing bridge illumination (S29) gives all 3 bridges generic deck-level LED dots. Sai Van is the only cable-stayed bridge — its cable stays are its architectural signature. A canvas billboard per tower draws the cable fan from apex to deck, with a ping-pong sweep animation lighting cables in sequence. Sharing one canvas redraw for both towers halves draw cost. IIFE + window._initCableStayLights follows the Eiffel Tower sparkle pattern exactly.

### How to give the Grand Lisboa hero landmark a distinctive night identity beyond generic neon/beam effects?
- **Chosen:** Canvas-drawn radiating lotus petal billboard with two-mode animation (idle pulse + periodic bloom show), night-only at 210m altitude
- **Rationale:** Grand Lisboa already has 5 generic casino effects (neon glow, sky beam, searchlight, water reflection, obstacle light) but nothing specific to its defining architectural feature — the lotus-shaped crown. A canvas billboard at 210m (near the crown of the 258m tower) with 12 radiating petals creates a distinctive visual signature. Two animation modes (idle twinkle + 3-min bloom every 10 min) follow the same pattern as Eiffel sparkle. Center-origin vertical alignment works better than bottom-origin for a radiating effect. IIFE + window._initGrandLisboaCrown follows the established pattern. This elevates the hero landmark above generic effects.

### How to give the Macau Tower (tallest structure, 338m) a distinctive night identity?
- **Chosen:** Canvas-drawn tower silhouette with 12 horizontal LED bands, 5-color cycling, observation deck ring glow, traveling wave light show, night-only at 280m altitude
- **Rationale:** Macau Tower only had a tiny red obstacle beacon (12px) — invisible compared to casino effects. Its real-world LED lighting system changes colors at night. A taller canvas (48x128) with vertical tower silhouette and horizontal LED bands creates a visually distinct effect from the radial patterns of Grand Lisboa and Eiffel sparkle. Color cycling (5 colors vs single gold) differentiates it further. Traveling wave animation during light show is unique — lights pulse upward sequentially. 280m altitude centers the effect near the real observation deck. Completes the 'Big 4' landmark night signatures.

### How to give the Morpheus tower (City of Dreams, Cotai Strip) a distinctive night identity?
- **Chosen:** Canvas-drawn twisted figure-eight exoskeleton grid with 112 LED nodes, purple/violet palette, cascade show sweeping up the tower, night-only at 160m altitude
- **Rationale:** Morpheus is Zaha Hadid's last masterpiece — world's first free-form exoskeleton high-rise. Its real-world LED shows are spectacular. The twisted figure-eight grid pattern is architecturally unique and drawable as a 14-level × 8-node grid with pinch and twist parameters. Purple/violet palette matches the City of Dreams brand (previously 'rgba(180,140,255)' in neon glow zone). Cascade show uses an upward-sweeping wave, distinct from Grand Lisboa's radial bloom, Eiffel's cascade, Tower's traveling wave, and Sai Van's horizontal sweep. First Cotai Strip-specific signature — validates that the IIFE + canvas + setInterval pattern works beyond the Peninsula. 160m altitude matches Morpheus's ~160m height.

### How to give The Venetian Macao (world's largest casino) a distinctive night identity?
- **Chosen:** Canvas-drawn rippling horizontal golden bands evoking Venice canal water reflections, with campanile spire crown pulse and periodic cascade sweep, at 130m altitude
- **Rationale:** The Venetian's campanile tower is modeled after St. Mark's Campanile in Venice. A water-reflection ripple effect (horizontal bands drifting upward with wobble) thematically connects to Venice's canals and is visually distinct from all other signatures: Eiffel sparkle points, Sai Van cable sweep, Lisboa radial crown, Tower horizontal LED bands, Morpheus exoskeleton grid. Warm Venetian gold palette matches the building's golden aesthetic. 12 bands with varied speeds and wobble create organic water-light feel. 130m altitude appropriate for the campanile's height. 6th successful application of the IIFE + canvas + setInterval pattern.

### How to give Galaxy Macau (massive Cotai mega-resort) a distinctive night identity?
- **Chosen:** Canvas-drawn diamond-shaped LED lattice grid with ~90 nodes in 14x10 offset layout, radiating pulse show from center outward, gold/champagne palette, night-only at 120m altitude
- **Rationale:** Galaxy Macau's diamond-shaped facade is its architectural signature. A diamond boundary mask on an offset grid of LED nodes creates a faceted silhouette that reads clearly at distance. The radiating outward pulse show is visually distinct from all other signatures: Eiffel sparkle (random), Sai Van (horizontal sweep), Lisboa (radial bloom), Tower (upward wave), Morpheus (upward cascade), Venetian (upward ripple). Lattice connecting edges between nodes reference the geometric grid structure. Gold/champagne palette matches Galaxy's luxury branding without conflicting with Lisboa's warm gold or Venetian's amber gold. 120m altitude matches Galaxy's roofline. 7th successful application of the IIFE + canvas + setInterval pattern.

### How to enhance the Performance Lake fountain show with dynamic colors?
- **Chosen:** Add a 200ms setInterval that redraws jet billboard icons with time-varying colors using lerpColor interpolation, structured in 3 acts: color waves, fire bursts, rainbow finale
- **Rationale:** The existing fountain already has billboard entities and height animation via CallbackProperty. Adding a setInterval for color updates follows the same proven pattern used by 8 light signatures. A 3-act structure (waves → fire → finale) mirrors real-world choreographed fountain shows and creates variety within a single 3-minute performance. The lerpColor approach ensures smooth transitions rather than abrupt color switches. Adding a lake surface glow entity with averaged color creates a reflected-light effect that enhances the visual without adding entities to each jet.

