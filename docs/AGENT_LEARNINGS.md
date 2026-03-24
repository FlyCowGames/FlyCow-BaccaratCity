# Agent Learnings

*Auto-generated from data/knowledge.json. Do not edit directly.*

## Patterns (What Works)

### [rendering] CSS particle effects are lightweight alternatives to WebGL (w=0.8)
CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects.
- Evidence: Used across sessions 3, 65, 66 for rain, wind streaks, and shooting stars. Session 96: cloud wisps. Session 102: rain splashes. Session 106: sun rays. Session 107: rainbow arc. Session 109: harbor mist.
- Applied: 8x, Successful: 8x
- Tags: performance, css, animation

### [animation] Staggered animation delays prevent mechanical feel (w=0.8)
Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion.
- Evidence: Applied in pedestrians, seagulls, sky lanterns, flythrough title cards, neon signs, food stalls, lotus flowers, cloud wisps, and other animation systems
- Applied: 10x, Successful: 10x
- Tags: css, animation, visual-quality

### [audio] Web Audio API for procedural sound without external files (w=0.8)
Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy).
- Evidence: Sessions 9, 58, 63, 83, 98: ambient soundscape, baccarat sounds, firework sounds, spatial audio zones, thunder — all procedurally generated
- Applied: 5x, Successful: 5x
- Tags: audio, performance

### [animation] Time-of-day gated features fill temporal gaps and add realism (w=0.7)
Gating billboard entity visibility to specific time windows (e.g., morning 5-9 AM for tai chi) creates time-specific atmosphere that rewards exploration at different hours. Using getMacauHour() with smooth fade in/out at boundaries (0.5h ramp) prevents jarring appearance/disappearance. Most features are night-only or always-on — morning/afternoon-specific features fill temporal gaps.
- Evidence: Session 91: tai chi 5-9 AM. Session 93: fishing sampans 15-19 PM. Session 97: dinner cruise 19-23. Session 109: harbor mist 5-8:30 AM. All use getMacauHour() with fade ramps. Zero JS errors every time.
- Applied: 4x, Successful: 4x
- Tags: animation, time-of-day, cultural-authenticity, billboard

### [interactivity] Enhancing existing features is high-impact with low risk (w=0.6)
Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing systems (landmark cards, photo gallery, orbit camera). Building on proven patterns is fast and reliable.
- Evidence: Session 76: enhanced walk tour in ~70 lines by reusing showLandmarkCard(), existing orbit pattern, and existing WALK_TOUR_STOPS data. Zero JS errors, passed mobile/desktop checks.
- Applied: 2x, Successful: 2x
- Tags: architecture, composability, feature-enhancement

### [rendering] Staggered CSS transitions create cinematic reveal effects (w=0.6)
Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s, subtitle at 0.35s, tagline at 0.55s). Combined with translateY slide-up, this creates an elegant staggered reveal without JavaScript animation.
- Evidence: Session 77: flythrough title cards use 4 staggered CSS transitions for a cinematic reveal. Gold gradient title, Chinese subtitle, tagline all animate independently with different delays.
- Applied: 1x, Successful: 1x
- Tags: css, animation, cinematic, typography

### [rendering] Canvas text with shadowBlur creates convincing neon glow (w=0.6)
Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is smooth without being expensive.
- Evidence: Session 79: 8 neon signs with canvas-drawn Chinese text, colored glow halos, and flickering animation. Session 81: reused for food stall warm glow. Session 111: reused for string light bulb glow. Runs smoothly alongside 20+ other entity systems.
- Applied: 3x, Successful: 3x
- Tags: canvas, rendering, neon, performance

### [landmarks] Cultural balance through complementary heritage elements (w=0.6)
When a digital twin represents a multicultural city, actively balance representation of different cultural heritages. Macau has Chinese and Portuguese elements — adding Portuguese azulejo tile panels complements the extensive Chinese elements (lanterns, neon signs, food stalls, incense). This avoids cultural homogeneity and better represents the city's unique identity.
- Evidence: Session 82: 6 Portuguese azulejo tile panels. Session 114: 8 bilingual street name signs. Blue-and-white Portuguese palette provides visual contrast to warm red/gold Chinese elements.
- Applied: 2x, Successful: 2x
- Tags: culture, heritage, visual-variety, authenticity

