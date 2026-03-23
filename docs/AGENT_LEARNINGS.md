# Agent Learnings

*Auto-generated from data/knowledge.json — do NOT edit directly.*

## Patterns (what works)

- **[w=0.6]** Enhancing existing features is high-impact with low risk — Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing systems (landmark cards, photo gallery, orbit camera). Building on proven patterns is fast and reliable. `[architecture, composability, feature-enhancement]`
- **[w=0.5]** Separate tick handlers for independent orbit systems — When adding a new orbit behavior (walk tour orbit), use a separate onTick handler rather than reusing the global orbit system. This allows independent control — the walk tour orbit can be stopped/started without affecting the global orbit used after flythrough. `[cesiumjs, animation, architecture]`
- **[w=0.8]** CSS particle effects are lightweight alternatives to WebGL — CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects. `[performance, css, animation]`
- **[w=0.8]** Staggered animation delays prevent mechanical feel — Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion. `[css, animation, visual-quality]`
- **[w=0.8]** Web Audio API for procedural sound without external files — Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy). `[audio, performance]`
- **[w=0.5]** Progress indicators improve guided experience UX — Adding a visual progress bar and stop counter to guided tours gives users context about where they are in the experience and how much is left. Simple CSS progress bar with width transition is effective. `[ux, ui, tour]`
- **[w=0.6]** Staggered CSS transitions create cinematic reveal effects — Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s, subtitle at 0.35s, tagline at 0.55s). Combined with translateY slide-up, this creates an elegant staggered reveal without JavaScript animation. `[css, animation, cinematic, typography]`
- **[w=0.5]** Canvas text with shadowBlur creates convincing neon glow — Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is smooth without being expensive. `[canvas, rendering, neon, performance]`

## Anti-Patterns (what to avoid)

- **[HIGH]** CesiumJS bloom post-processing with Google 3D Tiles — CesiumJS bloom applies to entire scene causing severe oversaturation/washout with Google 3D Tiles. Tried contrast values 119 down to 40 — all caused unacceptable results. Fix: Use billboard entities with canvas radial gradients for glow effects instead of scene-wide bloom
- **[HIGH]** CallbackProperty for billboard image causes black rectangles — Using CesiumJS CallbackProperty to dynamically update billboard.image with canvas elements renders as solid black rectangles with Google 3D Tiles. Fix: Use direct billboard.image = canvas.toDataURL() assignment in setInterval instead
- **[MEDIUM]** Parallax on mobile breaks layout — Parallax effects on mobile conflict with position:relative layouts and feel exaggerated on small viewports. Fix: Disable parallax on mobile via media query or JS check

## Decisions

- **How to enhance walk tour for documentary feel?** → Compose existing systems: auto-open landmark cards (with S75 photo gallery), add slow orbit camera, add progress bar/counter — Reusing existing showLandmarkCard() and orbit patterns minimized new code while maximizing impact. The photo gallery from S75 already provides the visual richness needed.
- **How to make flythrough labels more cinematic?** → Multi-line HTML with staggered CSS transitions — title + Chinese + tagline + decorative lines — Pure CSS approach (no JS animation library) keeps it lightweight. innerHTML generation in showStageLabel() keeps the function signature simple while supporting rich content. Gold gradient text matches site branding.
- **How to add neon signage to the city?** → Canvas-drawn billboard entities with Chinese text + glow halos, setInterval for flicker animation — Follows proven billboard + canvas + setInterval pattern (used by incense coils, LED facades, smoke wisps). Canvas shadowBlur creates convincing neon glow without post-processing. Night-only via _currentGlowIntensity threshold.
