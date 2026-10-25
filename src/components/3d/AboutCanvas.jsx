import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AboutCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Root Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Inner Core Wireframe Sphere
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerGlobe = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerGlobe);

    // 2. High-density Node Cluster on Sphere Surface
    const nodeCount = 75;
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMatCyan = new THREE.MeshBasicMaterial({ color: 0x00E5FF });
    const nodeMatViolet = new THREE.MeshBasicMaterial({ color: 0x8B5CF6 });

    const nodePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = 1.62 * Math.cos(theta) * Math.sin(phi);
      const y = 1.62 * Math.sin(theta) * Math.sin(phi);
      const z = 1.62 * Math.cos(phi);

      const nodeMesh = new THREE.Mesh(nodeGeo, i % 3 === 0 ? nodeMatViolet : nodeMatCyan);
      nodeMesh.position.set(x, y, z);
      globeGroup.add(nodeMesh);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    // 3. Holographic Network Line Interconnects (Single draw-call LineSegments)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.25,
    });

    const linePoints = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 0.95) {
          linePoints.push(nodePositions[i], nodePositions[j]);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    globeGroup.add(linesMesh);

    // 4. Outer Orbital Latitude Ring
    const orbitalRingGeo = new THREE.TorusGeometry(2.2, 0.02, 16, 90);
    const orbitalRingMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.6,
    });
    const orbitalRing = new THREE.Mesh(orbitalRingGeo, orbitalRingMat);
    orbitalRing.rotation.x = Math.PI / 2.5;
    globeGroup.add(orbitalRing);

    // Second inclined ring
    const orbitalRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.015, 16, 90),
      new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.4 })
    );
    orbitalRing2.rotation.y = Math.PI / 3;
    globeGroup.add(orbitalRing2);

    // 5. Outer Particle Cloud
    const partCount = 300;
    const partGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      posArr[i] = (Math.random() - 0.5) * 6;
      posArr[i + 1] = (Math.random() - 0.5) * 6;
      posArr[i + 2] = (Math.random() - 0.5) * 6;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.6,
    });
    const cloudPoints = new THREE.Points(partGeo, partMat);
    scene.add(cloudPoints);

    // --- MOUSE DRAG / HOVER ROTATION ---
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotVelocity = { x: 0.003, y: 0.007 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      rotVelocity.y = deltaX * 0.005;
      rotVelocity.x = deltaY * 0.005;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Save GPU resources if offscreen
      if (!isVisible) return;

      // Dampen velocity when not dragging
      if (!isDragging) {
        rotVelocity.x += (0.002 - rotVelocity.x) * 0.04;
        rotVelocity.y += (0.006 - rotVelocity.y) * 0.04;
      }

      globeGroup.rotation.y += rotVelocity.y;
      globeGroup.rotation.x += rotVelocity.x;

      orbitalRing.rotation.z += 0.01;
      orbitalRing2.rotation.z -= 0.008;

      cloudPoints.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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
        width: '100%',
        height: '100%',
        minHeight: '380px',
        position: 'relative',
        cursor: 'grab',
      }}
    />
  );
}
