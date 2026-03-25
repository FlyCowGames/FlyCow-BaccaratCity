# Agent Learnings

*Auto-generated from data/knowledge.json. Do NOT edit directly.*

## Patterns

- **[w=0.7, applied=19/19]** Enhancing existing features is high-impact with low risk (interactivity)
- **[w=0.5, applied=1/1]** Separate tick handlers for independent orbit systems (interactivity)
- **[w=0.8, applied=8/8]** CSS particle effects are lightweight alternatives to WebGL (rendering)
- **[w=0.8, applied=10/10]** Staggered animation delays prevent mechanical feel (animation)
- **[w=0.8, applied=5/5]** Web Audio API for procedural sound without external files (audio)
- **[w=0.5, applied=1/1]** Progress indicators improve guided experience UX (interactivity)
- **[w=0.6, applied=1/1]** Staggered CSS transitions create cinematic reveal effects (rendering)
- **[w=0.6, applied=3/3]** Canvas text with shadowBlur creates convincing neon glow (rendering)
- **[w=0.5, applied=1/1]** Canvas steam/smoke wisps add life to static billboards (landmarks)
- **[w=0.7, applied=4/4]** Cultural balance through complementary heritage elements (landmarks)
- **[w=0.5, applied=1/1]** Position-aware audio zones using proximity falloff with altitude gate (audio)
- **[w=0.5, applied=1/1]** Official symbols and emblems add cultural depth (landmarks)
- **[w=0.5, applied=1/1]** Heritage district ground-level transport adds cultural authenticity (animation)
- **[w=0.5, applied=1/1]** Distributed small light points create coastline-tracing glow effects (atmosphere)
- **[w=0.7, applied=4/4]** Time-of-day gated features fill temporal gaps and add realism (animation)
- **[w=0.5, applied=1/1]** CSS cloud overlays are effective weather-reactive sky atmosphere (atmosphere)
- **[w=0.5, applied=1/1]** Larger canvas entities with detail reward night scenes (animation)
- **[w=0.5, applied=1/1]** Canvas forked lightning with recursive branching creates realistic bolts (atmosphere)
- **[w=0.5, applied=1/1]** CSS Grid with explicit row/column placement for tabular game data (interactivity)
- **[w=0.6, applied=2/2]** Layered weather effects compound for immersion (atmosphere)
- **[w=0.5, applied=1/1]** CSS particle celebrations reward user actions and reinforce engagement (interactivity)
- **[w=0.5, applied=1/1]** Regulatory/safety details add skyline authenticity (atmosphere)
- **[w=0.5, applied=1/1]** CSS crepuscular rays enhance golden hour without entity overhead (atmosphere)
- **[w=0.5, applied=1/1]** Multi-layer CSS fog with staggered drift creates convincing mist (atmosphere)
- **[w=0.5, applied=1/1]** CSS radial-gradient creates natural rainbow bands (atmosphere)
- **[w=0.5, applied=1/1]** Complementary features in the same area compound visual richness (landmarks)
- **[w=0.6, applied=1/1]** Time-lapse mode showcases time-gated features visitors would otherwise miss (interactivity)
- **[w=0.6, applied=2/2]** Static billboard entities for signage need no animation interval (landmarks)
- **[w=0.5, applied=1/1]** Casino-branded shuttle buses with route-specific colors add transport variety (animation)
- **[w=0.6, applied=2/2]** Adding missing landmarks to LANDMARKS array fixes walk tour gaps (landmarks)
- **[w=0.7, applied=4/4]** New landmark integrates with all existing night-effect systems automatically (landmarks)
- **[w=0.6, applied=2/2]** Landmark-specific action buttons extend info cards into interactive experiences (interactivity)
- **[w=0.6, applied=4/4]** Non-casino cultural landmarks diversify the landmark collection (landmarks)
- **[w=0.5, applied=1/1]** Speed variation in transport entities adds visual dynamism (animation)
- **[w=0.6, applied=1/1]** Audit sessions catch mobile UI overlap regressions that accumulate over time (interactivity)

## Anti-Patterns

- **[HIGH]** CesiumJS bloom post-processing with Google 3D Tiles
- **[HIGH]** CallbackProperty for billboard image causes black rectangles
- **[MEDIUM]** Parallax on mobile breaks layout
- **[HIGH]** Accumulating absolute-positioned bottom UI elements cause mobile overlap

## Decisions

