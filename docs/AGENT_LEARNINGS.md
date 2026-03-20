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

## Meta-Process Learnings
- **Lesson:** The improvement script itself needs to be correct before the loop runs. Test it manually first.
- **Lesson:** Add a Phase 8 (meta-improve) so the agent improves its own process each cycle.
- **Lesson:** Keep AGENT_LEARNINGS.md — it's the agent's long-term memory across sessions.
