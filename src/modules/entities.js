// ============================================================
// Baccarat City — Entities: Vehicles + Pedestrians
// ============================================================
// Animated vehicles driving on roads and pedestrians walking
// on sidewalks. Pool-based allocation, simple collision
// avoidance, headlights/taillights for bloom glow.
// ============================================================

(function () {
    'use strict';

    // ── Grid Constants (must match city-geometry) ─────────────
    const PLOT_SIZE  = 10;
    const ROAD_WIDTH = 2;
    const CELL_SIZE  = PLOT_SIZE + ROAD_WIDTH; // 12
    const GRID_COUNT = 17;
    const HALF_GRID  = Math.floor(GRID_COUNT / 2); // 8
    const CITY_EXTENT = GRID_COUNT * CELL_SIZE / 2; // 102

    // Road center lines: -96, -84, -72 ... 0 ... 72, 84, 96
    const ROAD_LINES = [];
    for (let n = 0; n < GRID_COUNT; n++) {
        ROAD_LINES.push(-HALF_GRID * CELL_SIZE + n * CELL_SIZE);
    }
    // That gives: -96, -84, -72, -60, -48, -36, -24, -12, 0, 12, 24, 36, 48, 60, 72, 84, 96

    const CITY_MIN = -CITY_EXTENT;
    const CITY_MAX =  CITY_EXTENT;

    // ── Config ────────────────────────────────────────────────
    const VEHICLE_COUNT     = 35;
    const PEDESTRIAN_COUNT  = 45;

    // ── Shared state ──────────────────────────────────────────
    let THREE;
    let scene;

    // Material caches
    const toonMats = new Map();
    const basicMats = new Map();

    function getToonMat(color) {
        if (toonMats.has(color)) return toonMats.get(color);
        const m = new THREE.MeshToonMaterial({ color });
        toonMats.set(color, m);
        return m;
    }

    function getBasicMat(color) {
        if (basicMats.has(color)) return basicMats.get(color);
        const m = new THREE.MeshBasicMaterial({ color, toneMapped: false });
        basicMats.set(color, m);
        return m;
    }

    // ── Shared geometry cache ─────────────────────────────────
    const geoCache = new Map();
    function boxGeo(w, h, d) {
        const key = `${w},${h},${d}`;
        if (geoCache.has(key)) return geoCache.get(key);
        const g = new THREE.BoxGeometry(w, h, d);
        geoCache.set(key, g);
        return g;
    }
    let sphereGeo, cylGeo, wheelGeo;

    // ── RNG ───────────────────────────────────────────────────
    function rand(min, max) {
        return min + Math.random() * (max - min);
    }
    function randInt(min, max) {
        return Math.floor(rand(min, max + 0.999));
    }
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ════════════════════════════════════════════════════════════
    //  VEHICLE SYSTEM
    // ════════════════════════════════════════════════════════════

    // Vehicle type definitions
    const VEHICLE_TYPES = {
        sedan: {
            bodyW: 1.2, bodyH: 0.5, bodyD: 2.0,
            cabinW: 1.0, cabinH: 0.4, cabinD: 1.0, cabinY: 0.45,
            colors: [0x3355aa, 0x555555, 0x882222, 0x228833, 0x666688, 0x444444, 0x993333],
            weight: 5, speedMin: 9, speedMax: 14,
        },
        taxi: {
            bodyW: 1.2, bodyH: 0.5, bodyD: 2.0,
            cabinW: 1.0, cabinH: 0.4, cabinD: 1.0, cabinY: 0.45,
            colors: [0xddcc22, 0xe8d030],
            weight: 3, speedMin: 8, speedMax: 13,
        },
        limo: {
            bodyW: 1.3, bodyH: 0.5, bodyD: 3.2,
            cabinW: 1.1, cabinH: 0.4, cabinD: 1.6, cabinY: 0.45,
            colors: [0x111111, 0x1a1a1a, 0xeeeeee],
            weight: 2, speedMin: 7, speedMax: 11,
        },
        bus: {
            bodyW: 1.6, bodyH: 1.2, bodyD: 3.8,
            cabinW: 0, cabinH: 0, cabinD: 0, cabinY: 0,
            colors: [0x2255aa, 0xcc3333, 0x22aa55],
            weight: 1, speedMin: 6, speedMax: 10,
        },
        sports: {
            bodyW: 1.4, bodyH: 0.35, bodyD: 2.2,
            cabinW: 1.1, cabinH: 0.3, cabinD: 0.8, cabinY: 0.32,
            colors: [0xcc2222, 0x2244cc, 0xddaa11, 0xff4400],
            weight: 2, speedMin: 12, speedMax: 18,
        },
        van: {
            bodyW: 1.4, bodyH: 0.9, bodyD: 2.4,
            cabinW: 1.3, cabinH: 0.3, cabinD: 0.8, cabinY: 0.6,
            colors: [0xeeeeee, 0x4477aa, 0xcc8833],
            weight: 1, speedMin: 7, speedMax: 11,
        },
    };

    // Build weighted type array
    const VEHICLE_TYPE_POOL = [];
    for (const [name, def] of Object.entries(VEHICLE_TYPES)) {
        for (let i = 0; i < def.weight; i++) {
            VEHICLE_TYPE_POOL.push(name);
        }
    }

    function createVehicleMesh(typeName) {
        const def = VEHICLE_TYPES[typeName];
        const group = new THREE.Group();
        const color = pick(def.colors);

        // Body
        const body = new THREE.Mesh(boxGeo(def.bodyW, def.bodyH, def.bodyD), getToonMat(color));
        body.position.y = def.bodyH / 2 + 0.15; // above road + wheel clearance
        body.castShadow = true;
        group.add(body);

        // Cabin (if present)
        if (def.cabinW > 0) {
            const cabin = new THREE.Mesh(boxGeo(def.cabinW, def.cabinH, def.cabinD), getToonMat(0x333344));
            cabin.position.y = def.cabinY + 0.15;
            cabin.position.z = -def.bodyD * 0.05; // slightly toward rear
            cabin.castShadow = true;
            group.add(cabin);
        }

        // Wheels (4 dark cylinders)
        const wheelRadius = 0.12;
        const wheelWidth = 0.08;
        const offsets = [
            [-def.bodyW / 2 - 0.02, wheelRadius, -def.bodyD * 0.32],
            [ def.bodyW / 2 + 0.02, wheelRadius, -def.bodyD * 0.32],
            [-def.bodyW / 2 - 0.02, wheelRadius,  def.bodyD * 0.32],
            [ def.bodyW / 2 + 0.02, wheelRadius,  def.bodyD * 0.32],
        ];
        for (const [wx, wy, wz] of offsets) {
            const wheel = new THREE.Mesh(wheelGeo, getToonMat(0x111111));
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, wy, wz);
            group.add(wheel);
        }

        // Headlights (front = +z direction in local space)
        const hlGeo = boxGeo(0.15, 0.1, 0.06);
        const hlMat = getBasicMat(0xffffcc);
        const hlL = new THREE.Mesh(hlGeo, hlMat);
        const hlR = new THREE.Mesh(hlGeo, hlMat);
        hlL.position.set(-def.bodyW * 0.35, def.bodyH * 0.5 + 0.15, def.bodyD / 2 + 0.02);
        hlR.position.set( def.bodyW * 0.35, def.bodyH * 0.5 + 0.15, def.bodyD / 2 + 0.02);
        group.add(hlL, hlR);

        // Taillights (rear = -z direction)
        const tlGeo = boxGeo(0.18, 0.08, 0.06);
        const tlMat = getBasicMat(0xff2200);
        const tlL = new THREE.Mesh(tlGeo, tlMat);
        const tlR = new THREE.Mesh(tlGeo, tlMat);
        tlL.position.set(-def.bodyW * 0.35, def.bodyH * 0.5 + 0.15, -def.bodyD / 2 - 0.02);
        tlR.position.set( def.bodyW * 0.35, def.bodyH * 0.5 + 0.15, -def.bodyD / 2 - 0.02);
        group.add(tlL, tlR);

        return group;
    }

    // ── Vehicle Pool ──────────────────────────────────────────
    const vehicles = [];

    function initVehicle(v) {
        // Pick a random road line and direction
        const axis = Math.random() < 0.5 ? 'x' : 'z'; // axis of travel
        const roadLine = pick(ROAD_LINES);
        const direction = Math.random() < 0.5 ? 1 : -1;
        const startPos = rand(CITY_MIN, CITY_MAX);

        // Slight lateral offset so opposing lanes don't overlap
        const laneOffset = direction * 0.4;

        v.axis = axis;
        v.roadLine = roadLine;
        v.direction = direction;
        v.speed = rand(v.typeDef.speedMin, v.typeDef.speedMax);
        v.turnCooldown = 0;
        v.stopped = false;

        if (axis === 'x') {
            // Traveling along X axis, fixed Z = roadLine
            v.mesh.position.set(startPos, 0, roadLine + laneOffset);
            v.mesh.rotation.y = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
            // Traveling along Z axis, fixed X = roadLine
            v.mesh.position.set(roadLine + laneOffset, 0, startPos);
            v.mesh.rotation.y = direction > 0 ? 0 : Math.PI;
        }
    }

    function spawnVehicles() {
        for (let i = 0; i < VEHICLE_COUNT; i++) {
            const typeName = pick(VEHICLE_TYPE_POOL);
            const mesh = createVehicleMesh(typeName);
            scene.add(mesh);

            const v = {
                mesh,
                typeName,
                typeDef: VEHICLE_TYPES[typeName],
                axis: 'x',
                roadLine: 0,
                direction: 1,
                speed: 10,
                turnCooldown: 0,
                stopped: false,
            };

            initVehicle(v);
            vehicles.push(v);
        }
    }

    function findNearestRoadLine(val) {
        let best = ROAD_LINES[0];
        let bestDist = Math.abs(val - best);
        for (let i = 1; i < ROAD_LINES.length; i++) {
            const d = Math.abs(val - ROAD_LINES[i]);
            if (d < bestDist) { bestDist = d; best = ROAD_LINES[i]; }
        }
        return best;
    }

    function isNearIntersection(pos, axis) {
        // Check if the travel-axis position is near a cross-road line
        const travelPos = axis === 'x' ? pos.x : pos.z;
        for (let i = 0; i < ROAD_LINES.length; i++) {
            if (Math.abs(travelPos - ROAD_LINES[i]) < 0.8) return ROAD_LINES[i];
        }
        return null;
    }

    function updateVehicles(dt) {
        for (let i = 0; i < vehicles.length; i++) {
            const v = vehicles[i];
            const pos = v.mesh.position;

            // Simple collision avoidance: check distance to vehicles ahead
            let slowFactor = 1;
            for (let j = 0; j < vehicles.length; j++) {
                if (i === j) continue;
                const o = vehicles[j];
                if (o.axis !== v.axis || o.roadLine !== v.roadLine) continue;

                const myPos = v.axis === 'x' ? pos.x : pos.z;
                const otherPos = v.axis === 'x' ? o.mesh.position.x : o.mesh.position.z;
                const diff = (otherPos - myPos) * v.direction;

                if (diff > 0 && diff < 4) {
                    slowFactor = Math.min(slowFactor, diff / 4);
                }
            }

            // Move
            const move = v.speed * dt * slowFactor;
            if (v.axis === 'x') {
                pos.x += move * v.direction;
            } else {
                pos.z += move * v.direction;
            }

            // Try turning at intersections
            v.turnCooldown -= dt;
            if (v.turnCooldown <= 0) {
                const crossRoad = isNearIntersection(pos, v.axis);
                if (crossRoad !== null && Math.random() < 0.15) {
                    // Turn!
                    const newAxis = v.axis === 'x' ? 'z' : 'x';
                    const newRoadLine = crossRoad;
                    const newDirection = Math.random() < 0.5 ? 1 : -1;
                    const laneOffset = newDirection * 0.4;

                    // Snap to intersection
                    if (v.axis === 'x') {
                        // Was traveling X, now travel Z. Fix X = current cross road
                        const snapX = findNearestRoadLine(pos.x);
                        pos.x = snapX + (newAxis === 'z' ? laneOffset : 0);
                        pos.z = newRoadLine + (newAxis === 'x' ? laneOffset : 0);
                    } else {
                        const snapZ = findNearestRoadLine(pos.z);
                        pos.z = snapZ + (newAxis === 'x' ? laneOffset : 0);
                        pos.x = newRoadLine + (newAxis === 'z' ? laneOffset : 0);
                    }

                    v.axis = newAxis;
                    v.roadLine = newRoadLine;
                    v.direction = newDirection;

                    // Update rotation
                    if (newAxis === 'x') {
                        v.mesh.rotation.y = newDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
                    } else {
                        v.mesh.rotation.y = newDirection > 0 ? 0 : Math.PI;
                    }

                    v.turnCooldown = 2.0; // don't turn again for 2 seconds
                }
            }

            // Wrap at city edges
            const travelPos = v.axis === 'x' ? pos.x : pos.z;
            if (travelPos > CITY_MAX + 5) {
                if (v.axis === 'x') pos.x = CITY_MIN - 3;
                else pos.z = CITY_MIN - 3;
            } else if (travelPos < CITY_MIN - 5) {
                if (v.axis === 'x') pos.x = CITY_MAX + 3;
                else pos.z = CITY_MAX + 3;
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    //  PEDESTRIAN SYSTEM
    // ════════════════════════════════════════════════════════════

    const PED_BODY_COLORS = [
        0xcc3344, 0x3366cc, 0x33aa55, 0xddaa22, 0xaa33aa,
        0x55aacc, 0xcc6633, 0x6644aa, 0xaa5555, 0x448866,
        0xdd5599, 0x3388aa, 0xbb8833, 0x7755cc, 0x558844,
    ];

    const SKIN_COLORS = [0xf5d0a9, 0xd2a67a, 0xc6956b, 0x8d5524, 0xf0c8a0];

    function createPedestrianMesh() {
        const group = new THREE.Group();
        const bodyColor = pick(PED_BODY_COLORS);
        const skinColor = pick(SKIN_COLORS);

        // Body (cylinder-like using box for cheapness)
        const body = new THREE.Mesh(boxGeo(0.3, 0.5, 0.2), getToonMat(bodyColor));
        body.position.y = 0.55;
        body.castShadow = true;
        group.add(body);

        // Head (sphere)
        const head = new THREE.Mesh(sphereGeo, getToonMat(skinColor));
        head.position.y = 0.95;
        head.scale.set(0.15, 0.15, 0.15);
        head.castShadow = true;
        group.add(head);

        // Legs (two thin boxes)
        const legMat = getToonMat(0x222233);
        const legL = new THREE.Mesh(boxGeo(0.1, 0.35, 0.12), legMat);
        const legR = new THREE.Mesh(boxGeo(0.1, 0.35, 0.12), legMat);
        legL.position.set(-0.08, 0.175, 0);
        legR.position.set( 0.08, 0.175, 0);
        group.add(legL, legR);

        // Store references for animation
        group.userData.legL = legL;
        group.userData.legR = legR;

        return group;
    }

    const pedestrians = [];

    function initPedestrian(p, scattered) {
        // Pick a road to walk along on the sidewalk
        const axis = Math.random() < 0.5 ? 'x' : 'z';
        const roadLine = pick(ROAD_LINES);
        const direction = Math.random() < 0.5 ? 1 : -1;
        const side = Math.random() < 0.5 ? 1 : -1;
        const sidewalkOffset = side * 1.5; // sidewalk is ~1.5 units from road center

        const startPos = scattered ? rand(CITY_MIN, CITY_MAX) : (direction > 0 ? CITY_MIN - 2 : CITY_MAX + 2);

        p.axis = axis;
        p.roadLine = roadLine;
        p.direction = direction;
        p.speed = rand(1.5, 3.0);
        p.bobPhase = rand(0, Math.PI * 2);
        p.standing = Math.random() < 0.08; // 8% chance standing still

        if (axis === 'x') {
            p.mesh.position.set(startPos, 0, roadLine + sidewalkOffset);
            p.mesh.rotation.y = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
            p.mesh.position.set(roadLine + sidewalkOffset, 0, startPos);
            p.mesh.rotation.y = direction > 0 ? 0 : Math.PI;
        }
    }

    function spawnPedestrians() {
        for (let i = 0; i < PEDESTRIAN_COUNT; i++) {
            const mesh = createPedestrianMesh();
            scene.add(mesh);

            const p = {
                mesh,
                axis: 'x',
                roadLine: 0,
                direction: 1,
                speed: 2,
                bobPhase: 0,
                standing: false,
            };

            initPedestrian(p, true);
            pedestrians.push(p);
        }
    }

    function updatePedestrians(dt, elapsed) {
        for (let i = 0; i < pedestrians.length; i++) {
            const p = pedestrians[i];
            const pos = p.mesh.position;

            if (p.standing) {
                // Just bob slightly
                pos.y = Math.sin(elapsed * 0.5 + p.bobPhase) * 0.02;
                continue;
            }

            // Move
            const move = p.speed * dt;
            if (p.axis === 'x') {
                pos.x += move * p.direction;
            } else {
                pos.z += move * p.direction;
            }

            // Walking bob
            p.bobPhase += dt * p.speed * 4;
            pos.y = Math.abs(Math.sin(p.bobPhase)) * 0.1;

            // Leg animation
            const legAngle = Math.sin(p.bobPhase) * 0.4;
            const legL = p.mesh.userData.legL;
            const legR = p.mesh.userData.legR;
            if (legL && legR) {
                legL.rotation.x =  legAngle;
                legR.rotation.x = -legAngle;
            }

            // Wrap or re-init at city edges
            const travelPos = p.axis === 'x' ? pos.x : pos.z;
            if (travelPos > CITY_MAX + 3 || travelPos < CITY_MIN - 3) {
                initPedestrian(p, true);
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    //  MODULE REGISTRATION
    // ════════════════════════════════════════════════════════════

    function init(ctx) {
        THREE = ctx.THREE;
        scene = ctx.scene;

        // Init shared geometries
        sphereGeo = new THREE.SphereGeometry(1, 8, 6);
        cylGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
        wheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6);

        spawnVehicles();
        spawnPedestrians();
    }

    function update(deltaTime, elapsedTime) {
        // Clamp deltaTime to avoid huge jumps on tab-switch
        const dt = Math.min(deltaTime, 0.1);
        updateVehicles(dt);
        updatePedestrians(dt, elapsedTime);
    }

    window.BACCARAT.registerModule({ init, update });

})();