### [atmosphere] Layered weather effects compound for immersion (w=0.6)
Adding secondary effects to existing weather systems (splash ripples to rain drops, thunder to lightning, rainbow after rain) compounds the immersion without replacing the original. Each layer adds a distinct sensory channel. Key: keep secondary effects subtle — they should enhance, not compete with, the primary effect.
- Evidence: Session 102: rain splash ripples added below existing rain drops. Session 98: thunder added to lightning bolts. Session 107: rainbow arc during/after rain. All integrate into the same weather/typhoon activation flow with minimal new code.
- Applied: 2x, Successful: 2x
- Tags: atmosphere, weather, css, layering

### [interactivity] Time-lapse mode showcases time-gated features visitors would otherwise miss (w=0.6)
A requestAnimationFrame-driven time-lapse that smoothly advances _timeOverride from 0 to 24 over ~48 seconds lets visitors see all time-gated features (dawn mist, tai chi, midday buses, afternoon sampans, golden hour, neon lights, fireworks) in one sitting. Reuses the existing time override system (slider input, updateCesiumClock, updateNeonGlow) so zero new infrastructure is needed. Placed next to the existing time slider for contextual discoverability.
- Evidence: Session 113: 72 lines of code, zero JS errors, smooth animation on desktop and mobile. Integrates cleanly with existing time slider, LIVE button, and all other sequences (Tour, Walk Tour, Flythrough).
- Applied: 1x, Successful: 1x
- Tags: interactivity, time-of-day, ux, showcase, requestAnimationFrame

### [landmarks] Adding missing landmarks to LANDMARKS array fixes walk tour gaps (w=0.6)
The walk tour auto-opens landmark cards via LANDMARKS.find(l => l.name === stop.name). If a walk tour stop exists but the matching LANDMARKS entry does not, the tour silently skips the info card at that stop. Adding the missing LANDMARKS entry automatically creates the billboard, enables click-to-fly, and fixes the walk tour card — all from a single array entry. Always check that walk tour stops have matching LANDMARKS entries.
- Evidence: Session 117: Senado Square was a walk tour stop but had no LANDMARKS entry. Adding the entry with photos, description, and facts instantly created billboard, info card, photo gallery, and fixed the walk tour gap. Zero JS errors, passed desktop/mobile checks.
- Applied: 1x, Successful: 1x
- Tags: landmarks, walk-tour, data-driven, composability

### [interactivity] Separate tick handlers for independent orbit systems (w=0.5)
When adding a new orbit behavior (walk tour orbit), use a separate onTick handler rather than reusing the global orbit system. This allows independent control — the walk tour orbit can be stopped/started without affecting the global orbit used after flythrough.
- Evidence: Session 76: _walkTourOrbitHandle is managed independently from orbitHandle. Clean start/stop lifecycle prevents interference.
- Applied: 1x, Successful: 1x
- Tags: cesiumjs, animation, architecture

### [interactivity] Progress indicators improve guided experience UX (w=0.5)
Adding a visual progress bar and stop counter to guided tours gives users context about where they are in the experience and how much is left. Simple CSS progress bar with width transition is effective.
- Evidence: Session 76: gold progress bar + 'STOP N/8' counter added to walk tour. Visible on both desktop and mobile.
- Applied: 1x, Successful: 1x
- Tags: ux, ui, tour

### [landmarks] Canvas steam/smoke wisps add life to static billboards (w=0.5)
Drawing small animated circles with varying opacity on canvas creates convincing steam/smoke wisps. Using sin() with different phase offsets per wisp gives organic movement without complex physics. Works well for food stalls, incense coils, chimneys.
- Evidence: Session 81: 3 steam wisps per food stall with sin-based horizontal drift and opacity variation. Session 46: smoke wisps for incense coils. Both look natural and cost almost nothing performance-wise.
- Applied: 1x, Successful: 1x
- Tags: canvas, animation, atmosphere, performance

### [audio] Position-aware audio zones using proximity falloff with altitude gate (w=0.5)
Camera position relative to defined zone centers (lon/lat/radius) drives audio gain for zone-specific layers. Distance-based proximity (0-1 linear falloff from zone radius) combined with altitude gate (fade above threshold) creates convincing spatial audio without 3D panning. Enhancing existing gain nodes with position-aware modulation is non-breaking and additive.
- Evidence: Session 83: 3 zone types (casino, temple, harbour) with 4 new audio layers. Zero JS errors, smooth transitions via linearRampToValueAtTime, 3s update interval is responsive without performance cost.
- Applied: 1x, Successful: 1x
- Tags: audio, spatial, cesiumjs, immersion

