// ============================================================
// Baccarat City — Core Engine & Scene Setup
// ============================================================
// Foundation module: Three.js scene, isometric camera, renderer,
// post-processing bloom pipeline, animation loop, input handling,
// and module registration system.
// ============================================================

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ── Constants ────────────────────────────────────────────────
const GOLD = 0xd4af37;
const DARK = 0x0a0a12;
const WORLD_SIZE = 200;            // city spans ~200x200 units
const FRUSTUM_BASE = 120;          // half-frustum at default zoom
const ZOOM_MIN = 30;
const ZOOM_MAX = 300;
const ZOOM_SPEED = 0.08;
const PAN_SPEED = 0.35;
const DAMP_FACTOR = 0.08;          // smooth-damp lerp factor

// ── State ────────────────────────────────────────────────────
let scene, camera, renderer, composer;
let clock;
let frustumHalf = FRUSTUM_BASE;
let aspect = 1;

// Smooth-damped values
const cameraTarget = new THREE.Vector3(0, 0, 0);   // where we want to look
const cameraOffset = new THREE.Vector3();            // current pan offset
const panVelocity = new THREE.Vector2(0, 0);
let zoomTarget = FRUSTUM_BASE;

// Input tracking
const pointer = { down: false, button: -1, x: 0, y: 0 };

// Module registry
const modules = [];

// ── Scene ────────────────────────────────────────────────────
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(DARK);
    scene.fog = new THREE.FogExp2(DARK, 0.003);

    // Ambient base light — cool blue tint
    const ambient = new THREE.AmbientLight(0x223355, 0.6);
    scene.add(ambient);

    // Key light — warm directional from upper-left
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(-80, 150, 60);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -WORLD_SIZE * 0.6;
    keyLight.shadow.camera.right = WORLD_SIZE * 0.6;
    keyLight.shadow.camera.top = WORLD_SIZE * 0.6;
    keyLight.shadow.camera.bottom = -WORLD_SIZE * 0.6;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 400;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill light — subtle from opposite side
    const fillLight = new THREE.DirectionalLight(0x8899cc, 0.4);
    fillLight.position.set(60, 80, -40);
    scene.add(fillLight);

    // Hemisphere sky/ground light
    const hemiLight = new THREE.HemisphereLight(0x1a1a2e, 0x0a0a0a, 0.3);
    scene.add(hemiLight);

    return scene;
}

// ── Camera (true isometric) ──────────────────────────────────
function createCamera() {
    aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.OrthographicCamera(
        -frustumHalf * aspect, frustumHalf * aspect,
        frustumHalf, -frustumHalf,
        0.1, 1000
    );

    // True isometric rotation
    // Rotate around Y by -45 deg, then tilt down by arctan(1/sqrt(2)) ~ 35.264 deg
    camera.rotation.order = 'YXZ';
    camera.rotateY(-Math.PI / 4);
    camera.rotateX(-Math.atan(1 / Math.sqrt(2)));

    // Position camera far enough along the isometric viewing direction
    // so the entire scene fits within the near/far planes.
    const isoDistance = 200;
    const dir = new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(isoDistance);
    camera.position.copy(dir);

    camera.updateProjectionMatrix();
    return camera;
}

// ── Renderer ─────────────────────────────────────────────────
function createRenderer(container) {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    return renderer;
}

// ── Post-Processing ──────────────────────────────────────────
function createPostProcessing() {
    const size = new THREE.Vector2(window.innerWidth, window.innerHeight);

    composer = new EffectComposer(renderer);

    // 1. Render pass — draws the scene normally
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 2. Bloom pass — neon glow on bright emissive surfaces
    const bloomPass = new UnrealBloomPass(size, 0.5, 0.4, 0.85);
    // strength=0.5, radius=0.4, threshold=0.85
    composer.addPass(bloomPass);

    // 3. Output pass — tone mapping + color space conversion
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Store reference for resize
    composer.bloomPass = bloomPass;

    return composer;
}

// ── Resize Handler ───────────────────────────────────────────
function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    aspect = w / h;

    camera.left = -frustumHalf * aspect;
    camera.right = frustumHalf * aspect;
    camera.top = frustumHalf;
    camera.bottom = -frustumHalf;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    composer.setSize(w, h);
}

// ── Input: Pan & Zoom ────────────────────────────────────────

