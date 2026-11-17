'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, Sparkles, Activity } from 'lucide-react';
import { FilamentSpoolCanvas, SpoolCanvasHandle } from '@/components/3d/FilamentSpoolCanvas';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const liveGaugeRef = useRef<HTMLSpanElement>(null);
  const spoolRef = useRef<SpoolCanvasHandle>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const glowPrimaryRef = useRef<HTMLDivElement>(null);
  const glowTertiaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const intro = introRef.current;
    const detail = detailRef.current;
    const indicator = indicatorRef.current;
    const gauge = liveGaugeRef.current;
    const bgGrid = bgGridRef.current;
    const glowPrimary = glowPrimaryRef.current;
    const glowTertiary = glowTertiaryRef.current;
    if (!track || !intro || !detail || !indicator) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Master GSAP ScrollTrigger linking the extended scroll runway directly to real 3D spool transforms
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1, // Silky smooth scrubbing with luxurious cinematic inertia
      onUpdate: (self) => {
        const progress = reducedMotion ? 0 : self.progress;

        // Drive 3D Spool multi-axis rotation, position, dynamic light sweep, and camera dolly
        spoolRef.current?.setProgress(progress);

        // Premium Effect 03: Magnetic Depth Parallax on ambient backdrop layers
        if (bgGrid) {
          bgGrid.style.transform = `translate3d(0, ${-42 * progress}px, 0)`;
        }
        if (glowPrimary) {
          glowPrimary.style.transform = `translate3d(${-28 * progress}px, ${-48 * progress}px, 0)`;
        }
        if (glowTertiary) {
          glowTertiary.style.transform = `translate3d(${20 * progress}px, ${38 * progress}px, 0)`;
        }

        // Simulated high-frequency laser gauge readout during middle inspection phase
        if (gauge) {
          const jitter = (Math.sin(progress * 160) * 0.007).toFixed(3);
          const val = (1.75 + parseFloat(jitter)).toFixed(3);
          gauge.textContent = val;
        }

        // Premium Effect 07: Micro-Parallax on Editorial Layer 1 ("Make it Real.")
        const introOpacity = clamp(1 - progress / 0.20);
        intro.style.opacity = String(introOpacity);
        intro.style.transform = `translate3d(0, ${-32 * progress}px, 0)`;
        intro.style.pointerEvents = introOpacity > 0.3 ? 'auto' : 'none';

        // Editorial Layer 2: Technical Callouts & Precision Winding (Active across the 20% - 82% mid-section)
        const detailIn = clamp((progress - 0.18) / 0.12);
        const detailOut = clamp((0.84 - progress) / 0.12);
        const detailOpacity = detailIn * detailOut;
        const detailY = (1 - detailIn) * 22 - (progress - 0.3) * 14;
        detail.style.opacity = String(detailOpacity);
        detail.style.transform = `translate3d(0, ${detailY}px, 0)`;
        detail.style.pointerEvents = detailOpacity > 0.3 ? 'auto' : 'none';

        // Scroll prompt indicator gently fades out on initial scroll
        indicator.style.opacity = String(clamp(1 - progress * 10));
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    // Ultra-Premium Cinematic Scroll Runway (600vh - 650vh desktop distance)
    <section ref={trackRef} className="hero-scroll-track relative h-[580svh] lg:h-[620svh] bg-ufill-background">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-svh min-h-[620px] w-full overflow-hidden bg-ufill-background flex items-center justify-center">
        {/* Subtle Background Radial Matrix with Magnetic Parallax */}
        <div
          ref={bgGridRef}
          className="absolute inset-0 opacity-[0.035] pointer-events-none will-change-transform"
          style={{ backgroundImage: 'radial-gradient(#11152E 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />

        {/* Ambient Gradient Glows with Magnetic Depth Parallax */}
        <div
          ref={glowPrimaryRef}
          className="absolute top-1/3 right-1/4 w-[650px] h-[650px] bg-ufill-secondary/10 rounded-full blur-[140px] pointer-events-none will-change-transform"
        />
        <div
          ref={glowTertiaryRef}
          className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-ufill-tertiary/50 rounded-full blur-[120px] pointer-events-none will-change-transform"
        />

        {/* Full-Viewport 3D WebGL Canvas Layer (Free & Unconstrained across the entire viewport) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <FilamentSpoolCanvas
            ref={spoolRef}
            color="#6258F5"
            finish="Silk"
            scrollDriven
            className="w-full h-full"
          />
        </div>

        {/* Foreground Content Layer */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
            {/* Left Column Content Area */}
            <div className="lg:col-span-6 relative flex flex-col justify-center">
              {/* ACT 1: Hero Entry ("Make it Real.") */}
              <div ref={introRef} className="w-full will-change-[opacity,transform] pointer-events-auto">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ufill-secondary/20 bg-ufill-tertiary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ufill-secondary sm:mb-5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Official UFill3D Engineering
                </div>

                <h1 className="text-5xl font-bold leading-[0.94] tracking-tightest text-ufill-primary sm:text-6xl lg:text-[5.6rem]">
                  Make it <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ufill-secondary via-[#8F88FF] to-ufill-primary">
                    Real.
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-ufill-textMuted sm:mt-6 sm:text-lg">
                  High-speed, zero-clog 3D printing filament engineered for master craftsmen, high-volume production farms, and aerospace prototyping.
                </p>

                <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                  <Link
                    href="/shop"
                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-ufill-primary px-7 py-4 text-sm font-semibold text-white shadow-elevation-2 transition-all hover:bg-ufill-secondary active:scale-95 sm:px-8"
                  >
                    <span>Explore filaments</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/colors"
                    className="inline-flex items-center justify-center rounded-xl border border-ufill-border bg-white px-6 py-4 text-sm font-semibold text-ufill-primary transition-all hover:bg-ufill-tertiary/60 active:scale-95 sm:px-7"
                  >
                    Discover colours
                  </Link>
                </div>

                <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-ufill-border/70 pt-6">
                  <div>
                    <strong className="font-mono text-xl font-bold text-ufill-primary">±0.02 mm</strong>
                    <span className="mt-1 block text-xs text-ufill-textMuted">Laser tolerance</span>
                  </div>
                  <div>
                    <strong className="font-mono text-xl font-bold text-ufill-secondary">600 mm/s</strong>
                    <span className="mt-1 block text-xs text-ufill-textMuted">CoreXY rated</span>
                  </div>
                  <div>
                    <strong className="font-mono text-xl font-bold text-ufill-primary">100%</strong>
                    <span className="mt-1 block text-xs text-ufill-textMuted">Tangle-free</span>
                  </div>
                </div>
              </div>

              {/* ACT 2: Mid-Scroll Precision Detail (Revealed as Spool Turns 3D Sideways & Holds Composition) */}
              <div
                ref={detailRef}
                className="pointer-events-none absolute inset-x-0 w-full opacity-0 will-change-[opacity,transform]"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ufill-secondary/30 bg-ufill-primary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  <Activity className="h-3.5 w-3.5 text-ufill-secondary" />
                  Dual-Axis Laser Metrology
                </div>

                <h2 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-tightest text-ufill-primary sm:text-5xl lg:text-6xl">
                  Round strand. <br />
                  <span className="text-ufill-secondary">Controlled tension.</span>
                </h2>

                <p className="mt-4 max-w-lg text-base leading-relaxed text-ufill-textMuted sm:mt-5 sm:text-lg">
                  Every layer is wound side-by-side under calibrated 4.2 N torque. Turning the spool in space reveals its dense cylindrical packing, transparent structural cutouts, and zero strand overlaps.
                </p>

                {/* Live Laser Micrometer HUD Card */}
                <div className="mt-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-ufill-border shadow-elevation-2 max-w-lg space-y-3 pointer-events-auto">
                  <div className="flex items-center justify-between text-xs border-b border-ufill-border/60 pb-2.5">
                    <span className="font-mono uppercase font-bold text-ufill-textMuted flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Optical Laser Micrometer: Online
                    </span>
                    <span className="font-mono text-emerald-600 font-bold">±0.018 mm (PASS)</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-ufill-textDim block">Current Diameter</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span ref={liveGaugeRef} className="font-mono text-3xl font-bold text-ufill-primary">
                          1.750
                        </span>
                        <span className="font-mono text-sm text-ufill-secondary font-bold">mm</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-ufill-textDim block">Winding Precision</span>
                      <span className="font-mono text-sm font-bold text-ufill-primary mt-1 block">
                        99.4% Circularity
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 pointer-events-auto">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-ufill-primary text-white font-semibold text-xs hover:bg-ufill-secondary transition-all shadow-elevation-1"
                  >
                    <span>Shop Precision Spools</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/materials/pla"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-ufill-border text-ufill-primary font-semibold text-xs hover:bg-ufill-tertiary transition-all"
                  >
                    Datasheet Specs
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Empty on Desktop to give the 3D Spool unrestricted space */}
            <div className="hidden lg:block lg:col-span-6 min-h-[70vh] pointer-events-none" />
          </div>
        </div>

        {/* Minimal Scroll Prompt */}
        <div
          ref={indicatorRef}
          className="pointer-events-none absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 text-ufill-textDim will-change-[opacity]"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Scroll to experience 3D unspooling</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-ufill-secondary" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
