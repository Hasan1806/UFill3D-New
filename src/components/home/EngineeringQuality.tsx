'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Layers, 
  Droplets, 
  Sparkles, 
  CheckCircle2,
  ArrowRight,
  Gauge,
  Sliders
} from 'lucide-react';

export function EngineeringQuality() {
  const [simulationMode, setSimulationMode] = useState<'ufill' | 'generic'>('ufill');

  const qualityPillars = [
    {
      icon: Activity,
      title: 'Dual-Axis Laser Micrometer Gauging',
      subtitle: '2,400 scans/second optical line inspection',
      description: 'Continuous dual-axis optical micrometers measure the extrusion stream across two perpendicular planes. Every segment exceeding ±0.02 mm tolerance is automatically culled at the winding head.',
      spec: '±0.02 mm',
      specLabel: 'Guaranteed Tolerance',
      accent: '#10B981',
    },
    {
      icon: Cpu,
      title: 'Virgin NatureWorks Ingeo™ Resins',
      subtitle: 'Zero regrind, zero uncalibrated fillers',
      description: 'We exclusively process 100% medical/food-contact compliant virgin pellets. No recycled regrind or recycled waste dust ensures zero thermal carbonization inside 0.2mm nozzles.',
      spec: '100%',
      specLabel: 'Virgin Polymer Purity',
      accent: '#5401C5',
    },
    {
      icon: Layers,
      title: 'Robotic Tension-Calibrated Winding',
      subtitle: 'Precise 4.2 N loop tension',
      description: 'High-speed automated winding arms lay filament side-by-side with computer-controlled geometric pitch. Zero loop overlaps eliminate catastrophic mid-print spool snags.',
      spec: '0.00%',
      specLabel: 'Spool Snag Rate',
      accent: '#111111',
    },
    {
      icon: Droplets,
      title: 'Desiccant-Sealed Aluminum Barrier',
      subtitle: '<0.05% moisture content at unboxing',
      description: 'Directly from the 60°C dry-air annealing chamber, spools are robotically sealed in multi-layer aluminum hermetic foil with high-absorption molecular sieve desiccant.',
      spec: '<0.05%',
      specLabel: 'Moisture at Pack',
      accent: '#F97316',
    },
  ];

  return (
    <section 
      id="engineering-quality"
      className="py-28 sm:py-36 bg-[#FAFAFA] text-[#252525] relative overflow-hidden border-b border-[#E5E5E5] select-none"
    >
      {/* Background Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-[#5401C5]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#111111] text-xs font-bold uppercase tracking-[0.2em] border border-[#E5E5E5] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Section 03 • Metrology Standards</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.92] tracking-tightest text-[#111111]">
            0.00% Clog Rate. <br />
            <span className="text-[#5401C5]">
              ±0.02 mm Metrology Rigor.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#696969] max-w-2xl leading-relaxed">
            3D printing failures are rarely printer errors — they are caused by inconsistent filament diameter, moisture pockets, and loose winding snags. We eliminate all three at the manufacturing source.
          </p>
        </div>

        {/* Interactive Metrology Comparison HUD */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E5E5] shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-[#111111] font-bold">
                  Dual-Axis Optical Micrometer Simulation
                </span>
              </div>
              <p className="text-xs text-[#696969] mt-1">
                Visualizing extrusion strand variance measured across 1,000 continuous meters
              </p>
            </div>

            {/* Toggle Mode */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F3F3F3] rounded-xl border border-[#E5E5E5] text-xs font-bold">
              <button
                onClick={() => setSimulationMode('ufill')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  simulationMode === 'ufill'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-[#696969] hover:text-[#111111]'
                }`}
              >
                UFill3D (±0.018 mm)
              </button>
              <button
                onClick={() => setSimulationMode('generic')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  simulationMode === 'generic'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-[#696969] hover:text-[#111111]'
                }`}
              >
                Generic Filament (±0.065 mm)
              </button>
            </div>
          </div>

          {/* Interactive Tolerance Visualizer Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#696969]">Upper Limit: 1.770 mm</span>
                <span className={simulationMode === 'ufill' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {simulationMode === 'ufill' ? 'Within Precision Spec (PASS)' : 'Exceeds Tolerance Limit (FAIL)'}
                </span>
                <span className="text-[#696969]">Lower Limit: 1.730 mm</span>
              </div>

              {/* Graphic Waveform Box */}
              <div className="relative h-28 w-full rounded-2xl bg-[#F3F3F3] border border-[#E5E5E5] p-3 overflow-hidden flex items-center">
                {/* Upper Tolerance Guide Line */}
                <div className="absolute top-4 inset-x-0 border-t border-dashed border-[#D1D5DB]" />
                <span className="absolute top-1 right-3 text-[9px] font-mono text-[#696969]">+0.02 mm</span>

                {/* Target Baseline */}
                <div className="absolute top-1/2 inset-x-0 border-t border-emerald-600/40" />
                <span className="absolute top-[44%] right-3 text-[9px] font-mono text-emerald-600 font-bold">1.750 mm Nom</span>

                {/* Lower Tolerance Guide Line */}
                <div className="absolute bottom-4 inset-x-0 border-t border-dashed border-[#D1D5DB]" />
                <span className="absolute bottom-1 right-3 text-[9px] font-mono text-[#696969]">-0.02 mm</span>

                {/* Synthetic Waveform Bars */}
                <div className="relative w-full h-full flex items-center justify-between gap-1 z-10">
                  {Array.from({ length: 42 }).map((_, idx) => {
                    const deviation = simulationMode === 'ufill'
                      ? Math.sin(idx * 0.45) * 8 + (idx % 3 === 0 ? 3 : -3)
                      : Math.sin(idx * 0.3) * 32 + (idx % 2 === 0 ? 18 : -22);
                    const isOutOfSpec = Math.abs(deviation) > 20;

                    return (
                      <div
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-500 ${
                          isOutOfSpec
                            ? 'bg-rose-500'
                            : simulationMode === 'ufill'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                        }`}
                        style={{
                          height: `${Math.max(6, Math.abs(deviation) * 2.2)}px`,
                          transform: `translateY(${deviation * 0.6}px)`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Readout Summary */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#F3F3F3] border border-[#E5E5E5] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#696969] block">
                  Measured Standard Deviation
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#111111] mt-0.5">
                  {simulationMode === 'ufill' ? 'σ = 0.007 mm' : 'σ = 0.038 mm'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E5E5] text-xs">
                <div>
                  <span className="text-[#696969] block text-[10px] uppercase font-mono">Nozzle Backpressure</span>
                  <strong className={simulationMode === 'ufill' ? 'text-emerald-600' : 'text-rose-600'}>
                    {simulationMode === 'ufill' ? 'Constant (Zero Surge)' : 'Fluctuating'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#696969] block text-[10px] uppercase font-mono">CoreXY Speed Limit</span>
                  <strong className={simulationMode === 'ufill' ? 'text-[#111111]' : 'text-amber-600'}>
                    {simulationMode === 'ufill' ? '600 mm/s Confirmed' : '< 180 mm/s Unstable'}
                  </strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {qualityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 rounded-3xl bg-white border border-[#E5E5E5] hover:border-[#111111]/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div>
                  <div 
                    className="w-12 h-12 rounded-2xl bg-[#F3F3F3] border border-[#E5E5E5] flex items-center justify-center text-[#111111] mb-6 group-hover:scale-110 transition-transform"
                  >
                    <Icon className="w-6 h-6" style={{ color: pillar.accent }} />
                  </div>

                  <span className="text-3xl font-extrabold font-mono text-[#111111] block mb-1">
                    {pillar.spec}
                  </span>
                  <span 
                    className="text-[10px] font-bold uppercase tracking-[0.18em] block mb-4"
                    style={{ color: pillar.accent }}
                  >
                    {pillar.specLabel}
                  </span>

                  <h3 className="text-lg font-bold text-[#111111] mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#696969] mb-3">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs text-[#252525] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] font-mono text-[#696969]">
                  <span>Standard 0{qualityPillars.indexOf(pillar) + 1}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default EngineeringQuality;
