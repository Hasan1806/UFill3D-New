'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

// Safe WebGL prototype guards to guarantee getShaderInfoLog / getProgramInfoLog never return null to .trim()
if (typeof window !== 'undefined') {
  const safePatch = (proto: any, fnName: string) => {
    if (!proto || !proto[fnName]) return;
    const flag = `__safe_${fnName}`;
    if (proto[flag]) return;
    const original = proto[fnName];
    proto[fnName] = function (...args: any[]) {
      const result = original.apply(this, args);
      return result != null ? result : '';
    };
    proto[flag] = true;
  };

  if (typeof WebGLRenderingContext !== 'undefined') {
    safePatch(WebGLRenderingContext.prototype, 'getShaderInfoLog');
    safePatch(WebGLRenderingContext.prototype, 'getProgramInfoLog');
  }
  if (typeof WebGL2RenderingContext !== 'undefined') {
    safePatch(WebGL2RenderingContext.prototype, 'getShaderInfoLog');
    safePatch(WebGL2RenderingContext.prototype, 'getProgramInfoLog');
  }
}

export interface SpoolCanvasHandle {
  setProgress: (progress: number) => void;
}

interface SpoolCanvasProps {
  color?: string;
  finish?: 'Matte' | 'Silk' | 'Gloss' | 'Translucent';
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  positionX?: number;
  positionY?: number;
  scale?: number;
  interactive?: boolean;
  className?: string;
  autoRotateSpeed?: number;
  scrollDriven?: boolean;
}