- **Q:** How to enhance walk tour for documentary feel? **A:** Compose existing systems: auto-open landmark cards (with S75 photo gallery), add slow orbit camera, add progress bar/counter
- **Q:** How to make flythrough labels more cinematic? **A:** Multi-line HTML with staggered CSS transitions — title + Chinese + tagline + decorative lines
- **Q:** How to add neon signage to the city? **A:** Canvas-drawn billboard entities with Chinese text + glow halos, setInterval for flicker animation
- **Q:** How to represent street food culture? **A:** Canvas-drawn billboard entities with warm lantern awnings, Chinese food names, and animated steam wisps
- **Q:** How to represent Portuguese colonial heritage? **A:** Canvas-drawn azulejo tile panel billboards with traditional blue-and-white patterns, Portuguese place names, and 4 tile motifs
- **Q:** How to add lotus flower cultural symbolism to the scene? **A:** Canvas-drawn lotus billboard entities with CallbackProperty drift and scale animation on water surfaces
- **Q:** How to add heritage district ground-level movement? **A:** Triciclo pedicab billboard entities with CallbackProperty ping-pong movement on 3 heritage routes
- **Q:** How to add waterfront ambient lighting? **A:** Distributed small radial gradient billboard entities along 5 promenade paths at 3m altitude, night-only via _currentGlowIntensity
- **Q:** How to add morning-specific cultural life to the scene? **A:** Animated tai chi billboard groups at 5 park/waterfront locations, visible 5-9 AM with fade ramps, setInterval canvas redraw for pose animation
- **Q:** How to fill the afternoon temporal gap (12-7 PM)? **A:** Fishing sampan billboard entities on Inner Harbour routes, time-gated 15:00-19:00, with canvas bobbing animation and minimap tracking
- **Q:** How to add sky-level atmosphere without more CesiumJS billboard entities? **A:** CSS cloud div overlay with blur filter and keyframe drift animation at z-index below color grading
- **Q:** How to add a prominent evening harbour feature? **A:** Large dinner cruise vessels with detailed canvas rendering, night-specific glow, and 19-23 time gate
- **Q:** How to add dramatic storm effects beyond rain and wind? **A:** Canvas-drawn forked lightning bolts + CSS screen flash + Web Audio API thunder, triggered by WMO thunderstorm codes and typhoon T8+
- **Q:** How to deepen the baccarat experience beyond card dealing? **A:** Big Road (大路) scorecard below stats — CSS Grid with explicit cell placement, column-based streaks, tie marks as green dot overlays
- **Q:** How to add authentic skyline detail to tall buildings at night? **A:** Red radial gradient billboard entities at building-top altitudes with slow blink via CallbackProperty, night-only glow gating
- **Q:** How to add early morning atmosphere beyond sun rays? **A:** Multi-layer CSS fog/mist overlay with radial gradients, blur filters, and staggered drift animations at bottom of viewport
- **Q:** How to add a rainbow weather effect to complement the rain system? **A:** CSS radial-gradient div with 7 spectral bands, condition-gated to daytime + light rain + partial sun, with 10-min post-rain memory
- **Q:** How to add night market ambiance to food areas? **A:** Canvas-drawn string light billboard entities with catenary wire and warm golden twinkle bulbs at 7-9m altitude
- **Q:** How to let visitors experience all time-gated features without visiting at different hours? **A:** requestAnimationFrame time-lapse animating _timeOverride 0-24 over 48 seconds, small play button next to time slider
- **Q:** How to deepen Portuguese colonial heritage beyond decorative tiles? **A:** Bilingual street name sign billboards at 8 famous intersections, canvas-drawn with tile border aesthetic, static (no animation)
- **Q:** How to add iconic Macau ground transport beyond tour buses and triciclos? **A:** Casino free shuttle buses (發財車) on 3 routes between ferry terminals and casinos, always active with casino-branded colors
- **Q:** How to add traditional Chinese architectural elements to complement Portuguese heritage features? **A:** Canvas-drawn paifang (牌坊) gateway arch billboards at 5 key Macau entrance locations, static (no animation)
- **Q:** Which landmark to add to complete the Prime Directive casino list? **A:** MGM Macau (Peninsula) as a full LANDMARKS entry with info card, photos, and integration into all night-effect systems
- **Q:** How to let visitors experience the iconic Macau Tower panoramic view? **A:** Camera flight to 240m + slow onTick orbit with cinematic CSS overlay, triggered by landmark card button
- **Q:** How to add speed variety to harbour water traffic? **A:** Water taxi speedboats with shorter cycle times (28-35s) on 2 harbour routes, same CallbackProperty ping-pong pattern as ferries
