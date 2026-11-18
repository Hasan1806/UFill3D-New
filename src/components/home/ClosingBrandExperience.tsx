'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Factory 
} from 'lucide-react';

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
      className="relative overflow-hidden py-32 sm:py-44 bg-[#FAFAFA] text-[#252525] border-b border-[#E5E5E5] select-none"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center">
        
        {/* Brand Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#111111] text-xs font-bold uppercase tracking-[0.22em] border border-[#E5E5E5] shadow-sm mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#5401C5]" />
          <span>Section 06 • The UFill3D Standard</span>
        </div>

        {/* Monumental Headline */}
        <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] font-extrabold uppercase leading-[0.90] tracking-tightest text-[#111111] max-w-5xl mx-auto">
          Precision Made. <br />
          <span className="text-[#5401C5]">
            Make It Real.
          </span>
        </h2>

        <p className="mt-8 text-base sm:text-lg lg:text-xl text-[#696969] max-w-2xl mx-auto leading-relaxed">
          Engineered for master fabricators, aerospace research laboratories, and high-velocity production print farms. Zero compromises on tolerance, flow, or finish.
        </p>

        {/* Primary CTA Buttons — Primary is Black with White Typography */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-[#111111] text-white font-extrabold text-sm uppercase tracking-wider hover:bg-[#252525] shadow-md transition-all active:scale-95 group"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/b2b"
            className="inline-flex items-center gap-2.5 px-8 py-5 rounded-2xl bg-white border border-[#E5E5E5] text-[#111111] font-extrabold text-sm uppercase tracking-wider hover:bg-[#F3F3F3] shadow-sm transition-all active:scale-95"
          >
            Request B2B Sample Pack
          </Link>
        </div>

        {/* Brand Guarantees Grid */}
        <div className="mt-20 pt-16 border-t border-[#E5E5E5] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3F3F3] border border-[#E5E5E5] flex items-center justify-center text-[#111111]">
                  <Icon className="w-5 h-5 text-[#5401C5]" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                  {g.title}
                </h4>
                <p className="text-xs text-[#696969] leading-relaxed">
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
