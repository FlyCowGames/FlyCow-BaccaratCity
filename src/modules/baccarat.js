// ============================================================
// Baccarat City — Baccarat Tables Module
// ============================================================
// Signature feature: 3D baccarat tables with card dealing
// animations, chip stacks, seated players, and warm lighting.
// Uses the module registration system from core-engine.
// ============================================================

(function () {
    'use strict';

    let THREE;

    // ── Palette ────────────────────────────────────────────────
    const FELT_GREEN   = 0x1a6b3a;
    const DARK_WOOD    = 0x3a2211;
    const BUMPER_BROWN = 0x5a3a1a;
    const CARD_WHITE   = 0xeeeeff;
    const CARD_BACK    = 0x2244aa;
    const LAMP_GOLD    = 0xd4af37;

    const CHIP_COLORS  = [0xcc2233, 0x22aa44, 0x222222, 0xd4af37];
    const PLAYER_SHIRT_COLORS = [
        0xcc3344, 0x3366bb, 0x44aa55, 0xcc9933, 0x9944aa, 0x44aaaa, 0xdd6633, 0x6644aa
    ];
    const SKIN_COLOR   = 0xdcb996;
    const DEALER_VEST  = 0x111111;
    const DEALER_SHIRT = 0xeeeeee;

    // ── Easing ─────────────────────────────────────────────────
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    // ── Material cache ─────────────────────────────────────────
    const matCache = new Map();
    function getMat(color) {
        if (matCache.has(color)) return matCache.get(color);
        const m = new THREE.MeshToonMaterial({ color });
        matCache.set(color, m);
        return m;
    }

    // ── State durations (seconds) ──────────────────────────────
    const STATE_IDLE    = 0;
    const STATE_DEAL    = 1;
    const STATE_REVEAL  = 2;
    const STATE_RESULT  = 3;
    const STATE_CLEAR   = 4;
    const DURATIONS = [2.0, 2.0, 1.0, 2.0, 1.0]; // per state
    const CYCLE_TOTAL = DURATIONS.reduce((a, b) => a + b, 0); // 8s

    // ── Table layout constants ─────────────────────────────────
    const TABLE_W = 3.0;
    const TABLE_D = 1.5;
    const TABLE_H = 0.9;
    const TABLE_TOP_Y = TABLE_H;
    const LEG_RADIUS = 0.06;
    const LEG_HEIGHT = TABLE_H - 0.05;

    // Card positions relative to table center (on top surface)
    // Player cards on left, Banker on right
    const CARD_Y = TABLE_TOP_Y + 0.002;
    const PLAYER_CARD_POSITIONS = [
        { x: -0.5, z: 0.0 },
        { x: -0.3, z: 0.0 },
        { x: -0.1, z: 0.0 },
    ];
    const BANKER_CARD_POSITIONS = [
        { x: 0.1, z: 0.0 },
        { x: 0.3, z: 0.0 },
        { x: 0.5, z: 0.0 },
    ];
    const DEALER_POS_LOCAL = { x: 0, z: -TABLE_D * 0.55 };
    const CARD_WIDTH  = 0.06;
    const CARD_THICK  = 0.001;
    const CARD_HEIGHT = 0.08;

    // ── Table placement positions ──────────────────────────────
    // Two clusters in the central casino area
    const TABLE_POSITIONS = [
        // Cluster A (slightly southwest of center)
        { x: -8, z: -4 },
        { x: -5, z: -3 },
        { x: -8, z: -1 },
        { x: -5, z:  0 },
        // Cluster B (slightly northeast of center)
        { x:  4, z: -5 },
        { x:  7, z: -4 },
        { x:  4, z: -2 },
        { x:  7, z: -1 },
    ];

    // ── Shared geometry (created once in init) ─────────────────
    let geoTableTop, geoTableBumper, geoTableLeg;
    let geoCard, geoChip;
    let geoPlayerBody, geoPlayerHead;

    // ── All tables ─────────────────────────────────────────────
    const tables = [];

    // ── Create shared geometries ───────────────────────────────
    function createGeometries() {
        // Table top — squashed cylinder for oval look
        geoTableTop = new THREE.CylinderGeometry(1, 1, 0.05, 32);
        // Bumper ring
        geoTableBumper = new THREE.TorusGeometry(1, 0.04, 8, 32);
        // Table leg
        geoTableLeg = new THREE.CylinderGeometry(LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT, 8);
        // Card
        geoCard = new THREE.BoxGeometry(CARD_WIDTH, CARD_THICK, CARD_HEIGHT);
        // Chip
        geoChip = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
        // Player body
        geoPlayerBody = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
        // Player head
        geoPlayerHead = new THREE.SphereGeometry(0.12, 8, 8);
    }

    // ── Build a single baccarat table ──────────────────────────
    function createTable(scene, pos, index) {
        const group = new THREE.Group();
        group.position.set(pos.x, 0, pos.z);

        // -- Table top (oval via scale) --
        const topMesh = new THREE.Mesh(geoTableTop, getMat(FELT_GREEN));
        topMesh.scale.set(TABLE_W * 0.5, 1, TABLE_D * 0.5);
        topMesh.position.y = TABLE_TOP_Y;
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        group.add(topMesh);

        // -- Bumper --
        const bumperMesh = new THREE.Mesh(geoTableBumper, getMat(BUMPER_BROWN));
        bumperMesh.rotation.x = Math.PI / 2;
        bumperMesh.scale.set(TABLE_W * 0.5, TABLE_D * 0.5, 1);
        bumperMesh.position.y = TABLE_TOP_Y + 0.02;
        bumperMesh.castShadow = true;
        group.add(bumperMesh);

        // -- Legs --
        const legOffsets = [
            { x: -TABLE_W * 0.35, z: -TABLE_D * 0.3 },
            { x:  TABLE_W * 0.35, z: -TABLE_D * 0.3 },
            { x: -TABLE_W * 0.35, z:  TABLE_D * 0.3 },
            { x:  TABLE_W * 0.35, z:  TABLE_D * 0.3 },
        ];
        for (const lo of legOffsets) {
            const leg = new THREE.Mesh(geoTableLeg, getMat(DARK_WOOD));
            leg.position.set(lo.x, LEG_HEIGHT / 2, lo.z);
            leg.castShadow = true;
            group.add(leg);
        }

        // -- Dealer figure --
        const dealer = createFigure(DEALER_VEST, DEALER_SHIRT);
        dealer.position.set(DEALER_POS_LOCAL.x, 0, DEALER_POS_LOCAL.z);
        group.add(dealer);

        // -- Player figures (5-6 around the curved side) --
        const numPlayers = 4 + Math.floor(Math.random() * 3); // 4-6
        const playerFigures = [];
        for (let i = 0; i < numPlayers; i++) {
            const angle = Math.PI * 0.15 + (Math.PI * 0.7) * (i / (numPlayers - 1));
            const px = Math.cos(angle) * TABLE_W * 0.55;
            const pz = Math.sin(angle) * TABLE_D * 0.6;
            const color = PLAYER_SHIRT_COLORS[i % PLAYER_SHIRT_COLORS.length];
            const fig = createFigure(color);
            fig.position.set(px, 0, pz);
            // Face toward table center
            fig.lookAt(new THREE.Vector3(pos.x, 0, pos.z));
            fig.rotation.x = 0;
            fig.rotation.z = 0;
            group.add(fig);
            playerFigures.push(fig);
        }

        // -- Cards (start hidden, animated during deal) --
        const playerCards = [];
        const bankerCards = [];
        const numPlayerCards = Math.random() < 0.3 ? 3 : 2;
        const numBankerCards = Math.random() < 0.3 ? 3 : 2;

        for (let i = 0; i < numPlayerCards; i++) {
            const card = createCard(true); // face-down
            const cpos = PLAYER_CARD_POSITIONS[i];
            card.userData.targetX = cpos.x;
            card.userData.targetZ = cpos.z;
            card.userData.targetY = CARD_Y + i * 0.002;
            card.position.set(DEALER_POS_LOCAL.x, CARD_Y, DEALER_POS_LOCAL.z);
            card.visible = false;
            group.add(card);
            playerCards.push(card);
        }
        for (let i = 0; i < numBankerCards; i++) {
            const card = createCard(true);
            const cpos = BANKER_CARD_POSITIONS[i];
            card.userData.targetX = cpos.x;
            card.userData.targetZ = cpos.z;
            card.userData.targetY = CARD_Y + i * 0.002;
            card.position.set(DEALER_POS_LOCAL.x, CARD_Y, DEALER_POS_LOCAL.z);
            card.visible = false;
            group.add(card);
            bankerCards.push(card);
        }

        // -- Chips --
        const chipStacks = [];
        const numChipStacks = 2 + Math.floor(Math.random() * 3); // 2-4
        for (let i = 0; i < numChipStacks; i++) {
            const stackHeight = 1 + Math.floor(Math.random() * 4);
            const chipColor = CHIP_COLORS[i % CHIP_COLORS.length];
            const stack = createChipStack(stackHeight, chipColor);
            // Random position on table surface
            const angle = Math.random() * Math.PI * 2;
            const r = 0.2 + Math.random() * 0.5;
            stack.position.set(
                Math.cos(angle) * r,
                TABLE_TOP_Y + 0.025,
                Math.sin(angle) * r * 0.5
            );
            group.add(stack);
            chipStacks.push({
                mesh: stack,
                baseScale: 1,
                isWinning: Math.random() < 0.5
            });
        }

        // -- Table lamp (point light) --
        const lamp = new THREE.PointLight(LAMP_GOLD, 0.5, 5);
        lamp.position.set(0, TABLE_TOP_Y + 2, 0);
        lamp.castShadow = false;
        group.add(lamp);

        scene.add(group);

        // -- Table state object --
        const cycleOffset = Math.random() * CYCLE_TOTAL;
        return {
            group,
            playerCards,
            bankerCards,
            chipStacks,
            playerFigures,
            dealer,
            lamp,
            state: STATE_IDLE,
            stateTime: 0,
            cycleOffset,
            totalTime: cycleOffset,
            cardsDealt: false,
            cardsRevealed: false,
            resultApplied: false,
            clearStarted: false,
        };
    }

    // ── Create a human figure ──────────────────────────────────
    function createFigure(bodyColor, shirtColor) {
        const fig = new THREE.Group();

        // Body
        const body = new THREE.Mesh(geoPlayerBody, getMat(bodyColor));
        body.position.y = 0.55; // seated height
        body.castShadow = true;
        fig.add(body);

        // Shirt accent (if dealer has white shirt under vest)
        if (shirtColor !== undefined) {
            const shirt = new THREE.Mesh(
                new THREE.CylinderGeometry(0.13, 0.14, 0.15, 8),
                getMat(shirtColor)
            );
            shirt.position.y = 0.72;
            fig.add(shirt);
        }

        // Head
        const head = new THREE.Mesh(geoPlayerHead, getMat(SKIN_COLOR));
        head.position.y = 0.95;
        head.castShadow = true;
        fig.add(head);

        return fig;
    }

    // ── Create a card mesh ─────────────────────────────────────
    function createCard(faceDown) {
        const mat = faceDown ? getMat(CARD_BACK) : getMat(CARD_WHITE);
        const card = new THREE.Mesh(geoCard, mat);
        card.castShadow = true;
        card.userData.faceDown = faceDown;
        card.userData.flipProgress = 0;
        card.userData.dealProgress = 0;
        return card;
    }

    // ── Create a chip stack ────────────────────────────────────
    function createChipStack(height, color) {
        const stack = new THREE.Group();
        for (let i = 0; i < height; i++) {
            const chip = new THREE.Mesh(geoChip, getMat(color));
            chip.position.y = i * 0.03;
            chip.castShadow = true;
            stack.add(chip);
        }
        return stack;
    }

    // ── Reset table for a new round ────────────────────────────
    function resetTable(t) {
        t.cardsDealt = false;
        t.cardsRevealed = false;
        t.resultApplied = false;
        t.clearStarted = false;

        // Reset cards to dealer position, hidden
        const allCards = t.playerCards.concat(t.bankerCards);
        for (const c of allCards) {
            c.visible = false;
            c.position.set(DEALER_POS_LOCAL.x, CARD_Y, DEALER_POS_LOCAL.z);
            c.rotation.set(0, 0, 0);
            c.userData.dealProgress = 0;
            c.userData.flipProgress = 0;
            c.userData.faceDown = true;
            c.material = getMat(CARD_BACK);
        }

        // Reset chip scales
        for (const cs of t.chipStacks) {
            cs.mesh.scale.setScalar(cs.baseScale);
            cs.isWinning = Math.random() < 0.5;
        }
    }

    // ── Compute which state we're in based on elapsed time ─────
    function getStateFromTime(elapsed) {
        let t = elapsed % CYCLE_TOTAL;
        let accumulated = 0;
        for (let i = 0; i < DURATIONS.length; i++) {
            accumulated += DURATIONS[i];
            if (t < accumulated) {
                return { state: i, stateTime: t - (accumulated - DURATIONS[i]) };
            }
        }
        return { state: 0, stateTime: 0 };
    }

    // ── Update a single table ──────────────────────────────────
    function updateTable(t, deltaTime, elapsedTime) {
        t.totalTime += deltaTime;
        const { state, stateTime } = getStateFromTime(t.totalTime);
        const prevState = t.state;
        t.state = state;
        t.stateTime = stateTime;

        // Detect state transitions
        if (state === STATE_IDLE && prevState === STATE_CLEAR) {
            resetTable(t);
        }

        const allCards = t.playerCards.concat(t.bankerCards);

        switch (state) {
            case STATE_IDLE:
                // Players idle — subtle breathing via figures
                for (let i = 0; i < t.playerFigures.length; i++) {
                    const fig = t.playerFigures[i];
                    const breathe = Math.sin(elapsedTime * 2 + i * 1.3) * 0.01;
                    fig.position.y = breathe;
                }
                break;

            case STATE_DEAL: {
                // Make cards visible and animate them sliding from dealer to positions
                const totalCards = allCards.length;
                for (let i = 0; i < totalCards; i++) {
                    const card = allCards[i];
                    card.visible = true;

                    // Stagger: each card starts dealing 0.25s after the previous
                    const cardDelay = i * 0.25;
                    const cardDuration = 0.5;

                    if (stateTime >= cardDelay) {
                        const progress = Math.min(1, (stateTime - cardDelay) / cardDuration);
                        const eased = easeOutCubic(progress);
                        card.userData.dealProgress = eased;

                        // Lerp from dealer position to target
                        const tx = card.userData.targetX;
                        const tz = card.userData.targetZ;
                        const ty = card.userData.targetY;
                        card.position.x = DEALER_POS_LOCAL.x + (tx - DEALER_POS_LOCAL.x) * eased;
                        card.position.z = DEALER_POS_LOCAL.z + (tz - DEALER_POS_LOCAL.z) * eased;
                        card.position.y = CARD_Y + (ty - CARD_Y) * eased;

                        // Slight arc: raise in the middle of travel
                        const arc = Math.sin(progress * Math.PI) * 0.15;
                        card.position.y += arc;
                    }
                }
                break;
            }

            case STATE_REVEAL: {
                // Flip cards face-up by rotating on X axis
                for (let i = 0; i < allCards.length; i++) {
                    const card = allCards[i];
                    const flipDelay = i * 0.12;
                    const flipDuration = 0.4;

                    if (stateTime >= flipDelay) {
                        const progress = Math.min(1, (stateTime - flipDelay) / flipDuration);
                        const eased = easeInOutQuad(progress);
                        card.userData.flipProgress = eased;
                        card.rotation.x = eased * Math.PI;

                        // Swap material at halfway point
                        if (eased >= 0.5 && card.userData.faceDown) {
                            card.material = getMat(CARD_WHITE);
                            card.userData.faceDown = false;
                        }

                        // Small bounce up during flip
                        const bounce = Math.sin(progress * Math.PI) * 0.06;
                        card.position.y = card.userData.targetY + bounce;
                    }
                }
                break;
            }

            case STATE_RESULT: {
                // Winning chips grow, losing chips shrink
                const pulse = 1 + Math.sin(stateTime * 6) * 0.15;
                for (const cs of t.chipStacks) {
                    if (cs.isWinning) {
                        const targetScale = cs.baseScale * pulse * 1.3;
                        cs.mesh.scale.lerp(
                            new THREE.Vector3(targetScale, targetScale, targetScale),
                            0.1
                        );
                    } else {
                        const shrink = Math.max(0.3, 1 - stateTime * 0.4);
                        cs.mesh.scale.setScalar(cs.baseScale * shrink);
                    }
                }

                // Warm up the lamp during result
                t.lamp.intensity = 0.5 + Math.sin(stateTime * 4) * 0.2;
                break;
            }

            case STATE_CLEAR: {
                // Cards slide off the table edge
                const clearDuration = DURATIONS[STATE_CLEAR];
                const progress = Math.min(1, stateTime / (clearDuration * 0.8));
                const eased = easeOutCubic(progress);

                for (let i = 0; i < allCards.length; i++) {
                    const card = allCards[i];
                    // Slide cards toward +X (off the table)
                    const slideOffset = eased * 3.0;
                    card.position.x = card.userData.targetX + slideOffset;
                    card.position.y = card.userData.targetY - eased * 0.3;

                    // Fade by scaling down
                    const fadeScale = 1 - eased * 0.5;
                    card.scale.setScalar(Math.max(0.01, fadeScale));
                }

                // Reset lamp
                t.lamp.intensity = 0.5;

                // Reset chip scales smoothly
                for (const cs of t.chipStacks) {
                    cs.mesh.scale.lerp(
                        new THREE.Vector3(cs.baseScale, cs.baseScale, cs.baseScale),
                        0.1
                    );
                }
                break;
            }
        }
    }

    // ── Module interface ───────────────────────────────────────
    function init({ scene, camera, renderer, THREE: three }) {
        THREE = three;
        createGeometries();

        for (let i = 0; i < TABLE_POSITIONS.length; i++) {
            const t = createTable(scene, TABLE_POSITIONS[i], i);
            tables.push(t);
        }
    }

    function update(deltaTime, elapsedTime) {
        for (const t of tables) {
            updateTable(t, deltaTime, elapsedTime);
        }
    }

    // ── Register ───────────────────────────────────────────────
    if (window.BACCARAT && window.BACCARAT.registerModule) {
        window.BACCARAT.registerModule({ init, update });
    } else {
        // Fallback: wait for BACCARAT global
        const check = setInterval(() => {
            if (window.BACCARAT && window.BACCARAT.registerModule) {
                clearInterval(check);
                window.BACCARAT.registerModule({ init, update });
            }
        }, 100);
    }
})();
