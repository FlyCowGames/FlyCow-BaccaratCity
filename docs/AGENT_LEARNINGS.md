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

## Session 6 (2026-03-20) -- Neon Casino Glow
- **Lesson:** CesiumJS `viewer.scene.postProcessStages.bloom` is a built-in ready-to-use bloom stage — no need to create one via `PostProcessStageLibrary`. Just access and configure its uniforms.
- **Lesson:** Canvas radial gradients make effective "light source" billboards — a 64px canvas with a bright-center-to-transparent gradient creates a convincing glow orb when combined with bloom.
- **Lesson:** Bloom `contrast` and `brightness` uniforms are the most impactful for controlling how "glowy" the scene looks. High contrast (~119) with slightly negative brightness (-0.2 to -0.15) avoids washing out the whole scene while making bright elements pop.
- **Lesson:** Time-of-day glow modulation should use smooth ramps at dusk/dawn (1 hour each) rather than hard on/off — avoids jarring transitions as users watch.
- **Lesson:** Adding high-altitude secondary glow entities (150m) for major casinos helps the glow remain visible from bird's eye views where ground-level entities would be too small.
- **Lesson:** The `updateNeonGlow()` function only needs to run every 10 seconds since time changes slowly — no need for per-frame updates like ferry positions.

## Session 6 Meta-Observations
- **Observation:** The "Required Skills" in the prompt (/frontend-design, /brainstorming, /verification-before-completion, /systematic-debugging) may not exist as actual slash-command skills. Session completed successfully without them — code review was done manually.
- **Observation:** Session ran efficiently — 8 phases in sequence worked well. No phase felt redundant.
- **Observation:** Bloom post-processing is a "scene-wide" effect — needs careful tuning to avoid washing out the entire scene. Keeping brightness negative and contrast high isolates the glow to bright elements only.
- **Decision:** Did not modify improve.mjs this session — the orchestrator is working correctly and no improvements were urgent.

## Meta-Process Learnings
- **Lesson:** The improvement script itself needs to be correct before the loop runs. Test it manually first.
- **Lesson:** Add a Phase 8 (meta-improve) so the agent improves its own process each cycle.
- **Lesson:** Keep AGENT_LEARNINGS.md — it's the agent's long-term memory across sessions.
