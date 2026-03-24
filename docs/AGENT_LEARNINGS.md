# Agent Learnings
*Auto-generated from data/knowledge.json — do not edit directly*
*Last updated: Session 106*

## Patterns (What Works)

### Enhancing existing features is high-impact with low risk
**Domain:** interactivity | **Weight:** 0.6 | **Applied:** 2/2 times
Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing systems (landmark cards, photo gallery, orbit camera). Building on proven patterns is fast and reliable.
**Evidence:** Session 76: enhanced walk tour in ~70 lines by reusing showLandmarkCard(), existing orbit pattern, and existing WALK_TOUR_STOPS data. Zero JS errors, passed mobile/desktop checks.
**Tags:** architecture, composability, feature-enhancement

### Separate tick handlers for independent orbit systems
**Domain:** interactivity | **Weight:** 0.5 | **Applied:** 1/1 times
When adding a new orbit behavior (walk tour orbit), use a separate onTick handler rather than reusing the global orbit system. This allows independent control — the walk tour orbit can be stopped/started without affecting the global orbit used after flythrough.
**Evidence:** Session 76: _walkTourOrbitHandle is managed independently from orbitHandle. Clean start/stop lifecycle prevents interference.
**Tags:** cesiumjs, animation, architecture

### CSS particle effects are lightweight alternatives to WebGL
**Domain:** rendering | **Weight:** 0.8 | **Applied:** 6/6 times
CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects.
**Evidence:** Used across sessions 3, 65, 66 for rain, wind streaks, and shooting stars. Session 96: cloud wisps. Session 102: rain splashes. Session 106: sun rays.
**Tags:** performance, css, animation

### Staggered animation delays prevent mechanical feel
**Domain:** animation | **Weight:** 0.8 | **Applied:** 10/10 times
Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion.
**Evidence:** Applied in pedestrians, seagulls, sky lanterns, flythrough title cards, neon signs, food stalls, lotus flowers, cloud wisps, and other animation systems
**Tags:** css, animation, visual-quality

### Web Audio API for procedural sound without external files
**Domain:** audio | **Weight:** 0.8 | **Applied:** 5/5 times
Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy).
**Evidence:** Sessions 9, 58, 63, 83, 98: ambient soundscape, baccarat sounds, firework sounds, spatial audio zones, thunder — all procedurally generated
**Tags:** audio, performance

### Progress indicators improve guided experience UX
**Domain:** interactivity | **Weight:** 0.5 | **Applied:** 1/1 times
Adding a visual progress bar and stop counter to guided tours gives users context about where they are in the experience and how much is left. Simple CSS progress bar with width transition is effective.
**Evidence:** Session 76: gold progress bar + 'STOP N/8' counter added to walk tour. Visible on both desktop and mobile.
**Tags:** ux, ui, tour

### Staggered CSS transitions create cinematic reveal effects
**Domain:** rendering | **Weight:** 0.6 | **Applied:** 1/1 times
Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s, subtitle at 0.35s, tagline at 0.55s). Combined with translateY slide-up, this creates an elegant staggered reveal without JavaScript animation.
**Evidence:** Session 77: flythrough title cards use 4 staggered CSS transitions for a cinematic reveal. Gold gradient title, Chinese subtitle, tagline all animate independently with different delays.
**Tags:** css, animation, cinematic, typography

### Canvas text with shadowBlur creates convincing neon glow
**Domain:** rendering | **Weight:** 0.6 | **Applied:** 2/2 times
Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is smooth without being expensive.
**Evidence:** Session 79: 8 neon signs with canvas-drawn Chinese text, colored glow halos, and flickering animation. Session 81: reused for food stall warm glow. Runs smoothly alongside 20 other entity systems.
**Tags:** canvas, rendering, neon, performance

### Canvas steam/smoke wisps add life to static billboards
**Domain:** landmarks | **Weight:** 0.5 | **Applied:** 1/1 times
Drawing small animated circles with varying opacity on canvas creates convincing steam/smoke wisps. Using sin() with different phase offsets per wisp gives organic movement without complex physics. Works well for food stalls, incense coils, chimneys.
**Evidence:** Session 81: 3 steam wisps per food stall with sin-based horizontal drift and opacity variation. Session 46: smoke wisps for incense coils. Both look natural and cost almost nothing performance-wise.
**Tags:** canvas, animation, atmosphere, performance

