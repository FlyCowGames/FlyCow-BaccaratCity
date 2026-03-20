// ============================================================
// Baccarat City — Atmosphere: Day/Night Cycle + Dynamic Lighting
// ============================================================
// Real-time day/night cycle (~120s full cycle) with dynamic
// sun/moon positioning, sky color transitions, fog density,
// star field, and neon bloom intensity scaling. Transforms the
// cityscape from a sun-lit daytime scene to a glowing neon
// nightscape and back.
// ============================================================

(function () {
    'use strict';

    // ── Timing ───────────────────────────────────────────────
    const CYCLE_DURATION = 120;       // seconds for a full 24h cycle
    const HOURS_PER_SEC  = 24 / CYCLE_DURATION;
    const START_HOUR     = 12;        // start at noon so user sees day first

    // ── Phase boundaries ─────────────────────────────────────
    // Dawn 5-7, Day 7-17, Dusk 17-19, Night 19-5
    const DAWN_START  = 5;
    const DAWN_END    = 7;
    const DUSK_START  = 17;
    const DUSK_END    = 19;

    // ── Color presets (as [r, g, b] 0-1) ─────────────────────
    function hexToRGB(hex) {
        return [
            ((hex >> 16) & 0xff) / 255,
            ((hex >> 8) & 0xff) / 255,
            (hex & 0xff) / 255,
        ];
    }

    // Sky / background
    const SKY_DAY   = hexToRGB(0x1a2a4a);
    const SKY_DUSK  = hexToRGB(0x2a1a2a);
    const SKY_NIGHT = hexToRGB(0x060612);
    const SKY_DAWN  = hexToRGB(0x1a1a2a);

    // Ambient light
    const AMB_DAY   = hexToRGB(0x334455);
    const AMB_NIGHT = hexToRGB(0x111133);

    // Fog
    const FOG_DAY   = hexToRGB(0x1a2a3a);
    const FOG_NIGHT = hexToRGB(0x060610);

    // Hemisphere light
    const HEMI_SKY_DAY   = hexToRGB(0x1a1a2e);
    const HEMI_SKY_NIGHT = hexToRGB(0x080818);
    const HEMI_GND_DAY   = hexToRGB(0x0a0a0a);
    const HEMI_GND_NIGHT = hexToRGB(0x050508);

    // ── Bloom / exposure presets ─────────────────────────────
    const BLOOM_DAY   = 0.3;
    const BLOOM_NIGHT = 0.8;
    const EXPOSURE_DAY   = 1.0;
    const EXPOSURE_NIGHT = 0.8;

    // ── State ────────────────────────────────────────────────
    let THREE;
    let scene, renderer, camera;
    let timeOfDay = START_HOUR; // 0-24 float

    // Lights we manage
    let sunLight   = null;  // DirectionalLight (warm)
    let moonLight  = null;  // DirectionalLight (cool)
    let ambientLight = null;
    let hemiLight  = null;
    let fillLight  = null;

    // Stars
    let starField  = null;
    let starMaterial = null;

    // References to existing scene lights we'll take over
    let originalLights = [];

    // ── Helpers ───────────────────────────────────────────────

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function lerpRGB(out, a, b, t) {
        out[0] = lerp(a[0], b[0], t);
        out[1] = lerp(a[1], b[1], t);
        out[2] = lerp(a[2], b[2], t);
        return out;
    }

    function setColorFromRGB(color, rgb) {
        color.setRGB(rgb[0], rgb[1], rgb[2]);
    }

    // Smooth step for more pleasing transitions
    function smoothstep(edge0, edge1, x) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
    }

    // Get a blend factor 0-1 for how "night" it is
    function getNightFactor(hour) {
        // Night: 1.0 when hour in [19, 5] (wrapping)
        // Day: 0.0 when hour in [7, 17]
        // Dawn: transition from 1->0 during [5, 7]
        // Dusk: transition from 0->1 during [17, 19]
        if (hour >= DAWN_END && hour <= DUSK_START) return 0;  // full day
        if (hour >= DUSK_END || hour <= DAWN_START) return 1;  // full night
        if (hour > DUSK_START && hour < DUSK_END) {
            return smoothstep(DUSK_START, DUSK_END, hour);
        }
        if (hour > DAWN_START && hour < DAWN_END) {
            return 1 - smoothstep(DAWN_START, DAWN_END, hour);
        }
        return 0;
    }

    // Get sky color with 4-phase blending
    function getSkyColor(hour, out) {
        const nf = getNightFactor(hour);

        // Determine if we're in dawn or dusk transition
        if (hour > DAWN_START && hour < DAWN_END) {
            // Dawn: blend from night -> dawn -> day
            const t = smoothstep(DAWN_START, DAWN_END, hour);
            if (t < 0.5) {
                lerpRGB(out, SKY_NIGHT, SKY_DAWN, t * 2);
            } else {
                lerpRGB(out, SKY_DAWN, SKY_DAY, (t - 0.5) * 2);
            }
        } else if (hour > DUSK_START && hour < DUSK_END) {
            // Dusk: blend from day -> dusk -> night
            const t = smoothstep(DUSK_START, DUSK_END, hour);
            if (t < 0.5) {
                lerpRGB(out, SKY_DAY, SKY_DUSK, t * 2);
            } else {
                lerpRGB(out, SKY_DUSK, SKY_NIGHT, (t - 0.5) * 2);
            }
        } else {
            // Pure day or pure night
            lerpRGB(out, SKY_DAY, SKY_NIGHT, nf);
        }
        return out;
    }

    // ── Init ─────────────────────────────────────────────────
    function init(ctx) {
        THREE = ctx.THREE;
        scene = ctx.scene;
        renderer = ctx.renderer;
        camera = ctx.camera;

        // ── Remove or dim existing lights ────────────────────
        // Find and catalog existing lights so we can control them
        const toRemove = [];
        scene.children.forEach(child => {
            if (child.isAmbientLight) {
                ambientLight = child; // take ownership
            } else if (child.isHemisphereLight) {
                hemiLight = child;
            } else if (child.isDirectionalLight) {
                // Identify by position: key light is at (-80, 150, 60)
                if (child.position.y > 100) {
                    // This is the key light — we'll replace it with our sun
                    toRemove.push(child);
                } else {
                    // Fill light — keep reference
                    fillLight = child;
                }
            }
        });

        // Remove old key light
        toRemove.forEach(l => scene.remove(l));

        // ── Create Sun (directional) ─────────────────────────
        sunLight = new THREE.DirectionalLight(0xffeedd, 1.2);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.set(2048, 2048);
        const ws = 200 * 0.6;
        sunLight.shadow.camera.left   = -ws;
        sunLight.shadow.camera.right  =  ws;
        sunLight.shadow.camera.top    =  ws;
        sunLight.shadow.camera.bottom = -ws;
        sunLight.shadow.camera.near   = 1;
        sunLight.shadow.camera.far    = 400;
        sunLight.shadow.bias = -0.001;
        scene.add(sunLight);

        // ── Create Moon (directional, no shadow for perf) ────
        moonLight = new THREE.DirectionalLight(0x4466aa, 0.0);
        moonLight.castShadow = false;
        scene.add(moonLight);

        // If ambientLight wasn't found, create one
        if (!ambientLight) {
            ambientLight = new THREE.AmbientLight(0x334455, 0.6);
            scene.add(ambientLight);
        }

        // If hemiLight wasn't found, create one
        if (!hemiLight) {
            hemiLight = new THREE.HemisphereLight(0x1a1a2e, 0x0a0a0a, 0.3);
            scene.add(hemiLight);
        }

        // ── Create Star Field ────────────────────────────────
        createStars();

        // ── Initialize BACCARAT namespace values ─────────────
        window.BACCARAT.timeOfDay = timeOfDay;
        window.BACCARAT.isNight = false;

        console.log(
            '%c Baccarat City %c Atmosphere Online ',
            'background:#4466aa;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;',
            'background:#0a0a12;color:#4466aa;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0;'
        );
    }

    // ── Stars ────────────────────────────────────────────────
    function createStars() {
        const count = 200;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Distribute stars in a large dome above the city
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.45; // upper hemisphere
            const radius = 250 + Math.random() * 150;

            positions[i * 3]     = Math.cos(theta) * Math.sin(phi) * radius;
            positions[i * 3 + 1] = Math.cos(phi) * radius + 50; // push above city
            positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;

            sizes[i] = 0.5 + Math.random() * 1.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.2,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        starField = new THREE.Points(geometry, starMaterial);
        starField.renderOrder = -1; // render behind everything
        scene.add(starField);
    }

    // ── Update (called every frame) ──────────────────────────
    const _skyRGB = [0, 0, 0];
    const _ambRGB = [0, 0, 0];
    const _fogRGB = [0, 0, 0];
    const _hemiSkyRGB = [0, 0, 0];
    const _hemiGndRGB = [0, 0, 0];

    function update(deltaTime, elapsedTime) {
        // ── Advance time ─────────────────────────────────────
        timeOfDay += deltaTime * HOURS_PER_SEC;
        if (timeOfDay >= 24) timeOfDay -= 24;

        const nf = getNightFactor(timeOfDay);
        const df = 1 - nf; // day factor

        // ── Expose to global ─────────────────────────────────
        window.BACCARAT.timeOfDay = timeOfDay;
        window.BACCARAT.isNight = nf > 0.5;

        // ── Sun position (arc across sky) ────────────────────
        // Sun is visible roughly 5-19. Map hour to angle.
        // At hour=12 (noon), sun is directly overhead.
        // sunAngle: 0 = east horizon, PI = west horizon
        const sunHourRange = DUSK_END - DAWN_START; // 14 hours of sun travel
        const sunProgress = (timeOfDay - DAWN_START) / sunHourRange;
        const sunAngle = sunProgress * Math.PI;

        const sunRadius = 180;
        const sunX = Math.cos(sunAngle) * sunRadius * 0.6;
        const sunY = Math.sin(sunAngle) * sunRadius;
        const sunZ = Math.cos(sunAngle) * sunRadius * 0.4;

        sunLight.position.set(sunX, Math.max(sunY, -20), sunZ);

        // Sun intensity: full during day, zero at night
        const sunIntensity = lerp(1.5, 0, nf);
        sunLight.intensity = Math.max(0, sunIntensity);

        // Sun color: warm white during day, orange-red near horizon
        const horizonFactor = 1 - Math.sin(Math.max(0, sunAngle));
        const sunR = lerp(1.0, 1.0, horizonFactor);
        const sunG = lerp(0.93, 0.6, horizonFactor * 0.5);
        const sunB = lerp(0.87, 0.3, horizonFactor * 0.7);
        sunLight.color.setRGB(sunR, sunG, sunB);

        // Shadow visibility
        sunLight.castShadow = nf < 0.8;

        // ── Moon position (opposite arc) ─────────────────────
        const moonAngle = sunAngle + Math.PI; // opposite of sun
        const moonX = Math.cos(moonAngle) * sunRadius * 0.5;
        const moonY = Math.sin(moonAngle) * sunRadius * 0.8;
        const moonZ = Math.cos(moonAngle) * sunRadius * 0.3;

        moonLight.position.set(moonX, Math.max(moonY, 10), moonZ);
        moonLight.intensity = lerp(0, 0.3, nf);

        // ── Ambient light ────────────────────────────────────
        lerpRGB(_ambRGB, AMB_DAY, AMB_NIGHT, nf);
        setColorFromRGB(ambientLight.color, _ambRGB);
        ambientLight.intensity = lerp(0.6, 0.2, nf);

        // ── Hemisphere light ─────────────────────────────────
        if (hemiLight) {
            lerpRGB(_hemiSkyRGB, HEMI_SKY_DAY, HEMI_SKY_NIGHT, nf);
            lerpRGB(_hemiGndRGB, HEMI_GND_DAY, HEMI_GND_NIGHT, nf);
            setColorFromRGB(hemiLight.color, _hemiSkyRGB);
            setColorFromRGB(hemiLight.groundColor, _hemiGndRGB);
            hemiLight.intensity = lerp(0.3, 0.1, nf);
        }

        // ── Fill light ───────────────────────────────────────
        if (fillLight) {
            fillLight.intensity = lerp(0.4, 0.1, nf);
        }

        // ── Sky / background color ───────────────────────────
        getSkyColor(timeOfDay, _skyRGB);
        scene.background.setRGB(_skyRGB[0], _skyRGB[1], _skyRGB[2]);

        // ── Fog ──────────────────────────────────────────────
        lerpRGB(_fogRGB, FOG_DAY, FOG_NIGHT, nf);
        if (scene.fog) {
            scene.fog.color.setRGB(_fogRGB[0], _fogRGB[1], _fogRGB[2]);
            // Density: slightly higher at night for atmosphere
            scene.fog.density = lerp(0.003, 0.005, nf);
        }

        // ── Bloom / Exposure ─────────────────────────────────
        const composer = window.BACCARAT.composer;
        if (composer && composer.bloomPass) {
            composer.bloomPass.strength = lerp(BLOOM_DAY, BLOOM_NIGHT, nf);
        }
        if (renderer) {
            renderer.toneMappingExposure = lerp(EXPOSURE_DAY, EXPOSURE_NIGHT, nf);
        }

        // ── Stars ────────────────────────────────────────────
        if (starMaterial) {
            // Stars visible at night, fade during dawn/dusk
            starMaterial.opacity = lerp(0, 0.9, nf);

            // Gentle twinkle via slow rotation
            if (starField) {
                starField.rotation.y = elapsedTime * 0.003;
            }
        }
    }

    // ── Register ─────────────────────────────────────────────
    window.BACCARAT.registerModule({ init, update });

})();
