'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  Activity, 
  ShoppingBag, 
  Check 
} from 'lucide-react';
import { HERO_THEMES } from '@/data/heroThemes';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import { useSpoolJourneyStore } from '@/lib/spool-journey-store';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function Hero() {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [isChangingColor, setIsChangingColor] = useState(false);
  const currentTheme = HERO_THEMES[activeThemeIndex];

  // DOM Refs
  const trackRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const climaxRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const liveGaugeRef = useRef<HTMLSpanElement>(null);
  const bgMeshRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);

  // Cart integration
  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  // Color Switch Handler
  const handleSelectTheme = (index: number) => {
    if (index === activeThemeIndex || isChangingColor) return;
    setIsChangingColor(true);
    const nextTheme = HERO_THEMES[index];

    useSpoolJourneyStore.getState().setColor(nextTheme.filamentHex, nextTheme.finish, nextTheme.accentColor);

    setTimeout(() => {
      setActiveThemeIndex(index);
      setIsChangingColor(false);
    }, 320);
  };

  // Add current active hero spool to cart
  const handleAddToCart = () => {
    const product = PRODUCTS.find((p) => p.slug === currentTheme.productSlug) || PRODUCTS[0];
    const colorVariant = product.colors.find((c) => c.name.toLowerCase() === currentTheme.name.toLowerCase()) || {
      id: currentTheme.id,
      name: currentTheme.name,
      hex: currentTheme.filamentHex,
      inStock: true,
    };
    addItem(product, colorVariant, '1.75 mm', '1.0 kg', 1);
  };

  // Initial Entrance Animation
  useEffect(() => {
    useSpoolJourneyStore.getState().triggerEntrance();
  }, []);

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const intro = introRef.current;
    const detail = detailRef.current;
    const climax = climaxRef.current;
    const indicator = indicatorRef.current;
    const gauge = liveGaugeRef.current;
    const bgMesh = bgMeshRef.current;
    const glow = ambientGlowRef.current;
    if (!track || !intro || !detail || !indicator) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fast, responsive scrub (0.25s)
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.25,
      onUpdate: (self) => {
        const progress = reducedMotion ? 0 : self.progress;

        // Ambient depth parallax
        if (bgMesh) {
          bgMesh.style.transform = `translate3d(0, ${-25 * progress}px, 0)`;
        }
        if (glow) {
          glow.style.transform = `translate3d(${-16 * progress}px, ${-22 * progress}px, 0) scale(${1 + 0.15 * progress})`;
        }

        // Live laser micrometer gauge jitter
        if (gauge) {
          const jitter = (Math.sin(progress * 180) * 0.007).toFixed(3);
          const val = (1.75 + parseFloat(jitter)).toFixed(3);
          gauge.textContent = val;
        }

        // Editorial Layer 1 Parallax & Fade (Active 0% - 35%)
        const introOpacity = clamp(1 - (progress - 0.12) / 0.20);
        intro.style.opacity = String(introOpacity);
        intro.style.transform = `translate3d(0, ${-12 * progress}px, 0)`;
        intro.style.pointerEvents = introOpacity > 0.2 ? 'auto' : 'none';

        // Editorial Layer 2: Technical Metrology Inspection (Active 30% - 85%)
        const detailIn = clamp((progress - 0.28) / 0.14);
        const detailOut = clamp((0.85 - progress) / 0.12);
        const detailOpacity = detailIn * detailOut;
        const detailY = (1 - detailIn) * 18 - (progress - 0.4) * 12;
        detail.style.opacity = String(detailOpacity);
        detail.style.transform = `translate3d(0, ${detailY}px, 0)`;
        detail.style.pointerEvents = detailOpacity > 0.2 ? 'auto' : 'none';

        // Editorial Layer 3: Grand Climax & Metrology Aperture (Active 84% - 100%)
        if (climax) {
          const climaxIn = clamp((progress - 0.84) / 0.08);
          climax.style.opacity = String(climaxIn);
          climax.style.transform = `translate3d(0, ${(1 - climaxIn) * 20}px, 0)`;
          climax.style.pointerEvents = climaxIn > 0.3 ? 'auto' : 'none';
        }

        // Scroll prompt indicator
        indicator.style.opacity = String(clamp(1 - progress * 5));
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section 
      ref={trackRef} 
      className="hero-scroll-track relative h-[210svh] lg:h-[240svh] transition-colors duration-500 ease-in-out select-none"
      style={{ backgroundColor: currentTheme.bgSolid }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div 
        ref={viewportRef}
        className="sticky top-0 h-svh min-h-[600px] w-full overflow-hidden flex flex-col justify-start lg:justify-center pt-20 sm:pt-24 lg:pt-14 pb-4 transition-colors duration-500 ease-in-out"
        style={{
          background: currentTheme.bgGradient,
        }}
      >
        {/* Dynamic Studio Grid Pattern */}
        <div
          ref={bgMeshRef}
          className="absolute inset-0 opacity-[0.035] pointer-events-none will-change-transform"
          style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient Subtle Studio Glow */}
        <div
          ref={ambientGlowRef}
          className="absolute top-1/4 right-1/4 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none will-change-transform transition-all duration-500"
          style={{
            backgroundColor: currentTheme.glowColor,
          }}
        />

        {/* Foreground Editorial Layer */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-2 sm:pt-4 pb-2 sm:pb-4 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[55vh] lg:min-h-[60vh]">
            
            {/* Left Column Content Area */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col justify-center">
              
              {/* ACT 1: Hero Entry & Precision Industrial Presentation */}
              <div 
                ref={introRef} 
                className="w-full will-change-[opacity,transform] pointer-events-auto transition-opacity duration-200"
              >
                {/* Precision Industrial Headline with generous line-height to guarantee zero ascender clipping */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-[4.0rem] font-extrabold uppercase leading-[1.14] sm:leading-[1.05] tracking-tight sm:tracking-tightest text-[#111111] pt-1 pb-1">
                  {currentTheme.headlineFirst} <br />
                  <span 
                    className="transition-colors duration-300 text-[#5401C5]"
                  >
                    {currentTheme.headlineSecond}
                  </span>
                </h1>

                {/* Subtitle / Product Description */}
                <p 
                  className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm lg:text-base leading-relaxed text-[#696969] transition-colors duration-300"
                >
                  {currentTheme.description}
                </p>

                {/* Secondary Mobile Subheading (Mobile Only: 2-3 lines of precision engineering copy) */}
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#696969] font-medium lg:hidden">
                  Continuous dual-axis optical inspection paired with tangle-free robotic winding. Calibrated for 600 mm/s high-speed CoreXY extrusion and zero nozzle clogs.
                </p>

                {/* Dedicated Mobile Spool Window (< lg only): gives the 3D spool its own clear stage */}
                <div id="hero-mobile-spool-anchor" className="lg:hidden w-full h-[160px] sm:h-[200px] pointer-events-none my-1" aria-hidden="true" />

                {/* Interactive Masterbatch Color Switcher */}
                <div className="mt-2.5 sm:mt-4 max-w-xl">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-[#696969]">
                      Select Masterbatch Color:
                    </span>
                    <span 
                      className="text-xs font-bold text-[#111111] transition-colors duration-200"
                    >
                      {currentTheme.name} <span className="text-[#696969] font-normal">({currentTheme.finish})</span>
                    </span>
                  </div>

                  {/* Horizontal Swatches */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                    {HERO_THEMES.map((theme, idx) => {
                      const isActive = idx === activeThemeIndex;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleSelectTheme(idx)}
                          aria-label={`Switch to ${theme.name}`}
                          className={`group relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full transition-all duration-200 ${
                            isActive 
                              ? 'scale-110 shadow-md ring-2 ring-[#111111] ring-offset-2 ring-offset-white' 
                              : 'hover:scale-105 opacity-85 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: theme.filamentHex,
                            borderColor: '#E5E5E5',
                            borderWidth: '1.5px',
                          }}
                        >
                          {isActive && (
                            <Check 
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] ${
                                theme.id === 'porcelain-white' ? 'text-black' : 'text-white'
                              }`} 
                            />
                          )}
                          <span className="sr-only">{theme.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Call-to-Action Buttons — Primary is Black with White Typography */}
                <div className="mt-3.5 sm:mt-5 flex flex-wrap items-center gap-2.5 sm:gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-5 sm:px-7 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 active:scale-95 shadow-md bg-[#111111] text-white hover:bg-[#252525]"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Add to Cart • {formatPrice(currentTheme.price, currency)}</span>
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <Link
                    href={`/product/${currentTheme.productSlug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-wide uppercase border border-[#E5E5E5] bg-white text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#F3F3F3] active:scale-95"
                  >
                    View Specs
                  </Link>
                </div>

                {/* Real Verified Specs Readouts */}
                <div className="mt-3.5 sm:mt-5 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-4 border-t border-[#E5E5E5] pt-2.5 sm:pt-3.5">
                  {currentTheme.metrics.map((metric) => (
                    <div key={metric.label}>
                      <strong 
                        className="font-mono text-lg sm:text-xl font-extrabold text-[#111111] block"
                      >
                        {metric.val}
                      </strong>
                      <span 
                        className="mt-0.5 block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[#696969]"
                      >
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACT 2: Mid-Scroll Precision Laser Detail */}
              <div
                ref={detailRef}
                className="pointer-events-none absolute inset-x-0 w-full opacity-0 will-change-[opacity,transform]"
              >
                <div 
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#111111] border border-[#E5E5E5] bg-white shadow-sm"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-600" />
                  Dual-Axis Laser Metrology
                </div>

                <h2 className="max-w-xl text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tightest text-[#111111]">
                  Round Strand. <br />
                  <span className="text-[#5401C5]">
                    Calibrated 4.2N Tension.
                  </span>
                </h2>

                <p 
                  className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#696969]"
                >
                  Every layer is wound side-by-side with computer-controlled geometric pitch. Orbiting the spool reveals its transparent smoked flanges, structural cutouts, and dense, snag-free core windings.
                </p>

                {/* Live Laser Micrometer HUD Card */}
                <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5E5E5] shadow-xl max-w-lg space-y-3.5 pointer-events-auto">
                  <div className="flex items-center justify-between text-xs border-b border-[#E5E5E5] pb-3">
                    <span className="font-mono uppercase font-bold text-[#252525] flex items-center gap-2 text-[11px]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Optical Laser Micrometer: Online
                    </span>
                    <span className="font-mono text-emerald-600 font-bold text-xs">
                      ±0.018 mm (PASS)
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#696969] block">
                        Real-Time Diameter
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span ref={liveGaugeRef} className="font-mono text-3xl sm:text-4xl font-extrabold text-[#111111]">
                          1.750
                        </span>
                        <span className="font-mono text-sm font-bold text-emerald-600">
                          mm
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#696969] block">
                        Circularity Ratio
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#111111] mt-1 block">
                        99.4% Roundness
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 pointer-events-auto">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#252525] transition-all shadow-md active:scale-95"
                  >
                    <span>Shop Precision Spools</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/colors"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#E5E5E5] text-[#111111] font-bold text-xs uppercase tracking-wider hover:bg-[#F3F3F3] transition-all shadow-sm"
                  >
                    All Masterbatches
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Unrestricted desktop space for the moving 3D Spool */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-5 min-h-[70vh] pointer-events-none" />
          </div>
        </div>

        {/* ACT 3: Grand Climax — The Optical Aperture & Metrology Climax (Active 84% - 100%) */}
        <div
          ref={climaxRef}
          className="pointer-events-none absolute inset-0 flex flex-col justify-between items-center text-center opacity-0 will-change-[opacity,transform] z-30 px-5 sm:px-8 max-w-5xl mx-auto pt-20 sm:pt-24 pb-8 sm:pb-12"
        >
          {/* Top: Status Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#111111] border border-[#E5E5E5] bg-white/95 backdrop-blur-xl shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5401C5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5401C5]"></span>
            </span>
            <span>Aperture Metrology • 100% Monofilament Purity</span>
          </div>

          {/* Middle: Open visual space for the 3D Spool */}
          <div className="flex-1 w-full min-h-[140px] sm:min-h-[200px]" aria-hidden="true" />

          {/* Bottom Editorial Content */}
          <div className="w-full flex flex-col items-center">
            {/* Massive Editorial Headline */}
            <h2 className="max-w-4xl text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase leading-[1.04] tracking-tightest text-[#111111]">
              Perfection In <span className="text-[#5401C5]">Every Single Layer.</span>
            </h2>

            {/* Editorial Subtitle */}
            <p className="mt-2.5 sm:mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#696969] font-medium hidden sm:block">
              Side-by-side computer-wound pitch eliminates tangles at high speeds. Calibrated 4.2N tension ensures smooth, continuous extrusion through every print hour.
            </p>

            {/* Three Pure White Telemetry Cards */}
            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg w-full">
              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5E5E5] shadow-sm">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-[#696969] block">Tolerance</span>
                <strong className="font-mono text-sm sm:text-lg font-extrabold text-[#111111] block mt-0.5">±0.018 mm</strong>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5E5E5] shadow-sm">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-[#696969] block">Roundness</span>
                <strong className="font-mono text-sm sm:text-lg font-extrabold text-[#5401C5] block mt-0.5">99.8%</strong>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5E5E5] shadow-sm">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-[#696969] block">Winding</span>
                <strong className="font-mono text-sm sm:text-lg font-extrabold text-[#111111] block mt-0.5">Snag-Free</strong>
              </div>
            </div>

            {/* Smooth Scroll CTA Bridge to Section 2 */}
            <div className="mt-4 sm:mt-6 pointer-events-auto">
              <a
                href="#color-studio"
                className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:bg-[#252525] active:scale-95 shadow-md"
              >
                <span>Explore Masterbatch Science</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Prompt Indicator */}
        <div
          ref={indicatorRef}
          className="pointer-events-none absolute bottom-4 sm:bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[#696969] will-change-[opacity]"
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em]">
            Scroll to inspect spool in 3D
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce text-[#111111]" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