### [landmarks] Official symbols and emblems add cultural depth (w=0.5)
Using a city's official symbols (like Macau's lotus emblem) as visual elements connects the digital twin to the real city's identity beyond just physical geography. The lotus is on Macau's flag and coat of arms, and Grand Lisboa is designed as a lotus bud — floating lotus flowers reinforce this symbolism naturally.
- Evidence: Session 84: 10 lotus flower billboards on Nam Van Lake and harbour. Culturally significant, visually beautiful, fills the day/night balance gap as an always-active feature.
- Applied: 1x, Successful: 1x
- Tags: culture, heritage, symbolism, authenticity

### [animation] Heritage district ground-level transport adds cultural authenticity (w=0.5)
Adding unique transport types specific to a city's heritage (like Macau's triciclo pedicabs) fills animation gaps in areas dominated by static cultural elements (tiles, lanterns, signs). Ground-level moving entities (3m altitude) bring life to pedestrian zones that otherwise only have stationary billboard features.
- Evidence: Session 85: 4 triciclos on 3 heritage routes (Senado Square, Ruins, Barra). Follows proven CallbackProperty ping-pong pattern from ferries/junks. Zero JS errors, passed desktop/mobile checks.
- Applied: 1x, Successful: 1x
- Tags: animation, heritage, transport, cultural-authenticity

### [atmosphere] Distributed small light points create coastline-tracing glow effects (w=0.5)
Placing many small radial gradient billboard entities along geographic features (waterfronts, promenades, paths) creates a 'string of pearls' ambient glow visible from overview altitude. Using the bridge lights pattern (CallbackProperty scale tied to _currentGlowIntensity) ensures consistent night-only behavior. Per-path color variation within a warm palette prevents monotony.
- Evidence: Session 86: ~55 promenade lights across 5 waterfront paths. Follows bridge lights pattern exactly. Zero JS errors, passed desktop/mobile checks. Visible from bird's-eye at night.
- Applied: 1x, Successful: 1x
- Tags: atmosphere, lighting, night, waterfront, billboard

### [atmosphere] CSS cloud overlays are effective weather-reactive sky atmosphere (w=0.5)
CSS div elements with blur filter and keyframe drift animation create convincing cloud wisps without CesiumJS entity overhead. Tying opacity to real weather API cloud_cover percentage makes them weather-reactive. Placing below color grading z-index means they automatically get time-of-day tinting. Staggered sizes, positions, speeds, and delays prevent mechanical feel.
- Evidence: Session 96: 7 cloud wisps with blur(40px), weather-reactive opacity. Zero JS errors, passed desktop/mobile. First sky-level atmospheric effect in the project.
- Applied: 1x, Successful: 1x
- Tags: css, atmosphere, weather, performance, animation

### [animation] Larger canvas entities with detail reward night scenes (w=0.5)
Drawing a larger canvas (64x48 vs typical 32x32) allows more visual detail — multi-deck windows, string lights, hull details. Combined with higher scaleByDistance values and wider translucency range, large vessels are visible from bird's-eye view. Night-specific rendering (lit windows, glow halo, reflection gradient) creates dramatic visual difference from daytime.
- Evidence: Session 97: dinner cruise with 64x48 canvas, scale 1.2, scaleByDistance near=2.0/far=0.6. Warm interior glow and deck lights clearly visible at night from overview altitude.
- Applied: 1x, Successful: 1x
- Tags: canvas, rendering, night, scale, billboard

### [atmosphere] Canvas forked lightning with recursive branching creates realistic bolts (w=0.5)
Drawing lightning bolts via recursive canvas path segments with random horizontal jitter creates convincing forked bolts. Three-layer glow (wide dim outer, medium mid, thin bright core) per branch provides depth. Combined with double screen flash (bright 60ms + secondary 40ms) and delayed procedural thunder, it creates a complete storm effect. Integrating into existing weather/typhoon systems via simple start/stop lifecycle keeps it clean.
- Evidence: Session 98: forked lightning bolts up to 4 branch depth, double flash, procedural thunder with rumble + crackle layers. Zero JS errors, clean typhoon demo integration.
- Applied: 1x, Successful: 1x
- Tags: canvas, atmosphere, weather, audio, animation

