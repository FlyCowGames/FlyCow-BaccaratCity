// ============================================================
// Baccarat City — Cinematic Flythrough Camera Module
// ============================================================
// Replaces the static isometric OrthographicCamera with a
// PerspectiveCamera and drives it through a multi-phase
// cinematic sequence: aerial approach, street-level flythrough,
// casino approach, lounge entry, then hands off to free-roam.
// ============================================================

(function () {
    'use strict';

    // We'll grab THREE from the BACCARAT namespace at init time
    let THREE;

    // ── Easing Functions ─────────────────────────────────────────
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
    }

    function smoothstep(edge0, edge1, x) {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3 - 2 * t);
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // ── Phase Timing ─────────────────────────────────────────────
    const PHASE_AERIAL    = { start: 0,  end: 8  };
    const PHASE_STREET    = { start: 8,  end: 25 };
    const PHASE_CASINO    = { start: 25, end: 32 };
    const PHASE_LOUNGE    = { start: 32, end: 40 };
    const CINEMATIC_END   = 40;

    // ── State ────────────────────────────────────────────────────
    let perspCamera;
    let scene;
    let composer;
    let renderer;
    let cinematicTime = 0;
    let cinematicActive = true;
    let freeRoamActive = false;
    let currentPhase = 'aerial';

    // Free-roam orbit state
    let orbitAngle = 0;
    let orbitRadius = 8;
    let orbitHeight = 3;
    let orbitTarget = null; // set after cinematic ends
    let orbitDragging = false;
    let orbitLastX = 0;
    let orbitLastY = 0;
    let orbitZoom = 8;

    // Camera shake state
    let shakeIntensity = 0;

    // Replay button element
    let replayBtn = null;

    // Original input handlers — we suppress them during cinematic
    let inputSuppressed = false;

    // ── Street-Level Spline Path ─────────────────────────────────
    // Road centers at multiples of 12, from -96 to +96.
    // Path: NE edge along x=0,z=-96 → south along x=0 → turn west
    //       at z=-36 → west to x=-36 → turn south to z=0 → curve to origin.
    //
    // We define waypoints; CatmullRomCurve3 interpolates smoothly.

    let streetPath;
    let streetPathLength;

    function buildStreetPath() {
        const pts = [
            // Entry point — northeast edge, high on the road
            new THREE.Vector3(0, 3, -100),
            // Fly south along x=0 road
            new THREE.Vector3(0, 3, -84),
            new THREE.Vector3(0, 3, -72),
            new THREE.Vector3(0, 3, -60),
            new THREE.Vector3(0, 3, -48),
            // Approaching the turn at z=-36
            new THREE.Vector3(0, 3, -40),
            // The turn — curve west
            new THREE.Vector3(-3, 3, -36),
            new THREE.Vector3(-12, 3, -36),
            new THREE.Vector3(-24, 3, -36),
            // Arriving at x=-36 intersection
            new THREE.Vector3(-34, 3, -36),
            // Turn south
            new THREE.Vector3(-36, 3, -33),
            new THREE.Vector3(-36, 3, -24),
            new THREE.Vector3(-36, 3, -12),
            // Approaching city center
            new THREE.Vector3(-36, 3, -4),
            // Curve toward origin (casino district)
            new THREE.Vector3(-30, 3.5, -1),
            new THREE.Vector3(-20, 4, 0),
            new THREE.Vector3(-10, 5, 0),
            // Near center — slight rise for casino approach
            new THREE.Vector3(-4, 6, 2),
            new THREE.Vector3(0, 7, 3),
        ];

        streetPath = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);
        streetPathLength = streetPath.getLength();
    }

    // ── Aerial Approach Path ─────────────────────────────────────
    let aerialPath;

    function buildAerialPath() {
        const pts = [
            new THREE.Vector3(180, 160, 180),   // far away, bird's eye
            new THREE.Vector3(120, 110, 120),
            new THREE.Vector3(60, 60, 60),
            new THREE.Vector3(20, 25, 10),
            new THREE.Vector3(0, 8, -96),       // transition to street entry
        ];
        aerialPath = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    }

    // ── Casino Approach Path ─────────────────────────────────────
    let casinoPath;

    function buildCasinoPath() {
        const pts = [
            new THREE.Vector3(0, 7, 3),         // from end of street phase
            new THREE.Vector3(3, 6.5, 4),
            new THREE.Vector3(5, 6, 3),
            new THREE.Vector3(4, 5.5, 1),
            new THREE.Vector3(2, 5, 0),
            new THREE.Vector3(0, 4, -1),
        ];
        casinoPath = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    }

    // ── Lounge Entry Path ────────────────────────────────────────
    let loungePath;

    function buildLoungePath() {
        const pts = [
            new THREE.Vector3(0, 4, -1),        // from casino approach end
            new THREE.Vector3(-1, 3.2, -0.5),
            new THREE.Vector3(-1.5, 2.5, 0),
            new THREE.Vector3(-1, 2, 0.5),
            new THREE.Vector3(0, 1.8, 1),       // settle near table height
        ];
        loungePath = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    }

    // ── FOV Interpolation ────────────────────────────────────────
    function getTargetFOV(time) {
        if (time < PHASE_AERIAL.end) {
            // Aerial: 60
            return 60;
        } else if (time < PHASE_STREET.end) {
            // Street: narrow to 45 during middle, widen at edges
            const t = (time - PHASE_STREET.start) / (PHASE_STREET.end - PHASE_STREET.start);
            if (t < 0.15) {
                return lerp(60, 45, easeInOutQuad(t / 0.15));
            } else if (t > 0.85) {
                return lerp(45, 55, easeInOutQuad((t - 0.85) / 0.15));
            }
            return 45;
        } else if (time < PHASE_CASINO.end) {
            // Casino reveal: widen to 55
            return 55;
        } else {
            // Lounge + free roam: 50
            const t = Math.min(1, (time - PHASE_LOUNGE.start) / (PHASE_LOUNGE.end - PHASE_LOUNGE.start));
            return lerp(55, 50, easeInOutQuad(t));
        }
    }

    // ── Camera Shake ─────────────────────────────────────────────
    function getCameraShake(time) {
        if (time < PHASE_STREET.start || time > PHASE_STREET.end) {
            return { x: 0, y: 0, z: 0 };
        }
        // Subtle sway during street flythrough
        const intensity = 0.03;
        return {
            x: Math.sin(time * 3.7) * intensity + Math.sin(time * 7.3) * intensity * 0.4,
            y: Math.cos(time * 2.9) * intensity * 0.5 + Math.sin(time * 5.1) * intensity * 0.3,
            z: Math.sin(time * 4.3) * intensity * 0.3,
        };
    }

    // ── Speed Variation for Street Phase ─────────────────────────
    // Slower through intersections (at z multiples of 12), faster on straights
    function getStreetSpeedMultiplier(pathT) {
        const pt = streetPath.getPointAt(pathT);
        // Check proximity to intersections (grid lines at multiples of 12)
        const xGrid = Math.abs(pt.x % 12);
        const zGrid = Math.abs(pt.z % 12);
        const nearIntersection = Math.min(xGrid, 12 - xGrid) < 2 && Math.min(zGrid, 12 - zGrid) < 2;

        if (nearIntersection) {
            return 0.6; // slow down at intersections
        }
        return 1.0;
    }

    // ── Phase Update Functions ───────────────────────────────────

    function updateAerial(time) {
        const duration = PHASE_AERIAL.end - PHASE_AERIAL.start;
        const t = easeInOutCubic(Math.min(1, (time - PHASE_AERIAL.start) / duration));

        const pos = aerialPath.getPointAt(t);
        const shake = getCameraShake(time);
        perspCamera.position.set(pos.x + shake.x, pos.y + shake.y, pos.z + shake.z);

        // Look toward city center, with look-ahead
        const lookT = Math.min(1, t + 0.1);
        const lookPt = aerialPath.getPointAt(lookT);
        // Bias the look target downward toward the city
        const lookTarget = new THREE.Vector3(
            lerp(lookPt.x, 0, 0.5),
            lerp(lookPt.y, 0, 0.7),
            lerp(lookPt.z, 0, 0.5)
        );
        perspCamera.lookAt(lookTarget);
    }

    function updateStreet(time) {
        const duration = PHASE_STREET.end - PHASE_STREET.start;
        const rawT = (time - PHASE_STREET.start) / duration;
        const t = easeInOutQuad(Math.min(1, rawT));

        const pos = streetPath.getPointAt(t);
        const shake = getCameraShake(time);
        perspCamera.position.set(pos.x + shake.x, pos.y + shake.y, pos.z + shake.z);

        // Look-ahead along the spline for forward-looking camera
        const lookAheadT = Math.min(1, t + 0.05);
        const lookPt = streetPath.getPointAt(lookAheadT);

        // Slight upward bias so we see building tops
        const lookTarget = new THREE.Vector3(lookPt.x, lookPt.y + 0.5, lookPt.z);
        perspCamera.lookAt(lookTarget);
    }

    function updateCasino(time) {
        const duration = PHASE_CASINO.end - PHASE_CASINO.start;
        const t = easeInOutCubic(Math.min(1, (time - PHASE_CASINO.start) / duration));

        const pos = casinoPath.getPointAt(t);
        const shake = getCameraShake(time);
        perspCamera.position.set(pos.x + shake.x, pos.y + shake.y, pos.z + shake.z);

        // Look toward the casino center (origin area)
        const lookTarget = new THREE.Vector3(0, 2, 0);
        perspCamera.lookAt(lookTarget);
    }

    function updateLounge(time) {
        const duration = PHASE_LOUNGE.end - PHASE_LOUNGE.start;
        const t = easeInOutCubic(Math.min(1, (time - PHASE_LOUNGE.start) / duration));

        const pos = loungePath.getPointAt(t);
        perspCamera.position.set(pos.x, pos.y, pos.z);

        // Look at table cluster center
        const lookTarget = new THREE.Vector3(0, 1, 0);
        perspCamera.lookAt(lookTarget);

        // At the very end, start the gentle orbit
        if (t > 0.95) {
            const orbitBlend = (t - 0.95) / 0.05;
            orbitAngle = Math.atan2(pos.z, pos.x) * (1 - orbitBlend);
        }
    }

    function updateFreeRoam(delta) {
        if (!orbitDragging) {
            orbitAngle += delta * 0.15; // slow auto-orbit
        }

        const x = orbitTarget.x + Math.cos(orbitAngle) * orbitZoom;
        const z = orbitTarget.z + Math.sin(orbitAngle) * orbitZoom;
        const y = orbitTarget.y + orbitHeight;

        perspCamera.position.set(x, y, z);
        perspCamera.lookAt(orbitTarget);
    }

    // ── Input Handling for Free Roam ─────────────────────────────
    function onPointerDownFreeRoam(e) {
        if (!freeRoamActive) return;
        orbitDragging = true;
        orbitLastX = e.clientX;
        orbitLastY = e.clientY;
    }

    function onPointerMoveFreeRoam(e) {
        if (!freeRoamActive || !orbitDragging) return;
        const dx = e.clientX - orbitLastX;
        const dy = e.clientY - orbitLastY;
        orbitLastX = e.clientX;
        orbitLastY = e.clientY;

        orbitAngle -= dx * 0.005;
        orbitHeight = Math.max(1.5, Math.min(15, orbitHeight + dy * 0.05));
    }

    function onPointerUpFreeRoam() {
        orbitDragging = false;
    }

    function onWheelFreeRoam(e) {
        if (!freeRoamActive) return;
        e.preventDefault();
        const delta = Math.sign(e.deltaY);
        orbitZoom = Math.max(3, Math.min(25, orbitZoom + delta * 0.5));
    }

    function onDblClickFreeRoam() {
        if (!freeRoamActive) return;
        replayCinematic();
    }

    // ── Suppress Core Engine Input ───────────────────────────────
    function suppressCoreInput() {
        if (inputSuppressed) return;
        inputSuppressed = true;
        // Intercept events on the canvas to prevent core engine's pan/zoom
        const canvas = renderer.domElement;
        canvas.addEventListener('pointerdown', blockEvent, true);
        canvas.addEventListener('pointermove', blockEvent, true);
        canvas.addEventListener('pointerup', blockEvent, true);
        canvas.addEventListener('wheel', blockEvent, { capture: true, passive: false });
    }

    function releaseCoreInput() {
        if (!inputSuppressed) return;
        inputSuppressed = false;
        const canvas = renderer.domElement;
        canvas.removeEventListener('pointerdown', blockEvent, true);
        canvas.removeEventListener('pointermove', blockEvent, true);
        canvas.removeEventListener('pointerup', blockEvent, true);
        canvas.removeEventListener('wheel', blockEvent, true);
    }

    function blockEvent(e) {
        e.stopPropagation();
        // During cinematic: block everything
        // During free-roam: let our own handlers work but block core engine
        if (cinematicActive) {
            e.preventDefault();
        }
    }

    // ── Replay ───────────────────────────────────────────────────
    function replayCinematic() {
        cinematicTime = 0;
        cinematicActive = true;
        freeRoamActive = false;
        currentPhase = 'aerial';

        if (replayBtn) {
            replayBtn.style.opacity = '0';
            replayBtn.style.pointerEvents = 'none';
        }

        // Update zoom hint text
        const zoomHint = document.getElementById('zoomHint');
        if (zoomHint) {
            zoomHint.textContent = 'cinematic flythrough...';
            zoomHint.style.opacity = '0.5';
        }

        suppressCoreInput();
    }

    // ── Create Replay Button ─────────────────────────────────────
    function createReplayButton() {
        replayBtn = document.createElement('button');
        replayBtn.id = 'cinematicReplay';
        replayBtn.innerHTML = '&#9654; Replay Flythrough';
        replayBtn.style.cssText = `
            position: fixed;
            bottom: 2vh;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: rgba(212, 175, 55, 0.8);
            font-family: 'DM Mono', monospace;
            font-size: 11px;
            letter-spacing: 0.1em;
            padding: 6px 16px;
            cursor: pointer;
            border-radius: 4px;
            backdrop-filter: blur(8px);
            transition: all 0.4s ease;
            opacity: 0;
            pointer-events: none;
        `;
        replayBtn.addEventListener('mouseenter', () => {
            replayBtn.style.background = 'rgba(212, 175, 55, 0.3)';
            replayBtn.style.borderColor = 'rgba(212, 175, 55, 0.7)';
            replayBtn.style.color = 'rgba(212, 175, 55, 1)';
        });
        replayBtn.addEventListener('mouseleave', () => {
            replayBtn.style.background = 'rgba(212, 175, 55, 0.15)';
            replayBtn.style.borderColor = 'rgba(212, 175, 55, 0.4)';
            replayBtn.style.color = 'rgba(212, 175, 55, 0.8)';
        });
        replayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            replayCinematic();
        });
        document.body.appendChild(replayBtn);
    }

    // ── Transition to Free Roam ──────────────────────────────────
    function enterFreeRoam() {
        cinematicActive = false;
        freeRoamActive = true;

        // Set orbit target to table cluster center
        orbitTarget = new THREE.Vector3(0, 1, 0);
        orbitAngle = Math.atan2(perspCamera.position.z - orbitTarget.z,
                                perspCamera.position.x - orbitTarget.x);
        orbitZoom = 8;
        orbitHeight = 3;

        // Show replay button
        if (replayBtn) {
            replayBtn.style.opacity = '1';
            replayBtn.style.pointerEvents = 'auto';
        }

        // Update zoom hint
        const zoomHint = document.getElementById('zoomHint');
        if (zoomHint) {
            zoomHint.textContent = 'drag to orbit · scroll to zoom · double-click to replay';
            zoomHint.style.opacity = '0.25';
        }

        // Release suppressed input and bind free-roam handlers
        // Keep core input suppressed since we handle our own orbit
        // but stop blocking events — redirect to free-roam handlers
        const canvas = renderer.domElement;
        canvas.addEventListener('pointerdown', onPointerDownFreeRoam);
        window.addEventListener('pointermove', onPointerMoveFreeRoam);
        window.addEventListener('pointerup', onPointerUpFreeRoam);
        canvas.addEventListener('wheel', onWheelFreeRoam, { passive: false });
        canvas.addEventListener('dblclick', onDblClickFreeRoam);
    }

    // ── Phase Label (optional cinematic progress) ────────────────
    function getPhaseLabel(time) {
        if (time < PHASE_AERIAL.end) return 'aerial';
        if (time < PHASE_STREET.end) return 'street';
        if (time < PHASE_CASINO.end) return 'casino';
        if (time < PHASE_LOUNGE.end) return 'lounge';
        return 'free';
    }

    // ── Module Interface ─────────────────────────────────────────

    function init(ctx) {
        scene = ctx.scene;
        renderer = ctx.renderer;
        THREE = ctx.THREE;

        // Build all spline paths
        buildStreetPath();
        buildAerialPath();
        buildCasinoPath();
        buildLoungePath();

        // Create PerspectiveCamera to replace the OrthographicCamera
        const aspect = window.innerWidth / window.innerHeight;
        perspCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        perspCamera.position.set(180, 160, 180);
        perspCamera.lookAt(0, 0, 0);

        // Swap the camera in the composer's RenderPass
        composer = window.BACCARAT.composer;
        if (composer && composer.passes) {
            for (let i = 0; i < composer.passes.length; i++) {
                const pass = composer.passes[i];
                if (pass.camera) {
                    pass.camera = perspCamera;
                }
            }
        }

        // Handle window resize for perspective camera
        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            perspCamera.aspect = w / h;
            perspCamera.updateProjectionMatrix();
        });

        // Create UI
        createReplayButton();

        // Update zoom hint during cinematic
        const zoomHint = document.getElementById('zoomHint');
        if (zoomHint) {
            zoomHint.textContent = 'cinematic flythrough...';
            zoomHint.style.opacity = '0.5';
        }

        // Suppress core engine's input during cinematic
        suppressCoreInput();

        // Reduce fog density for perspective view — gives better depth
        if (scene.fog) {
            scene.fog.density = 0.006;
        }

        console.log(
            '%c Baccarat City %c Cinematic Module Online ',
            'background:#d4af37;color:#0a0a12;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;',
            'background:#1a1a2e;color:#d4af37;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0;'
        );
    }

    function update(delta, elapsed) {
        if (!perspCamera) return;

        if (cinematicActive) {
            cinematicTime += delta;

            // Update FOV smoothly
            const targetFOV = getTargetFOV(cinematicTime);
            perspCamera.fov = lerp(perspCamera.fov, targetFOV, 0.05);
            perspCamera.updateProjectionMatrix();

            // Determine current phase and update camera
            const phase = getPhaseLabel(cinematicTime);
            if (phase !== currentPhase) {
                currentPhase = phase;
            }

            if (cinematicTime < PHASE_AERIAL.end) {
                updateAerial(cinematicTime);
            } else if (cinematicTime < PHASE_STREET.end) {
                updateStreet(cinematicTime);
            } else if (cinematicTime < PHASE_CASINO.end) {
                updateCasino(cinematicTime);
            } else if (cinematicTime < PHASE_LOUNGE.end) {
                updateLounge(cinematicTime);
            } else {
                // Cinematic complete — transition to free roam
                enterFreeRoam();
            }
        } else if (freeRoamActive) {
            updateFreeRoam(delta);
            perspCamera.updateProjectionMatrix();
        }
    }

    // ── Register Module ──────────────────────────────────────────
    if (window.BACCARAT && window.BACCARAT.registerModule) {
        window.BACCARAT.registerModule({ init, update });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.BACCARAT && window.BACCARAT.registerModule) {
                window.BACCARAT.registerModule({ init, update });
            }
        });
    }

})();
