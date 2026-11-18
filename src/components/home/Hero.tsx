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
import { FilamentSpoolCanvas, SpoolCanvasHandle } from '@/components/3d/FilamentSpoolCanvas';
import { HERO_THEMES } from '@/data/heroThemes';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';

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
  const indicatorRef = useRef<HTMLDivElement>(null);
  const liveGaugeRef = useRef<HTMLSpanElement>(null);
  const spoolRef = useRef<SpoolCanvasHandle>(null);
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

    spoolRef.current?.triggerColorSwitch(nextTheme.filamentHex, nextTheme.finish, nextTheme.accentColor);

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
    spoolRef.current?.triggerEntrance();
  }, []);

  // GSAP ScrollTrigger Integration
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const track = trackRef.current;
    const intro = introRef.current;
    const detail = detailRef.current;
    const indicator = indicatorRef.current;
    const gauge = liveGaugeRef.current;
    const bgMesh = bgMeshRef.current;
    const glow = ambientGlowRef.current;
    if (!track || !intro || !detail || !indicator) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fast, responsive scrub (0.3s instead of 1.1s lag)
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.25,
      onUpdate: (self) => {
        const progress = reducedMotion ? 0 : self.progress;

        // Drive 3D Spool multi-axis rotation, position, dynamic light sweep, and camera dolly
        spoolRef.current?.setProgress(progress);

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
        intro.style.transform = `translate3d(0, ${-20 * progress}px, 0)`;
        intro.style.pointerEvents = introOpacity > 0.2 ? 'auto' : 'none';

        // Editorial Layer 2: Technical Metrology Inspection (Active 30% - 85%)
        const detailIn = clamp((progress - 0.28) / 0.14);
        const detailOut = clamp((0.85 - progress) / 0.12);
        const detailOpacity = detailIn * detailOut;
        const detailY = (1 - detailIn) * 18 - (progress - 0.4) * 12;
        detail.style.opacity = String(detailOpacity);
        detail.style.transform = `translate3d(0, ${detailY}px, 0)`;
        detail.style.pointerEvents = detailOpacity > 0.2 ? 'auto' : 'none';

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
        className="sticky top-0 h-svh min-h-[600px] w-full overflow-hidden flex items-center justify-center transition-colors duration-500 ease-in-out"
        style={{
          background: currentTheme.bgGradient,
        }}
      >
        {/* Dynamic Background Mesh Pattern */}
        <div
          ref={bgMeshRef}
          className="absolute inset-0 opacity-[0.06] pointer-events-none will-change-transform"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient Color Glow Sphere */}
        <div
          ref={ambientGlowRef}
          className="absolute top-1/4 right-1/4 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none will-change-transform transition-all duration-500"
          style={{
            backgroundColor: currentTheme.glowColor,
          }}
        />

        {/* Cinematic 3D Filament Spool Canvas Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <FilamentSpoolCanvas
            ref={spoolRef}
            color={currentTheme.filamentHex}
            finish={currentTheme.finish}
            rimColor={currentTheme.accentColor}
            scrollDriven
            enableMouseParallax
            className="w-full h-full"
          />
        </div>

        {/* Foreground Editorial Layer */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-8 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[75vh]">
            
            {/* Left Column Content Area */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col justify-center">
              
              {/* ACT 1: Hero Entry & Dialed-Coffee Style Presentation */}
              <div 
                ref={introRef} 
                className="w-full will-change-[opacity,transform] pointer-events-auto transition-opacity duration-200"
              >
                {/* Dialed Coffee Style Massive Editorial Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] font-extrabold uppercase leading-[0.92] tracking-tightest text-white drop-shadow-sm">
                  {currentTheme.headlineFirst} <br />
                  <span 
                    className="transition-colors duration-300"
                    style={{ color: currentTheme.accentLight }}
                  >
                    {currentTheme.headlineSecond}
                  </span>
                </h1>

                {/* Subtitle / Product Description */}
                <p 
                  className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed transition-colors duration-300"
                  style={{ color: currentTheme.textMuted }}
                >
                  {currentTheme.description}
                </p>

                {/* Interactive Dialed-Coffee Style Filament Color Switcher */}
                <div className="mt-5 sm:mt-6 max-w-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-white/70">
                      Select Masterbatch Color:
                    </span>
                    <span 
                      className="text-xs font-semibold transition-colors duration-200"
                      style={{ color: currentTheme.accentLight }}
                    >
                      {currentTheme.name} ({currentTheme.finish})
                    </span>
                  </div>

                  {/* Horizontal Swatches */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    {HERO_THEMES.map((theme, idx) => {
                      const isActive = idx === activeThemeIndex;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleSelectTheme(idx)}
                          aria-label={`Switch to ${theme.name}`}
                          className={`group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 ${
                            isActive 
                              ? 'scale-110 shadow-lg ring-2 ring-white ring-offset-2 ring-offset-transparent' 
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: theme.filamentHex,
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            borderWidth: '2px',
                          }}
                        >
                          {isActive && (
                            <Check 
                              className={`w-4 h-4 stroke-[3] ${
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

                {/* Call-to-Action Buttons */}
                <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 active:scale-95 shadow-xl"
                    style={{
                      backgroundColor: currentTheme.buttonBg,
                      color: currentTheme.buttonText,
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Cart • {formatPrice(currentTheme.price, currency)}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <Link
                    href={`/product/${currentTheme.productSlug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wide uppercase border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 active:scale-95"
                  >
                    View Specs
                  </Link>
                </div>

                {/* Real Verified Specs Readouts */}
                <div className="mt-6 sm:mt-8 grid max-w-lg grid-cols-3 gap-3 sm:gap-4 border-t border-white/15 pt-5">
                  {currentTheme.metrics.map((metric) => (
                    <div key={metric.label}>
                      <strong 
                        className="font-mono text-lg sm:text-xl font-extrabold text-white block"
                      >
                        {metric.val}
                      </strong>
                      <span 
                        className="mt-0.5 block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/60"
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
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white border border-white/20 bg-black/40 backdrop-blur-md"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  Dual-Axis Laser Metrology
                </div>

                <h2 className="max-w-xl text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.98] tracking-tightest text-white">
                  Round Strand. <br />
                  <span style={{ color: currentTheme.accentLight }}>
                    Calibrated 4.2N Tension.
                  </span>
                </h2>

                <p 
                  className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/80"
                >
                  Every layer is wound side-by-side with computer-controlled geometric pitch. Orbiting the spool reveals its transparent smoked flanges, structural cutouts, and dense, snag-free core windings.
                </p>

                {/* Live Laser Micrometer HUD Card */}
                <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl max-w-lg space-y-3.5 pointer-events-auto">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                    <span className="font-mono uppercase font-bold text-white/80 flex items-center gap-2 text-[11px]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      Optical Laser Micrometer: Online
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">
                      ±0.018 mm (PASS)
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-white/60 block">
                        Real-Time Diameter
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span ref={liveGaugeRef} className="font-mono text-3xl sm:text-4xl font-extrabold text-white">
                          1.750
                        </span>
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          mm
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-white/60 block">
                        Circularity Ratio
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-white mt-1 block">
                        99.4% Roundness
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 pointer-events-auto">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all shadow-lg active:scale-95"
                  >
                    <span>Shop Precision Spools</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/colors"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all backdrop-blur-md"
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

        {/* Minimal Scroll Prompt Indicator */}
        <div
          ref={indicatorRef}
          className="pointer-events-none absolute bottom-4 sm:bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 text-white/70 will-change-[opacity]"
        >
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.22em]">
            Scroll to rotate spool in 3D
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce text-white" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