### [interactivity] CSS Grid with explicit row/column placement for tabular game data (w=0.5)
Using CSS Grid with grid-auto-flow: column and explicit grid-row/grid-column style on each cell allows precise placement of baccarat road scorecard data. The Big Road pattern requires cells to stack vertically within columns and dragon-tail horizontally when overflowing — grid placement handles this naturally without complex table/flex layout. Dynamic grid-template-columns via JS adapts to data size.
- Evidence: Session 101: Big Road scorecard with 6-row grid, column-based streaks, dragon tail overflow. 12 cells across 6 columns rendered correctly on both desktop and mobile.
- Applied: 1x, Successful: 1x
- Tags: css-grid, interactivity, baccarat, responsive

### [interactivity] CSS particle celebrations reward user actions and reinforce engagement (w=0.5)
Spawning temporary CSS particle elements (chips, confetti, sparkles) on positive outcomes makes interactive features feel more rewarding. Key design choices: scale intensity with outcome magnitude, use CSS custom properties for per-particle randomization, auto-cleanup containers after animation, and respect prefers-reduced-motion. The celebration should enhance, not block, the underlying UI.
- Evidence: Session 103: golden chip cascade on baccarat wins. 8-28 chips based on net win amount. Staggered delays/durations/rotations via CSS custom properties. Zero JS errors, mobile-responsive, auto-cleanup at 3.5s.
- Applied: 1x, Successful: 1x
- Tags: css, animation, interactivity, ux, celebration

### [atmosphere] Regulatory/safety details add skyline authenticity (w=0.5)
Adding real-world regulatory elements (aviation obstacle lights, warning lights, signal markers) creates an 'uncanny familiarity' — visitors may not consciously notice them, but their absence would make the scene feel subtly wrong. These features are simple to implement (single billboard entity per location) but add significant authenticity to night scenes.
- Evidence: Session 105: 8 red beacon lights on tall buildings using bridge lights pattern. ~55 lines of code, zero JS errors, follows proven CallbackProperty + glow gating approach.
- Applied: 1x, Successful: 1x
- Tags: atmosphere, authenticity, night, billboard, regulatory

### [atmosphere] CSS crepuscular rays enhance golden hour without entity overhead (w=0.5)
Multiple CSS div rays with linear-gradient backgrounds, blur filter, and transform rotation create convincing sun ray (god ray) effects. Time-gating to dawn and golden hour windows with smooth ramps, weather-reactive cloud dampening, and staggered pulse animations make them feel natural. Layering above color grading (z-index 43) lets rays shine 'through' the atmosphere overlay.
- Evidence: Session 106: 10 rays at varied angles (-35 to +38 deg), blur(6px), pulse animations 15-28s. Zero JS errors, visible on desktop and mobile, inactive during midday/night. Weather dampening from 1.0 (clear) to 0.2 (100% cloud cover).
- Applied: 1x, Successful: 1x
- Tags: css, atmosphere, golden-hour, cinematic, performance

### [atmosphere] Multi-layer CSS fog with staggered drift creates convincing mist (w=0.5)
Multiple overlapping div elements with radial gradients, large blur filters (35-60px), and different keyframe drift animations at different viewport heights create convincing atmospheric fog/mist. Each layer has distinct size, opacity, blur radius, color, and animation speed — preventing the uniform look that a single fog overlay would produce. Weather-reactive opacity scaling (humidity, fog codes) adds realism. Bottom-anchored radial gradients with transparent falloff naturally simulate low-lying ground fog.
- Evidence: Session 109: 5 mist layers with 3 drift keyframes, blur 35-60px, radial-gradient anchored at bottom. Active class toggled by getMacauHour(). Zero JS errors, passes desktop and mobile checks.
- Applied: 1x, Successful: 1x
- Tags: css, atmosphere, fog, animation, layering

### [atmosphere] CSS radial-gradient creates natural rainbow bands (w=0.5)
Using radial-gradient with concentric color stops at 2% intervals creates convincing rainbow spectral bands. Centered at bottom of element with the element positioned low in viewport shows only the upper arc. blur(4px) softens the bands to look natural. Condition-gating (daytime + rain + partial sun) ensures it appears realistically. 12s transition creates a slow, natural fade matching real rainbow appearance.
- Evidence: Session 107: 7-band rainbow arc visible during/after rain. Zero JS errors, renders correctly on desktop and mobile. Integrates with existing weather data (currentWeather.cloud_cover, isRainyCode, isHeavyRain).
- Applied: 1x, Successful: 1x
- Tags: css, atmosphere, weather, radial-gradient

