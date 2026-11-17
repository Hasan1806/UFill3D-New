'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

// Safe WebGL prototype guards to guarantee getShaderInfoLog never returns null to .trim()
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

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

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
    const progressRef = useRef(0);
    const visibleRef = useRef(true);
    const frameRef = useRef<number | null>(null);
    const strandRef = useRef<THREE.Mesh | null>(null);
    const strandCountRef = useRef(0);
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
      if (!material) return;
      material.color.set(color);
      const finishes = {
        Matte: { roughness: 0.72, metalness: 0.02 },
        Silk: { roughness: 0.3, metalness: 0.08 },
        Gloss: { roughness: 0.16, metalness: 0.04 },
        Translucent: { roughness: 0.38, metalness: 0.01 },
      } as const;
      Object.assign(material, finishes[finish] || finishes.Silk);
      material.needsUpdate = true;
      renderRef.current();
    }, [color, finish]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
      camera.position.set(0, 0.05, 8.3);

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
      } catch (err) {
        console.warn('WebGL initialization failed, using CSS fallback:', err);
        if (fallbackRef.current) fallbackRef.current.style.display = 'flex';
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      container.appendChild(renderer.domElement);
      if (fallbackRef.current) fallbackRef.current.style.display = 'none';

      // Studio Lighting
      scene.add(new THREE.HemisphereLight(0xffffff, 0xd8dcf5, 2.2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
      keyLight.position.set(4.5, 5.5, 6);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xbab5ff, 1.8);
      fillLight.position.set(-5, -1.5, 4);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0x6258f5, 3.0);
      rimLight.position.set(-1, 4, -5);
      scene.add(rimLight);

      const orientation = new THREE.Group();
      const rotor = new THREE.Group();
      orientation.add(rotor);
      scene.add(orientation);

      // Procedural micro-groove bump texture for realistic wound strand sheen
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
            ctx.fillStyle = y % 8 === 0 ? '#404040' : '#c0c0c0';
            ctx.fillRect(0, y, 128, 2);
          }
          bumpTexture = new THREE.CanvasTexture(canvasTex);
          bumpTexture.wrapS = THREE.RepeatWrapping;
          bumpTexture.wrapT = THREE.RepeatWrapping;
          bumpTexture.repeat.set(1, 32);
        }
      } catch {
        bumpTexture = null;
      }

      // Materials
      const filamentMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: finish === 'Matte' ? 0.72 : finish === 'Gloss' ? 0.16 : 0.3,
        metalness: finish === 'Silk' ? 0.08 : 0.02,
        bumpMap: bumpTexture,
        bumpScale: 0.025,
      });
      materialRef.current = filamentMaterial;

      const flangeMaterial = new THREE.MeshStandardMaterial({
        color: 0x161a35,
        roughness: 0.32,
        metalness: 0.08,
      });

      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x090c20,
        roughness: 0.45,
        metalness: 0.12,
      });

      const outerRadius = 2.14;
      const spoolWidth = 1.24;
      const flangeGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, 0.1, 48, 1);
      const rimGeometry = new THREE.TorusGeometry(outerRadius - 0.03, 0.055, 8, 48);

      // Flanges (Both sides)
      for (const side of [-1, 1]) {
        const flange = new THREE.Mesh(flangeGeometry, flangeMaterial);
        flange.rotation.x = Math.PI / 2;
        flange.position.z = side * spoolWidth * 0.5;
        rotor.add(flange);

        const rimMesh = new THREE.Mesh(rimGeometry, edgeMaterial);
        rimMesh.position.z = side * (spoolWidth * 0.5 + 0.052);
        rotor.add(rimMesh);
      }

      // Central Hub & Arbor
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, spoolWidth + 0.12, 36), edgeMaterial);
      hub.rotation.x = Math.PI / 2;
      rotor.add(hub);

      const arbor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.37, 0.37, spoolWidth + 0.24, 24),
        new THREE.MeshStandardMaterial({ color: 0x03040d, roughness: 0.8 })
      );
      arbor.rotation.x = Math.PI / 2;
      rotor.add(arbor);

      // Tightly wound filament coil with microgrooves
      const coilBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.88, 1.88, 1.06, 48),
        filamentMaterial
      );
      coilBody.rotation.x = Math.PI / 2;
      rotor.add(coilBody);

      // Loose Filament Leading Strand
      const looseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.55, 1.05, 0.49),
        new THREE.Vector3(1.92, 0.58, 0.53),
        new THREE.Vector3(2.28, -0.08, 0.62),
        new THREE.Vector3(2.55, -0.88, 0.78),
        new THREE.Vector3(2.82, -1.58, 1.02),
      ]);
      const looseGeometry = new THREE.TubeGeometry(looseCurve, 48, 0.033, 7, false);
      const looseStrandMaterial = filamentMaterial.clone();
      looseStrandMaterial.bumpMap = null; // smooth strand without spool groove repetition
      const looseStrand = new THREE.Mesh(looseGeometry, looseStrandMaterial);
      strandRef.current = looseStrand;
      strandCountRef.current = looseGeometry.index ? looseGeometry.index.count : 48 * 7 * 6;
      rotor.add(looseStrand);

      // Floor Shadow
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.75, 32),
        new THREE.MeshBasicMaterial({ color: 0x11152e, transparent: true, opacity: 0.12, depthWrite: false })
      );
      shadow.scale.set(1.25, 0.24, 1);
      shadow.position.set(0.1, -2.22, -1.1);
      scene.add(shadow);

      const applyTransforms = () => {
        const p = propsRef.current;
        const progress = progressRef.current;
        if (scrollDriven) {
          const arc = Math.sin(progress * Math.PI);
          orientation.rotation.set(
            lerp(0.2, 0.13, progress),
            lerp(-0.52, -0.34, progress),
            lerp(0.025, -0.015, progress)
          );
          orientation.position.set(
            lerp(0.22, -0.08, progress),
            lerp(-0.02, 0.1, progress) + arc * 0.04,
            0
          );
          const responsiveScale = window.innerWidth < 768 ? 0.88 : 1.08;
          orientation.scale.setScalar(responsiveScale * lerp(0.98, 1.08, arc));
          rotor.rotation.z = -progress * Math.PI * 4.5;
          if (strandRef.current && strandCountRef.current > 0) {
            strandRef.current.geometry.setDrawRange(0, Math.floor(strandCountRef.current * lerp(0.42, 1, progress)));
          }
        } else {
          orientation.rotation.set(p.rotationX + pointerRef.current.tilt, p.rotationY, p.rotationZ);
          orientation.position.set(p.positionX, p.positionY, 0);
          orientation.scale.setScalar(p.scale);
          rotor.rotation.z = pointerRef.current.spin;
        }
      };

      renderRef.current = () => {
        if (!visibleRef.current) return;
        try {
          applyTransforms();
          renderer.render(scene, camera);
        } catch (err) {
          console.warn('Three.js render caught error:', err);
          if (fallbackRef.current) fallbackRef.current.style.display = 'flex';
        }
      };

      const resize = () => {
        const width = Math.max(1, container.clientWidth);
        const height = Math.max(1, container.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 640 ? 9.4 : 8.3;
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
        pointerRef.current.spin += (event.clientX - pointerRef.current.previousX) * 0.009;
        pointerRef.current.tilt = clamp((event.clientY / Math.max(1, container.clientHeight) - 0.5) * 0.25, -0.16, 0.16);
        pointerRef.current.previousX = event.clientX;
        renderRef.current();
      };
      const pointerUp = (event: PointerEvent) => {
        pointerRef.current.dragging = false;
        if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
      };

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
      if (interactive) frameRef.current = requestAnimationFrame(animate);
      resize();

      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        container.removeEventListener('pointerdown', pointerDown);
        container.removeEventListener('pointermove', pointerMove);
        container.removeEventListener('pointerup', pointerUp);
        container.removeEventListener('pointercancel', pointerUp);
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
        strandRef.current = null;
      };
    }, [interactive, scrollDriven]);

    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`relative select-none ${interactive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} ${className}`}
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
