# Agent Learnings

*Auto-generated from data/knowledge.json — do NOT edit directly.*

## Patterns That Work

### CSS particle effects are lightweight alternatives to WebGL [w=0.8]
CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects.

**Evidence:** Used across sessions 3, 65, 66 for rain, wind streaks, and shooting stars
**Applied:** 3x, Success: 3x
**Tags:** performance, css, animation

### Staggered animation delays prevent mechanical feel [w=0.8]
Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion.

**Evidence:** Applied in pedestrians, seagulls, sky lanterns, flythrough title cards, neon signs, food stalls, and other animation systems
**Applied:** 8x, Success: 8x
**Tags:** css, animation, visual-quality

### Web Audio API for procedural sound without external files [w=0.8]
Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy).

**Evidence:** Sessions 9, 58, 63: ambient soundscape, baccarat sounds, firework sounds — all procedurally generated
**Applied:** 3x, Success: 3x
**Tags:** audio, performance

### Enhancing existing features is high-impact with low risk [w=0.6]
Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing systems (landmark cards, photo gallery, orbit camera). Building on proven patterns is fast and reliable.

**Evidence:** Session 76: enhanced walk tour in ~70 lines by reusing showLandmarkCard(), existing orbit pattern, and existing WALK_TOUR_STOPS data. Zero JS errors, passed mobile/desktop checks.
**Applied:** 2x, Success: 2x
**Tags:** architecture, composability, feature-enhancement

### Staggered CSS transitions create cinematic reveal effects [w=0.6]
Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s, subtitle at 0.35s, tagline at 0.55s). Combined with translateY slide-up, this creates an elegant staggered reveal without JavaScript animation.

**Evidence:** Session 77: flythrough title cards use 4 staggered CSS transitions for a cinematic reveal. Gold gradient title, Chinese subtitle, tagline all animate independently with different delays.
**Applied:** 1x, Success: 1x
**Tags:** css, animation, cinematic, typography

### Canvas text with shadowBlur creates convincing neon glow [w=0.6]
Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is smooth without being expensive.

**Evidence:** Session 79: 8 neon signs with canvas-drawn Chinese text, colored glow halos, and flickering animation. Session 81: reused for food stall warm glow. Runs smoothly alongside 20 other entity systems.
**Applied:** 2x, Success: 2x
**Tags:** canvas, rendering, neon, performance

### Separate tick handlers for independent orbit systems [w=0.5]
When adding a new orbit behavior (walk tour orbit), use a separate onTick handler rather than reusing the global orbit system. This allows independent control — the walk tour orbit can be stopped/started without affecting the global orbit used after flythrough.

**Evidence:** Session 76: _walkTourOrbitHandle is managed independently from orbitHandle. Clean start/stop lifecycle prevents interference.
**Applied:** 1x, Success: 1x
**Tags:** cesiumjs, animation, architecture

### Progress indicators improve guided experience UX [w=0.5]
Adding a visual progress bar and stop counter to guided tours gives users context about where they are in the experience and how much is left. Simple CSS progress bar with width transition is effective.

**Evidence:** Session 76: gold progress bar + 'STOP N/8' counter added to walk tour. Visible on both desktop and mobile.
**Applied:** 1x, Success: 1x
**Tags:** ux, ui, tour

### Canvas steam/smoke wisps add life to static billboards [w=0.5]
Drawing small animated circles with varying opacity on canvas creates convincing steam/smoke wisps. Using sin() with different phase offsets per wisp gives organic movement without complex physics. Works well for food stalls, incense coils, chimneys.

**Evidence:** Session 81: 3 steam wisps per food stall with sin-based horizontal drift and opacity variation. Session 46: smoke wisps for incense coils. Both look natural and cost almost nothing performance-wise.
**Applied:** 1x, Success: 1x
**Tags:** canvas, animation, atmosphere, performance

## Anti-Patterns to Avoid

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

## Active Decisions

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

