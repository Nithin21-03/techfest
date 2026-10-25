import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { soundFX } from '../../utils/audioSynth';

// =============================================================================
// PROCEDURAL CELESTIAL & CYBER TEXTURES (100% Round, Zero Square Pixels)
// =============================================================================

function createRoundPointTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const cx = 32;
  const cy = 32;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.2, 'rgba(220, 245, 255, 0.95)');
  grad.addColorStop(0.45, 'rgba(0, 242, 255, 0.6)');
  grad.addColorStop(0.75, 'rgba(139, 92, 246, 0.2)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createBrilliantStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const cx = 64;
  const cy = 64;

  const corona = ctx.createRadialGradient(cx, cy, 0, cx, cy, 58);
  corona.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  corona.addColorStop(0.12, 'rgba(210, 245, 255, 0.95)');
  corona.addColorStop(0.32, 'rgba(0, 242, 255, 0.6)');
  corona.addColorStop(0.65, 'rgba(255, 0, 127, 0.25)');
  corona.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = corona;
  ctx.fillRect(0, 0, 128, 128);

  const drawSpike = (angle, length, width, alpha) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(-length, 0, length, 0);
    grad.addColorStop(0, 'rgba(0, 242, 255, 0)');
    grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
    grad.addColorStop(1, 'rgba(0, 242, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, length, width, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawSpike(0, 52, 1.6, 0.9);
  drawSpike(Math.PI / 2, 52, 1.6, 0.9);
  drawSpike(Math.PI / 4, 24, 1.0, 0.35);
  drawSpike(-Math.PI / 4, 24, 1.0, 0.35);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function HeroCanvas() {
  const containerRef = useRef(null);

  // Dimension Modes: 'quantum' | 'matrix' | 'warp'
  const [dimensionMode, setDimensionMode] = useState('quantum');
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [telemetry, setTelemetry] = useState({ fps: 60, nodes: 3450, camZ: 26.0 });

  const modeRef = useRef('quantum');
  modeRef.current = dimensionMode;

  const triggerPulseRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.022);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 26);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    // --- 2. DYNAMIC LIGHTING (Vibrant Cyan + Magenta + Violet Cyberpunk) ---
    const ambientLight = new THREE.AmbientLight(0x0c1326, 1.8);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f2ff, 15, 85);
    cyanPoint.position.set(16, 16, 18);
    scene.add(cyanPoint);

    const magentaPoint = new THREE.PointLight(0xff007f, 13, 75);
    magentaPoint.position.set(-18, -12, -10);
    scene.add(magentaPoint);

    const violetPoint = new THREE.PointLight(0x8b5cf6, 10, 65);
    violetPoint.position.set(0, -15, 14);
    scene.add(violetPoint);

    const roundPointTex = createRoundPointTexture();
    const brilliantStarTex = createBrilliantStarTexture();

    // --- ROOT MAIN GROUP (Zooms and rotates dynamically with scroll) ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // =========================================================================
    // 3. THE ICONIC QUANTUM CORE (Dual Nested Wireframe Polyhedra + Singularity)
    // =========================================================================
    // A. Outer wireframe stellated icosahedron (Cyan)
    const coreOuterGeo = new THREE.IcosahedronGeometry(3.8, 1);
    const coreOuterMat = new THREE.MeshStandardMaterial({
      color: 0x00f2ff,
      wireframe: true,
      emissive: 0x00f2ff,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.85,
    });
    const coreOuterMesh = new THREE.Mesh(coreOuterGeo, coreOuterMat);
    mainGroup.add(coreOuterMesh);

    // Glowing Vertex Nodes on Outer Icosahedron
    const icosaVertices = coreOuterGeo.attributes.position;
    const vertexPointsGeo = new THREE.BufferGeometry();
    vertexPointsGeo.setAttribute('position', icosaVertices.clone());
    const vertexPointsMat = new THREE.PointsMaterial({
      size: 0.38,
      map: roundPointTex,
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const vertexPoints = new THREE.Points(vertexPointsGeo, vertexPointsMat);
    coreOuterMesh.add(vertexPoints);

    // B. Secondary inner wireframe octahedron (Hot Magenta)
    const coreMidGeo = new THREE.OctahedronGeometry(2.6, 0);
    const coreMidMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      wireframe: true,
      emissive: 0xff007f,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.8,
    });
    const coreMidMesh = new THREE.Mesh(coreMidGeo, coreMidMat);
    mainGroup.add(coreMidMesh);

    // C. Central high-refractive singularity sphere
    const singularityGeo = new THREE.SphereGeometry(1.65, 32, 32);
    const singularityMat = new THREE.MeshStandardMaterial({
      color: 0x020510,
      emissive: 0x00f2ff,
      emissiveIntensity: 0.95,
      roughness: 0.15,
      metalness: 0.95,
      wireframe: false,
    });
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    mainGroup.add(singularityMesh);

    // =========================================================================
    // 4. 4 CONCENTRIC GYROSCOPIC ORBITAL RINGS WITH SATELLITE PHOTONS
    // (Upgraded with 3D Torus tubes and orbital photon trains)
    // =========================================================================
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const ringDefs = [
      { radius: 5.6, tube: 0.04, color: 0x00f2ff, rotX: Math.PI / 3, rotY: 0, speed: 0.22 },
      { radius: 7.4, tube: 0.035, color: 0xff007f, rotX: -Math.PI / 4, rotY: Math.PI / 5, speed: -0.18 },
      { radius: 9.2, tube: 0.03, color: 0x8b5cf6, rotX: Math.PI / 6, rotY: -Math.PI / 3, speed: 0.15 },
      { radius: 11.2, tube: 0.025, color: 0x00f2ff, rotX: -Math.PI / 2.5, rotY: Math.PI / 4, speed: -0.12 },
    ];

    const rings = [];
    const satellites = [];
    const satelliteGeo = new THREE.SphereGeometry(0.18, 16, 16);

    ringDefs.forEach((def, index) => {
      const geo = new THREE.TorusGeometry(def.radius, def.tube, 16, 120);
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = def.rotX;
      mesh.rotation.y = def.rotY;
      ringGroup.add(mesh);
      rings.push({ mesh, def });

      // Add 2 orbiting photon satellites per ring
      for (let p = 0; p < 2; p++) {
        const satMat = new THREE.MeshBasicMaterial({ color: p === 0 ? def.color : 0xffffff });
        const satMesh = new THREE.Mesh(satelliteGeo, satMat);
        ringGroup.add(satMesh);
        satellites.push({
          mesh: satMesh,
          radius: def.radius,
          rotX: def.rotX,
          rotY: def.rotY,
          angle: (Math.PI * 2 * index) / ringDefs.length + (p * Math.PI),
          speed: def.speed * 2.2,
        });
      }
    });

    // =========================================================================
    // 5. THE 3D UNDULATING CYBER HORIZON GRID (TRON SYNTHWAVE TERRAIN)
    // =========================================================================
    const gridCols = 54;
    const gridRows = 54;
    const gridWidth = 150;
    const gridDepth = 150;
    const gridGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, gridCols, gridRows);
    gridGeo.rotateX(-Math.PI / 2);

    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.position.set(0, -10, -20);
    scene.add(gridMesh);

    const gridPosAttr = gridGeo.attributes.position;
    const gridOrigY = new Float32Array(gridPosAttr.count);
    for (let i = 0; i < gridPosAttr.count; i++) {
      gridOrigY[i] = gridPosAttr.getY(i);
    }

    // Grid Node Points (Glow intersections)
    const gridPointsMat = new THREE.PointsMaterial({
      size: 0.3,
      map: roundPointTex,
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const gridPoints = new THREE.Points(gridGeo, gridPointsMat);
    gridMesh.add(gridPoints);

    // =========================================================================
    // 6. FLOATING 3D WIREFRAME CYBER CUBES & LOW-POLY SHARDS (3D PARALLAX)
    // =========================================================================
    const shardGroup = new THREE.Group();
    mainGroup.add(shardGroup);

    const shardGeoBox = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const shardGeoOct = new THREE.OctahedronGeometry(0.6, 0);

    const wireBoxMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const shardMatMagenta = new THREE.MeshStandardMaterial({
      color: 0x1f071e,
      emissive: 0xff007f,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.15,
      flatShading: true,
    });

    const shardList = [];
    const SHARD_COUNT = 28;

    for (let i = 0; i < SHARD_COUNT; i++) {
      const mesh = i % 2 === 0 ? new THREE.Mesh(shardGeoBox, wireBoxMat) : new THREE.Mesh(shardGeoOct, shardMatMagenta);
      const r = 9.0 + Math.random() * 26.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      mesh.position.set(
        r * Math.cos(theta) * Math.cos(phi),
        r * Math.sin(phi) * 0.75,
        (Math.random() - 0.5) * 45.0
      );

      const s = 0.5 + Math.random() * 0.85;
      mesh.scale.set(s, s, s);

      shardGroup.add(mesh);
      shardList.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.8,
        rotSpeedY: (Math.random() - 0.5) * 0.9,
        rotSpeedZ: (Math.random() - 0.5) * 0.6,
        basePos: mesh.position.clone(),
        orbitSpeed: (0.1 + Math.random() * 0.2) * (Math.random() > 0.5 ? 1 : -1),
        theta,
        r,
      });
    }

    // =========================================================================
    // 7. HYPER-DENSE PARTICLE NEBULA & SPHERICAL SHOCKWAVE SYSTEM (1,600 Particles)
    // =========================================================================
    const particleCount = 1600;
    const particleGeo = new THREE.BufferGeometry();
    const originalPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x00f2ff);
    const cMagenta = new THREE.Color(0xff007f);
    const cViolet = new THREE.Color(0x8b5cf6);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 6 + Math.random() * 34;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      const z = radius * Math.cos(phi);

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      currentPositions[i * 3] = x;
      currentPositions[i * 3 + 1] = y;
      currentPositions[i * 3 + 2] = z;

      const rand = Math.random();
      const col = rand < 0.45 ? cCyan : rand < 0.72 ? cMagenta : rand < 0.88 ? cViolet : cWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      map: roundPointTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // Brilliant Beacon Stars (Foreground Cross Flares)
    const beaconCount = 75;
    const beaconGeo = new THREE.BufferGeometry();
    const beaconPositions = new Float32Array(beaconCount * 3);
    const beaconColors = new Float32Array(beaconCount * 3);

    for (let i = 0; i < beaconCount; i++) {
      const r = 5.0 + Math.random() * 45.0;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 60.0;

      beaconPositions[i * 3] = r * Math.cos(theta);
      beaconPositions[i * 3 + 1] = r * Math.sin(theta) * 0.7;
      beaconPositions[i * 3 + 2] = z;

      const col = Math.random() > 0.4 ? new THREE.Color(0xffffff) : new THREE.Color(0x00f2ff);
      beaconColors[i * 3] = col.r;
      beaconColors[i * 3 + 1] = col.g;
      beaconColors[i * 3 + 2] = col.b;
    }

    beaconGeo.setAttribute('position', new THREE.BufferAttribute(beaconPositions, 3));
    beaconGeo.setAttribute('color', new THREE.BufferAttribute(beaconColors, 3));

    const beaconMat = new THREE.PointsMaterial({
      size: 1.3,
      map: brilliantStarTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beaconSystem = new THREE.Points(beaconGeo, beaconMat);
    mainGroup.add(beaconSystem);

    // =========================================================================
    // 8. INTERACTIVE CLICK SHOCKWAVE PHYSICS & MOUSE PARALLAX
    // =========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const shockwaves = [];

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const triggerShockwave = () => {
      shockwaves.push({
        radius: 0,
        maxRadius: 32,
        speed: 0.75,
        strength: 3.2,
      });

      // Emissive core flash
      coreOuterMat.emissiveIntensity = 2.4;
      coreMidMat.emissiveIntensity = 2.4;
      soundFX.playWarp();
    };

    triggerPulseRef.current = triggerShockwave;

    const handleClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (['input', 'textarea', 'select', 'button', 'a'].includes(tag)) return;
      triggerShockwave();
    };

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    let cachedDocHeight =
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) -
        window.innerHeight || 1;

    const updateScrollMetrics = () => {
      cachedDocHeight =
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) -
          window.innerHeight || 1;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetScrollProgress = Math.min(1, Math.max(0, scrollY / cachedDocHeight));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollMetrics);
    handleScroll();

    let lenisUnsubscribe = null;
    const attachLenis = () => {
      if (window.__lenis) {
        lenisUnsubscribe = window.__lenis.on('scroll', ({ progress }) => {
          targetScrollProgress = Math.min(1, Math.max(0, progress));
        });
      }
    };
    attachLenis();
    const lenisTimer = setTimeout(attachLenis, 300);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateScrollMetrics();
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 9. RENDER ANIMATION LOOP WITH SIGNATURE SCROLL DOLLY-ZOOM & PHYSICS
    // =========================================================================
    let clock = new THREE.Clock();
    let animId;
    let frameCount = 0;
    let lastFpsUpdate = 0;

    const gridPosArray = gridPosAttr.array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const currentMode = modeRef.current;

      // Telemetry FPS Counter
      frameCount++;
      if (elapsed - lastFpsUpdate >= 1.0) {
        setTelemetry((prev) => ({
          ...prev,
          fps: Math.round(frameCount / (elapsed - lastFpsUpdate)),
          camZ: Math.round(camera.position.z * 10) / 10,
        }));
        frameCount = 0;
        lastFpsUpdate = elapsed;
      }

      // Smooth continuous spring lerp for scroll physics
      currentScrollProgress = THREE.MathUtils.lerp(currentScrollProgress, targetScrollProgress, 0.08);

      // --- A. DYNAMIC ZOOM ANIMATION ON SCROLL ---
      // 1. Zoom the 3D core & orbital rings outward as user scrolls down
      const zoomScale = 1.0 + currentScrollProgress * 3.4;
      mainGroup.scale.set(zoomScale, zoomScale, zoomScale);

      // 2. Camera flies forward along Z-axis toward the singularity (Zoom In)
      const targetCamZ = THREE.MathUtils.lerp(26.0, 9.8, currentScrollProgress);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

      // 3. Cinematic Dolly Zoom (expand FOV from 45deg to 68deg for dramatic depth warp)
      camera.fov = THREE.MathUtils.lerp(45, 68, currentScrollProgress);
      camera.updateProjectionMatrix();

      // 4. Move main 3D group coordinates smoothly with scroll
      mainGroup.position.y = THREE.MathUtils.lerp(0, 8, currentScrollProgress);
      mainGroup.position.z = THREE.MathUtils.lerp(0, 5, currentScrollProgress);
      mainGroup.position.x = Math.sin(currentScrollProgress * Math.PI * 2) * 2.5;

      // 5. Dynamic multi-axis rotation linked directly to scroll
      mainGroup.rotation.y = elapsed * 0.15 + currentScrollProgress * Math.PI * 3.6;
      mainGroup.rotation.x = Math.sin(currentScrollProgress * Math.PI * 2) * 0.45;
      mainGroup.rotation.z = Math.cos(currentScrollProgress * Math.PI * 2) * 0.35;

      // 6. Nebula starfield particles zoom and fly past the camera in hyperspace
      particles.scale.set(
        1 + currentScrollProgress * 2.6,
        1 + currentScrollProgress * 2.6,
        1 + currentScrollProgress * 3.8
      );
      particles.position.y = -currentScrollProgress * 18;

      // 7. Undulating 3D Cyber Grid Terrain Waves + Scroll Forward Travel
      const waveSpeed = elapsed * 2.0;
      const rippleCenter = targetX * 10.0;
      gridMesh.position.z = -20 + ((elapsed * 4) + currentScrollProgress * 80) % 8;

      for (let i = 0; i < gridPosAttr.count; i++) {
        const idx = i * 3;
        const x = gridPosArray[idx];
        const z = gridPosArray[idx + 2];

        const wave1 = Math.sin(x * 0.12 + waveSpeed) * Math.cos(z * 0.12 + waveSpeed * 0.8) * 1.35;
        const distToMouse = Math.sqrt((x - rippleCenter) * (x - rippleCenter) + z * z);
        const mouseRipple = Math.sin(distToMouse * 0.3 - elapsed * 3.5) * Math.exp(-distToMouse * 0.08) * 1.5;

        gridPosArray[idx + 1] = gridOrigY[i] + wave1 + mouseRipple;
      }
      gridPosAttr.needsUpdate = true;

      // 8. Smooth camera mouse parallax lerp + scroll altitude tracking
      targetX = THREE.MathUtils.lerp(targetX, mouseX * 2.5, 0.05);
      targetY = THREE.MathUtils.lerp(targetY, mouseY * 1.8, 0.05);

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY - currentScrollProgress * 4, 0.06);
      camera.lookAt(0, -currentScrollProgress * 2.5, 0);

      // --- B. CORE ROTATION & QUANTUM BREATHING ---
      coreOuterMesh.rotation.x = elapsed * 0.22;
      coreOuterMesh.rotation.y = elapsed * 0.28;
      coreMidMesh.rotation.x = -elapsed * 0.35;
      coreMidMesh.rotation.z = elapsed * 0.3;

      const breathe = 1.0 + Math.sin(elapsed * 2.5) * 0.08;
      singularityMesh.scale.set(breathe, breathe, breathe);

      // Emissive pulse damping after click flash
      coreOuterMat.emissiveIntensity = THREE.MathUtils.lerp(
        coreOuterMat.emissiveIntensity,
        0.65 + Math.sin(elapsed * 2.2) * 0.25,
        0.05
      );
      coreMidMat.emissiveIntensity = THREE.MathUtils.lerp(
        coreMidMat.emissiveIntensity,
        0.75 + Math.sin(elapsed * 2.2 + 1.0) * 0.25,
        0.05
      );

      // Animate orbital rings & satellites
      rings.forEach(({ mesh, def }) => {
        mesh.rotation.z += def.speed * 0.03;
      });

      satellites.forEach((sat) => {
        sat.angle += sat.speed * 0.02;
        const x = Math.cos(sat.angle) * sat.radius;
        const y = Math.sin(sat.angle) * sat.radius;

        const vec = new THREE.Vector3(x, y, 0);
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.rotX);
        vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.rotY);

        sat.mesh.position.copy(vec);
      });

      // Animate floating cyber shards
      for (let s = 0; s < shardList.length; s++) {
        const shard = shardList[s];
        shard.mesh.rotation.x += shard.rotSpeedX * delta;
        shard.mesh.rotation.y += shard.rotSpeedY * delta;
        shard.mesh.rotation.z += shard.rotSpeedZ * delta;

        shard.theta += shard.orbitSpeed * delta * 0.5;
        shard.mesh.position.x = Math.cos(shard.theta) * shard.r;
        shard.mesh.position.y = shard.basePos.y + Math.sin(elapsed * 1.8 + s) * 0.45;
      }

      // Ambient particle rotation & wave undulation
      particles.rotation.y = elapsed * 0.035;
      particles.rotation.x = Math.sin(elapsed * 0.06) * 0.04;

      // --- C. UPDATE PARTICLE SHOCKWAVE PHYSICS ---
      const posAttr = particleGeo.attributes.position;
      let posChanged = false;

      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed;

        if (sw.radius > sw.maxRadius) {
          shockwaves.splice(s, 1);
          continue;
        }

        posChanged = true;
        const rMin = sw.radius - 3.0;
        const rMax = sw.radius + 3.0;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const ox = originalPositions[idx];
          const oy = originalPositions[idx + 1];
          const oz = originalPositions[idx + 2];

          const dist = Math.sqrt(ox * ox + oy * oy + oz * oz);

          if (dist >= rMin && dist <= rMax) {
            const factor = 1 + (sw.strength * (1 - sw.radius / sw.maxRadius)) / (dist + 0.1);
            currentPositions[idx] = ox * factor;
            currentPositions[idx + 1] = oy * factor;
            currentPositions[idx + 2] = oz * factor;
          } else {
            // Spring return to original coordinates
            currentPositions[idx] = THREE.MathUtils.lerp(currentPositions[idx], ox, 0.08);
            currentPositions[idx + 1] = THREE.MathUtils.lerp(currentPositions[idx + 1], oy, 0.08);
            currentPositions[idx + 2] = THREE.MathUtils.lerp(currentPositions[idx + 2], oz, 0.08);
          }
        }
      }

      if (posChanged) {
        posAttr.needsUpdate = true;
      }

      // Mode-specific Visibility & Intensity Tweaks
      if (currentMode === 'warp') {
        gridMesh.visible = false;
        shardGroup.visible = false;
        particles.scale.z = 6.0;
      } else if (currentMode === 'matrix') {
        gridMesh.visible = true;
        shardGroup.visible = true;
        gridMat.opacity = 0.65;
      } else {
        gridMesh.visible = true;
        shardGroup.visible = true;
        gridMat.opacity = 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up all resources on unmount
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(lenisTimer);
      if (typeof lenisUnsubscribe === 'function') lenisUnsubscribe();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollMetrics);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose textures & geometries
      roundPointTex.dispose();
      brilliantStarTex.dispose();
      renderer.dispose();
      coreOuterGeo.dispose();
      coreOuterMat.dispose();
      vertexPointsGeo.dispose();
      vertexPointsMat.dispose();
      coreMidGeo.dispose();
      coreMidMat.dispose();
      singularityGeo.dispose();
      singularityMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      gridPointsMat.dispose();
      shardGeoBox.dispose();
      shardGeoOct.dispose();
      wireBoxMat.dispose();
      shardMatMagenta.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      satelliteGeo.dispose();
      rings.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      satellites.forEach((sat) => {
        sat.mesh.material.dispose();
      });
    };
  }, []);

  const handleModeChange = (mode) => {
    soundFX.playClick();
    setDimensionMode(mode);
    if (triggerPulseRef.current) {
      triggerPulseRef.current();
    }
  };

  const handlePulseClick = (e) => {
    e.stopPropagation();
    if (triggerPulseRef.current) {
      triggerPulseRef.current();
    }
  };

  return (
    <>
      {/* 3D WebGL Canvas Layer (Fixed fullscreen background) */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: 1.0 }}
        aria-hidden="true"
      />

      {/* Floating 3D Cyber HUD Controller (Interactive Dimension & Telemetry Switcher) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex flex-col items-start gap-2 select-none">
        {/* HUD Box */}
        <div
          className={`bg-black/85 border border-cyan-400/40 rounded-xl backdrop-blur-2xl p-3 shadow-[0_0_35px_rgba(0,242,255,0.25)] transition-all duration-300 ${
            hudCollapsed ? 'w-auto' : 'w-76'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-cyan-400/25">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-white">
                3D SPATIAL ENGINE
              </span>
            </div>
            <button
              onClick={() => setHudCollapsed(!hudCollapsed)}
              className="text-cyan-400/80 hover:text-cyan-300 p-0.5 rounded hover:bg-cyan-400/10 transition-colors cursor-pointer"
              title={hudCollapsed ? 'Expand Telemetry' : 'Minimize Telemetry'}
            >
              {hudCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {!hudCollapsed && (
            <div className="mt-2.5 flex flex-col gap-3">
              {/* Telemetry Readout */}
              <div className="grid grid-cols-3 gap-2 bg-cyan-950/40 p-2 rounded border border-cyan-400/20 text-[8px] font-mono">
                <div className="flex flex-col">
                  <span className="text-white/40 uppercase">STATUS</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 uppercase">FPS</span>
                  <span className="text-cyan-300 font-bold">{telemetry.fps}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 uppercase">NODES</span>
                  <span className="text-purple-300 font-bold">{telemetry.nodes}</span>
                </div>
              </div>

              {/* Dimension Mode Selectors */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-mono uppercase text-white/50 tracking-wider">
                  DIMENSION PRESET:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleModeChange('quantum')}
                    className={`px-2 py-1.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      dimensionMode === 'quantum'
                        ? 'bg-cyan-400 text-black shadow-[0_0_15px_#00f2ff]'
                        : 'bg-black/60 text-white/70 border border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    QUANTUM
                  </button>
                  <button
                    onClick={() => handleModeChange('matrix')}
                    className={`px-2 py-1.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      dimensionMode === 'matrix'
                        ? 'bg-cyan-400 text-black shadow-[0_0_15px_#00f2ff]'
                        : 'bg-black/60 text-white/70 border border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    MATRIX
                  </button>
                  <button
                    onClick={() => handleModeChange('warp')}
                    className={`px-2 py-1.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      dimensionMode === 'warp'
                        ? 'bg-cyan-400 text-black shadow-[0_0_15px_#00f2ff]'
                        : 'bg-black/60 text-white/70 border border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    WARP
                  </button>
                </div>
              </div>

              {/* Interactive Shockwave Pulse Button */}
              <button
                onClick={handlePulseClick}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500/25 to-purple-500/25 hover:from-cyan-500/40 hover:to-purple-500/40 border border-cyan-400/50 text-cyan-300 font-mono text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] cursor-pointer active:scale-98"
              >
                <Zap size={12} className="text-cyan-400 animate-pulse" />
                <span>FIRE 3D GRAVITY PULSE</span>
              </button>

              <div className="text-[7.5px] font-mono text-white/50 text-center tracking-tight">
                Tip: Click anywhere or move mouse to warp the 3D space
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