### Cultural balance through complementary heritage elements
**Domain:** landmarks | **Weight:** 0.5 | **Applied:** 1/1 times
When a digital twin represents a multicultural city, actively balance representation of different cultural heritages. Macau has Chinese and Portuguese elements — adding Portuguese azulejo tile panels complements the extensive Chinese elements (lanterns, neon signs, food stalls, incense). This avoids cultural homogeneity and better represents the city's unique identity.
**Evidence:** Session 82: 6 Portuguese azulejo tile panels added at heritage sites alongside 20+ existing Chinese cultural elements. Blue-and-white Portuguese palette provides visual contrast to warm red/gold Chinese elements.
**Tags:** culture, heritage, visual-variety, authenticity

### Position-aware audio zones using proximity falloff with altitude gate
**Domain:** audio | **Weight:** 0.5 | **Applied:** 1/1 times
Camera position relative to defined zone centers (lon/lat/radius) drives audio gain for zone-specific layers. Distance-based proximity (0-1 linear falloff from zone radius) combined with altitude gate (fade above threshold) creates convincing spatial audio without 3D panning. Enhancing existing gain nodes with position-aware modulation is non-breaking and additive.
**Evidence:** Session 83: 3 zone types (casino, temple, harbour) with 4 new audio layers. Zero JS errors, smooth transitions via linearRampToValueAtTime, 3s update interval is responsive without performance cost.
**Tags:** audio, spatial, cesiumjs, immersion

### Official symbols and emblems add cultural depth
**Domain:** landmarks | **Weight:** 0.5 | **Applied:** 1/1 times
Using a city's official symbols (like Macau's lotus emblem) as visual elements connects the digital twin to the real city's identity beyond just physical geography. The lotus is on Macau's flag and coat of arms, and Grand Lisboa is designed as a lotus bud — floating lotus flowers reinforce this symbolism naturally.
**Evidence:** Session 84: 10 lotus flower billboards on Nam Van Lake and harbour. Culturally significant, visually beautiful, fills the day/night balance gap as an always-active feature.
**Tags:** culture, heritage, symbolism, authenticity

### Heritage district ground-level transport adds cultural authenticity
**Domain:** animation | **Weight:** 0.5 | **Applied:** 1/1 times
Adding unique transport types specific to a city's heritage (like Macau's triciclo pedicabs) fills animation gaps in areas dominated by static cultural elements (tiles, lanterns, signs). Ground-level moving entities (3m altitude) bring life to pedestrian zones that otherwise only have stationary billboard features.
**Evidence:** Session 85: 4 triciclos on 3 heritage routes (Senado Square, Ruins, Barra). Follows proven CallbackProperty ping-pong pattern from ferries/junks. Zero JS errors, passed desktop/mobile checks.
**Tags:** animation, heritage, transport, cultural-authenticity

### Distributed small light points create coastline-tracing glow effects
**Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1 times
Placing many small radial gradient billboard entities along geographic features (waterfronts, promenades, paths) creates a 'string of pearls' ambient glow visible from overview altitude. Using the bridge lights pattern (CallbackProperty scale tied to _currentGlowIntensity) ensures consistent night-only behavior. Per-path color variation within a warm palette prevents monotony.
**Evidence:** Session 86: ~55 promenade lights across 5 waterfront paths. Follows bridge lights pattern exactly. Zero JS errors, passed desktop/mobile checks. Visible from bird's-eye at night.
**Tags:** atmosphere, lighting, night, waterfront, billboard

### Time-of-day gated features fill temporal gaps and add realism
**Domain:** animation | **Weight:** 0.7 | **Applied:** 3/3 times
Gating billboard entity visibility to specific time windows (e.g., morning 5-9 AM for tai chi) creates time-specific atmosphere that rewards exploration at different hours. Using getMacauHour() with smooth fade in/out at boundaries (0.5h ramp) prevents jarring appearance/disappearance. Most features are night-only or always-on — morning/afternoon-specific features fill temporal gaps.
**Evidence:** Session 91: tai chi 5-9 AM. Session 93: fishing sampans 15-19 PM. Session 97: dinner cruise 19-23. All use getMacauHour() with 30-min fade ramps. Zero JS errors every time.
**Tags:** animation, time-of-day, cultural-authenticity, billboard

### CSS cloud overlays are effective weather-reactive sky atmosphere
**Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1 times
CSS div elements with blur filter and keyframe drift animation create convincing cloud wisps without CesiumJS entity overhead. Tying opacity to real weather API cloud_cover percentage makes them weather-reactive. Placing below color grading z-index means they automatically get time-of-day tinting. Staggered sizes, positions, speeds, and delays prevent mechanical feel.
**Evidence:** Session 96: 7 cloud wisps with blur(40px), weather-reactive opacity. Zero JS errors, passed desktop/mobile. First sky-level atmospheric effect in the project.
**Tags:** css, atmosphere, weather, performance, animation

