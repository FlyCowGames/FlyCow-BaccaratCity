# Agent Learnings

*Auto-generated from data/knowledge.json — do NOT edit directly.*

## Patterns (What Works)

### Enhancing existing features is high-impact with low risk
- **Domain:** interactivity | **Weight:** 0.6 | **Applied:** 2/2
- Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing systems (landmark cards, photo gallery, orbit camera). Building on proven patterns is fast and reliable.
- **Evidence:** Session 76: enhanced walk tour in ~70 lines by reusing showLandmarkCard(), existing orbit pattern, and existing WALK_TOUR_STOPS data. Zero JS errors, passed mobile/desktop checks.
- **Tags:** architecture, composability, feature-enhancement

### Separate tick handlers for independent orbit systems
- **Domain:** interactivity | **Weight:** 0.5 | **Applied:** 1/1
- When adding a new orbit behavior (walk tour orbit), use a separate onTick handler rather than reusing the global orbit system. This allows independent control — the walk tour orbit can be stopped/started without affecting the global orbit used after flythrough.
- **Evidence:** Session 76: _walkTourOrbitHandle is managed independently from orbitHandle. Clean start/stop lifecycle prevents interference.
- **Tags:** cesiumjs, animation, architecture

### CSS particle effects are lightweight alternatives to WebGL
- **Domain:** rendering | **Weight:** 0.8 | **Applied:** 3/3
- CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects.
- **Evidence:** Used across sessions 3, 65, 66 for rain, wind streaks, and shooting stars
- **Tags:** performance, css, animation

### Staggered animation delays prevent mechanical feel
- **Domain:** animation | **Weight:** 0.8 | **Applied:** 8/8
- Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion.
- **Evidence:** Applied in pedestrians, seagulls, sky lanterns, flythrough title cards, neon signs, food stalls, and other animation systems
- **Tags:** css, animation, visual-quality

### Web Audio API for procedural sound without external files
- **Domain:** audio | **Weight:** 0.8 | **Applied:** 3/3
- Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy).
- **Evidence:** Sessions 9, 58, 63: ambient soundscape, baccarat sounds, firework sounds — all procedurally generated
- **Tags:** audio, performance

### Progress indicators improve guided experience UX
- **Domain:** interactivity | **Weight:** 0.5 | **Applied:** 1/1
- Adding a visual progress bar and stop counter to guided tours gives users context about where they are in the experience and how much is left. Simple CSS progress bar with width transition is effective.
- **Evidence:** Session 76: gold progress bar + 'STOP N/8' counter added to walk tour. Visible on both desktop and mobile.
- **Tags:** ux, ui, tour

### Staggered CSS transitions create cinematic reveal effects
- **Domain:** rendering | **Weight:** 0.6 | **Applied:** 1/1
- Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s, subtitle at 0.35s, tagline at 0.55s). Combined with translateY slide-up, this creates an elegant staggered reveal without JavaScript animation.
- **Evidence:** Session 77: flythrough title cards use 4 staggered CSS transitions for a cinematic reveal. Gold gradient title, Chinese subtitle, tagline all animate independently with different delays.
- **Tags:** css, animation, cinematic, typography

### Canvas text with shadowBlur creates convincing neon glow
- **Domain:** rendering | **Weight:** 0.6 | **Applied:** 2/2
- Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is smooth without being expensive.
- **Evidence:** Session 79: 8 neon signs with canvas-drawn Chinese text, colored glow halos, and flickering animation. Session 81: reused for food stall warm glow. Runs smoothly alongside 20 other entity systems.
- **Tags:** canvas, rendering, neon, performance

### Canvas steam/smoke wisps add life to static billboards
- **Domain:** landmarks | **Weight:** 0.5 | **Applied:** 1/1
- Drawing small animated circles with varying opacity on canvas creates convincing steam/smoke wisps. Using sin() with different phase offsets per wisp gives organic movement without complex physics. Works well for food stalls, incense coils, chimneys.
- **Evidence:** Session 81: 3 steam wisps per food stall with sin-based horizontal drift and opacity variation. Session 46: smoke wisps for incense coils. Both look natural and cost almost nothing performance-wise.
- **Tags:** canvas, animation, atmosphere, performance

