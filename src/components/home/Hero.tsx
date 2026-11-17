'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Gauge, Layers3, ShieldCheck } from 'lucide-react';
import { FilamentSpoolCanvas, SpoolCanvasHandle } from '@/components/3d/FilamentSpoolCanvas';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const spoolRef = useRef<SpoolCanvasHandle>(null);

  useEffect(() => {
    const track = trackRef.current;
    const intro = introRef.current;
    const detail = detailRef.current;
    const indicator = indicatorRef.current;
    if (!track || !intro || !detail || !indicator) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = reducedMotion ? 0 : clamp(-rect.top / distance);
      spoolRef.current?.setProgress(progress);

      const introOpacity = clamp(1 - progress / 0.3);
      const detailIn = clamp((progress - 0.24) / 0.18);
      const detailOut = clamp((1 - progress) / 0.1);
      intro.style.opacity = String(introOpacity);
      intro.style.transform = `translate3d(0, ${-18 * progress}px, 0)`;
      intro.style.pointerEvents = introOpacity > 0.45 ? 'auto' : 'none';
      detail.style.opacity = String(detailIn * detailOut);
      detail.style.transform = `translate3d(0, ${24 * (1 - detailIn)}px, 0)`;
      detail.style.pointerEvents = detailIn > 0.65 && detailOut > 0.4 ? 'auto' : 'none';
      indicator.style.opacity = String(clamp(1 - progress * 5));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <section ref={trackRef} className="hero-scroll-track relative h-[220svh] lg:h-[260svh] bg-ufill-background">
      <div className="sticky top-0 h-svh min-h-[620px] overflow-hidden bg-ufill-background">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#11152E 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ufill-secondary/30 to-transparent" />

        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-rows-[52%_48%] px-5 pb-6 pt-24 sm:px-8 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10 lg:px-12 lg:pb-0 lg:pt-20">
          <div className="relative z-20 flex min-h-0 items-center lg:col-span-6">
            <div ref={introRef} className="w-full will-change-[opacity,transform]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ufill-secondary/20 bg-ufill-tertiary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ufill-secondary sm:mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-ufill-secondary" />
                Precision filament, exact by design
              </div>
              <h1 className="text-5xl font-bold leading-[0.94] tracking-tightest text-ufill-primary sm:text-6xl lg:text-[5.6rem]">
                Make it <span className="text-ufill-secondary">Real.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ufill-textMuted sm:mt-6 sm:text-lg">
                High-speed, zero-clog filament engineered for exacting prototypes, production farms, and ambitious everyday builds.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <Link href="/shop" className="group inline-flex items-center justify-center gap-3 rounded-xl bg-ufill-primary px-6 py-3.5 text-sm font-semibold text-white shadow-elevation-2 transition-colors hover:bg-ufill-secondary sm:px-8 sm:py-4">
                  Explore filaments
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/colors" className="inline-flex items-center justify-center rounded-xl border border-ufill-border bg-white px-6 py-3.5 text-sm font-semibold text-ufill-primary transition-colors hover:bg-ufill-tertiary/60 sm:px-7 sm:py-4">
                  Discover colours
                </Link>
              </div>
              <div className="mt-7 hidden max-w-lg grid-cols-3 gap-4 border-t border-ufill-border/70 pt-5 sm:grid">
                <div><strong className="font-mono text-lg text-ufill-primary">±0.02 mm</strong><span className="mt-1 block text-xs text-ufill-textMuted">Laser tolerance</span></div>
                <div><strong className="font-mono text-lg text-ufill-secondary">600 mm/s</strong><span className="mt-1 block text-xs text-ufill-textMuted">High-speed rated</span></div>
                <div><strong className="font-mono text-lg text-ufill-primary">100%</strong><span className="mt-1 block text-xs text-ufill-textMuted">Tangle-free</span></div>
              </div>
            </div>

            <div ref={detailRef} className="pointer-events-none absolute inset-x-0 w-full opacity-0 will-change-[opacity,transform]">
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ufill-secondary">
                <Layers3 className="h-4 w-4" />
                Wound as one mechanism
              </div>
              <h2 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-tightest text-ufill-primary sm:text-5xl lg:text-6xl">
                Round strand. <span className="text-ufill-secondary">Controlled tension.</span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ufill-textMuted sm:mt-6 sm:text-lg">
                Closely packed cylindrical windings catch the light strand by strand. The free filament stays connected while the spool turns around its real axle.
              </p>
              <div className="mt-6 grid max-w-lg grid-cols-2 gap-3 sm:mt-8">
                <div className="rounded-2xl border border-ufill-border bg-white/85 p-4 shadow-elevation-1 backdrop-blur-sm">
                  <Gauge className="mb-3 h-5 w-5 text-ufill-secondary" />
                  <strong className="block text-sm text-ufill-primary">Scroll-synchronous</strong>
                  <span className="mt-1 block text-xs leading-relaxed text-ufill-textMuted">Responsive in both directions</span>
                </div>
                <div className="rounded-2xl border border-ufill-border bg-white/85 p-4 shadow-elevation-1 backdrop-blur-sm">
                  <ShieldCheck className="mb-3 h-5 w-5 text-ufill-secondary" />
                  <strong className="block text-sm text-ufill-primary">Mechanically stable</strong>
                  <span className="mt-1 block text-xs leading-relaxed text-ufill-textMuted">No end-over-end flipping</span>
                </div>
              </div>
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ufill-secondary hover:underline sm:mt-8">
                Shop precision-wound filament <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 min-h-0 lg:col-span-6 lg:h-[78vh]">
            <div className="absolute inset-0 rounded-[2rem] border border-white/80 bg-white/45 shadow-[0_30px_90px_rgba(17,21,46,0.12)] backdrop-blur-[2px] lg:inset-4">
              <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-ufill-border bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ufill-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-ufill-secondary" /> Local-Z axle
              </div>
              <FilamentSpoolCanvas ref={spoolRef} color="#6258F5" finish="Silk" scrollDriven className="h-full w-full" />
            </div>
          </div>
        </div>

        <div ref={indicatorRef} className="pointer-events-none absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-ufill-textDim will-change-[opacity] lg:bottom-5">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] sm:text-[10px]">Scroll to unwind</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-ufill-secondary" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
