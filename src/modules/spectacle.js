// ============================================================
// Baccarat City — Spectacle: Visual Effects & Wow Factor
// ============================================================
// Harbor water, casino light beams, fireworks, fountains,
// floating lanterns, and enhanced neon flickering. Transforms
// the technically correct scene into a living, breathing
// Macau-inspired spectacle.
// ============================================================

(function () {
    'use strict';

    // ── Grid constants (match city-geometry) ─────────────────
    const CELL_SIZE   = 12;
    const GRID_COUNT  = 17;
    const HALF_GRID   = 8;
    const CITY_EXTENT = 102;

    // ── Shared ──────────────────────────────────────────────
    let THREE, scene;

    // ════════════════════════════════════════════════════════════
    //  1. WATER / HARBOR
    // ════════════════════════════════════════════════════════════

    let waterMesh = null;
    let waterGeo  = null;
    let waterBaseY = [];       // store original Y positions for wave animation
    const boats   = [];

    function createHarbor() {
        // Water plane south of city (z > 80)
        const waterW = 260;
        const waterD = 100;
        const segsX  = 64;
        const segsZ  = 32;

        waterGeo = new THREE.PlaneGeometry(waterW, waterD, segsX, segsZ);
        waterGeo.rotateX(-Math.PI / 2);

        // Store base Y positions
        const posAttr = waterGeo.getAttribute('position');
        waterBaseY = new Float32Array(posAttr.count);
        for (let i = 0; i < posAttr.count; i++) {
            waterBaseY[i] = posAttr.getY(i);
        }

        const waterMat = new THREE.MeshPhongMaterial({
            color:     0x0a1a3a,
            emissive:  0x001122,
            shininess: 120,
            transparent: true,
            opacity:   0.85,
            side:      THREE.DoubleSide,
        });

        waterMesh = new THREE.Mesh(waterGeo, waterMat);
        waterMesh.position.set(0, -0.3, 80 + waterD / 2);
        waterMesh.receiveShadow = true;
        scene.add(waterMesh);

        // Boats
        createBoats();
    }

    function createBoats() {
        const boatDefs = [
            { x: -40, z: 110, scale: 1.0, speed: 0.8 },
            { x:  20, z: 130, scale: 0.7, speed: 0.5 },
            { x:  60, z: 105, scale: 1.2, speed: 0.6 },
            { x: -10, z: 145, scale: 0.6, speed: 1.0 },
        ];

        for (const def of boatDefs) {
            const boat = new THREE.Group();

            // Hull
            const hullGeo = new THREE.BoxGeometry(1.2 * def.scale, 0.4 * def.scale, 3.0 * def.scale);
            const hullMat = new THREE.MeshToonMaterial({ color: 0x553322 });
            const hull = new THREE.Mesh(hullGeo, hullMat);
            hull.position.y = 0.1;
            boat.add(hull);

            // Cabin
            const cabinGeo = new THREE.BoxGeometry(0.7 * def.scale, 0.5 * def.scale, 1.0 * def.scale);
            const cabinMat = new THREE.MeshToonMaterial({ color: 0xeeeecc });
            const cabin = new THREE.Mesh(cabinGeo, cabinMat);
            cabin.position.set(0, 0.45 * def.scale, -0.3 * def.scale);
            boat.add(cabin);

            // Mast / antenna
            const mastGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2 * def.scale, 4);
            const mastMat = new THREE.MeshToonMaterial({ color: 0x888888 });
            const mast = new THREE.Mesh(mastGeo, mastMat);
            mast.position.set(0, 0.9 * def.scale, 0);
            boat.add(mast);

            // Running light
            const lightGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
            const lightMat = new THREE.MeshBasicMaterial({
                color: 0xff2222, toneMapped: false,
            });
            const light = new THREE.Mesh(lightGeo, lightMat);
            light.position.set(0, 1.5 * def.scale, 0);
            boat.add(light);

            boat.position.set(def.x, 0, def.z);
            boat.rotation.y = Math.random() * Math.PI * 2;
            scene.add(boat);

            boats.push({
                mesh: boat,
                baseX: def.x,
                baseZ: def.z,
                speed: def.speed,
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    function updateWater(dt, elapsed) {
        if (!waterMesh) return;

        // Animate water vertices
        const posAttr = waterGeo.getAttribute('position');
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);
            const wave1 = Math.sin(x * 0.08 + elapsed * 1.2) * 0.4;
            const wave2 = Math.sin(z * 0.12 + elapsed * 0.8) * 0.25;
            const wave3 = Math.sin((x + z) * 0.06 + elapsed * 1.5) * 0.15;
            posAttr.setY(i, waterBaseY[i] + wave1 + wave2 + wave3);
        }
        posAttr.needsUpdate = true;
        waterGeo.computeVertexNormals();

        // Animate boats — gentle bobbing and slow drift
        for (const b of boats) {
            const bob = Math.sin(elapsed * 1.5 + b.phase) * 0.3;
            b.mesh.position.y = bob;
            b.mesh.rotation.z = Math.sin(elapsed * 0.7 + b.phase) * 0.05;
            b.mesh.rotation.x = Math.sin(elapsed * 0.5 + b.phase * 1.3) * 0.03;

            // Slow lateral drift
            b.mesh.position.x = b.baseX + Math.sin(elapsed * 0.1 * b.speed + b.phase) * 5;
        }
    }

    // ════════════════════════════════════════════════════════════
    //  2. CASINO LIGHT BEAMS
    // ════════════════════════════════════════════════════════════

    const lightBeams = [];

    function createLightBeams() {
        const beamDefs = [
            { x:  0,  z:  0, height: 200, radius: 1.5, color: 0xd4af37, rotSpeed:  0.15 },
            { x: 12,  z:  0, height: 160, radius: 1.2, color: 0xffffff, rotSpeed: -0.20 },
            { x: -12, z:  0, height: 170, radius: 1.0, color: 0xffe8b0, rotSpeed:  0.12 },
            { x:  0,  z: 12, height: 150, radius: 1.3, color: 0xd4af37, rotSpeed: -0.18 },
            { x:  0,  z:-12, height: 180, radius: 1.1, color: 0xffffff, rotSpeed:  0.22 },
            { x: 12,  z: 12, height: 140, radius: 1.0, color: 0xffe8b0, rotSpeed: -0.10 },
        ];

        for (const def of beamDefs) {
            const geo = new THREE.CylinderGeometry(def.radius * 0.3, def.radius, def.height, 8, 1, true);
            const mat = new THREE.MeshBasicMaterial({
                color:       def.color,
                transparent: true,
                opacity:     0.12,
                blending:    THREE.AdditiveBlending,
                side:        THREE.DoubleSide,
                depthWrite:  false,
                toneMapped:  false,
            });

            const beam = new THREE.Mesh(geo, mat);
            beam.position.set(def.x, def.height / 2 + 40, def.z);
            scene.add(beam);

            lightBeams.push({
                mesh:     beam,
                rotSpeed: def.rotSpeed,
                baseOpacity: 0.12,
            });
        }
    }

    function updateLightBeams(dt, elapsed) {
        for (const b of lightBeams) {
            b.mesh.rotation.y += b.rotSpeed * dt;
            // Subtle opacity pulsing
            b.mesh.material.opacity = b.baseOpacity + Math.sin(elapsed * 0.5 + b.rotSpeed * 10) * 0.03;
        }
    }

    // ════════════════════════════════════════════════════════════
    //  3. FIREWORKS (night only)
    // ════════════════════════════════════════════════════════════

    const FIREWORK_PARTICLE_COUNT = 250;
    const FIREWORK_COLORS = [0xd4af37, 0xff2244, 0x2266ff, 0x22ff66, 0xffffff];
    const FIREWORK_LAUNCH_POINTS = [
        { x:  0, z:  0 },
        { x: 12, z:  0 },
        { x:-12, z:  0 },
        { x:  0, z: 12 },
        { x:  0, z:-12 },
    ];

    let fireworkParticles = [];
    let fireworkBursts    = [];
    let fireworkTimer     = 5; // first burst after 5s of night
    let fireworkGeo       = null;
    let fireworkMats      = {};

    // Particle states: 'idle' | 'launch' | 'burst' | 'fade'
    function createFireworkSystem() {
        fireworkGeo = new THREE.SphereGeometry(0.2, 4, 3);

        // Pre-create materials for each color
        for (const c of FIREWORK_COLORS) {
            fireworkMats[c] = new THREE.MeshBasicMaterial({
                color:      c,
                toneMapped: false,
                transparent: true,
                opacity:    1.0,
                blending:   THREE.AdditiveBlending,
                depthWrite: false,
            });
        }

        // Create particle pool
        for (let i = 0; i < FIREWORK_PARTICLE_COUNT; i++) {
            const mat = fireworkMats[FIREWORK_COLORS[0]].clone();
            const mesh = new THREE.Mesh(fireworkGeo, mat);
            mesh.visible = false;
            scene.add(mesh);

            fireworkParticles.push({
                mesh,
                state: 'idle',
                vx: 0, vy: 0, vz: 0,
                life: 0,
                maxLife: 0,
            });
        }
    }

    function launchFireworkBurst() {
        // Find idle particles
        const idleParticles = [];
        for (const p of fireworkParticles) {
            if (p.state === 'idle') idleParticles.push(p);
            if (idleParticles.length >= 50) break;
        }
        if (idleParticles.length < 20) return; // not enough particles

        const launch = FIREWORK_LAUNCH_POINTS[Math.floor(Math.random() * FIREWORK_LAUNCH_POINTS.length)];
        const color  = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        const burstHeight = 60 + Math.random() * 40;
        const particleCount = 25 + Math.floor(Math.random() * 25);

        const burst = {
            x: launch.x + (Math.random() - 0.5) * 10,
            z: launch.z + (Math.random() - 0.5) * 10,
            targetY: burstHeight,
            color,
            phase: 'launch',
            launchY: 40, // start from rooftop height
            launchSpeed: 60 + Math.random() * 20,
            particles: idleParticles.slice(0, particleCount),
            timer: 0,
        };

        // Set up the lead particle (first one) as the launcher
        const lead = burst.particles[0];
        lead.state = 'launch';
        lead.mesh.visible = true;
        lead.mesh.position.set(burst.x, burst.launchY, burst.z);
        lead.mesh.material.color.setHex(color);
        lead.mesh.material.opacity = 1.0;
        lead.mesh.scale.set(1.5, 1.5, 1.5);
        lead.vy = burst.launchSpeed;
        lead.vx = 0;
        lead.vz = 0;
        lead.life = 0;
        lead.maxLife = (burst.targetY - burst.launchY) / burst.launchSpeed + 0.2;

        fireworkBursts.push(burst);
    }

    function updateFireworks(dt, elapsed) {
        const isNight = window.BACCARAT && window.BACCARAT.isNight;
        if (!isNight) {
            // Reset timer, hide all particles
            fireworkTimer = 3 + Math.random() * 5;
            for (const p of fireworkParticles) {
                if (p.state !== 'idle') {
                    p.state = 'idle';
                    p.mesh.visible = false;
                }
            }
            fireworkBursts.length = 0;
            return;
        }

        // Launch timer
        fireworkTimer -= dt;
        if (fireworkTimer <= 0) {
            // Launch 3-5 bursts staggered
            const burstCount = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < burstCount; i++) {
                // Stagger slightly using timer offsets in burst objects
                setTimeout(() => launchFireworkBurst(), i * 300);
            }
            fireworkTimer = 8 + Math.random() * 7;
        }

        // Update bursts
        const gravity = -25;

        for (let bi = fireworkBursts.length - 1; bi >= 0; bi--) {
            const burst = fireworkBursts[bi];

            if (burst.phase === 'launch') {
                const lead = burst.particles[0];
                lead.life += dt;
                lead.mesh.position.y += lead.vy * dt;
                lead.vy += gravity * 0.3 * dt; // slight gravity on launcher

                // Trail sparkle
                lead.mesh.material.opacity = 0.8 + Math.sin(elapsed * 30) * 0.2;

                // Time to explode?
                if (lead.life >= lead.maxLife || lead.vy <= 5) {
                    burst.phase = 'explode';
                    const burstPos = lead.mesh.position.clone();

                    // Explode all particles outward
                    for (let pi = 0; pi < burst.particles.length; pi++) {
                        const p = burst.particles[pi];
                        p.state = 'burst';
                        p.mesh.visible = true;
                        p.mesh.position.copy(burstPos);
                        p.mesh.material.color.setHex(burst.color);
                        p.mesh.material.opacity = 1.0;
                        p.mesh.scale.set(1, 1, 1);

                        // Random spherical explosion velocity
                        const theta = Math.random() * Math.PI * 2;
                        const phi   = Math.random() * Math.PI;
                        const speed = 15 + Math.random() * 20;
                        p.vx = Math.sin(phi) * Math.cos(theta) * speed;
                        p.vy = Math.sin(phi) * Math.sin(theta) * speed * 0.8 + 5; // bias upward
                        p.vz = Math.cos(phi) * speed;
                        p.life = 0;
                        p.maxLife = 1.5 + Math.random() * 1.0;
                    }
                }
            } else if (burst.phase === 'explode') {
                let allDead = true;
                for (const p of burst.particles) {
                    if (p.state !== 'burst') continue;

                    p.life += dt;
                    p.mesh.position.x += p.vx * dt;
                    p.mesh.position.y += p.vy * dt;
                    p.mesh.position.z += p.vz * dt;
                    p.vy += gravity * dt;

                    // Drag
                    p.vx *= 0.98;
                    p.vz *= 0.98;

                    // Fade
                    const lifeRatio = p.life / p.maxLife;
                    p.mesh.material.opacity = Math.max(0, 1 - lifeRatio);
                    p.mesh.scale.setScalar(Math.max(0.2, 1 - lifeRatio * 0.7));

                    if (p.life >= p.maxLife) {
                        p.state = 'idle';
                        p.mesh.visible = false;
                    } else {
                        allDead = false;
                    }
                }

                if (allDead) {
                    fireworkBursts.splice(bi, 1);
                }
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    //  4. ANIMATED FOUNTAINS
    // ════════════════════════════════════════════════════════════

    const FOUNTAIN_PARTICLE_COUNT = 60; // per fountain
    const fountains = [];

    function createFountain(fx, fz) {
        const fountain = {
            x: fx,
            z: fz,
            particles: [],
            poolMesh: null,
        };

        // Base pool — flat cylinder with water material
        const poolGeo = new THREE.CylinderGeometry(3, 3, 0.4, 16);
        const poolMat = new THREE.MeshPhongMaterial({
            color:     0x0a2a4a,
            emissive:  0x001122,
            shininess: 100,
            transparent: true,
            opacity:   0.8,
        });
        fountain.poolMesh = new THREE.Mesh(poolGeo, poolMat);
        fountain.poolMesh.position.set(fx, 0.2, fz);
        scene.add(fountain.poolMesh);

        // Stone rim
        const rimGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.6, 16);
        const rimMat = new THREE.MeshToonMaterial({ color: 0x888877 });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.position.set(fx, 0.1, fz);
        scene.add(rim);

        // Inner pool (slightly smaller to create rim effect)
        const innerGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.5, 16);
        const innerPool = new THREE.Mesh(innerGeo, poolMat);
        innerPool.position.set(fx, 0.25, fz);
        scene.add(innerPool);

        // Center pedestal
        const pedestalGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8);
        const pedestalMat = new THREE.MeshToonMaterial({ color: 0x999988 });
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.set(fx, 0.75, fz);
        scene.add(pedestal);

        // Spray particles
        const particleGeo = new THREE.SphereGeometry(0.08, 4, 3);
        const particleMat = new THREE.MeshBasicMaterial({
            color:      0x88ccff,
            toneMapped: false,
            transparent: true,
            opacity:    0.7,
            blending:   THREE.AdditiveBlending,
            depthWrite: false,
        });

        for (let i = 0; i < FOUNTAIN_PARTICLE_COUNT; i++) {
            const mesh = new THREE.Mesh(particleGeo, particleMat.clone());
            mesh.position.set(fx, 1.5, fz);
            scene.add(mesh);

            const p = {
                mesh,
                vx: 0, vy: 0, vz: 0,
                life: 0,
                maxLife: 0,
            };
            resetFountainParticle(p, fx, fz);
            // Stagger initial life so they don't all launch at once
            p.life = Math.random() * p.maxLife;
            fountain.particles.push(p);
        }

        fountains.push(fountain);
    }

    function resetFountainParticle(p, fx, fz) {
        // Launch from center pedestal top
        const angle  = Math.random() * Math.PI * 2;
        const spread = 0.5 + Math.random() * 1.5;
        p.mesh.position.set(fx, 1.5, fz);
        p.vx = Math.cos(angle) * spread;
        p.vy = 8 + Math.random() * 5;
        p.vz = Math.sin(angle) * spread;
        p.life    = 0;
        p.maxLife = 1.0 + Math.random() * 0.6;
        p.mesh.material.opacity = 0.7;
        p.mesh.visible = true;
    }

    function updateFountains(dt) {
        const gravity = -18;
        for (const f of fountains) {
            for (const p of f.particles) {
                p.life += dt;
                p.mesh.position.x += p.vx * dt;
                p.mesh.position.y += p.vy * dt;
                p.mesh.position.z += p.vz * dt;
                p.vy += gravity * dt;

                // Fade as it falls
                const lifeRatio = p.life / p.maxLife;
                p.mesh.material.opacity = Math.max(0, 0.7 * (1 - lifeRatio));

                // Reset when life expires or hits pool level
                if (p.life >= p.maxLife || p.mesh.position.y < 0.3) {
                    resetFountainParticle(p, f.x, f.z);
                }
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    //  5. FLOATING LANTERNS (night only)
    // ════════════════════════════════════════════════════════════

    const LANTERN_COUNT = 25;
    const lanterns = [];

    function createLanterns() {
        const lanternGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);

        for (let i = 0; i < LANTERN_COUNT; i++) {
            const warmth = 0.8 + Math.random() * 0.2;
            const mat = new THREE.MeshBasicMaterial({
                color:      new THREE.Color(warmth, warmth * 0.6, warmth * 0.15),
                toneMapped: false,
                transparent: true,
                opacity:    0.0, // start invisible, appear at night
            });

            const mesh = new THREE.Mesh(lanternGeo, mat);
            mesh.visible = false;
            scene.add(mesh);

            lanterns.push({
                mesh,
                x: 0, y: 0, z: 0,
                driftX: 0,
                driftZ: 0,
                wobblePhase: Math.random() * Math.PI * 2,
                riseSpeed: 0,
                active: false,
            });

            resetLantern(lanterns[lanterns.length - 1], true);
        }
    }

    function resetLantern(l, scatter) {
        l.x = (Math.random() - 0.5) * 160;
        l.z = (Math.random() - 0.5) * 160;
        l.y = scatter ? Math.random() * 80 : 1 + Math.random() * 5;
        l.driftX = (Math.random() - 0.5) * 2;
        l.driftZ = (Math.random() - 0.5) * 1.5;
        l.riseSpeed = 1.5 + Math.random() * 2.5;
        l.wobblePhase = Math.random() * Math.PI * 2;
        l.mesh.position.set(l.x, l.y, l.z);
    }

    function updateLanterns(dt, elapsed) {
        const isNight = window.BACCARAT && window.BACCARAT.isNight;

        for (const l of lanterns) {
            if (!isNight) {
                // Fade out
                if (l.mesh.visible) {
                    l.mesh.material.opacity -= dt * 0.5;
                    if (l.mesh.material.opacity <= 0) {
                        l.mesh.visible = false;
                        l.active = false;
                    }
                }
                continue;
            }

            // Activate at night
            if (!l.active) {
                l.active = true;
                l.mesh.visible = true;
                resetLantern(l, false);
            }

            // Fade in
            if (l.mesh.material.opacity < 0.85) {
                l.mesh.material.opacity = Math.min(0.85, l.mesh.material.opacity + dt * 0.8);
            }

            // Rise
            l.y += l.riseSpeed * dt;
            l.x += l.driftX * dt;
            l.z += l.driftZ * dt;

            // Wobble
            l.wobblePhase += dt * 1.5;
            const wobbleX = Math.sin(l.wobblePhase) * 0.3;
            const wobbleZ = Math.cos(l.wobblePhase * 0.7) * 0.2;

            l.mesh.position.set(l.x + wobbleX, l.y, l.z + wobbleZ);
            l.mesh.rotation.z = Math.sin(l.wobblePhase * 0.5) * 0.1;
            l.mesh.rotation.x = Math.cos(l.wobblePhase * 0.3) * 0.08;

            // Recycle when too high
            if (l.y > 100) {
                resetLantern(l, false);
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    //  6. NEON SIGN ENHANCEMENT
    // ════════════════════════════════════════════════════════════

    // We'll find existing neon MeshBasicMaterial objects and enhance them
    const enhancedNeons = [];
    let neonScanDone = false;

    function scanForNeons() {
        // Walk the scene and find MeshBasicMaterial objects with saturated colors
        scene.traverse((obj) => {
            if (!obj.isMesh) return;
            if (!obj.material) return;
            if (!obj.material.isMeshBasicMaterial) return;
            // Skip our own firework / lantern / beam meshes
            if (obj.userData._spectacle) return;

            const c = obj.material.color;
            const max = Math.max(c.r, c.g, c.b);
            const min = Math.min(c.r, c.g, c.b);
            const saturation = max > 0 ? (max - min) / max : 0;

            // Neon signs have high saturation or are very bright
            if (saturation > 0.3 || max > 0.9) {
                enhancedNeons.push({
                    mesh: obj,
                    baseR: c.r,
                    baseG: c.g,
                    baseB: c.b,
                    flickerTimer: Math.random() * 20,     // time until next flicker
                    flickerDuration: 0,
                    flickering: false,
                    startupDone: Math.random() > 0.15,    // 15% get startup flicker
                    startupPhase: 0,
                    startupTime: 2 + Math.random() * 3,
                    phaseOffset: Math.random() * Math.PI * 2,
                });
            }
        });
        neonScanDone = true;
    }

    function updateNeonEnhancement(dt, elapsed) {
        if (!neonScanDone) return;

        for (const n of enhancedNeons) {
            let intensity = 1.0;

            // Startup flicker sequence
            if (!n.startupDone) {
                n.startupPhase += dt;
                const progress = n.startupPhase / n.startupTime;
                if (progress < 1.0) {
                    // Rapid on/off flickering that stabilizes
                    const flickerRate = 30 - progress * 25; // starts fast, slows
                    const flicker = Math.sin(n.startupPhase * flickerRate);
                    intensity = flicker > (progress - 0.5) ? 1.0 : 0.05;
                } else {
                    n.startupDone = true;
                }
            }

            // Random flicker events (like real neon tubes)
            if (n.startupDone) {
                n.flickerTimer -= dt;
                if (n.flickerTimer <= 0 && !n.flickering) {
                    n.flickering = true;
                    n.flickerDuration = 0.05 + Math.random() * 0.15;
                    n.flickerTimer = 5 + Math.random() * 25; // next flicker in 5-30 seconds
                }
                if (n.flickering) {
                    n.flickerDuration -= dt;
                    // Quick intensity drops
                    intensity = Math.random() > 0.5 ? 0.15 : 0.9;
                    if (n.flickerDuration <= 0) {
                        n.flickering = false;
                    }
                }

                // Dramatic pulse
                const pulse = 0.7 + 0.3 * Math.sin(elapsed * 3.0 + n.phaseOffset);
                intensity *= pulse;
            }

            // Apply
            if (n.mesh.material && n.mesh.material.color) {
                n.mesh.material.color.setRGB(
                    n.baseR * intensity,
                    n.baseG * intensity,
                    n.baseB * intensity
                );
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    //  MODULE INTERFACE
    // ════════════════════════════════════════════════════════════

    function init(ctx) {
        THREE = ctx.THREE;
        scene = ctx.scene;

        createHarbor();
        createLightBeams();
        createFireworkSystem();
        createFountain(15, 0);
        createFountain(-15, 0);
        createLanterns();

        // Tag our objects so neon scan skips them
        for (const p of fireworkParticles) p.mesh.userData._spectacle = true;
        for (const l of lanterns) l.mesh.userData._spectacle = true;
        for (const b of lightBeams) b.mesh.userData._spectacle = true;
        for (const f of fountains) {
            for (const p of f.particles) p.mesh.userData._spectacle = true;
        }

        // Delay neon scan to next frame so city-geometry has built everything
        setTimeout(() => scanForNeons(), 100);

        console.log(
            '%c Baccarat City %c Spectacle Online ',
            'background:#ff4488;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;',
            'background:#0a0a12;color:#ff4488;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0;'
        );
    }

    function update(deltaTime, elapsedTime) {
        const dt = Math.min(deltaTime, 0.1); // clamp to avoid explosion on tab-switch

        updateWater(dt, elapsedTime);
        updateLightBeams(dt, elapsedTime);
        updateFireworks(dt, elapsedTime);
        updateFountains(dt);
        updateLanterns(dt, elapsedTime);
        updateNeonEnhancement(dt, elapsedTime);
    }

    // ── Register ─────────────────────────────────────────────
    window.BACCARAT.registerModule({ init, update });

})();
