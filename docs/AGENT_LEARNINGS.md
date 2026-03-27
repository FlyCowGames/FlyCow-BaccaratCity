# Agent Learnings

*Auto-generated from data/knowledge.json. Do NOT edit directly.*

## Last Updated: Session 212

## Top Patterns (by weight)

- **[w=0.9]** Landmark-specific light signatures elevate hero buildings above generic effects — Each major landmark benefits from a unique animated light effect that matches its architectural identity — Eiffel Tower sparkle (S181), Sai Van cable harp (S183), Grand Lisboa lotus crown (S184), Maca
- **[w=0.8]** CSS particle effects are lightweight alternatives to WebGL — CSS-based rain, snow, and particle effects are lightweight and effective for visual atmosphere without WebGL overhead. Canvas-based particles work for more complex effects.
- **[w=0.8]** Staggered animation delays prevent mechanical feel — Vary animation-delay and animation-duration per element to prevent synchronized movement that looks artificial. Different speeds and directions per element create organic motion.
- **[w=0.8]** Web Audio API for procedural sound without external files — Web Audio API generates convincing ambient and interactive sounds procedurally — no audio files needed. Must start muted and require user click (browser autoplay policy).
- **[w=0.7]** Enhancing existing features is high-impact with low risk — Rather than building an entirely new feature, enhancing the existing walk tour with auto-opening photo galleries, orbit camera, and progress bar created a much richer experience by composing existing 
- **[w=0.7]** Cultural balance through complementary heritage elements — When a digital twin represents a multicultural city, actively balance representation of different cultural heritages. Macau has Chinese and Portuguese elements — adding Portuguese azulejo tile panels 
- **[w=0.7]** Time-of-day gated features fill temporal gaps and add realism — Gating billboard entity visibility to specific time windows (e.g., morning 5-9 AM for tai chi) creates time-specific atmosphere that rewards exploration at different hours. Using getMacauHour() with s
- **[w=0.7]** New landmark integrates with all existing night-effect systems automatically — Adding a new landmark to the LANDMARKS array plus entries in NEON_ZONES, SKY_BEAM_CASINOS, SEARCHLIGHT_CASINOS, CASINO_REFLECTIONS, and OBSTACLE_LIGHT_BUILDINGS gives the landmark a fully integrated n
- **[w=0.65]** Layered weather effects compound for immersion — Adding secondary effects to existing weather systems (splash ripples to rain drops, thunder to lightning, rainbow after rain, lens drops) compounds the immersion without replacing the original. Each l
- **[w=0.6]** Staggered CSS transitions create cinematic reveal effects — Using incrementing transition-delay values on child elements creates a movie-title-sequence feel. Each line of a multi-line overlay appears sequentially (e.g., decorative line at 0.1s, title at 0.15s,
- **[w=0.6]** Canvas text with shadowBlur creates convincing neon glow — Using canvas 2D context shadowBlur + shadowColor creates a convincing neon glow effect around text. Two passes (colored glow + white core) makes it look realistic. setInterval at 200ms for flicker is 
- **[w=0.6]** Time-lapse mode showcases time-gated features visitors would otherwise miss — A requestAnimationFrame-driven time-lapse that smoothly advances _timeOverride from 0 to 24 over ~48 seconds lets visitors see all time-gated features (dawn mist, tai chi, midday buses, afternoon samp
- **[w=0.6]** Static billboard entities for signage need no animation interval — Street name signs, static plaques, and other non-animated signage billboards can use a single canvas.toDataURL() call at init time with no setInterval. This saves CPU compared to animated billboards (
- **[w=0.6]** Adding missing landmarks to LANDMARKS array fixes walk tour gaps — The walk tour auto-opens landmark cards via LANDMARKS.find(l => l.name === stop.name). If a walk tour stop exists but the matching LANDMARKS entry does not, the tour silently skips the info card at th
- **[w=0.6]** Landmark-specific action buttons extend info cards into interactive experiences — Adding special-purpose buttons to landmark info cards (beyond Enter Casino) transforms passive info cards into interactive gateways. The landmark card is a natural place for contextual actions because

## Anti-Patterns

- **[HIGH]** CesiumJS bloom post-processing with Google 3D Tiles — CesiumJS bloom applies to entire scene causing severe oversaturation/washout with Google 3D Tiles. Tried contrast values 119 down to 40 — all caused u
- **[HIGH]** CallbackProperty for billboard image causes black rectangles — Using CesiumJS CallbackProperty to dynamically update billboard.image with canvas elements renders as solid black rectangles with Google 3D Tiles.
- **[MEDIUM]** Parallax on mobile breaks layout — Parallax effects on mobile conflict with position:relative layouts and feel exaggerated on small viewports.
- **[HIGH]** Accumulating absolute-positioned bottom UI elements cause mobile overlap — When multiple UI elements use position:absolute with bottom offsets on mobile, adding new elements over time causes overlaps that individual session t

## Recent Decisions

- **How to add signature Eiffel Tower sparkle light show at The Parisian?** → Canvas-drawn tower silhouette billboard with 65 distributed sparkle points, two-mode animation (idle twinkle + periodic cascade), night-only
- **How to add distinctive identity to the Sai Van cable-stayed bridge beyond deck lights?** → Canvas-drawn cable-stay fan pattern with sweep animation on 2 tower billboard entities, night-only
- **How to give the Grand Lisboa hero landmark a distinctive night identity beyond generic neon/beam effects?** → Canvas-drawn radiating lotus petal billboard with two-mode animation (idle pulse + periodic bloom show), night-only at 210m altitude
- **How to give the Macau Tower (tallest structure, 338m) a distinctive night identity?** → Canvas-drawn tower silhouette with 12 horizontal LED bands, 5-color cycling, observation deck ring glow, traveling wave light show, night-only at 280m
- **How to give the Morpheus tower (City of Dreams, Cotai Strip) a distinctive night identity?** → Canvas-drawn twisted figure-eight exoskeleton grid with 112 LED nodes, purple/violet palette, cascade show sweeping up the tower, night-only at 160m a
- **How to give The Venetian Macao (world's largest casino) a distinctive night identity?** → Canvas-drawn rippling horizontal golden bands evoking Venice canal water reflections, with campanile spire crown pulse and periodic cascade sweep, at 
- **How to give Galaxy Macau (massive Cotai mega-resort) a distinctive night identity?** → Canvas-drawn diamond-shaped LED lattice grid with ~90 nodes in 14x10 offset layout, radiating pulse show from center outward, gold/champagne palette, 
- **How to enhance the Performance Lake fountain show with dynamic colors?** → Add a 200ms setInterval that redraws jet billboard icons with time-varying colors using lerpColor interpolation, structured in 3 acts: color waves, fi
- **How to add a non-building-attached nighttime spectacle to diversify from LED signatures?** → Canvas-drawn drone light show billboard at 350m over harbor with 48 multicolored drones forming 6 parametric shapes, smooth lerp transitions, 56s show
- **How to represent Wynn Macau's Tree of Prosperity as an LED light signature?** → Use ~64 LED nodes arranged in a tree pattern (trunk, lower branches, upper canopy, crown sparkles) with bronze-gold palette and upward prosperity bloo
- **How to represent Sands Macao's curved gold-glass tower as an LED light signature?** → 10 vertical streams of 5 LED drops (50 nodes) with downward cascade animation evoking a golden waterfall of fortune, 14-min cycle. 12th and final major casino LED signature
