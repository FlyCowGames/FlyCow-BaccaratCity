// ============================================================
// Baccarat City — Interaction Module
// ============================================================
// Click-to-zoom on buildings, click-to-watch baccarat tables,
// hover tooltips with Chinese/English names, cursor changes,
// raycasting hit detection, and smooth camera transitions.
// ============================================================

(function () {
    'use strict';

    let THREE;
    let scene;
    let rendererDom;

    // ── Building Name Database ────────────────────────────────
    const NAME_DB = {
        casino: [
            '永利皇宮 · Wynn Palace',
            '新葡京 · Grand Lisboa',
            '威尼斯人 · The Venetian',
            '金沙城 · Sands City',
            '美高梅 · MGM Macau',
            '銀河 · Galaxy',
            '新濠天地 · City of Dreams',
            '星際 · StarWorld',
        ],
        hotel: [
            '澳門四季 · Four Seasons',
            '瑞吉 · St. Regis',
            '康萊德 · Conrad',
            '悅榕莊 · Banyan Tree',
            '文華東方 · Mandarin Oriental',
        ],
        mall: [
            '大運河 · Grand Canal',
            '金光大道 · Cotai Strip',
            '百老匯 · Broadway',
            '新八佰伴 · New Yaohan',
        ],
        shop: [
            '大運河 · Grand Canal',
            '金光大道 · Cotai Strip',
            '百老匯 · Broadway',
            '新八佰伴 · New Yaohan',
        ],
        temple: [
            '媽閣廟 · A-Ma Temple',
            '觀音堂 · Kun Iam Temple',
            '蓮峰廟 · Lin Fong Temple',
        ],
        residential: [
            '海景花園 · Harbour View',
            '金碧花園 · Golden Court',
            '湖畔雅居 · Lakeside Manor',
            '翠苑 · Green Garden',
            '新城大廈 · Nova Tower',
        ],
        office: [
            '國際商務中心 · Int\'l Business Centre',
            '金融大廈 · Finance Tower',
            '中銀大廈 · Bank of China Building',
            '貿易中心 · Trade Centre',
        ],
        parking: [
            '公共停車場 · Public Car Park',
            '立體車場 · Multi-Storey Parking',
        ],
        park: [
            '公園 · City Garden',
            '花園 · Botanical Park',
            '休憩區 · Rest Area',
        ],
    };

    const TYPE_EMOJI = {
        casino: '\u{1F3B0}',
        hotel: '\u{1F3E8}',
        mall: '\u{1F6CD}\uFE0F',
        shop: '\u{1F6CD}\uFE0F',
        temple: '\u{1F3DB}\uFE0F',
        residential: '\u{1F3E0}',
        office: '\u{1F3E2}',
        parking: '\u{1F17F}\uFE0F',
        park: '\u{1F333}',
    };

    // ── Grid constants (must match city-geometry) ─────────────
    const PLOT_SIZE  = 10;
    const ROAD_WIDTH = 2;
    const CELL_SIZE  = PLOT_SIZE + ROAD_WIDTH; // 12
    const GRID_COUNT = 17;
    const HALF_GRID  = Math.floor(GRID_COUNT / 2); // 8

    // ── State ─────────────────────────────────────────────────
    const raycaster = new (function() { this._lazy = null; })();
    let raycasterObj;
    const mouse = { x: 0, y: 0 };  // NDC coordinates
    const mouseScreen = { x: 0, y: 0 }; // pixel coordinates

    let hoveredBuilding = null;
    let previousHovered = null;
    let hoveredOriginalColors = [];  // {mesh, originalColor}

    // Camera transition state
    const MODE_FREE = 0;
    const MODE_BUILDING_ZOOM = 1;
    const MODE_TABLE_WATCH = 2;
    let interactionMode = MODE_FREE;

    // Saved camera state for returning
    let savedCameraPosition = null;
    let savedCameraRotation = null;
    let savedCameraLeft = 0;
    let savedCameraRight = 0;
    let savedCameraTop = 0;
    let savedCameraBottom = 0;
    let savedFrustumHalf = 120;

    // Transition animation
    let transitioning = false;
    let transitionStart = 0;
    let transitionDuration = 1.5;
    let transitionFrom = { pos: null, rot: null };
    let transitionTo = { pos: null, lookAt: null };
    let transitionCallback = null;

    // Building zoom orbit
    let orbitTarget = null;
    let orbitAngle = 0;
    let orbitRadius = 20;
    let orbitHeight = 15;
    let orbitSpeed = 0.3;

    // Table watch state
    let watchingTable = null;
    let tableOrbitAngle = 0;

    // Click vs drag detection
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;
    const CLICK_THRESHOLD = 5;  // pixels
    const CLICK_TIME_THRESHOLD = 300; // ms

    // Name assignment counters (per type)
    const nameCounters = {};

    // ── HTML Elements ─────────────────────────────────────────
    let tooltipEl = null;
    let backButton = null;
    let baccaratHUD = null;

    function createTooltip() {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'interaction-tooltip';
        tooltipEl.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 100;
            padding: 10px 14px;
            background: rgba(10,10,18,0.9);
            border: 1px solid rgba(212,175,55,0.3);
            border-radius: 6px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: none;
            max-width: 260px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.1);
            transition: opacity 0.15s ease;
        `;
        document.body.appendChild(tooltipEl);
    }

    function createBackButton() {
        backButton = document.createElement('button');
        backButton.id = 'interaction-back';
        backButton.innerHTML = '\u2190 Back to City';
        backButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 100;
            padding: 10px 20px;
            background: rgba(10,10,18,0.9);
            border: 1px solid rgba(212,175,55,0.4);
            border-radius: 4px;
            color: #d4af37;
            font-family: 'DM Mono', monospace;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0.1em;
            cursor: pointer;
            display: none;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.2s ease;
            box-shadow: 0 2px 12px rgba(0,0,0,0.4);
            pointer-events: auto;
        `;
        backButton.addEventListener('mouseenter', function () {
            backButton.style.background = 'rgba(212,175,55,0.15)';
            backButton.style.borderColor = 'rgba(212,175,55,0.7)';
        });
        backButton.addEventListener('mouseleave', function () {
            backButton.style.background = 'rgba(10,10,18,0.9)';
            backButton.style.borderColor = 'rgba(212,175,55,0.4)';
        });
        backButton.addEventListener('click', returnToCity);
        document.body.appendChild(backButton);
    }

    function createBaccaratHUD() {
        baccaratHUD = document.createElement('div');
        baccaratHUD.id = 'baccarat-hud';
        baccaratHUD.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            display: none;
            flex-direction: row;
            align-items: center;
            gap: 30px;
            padding: 16px 30px;
            background: rgba(10,10,18,0.9);
            border: 1px solid rgba(212,175,55,0.3);
            border-radius: 8px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 4px 24px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.08);
            font-family: 'DM Mono', monospace;
            pointer-events: auto;
        `;
        baccaratHUD.innerHTML = `
            <div style="text-align: center;">
                <div style="color: rgba(255,255,255,0.4); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px;">Player</div>
                <div id="baccarat-player-score" style="color: #d4af37; font-size: 28px; font-weight: 400; font-family: 'Cinzel', serif;">-</div>
            </div>
            <div style="color: rgba(212,175,55,0.3); font-size: 18px;">vs</div>
            <div style="text-align: center;">
                <div style="color: rgba(255,255,255,0.4); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px;">Banker</div>
                <div id="baccarat-banker-score" style="color: #d4af37; font-size: 28px; font-weight: 400; font-family: 'Cinzel', serif;">-</div>
            </div>
            <button id="baccarat-back-btn" style="
                margin-left: 20px;
                padding: 8px 16px;
                background: rgba(212,175,55,0.1);
                border: 1px solid rgba(212,175,55,0.3);
                border-radius: 4px;
                color: #d4af37;
                font-family: 'DM Mono', monospace;
                font-size: 10px;
                letter-spacing: 0.1em;
                cursor: pointer;
                transition: all 0.2s ease;
            ">Back to city</button>
        `;
        document.body.appendChild(baccaratHUD);

        const tableBackBtn = document.getElementById('baccarat-back-btn');
        if (tableBackBtn) {
            tableBackBtn.addEventListener('click', returnToCity);
            tableBackBtn.addEventListener('mouseenter', function () {
                tableBackBtn.style.background = 'rgba(212,175,55,0.2)';
                tableBackBtn.style.borderColor = 'rgba(212,175,55,0.6)';
            });
            tableBackBtn.addEventListener('mouseleave', function () {
                tableBackBtn.style.background = 'rgba(212,175,55,0.1)';
                tableBackBtn.style.borderColor = 'rgba(212,175,55,0.3)';
            });
        }
    }

    // ── Tooltip Management ────────────────────────────────────
    function showTooltip(building, screenX, screenY) {
        if (!tooltipEl) return;
        const ud = building.userData;
        const emoji = TYPE_EMOJI[ud.buildingType] || '';
        const name = ud.buildingName || '';
        const parts = name.split(' \u00b7 ');
        const chinese = parts[0] || '';
        const english = parts[1] || '';

        tooltipEl.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 2px;">${emoji}</div>
            <div style="font-family: 'Noto Sans SC', sans-serif; font-weight: 400; font-size: 14px; color: #d4af37; line-height: 1.4;">${chinese}</div>
            <div style="font-family: 'DM Mono', monospace; font-weight: 300; font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 0.05em; margin-top: 2px;">${english}</div>
        `;

        // Position with offset
        const offsetX = 18;
        const offsetY = 18;
        let x = screenX + offsetX;
        let y = screenY + offsetY;

        // Keep on screen
        const tipW = 260;
        const tipH = 80;
        if (x + tipW > window.innerWidth) x = screenX - tipW - 10;
        if (y + tipH > window.innerHeight) y = screenY - tipH - 10;

        tooltipEl.style.left = x + 'px';
        tooltipEl.style.top = y + 'px';
        tooltipEl.style.display = 'block';
    }

    function hideTooltip() {
        if (tooltipEl) tooltipEl.style.display = 'none';
    }

    // ── Building Type Detection ───────────────────────────────
    function detectBuildingType(group) {
        // Use position to determine type, matching city-geometry logic
        const gx = Math.round(group.position.x / CELL_SIZE);
        const gz = Math.round(group.position.z / CELL_SIZE);
        const dist = Math.max(Math.abs(gx), Math.abs(gz));

        if (dist <= 2) return 'casino';
        if (dist <= 4) {
            // Check height to differentiate
            let maxH = 0;
            group.traverse(function (c) {
                if (c.isMesh) {
                    const top = c.position.y + (c.geometry && c.geometry.parameters ? c.geometry.parameters.height / 2 : 0);
                    if (top > maxH) maxH = top;
                }
            });
            if (maxH > 40) return 'hotel';
            if (maxH < 15) return 'temple';
            return 'office';
        }
        if (dist <= 6) {
            let maxH = 0;
            group.traverse(function (c) {
                if (c.isMesh) {
                    const top = c.position.y + (c.geometry && c.geometry.parameters ? c.geometry.parameters.height / 2 : 0);
                    if (top > maxH) maxH = top;
                }
            });
            if (maxH < 2) return 'park';
            if (maxH < 12) return 'shop';
            if (maxH < 20) return 'residential';
            if (maxH < 25) return 'parking';
            return 'office';
        }
        // Outer
        let maxH = 0;
        group.traverse(function (c) {
            if (c.isMesh) {
                const top = c.position.y + (c.geometry && c.geometry.parameters ? c.geometry.parameters.height / 2 : 0);
                if (top > maxH) maxH = top;
            }
        });
        if (maxH < 2) return 'park';
        if (maxH < 12) return 'shop';
        if (maxH < 22) return 'residential';
        return 'parking';
    }

    function assignName(type) {
        const names = NAME_DB[type] || NAME_DB.residential;
        if (!nameCounters[type]) nameCounters[type] = 0;
        const idx = nameCounters[type] % names.length;
        nameCounters[type]++;
        return names[idx];
    }

    // ── Find Buildings Group ──────────────────────────────────
    let buildingsGroup = null;
    let buildingsInitialized = false;

    function findBuildings() {
        if (buildingsGroup) return;
        for (let i = 0; i < scene.children.length; i++) {
            const child = scene.children[i];
            if (child.name === 'buildings') {
                buildingsGroup = child;
                break;
            }
        }
    }

    function initBuildingNames() {
        if (!buildingsGroup || buildingsInitialized) return;
        buildingsInitialized = true;

        for (let i = 0; i < buildingsGroup.children.length; i++) {
            const building = buildingsGroup.children[i];
            if (!building.isGroup) continue;

            const type = detectBuildingType(building);
            building.userData.buildingType = type;
            building.userData.buildingName = assignName(type);
            building.userData.isBuilding = true;
        }
    }

    // ── Raycasting ────────────────────────────────────────────
    function getIntersectedBuilding(ndcX, ndcY) {
        if (!buildingsGroup) return null;

        const camera = window.BACCARAT.camera;
        if (!camera) return null;

        raycasterObj.setFromCamera({ x: ndcX, y: ndcY }, camera);

        // Collect all meshes from buildings group
        const meshes = [];
        buildingsGroup.traverse(function (child) {
            if (child.isMesh) meshes.push(child);
        });

        const intersects = raycasterObj.intersectObjects(meshes, false);
        if (intersects.length === 0) return null;

        // Walk up to find the building group
        let obj = intersects[0].object;
        while (obj && obj.parent !== buildingsGroup) {
            obj = obj.parent;
        }
        return obj;
    }

    function getIntersectedTable(ndcX, ndcY) {
        const camera = window.BACCARAT.camera;
        if (!camera) return null;

        raycasterObj.setFromCamera({ x: ndcX, y: ndcY }, camera);

        // Find baccarat table groups in the scene (they have PointLight children
        // and CylinderGeometry table tops with green material)
        const tableMeshes = [];
        scene.traverse(function (child) {
            if (child.isMesh && child.geometry &&
                child.geometry.type === 'CylinderGeometry' &&
                child.material && child.material.color) {
                // Check for felt green color (0x1a6b3a)
                const c = child.material.color;
                if (Math.abs(c.r - 0.102) < 0.05 &&
                    Math.abs(c.g - 0.420) < 0.05 &&
                    Math.abs(c.b - 0.227) < 0.05) {
                    tableMeshes.push(child);
                }
            }
        });

        const intersects = raycasterObj.intersectObjects(tableMeshes, false);
        if (intersects.length > 0) {
            // Return the table group (parent of the mesh)
            return intersects[0].object.parent;
        }

        // Also check for clicks near tables by casting against a broader area
        // Check proximity to known table positions
        const ray = raycasterObj.ray;
        const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.9);
        const hitPoint = new THREE.Vector3();
        if (ray.intersectPlane(ground, hitPoint)) {
            // Check if hit point is within 3 units of any table
            for (let i = 0; i < scene.children.length; i++) {
                const child = scene.children[i];
                if (!child.isGroup) continue;
                // Table groups have PointLights and are positioned at known coords
                let hasPointLight = false;
                let hasTableTop = false;
                child.traverse(function (c) {
                    if (c.isPointLight) hasPointLight = true;
                    if (c.isMesh && c.geometry && c.geometry.type === 'CylinderGeometry') {
                        const col = c.material && c.material.color;
                        if (col && Math.abs(col.r - 0.102) < 0.05 && Math.abs(col.g - 0.420) < 0.05) {
                            hasTableTop = true;
                        }
                    }
                });
                if (hasPointLight && hasTableTop) {
                    const dx = hitPoint.x - child.position.x;
                    const dz = hitPoint.z - child.position.z;
                    if (Math.sqrt(dx * dx + dz * dz) < 3) {
                        return child;
                    }
                }
            }
        }

        return null;
    }

    // ── Highlight System ──────────────────────────────────────
    function highlightBuilding(building) {
        if (building === hoveredBuilding) return;
        unhighlightBuilding();

        hoveredBuilding = building;
        hoveredOriginalColors = [];

        building.traverse(function (child) {
            if (child.isMesh && child.material && child.material.color) {
                // Store original
                hoveredOriginalColors.push({
                    mesh: child,
                    r: child.material.color.r,
                    g: child.material.color.g,
                    b: child.material.color.b,
                });
                // Brighten slightly
                child.material.color.r = Math.min(1, child.material.color.r * 1.3 + 0.05);
                child.material.color.g = Math.min(1, child.material.color.g * 1.3 + 0.05);
                child.material.color.b = Math.min(1, child.material.color.b * 1.3 + 0.05);
            }
        });
    }

    function unhighlightBuilding() {
        if (!hoveredBuilding) return;

        for (let i = 0; i < hoveredOriginalColors.length; i++) {
            const entry = hoveredOriginalColors[i];
            entry.mesh.material.color.r = entry.r;
            entry.mesh.material.color.g = entry.g;
            entry.mesh.material.color.b = entry.b;
        }

        hoveredOriginalColors = [];
        hoveredBuilding = null;
    }

    // ── Camera Transitions ────────────────────────────────────
    function saveCameraState() {
        const camera = window.BACCARAT.camera;
        if (!camera) return;

        savedCameraPosition = camera.position.clone();
        savedCameraRotation = camera.rotation.clone();
        if (camera.isOrthographicCamera) {
            savedCameraLeft = camera.left;
            savedCameraRight = camera.right;
            savedCameraTop = camera.top;
            savedCameraBottom = camera.bottom;
        }
    }

    function startTransition(targetPos, lookAtPos, duration, callback) {
        const camera = window.BACCARAT.camera;
        if (!camera) return;

        transitioning = true;
        transitionStart = performance.now() / 1000;
        transitionDuration = duration || 1.5;
        transitionFrom.pos = camera.position.clone();
        transitionFrom.rot = camera.rotation.clone();
        transitionTo.pos = targetPos.clone();
        transitionTo.lookAt = lookAtPos.clone();
        transitionCallback = callback || null;
    }

    function updateTransition(elapsed) {
        if (!transitioning) return;

        const camera = window.BACCARAT.camera;
        if (!camera) return;

        const now = performance.now() / 1000;
        let t = (now - transitionStart) / transitionDuration;
        if (t >= 1) {
            t = 1;
            transitioning = false;
        }

        // Ease in-out cubic
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Lerp position
        camera.position.lerpVectors(transitionFrom.pos, transitionTo.pos, eased);

        // LookAt the target
        if (transitionTo.lookAt) {
            camera.lookAt(transitionTo.lookAt);
        }

        camera.updateProjectionMatrix();

        if (t >= 1 && transitionCallback) {
            transitionCallback();
            transitionCallback = null;
        }
    }

    // ── Click-to-Zoom on Building ─────────────────────────────
    function zoomToBuilding(building) {
        if (interactionMode !== MODE_FREE) return;
        if (transitioning) return;

        saveCameraState();
        interactionMode = MODE_BUILDING_ZOOM;

        // Calculate building center and height
        const box = new THREE.Box3().setFromObject(building);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        orbitTarget = center.clone();
        orbitRadius = maxDim * 0.8 + 10;
        orbitHeight = size.y * 0.6 + 5;
        orbitAngle = 0;

        // Initial camera position for zoom
        const startAngle = Math.atan2(
            window.BACCARAT.camera.position.x - center.x,
            window.BACCARAT.camera.position.z - center.z
        );
        orbitAngle = startAngle;

        const targetPos = new THREE.Vector3(
            center.x + Math.sin(orbitAngle) * orbitRadius,
            center.y + orbitHeight,
            center.z + Math.cos(orbitAngle) * orbitRadius
        );

        startTransition(targetPos, center, 1.5, function () {
            // Show back button
            if (backButton) backButton.style.display = 'block';
        });

        // Convert camera to perspective-like view by tightening frustum
        const camera = window.BACCARAT.camera;
        if (camera.isOrthographicCamera) {
            const zoomFrustum = maxDim * 0.5 + 8;
            const aspect = window.innerWidth / window.innerHeight;
            camera.left = -zoomFrustum * aspect;
            camera.right = zoomFrustum * aspect;
            camera.top = zoomFrustum;
            camera.bottom = -zoomFrustum;
            camera.updateProjectionMatrix();
        }

        hideTooltip();
    }

    // ── Click-to-Watch Baccarat ───────────────────────────────
    function watchTable(tableGroup) {
        if (interactionMode !== MODE_FREE) return;
        if (transitioning) return;

        saveCameraState();
        interactionMode = MODE_TABLE_WATCH;
        watchingTable = tableGroup;
        tableOrbitAngle = 0;

        const tablePos = tableGroup.position.clone();
        const targetLookAt = tablePos.clone();
        targetLookAt.y = 0.9; // table top height

        const targetPos = new THREE.Vector3(
            tablePos.x + 3,
            2.5,
            tablePos.z + 3
        );

        startTransition(targetPos, targetLookAt, 1.5, function () {
            // Show baccarat HUD
            if (baccaratHUD) baccaratHUD.style.display = 'flex';
            if (backButton) backButton.style.display = 'block';
        });

        // Tighten frustum for close-up
        const camera = window.BACCARAT.camera;
        if (camera.isOrthographicCamera) {
            const zoomFrustum = 4;
            const aspect = window.innerWidth / window.innerHeight;
            camera.left = -zoomFrustum * aspect;
            camera.right = zoomFrustum * aspect;
            camera.top = zoomFrustum;
            camera.bottom = -zoomFrustum;
            camera.updateProjectionMatrix();
        }

        hideTooltip();
    }

    // ── Return to City View ───────────────────────────────────
    function returnToCity() {
        if (interactionMode === MODE_FREE) return;

        const camera = window.BACCARAT.camera;

        // Restore camera frustum
        if (camera.isOrthographicCamera && savedCameraLeft !== undefined) {
            camera.left = savedCameraLeft;
            camera.right = savedCameraRight;
            camera.top = savedCameraTop;
            camera.bottom = savedCameraBottom;
            camera.updateProjectionMatrix();
        }

        startTransition(savedCameraPosition, new THREE.Vector3(0, 0, 0), 1.2, function () {
            // Restore exact rotation
            camera.rotation.copy(savedCameraRotation);
            camera.updateProjectionMatrix();
        });

        interactionMode = MODE_FREE;
        watchingTable = null;
        orbitTarget = null;

        // Hide UI
        if (backButton) backButton.style.display = 'none';
        if (baccaratHUD) baccaratHUD.style.display = 'none';
    }

    // ── Input Handlers ────────────────────────────────────────
    function onPointerDown(e) {
        pointerDownPos.x = e.clientX;
        pointerDownPos.y = e.clientY;
        pointerDownTime = performance.now();
    }

    function onPointerUp(e) {
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const elapsed = performance.now() - pointerDownTime;

        // Only treat as click if minimal movement and short duration
        if (dist < CLICK_THRESHOLD && elapsed < CLICK_TIME_THRESHOLD) {
            handleClick(e);
        }
    }

    function handleClick(e) {
        if (transitioning) return;
        if (interactionMode !== MODE_FREE) return;

        // Convert to NDC
        const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
        const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Try table first (higher priority for click)
        const table = getIntersectedTable(ndcX, ndcY);
        if (table) {
            watchTable(table);
            return;
        }

        // Then try building
        const building = getIntersectedBuilding(ndcX, ndcY);
        if (building && building.userData.isBuilding) {
            zoomToBuilding(building);
            return;
        }
    }

    function onMouseMove(e) {
        mouseScreen.x = e.clientX;
        mouseScreen.y = e.clientY;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            if (interactionMode !== MODE_FREE) {
                returnToCity();
            }
        }
    }

    // ── Cursor Management ─────────────────────────────────────
    function updateCursor() {
        if (!rendererDom) return;
        if (interactionMode !== MODE_FREE) {
            document.body.style.cursor = 'default';
            return;
        }
        if (hoveredBuilding) {
            document.body.style.cursor = 'pointer';
        }
        // grab/grabbing handled by existing CSS on body
    }

    // ── Baccarat Score Simulation ─────────────────────────────
    let scoreUpdateTimer = 0;
    let playerScore = '-';
    let bankerScore = '-';

    function updateScoreDisplay() {
        const ps = document.getElementById('baccarat-player-score');
        const bs = document.getElementById('baccarat-banker-score');
        if (ps) ps.textContent = playerScore;
        if (bs) bs.textContent = bankerScore;
    }

    // ── Module Interface ──────────────────────────────────────
    function init(ctx) {
        THREE = ctx.THREE;
        scene = ctx.scene;
        rendererDom = ctx.renderer.domElement;

        raycasterObj = new THREE.Raycaster();

        // Create HTML overlays
        createTooltip();
        createBackButton();
        createBaccaratHUD();

        // Bind input (use capture on pointer events to detect clicks before pan system swallows them)
        rendererDom.addEventListener('pointerdown', onPointerDown, true);
        window.addEventListener('pointerup', onPointerUp, true);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);

        console.log(
            '%c Baccarat City %c Interaction Module Online ',
            'background:#d4af37;color:#0a0a12;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;',
            'background:#0a0a12;color:#d4af37;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0;'
        );
    }

    function update(dt, elapsed) {
        // Lazy find buildings (they may not exist at init time)
        if (!buildingsGroup) {
            findBuildings();
            if (buildingsGroup && !buildingsInitialized) {
                initBuildingNames();
            }
        }

        // Handle camera transitions
        if (transitioning) {
            updateTransition(elapsed);
            return; // Skip other updates during transition
        }

        const camera = window.BACCARAT.camera;
        if (!camera) return;

        // ── Building orbit mode ──
        if (interactionMode === MODE_BUILDING_ZOOM && orbitTarget) {
            orbitAngle += orbitSpeed * dt;
            const newX = orbitTarget.x + Math.sin(orbitAngle) * orbitRadius;
            const newZ = orbitTarget.z + Math.cos(orbitAngle) * orbitRadius;
            const newY = orbitTarget.y + orbitHeight;

            camera.position.set(newX, newY, newZ);
            camera.lookAt(orbitTarget);
            camera.updateProjectionMatrix();
            return;
        }

        // ── Table watch mode ──
        if (interactionMode === MODE_TABLE_WATCH && watchingTable) {
            tableOrbitAngle += 0.15 * dt;
            const tablePos = watchingTable.position;
            const watchR = 3.5;
            const newX = tablePos.x + Math.sin(tableOrbitAngle) * watchR;
            const newZ = tablePos.z + Math.cos(tableOrbitAngle) * watchR;

            camera.position.set(newX, 2.2, newZ);
            camera.lookAt(tablePos.x, 0.9, tablePos.z);
            camera.updateProjectionMatrix();

            // Update score display periodically
            scoreUpdateTimer += dt;
            if (scoreUpdateTimer > 2.0) {
                scoreUpdateTimer = 0;
                playerScore = String(Math.floor(Math.random() * 10));
                bankerScore = String(Math.floor(Math.random() * 10));
                updateScoreDisplay();
            }
            return;
        }

        // ── Free-roam hover detection ──
        if (interactionMode === MODE_FREE && buildingsGroup) {
            const building = getIntersectedBuilding(mouse.x, mouse.y);

            if (building && building.userData.isBuilding) {
                highlightBuilding(building);
                showTooltip(building, mouseScreen.x, mouseScreen.y);
            } else {
                unhighlightBuilding();
                hideTooltip();
            }

            // Also check table hover for cursor change
            if (!building) {
                const table = getIntersectedTable(mouse.x, mouse.y);
                if (table) {
                    document.body.style.cursor = 'pointer';
                } else {
                    // Restore default cursor (grab is in CSS)
                    if (!hoveredBuilding) {
                        document.body.style.cursor = '';
                    }
                }
            }
        }

        updateCursor();
    }

    // ── Register ──────────────────────────────────────────────
    if (window.BACCARAT && window.BACCARAT.registerModule) {
        window.BACCARAT.registerModule({ init, update });
    } else {
        const check = setInterval(function () {
            if (window.BACCARAT && window.BACCARAT.registerModule) {
                clearInterval(check);
                window.BACCARAT.registerModule({ init, update });
            }
        }, 100);
    }

})();
