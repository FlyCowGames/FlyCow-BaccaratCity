# Agent Learnings

*Append-only log of lessons learned. Read this every session to avoid repeating mistakes.*

## Session 0 (2026-03-20) — Manual Setup
- **Lesson:** Procedural Three.js box geometry looks amateur. Use real data (Google 3D Tiles, OSM) for geography.
- **Lesson:** Canvas 2D is completely wrong for 3D scenes. Always use WebGL (Three.js/CesiumJS).
- **Lesson:** When assembling multiple agent-written modules, define a shared contract upfront (naming, exports, coordinate system).
- **Lesson:** Camera systems that replace the camera type (Ortho→Perspective) need to update ALL references (composer passes, input handlers).

## Session 1 (2026-03-20) — CesiumJS Migration
- **Lesson:** Google Photorealistic 3D Tiles via CesiumJS gives instant photorealistic results vs months of manual modeling.
- **Lesson:** Claude CLI uses positional argument for prompt, not `--prompt` flag. Use `claude -p "prompt text"`.
- **Lesson:** Claude CLI has no `--max-turns` flag. Use `--max-budget-usd` instead.
- **Lesson:** API keys may be on different Google projects than the service account. Always check project ID.
- **Lesson:** When enabling Google APIs, verify the project number matches the API key's project.

## Session 3 (2026-03-20) -- Weather Integration
- **Lesson:** Open-Meteo API is ideal for client-side weather: free, no API key, CORS-friendly, uses WMO standard weather codes.
- **Lesson:** CesiumJS `scene.fog` works but is subtle -- it's depth-based fog, not volumetric. For more dramatic fog, consider a fullscreen CSS overlay or post-processing in future.
- **Lesson:** CSS rain overlays are lightweight and effective for visual atmosphere without WebGL particle overhead.
- **Lesson:** Weather effects need to be re-applied after viewer initialization since the API response may arrive before `_viewer` is set. Always guard with `if (_viewer)` and re-trigger from the init callback.
- **Lesson:** WMO weather codes are well-standardized (0=clear, 1-3=clouds, 45-48=fog, 51-55=drizzle, 61-65=rain, 80-82=showers, 95-99=thunderstorm). Good reference for future event-based effects.

## Session 4 (2026-03-20) -- Ferry Boats
- **Lesson:** CesiumJS `CallbackProperty` with `isConstant: false` is the simplest way to animate entity positions per-frame. No need for CZML or SampledPositionProperty for continuous loops.
- **Lesson:** Ping-pong animation (t goes 0→1→0) with phase offsets is an effective pattern for creating multiple entities on the same path that appear naturally staggered.
- **Lesson:** Canvas-drawn billboard icons (24x24px) work well for small moving entities — lightweight, no external assets, consistent with the gold theme.
- **Lesson:** `disableDepthTestDistance: Number.POSITIVE_INFINITY` is essential for small moving entities to remain visible — without it they'd clip behind 3D tiles at certain angles.
- **Lesson:** Ferry altitude of 3m (water surface level) works well with Google 3D Tiles — the boats appear to sit on the water.

## Session 6-8 (2026-03-20) -- Neon Casino Glow (CRITICAL LESSON)
- **CRITICAL: DO NOT use CesiumJS bloom post-processing (`postProcessStages.bloom`) with Google 3D Tiles.** It applies to the ENTIRE scene and causes severe oversaturation/washout, especially at night. The scene turns into a green/yellow/white blob. This was tried with contrast values from 119 down to 40 — ALL caused unacceptable washout. BLOOM IS PERMANENTLY DISABLED.
- **Lesson:** Neon glow should be achieved ONLY through billboard entities (canvas radial gradient icons). These look good without bloom and don't affect the rest of the scene.
- **Lesson:** Canvas radial gradients make effective "light source" billboards — a 64px canvas with a bright-center-to-transparent gradient creates a convincing ambient glow.
- **Lesson:** Time-of-day glow modulation should use smooth ramps at dusk/dawn (1 hour each) rather than hard on/off.
- **Lesson:** Adding high-altitude secondary glow entities (150m) for major casinos helps the glow remain visible from bird's eye views.
- **Lesson:** Always take screenshots after deploying visual changes. The agent-browser skill can verify quality.