// Convert screen-space drag delta into world-space pan.
// For an isometric camera the screen X maps to a combination
// of world X and Z, and screen Y maps to all three axes.
function screenToWorldPan(dx, dy) {
    // Build right & up vectors in world space from camera orientation
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    camera.getWorldDirection(new THREE.Vector3()); // just to ensure matrixWorld is current
    right.setFromMatrixColumn(camera.matrixWorld, 0); // camera right
    up.setFromMatrixColumn(camera.matrixWorld, 1);    // camera up

    // Scale by current frustum so pan speed feels consistent across zoom levels
    const scale = (frustumHalf * 2) / window.innerHeight * PAN_SPEED;

    const pan = new THREE.Vector3();
    pan.addScaledVector(right, -dx * scale);
    pan.addScaledVector(up, dy * scale);
    return pan;
}

function onPointerDown(e) {
    pointer.down = true;
    pointer.button = e.button;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
}

function onPointerMove(e) {
    if (!pointer.down) return;

    const dx = e.clientX - pointer.x;
    const dy = e.clientY - pointer.y;
    pointer.x = e.clientX;
    pointer.y = e.clientY;

    // Left-button or middle-button drag to pan
    if (pointer.button === 0 || pointer.button === 1) {
        const pan = screenToWorldPan(dx, dy);
        cameraOffset.add(pan);
    }
}

function onPointerUp() {
    pointer.down = false;
    pointer.button = -1;
}

function onWheel(e) {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    zoomTarget *= (1 + delta * ZOOM_SPEED);
    zoomTarget = THREE.MathUtils.clamp(zoomTarget, ZOOM_MIN, ZOOM_MAX);
}

function onContextMenu(e) {
    e.preventDefault(); // suppress right-click menu on canvas
}

function bindInput(domElement) {
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });
    domElement.addEventListener('contextmenu', onContextMenu);
}

// ── Animation Loop ───────────────────────────────────────────
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Smooth-damp zoom
    frustumHalf = THREE.MathUtils.lerp(frustumHalf, zoomTarget, DAMP_FACTOR);
    camera.left = -frustumHalf * aspect;
    camera.right = frustumHalf * aspect;
    camera.top = frustumHalf;
    camera.bottom = -frustumHalf;
    camera.updateProjectionMatrix();

    // Smooth-damp pan — lerp camera position toward target + offset
    const desiredPos = cameraTarget.clone().add(cameraOffset);
    // Keep the isometric "height" vector constant; only shift the base
    const isoDistance = 200;
    const isoDir = new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(isoDistance);
    const goalPos = desiredPos.clone().add(isoDir);

    camera.position.lerp(goalPos, DAMP_FACTOR);

    // Dispatch module updates
    for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        if (mod.update) {
            mod.update(delta, elapsed);
        }
    }

    // Render via post-processing pipeline
    composer.render(delta);
}

// ── Module Registration ──────────────────────────────────────
function registerModule(mod) {
    if (!mod) return;
    modules.push(mod);
    // If already booted, call init immediately
    if (scene && mod.init) {
        mod.init({ scene, camera, renderer, THREE });
    }
}

// ── Boot ─────────────────────────────────────────────────────
function boot(container) {
    if (!container) {
        container = document.body;
    }

    clock = new THREE.Clock();

    createScene();
    createCamera();
    createRenderer(container);
    createPostProcessing();
    bindInput(renderer.domElement);

    window.addEventListener('resize', onResize);

    // Initialize any modules that were registered before boot
    for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        if (mod.init) {
            mod.init({ scene, camera, renderer, THREE });
        }
    }

    // Start the loop
    animate();

    console.log(
        '%c Baccarat City %c Core Engine Online ',
        'background:#d4af37;color:#0a0a12;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px;',
        'background:#0a0a12;color:#d4af37;font-weight:bold;padding:2px 6px;border-radius:0 3px 3px 0;'
    );
}

// ── Global Namespace ─────────────────────────────────────────
// Expose everything other modules need on window.BACCARAT
window.BACCARAT = window.BACCARAT || {};
Object.assign(window.BACCARAT, {
    // Will be populated after boot()
    get scene() { return scene; },
    get camera() { return camera; },
    get renderer() { return renderer; },
    get composer() { return composer; },
    THREE,
    registerModule,
    boot,
    // Palette constants for other modules
    GOLD,
    DARK,
    WORLD_SIZE,
});

// ── Auto-boot on DOMContentLoaded if a container exists ──────
// Other scripts can call window.BACCARAT.boot(el) manually,
// or rely on this auto-boot which targets #baccarat-city or body.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const el = document.getElementById('baccarat-city') || document.body;
        boot(el);
    });
} else {
    // DOM already ready (script loaded with defer or at bottom)
    const el = document.getElementById('baccarat-city') || document.body;
    boot(el);
}
