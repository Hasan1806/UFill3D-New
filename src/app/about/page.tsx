import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Cpu, Leaf, Layers, ArrowRight, Award, Factory } from 'lucide-react';

export const metadata = {
  title: 'About UFill3D — Engineering Philosophy & Standards',
  description: 'Learn about UFill3D’s precision extrusion facilities, optical metrology testing, and commitment to zero-clog additive manufacturing.',
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl py-8 border-b border-ufill-border mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-3">
            <span>Our Origin & Purpose</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest leading-[1.08]">
            We Built UFill3D Because Modern High-Speed Printers Deserve Better Material.
          </h1>
          <p className="text-base sm:text-lg text-ufill-textMuted mt-4 leading-relaxed">
            As CoreXY 3D printers pushed linear speeds from 50 mm/s to 600 mm/s, legacy filament manufacturing remained stuck in the past — delivering clogs, oval cross-sections, and tangled spools. We founded UFill3D to re-engineer additive polymers from the chemical pellet to the winding core.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ufill-tertiary flex items-center justify-center text-ufill-secondary">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-ufill-primary">Metrology-Driven</h3>
            <p className="text-sm text-ufill-textMuted leading-relaxed">
              Every production line operates with high-frequency dual-axis laser micrometers that sample 2,400 measurements per second. Deviation beyond ±0.02mm is culled instantly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ufill-tertiary flex items-center justify-center text-ufill-secondary">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-ufill-primary">100% Virgin Resins</h3>
            <p className="text-sm text-ufill-textMuted leading-relaxed">
              No scrap regrind. No industrial carbon ash fillers. We formulate strictly with medical and aerospace-certified biopolymers from NatureWorks and Toray.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ufill-tertiary flex items-center justify-center text-ufill-secondary">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-ufill-primary">Eco-Conscious Circularity</h3>
            <p className="text-sm text-ufill-textMuted leading-relaxed">
              Our spools feature biodegradable high-density cardboard cores and precision cutout flanges, saving over 14 tons of single-use plastic waste each quarter.
            </p>
          </div>
        </div>

        {/* Callout Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-ufill-primary text-white shadow-elevation-3 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-ufill-secondary font-mono">
              Tagline Philosophy
            </span>
            <h2 className="text-3xl font-bold">"Make it Real."</h2>
            <p className="text-sm text-slate-300 max-w-xl">
              From an architect's first sketch to a flight-ready drone arm, UFill3D bridges the chasm between digital imagination and physical reality.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover transition-all shadow-glow-purple whitespace-nowrap"
          >
            <span>Explore Spool Range</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