### Cultural balance through complementary heritage elements
- **Domain:** landmarks | **Weight:** 0.5 | **Applied:** 1/1
- When a digital twin represents a multicultural city, actively balance representation of different cultural heritages. Macau has Chinese and Portuguese elements — adding Portuguese azulejo tile panels complements the extensive Chinese elements (lanterns, neon signs, food stalls, incense). This avoids cultural homogeneity and better represents the city's unique identity.
- **Evidence:** Session 82: 6 Portuguese azulejo tile panels added at heritage sites alongside 20+ existing Chinese cultural elements. Blue-and-white Portuguese palette provides visual contrast to warm red/gold Chinese elements.
- **Tags:** culture, heritage, visual-variety, authenticity

### Heritage district ground-level transport adds cultural authenticity
- **Domain:** animation | **Weight:** 0.5 | **Applied:** 1/1
- Adding unique transport types specific to a city's heritage (like Macau's triciclo pedicabs) fills animation gaps in areas dominated by static cultural elements (tiles, lanterns, signs). Ground-level moving entities (3m altitude) bring life to pedestrian zones that otherwise only have stationary billboard features.
- **Evidence:** Session 85: 4 triciclos on 3 heritage routes (Senado Square, Ruins, Barra). Follows proven CallbackProperty ping-pong pattern from ferries/junks. Zero JS errors, passed desktop/mobile checks.
- **Tags:** animation, heritage, transport, cultural-authenticity

### Distributed small light points create coastline-tracing glow effects
- **Domain:** atmosphere | **Weight:** 0.5 | **Applied:** 1/1
- Placing many small radial gradient billboard entities along geographic features (waterfronts, promenades, paths) creates a 'string of pearls' ambient glow visible from overview altitude. Using the bridge lights pattern (CallbackProperty scale tied to _currentGlowIntensity) ensures consistent night-only behavior. Per-path color variation within a warm palette prevents monotony.
- **Evidence:** Session 86: ~55 promenade lights across 5 waterfront paths. Follows bridge lights pattern exactly. Zero JS errors, passed desktop/mobile checks. Visible from bird's-eye at night.
- **Tags:** atmosphere, lighting, night, waterfront, billboard

## Anti-Patterns (What to Avoid)

### CesiumJS bloom post-processing with Google 3D Tiles
- **Severity:** high
- CesiumJS bloom applies to entire scene causing severe oversaturation/washout with Google 3D Tiles. Tried contrast values 119 down to 40 — all caused unacceptable results.
- **Fix:** Use billboard entities with canvas radial gradients for glow effects instead of scene-wide bloom
- **Tags:** cesiumjs, rendering, 3d-tiles

### CallbackProperty for billboard image causes black rectangles
- **Severity:** high
- Using CesiumJS CallbackProperty to dynamically update billboard.image with canvas elements renders as solid black rectangles with Google 3D Tiles.
- **Fix:** Use direct billboard.image = canvas.toDataURL() assignment in setInterval instead
- **Tags:** cesiumjs, rendering, billboard

### Parallax on mobile breaks layout
- **Severity:** medium
- Parallax effects on mobile conflict with position:relative layouts and feel exaggerated on small viewports.
- **Fix:** Disable parallax on mobile via media query or JS check
- **Tags:** mobile, css, layout

## Decisions

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

### How to add heritage district ground-level movement?
- **Chosen:** Triciclo pedicab billboard entities with CallbackProperty ping-pong movement on 3 heritage routes
- **Rationale:** Triciclos are uniquely Macau — once the primary transport, now a tourist icon. Fills animation gap in heritage district where most features are stationary billboards. Follows proven ferry/junk movement pattern. Transit section placement (not Heritage) distinguishes transport from static cultural elements.

### How to add waterfront ambient lighting?
- **Chosen:** Distributed small radial gradient billboard entities along 5 promenade paths at 3m altitude, night-only via _currentGlowIntensity
- **Rationale:** Follows proven bridge lights pattern exactly. Small light points are visible from bird's-eye but don't interfere with ground-level 3D tiles. Warm-amber palette with per-path variation creates organic coastline glow without oversaturation.