### [landmarks] Complementary features in the same area compound visual richness (w=0.5)
Adding string lights to areas that already have food stalls and red lanterns creates a layered, cohesive night market atmosphere. Each feature is simple alone, but together they produce a visually rich scene that feels authentic. When planning new features, check what already exists in the target area and design to complement it.
- Evidence: Session 111: 8 string light sets added to areas with existing food stalls (S81) and red lanterns (S38). Combined effect creates convincing night market ambiance at Rua do Cunha and Senado Square.
- Applied: 1x, Successful: 1x
- Tags: landmarks, visual-richness, complementary, night-market

### [landmarks] Static billboard entities for signage need no animation interval (w=0.5)
Street name signs, static plaques, and other non-animated signage billboards can use a single canvas.toDataURL() call at init time with no setInterval. This saves CPU compared to animated billboards (neon signs, food stalls) that redraw every 200-400ms. For static content, the simplest approach is best.
- Evidence: Session 114: 8 street name signs with one-time canvas draw, no setInterval. Zero JS errors, clean implementation.
- Applied: 1x, Successful: 1x
- Tags: performance, billboard, canvas, simplicity

### [animation] Casino-branded shuttle buses with route-specific colors add transport variety (w=0.5)
Defining per-route color objects (body, accent, text) and passing them to a shared canvas drawing function creates visually distinct vehicles without duplicating drawing code. Casino text labels on the bus sides add identity. Always-active (24/7) shuttle buses fill a gap — most transit features are time-gated, but shuttles run continuously like real Macau.
- Evidence: Session 116: 6 shuttle buses on 3 routes with 3 distinct color schemes (gold/Lisboa, purple/Galaxy, blue/COD). Zero JS errors, passed desktop/mobile checks. Reuses proven CallbackProperty ping-pong pattern.
- Applied: 1x, Successful: 1x
- Tags: animation, transport, canvas, cultural-authenticity, billboard

## Anti-Patterns (What to Avoid)

### [HIGH] CesiumJS bloom post-processing with Google 3D Tiles
CesiumJS bloom applies to entire scene causing severe oversaturation/washout with Google 3D Tiles. Tried contrast values 119 down to 40 — all caused unacceptable results.
- Fix: Use billboard entities with canvas radial gradients for glow effects instead of scene-wide bloom
- Tags: cesiumjs, rendering, 3d-tiles

### [HIGH] CallbackProperty for billboard image causes black rectangles
Using CesiumJS CallbackProperty to dynamically update billboard.image with canvas elements renders as solid black rectangles with Google 3D Tiles.
- Fix: Use direct billboard.image = canvas.toDataURL() assignment in setInterval instead
- Tags: cesiumjs, rendering, billboard

### [MEDIUM] Parallax on mobile breaks layout
Parallax effects on mobile conflict with position:relative layouts and feel exaggerated on small viewports.
- Fix: Disable parallax on mobile via media query or JS check
- Tags: mobile, css, layout

## Decisions

### How to enhance walk tour for documentary feel?
**Chosen:** Compose existing systems: auto-open landmark cards (with S75 photo gallery), add slow orbit camera, add progress bar/counter
**Rationale:** Reusing existing showLandmarkCard() and orbit patterns minimized new code while maximizing impact. The photo gallery from S75 already provides the visual richness needed.

### How to make flythrough labels more cinematic?
**Chosen:** Multi-line HTML with staggered CSS transitions — title + Chinese + tagline + decorative lines
**Rationale:** Pure CSS approach (no JS animation library) keeps it lightweight. innerHTML generation in showStageLabel() keeps the function signature simple while supporting rich content. Gold gradient text matches site branding.

### How to add neon signage to the city?
**Chosen:** Canvas-drawn billboard entities with Chinese text + glow halos, setInterval for flicker animation
**Rationale:** Follows proven billboard + canvas + setInterval pattern (used by incense coils, LED facades, smoke wisps). Canvas shadowBlur creates convincing neon glow without post-processing. Night-only via _currentGlowIntensity threshold.