// Exactly matching the requested 3D checkpoints (in radians)
const ORIENTATION_KEYFRAMES = [
  { progress: 0.00, rotX: 0.00,  rotY: 0.00, rotZ: 0.00, posX: 1.48, posY: 0.00,  posZ: 0.00, scale: 1.06 },
  { progress: 0.20, rotX: -0.25, rotY: 0.45, rotZ: 0.80, posX: 0.90, posY: -0.08, posZ: 0.35, scale: 1.18 },
  { progress: 0.40, rotX: 0.35,  rotY: 1.10, rotZ: 1.60, posX: 0.15, posY: 0.10,  posZ: 0.80, scale: 1.28 },
  { progress: 0.60, rotX: -0.30, rotY: 2.00, rotZ: 2.50, posX: -0.55, posY: -0.05, posZ: 1.25, scale: 1.42 },
  { progress: 0.80, rotX: 0.20,  rotY: 2.80, rotZ: 3.50, posX: 0.00, posY: 0.05,  posZ: 1.90, scale: 1.75 },
  { progress: 1.00, rotX: 0.00,  rotY: 3.50, rotZ: 4.50, posX: 0.00, posY: 0.00,  posZ: 3.40, scale: 2.70 },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Premium Effect Three: Cinematic Motion Holds
// Smoothly retimes progress to linger on the most stunning 3D perspective compositions
// (specifically the 38%-55% side thickness view and unspooling angle)
// while preserving continuous, monotonically increasing, reversible movement with zero dead zones.
function computePacedProgress(rawP: number): number {
  const p = clamp(rawP, 0, 1);
  const hold1 = Math.sin(p * Math.PI * 2.0) * 0.022;
  const midDist = Math.max(0, Math.min(1, (p - 0.22) / 0.44));
  const hold2 = Math.sin(midDist * Math.PI) * -0.052;
  return clamp(p + hold1 + hold2, 0, 1);
}

export const FilamentSpoolCanvas = forwardRef<SpoolCanvasHandle, SpoolCanvasProps>(
  function FilamentSpoolCanvas(
    {
      color = '#6258F5',
      finish = 'Silk',
      rotationX = 0.2,
      rotationY = -0.5,
      rotationZ = 0.02,
      positionX = 0,
      positionY = 0,
      scale = 1,
      interactive = false,
      className = 'w-full h-full',
      autoRotateSpeed = 0.002,
      scrollDriven = false,
    },
    forwardedRef
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const fallbackRef = useRef<HTMLDivElement>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const strandMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const spoolGroupRef = useRef<THREE.Group | null>(null);
    const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
    const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const progressRef = useRef(0);
    const visibleRef = useRef(true);
    const frameRef = useRef<number | null>(null);
    const pointerRef = useRef({ dragging: false, previousX: 0, tilt: 0, spin: 0 });
    const propsRef = useRef({ rotationX, rotationY, rotationZ, positionX, positionY, scale, autoRotateSpeed });
    const renderRef = useRef<() => void>(() => undefined);

    useImperativeHandle(
      forwardedRef,
      () => ({
        setProgress(nextProgress) {
          progressRef.current = clamp(nextProgress);
          renderRef.current();
        },
      }),
      []
    );

    useEffect(() => {
      propsRef.current = { rotationX, rotationY, rotationZ, positionX, positionY, scale, autoRotateSpeed };
      renderRef.current();
    }, [rotationX, rotationY, rotationZ, positionX, positionY, scale, autoRotateSpeed]);

    useEffect(() => {
      const material = materialRef.current;
      const strandMat = strandMaterialRef.current;
      if (!material) return;
      material.color.set(color);
      if (strandMat) strandMat.color.set(color);

      const finishes = {
        Matte: { roughness: 0.72, metalness: 0.02 },
        Silk: { roughness: 0.28, metalness: 0.12 },
        Gloss: { roughness: 0.14, metalness: 0.04 },
        Translucent: { roughness: 0.38, metalness: 0.01 },
      } as const;
      const config = finishes[finish] || finishes.Silk;
      Object.assign(material, config);
      if (strandMat) Object.assign(strandMat, config);
      material.needsUpdate = true;
      if (strandMat) strandMat.needsUpdate = true;
      renderRef.current();
    }, [color, finish]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, 7.8);
      cameraRef.current = camera;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
      } catch (err) {
        console.warn('WebGL initialization failed, falling back:', err);
        if (fallbackRef.current) fallbackRef.current.style.display = 'flex';
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      if (fallbackRef.current) fallbackRef.current.style.display = 'none';

      // Studio 3-Point Lighting with Electric Periwinkle Rim Highlight
      scene.add(new THREE.HemisphereLight(0xffffff, 0xd4d8f0, 2.0));

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
      keyLight.position.set(5, 6, 6);
      scene.add(keyLight);
      keyLightRef.current = keyLight;

      const fillLight = new THREE.DirectionalLight(0xbab5ff, 1.8);
      fillLight.position.set(-6, -1, 4);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x6258f5, 3.8);
      rimLight.position.set(0, 4.5, -5);
      scene.add(rimLight);
      rimLightRef.current = rimLight;

      // Parent Three.js Group holding the entire physical spool
      const spoolGroup = new THREE.Group();
      spoolGroupRef.current = spoolGroup;
      scene.add(spoolGroup);

      // Dimensions
      const outerRadius = 2.15;
      const spoolWidth = 1.30;
      const hubRadius = 0.92;
      const arborRadius = 0.38;

      // High-grade technical smoked polycarbonate material for flanges
      const flangeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x161a35,
        roughness: 0.22,
        metalness: 0.14,
        transmission: 0.28,
        thickness: 0.65,
        transparent: true,
        opacity: 0.92,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
      });

      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x0c0f24,
        roughness: 0.38,
        metalness: 0.18,
      });

      const hubMaterial = new THREE.MeshStandardMaterial({
        color: 0x060812,
        roughness: 0.65,
        metalness: 0.1,
      });

      // Procedural micro-groove bump texture for realistic filament winding ridges
      let bumpTexture: THREE.CanvasTexture | null = null;
      try {
        const canvasTex = document.createElement('canvas');
        canvasTex.width = 128;
        canvasTex.height = 512;
        const ctx = canvasTex.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#808080';
          ctx.fillRect(0, 0, 128, 512);
          for (let y = 0; y < 512; y += 4) {
            ctx.fillStyle = y % 8 === 0 ? '#383838' : '#c8c8c8';
            ctx.fillRect(0, y, 128, 2);
          }
          bumpTexture = new THREE.CanvasTexture(canvasTex);
          bumpTexture.wrapS = THREE.RepeatWrapping;
          bumpTexture.wrapT = THREE.RepeatWrapping;
          bumpTexture.repeat.set(1, 38);
        }
      } catch {
        bumpTexture = null;
      }

      // Filament Material
      const filamentMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: finish === 'Matte' ? 0.72 : finish === 'Gloss' ? 0.14 : 0.28,
        metalness: finish === 'Silk' ? 0.12 : 0.02,
        bumpMap: bumpTexture,
        bumpScale: 0.032,
      });
      materialRef.current = filamentMaterial;

      // 1. Two Circular Side Flanges (Front at +Z, Back at -Z)
      for (const side of [-1, 1]) {
        const flangeZ = side * (spoolWidth * 0.5 + 0.05);
        const flangeGroup = new THREE.Group();
        flangeGroup.position.z = flangeZ;

        // Outer Beveled Rim Ring (gives tangible edge thickness)
        const outerRimGeo = new THREE.TorusGeometry(outerRadius - 0.03, 0.055, 12, 64);
        const outerRimMesh = new THREE.Mesh(outerRimGeo, edgeMaterial);
        flangeGroup.add(outerRimMesh);

        // Circular Disk Body
        const diskGeo = new THREE.RingGeometry(hubRadius, outerRadius, 64);
        const diskMesh = new THREE.Mesh(diskGeo, flangeMaterial);
        flangeGroup.add(diskMesh);

        // Inner Hub Lip
        const innerRimGeo = new THREE.TorusGeometry(hubRadius, 0.035, 12, 48);
        const innerRimMesh = new THREE.Mesh(innerRimGeo, edgeMaterial);
        flangeGroup.add(innerRimMesh);

        // 6 Radial Cutout Windows (Provides real see-through depth to inner layers)
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const slotGeo = new THREE.BoxGeometry(0.36, 0.76, 0.08);
          const slotMat = new THREE.MeshBasicMaterial({ color: 0x050711 });
          const slot = new THREE.Mesh(slotGeo, slotMat);
          slot.position.set(
            Math.cos(angle) * 1.5,
            Math.sin(angle) * 1.5,
            0
          );
          slot.rotation.z = angle + Math.PI / 2;
          flangeGroup.add(slot);
        }

        spoolGroup.add(flangeGroup);
      }

      // 2. Central Barrel / Core Cylinder (Connects both flanges along Z)
      const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, spoolWidth, 48);
      const hubMesh = new THREE.Mesh(hubGeo, hubMaterial);
      hubMesh.rotation.x = Math.PI / 2;
      spoolGroup.add(hubMesh);

      // 3. Central Arbor Tube (Through-hole axle)
      const arborGeo = new THREE.CylinderGeometry(arborRadius, arborRadius, spoolWidth + 0.32, 32);
      const arborMesh = new THREE.Mesh(arborGeo, edgeMaterial);
      arborMesh.rotation.x = Math.PI / 2;
      spoolGroup.add(arborMesh);

      // 4. Tightly Wound Filament Coil (With realistic cylindrical thickness & ridges)
      const woundRadius = 1.92;
      const coilWidth = spoolWidth - 0.05;
      const coilGeo = new THREE.CylinderGeometry(woundRadius, woundRadius, coilWidth, 64);
      const coilMesh = new THREE.Mesh(coilGeo, filamentMaterial);
      coilMesh.rotation.x = Math.PI / 2;
      spoolGroup.add(coilMesh);

      // Stepped Winding Ridges (Visible round strand layers)
      for (const stepZ of [-coilWidth * 0.44, -coilWidth * 0.16, coilWidth * 0.16, coilWidth * 0.44]) {
        const stepGeo = new THREE.TorusGeometry(woundRadius - 0.015, 0.028, 8, 48);
        const stepMesh = new THREE.Mesh(stepGeo, filamentMaterial);
        stepMesh.position.z = stepZ;
        spoolGroup.add(stepMesh);
      }

      // 5. Leading Uncoiling Strand
      const curvePoints = [
        new THREE.Vector3(woundRadius * 0.95, -0.4, spoolWidth * 0.5 - 0.1),
        new THREE.Vector3(woundRadius + 0.35, -0.85, spoolWidth * 0.5 + 0.25),
        new THREE.Vector3(woundRadius + 1.1, -1.35, spoolWidth * 0.5 + 0.65),
        new THREE.Vector3(woundRadius + 1.8, -1.85, spoolWidth * 0.5 + 1.05),
      ];
      const strandCurve = new THREE.CatmullRomCurve3(curvePoints);
      const strandGeo = new THREE.TubeGeometry(strandCurve, 48, 0.036, 8, false);
      const strandMaterial = filamentMaterial.clone();
      strandMaterial.bumpMap = null;
      strandMaterialRef.current = strandMaterial;
      const strandMesh = new THREE.Mesh(strandGeo, strandMaterial);
      spoolGroup.add(strandMesh);

      // Floor Shadow
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.85, 32),
        new THREE.MeshBasicMaterial({ color: 0x11152e, transparent: true, opacity: 0.12, depthWrite: false })
      );
      shadow.scale.set(1.3, 0.26, 1);
      shadow.position.set(0.1, -2.3, -1.2);
      scene.add(shadow);

      // True 3D Multi-Axis Transformation Interpolator with Premium Cinematic Effects
      const applyTransforms = () => {
        if (!spoolGroupRef.current) return;
        const p = propsRef.current;
        const rawProgress = progressRef.current;

        if (scrollDriven) {
          const isMobile = window.innerWidth < 1024;
          // Effect 3: Cinematic Motion Holds re-timing
          const paced = computePacedProgress(rawProgress);

          // Find current keyframe segment based on paced progress
          let segIndex = 0;
          for (let i = 0; i < ORIENTATION_KEYFRAMES.length - 1; i++) {
            if (paced >= ORIENTATION_KEYFRAMES[i].progress && paced <= ORIENTATION_KEYFRAMES[i + 1].progress) {
              segIndex = i;
              break;
            }
          }
          if (paced >= 1) segIndex = ORIENTATION_KEYFRAMES.length - 2;

          const k1 = ORIENTATION_KEYFRAMES[segIndex];
          const k2 = ORIENTATION_KEYFRAMES[segIndex + 1];
          const segRange = k2.progress - k1.progress;
          const rawT = segRange > 0 ? (paced - k1.progress) / segRange : 0;
          // Smooth sinusoidal ease between checkpoints
          const t = 0.5 - 0.5 * Math.cos(rawT * Math.PI);

          const rotX = lerp(k1.rotX, k2.rotX, t);
          const rotY = lerp(k1.rotY, k2.rotY, t);
          const rotZ = lerp(k1.rotZ, k2.rotZ, t);

          let posX = lerp(k1.posX, k2.posX, t);
          let posY = lerp(k1.posY, k2.posY, t);
          let posZ = lerp(k1.posZ, k2.posZ, t);
          let sc = lerp(k1.scale, k2.scale, t);

          // Effect 1: Cinematic Depth Parallax & Floating Motion
          // Subtle breathing/floating motion directly linked to scroll progress
          const floatSway = Math.sin(paced * Math.PI * 3.6) * 0.032;
          posY += floatSway;

          if (isMobile) {
            // Mobile adjustments: centered horizontally, scaled down for smaller viewports
            posX = 0;
            posY = lerp(0.65, -0.1, paced) + floatSway;
            posZ = lerp(0, 1.8, paced);
            sc = sc * 0.72;
          }

          spoolGroupRef.current.rotation.set(rotX, rotY, rotZ);
          spoolGroupRef.current.position.set(posX, posY, posZ);
          spoolGroupRef.current.scale.setScalar(sc);

          // Effect 1 (Continued): Gentle Camera Dolly & Perspective Shift
          if (cameraRef.current) {
            const baseZ = isMobile ? 8.6 : 7.8;
            const dollyZ = Math.sin(paced * Math.PI) * 0.38; // Pulls subtly closer during dramatic side profile
            const lateralParallaxX = Math.sin(paced * Math.PI * 1.5) * 0.18;
            const lateralParallaxY = Math.cos(paced * Math.PI * 1.2) * 0.10;

            cameraRef.current.position.set(lateralParallaxX, lateralParallaxY, baseZ - dollyZ);
            cameraRef.current.lookAt(posX * 0.28, posY * 0.28, 0);
          }

          // Effect 2: Dynamic Light Sweep across the winding ridges and translucent flange lips
          if (keyLightRef.current) {
            const sweepAngle = paced * Math.PI * 1.6;
            keyLightRef.current.position.set(
              4.5 + Math.cos(sweepAngle) * 2.2,
              5.5 + Math.sin(sweepAngle * 0.8) * 1.4,
              5.5 + Math.sin(sweepAngle) * 2.5
            );
            keyLightRef.current.intensity = 3.6 + Math.sin(paced * Math.PI) * 0.8;
          }

          if (rimLightRef.current) {
            rimLightRef.current.position.set(
              Math.sin(paced * Math.PI * 2.2) * 3.2,
              4.5 + Math.cos(paced * Math.PI * 1.5) * 1.2,
              -4.8 + Math.cos(paced * Math.PI) * 1.5
            );
            rimLightRef.current.intensity = 3.8 + Math.sin(paced * Math.PI * 1.2) * 1.0;
          }
        } else {
          // Interactive / prop controlled mode (e.g. Color Studio)
          spoolGroupRef.current.rotation.set(
            p.rotationX + pointerRef.current.tilt,
            p.rotationY,
            p.rotationZ
          );
          spoolGroupRef.current.position.set(p.positionX, p.positionY, 0);
          spoolGroupRef.current.scale.setScalar(p.scale);
        }
      };

      renderRef.current = () => {
        if (!visibleRef.current) return;
        try {
          applyTransforms();
          renderer.render(scene, camera);
        } catch (err) {
          console.warn('Three.js render error caught:', err);
          if (fallbackRef.current) fallbackRef.current.style.display = 'flex';
        }
      };

      const resize = () => {
        const width = Math.max(1, container.clientWidth);
        const height = Math.max(1, container.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 640 ? 8.6 : 7.8;
        camera.updateProjectionMatrix();
        renderRef.current();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) renderRef.current();
        },
        { rootMargin: '120px' }
      );
      intersectionObserver.observe(container);

      const pointerDown = (event: PointerEvent) => {
        if (!interactive) return;
        pointerRef.current.dragging = true;
        pointerRef.current.previousX = event.clientX;
        container.setPointerCapture(event.pointerId);
      };
      const pointerMove = (event: PointerEvent) => {
        if (!interactive || !pointerRef.current.dragging) return;
        const deltaX = event.clientX - pointerRef.current.previousX;
        pointerRef.current.spin += deltaX * 0.009;
        pointerRef.current.tilt = clamp((event.clientY / Math.max(1, container.clientHeight) - 0.5) * 0.3, -0.2, 0.2);
        pointerRef.current.previousX = event.clientX;
        renderRef.current();
      };
      const pointerUp = (event: PointerEvent) => {
        pointerRef.current.dragging = false;
        if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
      };

      if (interactive) {
        container.addEventListener('pointerdown', pointerDown);
        container.addEventListener('pointermove', pointerMove);
        container.addEventListener('pointerup', pointerUp);
        container.addEventListener('pointercancel', pointerUp);

        const animate = () => {
          if (interactive && visibleRef.current && !pointerRef.current.dragging) {
            pointerRef.current.spin += propsRef.current.autoRotateSpeed;
            renderRef.current();
          }
          frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
      }

      resize();

      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        if (interactive) {
          container.removeEventListener('pointerdown', pointerDown);
          container.removeEventListener('pointermove', pointerMove);
          container.removeEventListener('pointerup', pointerUp);
          container.removeEventListener('pointercancel', pointerUp);
        }
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        });
        if (bumpTexture) bumpTexture.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        materialRef.current = null;
        strandMaterialRef.current = null;
        spoolGroupRef.current = null;
        keyLightRef.current = null;
        rimLightRef.current = null;
        cameraRef.current = null;
      };
    }, [interactive, scrollDriven]);

    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`relative select-none ${interactive ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-none'} ${className}`}
        style={{ touchAction: interactive ? 'pan-y' : 'auto' }}
      >
        <div ref={fallbackRef} className="absolute inset-0 flex items-center justify-center">
          <div className="relative aspect-square w-[64%] max-w-[330px] rotate-[-8deg] rounded-full border-[18px] border-[#151932] bg-[#6258F5] shadow-[inset_0_0_0_14px_rgba(255,255,255,0.14),0_28px_50px_rgba(17,21,46,0.18)] sm:border-[24px]">
            <div className="absolute inset-[31%] rounded-full border-[10px] border-[#151932] bg-[#050713] sm:border-[14px]" />
            <div className="absolute inset-x-[11%] top-[20%] h-1 rounded-full bg-white/25" />
            <div className="absolute -bottom-[12%] -right-[12%] h-[44%] w-[3px] origin-top rotate-[-24deg] rounded-full bg-[#6258F5]" />
          </div>
        </div>
      </div>
    );
  }
);

export default FilamentSpoolCanvas;
