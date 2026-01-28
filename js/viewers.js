import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const loader = new GLTFLoader();
const viewers = [];

function createViewer(container, modelPath, opts) {
  if (!container) return null;

  const isCanvas = container.tagName === 'CANVAS';
  const canvas = isCanvas ? container : null;
  const parent = isCanvas ? container.parentElement : container;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050507);

  const w = parent.clientWidth || 400;
  const h = parent.clientHeight || 320;

  const camera = new THREE.PerspectiveCamera(40, w / h, 0.01, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas || undefined,
    antialias: true,
    alpha: false
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  if (!isCanvas) {
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.5;
  controls.minDistance = 0.5;
  controls.maxDistance = 20;

  // Lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 1.8));
  const d = new THREE.DirectionalLight(0xffffff, 1.2);
  d.position.set(3, 8, 5);
  scene.add(d);
  const d2 = new THREE.DirectionalLight(0x4488ff, 0.4);
  d2.position.set(-3, 2, -5);
  scene.add(d2);

  // Load model
  loader.load(modelPath, function(gltf) {
    var model = gltf.scene;
    var box = new THREE.Box3().setFromObject(model);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());
    var maxDim = Math.max(size.x, size.y, size.z);
    var scale = 2.5 / maxDim;
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    scene.add(model);

    controls.target.set(0, size.y * scale * 0.45, 0);
    camera.position.set(0, size.y * scale * 0.5, maxDim * scale * 2.2);
    controls.update();
  });

  var viewer = { scene: scene, camera: camera, renderer: renderer, controls: controls, parent: parent, active: true };
  viewers.push(viewer);
  return viewer;
}

// --- Create all viewers ---

// Hero/About viewer — Luffy as featured model
createViewer(document.getElementById('hero-viewer'), 'assets/models/luffy.glb');

// Showcase viewers (one per tab)
var showcaseViewers = {
  luffy: createViewer(document.getElementById('viewer-luffy'), 'assets/models/luffy.glb'),
  buzz: createViewer(document.getElementById('viewer-buzz'), 'assets/models/buzz.glb'),
  goku: createViewer(document.getElementById('viewer-goku'), 'assets/models/goku.glb'),
  mickey: createViewer(document.getElementById('viewer-mickey'), 'assets/models/mickey.glb')
};

// Gallery viewers
createViewer(document.getElementById('gallery-luffy'), 'assets/models/luffy.glb');
createViewer(document.getElementById('gallery-buzz'), 'assets/models/buzz.glb');
createViewer(document.getElementById('gallery-goku'), 'assets/models/goku.glb');
createViewer(document.getElementById('gallery-mickey'), 'assets/models/mickey.glb');

// --- Tab switching ---
document.querySelectorAll('.showcase-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    var target = this.getAttribute('data-tab');

    document.querySelectorAll('.showcase-tab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');

    document.querySelectorAll('.showcase-pair-wrapper').forEach(function(w) { w.classList.remove('active'); });
    var wrapper = document.querySelector('[data-content="' + target + '"]');
    if (wrapper) wrapper.classList.add('active');

    // Resize the newly visible viewer
    setTimeout(function() { handleResize(); }, 50);
  });
});

// --- Video autoplay on hover ---
document.querySelectorAll('.video-card').forEach(function(card) {
  var video = card.querySelector('video');
  if (!video) return;
  card.addEventListener('mouseenter', function() { video.play(); });
  card.addEventListener('mouseleave', function() { video.pause(); video.currentTime = 0; });
});

// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  viewers.forEach(function(v) {
    if (!v || !v.renderer) return;
    // Only render if visible
    var rect = v.parent.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
    if (v.parent.offsetParent === null) return; // hidden (display:none)
    v.controls.update();
    v.renderer.render(v.scene, v.camera);
  });
}
animate();

// --- Resize handler ---
function handleResize() {
  viewers.forEach(function(v) {
    if (!v || !v.renderer || !v.parent) return;
    var w = v.parent.clientWidth;
    var h = v.parent.clientHeight;
    if (w < 1 || h < 1) return;
    v.camera.aspect = w / h;
    v.camera.updateProjectionMatrix();
    v.renderer.setSize(w, h);
  });
}
window.addEventListener('resize', handleResize);