### Larger canvas entities with detail reward night scenes
**Domain:** animation | **Weight:** 0.5 | **Applied:** 1/1 times
Drawing a larger canvas (64x48 vs typical 32x32) allows more visual detail — multi-deck windows, string lights, hull details. Combined with higher scaleByDistance values and wider translucency range, large vessels are visible from bird's-eye view. Night-specific rendering (lit windows, glow halo, reflection gradient) creates dramatic visual difference from daytime.
**Evidence:** Session 97: dinner cruise with 64x48 canvas, scale 1.2, scaleByDistance near=2.0/far=0.6. Warm interior glow and deck lights clearly visible at night from overview altitude.
**Tags:** canvas, rendering, night, scale, billboard

### Canvas forked lightning with recursive branching creates realistic bolts
**Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1 times
Drawing lightning bolts via recursive canvas path segments with random horizontal jitter creates convincing forked bolts. Three-layer glow (wide dim outer, medium mid, thin bright core) per branch provides depth. Combined with double screen flash (bright 60ms + secondary 40ms) and delayed procedural thunder, it creates a complete storm effect. Integrating into existing weather/typhoon systems via simple start/stop lifecycle keeps it clean.
**Evidence:** Session 98: forked lightning bolts up to 4 branch depth, double flash, procedural thunder with rumble + crackle layers. Zero JS errors, clean typhoon demo integration.
**Tags:** canvas, atmosphere, weather, audio, animation

### CSS Grid with explicit row/column placement for tabular game data
**Domain:** interactivity | **Weight:** 0.5 | **Applied:** 1/1 times
Using CSS Grid with grid-auto-flow: column and explicit grid-row/grid-column style on each cell allows precise placement of baccarat road scorecard data. The Big Road pattern requires cells to stack vertically within columns and dragon-tail horizontally when overflowing — grid placement handles this naturally without complex table/flex layout. Dynamic grid-template-columns via JS adapts to data size.
**Evidence:** Session 101: Big Road scorecard with 6-row grid, column-based streaks, dragon tail overflow. 12 cells across 6 columns rendered correctly on both desktop and mobile.
**Tags:** css-grid, interactivity, baccarat, responsive

### Layered weather effects compound for immersion
**Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1 times
Adding secondary effects to existing weather systems (splash ripples to rain drops, thunder to lightning) compounds the immersion without replacing the original. Each layer adds a distinct sensory channel. Key: keep secondary effects subtle — they should enhance, not compete with, the primary effect.
**Evidence:** Session 102: rain splash ripples added below existing rain drops. Session 98: thunder added to lightning bolts. Both integrate into the same weather/typhoon activation flow with minimal new code.
**Tags:** atmosphere, weather, css, layering

### CSS particle celebrations reward user actions and reinforce engagement
**Domain:** interactivity | **Weight:** 0.5 | **Applied:** 1/1 times
Spawning temporary CSS particle elements (chips, confetti, sparkles) on positive outcomes makes interactive features feel more rewarding. Key design choices: scale intensity with outcome magnitude, use CSS custom properties for per-particle randomization, auto-cleanup containers after animation, and respect prefers-reduced-motion. The celebration should enhance, not block, the underlying UI.
**Evidence:** Session 103: golden chip cascade on baccarat wins. 8-28 chips based on net win amount. Staggered delays/durations/rotations via CSS custom properties. Zero JS errors, mobile-responsive, auto-cleanup at 3.5s.
**Tags:** css, animation, interactivity, ux, celebration

### Regulatory/safety details add skyline authenticity
**Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1 times
Adding real-world regulatory elements (aviation obstacle lights, warning lights, signal markers) creates an 'uncanny familiarity' — visitors may not consciously notice them, but their absence would make the scene feel subtly wrong. These features are simple to implement (single billboard entity per location) but add significant authenticity to night scenes.
**Evidence:** Session 105: 8 red beacon lights on tall buildings using bridge lights pattern. ~55 lines of code, zero JS errors, follows proven CallbackProperty + glow gating approach.
**Tags:** atmosphere, authenticity, night, billboard, regulatory

