// ============================================================
// Baccarat City — City Geometry: Buildings + Roads
// ============================================================
// Dense Macau-inspired cityscape with procedural low-poly
// buildings, road network, and ground plane. All geometry uses
// MeshToonMaterial for cel-shaded aesthetic. Neon signs use
// MeshBasicMaterial for bloom glow.
// ============================================================

(function () {
    'use strict';

    // ── Palette ──────────────────────────────────────────────
    const GOLD      = 0xd4af37;
    const DARK      = 0x0a0a12;
    const ASPHALT   = 0x1a1a22;
    const ROAD      = 0x111118;
    const SIDEWALK  = 0x2a2a32;
    const LANE_MARK = 0x888866;
    const CROSSWALK = 0xccccaa;
    const PARK_GREEN = 0x2d5a1e;
    const TREE_TRUNK = 0x5c3a1e;
    const TREE_LEAF  = 0x2a7a22;

    // Neon colors
    const NEON_RED   = 0xff2244;
    const NEON_BLUE  = 0x2244ff;
    const NEON_GREEN = 0x22ff88;
    const NEON_PINK  = 0xff44aa;
    const NEON_GOLD  = 0xd4af37;
    const NEON_COLORS = [NEON_RED, NEON_BLUE, NEON_GREEN, NEON_PINK, NEON_GOLD];

    // Building palettes
    const CASINO_COLORS   = [0xd4af37, 0xc9a84c, 0xb8941f, 0xe8c547];
    const CASINO_BODY     = [0x2a1a0a, 0x1a1020, 0x201018, 0x18120e];
    const HOTEL_COLORS    = [0x4466aa, 0x556688, 0x445577, 0x667799, 0x3a5588];
    const SHOP_COLORS     = [0xcc3344, 0x33aa66, 0x4488cc, 0xdd8833, 0xaa33aa];
    const RESIDENTIAL     = [0x887766, 0x998877, 0x776655, 0xaa9988, 0x665544];
    const TEMPLE_RED      = [0xaa2222, 0xbb3333, 0x992020];
    const OFFICE_COLORS   = [0x334466, 0x2a3a55, 0x3d5577, 0x224455];
    const PARKING_COLORS  = [0x555566, 0x4a4a55, 0x606070];

    // ── Grid Config ──────────────────────────────────────────
    const PLOT_SIZE  = 10;   // building plot is 10x10
    const ROAD_WIDTH = 2;    // roads between plots
    const CELL_SIZE  = PLOT_SIZE + ROAD_WIDTH; // 12 units per cell
    const GRID_COUNT = 17;   // 17x17 grid for dense coverage
    const HALF_GRID  = Math.floor(GRID_COUNT / 2);
    const CITY_EXTENT = GRID_COUNT * CELL_SIZE / 2;

    // ── Shared state ─────────────────────────────────────────
    let THREE;
    const neonMeshes = [];  // meshes with pulsing emissive
    const toonMaterials = new Map(); // cache by color
    const neonMaterials = new Map();

    // Seeded PRNG for deterministic city
    let seed = 42;
    function rng() {
        seed = (seed * 16807 + 0) % 2147483647;
        return (seed - 1) / 2147483646;
    }
    function rngInt(min, max) {
        return Math.floor(rng() * (max - min + 1)) + min;
    }
    function rngPick(arr) {
        return arr[Math.floor(rng() * arr.length)];
    }
    function rngFloat(min, max) {
        return min + rng() * (max - min);
    }

    // ── Material Helpers ─────────────────────────────────────
    function getToonMat(color) {
        const key = color;
        if (toonMaterials.has(key)) return toonMaterials.get(key);
        const mat = new THREE.MeshToonMaterial({ color });
        toonMaterials.set(key, mat);
        return mat;
    }

    function getNeonMat(color) {
        const key = color;
        if (neonMaterials.has(key)) return neonMaterials.get(key);
        const mat = new THREE.MeshBasicMaterial({ color, toneMapped: false });
        neonMaterials.set(key, mat);
        return mat;
    }

    // ── Geometry Cache ───────────────────────────────────────
    const geoCache = new Map();
    function boxGeo(w, h, d) {
        const key = `b_${w}_${h}_${d}`;
        if (geoCache.has(key)) return geoCache.get(key);
        const g = new THREE.BoxGeometry(w, h, d);
        geoCache.set(key, g);
        return g;
    }
    function cylGeo(rTop, rBot, h, seg) {
        seg = seg || 8;
        const key = `c_${rTop}_${rBot}_${h}_${seg}`;
        if (geoCache.has(key)) return geoCache.get(key);
        const g = new THREE.CylinderGeometry(rTop, rBot, h, seg);
        geoCache.set(key, g);
        return g;
    }

    // ── Instanced Mesh Helpers ───────────────────────────────
    // We'll collect window positions / tree positions then batch
    const windowPositions = [];  // {x,y,z,w,h}
    const treePositions = [];    // {x,z}

    // ── Building Generators ──────────────────────────────────
    // Each returns a THREE.Group placed at origin (bottom-center)

    // --- GRAND CASINO (4 variations) ---
    function createCasino(variation) {
        const group = new THREE.Group();
        const v = variation % 4;
        const bodyColor = rngPick(CASINO_BODY);
        const trimColor = rngPick(CASINO_COLORS);

        if (v === 0) {
            // Grand Lisboa style — cylindrical tower with lotus top
            const baseH = 12;
            const towerH = rngFloat(55, 75);
            // Wide base
            const base = new THREE.Mesh(boxGeo(9, baseH, 9), getToonMat(bodyColor));
            base.position.y = baseH / 2;
            base.castShadow = true;
            group.add(base);
            // Cylindrical tower
            const tower = new THREE.Mesh(cylGeo(3, 3.5, towerH, 12), getToonMat(bodyColor));
            tower.position.y = baseH + towerH / 2;
            tower.castShadow = true;
            group.add(tower);
            // Gold crown / lotus
            const crown = new THREE.Mesh(cylGeo(0.5, 4.5, 10, 8), getToonMat(trimColor));
            crown.position.y = baseH + towerH + 5;
            crown.castShadow = true;
            group.add(crown);
            // Gold trim ring at base
            const ring = new THREE.Mesh(cylGeo(4.5, 4.5, 1, 12), getToonMat(trimColor));
            ring.position.y = baseH;
            group.add(ring);
            // Entrance canopy
            const canopy = new THREE.Mesh(boxGeo(6, 0.3, 3), getToonMat(trimColor));
            canopy.position.set(0, 4, 5.5);
            group.add(canopy);
            // Neon sign on base
            addNeonSign(group, 0, baseH + 2, 4.6, 4, 1.5, rngPick(NEON_COLORS));
            addNeonSign(group, 0, baseH + 2, -4.6, 4, 1.5, rngPick(NEON_COLORS));
        } else if (v === 1) {
            // Wynn style — curved tower with stripe
            const h = rngFloat(50, 70);
            const body = new THREE.Mesh(boxGeo(8, h, 6), getToonMat(0x442211));
            body.position.y = h / 2;
            body.castShadow = true;
            group.add(body);
            // Gold stripe
            const stripe = new THREE.Mesh(boxGeo(8.1, h, 0.3), getToonMat(trimColor));
            stripe.position.set(0, h / 2, 3.1);
            group.add(stripe);
            const stripe2 = new THREE.Mesh(boxGeo(8.1, h, 0.3), getToonMat(trimColor));
            stripe2.position.set(0, h / 2, -3.1);
            group.add(stripe2);
            // Roof detail
            const roof = new THREE.Mesh(boxGeo(9, 2, 7), getToonMat(trimColor));
            roof.position.y = h + 1;
            group.add(roof);
            // Canopy
            const canopy = new THREE.Mesh(boxGeo(10, 0.4, 4), getToonMat(trimColor));
            canopy.position.set(0, 3.5, 5);
            group.add(canopy);
            // Neon
            addNeonSign(group, 0, h * 0.7, 3.2, 3, 2, NEON_GOLD);
            addNeonCharacters(group, 0, 6, 4.2, 3);
        } else if (v === 2) {
            // Venetian style — wide with tower
            const baseH = 18;
            const towerH = rngFloat(40, 60);
            const base = new THREE.Mesh(boxGeo(9, baseH, 9), getToonMat(0x8a7a5a));
            base.position.y = baseH / 2;
            base.castShadow = true;
            group.add(base);
            // Tower
            const tower = new THREE.Mesh(boxGeo(5, towerH, 5), getToonMat(0x8a7a5a));
            tower.position.y = baseH + towerH / 2;
            tower.castShadow = true;
            group.add(tower);
            // Arch entrance
            const archL = new THREE.Mesh(boxGeo(0.5, 6, 1), getToonMat(trimColor));
            archL.position.set(-2, 3, 4.8);
            group.add(archL);
            const archR = new THREE.Mesh(boxGeo(0.5, 6, 1), getToonMat(trimColor));
            archR.position.set(2, 3, 4.8);
            group.add(archR);
            const archTop = new THREE.Mesh(boxGeo(5, 0.5, 1), getToonMat(trimColor));
            archTop.position.set(0, 6, 4.8);
            group.add(archTop);
            // Dome on top
            const dome = new THREE.Mesh(cylGeo(0.2, 3, 4, 8), getToonMat(trimColor));
            dome.position.y = baseH + towerH + 2;
            group.add(dome);
            addNeonSign(group, 0, baseH - 2, 4.6, 5, 2, NEON_RED);
            addWindowGrid(group, 9, baseH, 9, bodyColor);
        } else {
            // MGM style — twin towers connected
            const h = rngFloat(45, 65);
            const towerA = new THREE.Mesh(boxGeo(4, h, 4), getToonMat(0x886622));
            towerA.position.set(-2.5, h / 2, 0);
            towerA.castShadow = true;
            group.add(towerA);
            const towerB = new THREE.Mesh(boxGeo(4, h, 4), getToonMat(0x886622));
            towerB.position.set(2.5, h / 2, 0);
            towerB.castShadow = true;
            group.add(towerB);
            // Bridge connector
            const bridge = new THREE.Mesh(boxGeo(9, 4, 4), getToonMat(trimColor));
            bridge.position.y = h * 0.75;
            group.add(bridge);
            // Base
            const base = new THREE.Mesh(boxGeo(9, 8, 8), getToonMat(0x332211));
            base.position.y = 4;
            base.castShadow = true;
            group.add(base);
            // Gold caps
            const capA = new THREE.Mesh(boxGeo(4.5, 2, 4.5), getToonMat(trimColor));
            capA.position.set(-2.5, h + 1, 0);
            group.add(capA);
            const capB = new THREE.Mesh(boxGeo(4.5, 2, 4.5), getToonMat(trimColor));
            capB.position.set(2.5, h + 1, 0);
            group.add(capB);
            addNeonSign(group, 0, 9, 4.1, 6, 2, NEON_PINK);
            addNeonCharacters(group, 0, 12, 4.1, 4);
        }

        // Add windows to all casinos
        addScatteredWindows(group, 9, 40, 9);
        // Rooftop AC units
        addRooftopDetails(group, 9);
        return group;
    }

    // --- HOTEL TOWER (3 variations) ---
    function createHotel(variation) {
        const group = new THREE.Group();
        const v = variation % 3;
        const color = rngPick(HOTEL_COLORS);
        const h = rngFloat(30, 58);

        if (v === 0) {
            // Simple rectangular tower with setback
            const baseH = 8;
            const base = new THREE.Mesh(boxGeo(9, baseH, 9), getToonMat(color));
            base.position.y = baseH / 2;
            base.castShadow = true;
            group.add(base);
            const tower = new THREE.Mesh(boxGeo(7, h - baseH, 7), getToonMat(color));
            tower.position.y = baseH + (h - baseH) / 2;
            tower.castShadow = true;
            group.add(tower);
            // Roof ledge
            const ledge = new THREE.Mesh(boxGeo(7.5, 1, 7.5), getToonMat(0xffffff));
            ledge.position.y = h + 0.5;
            group.add(ledge);
        } else if (v === 1) {
            // L-shaped with terrace
            const mainH = h;
            const wingH = h * 0.6;
            const main = new THREE.Mesh(boxGeo(5, mainH, 8), getToonMat(color));
            main.position.set(-2, mainH / 2, 0);
            main.castShadow = true;
            group.add(main);
            const wing = new THREE.Mesh(boxGeo(4, wingH, 5), getToonMat(color));
            wing.position.set(2.5, wingH / 2, -1.5);
            wing.castShadow = true;
            group.add(wing);
            // Terrace on wing
            const terrace = new THREE.Mesh(boxGeo(4.5, 0.3, 5.5), getToonMat(0x666666));
            terrace.position.set(2.5, wingH, -1.5);
            group.add(terrace);
        } else {
            // Curved facade approximation (tapered box)
            const body = new THREE.Mesh(boxGeo(8, h, 7), getToonMat(color));
            body.position.y = h / 2;
            body.castShadow = true;
            group.add(body);
            // Glass facade strip
            const glass = new THREE.Mesh(boxGeo(8.1, h * 0.8, 0.2), getToonMat(0x88aacc));
            glass.position.set(0, h * 0.5, 3.6);
            group.add(glass);
            const cap = new THREE.Mesh(boxGeo(8.5, 1.5, 7.5), getToonMat(0xffffff));
            cap.position.y = h + 0.75;
            group.add(cap);
        }

        addWindowGrid(group, 8, h, 8, 0x112233);
        addRooftopDetails(group, 8);
        // Hotel sign (neon)
        addNeonSign(group, 0, h * 0.85, 4.6, 3, 1, rngPick(NEON_COLORS));
        return group;
    }

    // --- SHOPPING MALL ---
    function createMall() {
        const group = new THREE.Group();
        const h = rngFloat(8, 14);
        const color = rngPick([0xccbbaa, 0xddccbb, 0xbbaa99]);

        const body = new THREE.Mesh(boxGeo(9, h, 9), getToonMat(color));
        body.position.y = h / 2;
        body.castShadow = true;
        group.add(body);

        // Glass storefront
        const glass = new THREE.Mesh(boxGeo(7, 4, 0.2), getToonMat(0x6688aa));
        glass.position.set(0, 2.5, 4.6);
        group.add(glass);

        // Rooftop sign
        const signH = 3;
        const sign = new THREE.Mesh(boxGeo(6, signH, 0.4), getNeonMat(rngPick(NEON_COLORS)));
        sign.position.set(0, h + signH / 2, 0);
        neonMeshes.push(sign);
        group.add(sign);

        // Entrance canopy
        const canopy = new THREE.Mesh(boxGeo(5, 0.3, 2), getToonMat(0x888888));
        canopy.position.set(0, 4, 5.5);
        group.add(canopy);

        // Rooftop parking/garden
        const roofFloor = new THREE.Mesh(boxGeo(8, 0.2, 8), getToonMat(0x555555));
        roofFloor.position.y = h + 0.1;
        group.add(roofFloor);

        addNeonCharacters(group, 0, h + 1, 4.6, 3);
        return group;
    }

    // --- RESIDENTIAL BLOCK ---
    function createResidential() {
        const group = new THREE.Group();
        const h = rngFloat(15, 25);
        const color = rngPick(RESIDENTIAL);

        const body = new THREE.Mesh(boxGeo(8, h, 8), getToonMat(color));
        body.position.y = h / 2;
        body.castShadow = true;
        group.add(body);

        // Balconies on two faces
        const balconyCount = Math.floor(h / 3);
        for (let i = 0; i < balconyCount; i++) {
            const by = 3 + i * 3;
            if (by > h - 1) break;
            // Front balconies
            const bal = new THREE.Mesh(boxGeo(1.5, 0.2, 1), getToonMat(0x999988));
            bal.position.set(-2, by, 4.5);
            group.add(bal);
            const bal2 = new THREE.Mesh(boxGeo(1.5, 0.2, 1), getToonMat(0x999988));
            bal2.position.set(2, by, 4.5);
            group.add(bal2);
            // Railing
            const rail = new THREE.Mesh(boxGeo(1.5, 0.8, 0.1), getToonMat(0x777777));
            rail.position.set(-2, by + 0.5, 5);
            group.add(rail);
            const rail2 = new THREE.Mesh(boxGeo(1.5, 0.8, 0.1), getToonMat(0x777777));
            rail2.position.set(2, by + 0.5, 5);
            group.add(rail2);
        }

        // Roof water tank
        const tank = new THREE.Mesh(cylGeo(0.8, 0.8, 2, 6), getToonMat(0x444444));
        tank.position.set(2, h + 1, 2);
        group.add(tank);

        addWindowGrid(group, 8, h, 8, 0x223322);
        return group;
    }

    // --- TEMPLE / TRADITIONAL ---
    function createTemple() {
        const group = new THREE.Group();
        const red = rngPick(TEMPLE_RED);

        // Base platform
        const platform = new THREE.Mesh(boxGeo(9, 1.5, 9), getToonMat(0x888877));
        platform.position.y = 0.75;
        group.add(platform);

        // Main hall
        const hallH = 6;
        const hall = new THREE.Mesh(boxGeo(7, hallH, 7), getToonMat(red));
        hall.position.y = 1.5 + hallH / 2;
        hall.castShadow = true;
        group.add(hall);

        // Pagoda roofs — stacked trapezoids (using scaled boxes)
        const tiers = rngInt(2, 4);
        let y = 1.5 + hallH;
        let w = 8.5;
        for (let t = 0; t < tiers; t++) {
            // Roof overhang
            const roofH = 1.2;
            const roof = new THREE.Mesh(boxGeo(w, roofH, w), getToonMat(0x222222));
            roof.position.y = y + roofH / 2;
            group.add(roof);
            // Upturn edges (small boxes at corners)
            const cornerSize = 0.4;
            const cOff = w / 2 - 0.1;
            for (let cx = -1; cx <= 1; cx += 2) {
                for (let cz = -1; cz <= 1; cz += 2) {
                    const corner = new THREE.Mesh(boxGeo(cornerSize, cornerSize * 2, cornerSize), getToonMat(GOLD));
                    corner.position.set(cx * cOff, y + roofH + cornerSize, cz * cOff);
                    group.add(corner);
                }
            }
            y += roofH + 2.5;
            w -= 1.5;
            if (w < 3) break;
            // Tier body
            const tierBody = new THREE.Mesh(boxGeo(w - 1, 2, w - 1), getToonMat(red));
            tierBody.position.y = y - 1;
            tierBody.castShadow = true;
            group.add(tierBody);
        }

        // Gold finial on top
        const finial = new THREE.Mesh(cylGeo(0.1, 0.4, 2, 6), getToonMat(GOLD));
        finial.position.y = y + 1;
        group.add(finial);

        // Door
        const door = new THREE.Mesh(boxGeo(1.5, 3, 0.2), getToonMat(0x442200));
        door.position.set(0, 1.5 + 1.5, 3.6);
        group.add(door);

        // Lanterns (neon)
        const lanternL = new THREE.Mesh(cylGeo(0.3, 0.3, 0.8, 6), getNeonMat(NEON_RED));
        lanternL.position.set(-2, 5, 3.6);
        neonMeshes.push(lanternL);
        group.add(lanternL);
        const lanternR = new THREE.Mesh(cylGeo(0.3, 0.3, 0.8, 6), getNeonMat(NEON_RED));
        lanternR.position.set(2, 5, 3.6);
        neonMeshes.push(lanternR);
        group.add(lanternR);

        return group;
    }

    // --- NEON SHOP ---
    function createNeonShop() {
        const group = new THREE.Group();
        const h = rngFloat(5, 10);
        const color = rngPick(SHOP_COLORS);

        const body = new THREE.Mesh(boxGeo(8, h, 7), getToonMat(color));
        body.position.y = h / 2;
        body.castShadow = true;
        group.add(body);

        // Bright facade
        const facade = new THREE.Mesh(boxGeo(8.1, h * 0.4, 0.2), getNeonMat(rngPick(NEON_COLORS)));
        facade.position.set(0, h * 0.6, 3.6);
        neonMeshes.push(facade);
        group.add(facade);

        // Sign pole on top
        const pole = new THREE.Mesh(cylGeo(0.1, 0.1, 4, 4), getToonMat(0x888888));
        pole.position.set(0, h + 2, 0);
        group.add(pole);
        const signBoard = new THREE.Mesh(boxGeo(3, 2, 0.3), getNeonMat(rngPick(NEON_COLORS)));
        signBoard.position.set(0, h + 3.5, 0);
        neonMeshes.push(signBoard);
        group.add(signBoard);

        // Awning
        const awning = new THREE.Mesh(boxGeo(8, 0.2, 2), getToonMat(rngPick(SHOP_COLORS)));
        awning.position.set(0, 3, 4.5);
        group.add(awning);

        // Side neon
        addNeonSign(group, 4.1, h * 0.5, 0, 0.5, h * 0.6, rngPick(NEON_COLORS));

        addNeonCharacters(group, 0, h * 0.3, 3.7, 2);
        return group;
    }

    // --- PARKING GARAGE ---
    function createParkingGarage() {
        const group = new THREE.Group();
        const floors = rngInt(4, 7);
        const h = floors * 3;
        const color = rngPick(PARKING_COLORS);

        const body = new THREE.Mesh(boxGeo(9, h, 8), getToonMat(color));
        body.position.y = h / 2;
        body.castShadow = true;
        group.add(body);

        // Horizontal stripes (alternating recessed floors)
        for (let f = 0; f < floors; f++) {
            const stripeY = f * 3 + 1.5;
            const stripe = new THREE.Mesh(boxGeo(9.1, 0.4, 8.1), getToonMat(0x333340));
            stripe.position.y = stripeY;
            group.add(stripe);
            // Open-air gaps (darker inset)
            const gap = new THREE.Mesh(boxGeo(7, 1.5, 0.3), getToonMat(0x111115));
            gap.position.set(0, stripeY + 0.8, 4.1);
            group.add(gap);
        }

        // Ramp indicator
        const ramp = new THREE.Mesh(boxGeo(2, 0.3, 3), getToonMat(0xdddd44));
        ramp.position.set(-3, 0.15, 4.5);
        ramp.rotation.x = -0.15;
        group.add(ramp);

        // Top rail
        const rail = new THREE.Mesh(boxGeo(9, 0.8, 0.2), getToonMat(0x777777));
        rail.position.set(0, h + 0.4, 4);
        group.add(rail);

        return group;
    }

    // --- OFFICE TOWER ---
    function createOfficeTower() {
        const group = new THREE.Group();
        const h = rngFloat(30, 50);
        const color = rngPick(OFFICE_COLORS);

        const body = new THREE.Mesh(boxGeo(7, h, 7), getToonMat(color));
        body.position.y = h / 2;
        body.castShadow = true;
        group.add(body);

        // Glass curtain wall
        const glass = new THREE.Mesh(boxGeo(7.1, h * 0.9, 0.15), getToonMat(0x88bbdd));
        glass.position.set(0, h * 0.5, 3.6);
        group.add(glass);
        const glass2 = new THREE.Mesh(boxGeo(0.15, h * 0.9, 7.1), getToonMat(0x88bbdd));
        glass2.position.set(3.6, h * 0.5, 0);
        group.add(glass2);

        // Crown
        const crownH = 3;
        const crown = new THREE.Mesh(boxGeo(7.5, crownH, 7.5), getToonMat(0xcccccc));
        crown.position.y = h + crownH / 2;
        group.add(crown);

        // Antenna
        const antenna = new THREE.Mesh(cylGeo(0.08, 0.08, 5, 4), getToonMat(0xaaaaaa));
        antenna.position.y = h + crownH + 2.5;
        group.add(antenna);

        // Floor lines
        const floorCount = Math.floor(h / 3.5);
        for (let i = 1; i < floorCount; i++) {
            const lineY = i * 3.5;
            const line = new THREE.Mesh(boxGeo(7.15, 0.1, 7.15), getToonMat(0x222233));
            line.position.y = lineY;
            group.add(line);
        }

        addWindowGrid(group, 7, h, 7, 0x112244);
        addRooftopDetails(group, 7);
        return group;
    }

    // ── Detail Helpers ───────────────────────────────────────

    function addNeonSign(group, x, y, z, w, h, color) {
        const sign = new THREE.Mesh(boxGeo(w, h, 0.15), getNeonMat(color));
        sign.position.set(x, y, z);
        neonMeshes.push(sign);
        group.add(sign);
        return sign;
    }

    function addNeonCharacters(group, x, y, z, count) {
        // Fake Chinese characters: small neon rectangles arranged vertically
        const neonColor = rngPick(NEON_COLORS);
        for (let i = 0; i < count; i++) {
            const charW = rngFloat(0.6, 1.0);
            const charH = rngFloat(0.8, 1.2);
            const ch = new THREE.Mesh(boxGeo(charW, charH, 0.1), getNeonMat(neonColor));
            ch.position.set(x + (i - count / 2 + 0.5) * 1.3, y, z);
            neonMeshes.push(ch);
            group.add(ch);
            // Cross strokes
            if (rng() > 0.4) {
                const stroke = new THREE.Mesh(boxGeo(charW * 0.7, 0.12, 0.12), getNeonMat(neonColor));
                stroke.position.set(x + (i - count / 2 + 0.5) * 1.3, y + charH * 0.2, z + 0.05);
                neonMeshes.push(stroke);
                group.add(stroke);
            }
            if (rng() > 0.5) {
                const vStroke = new THREE.Mesh(boxGeo(0.12, charH * 0.6, 0.12), getNeonMat(neonColor));
                vStroke.position.set(x + (i - count / 2 + 0.5) * 1.3 + charW * 0.15, y - charH * 0.1, z + 0.05);
                neonMeshes.push(vStroke);
                group.add(vStroke);
            }
        }
    }

    function addWindowGrid(group, bw, bh, bd, windowColor) {
        // Add window-like dark rectangles as thin boxes on facades
        const ww = 0.6, wh = 0.9, gap = 2.2;
        const cols = Math.floor((bw - 1) / gap);
        const rows = Math.floor((bh - 2) / gap);
        const mat = getToonMat(windowColor || 0x111122);
        const startX = -(cols - 1) * gap / 2;

        // Front + Back faces
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const wx = startX + c * gap;
                const wy = 3 + r * gap;
                if (wy > bh - 1) continue;
                // Front
                const wf = new THREE.Mesh(boxGeo(ww, wh, 0.12), mat);
                wf.position.set(wx, wy, bd / 2 + 0.05);
                group.add(wf);
                // Back
                const wb = new THREE.Mesh(boxGeo(ww, wh, 0.12), mat);
                wb.position.set(wx, wy, -bd / 2 - 0.05);
                group.add(wb);
            }
        }

        // Side faces
        const sideCols = Math.floor((bd - 1) / gap);
        const startZ = -(sideCols - 1) * gap / 2;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < sideCols; c++) {
                const wz = startZ + c * gap;
                const wy = 3 + r * gap;
                if (wy > bh - 1) continue;
                const wl = new THREE.Mesh(boxGeo(0.12, wh, ww), mat);
                wl.position.set(bw / 2 + 0.05, wy, wz);
                group.add(wl);
                const wr = new THREE.Mesh(boxGeo(0.12, wh, ww), mat);
                wr.position.set(-bw / 2 - 0.05, wy, wz);
                group.add(wr);
            }
        }
    }

    function addScatteredWindows(group, bw, bh, bd) {
        // Lit windows (emissive) scattered on facades — gives life at night
        const mat = getNeonMat(0xffdd88);
        const count = rngInt(8, 18);
        for (let i = 0; i < count; i++) {
            const face = rngInt(0, 3);
            const wy = rngFloat(5, bh * 0.9);
            let wx, wz;
            const wSize = 0.5;
            if (face === 0) { wx = rngFloat(-bw / 2 + 1, bw / 2 - 1); wz = bd / 2 + 0.06; }
            else if (face === 1) { wx = rngFloat(-bw / 2 + 1, bw / 2 - 1); wz = -bd / 2 - 0.06; }
            else if (face === 2) { wz = rngFloat(-bd / 2 + 1, bd / 2 - 1); wx = bw / 2 + 0.06; }
            else { wz = rngFloat(-bd / 2 + 1, bd / 2 - 1); wx = -bw / 2 - 0.06; }
            const w = new THREE.Mesh(boxGeo(face < 2 ? wSize : 0.1, wSize, face >= 2 ? wSize : 0.1), mat);
            w.position.set(wx, wy, wz);
            neonMeshes.push(w);
            group.add(w);
        }
    }

    function addRooftopDetails(group, plotW) {
        // AC units, helipad, etc.
        const acCount = rngInt(1, 4);
        for (let i = 0; i < acCount; i++) {
            const ac = new THREE.Mesh(boxGeo(0.8, 0.5, 0.8), getToonMat(0x666666));
            // Find topmost child to place on roof
            let maxY = 10;
            group.children.forEach(c => {
                const top = c.position.y + (c.geometry && c.geometry.parameters ? c.geometry.parameters.height / 2 : 0);
                if (top > maxY) maxY = top;
            });
            ac.position.set(rngFloat(-plotW / 3, plotW / 3), maxY + 0.25, rngFloat(-plotW / 3, plotW / 3));
            group.add(ac);
        }

        // Helipad on taller buildings
        if (rng() > 0.6) {
            let maxY = 10;
            group.children.forEach(c => {
                const top = c.position.y + (c.geometry && c.geometry.parameters ? c.geometry.parameters.height / 2 : 0);
                if (top > maxY) maxY = top;
            });
            const pad = new THREE.Mesh(cylGeo(1.5, 1.5, 0.1, 12), getToonMat(0x666644));
            pad.position.set(0, maxY + 0.05, 0);
            group.add(pad);
            // H mark
            const hMark = new THREE.Mesh(boxGeo(0.8, 0.02, 0.15), getNeonMat(0xffff44));
            hMark.position.set(0, maxY + 0.12, 0);
            group.add(hMark);
        }
    }

    // ── Park / Green Space ───────────────────────────────────
    function createPark() {
        const group = new THREE.Group();

        // Green ground
        const ground = new THREE.Mesh(boxGeo(10, 0.3, 10), getToonMat(PARK_GREEN));
        ground.position.y = 0.15;
        group.add(ground);

        // Path
        const path = new THREE.Mesh(boxGeo(1.5, 0.05, 8), getToonMat(0x998877));
        path.position.y = 0.32;
        group.add(path);

        // Trees
        const treeCount = rngInt(3, 7);
        for (let i = 0; i < treeCount; i++) {
            const tx = rngFloat(-4, 4);
            const tz = rngFloat(-4, 4);
            // Avoid center path
            if (Math.abs(tx) < 1) continue;
            const trunkH = rngFloat(1.5, 3);
            const trunk = new THREE.Mesh(cylGeo(0.15, 0.2, trunkH, 5), getToonMat(TREE_TRUNK));
            trunk.position.set(tx, trunkH / 2 + 0.3, tz);
            group.add(trunk);
            const canopyR = rngFloat(0.8, 1.5);
            const canopy = new THREE.Mesh(cylGeo(0, canopyR, canopyR * 1.8, 6), getToonMat(TREE_LEAF));
            canopy.position.set(tx, trunkH + canopyR * 0.6 + 0.3, tz);
            canopy.castShadow = true;
            group.add(canopy);
        }

        // Bench
        const bench = new THREE.Mesh(boxGeo(1.5, 0.4, 0.4), getToonMat(0x664422));
        bench.position.set(2, 0.5, 0);
        group.add(bench);

        // Lamp
        const lampPole = new THREE.Mesh(cylGeo(0.05, 0.05, 3, 4), getToonMat(0x444444));
        lampPole.position.set(-3, 1.8, 3);
        group.add(lampPole);
        const lampHead = new THREE.Mesh(boxGeo(0.4, 0.2, 0.4), getNeonMat(0xffffcc));
        lampHead.position.set(-3, 3.4, 3);
        neonMeshes.push(lampHead);
        group.add(lampHead);

        return group;
    }

    // ── City Layout ──────────────────────────────────────────
    function determineBuildingType(gx, gz) {
        // gx, gz are grid coords from -HALF_GRID to HALF_GRID
        const dist = Math.max(Math.abs(gx), Math.abs(gz));

        // Center cluster: casinos
        if (dist <= 2) return 'casino';
        // Inner ring: hotels + offices + some casinos
        if (dist <= 4) {
            const r = rng();
            if (r < 0.15) return 'casino';
            if (r < 0.40) return 'hotel';
            if (r < 0.60) return 'office';
            if (r < 0.70) return 'temple';
            if (r < 0.80) return 'mall';
            return 'hotel';
        }
        // Mid ring: mixed
        if (dist <= 6) {
            const r = rng();
            if (r < 0.10) return 'park';
            if (r < 0.25) return 'hotel';
            if (r < 0.40) return 'office';
            if (r < 0.55) return 'residential';
            if (r < 0.70) return 'shop';
            if (r < 0.80) return 'mall';
            if (r < 0.88) return 'parking';
            return 'temple';
        }
        // Outer ring: residential + shops + parks
        const r = rng();
        if (r < 0.08) return 'park';
        if (r < 0.30) return 'residential';
        if (r < 0.50) return 'shop';
        if (r < 0.65) return 'parking';
        if (r < 0.78) return 'office';
        if (r < 0.85) return 'mall';
        return 'residential';
    }

    function createBuildingForType(type) {
        switch (type) {
            case 'casino':     return createCasino(rngInt(0, 3));
            case 'hotel':      return createHotel(rngInt(0, 2));
            case 'mall':       return createMall();
            case 'residential':return createResidential();
            case 'temple':     return createTemple();
            case 'shop':       return createNeonShop();
            case 'parking':    return createParkingGarage();
            case 'office':     return createOfficeTower();
            case 'park':       return createPark();
            default:           return createResidential();
        }
    }

    // ── Ground Plane + Roads ─────────────────────────────────
    function createGroundAndRoads(scene) {
        const cityGroup = new THREE.Group();
        cityGroup.name = 'ground_roads';

        // Large ground plane
        const groundSize = GRID_COUNT * CELL_SIZE + 40;
        const ground = new THREE.Mesh(
            boxGeo(groundSize, 0.5, groundSize),
            getToonMat(ASPHALT)
        );
        ground.position.y = -0.25;
        ground.receiveShadow = true;
        cityGroup.add(ground);

        // Road surfaces — horizontal and vertical streets
        const roadMat = getToonMat(ROAD);
        const markMat = getToonMat(LANE_MARK);
        const crossMat = getToonMat(CROSSWALK);

        // Compute road positions
        for (let i = 0; i <= GRID_COUNT; i++) {
            const pos = (i - HALF_GRID) * CELL_SIZE - CELL_SIZE / 2 + PLOT_SIZE + ROAD_WIDTH / 2;

            // Horizontal road (along X)
            const hRoad = new THREE.Mesh(
                boxGeo(groundSize, 0.06, ROAD_WIDTH),
                roadMat
            );
            hRoad.position.set(0, 0.03, pos);
            hRoad.receiveShadow = true;
            cityGroup.add(hRoad);

            // Vertical road (along Z)
            const vRoad = new THREE.Mesh(
                boxGeo(ROAD_WIDTH, 0.06, groundSize),
                roadMat
            );
            vRoad.position.set(pos, 0.03, 0);
            vRoad.receiveShadow = true;
            cityGroup.add(vRoad);

            // Lane markings — dashed center line
            const dashCount = Math.floor(groundSize / 4);
            for (let d = 0; d < dashCount; d++) {
                const dp = -groundSize / 2 + d * 4 + 1;

                // Horizontal road dashes
                const hDash = new THREE.Mesh(boxGeo(1.5, 0.01, 0.1), markMat);
                hDash.position.set(dp, 0.07, pos);
                cityGroup.add(hDash);

                // Vertical road dashes
                const vDash = new THREE.Mesh(boxGeo(0.1, 0.01, 1.5), markMat);
                vDash.position.set(pos, 0.07, dp);
                cityGroup.add(vDash);
            }
        }

        // Crosswalks at intersections (only every other intersection to reduce geometry)
        for (let ix = 0; ix <= GRID_COUNT; ix += 2) {
            for (let iz = 0; iz <= GRID_COUNT; iz += 2) {
                const cx = (ix - HALF_GRID) * CELL_SIZE - CELL_SIZE / 2 + PLOT_SIZE + ROAD_WIDTH / 2;
                const cz = (iz - HALF_GRID) * CELL_SIZE - CELL_SIZE / 2 + PLOT_SIZE + ROAD_WIDTH / 2;

                // Crosswalk stripes (4 stripes)
                for (let s = 0; s < 4; s++) {
                    const cw = new THREE.Mesh(boxGeo(0.3, 0.015, 1.8), crossMat);
                    cw.position.set(cx - 0.7 + s * 0.5, 0.075, cz);
                    cityGroup.add(cw);
                }
            }
        }

        // Sidewalk edges along roads
        const sidewalkMat = getToonMat(SIDEWALK);
        for (let i = 0; i <= GRID_COUNT; i++) {
            const pos = (i - HALF_GRID) * CELL_SIZE - CELL_SIZE / 2 + PLOT_SIZE + ROAD_WIDTH / 2;

            // Curbs for horizontal roads
            const curbH1 = new THREE.Mesh(boxGeo(groundSize, 0.15, 0.2), sidewalkMat);
            curbH1.position.set(0, 0.075, pos - ROAD_WIDTH / 2 - 0.1);
            cityGroup.add(curbH1);
            const curbH2 = new THREE.Mesh(boxGeo(groundSize, 0.15, 0.2), sidewalkMat);
            curbH2.position.set(0, 0.075, pos + ROAD_WIDTH / 2 + 0.1);
            cityGroup.add(curbH2);

            // Curbs for vertical roads
            const curbV1 = new THREE.Mesh(boxGeo(0.2, 0.15, groundSize), sidewalkMat);
            curbV1.position.set(pos - ROAD_WIDTH / 2 - 0.1, 0.075, 0);
            cityGroup.add(curbV1);
            const curbV2 = new THREE.Mesh(boxGeo(0.2, 0.15, groundSize), sidewalkMat);
            curbV2.position.set(pos + ROAD_WIDTH / 2 + 0.1, 0.075, 0);
            cityGroup.add(curbV2);
        }

        scene.add(cityGroup);
    }

    // ── Street Furniture (batched) ───────────────────────────
    function addStreetFurniture(scene) {
        const furnitureGroup = new THREE.Group();
        furnitureGroup.name = 'street_furniture';

        // Street lamps at intersections
        for (let ix = 0; ix <= GRID_COUNT; ix += 2) {
            for (let iz = 0; iz <= GRID_COUNT; iz += 2) {
                const cx = (ix - HALF_GRID) * CELL_SIZE - CELL_SIZE / 2 + PLOT_SIZE + ROAD_WIDTH / 2;
                const cz = (iz - HALF_GRID) * CELL_SIZE - CELL_SIZE / 2 + PLOT_SIZE + ROAD_WIDTH / 2;

                // Lamp post
                const pole = new THREE.Mesh(cylGeo(0.06, 0.06, 4, 4), getToonMat(0x444444));
                pole.position.set(cx + 1.5, 2, cz + 1.5);
                furnitureGroup.add(pole);

                const lamp = new THREE.Mesh(boxGeo(0.4, 0.15, 0.4), getNeonMat(0xffffaa));
                lamp.position.set(cx + 1.5, 4.1, cz + 1.5);
                neonMeshes.push(lamp);
                furnitureGroup.add(lamp);
            }
        }

        scene.add(furnitureGroup);
    }

    // ── Main Build ───────────────────────────────────────────
    function buildCity(scene) {
        // Reset RNG for determinism
        seed = 42;

        // Ground & roads
        createGroundAndRoads(scene);

        // Buildings
        const buildingGroup = new THREE.Group();
        buildingGroup.name = 'buildings';

        let buildingCount = 0;
        for (let gx = -HALF_GRID; gx <= HALF_GRID; gx++) {
            for (let gz = -HALF_GRID; gz <= HALF_GRID; gz++) {
                const type = determineBuildingType(gx, gz);
                const building = createBuildingForType(type);

                // Position on grid
                const worldX = gx * CELL_SIZE;
                const worldZ = gz * CELL_SIZE;
                building.position.set(worldX, 0, worldZ);

                // Random rotation (90-degree increments) for variety
                const rot = rngInt(0, 3) * Math.PI / 2;
                building.rotation.y = rot;

                buildingGroup.add(building);
                buildingCount++;
            }
        }

        scene.add(buildingGroup);

        // Street furniture
        addStreetFurniture(scene);

        console.log(
            `%c Baccarat City %c ${buildingCount} buildings placed, ${neonMeshes.length} neon elements `,
            'background:#d4af37;color:#0a0a12;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;',
            'background:#0a0a12;color:#d4af37;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0;'
        );
    }

    // ── Module Interface ─────────────────────────────────────
    function init({ scene, camera, renderer, THREE: three }) {
        THREE = three;
        buildCity(scene);
    }

    function update(dt, elapsed) {
        // Pulse neon signs — vary intensity with sine wave
        // We group neon meshes and vary their color brightness
        const pulse = 0.85 + 0.15 * Math.sin(elapsed * 2.5);
        const fastPulse = 0.8 + 0.2 * Math.sin(elapsed * 5.0);
        const slowPulse = 0.9 + 0.1 * Math.sin(elapsed * 1.2);

        for (let i = 0; i < neonMeshes.length; i++) {
            const mesh = neonMeshes[i];
            if (!mesh.material) continue;

            // Alternate between pulse speeds based on index for variety
            const t = i % 3 === 0 ? fastPulse : i % 3 === 1 ? pulse : slowPulse;

            // Scale the base color
            const baseColor = mesh.material.color;
            const r = baseColor.r, g = baseColor.g, b = baseColor.b;
            // We only need to set intensity — for BasicMaterial we modulate color
            // Store original color on first run
            if (!mesh.userData._baseR) {
                mesh.userData._baseR = r;
                mesh.userData._baseG = g;
                mesh.userData._baseB = b;
            }
            mesh.material.color.setRGB(
                mesh.userData._baseR * t,
                mesh.userData._baseG * t,
                mesh.userData._baseB * t
            );
        }
    }

    // ── Register ─────────────────────────────────────────────
    window.BACCARAT.registerModule({ init, update });

})();
