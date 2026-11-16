"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Transparent Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.45, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Warm Culinary Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfef3c7, 1.4);
    fillLight.position.set(-6, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 2.0, 16);
    rimLight.position.set(0, -1.2, 4);
    scene.add(rimLight);

    const topGlossLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topGlossLight.position.set(0, 7, 2);
    scene.add(topGlossLight);

    // 3. Ground Shadow Disc
    const groundGeo = new THREE.CircleGeometry(3.6, 48);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.8;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Burger Group
    const burgerGroup = new THREE.Group();
    burgerGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(burgerGroup);

    // High-Appetite Realistic Materials
    const topBunMaterial = new THREE.MeshStandardMaterial({
      color: 0xcc7115, // Golden caramelized brioche
      roughness: 0.38,
      metalness: 0.08,
    });

    const bottomBunMaterial = new THREE.MeshStandardMaterial({
      color: 0xc46912,
      roughness: 0.48,
      metalness: 0.05,
    });

    const pattyMaterial = new THREE.MeshStandardMaterial({
      color: 0x361a0f, // Deep charred seared chuck beef
      roughness: 0.88,
      metalness: 0.04,
    });

    const cheeseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gooey melted American cheddar
      roughness: 0.2,
      metalness: 0.08,
    });

    const lettuceMaterial = new THREE.MeshStandardMaterial({
      color: 0x16a34a, // Vibrant leafy ruffled lettuce
      roughness: 0.42,
      side: THREE.DoubleSide,
    });

    const tomatoMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Ripe vine-red tomato
      roughness: 0.16,
      metalness: 0.08,
    });

    const pickleMaterial = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Dill pickle slice
      roughness: 0.28,
    });

    const seedMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffbeb, // White toasted sesame seeds
      roughness: 0.25,
    });

    // LAYER 1: Bottom Toasted Brioche Bun
    const bottomBunGeo = new THREE.CylinderGeometry(1.5, 1.4, 0.48, 42);
    const bottomBun = new THREE.Mesh(bottomBunGeo, bottomBunMaterial);
    bottomBun.position.y = -1.18;
    bottomBun.castShadow = true;
    bottomBun.receiveShadow = true;
    burgerGroup.add(bottomBun);

    // LAYER 2: Pickles (3 crinkle-cut discs)
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const pickleGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.06, 24);
      const pickle = new THREE.Mesh(pickleGeo, pickleMaterial);
      pickle.position.set(Math.cos(angle) * 0.74, -0.88, Math.sin(angle) * 0.74);
      pickle.rotation.x = 0.06 * (i % 2 === 0 ? 1 : -1);
      pickle.rotation.z = 0.05;
      pickle.castShadow = true;
      burgerGroup.add(pickle);
    }

    // LAYER 3: Juicy Seared Grilled Smash Patty (Caramelized crust)
    const pattyGeo = new THREE.CylinderGeometry(1.68, 1.68, 0.58, 42);
    const patty = new THREE.Mesh(pattyGeo, pattyMaterial);
    patty.position.y = -0.52;
    patty.castShadow = true;
    patty.receiveShadow = true;
    burgerGroup.add(patty);

    // LAYER 4: Melted Cheddar Cheese with Dripping Corners
    const cheesePlateGeo = new THREE.BoxGeometry(2.18, 0.06, 2.18);
    const cheese = new THREE.Mesh(cheesePlateGeo, cheeseMaterial);
    cheese.position.y = -0.22;
    cheese.rotation.y = Math.PI / 4;
    cheese.castShadow = true;
    cheese.receiveShadow = true;
    burgerGroup.add(cheese);

    // Drips running down the patty corners
    const dripPositions = [
      { x: 1.15, y: -0.42, z: 0, rz: 0.3 },
      { x: -1.15, y: -0.42, z: 0, rz: -0.3 },
      { x: 0, y: -0.42, z: 1.15, rx: -0.3 },
      { x: 0, y: -0.42, z: -1.15, rx: 0.3 },
    ];
    dripPositions.forEach((pos) => {
      const dripGeo = new THREE.ConeGeometry(0.18, 0.4, 16);
      const drip = new THREE.Mesh(dripGeo, cheeseMaterial);
      drip.position.set(pos.x, pos.y, pos.z);
      drip.rotation.x = (pos.rx || 0) + Math.PI;
      drip.rotation.z = pos.rz || 0;
      drip.castShadow = true;
      burgerGroup.add(drip);
    });

    // LAYER 5: Fresh Ruffled Lettuce (Multiple wavy overlapping leaves)
    const lettuceGroup = new THREE.Group();
    const leafCount = 10;
    for (let i = 0; i < leafCount; i++) {
      const angle = (i * Math.PI * 2) / leafCount;
      const leafGeo = new THREE.CircleGeometry(0.72, 20);
      const leaf = new THREE.Mesh(leafGeo, lettuceMaterial);
      leaf.position.set(Math.cos(angle) * 1.25, -0.1, Math.sin(angle) * 1.25);
      leaf.rotation.x = -Math.PI / 2 + 0.28 * Math.sin(i * 1.5);
      leaf.rotation.y = angle;
      leaf.rotation.z = 0.15 * Math.cos(i);
      leaf.castShadow = true;
      lettuceGroup.add(leaf);
    }
    burgerGroup.add(lettuceGroup);

    // LAYER 6: Juicy Ripe Sliced Tomatoes (Two glossy discs with visible tilt)
    const tomato1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.12, 32),
      tomatoMaterial
    );
    tomato1.position.set(-0.48, 0.12, -0.16);
    tomato1.rotation.z = 0.06;
    tomato1.rotation.x = 0.04;
    tomato1.castShadow = true;
    burgerGroup.add(tomato1);

    const tomato2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.12, 32),
      tomatoMaterial
    );
    tomato2.position.set(0.5, 0.15, 0.14);
    tomato2.rotation.z = -0.06;
    tomato2.rotation.x = -0.04;
    tomato2.castShadow = true;
    burgerGroup.add(tomato2);

    // LAYER 7: Golden Brioche Top Bun Crown (Glossy Dome)
    const topBunGeo = new THREE.SphereGeometry(1.62, 42, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const topBun = new THREE.Mesh(topBunGeo, topBunMaterial);
    topBun.position.y = 0.25;
    topBun.scale.set(1, 0.68, 1);
    topBun.castShadow = true;
    topBun.receiveShadow = true;
    burgerGroup.add(topBun);

    // LAYER 8: 60+ Toasted Ivory Sesame Seeds
    const seedGeo = new THREE.SphereGeometry(0.048, 10, 10);
    seedGeo.scale(1, 0.5, 1.85);

    for (let i = 0; i < 68; i++) {
      const seed = new THREE.Mesh(seedGeo, seedMaterial);
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.44;

      const r = 1.63;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.68 + 0.25;
      const z = r * Math.sin(phi) * Math.sin(theta);

      seed.position.set(x, y, z);
      seed.lookAt(x * 2, y * 2, z * 2);
      burgerGroup.add(seed);
    }

    // Initial position
    burgerGroup.position.set(0, 0.08, 0);

    // 5. TRUE INTERACTIVE DRAG & ROTATION CONTROLS
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let targetRotationX = 0.08;
    let targetRotationY = 0;
    let currentRotationX = 0.08;
    let currentRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousPointerPosition = { x: e.clientX, y: e.clientY };
      if (container) container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      // Adjust rotation with sensitivity
      targetRotationY += deltaX * 0.009;
      targetRotationX += deltaY * 0.007;

      // Restrict vertical pitch to prevent unnatural flipping
      targetRotationX = Math.max(-0.55, Math.min(0.75, targetRotationX));

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      setIsInteracting(false);
      try {
        if (container && container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe catch
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // 6. Smooth Animation Loop with Inertia and Bob
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // If user is not actively dragging, apply gentle idle spin
      if (!isDragging) {
        targetRotationY += 0.0045;
      }

      // Smooth interpolation for silky physics feel
      currentRotationX += (targetRotationX - currentRotationX) * 0.09;
      currentRotationY += (targetRotationY - currentRotationY) * 0.09;

      burgerGroup.rotation.x = currentRotationX;
      burgerGroup.rotation.y = currentRotationY;

      // Gentle floating bob
      burgerGroup.position.y = 0.08 + Math.sin(elapsed * 1.6) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] overflow-hidden rounded-3xl border border-amber-200/60 shadow-lg select-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #fff7ed 0%, #fef3c7 40%, #fde68a 80%, #fed7aa 100%)",
      }}
    >
      {/* Blurred Culinary Bistro Depth Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm Bokeh Circles blurred in background */}
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-amber-300/40 blur-3xl" />
        <div className="absolute top-1/2 -right-12 h-72 w-72 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-60 w-60 rounded-full bg-amber-500/20 blur-3xl" />

        {/* Subtle Bistro Woodgrain / Atmospheric Texture */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(#78350f 1px, transparent 1px), radial-gradient(#78350f 1px, #fff7ed 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Ambient Vignette to focus eyes on burger */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-amber-950/15" />
      </div>

      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={mountRef}
        className={`relative z-10 w-full h-full touch-none ${
          isInteracting ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-5 z-20 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-amber-200/80 px-4 py-1.5 shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e25b27] animate-pulse" />
        <span className="text-xs font-black tracking-wide text-stone-900 uppercase">
          3D Interactive Smashed Burger Clone
        </span>
      </div>

      {/* Bottom Floating Interactive Instruction Badge */}
      <div className="pointer-events-none absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between text-xs text-stone-700 font-bold">
        <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span>{isHovered ? "🖐️ Drag freely to rotate 360°" : "✨ Click & drag to rotate"}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span className="text-[#e25b27]">●</span>
          <span>Photorealistic Brioche, Cheddar & Patty Layers</span>
        </div>
      </div>
    </div>
  );
};