### CSS crepuscular rays enhance golden hour without entity overhead
**Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1 times
Multiple CSS div rays with linear-gradient backgrounds, blur filter, and transform rotation create convincing sun ray (god ray) effects. Time-gating to dawn and golden hour windows with smooth ramps, weather-reactive cloud dampening, and staggered pulse animations make them feel natural. Layering above color grading (z-index 43) lets rays shine 'through' the atmosphere overlay.
**Evidence:** Session 106: 10 rays at varied angles (-35 to +38 deg), blur(6px), pulse animations 15-28s. Zero JS errors, visible on desktop and mobile, inactive during midday/night. Weather dampening from 1.0 (clear) to 0.2 (100% cloud cover).
**Tags:** css, atmosphere, golden-hour, cinematic, performance

## Anti-Patterns (What to Avoid)

### [HIGH] CesiumJS bloom post-processing with Google 3D Tiles
CesiumJS bloom applies to entire scene causing severe oversaturation/washout with Google 3D Tiles. Tried contrast values 119 down to 40 — all caused unacceptable results.
**Fix:** Use billboard entities with canvas radial gradients for glow effects instead of scene-wide bloom
**Tags:** cesiumjs, rendering, 3d-tiles

### [HIGH] CallbackProperty for billboard image causes black rectangles
Using CesiumJS CallbackProperty to dynamically update billboard.image with canvas elements renders as solid black rectangles with Google 3D Tiles.
**Fix:** Use direct billboard.image = canvas.toDataURL() assignment in setInterval instead
**Tags:** cesiumjs, rendering, billboard

### [MEDIUM] Parallax on mobile breaks layout
Parallax effects on mobile conflict with position:relative layouts and feel exaggerated on small viewports.
**Fix:** Disable parallax on mobile via media query or JS check
**Tags:** mobile, css, layout

## Decisions

### Q: How to enhance walk tour for documentary feel?
**Decision:** Compose existing systems: auto-open landmark cards (with S75 photo gallery), add slow orbit camera, add progress bar/counter
**Rationale:** Reusing existing showLandmarkCard() and orbit patterns minimized new code while maximizing impact. The photo gallery from S75 already provides the visual richness needed.

### Q: How to make flythrough labels more cinematic?
**Decision:** Multi-line HTML with staggered CSS transitions — title + Chinese + tagline + decorative lines
**Rationale:** Pure CSS approach (no JS animation library) keeps it lightweight. innerHTML generation in showStageLabel() keeps the function signature simple while supporting rich content. Gold gradient text matches site branding.

### Q: How to add neon signage to the city?
**Decision:** Canvas-drawn billboard entities with Chinese text + glow halos, setInterval for flicker animation
**Rationale:** Follows proven billboard + canvas + setInterval pattern (used by incense coils, LED facades, smoke wisps). Canvas shadowBlur creates convincing neon glow without post-processing. Night-only via _currentGlowIntensity threshold.

### Q: How to represent street food culture?
**Decision:** Canvas-drawn billboard entities with warm lantern awnings, Chinese food names, and animated steam wisps
**Rationale:** Follows proven billboard + canvas + setInterval pattern. Warm orange/red color palette contrasts with cool blue/purple neon signs. Always-active visibility (not night-only) adds daytime life. Real Macau food names add cultural authenticity.

### Q: How to represent Portuguese colonial heritage?
**Decision:** Canvas-drawn azulejo tile panel billboards with traditional blue-and-white patterns, Portuguese place names, and 4 tile motifs
**Rationale:** Follows proven billboard + canvas + setInterval pattern. Blue-and-white color palette provides strong visual contrast to warm Chinese elements. Portuguese place names add linguistic authenticity. Multiple pattern types (cross, floral, diamond, wave) prevent visual monotony.

### Q: How to add lotus flower cultural symbolism to the scene?
**Decision:** Canvas-drawn lotus billboard entities with CallbackProperty drift and scale animation on water surfaces
**Rationale:** Follows proven billboard + CallbackProperty pattern. Lotus is Macau's official emblem — deeply meaningful. Placed on water surfaces (Nam Van Lake, Inner Harbour) for authenticity. Always-active to help balance the day/night feature ratio. Circular drift + breathing pulse creates natural floating-on-water feel without complex physics.

### Q: How to add heritage district ground-level movement?
**Decision:** Triciclo pedicab billboard entities with CallbackProperty ping-pong movement on 3 heritage routes
**Rationale:** Triciclos are uniquely Macau — once the primary transport, now a tourist icon. Fills animation gap in heritage district where most features are stationary billboards. Follows proven ferry/junk movement pattern. Transit section placement (not Heritage) distinguishes transport from static cultural elements.

