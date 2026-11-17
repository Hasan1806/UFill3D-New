'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MATERIAL_CATEGORIES } from '@/data/products';
import { ArrowRight, Thermometer, ShieldAlert, Zap, Check } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export function MaterialShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const activeMaterial = MATERIAL_CATEGORIES[activeTab];

  const materialVisuals = [
    {
      title: 'PLA & PLA+ HyperFlow',
      subtitle: 'Pure Ingeo Biopolymer Matrix',
      metric: '0.02 mm',
      metricLabel: 'Dimensional Precision',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      badge: 'Most Popular',
      colorPreview: '#6258F5',
    },
    {
      title: 'PETG Pro Industrial',
      subtitle: 'Hydrophobic Glycol-Modified Polymer',
      metric: '75 °C',
      metricLabel: 'Heat Deflection Temp',
      image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1200&q=80',
      badge: 'Water & Chemical Proof',
      colorPreview: '#11152E',
    },
    {
      title: 'Carbon Fiber Composites',
      subtitle: '15% Chopped Toray Micro-Fibers',
      metric: '5400 MPa',
      metricLabel: 'Flexural Modulus',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      badge: 'Extreme Rigidity',
      colorPreview: '#1E2028',
    },
    {
      title: 'TPU 95A Elastomers',
      subtitle: 'Thermoplastic Polyurethane Chemistry',
      metric: '580%',
      metricLabel: 'Elongation at Break',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      badge: 'Dampening & Impact',
      colorPreview: '#EAB308',
    },
  ];

  const currentVisual = materialVisuals[activeTab];

  return (
    <section className="py-28 bg-white relative overflow-hidden border-t border-b border-ufill-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-3">
              <span>Section 03</span>
              <span>•</span>
              <span>Polymer Chemistry</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
              Engineered for <br className="hidden sm:inline" />
              Every Mechanical Demand.
            </h2>
          </div>
          <p className="text-base text-ufill-textMuted max-w-md leading-relaxed">
            From rapid aesthetic prototyping to aerospace end-use fixtures, discover filaments formulated to outperform ordinary commercial plastics.
          </p>
        </div>

        {/* Editorial Interactive Tabs Navigation */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-10 border-b border-ufill-border">
          {MATERIAL_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(idx)}
              className={`pb-4 px-3 text-sm font-bold whitespace-nowrap transition-all relative ${
                activeTab === idx
                  ? 'text-ufill-secondary'
                  : 'text-ufill-textMuted hover:text-ufill-primary'
              }`}
            >
              <span>{cat.name}</span>
              {activeTab === idx && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ufill-secondary" />
              )}
            </button>
          ))}
        </div>

        {/* Main Editorial Feature Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Deep Material Characteristics & Specs */}
          <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-ufill-background border border-ufill-border shadow-elevation-1">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-ufill-tertiary text-ufill-secondary font-mono text-xs font-bold uppercase">
                  {currentVisual.badge}
                </span>
                <span className="text-xs font-semibold text-ufill-textMuted">
                  From <strong className="text-ufill-primary text-base font-bold">{formatPrice(activeMaterial.startingPrice)}</strong> / 1kg
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-bold text-ufill-primary tracking-tight">
                  {activeMaterial.name}
                </h3>
                <p className="text-sm font-semibold text-ufill-secondary mt-1">
                  {activeMaterial.tagline}
                </p>
                <p className="text-base text-ufill-textMuted mt-4 leading-relaxed">
                  {activeMaterial.description}
                </p>
              </div>

              {/* Engineering Spec Matrix */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-ufill-border/80">
                <div>
                  <span className="text-xs text-ufill-textDim block">Heat Deflection</span>
                  <span className="text-base font-bold text-ufill-primary font-mono mt-1 block">
                    {activeMaterial.heatDeflection}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-ufill-textDim block">Tensile Rating</span>
                  <span className="text-base font-bold text-ufill-primary font-mono mt-1 block">
                    {activeMaterial.tensileRating.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-ufill-textDim block">Printability</span>
                  <span className="text-base font-bold text-ufill-secondary font-mono mt-1 block">
                    {activeMaterial.easeOfPrint}
                  </span>
                </div>
              </div>

              {/* Recommended Applications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ufill-primary mb-3">
                  Optimal Applications:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeMaterial.idealFor.map((app) => (
                    <span
                      key={app}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-ufill-border text-xs font-medium text-ufill-text"
                    >
                      <Check className="w-3.5 h-3.5 text-ufill-secondary" />
                      <span>{app}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex flex-wrap gap-4 mt-6">
              <Link
                href={`/shop?material=${activeMaterial.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-ufill-primary text-white font-semibold text-sm hover:bg-ufill-secondary transition-all shadow-elevation-2 active:scale-95"
              >
                <span>Shop {activeMaterial.name} Spools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/materials/${activeMaterial.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-ufill-primary font-semibold text-sm hover:bg-ufill-tertiary transition-all border border-ufill-border"
              >
                Detailed Datasheet
              </Link>
            </div>
          </div>

          {/* Right Column: High-Res Editorial Photography Showcase */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden min-h-[460px] bg-ufill-primary flex flex-col justify-end p-8 sm:p-10 text-white shadow-elevation-3 group">
            {/* Background Image with Zoom on Hover */}
            <Image
              src={currentVisual.image}
              alt={currentVisual.title}
              fill
              className="object-cover object-center opacity-65 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ufill-primary via-ufill-primary/40 to-transparent" />

            {/* Bottom Content Overlay */}
            <div className="relative z-10 space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono tracking-wider">
                {currentVisual.subtitle}
              </div>

              <div className="flex items-baseline justify-between border-t border-white/20 pt-4">
                <div>
                  <span className="text-4xl sm:text-5xl font-bold font-mono text-white tracking-tight">
                    {currentVisual.metric}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-slate-300 block mt-1">
                    {currentVisual.metricLabel}
                  </span>
                </div>

                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-glow-purple"
                  style={{ backgroundColor: currentVisual.colorPreview }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MaterialShowcase;
