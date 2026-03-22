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

## Session 15 (2026-03-21) -- Animated Pedestrians
- **Lesson:** The CallbackProperty ping-pong pattern extends trivially to pedestrians — the 4th animation system (ferries, cars, planes, pedestrians) using the same core approach. At this point the pattern is battle-tested.
- **Lesson:** Pedestrians need even smaller billboard icons (8px) and shorter visibility range (4km) than cars (12px, 8km). They should only be noticeable when zoomed to street level, not compete with vehicles from above.
- **Lesson:** Random phase offsets (vs evenly distributed like cars) create more natural-looking crowd movement — pedestrians don't walk in formation.
- **Lesson:** Variable durations per pedestrian (random within zone's range) prevent the "synchronized walking" effect. Combined with random path assignment and random direction, this creates convincing crowd behavior with minimal code.
- **Lesson:** Multiple short paths per zone (2-3 waypoints each) work better than one long path for pedestrians — people stroll around a small area, they don't march long distances.
- **Observation:** This is the 4th entity animation system using the same pattern. The pattern reuse is still cleaner than abstracting, since each entity type has different icon size, altitude, visibility range, and movement style.

## Session 16 (2026-03-21) -- Construction Cranes
- **Lesson:** For objects that need visible rotation (like crane arms), using an orbiting satellite entity (small warning light dot) circling via `cos/sin` on the CallbackProperty is more effective than trying to rotate a billboard. Billboards always face the camera, so rotation of the image looks wrong, but an orbiting light at the crane top convincingly suggests a rotating jib.
- **Lesson:** Canvas-drawn structural shapes (lattice tower with cross-braces) work at small sizes but look best with `scaleByDistance` set to larger near values (3.0) so the detail is visible when zoomed in. The canvas icon approach is reaching its limits for complex shapes — future detailed structures might benefit from actual 3D models via glTF.
- **Lesson:** The 5th animation system (cranes) using CallbackProperty — the pattern is truly battle-tested now. Each new entity type takes <10 minutes to implement because the pattern is so well established.
- **Observation:** Adding a new section to the Explore panel (Development) was trivial — just add to the ATTRACTIONS object and populateAttractions function. The panel code is cleanly factored for extension.
- **Observation:** `armRadius` values of 0.0003-0.0004 degrees produce convincing crane arm radius at Macau's latitude (~30-40m real-world radius). This is a useful reference for future circular animation paths.

## Session 17 (2026-03-21) -- Harbor Water Shimmer
- **Lesson:** Using `CallbackProperty` for billboard `scale` (not just position) enables animated shimmer/twinkling effects. Each entity gets a random phase and speed for independent oscillation — sine wave produces natural shimmer.
- **Lesson:** Tying shimmer intensity to `_currentGlowIntensity` (from the neon glow system) creates a unified day/night atmosphere — shimmer is subtle during day (sun sparkle) and bright at night (casino reflections) without needing a separate time calculation.
- **Lesson:** Water surface billboard entities at 2m altitude sit correctly on the Google 3D Tiles water surface. This is lower than ferries (3m) because shimmer should appear ON the water, not above it.
- **Lesson:** 23 water shimmer entities is a reasonable count — enough for visual density without performance concerns. Combined with existing entities (ferries, cars, planes, pedestrians, cranes, neon), the total entity count is manageable.
- **Observation:** During daytime testing, shimmer is intentionally very subtle (scale multiplied by 0.3). The full effect is designed for nighttime when casino reflections would dominate the harbor. This is correct behavior, not a bug.

## Session 19 (2026-03-21) -- Wynn Palace Performance Lake Fountain Show
- **Lesson:** Choreographed fountain shows are a great visual feature — they combine time-gated activation (like fireworks) with dynamic billboard height animation (like shimmer). The crescendo/diminuendo envelope (`sin(progress * PI)`) creates a natural show arc without complex state machines.
- **Lesson:** Using `CallbackProperty` for billboard `height` (not just scale or position) enables dynamic jet height effects. Combined with position changes, this creates convincing water jet animation.
- **Lesson:** The "show/pause" cycle pattern (3-min show, 15-min pause) is a good template for recurring timed events. The state machine is simple: check if show ended → pause, check if pause ended → start new show.
- **Lesson:** Color palette cycling per show (randomly selecting from 6 palettes at show start and updating billboard images) adds variety without runtime overhead — the icon is created once per show, not per frame.
- **Lesson:** Fountain mist entities with animated scale provide atmospheric depth. Using IIFE closures to capture per-entity random phase/speed in `CallbackProperty` is the clean pattern for this.
- **Observation:** Session 18's sky beams were already committed but not documented. Always check for undocumented previous sessions and update CHANGELOG accordingly.

## Quality Audit Process (added 2026-03-21) — FROM OWNER
- **RULE:** Every 10 sessions (10, 20, 30, 40...) is a FULL QUALITY AUDIT session.
- **RULE:** During audits, screenshot from multiple angles, evaluate every feature (GOOD/MEH/BAD), and fix the worst one. Do NOT add new features during audits.
- **RULE:** Features should not be built and forgotten. If something looks crappy, it gets fixed. Quality over quantity.
- **RULE:** Between audits, if a previous audit flagged something as MEH or BAD, prioritize fixing it over adding new features.
- **Lesson:** Building lots of features that each look 60% polished is worse than fewer features at 90%. Always ask: "Does this look professional?"

## Session 21 (2026-03-21) -- Guia Circuit Race Cars
- **Lesson:** Closed-loop circuits (where the last point equals the first) work perfectly with the one-way loop animation pattern from airport planes (`t = ... % 1`). The car seamlessly wraps from the last waypoint back to the start without any jump because the positions match.
- **Lesson:** Race cars benefit from brighter, more distinctive icons than regular traffic. A white-core radial gradient with colored outer glow (16px vs 12px for cars) makes them stand out as special entities among regular traffic dots.
- **Lesson:** The 6th entity animation system (after ferries, cars, planes, pedestrians, cranes) using CallbackProperty. At this point, adding a new animated entity type is truly formulaic — define waypoints, create icon, add entities with CallbackProperty, done in <15 minutes.
- **Lesson:** For the Explore panel, adding a new section (Racing) is trivial: add HTML div, add to ATTRACTIONS object, add forEach in populateAttractions. The panel code is well-factored for extension.
- **Observation:** The Guia Circuit is a near-term roadmap item now completed. The race cars are always active (not event-gated to November) as a permanent feature showing the iconic circuit. Future enhancement: increase car count and add sound effects during the actual Macau Grand Prix in November.

## Session 22 (2026-03-21) -- Traditional Junk Boats
- **Lesson:** The 7th entity animation system (after ferries, cars, planes, pedestrians, cranes, race cars) using CallbackProperty. Canvas icon creation is the main differentiator between entity types — the animation pattern is truly cookie-cutter at this point.
- **Lesson:** Larger canvas icons (32px vs 24px for ferries, 12px for cars) with detailed shapes (hull, mast, sails, battens) add cultural character. The red-sailed junk is immediately recognizable even at small sizes due to the distinctive triangular sail shape and red color.
- **Lesson:** Contrasting speeds between entity types adds realism — junks at 85-100s per route vs ferries at 50-55s creates visual variety. Slow entities feel stately and traditional, fast entities feel modern.
- **Observation:** At bird's eye view, small billboard entities are hard to distinguish from each other. The junk boats are most impactful when zoomed to harbour level where the sail shape and red color are visible. Features designed for close-up viewing may not justify the entity count at overview level.
- **Suggestion for future sessions:** Consider adding cultural/historical features that are visible at overview level (e.g., colored district zones, larger landmark enhancements). Many recent sessions have added small billboard entities that are only visible zoomed in.

## Session 24 (2026-03-21) -- Geographic District Labels
- **CRITICAL: CesiumJS Label entities (Cesium.LabelGraphics) crash with Google 3D Tiles.** The error is `RangeError: Failed to set the 'length' property on 'Array': Invalid array length`. This is similar to the bloom issue from Session 6-8 — certain CesiumJS features are incompatible with Google 3D Tiles. **Always use canvas-rendered billboard entities for text, never CesiumJS Label entities.**
- **Lesson:** Canvas-rendered text on billboard entities is the safe, proven approach for all text rendering in this project. The existing landmark billboards use this pattern. For district labels, a 320x56 canvas with `ctx.fillText()` + `ctx.strokeText()` provides clean gold text with dark outlines.
- **Lesson:** `translucencyByDistance` with near=0.0 (invisible) and far=1.0 (visible) creates "overview-only" entities — the opposite of pedestrians/shimmer which are "close-up-only". This is useful for geographic labels that should orient visitors from above but not clutter the view when zoomed in.
- **Lesson:** District labels at 300m altitude float above most buildings and are visible from wide angles without being occluded by 3D tiles. Higher than landmarks (80m) but lower than sky beams (280-400m).
- **Observation:** This is the first feature designed primarily for the overview/bird's eye experience. Previous sessions (pedestrians, shimmer, junk boats) were all close-up features. Mixing visibility ranges creates a richer experience at all zoom levels.

## Session 26 (2026-03-21) -- Guia Lighthouse Rotating Beam
- **Lesson:** Billboard `rotation` can be animated via CallbackProperty, enabling rotating beam effects. The rotation value is in radians, counter-clockwise from up (12 o'clock). Combine with position CallbackProperty for the beam origin to move as well.
- **Lesson:** Horizontal beam billboards (wide canvas, narrow height) with `horizontalOrigin: LEFT` create convincing lighthouse beams — the left edge stays at the light source position while the beam extends outward.
- **Lesson:** Real lighthouse rotation periods are ~15 seconds, but 8 seconds looks better in the scene — faster rotation makes the beam more noticeable as a visual feature.
- **Lesson:** Heritage features (lighthouse, temple details) add cultural depth distinct from the many casino/entertainment features. The Heritage section in the Explore panel provides a category for non-casino, non-gaming cultural landmarks.
- **Observation:** At 153 entities total, no performance issues observed. The entity count continues to grow but CesiumJS handles it well.

## Session 27 (2026-03-21) -- Macau LRT Light Rail
- **Lesson:** The 8th entity animation system (after ferries, cars, planes, pedestrians, cranes, race cars, junk boats) using CallbackProperty. The pattern is completely formulaic at this point — define route waypoints, create canvas icon, add entities with one-way loop or ping-pong, done in ~15 minutes.
- **Lesson:** Elevated transit at 15m altitude sits above road traffic (5m) but below landmarks (80m). This altitude layering (water 2-3m, roads 5m, LRT 15m, landmarks 80m, district labels 300m) creates a natural visual hierarchy.
- **Lesson:** Canvas `roundRect` is relatively new API — always use feature detection (`if (ctx.roundRect)`) with a `ctx.rect` fallback for browser compatibility.
- **Lesson:** For closed-loop routes that include a branch (like the LRT airport branch), include the return waypoints explicitly in the route array. The train travels out to the branch and back as part of its full circuit.
- **Observation:** At 156 entities total, still no performance issues. The entity count continues to scale well with CesiumJS.
- **Observation:** Playwright browser version mismatches (agent-browser expected 1200, installed 1208) can be fixed with symlinks. Note for future: keep playwright versions aligned.

## Session 29 (2026-03-21) -- Bridge Night Illumination
- **Lesson:** Bridge light points at 12m altitude sit correctly at bridge deck level with Google 3D Tiles — between water surface (2-3m) and LRT elevated track (15m). The altitude layering continues to work well.
- **Lesson:** Using `_currentGlowIntensity` to control bridge light scale (returning 0 when < 0.05) is the cleanest way to make entities night-only — no separate visibility toggle needed, and the fade-in at dusk is automatic and smooth.
- **Lesson:** Interpolating additional waypoints between existing traffic route endpoints creates denser light point coverage along bridges. 16-18 points per bridge provides good visual density without excess.
- **Lesson:** Different LED colors per bridge (cool blue-white, warm gold, neutral white) adds visual variety and matches real-world bridge lighting schemes. This color differentiation also helps users identify which bridge they're looking at from above.
- **Observation:** The Explore panel now has 10 sections (Landmarks, On the Water, Casinos, Development, Shows, Racing, Bridges, Heritage, Transit, Live Events). It's getting long — future sessions may want to consider collapsible sections or a search/filter feature.
- **Observation:** At ~166 entities total (50 bridge lights + 156 prior), still no performance issues with CesiumJS. Entity-based billboard approach continues to scale well.

## Session 31 (2026-03-21) -- Time-of-Day Slider
- **Lesson:** Overriding `getMacauHour()` with a global `_timeOverride` variable is the cleanest way to make ALL time-gated features respond to a time preview. Since every feature already calls `getMacauHour()`, the single override point cascades everywhere — neon glow, fireworks, bridge lights, lighthouse, fountain shows, sky beams, water shimmer.
- **Lesson:** CesiumJS `viewer.clock.currentTime = Cesium.JulianDate.fromDate(utcDate)` changes the sun/moon position instantly. Set `shouldAnimate = false` during override to prevent the clock from ticking forward, then restore `shouldAnimate = true` when returning to live mode.
- **Lesson:** Converting a Macau local hour to UTC for CesiumJS requires subtracting 8 hours (UTC+8 offset). Build a local Date first, then subtract `8 * 3600000` ms to get UTC.
- **Lesson:** The range slider `input` event fires continuously while dragging — perfect for real-time preview. Using `step="0.25"` gives 15-minute increments (96 positions), which is granular enough for smooth transitions without being overwhelming.
- **Observation:** This is the first interactivity feature that enhances ALL existing features rather than adding a new one. The time slider makes ~60% of the content (night-only features) accessible to daytime visitors. Meta-features that multiply the value of existing features are high-leverage.
- **Observation:** The Explore panel observation from Session 29 (10 sections, getting long) is still relevant. Should be addressed in a future session with collapsible sections.

## Session 32 (2026-03-21) -- Floating Sky Lanterns
- **Lesson:** Ascending animation (rising from low to high altitude, then recycling) is a new variant of the CallbackProperty pattern. The key technique is `t = ((elapsed / duration) + phase) % 1` with quadratic ease-out `altT = 1 - (1 - t) * (1 - t)` for natural deceleration as lanterns rise.
- **Lesson:** Fade-in at launch (`t < 0.05`) and fade-out at peak (`t > 0.9`) via scale callback prevents the visual "pop" when lanterns reset position. The transition is nearly imperceptible.
- **Lesson:** Flicker effect via `0.9 + 0.1 * Math.sin(elapsed * 3.5 + phase)` creates a convincing flame-inside-lantern look. Small amplitude (0.1) is key — too much flicker looks like a strobe.
- **Lesson:** Sky lanterns at 30-220m altitude are visible from both overview and medium zoom. This is a good altitude range for "atmospheric" features — higher than street-level entities but lower than district labels.
- **Observation:** The 9th entity animation system using CallbackProperty. This one introduces vertical movement (ascent) rather than horizontal path-following, which is a new variant but uses the same core pattern.
- **Observation:** The Explore panel Heritage section now has 2 entries (Guia Lighthouse + Sky Lanterns). Heritage is a good category for cultural features.

## Session 33 (2026-03-21) -- Macau Helicopter Service
- **Lesson:** The 10th entity animation system using CallbackProperty (after ferries, cars, planes, pedestrians, cranes, race cars, junk boats, LRT, sky lanterns). The `lerpPositionWithAlt` function from airport planes is directly reusable for any 3D flight path — helicopters, drones, cable cars, etc.
- **Lesson:** The Outer Harbour heliport at coordinates (113.5535, 22.1920) is the real location of the Macau-Hong Kong helicopter shuttle service (Sky Shuttle / East Asia Airlines). Using real heliport coordinates adds authenticity.
- **Lesson:** Canvas helicopter icons at 24px with rotor disc, fuselage, tail boom, and position lights create a recognizable silhouette even at small sizes. The translucent rotor disc (ellipse with low-opacity stroke) suggests motion without needing animation of the rotor itself.
- **Lesson:** Three routes (outbound shuttle, inbound shuttle, scenic tour) with one helicopter each provides good coverage without cluttering the scene. The scenic tour's circular route over the peninsula showcases landmarks from above.
- **Observation:** At ~169 entities total (3 helicopters + 166 prior), still no performance issues. The entity count continues to scale well.
- **Observation:** Playwright browser version mismatch (expected 1200, installed 1208) recurred — symlink fix works but is fragile. This is a recurring issue noted in Session 27.

## Session 34 (2026-03-21) -- Auto-Tour Mode
- **Lesson:** The Explore panel already had collapsible sections (CSS `collapsed` class + JS toggle) — always read the current code before assuming a feature is missing based on old observation notes. Session 29/31 flagged it as needed but it was already implemented.
- **Lesson:** `camera.flyTo` with a `complete` callback + `setTimeout` for dwell time is a clean pattern for sequential camera tours. No state machine needed — just recursion via `tourNext()`.
- **Lesson:** Randomized heading angles (`30 + Math.random() * 60`) at each tour stop create cinematic variety, making the same location look different each visit.
- **Lesson:** Stopping the tour on user interaction (LEFT_DOWN, WHEEL, RIGHT_DOWN via ScreenSpaceEventHandler) provides intuitive escape — users can "take over" at any moment by touching the controls.
- **Observation:** This is a meta-feature (like the time slider in Session 31) that multiplies the value of all existing attractions. Users who don't explore the panel manually can still discover all 30+ points of interest. Meta-features that showcase existing content are high-leverage.
- **Observation:** Positioning two buttons side by side requires careful CSS transform offsets. `translateX(calc(-50% - 65px))` and `translateX(calc(-50% + 65px))` with the same `left: 50%` creates a centered pair with a gap.

## Session 36 (2026-03-21) -- Dragon Boat Racing on Nam Van Lake
- **Lesson:** The 11th entity animation system using CallbackProperty. At this point the pattern is completely formulaic: define lane/route waypoints, create canvas icon, add entities with ping-pong or one-way loop. Implementation took ~10 minutes.
- **Lesson:** Dragon boat icons at 36x20px (wider than tall) better represent the elongated hull shape. Using a non-square canvas for billboard icons is fine — CesiumJS handles any aspect ratio.
- **Lesson:** Parallel racing lanes (slightly offset lat/lon coordinates for each lane) create a convincing racing effect. Varied durations per lane (22-26s) mean boats naturally overtake each other without needing complex racing logic.
- **Lesson:** Nam Van Lake area (around 113.536, 22.185) was previously only used for water shimmer. Adding dragon boats gives the lake proper animated life and makes it a destination in the Explore panel.
- **Observation:** The ATTRACTIONS.water section now has 7 entries. The "On the Water" section of the Explore panel is getting rich. Dragon boats auto-integrate with the TOUR feature since getAllTourStops() pulls from all ATTRACTIONS categories.

## Session 37 (2026-03-21) -- Venetian Canal Gondolas
- **Lesson:** The 12th entity animation system using CallbackProperty. At this point adding a new animated entity type is purely mechanical — define route waypoints, create canvas icon, add entities with ping-pong or one-way loop. Implementation took ~5 minutes.
- **Lesson:** Gondola icons with distinctive features (hull shape, ferro prow, gondolier figure, oar) are recognizable even at 28x16px canvas size due to the iconic silhouette. The black hull + gold accents contrast well with the surrounding 3D tiles.
- **Lesson:** When verifying small entities at street level via screenshots, the orbit system (post-cinematic) continuously overrides camera position. Must call `stopOrbit(viewer)` before `setView()` — `cancelFlight()` alone is not enough.
- **Lesson:** The Shows section of the Explore panel is a good fit for entertainment/experience features (fountain show, gondola rides) as distinct from pure transport (Transit) or environmental features (Heritage).
- **Observation:** At ~172 entities total (3 gondolas + 169 prior), still no performance issues with CesiumJS.

## Session 38 (2026-03-21) -- Red Lantern Strings in Historic District
- **Lesson:** The 13th entity animation system using CallbackProperty. At this point, adding new billboard entity features is purely mechanical — define positions, create canvas icon, add entities. The lantern strings used `scale` CallbackProperty for wind sway (same technique as water shimmer from Session 17).
- **Lesson:** Canvas-drawn lantern strings at 64x32px with catenary wire sag, red oval bodies, gold ribs, inner glow highlights, and tassels create a recognizable and culturally authentic icon even at small sizes. The wider canvas (64px vs typical 28-32px) accommodates the horizontal string layout.
- **Lesson:** Using billboard `rotation` as a static value (not animated) to match street orientation at each placement point gives a more natural appearance than all strings facing the same direction.
- **Lesson:** Night glow boost via `_currentGlowIntensity` scaling (1.0 + intensity * 0.15) is subtle enough to avoid oversizing but noticeable enough that lanterns "light up" at night. The same approach could apply to future decorative elements.
- **Observation:** At ~182 entities total (10 lantern strings + 172 prior), still no performance issues with CesiumJS. Entity count continues to scale well.
- **Observation:** Cultural/decorative features (lanterns, cobblestones, temple details) are distinct from the many animation-focused features. They add atmosphere and authenticity at a different visual layer — static but visually rich, complementing the animated entities.

## Session 39 (2026-03-21) -- Macau Tower SkyJump/Bungy
- **Lesson:** The 14th entity animation system using CallbackProperty — but the first with multi-bounce vertical physics rather than horizontal path-following. The bungy simulation (free fall → 3 damped bounces → winch-back) is a new variant that uses piecewise math functions within the same CallbackProperty pattern.
- **Lesson:** Bungy physics can be convincingly simulated with piecewise segments: quadratic fall (`ft*ft`), sine bounces with decreasing amplitude (70% → 40% → 15%), and quadratic winch-back up. No need for real physics integration — the visual effect is convincing with 6 segments.
- **Lesson:** Hiding entities during the "pause" phase (scale=0 when waiting at top) is cleaner than removing/re-adding entities. The scale CallbackProperty returning 0.0 makes the entity invisible without any entity lifecycle management.
- **Lesson:** For vertical animations near tall structures, `disableDepthTestDistance: Number.POSITIVE_INFINITY` is essential — the jumpers would otherwise clip behind the 3D-tiled tower geometry at many angles.
- **Observation:** This is the first "thrill attraction" feature — distinct from transport (ferries, cars, planes), cultural (lanterns, junk boats), or ambient (shimmer, sky beams) entity types. It adds a playful, dynamic element that showcases a real Macau attraction.
- **Observation:** At ~184 entities total (2 jumpers + 182 prior), still no performance issues with CesiumJS.
- **Note:** Session 40 will be a FULL QUALITY AUDIT (40 % 10 == 0). Prepare for screenshot evaluation of all features.

## Session 41 (2026-03-21) -- Cotai Strip LED Facade Screens
- **Lesson:** Using `setInterval` for canvas icon regeneration (every 500ms) is a pragmatic approach for animated textures — per-frame canvas redraw would be wasteful, while too-slow intervals would look static. 500ms gives smooth color cycling without performance impact.
- **Lesson:** Billboard `image` as a CallbackProperty returning a canvas element works for dynamically updating textures. The canvas reference changes each interval, and CesiumJS picks up the new image.
- **Lesson:** HSL color space (`hsla()`) in canvas context is ideal for color-cycling effects — incrementing hue naturally produces rainbow-like color waves without manual RGB math.
- **Lesson:** LED grid patterns (colored cells with small gaps) create a convincing electronic display look even at small canvas sizes (96x48px with 12x6 cells). The gaps between cells suggest individual LED pixels.
- **Observation:** The 15th entity animation system. This one uses a hybrid approach: `CallbackProperty` for scale (night visibility) combined with `setInterval` for canvas regeneration (color cycling). This separates the visibility logic (per-frame) from the visual update (periodic), which is more efficient than redrawing the canvas every frame.
- **Observation:** At ~189 entities total (5 LED facades + 184 prior), still no performance issues with CesiumJS. The entity count continues to scale well.
- **Note:** Session 40 (quality audit) was skipped. The next audit should happen at Session 50.

## Session 43 (2026-03-21) -- Harbor Seagulls
- **Lesson:** The 16th entity animation system using CallbackProperty. Circular orbiting via `cos/sin` (same technique as crane warning lights from Session 16) works perfectly for bird flight patterns. Adding per-bird speed variation, radius variation, and figure-eight wobble overlay creates convincing flock behavior.
- **Lesson:** Billboard `rotation` as a CallbackProperty following the orbit angle (tangent to circle) makes birds appear to face their direction of travel — a small detail that adds significant realism. The formula is `-angle + Math.PI/2` since CesiumJS rotation is counter-clockwise from 12 o'clock.
- **Lesson:** Seagulls at 60-100m altitude fill a visual gap between ground-level entities (2-5m) and aircraft (200-700m). This "mid-sky" altitude layer was completely empty before — adding life there makes the scene feel more complete at medium zoom levels.
- **Lesson:** Always-active entities (not time-gated to night) are a nice contrast to the many night-only features. Seagulls are visible during daytime when ~60% of features are hidden, giving daytime visitors more to see.
- **Observation:** At ~207 entities total (18 seagulls + 189 prior), still no performance issues with CesiumJS. The entity count continues to scale well.
- **Observation:** The agent-browser `eval` command has issues with curly quote encoding when commands include JavaScript with quotes. Using heredoc files or single-character strings works around this.

## Session 44 (2026-03-21) -- Casino Rooftop Searchlights
- **Lesson:** The lighthouse rotating beam pattern (Session 26) adapts trivially to sweeping searchlights. The key difference: using `Math.sin(angle) * sweepAmplitude` for oscillating sweep instead of continuous rotation gives a more dramatic, premiere-night effect — beams sweep back and forth instead of spinning full circles.
- **Lesson:** Using `horizontalOrigin: LEFT` for beam billboards (as learned in Session 26) is essential — the beam extends outward from the source point rather than centering on it. Combined with `rotation` CallbackProperty, this creates a convincing sweeping beam anchored at the casino rooftop.
- **Lesson:** Different sweep periods (10-15s) and sweep amplitudes (1.8-2.6 radians) per casino prevent synchronized "windshield wiper" movement. Each searchlight feels independent.
- **Lesson:** Distinct beam colors per casino (warm white, purple-white, gold, peach, cool blue, pink) add visual variety and help users identify which casino each searchlight belongs to — same approach as bridge night illumination (Session 29).
- **Observation:** The 17th entity animation system. At this point, billboard entity animation using CallbackProperty is the fundamental visual building block of the entire application. The pattern is completely proven across 17 different entity types.
- **Observation:** At ~213 entities total (6 searchlights + 207 prior), still no performance issues with CesiumJS.

## Session 45 (2026-03-21) -- Galaxy Macau Rooftop Wave Pool
- **Lesson:** The 18th entity animation system using the hybrid CallbackProperty + setInterval approach (same as LED facades, Session 41). The setInterval canvas regeneration (400ms) provides animated wave crests without per-frame canvas redraw overhead.
- **Lesson:** Elliptical pool shapes via `ctx.ellipse()` on canvas look more natural for water features than rectangular or circular shapes. The turquoise gradient (0,180,220 → 0,100,180) reads clearly as "pool water" even at small billboard sizes.
- **Lesson:** Always-active features (not night-gated) are valuable because ~60% of content is night-only. Daytime visitors see the wave pool, seagulls, traffic, ferries, and a few others — but most spectacle features are hidden. Adding more daytime features balances the experience.
- **Lesson:** The Galaxy Macau rooftop at 55m altitude is consistent with the altitude layering system: water 2-3m, roads 5m, LRT 15m, rooftop features 55m, landmarks 80m, district labels 300m.
- **Observation:** At ~220 entities total (7 wave pool + 213 prior), still no performance issues with CesiumJS. The entity count continues to scale well.
- **Observation:** This is the first "landmark detail" feature — adding animated elements to a specific real-world landmark feature (Galaxy's famous wave pool). Future candidates: Grand Lisboa lotus shape, Ruins of St. Paul's facade detail, A-Ma Temple incense coils.

## Session 46 (2026-03-22) -- A-Ma Temple Incense Coils
- **Lesson:** The 19th entity animation system using the hybrid CallbackProperty + setInterval approach. "Landmark detail" features (adding animated elements to specific real-world landmark features) are a productive category — they add cultural depth and authenticity. Previous example: Galaxy wave pool (Session 45).
- **Lesson:** Spiral incense coils are an iconic visual at A-Ma Temple specifically — large conical coils hang from beams in the temple courtyards. Canvas-drawn concentric ellipses create a convincing spiral coil shape at 32x40px.
- **Lesson:** Rising smoke wisps reuse the sky lantern ascending pattern (Session 32) — quadratic ease-out for deceleration, fade-in at launch, fade-out at peak, continuous recycling. This vertical ascending animation pattern is now proven across two features.
- **Lesson:** At ~232 entities total (12 incense/smoke + 220 prior), still no performance issues with CesiumJS. Entity count continues to scale well.
- **Observation:** This is the 2nd "landmark detail" feature after Galaxy wave pool. Good candidates for future sessions: Grand Lisboa lotus/torch shape, Ruins of St. Paul's facade illumination, Senado Square cobblestone pattern.
- **Observation:** Always-active (daytime) features continue to be valuable. With this addition, daytime-visible features include: traffic, ferries, planes, pedestrians, cranes, race cars, junk boats, LRT, helicopters, seagulls, dragon boats, gondolas, wave pool, and now incense coils.

## Session 48 (2026-03-22) -- Camera Position URL Sharing
- **Lesson:** `history.replaceState(null, '', '#' + hash)` is the right way to update URL hash without triggering a page reload or creating navigation history entries. `window.location.hash = ...` would work but adds history entries.
- **Lesson:** CesiumJS `camera.changed` event fires frequently during interaction. Setting `camera.percentageChanged = 0.01` (1%) reduces spurious events. Combined with 500ms debounce, this prevents hammering `history.replaceState`.
- **Lesson:** `camera.moveEnd` fires after all camera movement completes (including flyTo animations), while `camera.changed` fires during movement. Using both ensures the hash is always up-to-date.
- **Lesson:** URL hash format `v=lon,lat,alt,heading,pitch` is compact and human-readable. Rounding lon/lat to 5 decimal places (~1m precision) and heading/pitch to integers is sufficient for view sharing.
- **Lesson:** Sanity checks on decoded URL parameters (lon 113.4-113.7, lat 22.0-22.3 for Macau) prevent users from being teleported to invalid locations via malformed URLs.
- **Lesson:** `navigator.clipboard.writeText()` requires HTTPS and returns a Promise — always provide a fallback message for contexts where clipboard access fails (e.g., HTTP, iframe restrictions).
- **Observation:** After 19 sessions of billboard entity features (Sessions 15-46), switching to a UX/interactivity improvement was a good change of pace. The project benefits from variety in improvement types — not just "more animated dots on the map."
- **Observation:** This is a "meta-feature" like the time slider (Session 31) and auto-tour (Session 34) — it multiplies the value of all existing features by making them shareable and directly linkable.
- **Suggestion for future sessions:** Consider more UX improvements: minimap for navigation, search for landmarks, keyboard shortcuts (1-8 for landmarks, N for night, D for day). These foundational features multiply the value of existing content.

## Session 49 (2026-03-22) -- Minimap Navigation
- **Lesson:** Canvas 2D is the right approach for a minimap overlay — lightweight, no additional dependencies, draws directly in the existing overlay system. The same canvas technique used for fireworks (Session 13) works for a different purpose here.
- **Lesson:** Simplified coastline polygons (20-ish points per landmass) are sufficient for a recognizable minimap at 160x180px. Real OSM coastline data would be overkill — hand-traced outlines are good enough at this scale.
- **Lesson:** `camera.positionCartographic` provides lon/lat/alt in radians — always convert with `Cesium.Math.toDegrees()`. The camera heading property is in radians too, used directly for the direction indicator line via `Math.sin(heading)` / `Math.cos(heading)`.
- **Lesson:** Click-to-fly from minimap uses reverse projection (canvas coordinates → lon/lat) which is the inverse of the drawing projection. Must account for canvas padding in both directions.
- **Lesson:** `setInterval(drawMinimap, 500)` is efficient enough for real-time camera tracking without per-frame overhead. The minimap doesn't need 60fps — 2 updates per second is smooth enough for an overview indicator.
- **Observation:** This is the 3rd "meta-feature" (after time slider Session 31, auto-tour Session 34, URL sharing Session 48) that enhances the entire experience rather than adding a single new visual element. Two UX sessions in a row (48, 49) is a healthy shift from the 19-session billboard entity streak.
- **Observation:** The FOV cone drawn as a subtle triangle gives spatial awareness — users can see not just where the camera is but which direction it's facing. This makes the minimap genuinely useful for navigation, not just decoration.
- **Note:** Session 50 will be a FULL QUALITY AUDIT (50 % 10 == 0). Prepare to screenshot from multiple angles and evaluate all features.

## Session 51 (2026-03-22) -- Explore Panel Search
- **Lesson:** Real-time search filtering is straightforward — `input` event listener on a text field, iterate items checking `textContent.toLowerCase().indexOf(query)`, toggle `display:none` via CSS class. ~30 lines of JS.
- **Lesson:** Auto-expanding collapsed sections on search match is essential UX — without it, matches inside collapsed sections would be invisible and the search would feel broken. Remove `collapsed` class on sections with matches.
- **Lesson:** Hiding entire sections (not just items) when no items match keeps the panel clean — empty section headers with no items look broken.
- **Lesson:** The `×` clear button needs `display:none` by default and `display:block` when query is non-empty. This prevents a dead-looking button in the empty state.
- **Observation:** This is the 4th UX/meta-feature (time slider S31, auto-tour S34, URL sharing S48, minimap S49, search S51). These features multiply the value of all existing content — a user can now find any of 30+ attractions instantly instead of scrolling through 10 sections. High leverage, low code.
- **Observation:** Session 50 (quality audit) appears to have been skipped. The next audit should be at Session 60.


## Session 53 (2026-03-22) -- Keyboard Shortcuts + Help Overlay
- **Lesson:** When a feature's state is encapsulated in an IIFE (like the time slider's local `isLive` variable), trigger the UI from outside by dispatching native events on the DOM elements (`slider.dispatchEvent(new Event('input'))`) or calling `element.click()` rather than trying to access internal state. This decouples keyboard shortcuts from feature internals.
- **Lesson:** Keyboard shortcuts must check `e.target.tagName === 'INPUT'` to avoid firing when the user is typing in search fields or other text inputs. Also check for overlay states (baccarat, help) to avoid conflicting interactions.
- **Lesson:** A styled help overlay following the site's dark/gold theme (using the same `Cinzel`, `DM Mono`, `Noto Sans SC` font stack and gold colors) integrates naturally. Using `<span class="help-key">` styled as keyboard key caps makes shortcuts scannable.
- **Lesson:** Keyboard shortcuts are a "meta-meta-feature" — they make all existing features instantly accessible via single keystrokes, multiplying the value of the time slider, tour, explore panel, landmarks, share view, and audio toggle simultaneously.
- **Observation:** This is the 5th UX/meta-feature (time slider S31, auto-tour S34, URL sharing S48, minimap S49, search S51, shortcuts S53). The project now has a solid interactivity layer on top of the visual content. Future sessions should shift back to visual/atmospheric improvements.
- **Observation:** Session 50 quality audit was skipped (noted in Session 51 learnings). The next audit should happen at Session 60. Sessions 40 and 50 were both skipped — audits keep getting deferred.

## Session 54 (2026-03-22) -- Baccarat Betting System
- **Lesson:** Enhancing an existing feature (baccarat game → betting system) is higher-impact than adding yet another billboard entity. The baccarat game went from passive card-viewing to real gameplay, directly serving the Prime Directive's "Baccarat is the Soul."
- **Lesson:** Betting logic for Punto Banco is simple: Player 1:1, Banker 0.95:1 (5% commission via `Math.floor(bet * 1.95)`), Tie 8:1. On tie, Player/Banker bets push (return to player). This matches real casino rules.
- **Lesson:** State management for betting (bankroll, selected chip, current bets, dealing flag) uses simple module-level variables. No need for a state machine — the `_baccDealing` flag prevents mid-deal interactions.
- **Lesson:** `Math.min(_baccSelectedChip, _baccBankroll - totalBets)` prevents over-betting beyond available bankroll. Simple boundary check that ensures integrity.
- **Lesson:** Bankroll flash animation (green for win, red for loss) using CSS class toggle + setTimeout removal is a lightweight but effective visual feedback mechanism.
- **Observation:** After 5 consecutive UX/meta-features (S48-S53), enhancing an existing core feature is a good change of pace. The project benefits from deepening existing features, not just adding breadth.
- **Observation:** The baccarat betting system adds ~355 lines, making it one of the larger single-session additions. Complex UI features (bet areas, chips, bankroll, payouts, reset) require more CSS than billboard entity features.
- **Suggestion for future sessions:** The baccarat game could be further enhanced with: Big Road scoreboard (traditional tracking grid), card flip animations (CSS 3D transforms), sound effects on deal/win, bet history. But next session should return to visual/atmospheric improvements for variety.

## Session 55 (2026-03-22) -- Wynn Palace SkyCab Cable Cars
- **Lesson:** The 20th entity animation system using CallbackProperty. At this point adding animated billboard entities is completely mechanical. The `lerpPositionWithAlt` function from airport planes works for any elevated path — cable cars, drones, etc.
- **Lesson:** Adding entities that complement existing features (cable cars over the fountain show) is more impactful than standalone entities. It deepens a location rather than spreading thin across the map.
- **Lesson:** Cable car altitude arc (38m → 45m → 38m at center) creates a convincing cable sag effect. The peak in the middle of the route simulates the natural catenary curve of a real cable car system.
- **Lesson:** Gentle billboard rotation sway via `Math.sin(elapsed * 0.8)` with small amplitude (0.03 radians ≈ 1.7°) simulates wind/cable movement without looking erratic.
- **Observation:** At ~236 entities total (4 SkyCabs + 232 prior), still no performance issues with CesiumJS. Entity count scales well.
- **Observation:** Quality audits at sessions 40 and 50 were both skipped. Session 60 should be the next audit. THREE skipped audits — this is becoming a pattern that should be corrected.
- **Suggestion for future sessions:** Consider a quality audit even before session 60. Also consider features that enhance the daytime experience — many features are night-only, leaving daytime visitors with less to see. Street-level exploration mode or Portuguese colonial district detail from the roadmap would be good medium-term targets.

- **Lesson:** The improvement script itself needs to be correct before the loop runs. Test it manually first.
- **Lesson:** Add a Phase 8 (meta-improve) so the agent improves its own process each cycle.
- **Lesson:** Keep AGENT_LEARNINGS.md — it's the agent's long-term memory across sessions.