### How to represent street food culture?
**Chosen:** Canvas-drawn billboard entities with warm lantern awnings, Chinese food names, and animated steam wisps
**Rationale:** Follows proven billboard + canvas + setInterval pattern. Warm orange/red color palette contrasts with cool blue/purple neon signs. Always-active visibility (not night-only) adds daytime life. Real Macau food names add cultural authenticity.

### How to represent Portuguese colonial heritage?
**Chosen:** Canvas-drawn azulejo tile panel billboards with traditional blue-and-white patterns, Portuguese place names, and 4 tile motifs
**Rationale:** Follows proven billboard + canvas + setInterval pattern. Blue-and-white color palette provides strong visual contrast to warm Chinese elements. Portuguese place names add linguistic authenticity. Multiple pattern types (cross, floral, diamond, wave) prevent visual monotony.

### How to add lotus flower cultural symbolism to the scene?
**Chosen:** Canvas-drawn lotus billboard entities with CallbackProperty drift and scale animation on water surfaces
**Rationale:** Follows proven billboard + CallbackProperty pattern. Lotus is Macau's official emblem — deeply meaningful. Placed on water surfaces (Nam Van Lake, Inner Harbour) for authenticity. Always-active to help balance the day/night feature ratio. Circular drift + breathing pulse creates natural floating-on-water feel without complex physics.

### How to add heritage district ground-level movement?
**Chosen:** Triciclo pedicab billboard entities with CallbackProperty ping-pong movement on 3 heritage routes
**Rationale:** Triciclos are uniquely Macau — once the primary transport, now a tourist icon. Fills animation gap in heritage district where most features are stationary billboards. Follows proven ferry/junk movement pattern. Transit section placement (not Heritage) distinguishes transport from static cultural elements.

### How to add waterfront ambient lighting?
**Chosen:** Distributed small radial gradient billboard entities along 5 promenade paths at 3m altitude, night-only via _currentGlowIntensity
**Rationale:** Follows proven bridge lights pattern exactly. Small light points are visible from bird's-eye but don't interfere with ground-level 3D tiles. Warm-amber palette with per-path variation creates organic coastline glow without oversaturation.

### How to add morning-specific cultural life to the scene?
**Chosen:** Animated tai chi billboard groups at 5 park/waterfront locations, visible 5-9 AM with fade ramps, setInterval canvas redraw for pose animation
**Rationale:** Tai chi is quintessential Chinese morning culture and very authentic for Macau parks. Fills temporal gap — all previous time-gated features were night-only. Canvas redraw at 400ms interval is smooth without being expensive. 5 locations across Peninsula and Taipa spread the feature geographically.

### How to fill the afternoon temporal gap (12-7 PM)?
**Chosen:** Fishing sampan billboard entities on Inner Harbour routes, time-gated 15:00-19:00, with canvas bobbing animation and minimap tracking
**Rationale:** Macau originated as a fishing village ('Bay of A-Ma') — fishing sampans are deeply historically significant. Afternoon is the natural time for fishers to return with catch. Follows proven tai chi time-gating pattern (getMacauHour + fade ramps) and junk boat movement pattern (CallbackProperty ping-pong). Now morning, afternoon, and night all have time-specific features.

### How to add sky-level atmosphere without more CesiumJS billboard entities?
**Chosen:** CSS cloud div overlay with blur filter and keyframe drift animation at z-index below color grading
**Rationale:** CSS approach avoids adding more CesiumJS entities (26 systems already), is more performant, and automatically inherits time-of-day color grading from the z-index layering. Weather-reactive via existing currentWeather global. First atmospheric effect targeting the sky rather than ground/water level.

### How to add a prominent evening harbour feature?
**Chosen:** Large dinner cruise vessels with detailed canvas rendering, night-specific glow, and 19-23 time gate
**Rationale:** Dinner cruises are authentic Macau harbour activity. Larger 64x48 canvas allows multi-deck detail. Evening time window (19-23) fills the post-sunset period between golden hour and late-night fireworks. Follows proven ferry/junk movement pattern with ping-pong route, plus proven sampan/bus time-gating pattern.

### How to add dramatic storm effects beyond rain and wind?
**Chosen:** Canvas-drawn forked lightning bolts + CSS screen flash + Web Audio API thunder, triggered by WMO thunderstorm codes and typhoon T8+
**Rationale:** Lightning is the most cinematic missing piece of the weather system. Canvas drawing allows recursive forked bolts with glow. CSS flash overlay is simpler than CesiumJS scene manipulation. Web Audio thunder reuses proven procedural audio pattern. Dual trigger (weather API + typhoon demo) ensures visibility since real thunderstorms are rare.

