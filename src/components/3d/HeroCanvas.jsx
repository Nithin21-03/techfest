import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020202, 0.028);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x0e1424, 2.0);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f2ff, 14, 75);
    cyanPoint.position.set(16, 14, 15);
    scene.add(cyanPoint);

    const magentaPoint = new THREE.PointLight(0xff007f, 12, 70);
    magentaPoint.position.set(-18, -12, -10);
    scene.add(magentaPoint);

    const violetPoint = new THREE.PointLight(0x8b5cf6, 8, 60);
    violetPoint.position.set(0, -15, 12);
    scene.add(violetPoint);

    // --- MAIN SCENE GROUP ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. QUANTUM CORE (Dual Nested Complex Polyhedra)
    // Outer wireframe stellated icosahedron
    const coreOuterGeo = new THREE.IcosahedronGeometry(3.8, 1);
    const coreOuterMat = new THREE.MeshStandardMaterial({
      color: 0x00f2ff,
      wireframe: true,
      emissive: 0x00f2ff,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const coreOuterMesh = new THREE.Mesh(coreOuterGeo, coreOuterMat);
    mainGroup.add(coreOuterMesh);

    // Secondary inner wireframe octahedron
    const coreMidGeo = new THREE.OctahedronGeometry(2.6, 0);
    const coreMidMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      wireframe: true,
      emissive: 0xff007f,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.75,
    });
    const coreMidMesh = new THREE.Mesh(coreMidGeo, coreMidMat);
    mainGroup.add(coreMidMesh);

    // Central high-refractive singularity sphere
    const singularityGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const singularityMat = new THREE.MeshStandardMaterial({
      color: 0x020510,
      emissive: 0x00f2ff,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.95,
      wireframe: false,
    });
    const singularityMesh = new THREE.Mesh(singularityGeo, singularityMat);
    mainGroup.add(singularityMesh);

    // 2. 4 GYROSCOPIC ORBITAL RINGS WITH SATELLITE PHOTONS
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const ringDefs = [
      { radius: 5.6, tube: 0.035, color: 0x00f2ff, rotX: Math.PI / 3, rotY: 0, speed: 0.18 },
      { radius: 7.4, tube: 0.03, color: 0xff007f, rotX: -Math.PI / 4, rotY: Math.PI / 5, speed: -0.14 },
      { radius: 9.2, tube: 0.025, color: 0x8b5cf6, rotX: Math.PI / 6, rotY: -Math.PI / 3, speed: 0.12 },
      { radius: 11.0, tube: 0.02, color: 0x00f2ff, rotX: -Math.PI / 2.5, rotY: Math.PI / 4, speed: -0.1 },
    ];

    const rings = [];
    const satellites = [];

    const satelliteGeo = new THREE.SphereGeometry(0.18, 12, 12);

    ringDefs.forEach((def, index) => {
      const geo = new THREE.TorusGeometry(def.radius, def.tube, 16, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = def.rotX;
      mesh.rotation.y = def.rotY;
      ringGroup.add(mesh);
      rings.push({ mesh, def });

      // Add orbiting photon node
      const satMat = new THREE.MeshBasicMaterial({
        color: def.color,
        wireframe: false,
      });
      const satMesh = new THREE.Mesh(satelliteGeo, satMat);
      ringGroup.add(satMesh);
      satellites.push({
        mesh: satMesh,
        radius: def.radius,
        rotX: def.rotX,
        rotY: def.rotY,
        angle: (Math.PI * 2 * index) / ringDefs.length,
        speed: def.speed * 2.2,
      });
    });

    // 3. HYPER-DENSE PARTICLE NEBULA (1,200 Particles)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const originalPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x00f2ff);
    const cMagenta = new THREE.Color(0xff007f);
    const cViolet = new THREE.Color(0x8b5cf6);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 6 + Math.random() * 32;
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
      const col = rand < 0.5 ? cCyan : rand < 0.75 ? cViolet : rand < 0.92 ? cMagenta : cWhite;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 4. PERSPECTIVE CYBER GRID FLOOR
    const gridHelper = new THREE.GridHelper(90, 60, 0x00f2ff, 0x141828);
    gridHelper.position.y = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.28;
    scene.add(gridHelper);

    // --- MOUSE PARALLAX & CLICK SHOCKWAVE PHYSICS ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Active click shockwave impulse state
    const shockwaves = [];

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = (e) => {
      // Trigger a 3D spherical shockwave through the particle field
      shockwaves.push({
        radius: 0,
        maxRadius: 28,
        speed: 0.65,
        strength: 2.5,
        active: true,
      });

      // Emissive core flash
      coreOuterMat.emissiveIntensity = 2.2;
    };

    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      targetScrollProgress = Math.min(1, Math.max(0, scrollY / totalHeight));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- RENDER ANIMATION LOOP ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth continuous spring lerp for scroll physics
      currentScrollProgress = THREE.MathUtils.lerp(currentScrollProgress, targetScrollProgress, 0.08);

      // --- DYNAMIC ZOOM ANIMATION ON SCROLL ---
      // 1. Zoom the 3D core & orbital rings outward as user scrolls down
      const zoomScale = 1.0 + currentScrollProgress * 3.4;
      mainGroup.scale.set(zoomScale, zoomScale, zoomScale);

      // 2. Camera flies forward along Z-axis toward the singularity (Zoom In)
      const targetCamZ = THREE.MathUtils.lerp(26, 9.8, currentScrollProgress);
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
      particles.rotation.y = elapsed * 0.035 + currentScrollProgress * 2.8;

      // 7. Perspective cyber grid floor accelerates forward with scroll
      gridHelper.position.z = ((elapsed * 3) + currentScrollProgress * 90) % 4;

      // 8. Smooth camera mouse parallax lerp + scroll altitude tracking
      targetX = THREE.MathUtils.lerp(targetX, mouseX * 2.5, 0.05);
      targetY = THREE.MathUtils.lerp(targetY, mouseY * 1.8, 0.05);

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY - currentScrollProgress * 4, 0.06);
      camera.lookAt(0, -currentScrollProgress * 2.5, 0);

      // Core rotation & quantum breathing
      coreOuterMesh.rotation.x = elapsed * 0.22;
      coreOuterMesh.rotation.y = elapsed * 0.28;
      coreMidMesh.rotation.x = -elapsed * 0.35;
      coreMidMesh.rotation.z = elapsed * 0.3;

      const breathe = 1 + Math.sin(elapsed * 2.5) * 0.08;
      singularityMesh.scale.set(breathe, breathe, breathe);

      // Pulse emissive intensities
      coreOuterMat.emissiveIntensity = THREE.MathUtils.lerp(
        coreOuterMat.emissiveIntensity,
        0.6 + Math.sin(elapsed * 2.2) * 0.25,
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

        // Apply orbital inclination matrix
        const vec = new THREE.Vector3(x, y, 0);
        vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), sat.rotX);
        vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.rotY);

        sat.mesh.position.copy(vec);
      });

      // Ambient particle rotation & wave undulation
      particles.rotation.y = elapsed * 0.035;
      particles.rotation.x = Math.sin(elapsed * 0.06) * 0.04;

      // Update particle shockwaves
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
        const rMin = sw.radius - 2.5;
        const rMax = sw.radius + 2.5;

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
            // Lerp back to original position
            currentPositions[idx] += (ox - currentPositions[idx]) * 0.08;
            currentPositions[idx + 1] += (oy - currentPositions[idx + 1]) * 0.08;
            currentPositions[idx + 2] += (oz - currentPositions[idx + 2]) * 0.08;
          }
        }
      }

      if (posChanged) {
        posAttr.needsUpdate = true;
      }

      // Traveling neon pulse on grid
      gridHelper.position.z = (elapsed * 3) % 4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
}

