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

// Ultra-Premium Cinematic 3D Timeline Keyframes (0% to 100% continuous progression)
// Preserves the exact verified rotational baseline while adding 6-DOF camera orbit, dolly-zoom, and spatial momentum
const CINEMATIC_TIMELINE_KEYFRAMES = [
  // 0% - 12%: Opening composition (facing user, subtle depth float)
  { progress: 0.00, rotX: 0.00,  rotY: 0.00, rotZ: 0.00, posX: 1.48, posY: 0.00,  posZ: 0.00, scale: 1.05, fov: 38.0, orbitAngle: 0.00, dollyZ: 0.00 },
  { progress: 0.12, rotX: -0.12, rotY: 0.20, rotZ: 0.35, posX: 1.30, posY: -0.04, posZ: 0.15, scale: 1.10, fov: 38.0, orbitAngle: 0.06, dollyZ: 0.08 },
  
  // 12% - 27%: First 3D rotation & gentle camera orbit revealing flange depth
  { progress: 0.27, rotX: -0.25, rotY: 0.55, rotZ: 0.95, posX: 0.85, posY: -0.08, posZ: 0.42, scale: 1.18, fov: 37.8, orbitAngle: 0.18, dollyZ: 0.22 },

  // 27% - 43%: Three-quarter product reveal (63° side angle, wound core & cutout windows)
  { progress: 0.43, rotX: 0.35,  rotY: 1.10, rotZ: 1.65, posX: 0.15, posY: 0.10,  posZ: 0.85, scale: 1.28, fov: 37.5, orbitAngle: 0.32, dollyZ: 0.38 },

  // 43% - 58%: Continuous spatial sweep across viewport, edge-on width & rear flange reveal
  { progress: 0.58, rotX: -0.30, rotY: 2.05, rotZ: 2.55, posX: -0.55, posY: -0.05, posZ: 1.30, scale: 1.42, fov: 37.2, orbitAngle: 0.24, dollyZ: 0.45 },

  // 58% - 73%: Camera approach & re-centering with rotational momentum
  { progress: 0.73, rotX: 0.18,  rotY: 2.75, rotZ: 3.45, posX: -0.05, posY: 0.04,  posZ: 1.85, scale: 1.70, fov: 36.8, orbitAngle: 0.10, dollyZ: 0.65 },

  // 73% - 88%: Cinematic dolly zoom into spool geometry (camera moves in, FOV tightens)
  { progress: 0.88, rotX: 0.05,  rotY: 3.20, rotZ: 4.10, posX: 0.00, posY: 0.00,  posZ: 2.80, scale: 2.25, fov: 35.5, orbitAngle: 0.02, dollyZ: 1.15 },

  // 88% - 100%: Seamless transition hand-off into technical content
  { progress: 1.00, rotX: 0.00,  rotY: 3.50, rotZ: 4.50, posX: 0.00, posY: 0.00,  posZ: 3.60, scale: 2.80, fov: 34.5, orbitAngle: 0.00, dollyZ: 1.45 },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Premium Effect 04 & 08: Micro-Rotation Momentum & Seamless Motion Bridging
// Smoothly retimes progress to linger on the most stunning 3D perspective compositions (38%-55% side thickness view)
// while preserving continuous, monotonically increasing, reversible movement with zero dead zones.
function computePacedProgress(rawP: number): number {
  const p = clamp(rawP, 0, 1);
  const hold1 = Math.sin(p * Math.PI * 2.0) * 0.020;
  const midDist = Math.max(0, Math.min(1, (p - 0.22) / 0.44));
  const hold2 = Math.sin(midDist * Math.PI) * -0.048;
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
    const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
    const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
    const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
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
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4d8f0, 2.0);
      scene.add(hemiLight);
      hemiLightRef.current = hemiLight;

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
      keyLight.position.set(5, 6, 6);
      scene.add(keyLight);
      keyLightRef.current = keyLight;

      const fillLight = new THREE.DirectionalLight(0xbab5ff, 1.8);
      fillLight.position.set(-6, -1, 4);
      scene.add(fillLight);
      fillLightRef.current = fillLight;

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

      // True 3D Multi-Axis Transformation Interpolator with 8 Premium Cinematic Effects
      const applyTransforms = () => {
        if (!spoolGroupRef.current) return;
        const p = propsRef.current;
        const rawProgress = progressRef.current;

        if (scrollDriven) {
          const isMobile = window.innerWidth < 1024;
          // Effect 04 & 08: Cinematic Motion Holds & Momentum re-timing
          const paced = computePacedProgress(rawProgress);

          // Find current keyframe segment based on paced progress
          let segIndex = 0;
          for (let i = 0; i < CINEMATIC_TIMELINE_KEYFRAMES.length - 1; i++) {
            if (paced >= CINEMATIC_TIMELINE_KEYFRAMES[i].progress && paced <= CINEMATIC_TIMELINE_KEYFRAMES[i + 1].progress) {
              segIndex = i;
              break;
            }
          }
          if (paced >= 1) segIndex = CINEMATIC_TIMELINE_KEYFRAMES.length - 2;

          const k1 = CINEMATIC_TIMELINE_KEYFRAMES[segIndex];
          const k2 = CINEMATIC_TIMELINE_KEYFRAMES[segIndex + 1];
          const segRange = k2.progress - k1.progress;
          const rawT = segRange > 0 ? (paced - k1.progress) / segRange : 0;
          // Smooth sinusoidal ease between checkpoints (eliminates any angular jerk)
          const t = 0.5 - 0.5 * Math.cos(rawT * Math.PI);

          const rotX = lerp(k1.rotX, k2.rotX, t);
          const rotY = lerp(k1.rotY, k2.rotY, t);
          const rotZ = lerp(k1.rotZ, k2.rotZ, t);

          let posX = lerp(k1.posX, k2.posX, t);
          let posY = lerp(k1.posY, k2.posY, t);
          let posZ = lerp(k1.posZ, k2.posZ, t);
          let sc = lerp(k1.scale, k2.scale, t);
          const targetFov = lerp(k1.fov, k2.fov, t);
          const orbitAngle = lerp(k1.orbitAngle, k2.orbitAngle, t);
          const dollyZ = lerp(k1.dollyZ, k2.dollyZ, t);

          // Effect 03: Magnetic Depth Parallax & Floating Motion
          // Subtle breathing/floating motion directly linked to scroll progress
          const floatSway = Math.sin(paced * Math.PI * 3.6) * 0.028;
          posY += floatSway;

          if (isMobile) {
            // Mobile adjustments: centered horizontally, scaled for portrait viewports
            posX = 0;
            posY = lerp(0.65, -0.08, paced) + floatSway;
            posZ = lerp(0, 1.6, paced);
            sc = sc * 0.72;
          }

          spoolGroupRef.current.rotation.set(rotX, rotY, rotZ);
          spoolGroupRef.current.position.set(posX, posY, posZ);
          spoolGroupRef.current.scale.setScalar(sc);

          // Effect 01 & 05: Cinematic Camera Orbit & Dolly Zoom
          if (cameraRef.current) {
            const baseCamZ = isMobile ? 8.6 : 7.8;
            const camZ = baseCamZ - dollyZ;
            const lateralParallaxX = Math.sin(paced * Math.PI * 1.5) * 0.16;
            const lateralParallaxY = Math.cos(paced * Math.PI * 1.2) * 0.08;
            const camX = Math.sin(orbitAngle) * (isMobile ? 1.0 : 1.8) + lateralParallaxX;
            const camY = Math.cos(orbitAngle * 1.2) * 0.18 + lateralParallaxY;

            cameraRef.current.position.set(camX, camY, camZ);
            cameraRef.current.lookAt(posX * 0.32, posY * 0.32, 0);

            // Dynamic Perspective FOV adjustment for true Hitchcock Dolly-Zoom effect
            if (cameraRef.current.fov !== targetFov) {
              cameraRef.current.fov = targetFov;
              cameraRef.current.updateProjectionMatrix();
            }
          }

          // Effect 02 & 06: Dynamic Product Lighting & Traveling Rim Highlight
          if (keyLightRef.current) {
            const sweepAngle = paced * Math.PI * 1.6;
            keyLightRef.current.position.set(
              4.5 + Math.cos(sweepAngle) * 2.4,
              5.5 + Math.sin(sweepAngle * 0.8) * 1.5,
              5.5 + Math.sin(sweepAngle) * 2.6
            );
            keyLightRef.current.intensity = 3.6 + Math.sin(paced * Math.PI) * 0.9;
          }

          if (rimLightRef.current) {
            rimLightRef.current.position.set(
              Math.sin(paced * Math.PI * 2.2) * 3.4,
              4.5 + Math.cos(paced * Math.PI * 1.5) * 1.4,
              -4.8 + Math.cos(paced * Math.PI) * 1.6
            );
            rimLightRef.current.intensity = 3.8 + Math.sin(paced * Math.PI * 1.2) * 1.2;
          }

          if (hemiLightRef.current) {
            // Subtle ambient illumination variation matching three-quarter shadows
            hemiLightRef.current.intensity = 2.0 + Math.sin(paced * Math.PI) * 0.35;
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
        fillLightRef.current = null;
        rimLightRef.current = null;
        hemiLightRef.current = null;
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
