'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Factory 
} from 'lucide-react';

const FilamentSpoolCanvas = dynamic(
  () => import('@/components/3d/FilamentSpoolCanvas').then((mod) => mod.FilamentSpoolCanvas),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-full bg-white/5" /> }
);

export function ClosingBrandExperience() {
  const guarantees = [
    {
      icon: ShieldCheck,
      title: '±0.02 mm Metrology Guarantee',
      desc: 'Dual-axis optical micrometer monitored. 100% replacement if out of tolerance.',
    },
    {
      icon: RotateCcw,
      title: '100% Tangle-Free Assurance',
      desc: 'Computer-calibrated 4.2 N loop tension eliminates spool tangles entirely.',
    },
    {
      icon: Truck,
      title: 'Express Worldwide Shipping',
      desc: 'Dispatched in vacuum-sealed aluminum hermetic barrier foil with molecular desiccant.',
    },
    {
      icon: Factory,
      title: 'B2B & High-Volume Print Farms',
      desc: 'Volume pricing, custom masterbatches, and 5kg bulk reels for industrial manufacturers.',
    },
  ];

  return (
    <section 
      id="closing-brand-experience"
      className="relative overflow-hidden py-32 sm:py-44 bg-[#0A0D1F] text-white border-b border-white/10 select-none"
    >
      {/* Background Matrix & Subtle Gradient Spheres */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[850px] bg-[#6258F5]/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
        
        {/* Brand Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.22em] border border-white/15 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Section 06 • The UFill3D Standard</span>
        </div>

        {/* Dialed-Coffee Style Monumental Typography */}
        <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] font-extrabold uppercase leading-[0.90] tracking-tightest text-white max-w-5xl mx-auto">
          Get Dialed. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6258F5] via-[#A59BFF] to-white">
            Make It Real.
          </span>
        </h2>

        <p className="mt-8 text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Engineered for master fabricators, aerospace research laboratories, and high-velocity production print farms. Zero compromises on tolerance, flow, or finish.
        </p>

        {/* 3D Spool Majestic Floating Centerpiece */}
        <div className="relative aspect-square max-w-[420px] sm:max-w-[480px] mx-auto my-10 sm:my-14">
          <div className="absolute inset-0 z-10">
            <FilamentSpoolCanvas
              color="#6258F5"
              finish="Silk"
              rimColor="#6258F5"
              interactive={true}
              scale={1.35}
              rotationX={0.25}
              rotationY={-0.6}
              autoRotateSpeed={0.003}
              enableMouseParallax={true}
            />
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-white text-black font-extrabold text-sm uppercase tracking-wider hover:bg-white/90 shadow-2xl transition-all active:scale-95 group"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/b2b"
            className="inline-flex items-center gap-2.5 px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-extrabold text-sm uppercase tracking-wider hover:bg-white/20 backdrop-blur-md transition-all active:scale-95"
          >
            Request B2B Sample Pack
          </Link>
        </div>

        {/* Brand Guarantees Grid */}
        <div className="mt-20 pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  {g.title}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ClosingBrandExperience;