### How to deepen the baccarat experience beyond card dealing?
**Chosen:** Big Road (大路) scorecard below stats — CSS Grid with explicit cell placement, column-based streaks, tie marks as green dot overlays
**Rationale:** Big Road is THE most iconic visual element of Macau casinos — every baccarat table has electronic scorecards. Enhances existing feature rather than building new entity. CSS Grid handles the column/row placement naturally. Small visual footprint (54px height) doesn't crowd the already-full baccarat overlay. Future: could add Bead Plate, Big Eye Boy, Small Road, Cockroach Pig for complete scorecard set.

### How to add authentic skyline detail to tall buildings at night?
**Chosen:** Red radial gradient billboard entities at building-top altitudes with slow blink via CallbackProperty, night-only glow gating
**Rationale:** Aviation obstacle lights are mandatory on tall buildings worldwide — every Macau skyscraper has them. Follows exact bridge lights pattern (CallbackProperty scale, _currentGlowIntensity gating). Simple 3s blink cycle (1.5s on/1.5s dim) with staggered phases per building prevents synchronization. Small 12px canvas icon is visible from overview but unobtrusive.

### How to add early morning atmosphere beyond sun rays?
**Chosen:** Multi-layer CSS fog/mist overlay with radial gradients, blur filters, and staggered drift animations at bottom of viewport
**Rationale:** CSS approach avoids more CesiumJS entities. Multiple layers with different heights, speeds, and opacities create depth that a single fog div cannot. Humidity/fog weather reactivity makes it feel connected to real conditions. Complements (not competes with) the existing sun rays at dawn — rays are geometric beams above, mist is soft blanket below.

### How to add a rainbow weather effect to complement the rain system?
**Chosen:** CSS radial-gradient div with 7 spectral bands, condition-gated to daytime + light rain + partial sun, with 10-min post-rain memory
**Rationale:** CSS approach (no canvas/entity) follows proven weather overlay pattern. radial-gradient is simpler and more natural than conic-gradient for concentric rainbow bands. Post-rain memory (10 min window) is key — real rainbows often appear as rain stops, not during heavy rain. Cloud cover threshold (85%) ensures sun visibility is plausible.

### How to add night market ambiance to food areas?
**Chosen:** Canvas-drawn string light billboard entities with catenary wire and warm golden twinkle bulbs at 7-9m altitude
**Rationale:** String lights are universally recognizable night market signifiers. Canvas + setInterval pattern is proven reliable. Placing at existing food/heritage locations (Rua do Cunha, Senado Square, etc.) compounds with food stalls and red lanterns for layered richness. Always-active with night boost means visible in all conditions.

### How to let visitors experience all time-gated features without visiting at different hours?
**Chosen:** requestAnimationFrame time-lapse animating _timeOverride 0-24 over 48 seconds, small play button next to time slider
**Rationale:** Reuses existing time override system (slider, updateCesiumClock, updateNeonGlow) — zero new infrastructure. Placing the button in the clock block (next to LIVE) is contextually obvious. 48s duration (2s/hour) is long enough to appreciate changes but short enough to watch in full. Returns to live time on completion for clean UX.

### How to deepen Portuguese colonial heritage beyond decorative tiles?
**Chosen:** Bilingual street name sign billboards at 8 famous intersections, canvas-drawn with tile border aesthetic, static (no animation)
**Rationale:** Street name signs are one of the most photographed features of historic Macau. Blue-and-white tile style matches azulejo panels (S82). Static billboards (no setInterval) because signs don't animate. 6m altitude matches real sign height. Portuguese + Chinese text reinforces the bilingual identity. Complements azulejo tiles, food stalls, and red lanterns in the heritage district.

### How to add iconic Macau ground transport beyond tour buses and triciclos?
**Chosen:** Casino free shuttle buses (發財車) on 3 routes between ferry terminals and casinos, always active with casino-branded colors
**Rationale:** Casino shuttles are the most ubiquitous Macau transport — every tourist uses them. Always-active (24/7) fills gap since tour buses are midday-only. Per-route casino branding (gold/Lisboa, purple/Galaxy, blue/COD) adds visual variety. Follows proven CallbackProperty ping-pong pattern from ferries/triciclos.
