# Agent Learnings

*Auto-generated from data/knowledge.json — do NOT edit directly.*

## Last Updated: Session 186

## Patterns That Work (Top 30 by weight)

- **[w=0.8]** CSS particle effects are lightweight alternatives to WebGL (applied 13x, 13 successful)
- **[w=0.8]** Staggered animation delays prevent mechanical feel (applied 10x, 10 successful)
- **[w=0.8]** Web Audio API for procedural sound without external files (applied 5x, 5 successful)
- **[w=0.8]** Landmark-specific light signatures elevate hero buildings above generic effects (applied 4x, 4 successful)
- **[w=0.7]** Enhancing existing features is high-impact with low risk (applied 20x, 20 successful)
- **[w=0.7]** Cultural balance through complementary heritage elements (applied 4x, 4 successful)
- **[w=0.7]** Time-of-day gated features fill temporal gaps and add realism (applied 4x, 4 successful)
- **[w=0.7]** New landmark integrates with all existing night-effect systems automatically (applied 4x, 4 successful)
- **[w=0.7]** Layered weather effects compound for immersion (applied 5x, 5 successful)
- **[w=0.6]** Staggered CSS transitions create cinematic reveal effects (applied 1x, 1 successful)
- **[w=0.6]** Canvas text with shadowBlur creates convincing neon glow (applied 4x, 3 successful)
- **[w=0.6]** Time-lapse mode showcases time-gated features visitors would otherwise miss (applied 1x, 1 successful)
- **[w=0.6]** Static billboard entities for signage need no animation interval (applied 2x, 2 successful)
- **[w=0.6]** Adding missing landmarks to LANDMARKS array fixes walk tour gaps (applied 2x, 2 successful)
- **[w=0.6]** Landmark-specific action buttons extend info cards into interactive experiences (applied 2x, 2 successful)
- **[w=0.6]** Non-casino cultural landmarks diversify the landmark collection (applied 5x, 5 successful)
- **[w=0.6]** Audit sessions catch mobile UI overlap regressions that accumulate over time (applied 1x, 1 successful)
- **[w=0.6]** localStorage persistence for game state enhances engagement with minimal code (applied 2x, 2 successful)
- **[w=0.6]** Meta-UI that surfaces existing features increases perceived value (applied 1x, 1 successful)
- **[w=0.6]** Themed heritage feature sets build cultural depth incrementally (applied 1x, 1 successful)
- **[w=0.6]** Staggered CSS reveal animations create cinematic loading experiences (applied 1x, 1 successful)
- **[w=0.5]** Separate tick handlers for independent orbit systems (applied 1x, 1 successful)
- **[w=0.5]** Progress indicators improve guided experience UX (applied 1x, 1 successful)
- **[w=0.5]** Canvas steam/smoke wisps add life to static billboards (applied 1x, 1 successful)
- **[w=0.5]** Position-aware audio zones using proximity falloff with altitude gate (applied 1x, 1 successful)
- **[w=0.5]** Official symbols and emblems add cultural depth (applied 1x, 1 successful)
- **[w=0.5]** Heritage district ground-level transport adds cultural authenticity (applied 1x, 1 successful)
- **[w=0.5]** Distributed small light points create coastline-tracing glow effects (applied 1x, 1 successful)
- **[w=0.5]** CSS cloud overlays are effective weather-reactive sky atmosphere (applied 1x, 1 successful)
- **[w=0.5]** Larger canvas entities with detail reward night scenes (applied 1x, 1 successful)

## Anti-Patterns to Avoid

- **[HIGH]** CesiumJS bloom post-processing with Google 3D Tiles — Use billboard entities with canvas radial gradients for glow effects instead of scene-wide bloom
- **[HIGH]** CallbackProperty for billboard image causes black rectangles — Use direct billboard.image = canvas.toDataURL() assignment in setInterval instead
- **[MEDIUM]** Parallax on mobile breaks layout — Disable parallax on mobile via media query or JS check
- **[HIGH]** Accumulating absolute-positioned bottom UI elements cause mobile overlap — After adding any new bottom-positioned UI element, check ALL bottom elements for overlap — not just the new one vs its nearest neighbor. Use JS bounding-box intersection testing in audit sessions.

## Active Decisions (37)

