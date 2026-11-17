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
  triggerColorSwitch: (newColor: string, finish?: 'Matte' | 'Silk' | 'Gloss' | 'Translucent', rimHex?: string) => void;
  triggerEntrance: () => void;
}

interface SpoolCanvasProps {
  color?: string;
  finish?: 'Matte' | 'Silk' | 'Gloss' | 'Translucent';
  rimColor?: string;
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
  enableMouseParallax?: boolean;
}

// Snappy, Fluid 3D Timeline Keyframes
const CINEMATIC_TIMELINE_KEYFRAMES = [
  // 0% - 15%: Opening hero composition
  { progress: 0.00, rotX: 0.18,  rotY: -0.42, rotZ: 0.05, posX: 1.45, posY: 0.00,  posZ: 0.00, scale: 1.08, fov: 38.0, orbitAngle: 0.00, dollyZ: 0.00 },
  { progress: 0.15, rotX: -0.06, rotY: 0.18,  rotZ: 0.30, posX: 1.25, posY: -0.04, posZ: 0.15, scale: 1.12, fov: 38.0, orbitAngle: 0.06, dollyZ: 0.08 },
  
  // 15% - 35%: First 3D rotation revealing transparent flange & core
  { progress: 0.35, rotX: -0.20, rotY: 0.65,  rotZ: 0.90, posX: 0.75, posY: -0.06, posZ: 0.40, scale: 1.20, fov: 37.8, orbitAngle: 0.16, dollyZ: 0.20 },

  // 35% - 60%: Three-quarter product reveal (wound core & cutout windows)
  { progress: 0.60, rotX: 0.30,  rotY: 1.25,  rotZ: 1.60, posX: 0.10, posY: 0.08,  posZ: 0.80, scale: 1.30, fov: 37.5, orbitAngle: 0.28, dollyZ: 0.35 },

  // 60% - 85%: Edge-on width & rear flange reveal
  { progress: 0.85, rotX: -0.22, rotY: 2.15,  rotZ: 2.45, posX: -0.45, posY: -0.04, posZ: 1.20, scale: 1.40, fov: 37.2, orbitAngle: 0.20, dollyZ: 0.40 },

  // 85% - 100%: Re-centering transition hand-off into section 2
  { progress: 1.00, rotX: 0.00,  rotY: 2.90,  rotZ: 3.30, posX: 0.00, posY: 0.00,  posZ: 1.80, scale: 1.55, fov: 36.8, orbitAngle: 0.00, dollyZ: 0.55 },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const FilamentSpoolCanvas = forwardRef<SpoolCanvasHandle, SpoolCanvasProps>(
  function FilamentSpoolCanvas(
    {
      color = '#6258F5',
      finish = 'Silk',
      rimColor = '#6258F5',
      rotationX = 0.22,
      rotationY = -0.45,
      rotationZ = 0.04,
      positionX = 0,
      positionY = 0,
      scale = 1,
      interactive = false,
      className = 'w-full h-full',
      autoRotateSpeed = 0.002,
      scrollDriven = false,
      enableMouseParallax = true,
    },
    forwardedRef
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const fallbackRef = useRef<HTMLDivElement>(null);
    
    // 3D Objects & Materials
    const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const strandMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const spoolGroupRef = useRef<THREE.Group | null>(null);
    const entranceGroupRef = useRef<THREE.Group | null>(null);
    const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
    const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    
    // State refs
    const progressRef = useRef(0);
    const visibleRef = useRef(true);
    const frameRef = useRef<number | null>(null);
    const clockRef = useRef(new THREE.Clock());
    
    // Mouse Parallax
    const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
    const pointerDragRef = useRef({ dragging: false, previousX: 0, spin: 0, tilt: 0 });
    const propsRef = useRef({ rotationX, rotationY, rotationZ, positionX, positionY, scale, autoRotateSpeed });

    // Transition State
    const switchAnimRef = useRef({
      active: false,
      startTime: 0,
      duration: 1.2,
      targetColor: new THREE.Color(color),
      sourceColor: new THREE.Color(color),
      targetRim: new THREE.Color(rimColor),
      sourceRim: new THREE.Color(rimColor),
    });

    const entranceAnimRef = useRef({
      active: true,
      startTime: 0,
      duration: 1.6,
      completed: false,
    });

    // Expose Imperative Handle
    useImperativeHandle(
      forwardedRef,
      () => ({
        setProgress(nextProgress) {
          // Pure variable update: RAF automatically handles 60fps rendering without blocking scroll events!
          progressRef.current = clamp(nextProgress);
        },
        triggerColorSwitch(newColorHex, newFinish = 'Silk', newRimHex) {
          const rim = newRimHex || newColorHex;
          switchAnimRef.current = {
            active: true,
            startTime: clockRef.current.getElapsedTime(),
            duration: 1.2,
            sourceColor: materialRef.current ? materialRef.current.color.clone() : new THREE.Color(color),
            targetColor: new THREE.Color(newColorHex),
            sourceRim: rimLightRef.current ? rimLightRef.current.color.clone() : new THREE.Color(rimColor),
            targetRim: new THREE.Color(rim),
          };

          const finishes = {
            Matte: { roughness: 0.72, metalness: 0.02 },
            Silk: { roughness: 0.28, metalness: 0.14 },
            Gloss: { roughness: 0.14, metalness: 0.04 },
            Translucent: { roughness: 0.38, metalness: 0.01 },
          } as const;
          const config = finishes[newFinish] || finishes.Silk;
          if (materialRef.current) Object.assign(materialRef.current, config);
          if (strandMaterialRef.current) Object.assign(strandMaterialRef.current, config);
        },
        triggerEntrance() {
          entranceAnimRef.current = {
            active: true,
            startTime: clockRef.current.getElapsedTime(),
            duration: 1.6,
            completed: false,
          };
        },
      }),
      [color, rimColor]
    );

    // Sync prop updates
    useEffect(() => {
      propsRef.current = { rotationX, rotationY, rotationZ, positionX, positionY, scale, autoRotateSpeed };
    }, [rotationX, rotationY, rotationZ, positionX, positionY, scale, autoRotateSpeed]);

    useEffect(() => {
      if (!materialRef.current) return;
      materialRef.current.color.set(color);
      if (strandMaterialRef.current) strandMaterialRef.current.color.set(color);
      if (rimLightRef.current) rimLightRef.current.color.set(rimColor);
    }, [color, rimColor]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
      camera.position.set(0, 0, 7.8);
      cameraRef.current = camera;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        });
      } catch (err) {
        console.warn('WebGL initialization failed, falling back:', err);
        if (fallbackRef.current) fallbackRef.current.style.display = 'flex';
        return;
      }

      renderer.setClearColor(0x000000, 0);
      // Performance optimization: clamp pixelRatio to 1.5 to eliminate retina fillrate lag
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      rendererRef.current = renderer;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      if (fallbackRef.current) fallbackRef.current.style.display = 'none';

      // --- HIGH-EFFICIENCY STUDIO LIGHTING (2 Lights Only) ---
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcdd2ee, 2.4);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
      keyLight.position.set(5.0, 6.0, 5.5);
      scene.add(keyLight);
      keyLightRef.current = keyLight;

      const rimLight = new THREE.DirectionalLight(new THREE.Color(rimColor), 3.8);
      rimLight.position.set(0, 4.5, -5.0);
      scene.add(rimLight);
      rimLightRef.current = rimLight;

      // --- SPOOL SCENE GRAPH ---
      const entranceGroup = new THREE.Group();
      entranceGroupRef.current = entranceGroup;
      scene.add(entranceGroup);

      const spoolGroup = new THREE.Group();
      spoolGroupRef.current = spoolGroup;
      entranceGroup.add(spoolGroup);

      const outerRadius = 2.15;
      const spoolWidth = 1.30;
      const hubRadius = 0.92;
      const arborRadius = 0.38;

      // High-performance smoked polycarbonate (MeshStandardMaterial avoids expensive transmission passes)
      const flangeMaterial = new THREE.MeshStandardMaterial({
        color: 0x161a35,
        roughness: 0.18,
        metalness: 0.12,
        transparent: true,
        opacity: 0.90,
      });

      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x0c0f24,
        roughness: 0.35,
        metalness: 0.22,
      });

      const hubMaterial = new THREE.MeshStandardMaterial({
        color: 0x080a16,
        roughness: 0.60,
        metalness: 0.15,
      });

      // Procedural bump texture
      let bumpTexture: THREE.CanvasTexture | null = null;
      try {
        const canvasTex = document.createElement('canvas');
        canvasTex.width = 64;
        canvasTex.height = 256;
        const ctx = canvasTex.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#808080';
          ctx.fillRect(0, 0, 64, 256);
          for (let y = 0; y < 256; y += 4) {
            ctx.fillStyle = y % 8 === 0 ? '#404040' : '#c8c8c8';
            ctx.fillRect(0, y, 64, 2);
          }
          bumpTexture = new THREE.CanvasTexture(canvasTex);
          bumpTexture.wrapS = THREE.RepeatWrapping;
          bumpTexture.wrapT = THREE.RepeatWrapping;
          bumpTexture.repeat.set(1, 32);
        }
      } catch {
        bumpTexture = null;
      }

      // Filament Material
      const filamentMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: finish === 'Matte' ? 0.72 : finish === 'Gloss' ? 0.14 : 0.28,
        metalness: finish === 'Silk' ? 0.14 : 0.02,
        bumpMap: bumpTexture,
        bumpScale: 0.030,
      });
      materialRef.current = filamentMaterial;

      // Two Circular Side Flanges (Optimized polygon counts)
      for (const side of [-1, 1]) {
        const flangeZ = side * (spoolWidth * 0.5 + 0.05);
        const flangeGroup = new THREE.Group();
        flangeGroup.position.z = flangeZ;

        // Outer Beveled Rim Ring
        const outerRimGeo = new THREE.TorusGeometry(outerRadius - 0.03, 0.055, 8, 36);
        const outerRimMesh = new THREE.Mesh(outerRimGeo, edgeMaterial);
        flangeGroup.add(outerRimMesh);

        // Circular Disk Body
        const diskGeo = new THREE.RingGeometry(hubRadius, outerRadius, 36);
        const diskMesh = new THREE.Mesh(diskGeo, flangeMaterial);
        flangeGroup.add(diskMesh);

        // Inner Hub Lip
        const innerRimGeo = new THREE.TorusGeometry(hubRadius, 0.035, 8, 28);
        const innerRimMesh = new THREE.Mesh(innerRimGeo, edgeMaterial);
        flangeGroup.add(innerRimMesh);

        // 6 Radial Cutout Windows
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const slotGeo = new THREE.BoxGeometry(0.38, 0.78, 0.08);
          const slotMat = new THREE.MeshBasicMaterial({ color: 0x050711 });
          const slot = new THREE.Mesh(slotGeo, slotMat);
          slot.position.set(
            Math.cos(angle) * 1.52,
            Math.sin(angle) * 1.52,
            0
          );
          slot.rotation.z = angle + Math.PI / 2;
          flangeGroup.add(slot);
        }

        spoolGroup.add(flangeGroup);
      }

      // Central Hub
      const hubGeo = new THREE.CylinderGeometry(hubRadius, hubRadius, spoolWidth, 32);
      const hubMesh = new THREE.Mesh(hubGeo, hubMaterial);
      hubMesh.rotation.x = Math.PI / 2;
      spoolGroup.add(hubMesh);

      // Arbor Tube
      const arborGeo = new THREE.CylinderGeometry(arborRadius, arborRadius, spoolWidth + 0.30, 24);
      const arborMesh = new THREE.Mesh(arborGeo, edgeMaterial);
      arborMesh.rotation.x = Math.PI / 2;
      spoolGroup.add(arborMesh);

      // Wound Filament Coil
      const woundRadius = 1.92;
      const coilWidth = spoolWidth - 0.05;
      const coilGeo = new THREE.CylinderGeometry(woundRadius, woundRadius, coilWidth, 48);
      const coilMesh = new THREE.Mesh(coilGeo, filamentMaterial);
      coilMesh.rotation.x = Math.PI / 2;
      spoolGroup.add(coilMesh);

      // Stepped Winding Ridges (2 rings)
      for (const stepZ of [-coilWidth * 0.35, coilWidth * 0.35]) {
        const stepGeo = new THREE.TorusGeometry(woundRadius - 0.015, 0.030, 6, 32);
        const stepMesh = new THREE.Mesh(stepGeo, filamentMaterial);
        stepMesh.position.z = stepZ;
        spoolGroup.add(stepMesh);
      }

      // Leading Uncoiling Strand
      const curvePoints = [
        new THREE.Vector3(woundRadius * 0.95, -0.4, spoolWidth * 0.5 - 0.1),
        new THREE.Vector3(woundRadius + 0.38, -0.85, spoolWidth * 0.5 + 0.28),
        new THREE.Vector3(woundRadius + 1.15, -1.35, spoolWidth * 0.5 + 0.70),
        new THREE.Vector3(woundRadius + 1.85, -1.85, spoolWidth * 0.5 + 1.15),
      ];
      const strandCurve = new THREE.CatmullRomCurve3(curvePoints);
      const strandGeo = new THREE.TubeGeometry(strandCurve, 32, 0.036, 6, false);
      const strandMaterial = filamentMaterial.clone();
      strandMaterial.bumpMap = null;
      strandMaterialRef.current = strandMaterial;
      const strandMesh = new THREE.Mesh(strandGeo, strandMaterial);
      spoolGroup.add(strandMesh);

      // Shadow
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.9, 24),
        new THREE.MeshBasicMaterial({ color: 0x070914, transparent: true, opacity: 0.16, depthWrite: false })
      );
      shadow.scale.set(1.35, 0.28, 1);
      shadow.position.set(0.1, -2.4, -1.2);
      scene.add(shadow);

      // Start Entrance Animation
      entranceAnimRef.current.startTime = clockRef.current.getElapsedTime();

      // Transform logic
      const applyTransforms = (time: number) => {
        if (!spoolGroupRef.current || !entranceGroupRef.current) return;
        const p = propsRef.current;
        const rawProgress = progressRef.current;
        const isMobile = window.innerWidth < 1024;

        // Smooth Mouse Parallax
        const m = mouseRef.current;
        m.currentX += (m.targetX - m.currentX) * 0.08;
        m.currentY += (m.targetY - m.currentY) * 0.08;

        // Entrance Animation
        const ent = entranceAnimRef.current;
        let entX = 0, entY = 0, entZ = 0, entRotX = 0, entRotY = 0, entRotZ = 0, entScale = 1;

        if (ent.active && !ent.completed) {
          const elapsed = time - ent.startTime;
          const rawT = clamp(elapsed / ent.duration, 0, 1);
          const easeOut = 1 - Math.pow(1 - rawT, 3.2);

          entX = lerp(-0.3, 0, easeOut);
          entY = lerp(4.5, 0, easeOut);
          entZ = lerp(-4.5, 0, easeOut);
          entRotX = lerp(-1.8, 0, easeOut);
          entRotY = lerp(3.2, 0, easeOut);
          entRotZ = lerp(0.9, 0, easeOut);
          entScale = lerp(0.45, 1.0, easeOut);

          if (rawT >= 1) {
            ent.completed = true;
            ent.active = false;
          }
        }

        // Color Switch Animation
        const sw = switchAnimRef.current;
        let swX = 0, swY = 0, swZ = 0, swRotX = 0, swRotY = 0, swRotZ = 0, swScale = 1;

        if (sw.active) {
          const elapsed = time - sw.startTime;
          const rawT = clamp(elapsed / sw.duration, 0, 1);

          if (rawT < 0.45) {
            const phaseT = rawT / 0.45;
            const easeOutPhase = Math.sin((phaseT * Math.PI) / 2);
            swZ = lerp(0, -1.6, easeOutPhase);
            swY = lerp(0, 0.3, easeOutPhase);
            swRotY = lerp(0, Math.PI * 1.1, easeOutPhase);
            swScale = lerp(1.0, 0.90, easeOutPhase);
          } else {
            const phaseT = (rawT - 0.45) / 0.55;
            const easeInSwoop = 1 - Math.pow(1 - phaseT, 3);
            swZ = lerp(-1.6, 0, easeInSwoop);
            swY = lerp(0.3, 0, easeInSwoop);
            swRotY = lerp(Math.PI * 1.1, Math.PI * 2.0, easeInSwoop);
            swScale = lerp(0.90, 1.0, easeInSwoop);
          }

          if (materialRef.current) {
            materialRef.current.color.lerpColors(sw.sourceColor, sw.targetColor, rawT);
          }
          if (strandMaterialRef.current) {
            strandMaterialRef.current.color.lerpColors(sw.sourceColor, sw.targetColor, rawT);
          }
          if (rimLightRef.current) {
            rimLightRef.current.color.lerpColors(sw.sourceRim, sw.targetRim, rawT);
          }

          if (rawT >= 1) {
            sw.active = false;
            if (spoolGroupRef.current) {
              spoolGroupRef.current.rotation.y = spoolGroupRef.current.rotation.y % (Math.PI * 2);
            }
          }
        }

        entranceGroupRef.current.position.set(entX + swX, entY + swY, entZ + swZ);
        entranceGroupRef.current.rotation.set(entRotX + swRotX, entRotY + swRotY, entRotZ + swRotZ);
        entranceGroupRef.current.scale.setScalar(entScale * swScale);

        // Continuous Organic 6-DOF Floating Idle
        const floatY = Math.sin(time * 1.6) * 0.065;
        const floatX = Math.cos(time * 1.2) * 0.030;
        const floatRotX = Math.sin(time * 1.3) * 0.040;
        const floatRotY = Math.cos(time * 0.9) * 0.055;
        const floatRotZ = Math.sin(time * 1.5) * 0.030;

        const cursorTiltX = enableMouseParallax ? -m.currentY * 0.28 : 0;
        const cursorTiltY = enableMouseParallax ? m.currentX * 0.38 : 0;
        const cursorShiftX = enableMouseParallax ? m.currentX * 0.15 : 0;
        const cursorShiftY = enableMouseParallax ? -m.currentY * 0.12 : 0;

        if (scrollDriven) {
          const paced = clamp(rawProgress, 0, 1);

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
          const t = 0.5 - 0.5 * Math.cos(rawT * Math.PI);

          const rotX = lerp(k1.rotX, k2.rotX, t) + floatRotX + cursorTiltX;
          const rotY = lerp(k1.rotY, k2.rotY, t) + floatRotY + cursorTiltY;
          const rotZ = lerp(k1.rotZ, k2.rotZ, t) + floatRotZ;

          let posX = lerp(k1.posX, k2.posX, t) + floatX + cursorShiftX;
          let posY = lerp(k1.posY, k2.posY, t) + floatY + cursorShiftY;
          let posZ = lerp(k1.posZ, k2.posZ, t);
          let sc = lerp(k1.scale, k2.scale, t);
          const dollyZ = lerp(k1.dollyZ, k2.dollyZ, t);

          if (isMobile) {
            posX = floatX + cursorShiftX;
            posY = lerp(0.55, -0.06, paced) + floatY + cursorShiftY;
            posZ = lerp(0, 1.4, paced);
            sc = sc * 0.72;
          }

          spoolGroupRef.current.rotation.set(rotX, rotY, rotZ);
          spoolGroupRef.current.position.set(posX, posY, posZ);
          spoolGroupRef.current.scale.setScalar(sc);

          if (cameraRef.current) {
            const baseCamZ = isMobile ? 8.4 : 7.8;
            cameraRef.current.position.z = baseCamZ - dollyZ;
          }
        } else {
          const finalRotX = p.rotationX + floatRotX + cursorTiltX + pointerDragRef.current.tilt;
          const finalRotY = p.rotationY + floatRotY + cursorTiltY + pointerDragRef.current.spin;
          const finalRotZ = p.rotationZ + floatRotZ;

          const finalPosX = p.positionX + floatX + cursorShiftX;
          const finalPosY = p.positionY + floatY + cursorShiftY;

          spoolGroupRef.current.rotation.set(finalRotX, finalRotY, finalRotZ);
          spoolGroupRef.current.position.set(finalPosX, finalPosY, 0);
          spoolGroupRef.current.scale.setScalar(p.scale);
        }
      };

      // 60fps RAF Loop
      const animateLoop = () => {
        if (visibleRef.current) {
          try {
            const time = clockRef.current.getElapsedTime();
            applyTransforms(time);
            renderer.render(scene, camera);
          } catch (err) {
            console.warn('Three.js render error caught:', err);
          }
        }
        frameRef.current = requestAnimationFrame(animateLoop);
      };
      frameRef.current = requestAnimationFrame(animateLoop);

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableMouseParallax) return;
        mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      const resize = () => {
        const width = Math.max(1, container.clientWidth);
        const height = Math.max(1, container.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 640 ? 8.4 : 7.8;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      // Only render when in or near viewport
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting;
        },
        { rootMargin: '60px' }
      );
      intersectionObserver.observe(container);

      // Pointer interactions
      const pointerDown = (event: PointerEvent) => {
        if (!interactive) return;
        pointerDragRef.current.dragging = true;
        pointerDragRef.current.previousX = event.clientX;
        container.setPointerCapture(event.pointerId);
      };
      const pointerMove = (event: PointerEvent) => {
        if (!interactive || !pointerDragRef.current.dragging) return;
        const deltaX = event.clientX - pointerDragRef.current.previousX;
        pointerDragRef.current.spin += deltaX * 0.009;
        pointerDragRef.current.tilt = clamp((event.clientY / Math.max(1, container.clientHeight) - 0.5) * 0.3, -0.2, 0.2);
        pointerDragRef.current.previousX = event.clientX;
      };
      const pointerUp = (event: PointerEvent) => {
        pointerDragRef.current.dragging = false;
        if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
      };

      if (interactive) {
        container.addEventListener('pointerdown', pointerDown);
        container.addEventListener('pointermove', pointerMove);
        container.addEventListener('pointerup', pointerUp);
        container.addEventListener('pointercancel', pointerUp);
      }

      resize();

      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        window.removeEventListener('mousemove', handleMouseMove);
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
        entranceGroupRef.current = null;
        keyLightRef.current = null;
        rimLightRef.current = null;
        cameraRef.current = null;
      };
    }, [interactive, scrollDriven, enableMouseParallax]);

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