## Session 7 (2026-03-20) -- Animated Road Traffic
- **Lesson:** The ferry CallbackProperty + ping-pong pattern is directly reusable for any animated entity on a polyline path. Copy-paste with route data changes is the fastest approach.
- **Lesson:** `lerpPosition()` is a general-purpose utility — it works for any multi-point path interpolation. No need to rewrite it per feature.
- **Lesson:** Car entities at 5m altitude sit correctly on road surfaces with Google 3D Tiles. Ferries at 3m for water, cars at 5m for roads.
- **Lesson:** Smaller billboard icons (12px vs 24px for ferries) work better for cars — they're more numerous and shouldn't dominate the view. Radial gradient dots are more subtle than drawn shapes.
- **Lesson:** `translucencyByDistance` with far value of 0.0 (fully transparent) helps cars fade out completely at bird's eye views where they'd be too small to see anyway — reduces visual clutter.
- **Lesson:** Session was very efficient (~5 min implementation) because the ferry pattern was proven and only needed new route data + smaller icons. Building on proven patterns is fast.

## Session 7 Meta-Observations
- **Observation:** Session was one of the fastest — pattern reuse from Session 4 (ferries) made traffic implementation near-trivial. Code grew by ~130 lines vs 117 for ferries, mostly route data.
- **Observation:** The "Required Skills" in the prompt are still listed but not used (confirmed again). No harm — the agent works fine without them.
- **Decision:** Did not modify improve.mjs — orchestrator is stable. No phases felt redundant.
- **Observation:** All immediate priorities (Sessions 2-10) in the roadmap are now complete. Next session should pick from near-term goals or add a new immediate priority.

## Session 8 (2026-03-20) -- Airport Flights
- **Lesson:** The ferry/traffic CallbackProperty pattern extends trivially to 3D flight paths. The only difference is adding altitude interpolation (`lerpPositionWithAlt` vs `lerpPosition`), which is a ~5-line function.
- **Lesson:** One-way looping (`t = ... % 1`) works better than ping-pong for planes — real aircraft don't fly backwards. Different animation types suit different transport modes.
- **Lesson:** Planes need larger billboard icons than cars (20px vs 12px) because they're at higher altitudes and further from the camera. Also a wider `translucencyByDistance` range (25000 vs 8000) since planes should be visible from much further away.
- **Lesson:** Flight path altitude descent should be non-linear in real life, but linear interpolation between waypoints with decreasing altitude steps creates a good enough glideslope effect without complexity.
- **Observation:** Three animation systems (ferries, cars, planes) now share the same core pattern. If a 4th is needed, could extract a generic `addAnimatedEntities(viewer, routes, icon, opts)` function — but not yet, 3 instances doesn't warrant abstraction.

## Session 8 Meta-Observations
- **Observation:** Another fast session — pattern reuse from Sessions 4/7 made this near-trivial. Three transport systems (ferries, cars, planes) now share the same core CallbackProperty + lerp pattern with minor variations (ping-pong vs one-way, 2D vs 3D altitude).
- **Decision:** Did not modify improve.mjs — orchestrator remains stable. No phases redundant.
- **Decision:** Did not extract a generic animation function despite 3 similar systems. The differences (icon creation, altitude handling, looping mode) are meaningful enough that duplication is clearer than abstraction. Will reconsider if a 4th animation type is added.
- **Observation:** Review/revision phases were light since this was a pattern-following change with no visual regressions expected. For UI/design changes, the screenshot review phase would be more critical.
- **Suggestion for future sessions:** The next high-impact features should shift away from animation (ferries, cars, planes are done) toward interactivity or atmosphere. Casino interior / baccarat tables would fulfill the Prime Directive's "signature feature." Ambient audio (Howler.js) would add immersion.

## Session 9 (2026-03-20) -- Ambient Audio Soundscape
- **Lesson:** Web Audio API is ideal for procedural ambient sound in a single-file app — no external audio files needed, no CDN dependency (unlike Howler.js which was originally planned in the roadmap).
- **Lesson:** Three sound layers (ocean, wind, city) create a convincing ambient soundscape. The LFO-modulated low-pass filter on white noise is the key technique for ocean waves — it creates rhythmic "surge" without requiring audio samples.
- **Lesson:** `linearRampToValueAtTime()` provides smooth gain transitions between audio states. Use 2-second ramps to avoid clicks/pops.
- **Lesson:** Starting audio muted and requiring user click is mandatory — browsers block autoplay. Using `AudioContext.suspend()/resume()` is the cleanest way to handle mute/unmute without destroying and recreating nodes.
- **Lesson:** Weather-reactive audio (wind speed scaling, rain detection) reuses the same `currentWeather` variable and `isRainyCode()` function from the weather system — no new API calls needed.
- **Observation:** This is the first non-visual feature. Adding a new sensory dimension (sound) is a category shift that feels more impactful than incremental visual improvements.