### Q: How to add waterfront ambient lighting?
**Decision:** Distributed small radial gradient billboard entities along 5 promenade paths at 3m altitude, night-only via _currentGlowIntensity
**Rationale:** Follows proven bridge lights pattern exactly. Small light points are visible from bird's-eye but don't interfere with ground-level 3D tiles. Warm-amber palette with per-path variation creates organic coastline glow without oversaturation.

### Q: How to add morning-specific cultural life to the scene?
**Decision:** Animated tai chi billboard groups at 5 park/waterfront locations, visible 5-9 AM with fade ramps, setInterval canvas redraw for pose animation
**Rationale:** Tai chi is quintessential Chinese morning culture and very authentic for Macau parks. Fills temporal gap — all previous time-gated features were night-only. Canvas redraw at 400ms interval is smooth without being expensive. 5 locations across Peninsula and Taipa spread the feature geographically.

### Q: How to fill the afternoon temporal gap (12-7 PM)?
**Decision:** Fishing sampan billboard entities on Inner Harbour routes, time-gated 15:00-19:00, with canvas bobbing animation and minimap tracking
**Rationale:** Macau originated as a fishing village ('Bay of A-Ma') — fishing sampans are deeply historically significant. Afternoon is the natural time for fishers to return with catch. Follows proven tai chi time-gating pattern (getMacauHour + fade ramps) and junk boat movement pattern (CallbackProperty ping-pong). Now morning, afternoon, and night all have time-specific features.

### Q: How to add sky-level atmosphere without more CesiumJS billboard entities?
**Decision:** CSS cloud div overlay with blur filter and keyframe drift animation at z-index below color grading
**Rationale:** CSS approach avoids adding more CesiumJS entities (26 systems already), is more performant, and automatically inherits time-of-day color grading from the z-index layering. Weather-reactive via existing currentWeather global. First atmospheric effect targeting the sky rather than ground/water level.

### Q: How to add a prominent evening harbour feature?
**Decision:** Large dinner cruise vessels with detailed canvas rendering, night-specific glow, and 19-23 time gate
**Rationale:** Dinner cruises are authentic Macau harbour activity. Larger 64x48 canvas allows multi-deck detail. Evening time window (19-23) fills the post-sunset period between golden hour and late-night fireworks. Follows proven ferry/junk movement pattern with ping-pong route, plus proven sampan/bus time-gating pattern.

### Q: How to add dramatic storm effects beyond rain and wind?
**Decision:** Canvas-drawn forked lightning bolts + CSS screen flash + Web Audio API thunder, triggered by WMO thunderstorm codes and typhoon T8+
**Rationale:** Lightning is the most cinematic missing piece of the weather system. Canvas drawing allows recursive forked bolts with glow. CSS flash overlay is simpler than CesiumJS scene manipulation. Web Audio thunder reuses proven procedural audio pattern. Dual trigger (weather API + typhoon demo) ensures visibility since real thunderstorms are rare.

### Q: How to deepen the baccarat experience beyond card dealing?
**Decision:** Big Road (大路) scorecard below stats — CSS Grid with explicit cell placement, column-based streaks, tie marks as green dot overlays
**Rationale:** Big Road is THE most iconic visual element of Macau casinos — every baccarat table has electronic scorecards. Enhances existing feature rather than building new entity. CSS Grid handles the column/row placement naturally. Small visual footprint (54px height) doesn't crowd the already-full baccarat overlay. Future: could add Bead Plate, Big Eye Boy, Small Road, Cockroach Pig for complete scorecard set.

### Q: How to add authentic skyline detail to tall buildings at night?
**Decision:** Red radial gradient billboard entities at building-top altitudes with slow blink via CallbackProperty, night-only glow gating
**Rationale:** Aviation obstacle lights are mandatory on tall buildings worldwide — every Macau skyscraper has them. Follows exact bridge lights pattern (CallbackProperty scale, _currentGlowIntensity gating). Simple 3s blink cycle (1.5s on/1.5s dim) with staggered phases per building prevents synchronization. Small 12px canvas icon is visible from overview but unobtrusive.

### Q: How to add golden hour atmosphere without new CesiumJS entities?
**Decision:** CSS crepuscular rays (god rays) with linear-gradient divs, blur filter, rotation transforms, time-gated to dawn/dusk windows, weather-reactive opacity
**Rationale:** CSS approach continues the established pattern of using overlays for sky-level effects (clouds S96, color grading). Layering at z-index 43 (above color grading) lets rays appear to shine through the atmosphere. Weather dampening (1.0 clear to 0.2 overcast) ties the effect to live weather data. 10 rays at varied angles (-35 to +38 deg) with staggered pulse durations (15-28s) prevent mechanical feel.