- **How to add weather forecast to the digital twin?** → Extend existing Open-Meteo API call with hourly parameters, render in expandable panel below weather block
- **How to enhance walk tour for documentary feel?** → Compose existing systems: auto-open landmark cards (with S75 photo gallery), add slow orbit camera, add progress bar/counter
- **How to make flythrough labels more cinematic?** → Multi-line HTML with staggered CSS transitions — title + Chinese + tagline + decorative lines
- **How to add neon signage to the city?** → Canvas-drawn billboard entities with Chinese text + glow halos, setInterval for flicker animation
- **How to represent street food culture?** → Canvas-drawn billboard entities with warm lantern awnings, Chinese food names, and animated steam wisps
- **How to represent Portuguese colonial heritage?** → Canvas-drawn azulejo tile panel billboards with traditional blue-and-white patterns, Portuguese place names, and 4 tile motifs
- **How to add lotus flower cultural symbolism to the scene?** → Canvas-drawn lotus billboard entities with CallbackProperty drift and scale animation on water surfaces
- **How to add heritage district ground-level movement?** → Triciclo pedicab billboard entities with CallbackProperty ping-pong movement on 3 heritage routes
- **How to add waterfront ambient lighting?** → Distributed small radial gradient billboard entities along 5 promenade paths at 3m altitude, night-only via _currentGlowIntensity
- **How to add morning-specific cultural life to the scene?** → Animated tai chi billboard groups at 5 park/waterfront locations, visible 5-9 AM with fade ramps, setInterval canvas redraw for pose animation
- **How to fill the afternoon temporal gap (12-7 PM)?** → Fishing sampan billboard entities on Inner Harbour routes, time-gated 15:00-19:00, with canvas bobbing animation and minimap tracking
- **How to add sky-level atmosphere without more CesiumJS billboard entities?** → CSS cloud div overlay with blur filter and keyframe drift animation at z-index below color grading
- **How to add a prominent evening harbour feature?** → Large dinner cruise vessels with detailed canvas rendering, night-specific glow, and 19-23 time gate
- **How to add dramatic storm effects beyond rain and wind?** → Canvas-drawn forked lightning bolts + CSS screen flash + Web Audio API thunder, triggered by WMO thunderstorm codes and typhoon T8+
- **How to deepen the baccarat experience beyond card dealing?** → Big Road (大路) scorecard below stats — CSS Grid with explicit cell placement, column-based streaks, tie marks as green dot overlays
- **How to add authentic skyline detail to tall buildings at night?** → Red radial gradient billboard entities at building-top altitudes with slow blink via CallbackProperty, night-only glow gating
- **How to add early morning atmosphere beyond sun rays?** → Multi-layer CSS fog/mist overlay with radial gradients, blur filters, and staggered drift animations at bottom of viewport
- **How to add a rainbow weather effect to complement the rain system?** → CSS radial-gradient div with 7 spectral bands, condition-gated to daytime + light rain + partial sun, with 10-min post-rain memory
- **How to add night market ambiance to food areas?** → Canvas-drawn string light billboard entities with catenary wire and warm golden twinkle bulbs at 7-9m altitude
- **How to let visitors experience all time-gated features without visiting at different hours?** → requestAnimationFrame time-lapse animating _timeOverride 0-24 over 48 seconds, small play button next to time slider
- **How to deepen Portuguese colonial heritage beyond decorative tiles?** → Bilingual street name sign billboards at 8 famous intersections, canvas-drawn with tile border aesthetic, static (no animation)
- **How to add iconic Macau ground transport beyond tour buses and triciclos?** → Casino free shuttle buses (發財車) on 3 routes between ferry terminals and casinos, always active with casino-branded colors
- **How to add traditional Chinese architectural elements to complement Portuguese heritage features?** → Canvas-drawn paifang (牌坊) gateway arch billboards at 5 key Macau entrance locations, static (no animation)
- **Which landmark to add to complete the Prime Directive casino list?** → MGM Macau (Peninsula) as a full LANDMARKS entry with info card, photos, and integration into all night-effect systems
- **How to let visitors experience the iconic Macau Tower panoramic view?** → Camera flight to 240m + slow onTick orbit with cinematic CSS overlay, triggered by landmark card button
- **How to add speed variety to harbour water traffic?** → Water taxi speedboats with shorter cycle times (28-35s) on 2 harbour routes, same CallbackProperty ping-pong pattern as ferries
- **How to make baccarat more engaging for returning visitors?** → Persist bankroll and game stats in localStorage, show session stats and welcome back indicator
- **How to make the time-gated feature system more discoverable?** → City Pulse expandable overlay with feature list, active/inactive status, click-to-fly, and next-up preview
- **How to encourage visitors to explore all 30 landmarks?** → Gamification via discovery progress tracker — localStorage Set, progress bar in Explore panel, checkmarks, toast notifications, completion celebration
- **How to add wet-road neon reflection effect during rainy nights?** → CSS overlay at bottom 30% with gradient mask, base dark sheen layer + animated neon-colored gradient streaks, gated by _currentGlowIntensity > 0.1 AND rain detection, IIFE with 5s setInterval
- **How to add Portuguese cobblestone calçada pavement to heritage areas?** → Canvas-drawn billboard entities at 4-6m altitude with 3 motif types (wave, fan, compass), 500ms animation interval, distance-based visibility
- **How to visualize real-time wind direction in the weather display?** → Compact CSS compass dial (38px) with gold needle, N/E/S/W cardinal markers, direction label, speed and gust display, integrated into existing weather block
- **How to add dynamic daytime atmospheric effects tied to cloud cover?** → CSS overlay with 6 radial gradient shadow patches, drift keyframe animations, cloud cover drives intensity inversely from most effects
- **How to add signature Eiffel Tower sparkle light show at The Parisian?** → Canvas-drawn tower silhouette billboard with 65 distributed sparkle points, two-mode animation (idle twinkle + periodic cascade), night-only
- **How to add distinctive identity to the Sai Van cable-stayed bridge beyond deck lights?** → Canvas-drawn cable-stay fan pattern with sweep animation on 2 tower billboard entities, night-only
- **How to give the Grand Lisboa hero landmark a distinctive night identity beyond generic neon/beam effects?** → Canvas-drawn radiating lotus petal billboard with two-mode animation (idle pulse + periodic bloom show), night-only at 210m altitude
- **How to give the Macau Tower (tallest structure, 338m) a distinctive night identity?** → Canvas-drawn tower silhouette with 12 horizontal LED bands, 5-color cycling, observation deck ring glow, traveling wave light show, night-only at 280m altitude