## Session 9 Meta-Observations
- **Observation:** Session was efficient — audio is self-contained with no dependencies on CesiumJS entities. Pure JavaScript Web Audio API, ~180 lines of code.
- **Decision:** Did not modify improve.mjs — orchestrator remains stable.
- **Suggestion for future sessions:** Next high-impact features should focus on interactivity (landmark info popups, click-to-explore) or the Prime Directive's signature feature (casino interior / baccarat tables). Audio could be enhanced later with more layers (traffic sounds, distant music for casino areas) but the foundation is solid.

## Session 10 (2026-03-20) -- Landmark Info Cards
- **Lesson:** Rich data (descriptions, facts, year, type) added directly to the LANDMARKS array keeps everything in one place — no separate data file needed for 8 items.
- **Lesson:** CSS modal pattern (fixed overlay + backdrop + card with transform animation) works well for info cards on top of CesiumJS. `pointer-events: none` on the container, `auto` when visible, prevents blocking 3D interaction.
- **Lesson:** Connecting explore panel clicks to landmark info cards via `LANDMARKS.find(l => l.name === item.name)` is simple name-matching that works because landmark names are unique. No need for IDs.
- **Lesson:** `setTimeout(showCard, 800)` after `flyTo` gives the camera enough time to start moving before the card appears, making the transition feel intentional rather than jarring.
- **Observation:** This is the first interactivity feature — shifting from passive viewing to active exploration. The info card transforms "look at landmark" into "learn about landmark."
- **Suggestion for future sessions:** Next high-impact features: casino interior (baccarat tables — the Prime Directive's signature feature), or more interactivity like time slider, minimap, or search.

## Session 11 (2026-03-20) -- Interactive Baccarat Table
- **Lesson:** A 2D game overlay on top of CesiumJS is the right approach for "casino interior" — no need for a full 3D room. A CSS/JS card game provides immediate interactivity without WebGL complexity.
- **Lesson:** Baccarat Punto Banco rules are simple enough to implement in ~80 lines of JS. The third-card rules look complex but are just a lookup table based on banker's score and player's third card value.
- **Lesson:** Animated card dealing (face-down → reveal → third card → result) using `setTimeout` steps creates engaging pacing. 400ms between cards, 500ms for reveal, 600ms for banker reveal works well.
- **Lesson:** Using the landmark `type` field to determine which landmarks get the "Enter Casino" button is clean — `type.indexOf('Casino') !== -1 || type.indexOf('Resort') !== -1` catches all 6 casino landmarks.
- **Lesson:** An 8-deck shoe (shuffled once, reshuffled when < 20 cards remain) is more realistic than shuffling per hand. Fisher-Yates shuffle is the standard.
- **Lesson:** Color-coding Player (blue) vs Banker (red) follows real casino convention and makes the UI immediately readable.
- **Observation:** This is the signature feature per the Prime Directive ("Baccarat is the Soul"). After 10 sessions of visual/atmospheric improvements, adding the defining interactive feature feels like crossing a major milestone.
- **Suggestion for future sessions:** The baccarat game could be enhanced with: betting UI, hand history/scoreboard (Big Road, Bead Plate), card flip animations (CSS 3D transforms), sound effects on deal/win. But the current version is functional and engaging.

## Session 13 (2026-03-20) -- Harbor Fireworks
- **Lesson:** Canvas 2D overlay is the right approach for fireworks — avoids CesiumJS bloom issues (per Session 6-8 lesson) while delivering high-impact visual effects. The canvas sits between the rain overlay and the UI overlay (z-index 55).
- **Lesson:** A self-contained IIFE for the fireworks system keeps it fully decoupled from CesiumJS. It only depends on `getMacauHour()` for time checks.
- **Lesson:** Particle physics (gravity, air resistance, decay, sparkle) create convincing firework bursts without complexity. 60-100 particles per burst is a good balance of visual density and performance.
- **Lesson:** Multiple burst types (spherical, ring, willow) and color palettes add variety without code complexity — it's just different angle/speed distributions.
- **Lesson:** Time-gated effects (20:00-01:00) should be checked periodically (every 30s) rather than continuously, to avoid unnecessary computation during inactive hours.
- **Observation:** This is the first "event-like" visual feature — fireworks lay groundwork for the event calendar system. Future events (Chinese New Year, Grand Prix) can trigger special firework shows with custom palettes/frequency.
- **Observation:** Since current Macau time was ~7 AM during development, the feature couldn't be visually verified live. The code was verified structurally (canvas exists, no JS errors). For time-gated features, consider temporarily overriding the time check during review.

## Meta-Process Learnings
- **Lesson:** The improvement script itself needs to be correct before the loop runs. Test it manually first.
- **Lesson:** Add a Phase 8 (meta-improve) so the agent improves its own process each cycle.
- **Lesson:** Keep AGENT_LEARNINGS.md — it's the agent's long-term memory across sessions.
