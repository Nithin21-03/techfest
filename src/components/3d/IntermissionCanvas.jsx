import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function IntermissionCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090F, 0.08);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Quantum Singularity Geometry - Dual Nested Octahedron / Dodecahedron
    const outerGeo = new THREE.DodecahedronGeometry(1.8, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    rootGroup.add(outerMesh);

    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerMesh);

    // Core point sphere
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00E5FF })
    );
    rootGroup.add(coreMesh);

    // 2. Swirling Cosmic Vortex Particles
    const pCount = 1800;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    const cols = new Float32Array(pCount * 3);

    const c1 = new THREE.Color(0x00E5FF);
    const c2 = new THREE.Color(0x8B5CF6);

    for (let i = 0; i < pCount; i++) {
      const radius = 1.2 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4.0;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mix = Math.random();
      const col = mix > 0.5 ? c1 : c2;
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const vortex = new THREE.Points(pGeo, pMat);
    scene.add(vortex);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      outerMesh.rotation.x = t * 0.12;
      outerMesh.rotation.y = t * 0.18;

      innerMesh.rotation.x = -t * 0.2;
      innerMesh.rotation.z = t * 0.25;

      vortex.rotation.y = t * 0.08;
      rootGroup.rotation.y = Math.sin(t * 0.3) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.75,
      }}
    />
  );
}
