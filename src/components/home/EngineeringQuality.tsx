'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Layers, 
  Droplets, 
  Wind, 
  Sparkles, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export function EngineeringQuality() {
  const qualityPillars = [
    {
      icon: Activity,
      title: 'Dual-Axis Laser Micrometer Gauging',
      subtitle: '2,400 scans/second optical line inspection',
      description: 'Continuous dual-axis optical micrometers measure the extrusion stream across two perpendicular planes. Every segment exceeding ±0.02 mm tolerance is automatically culled at the winding head.',
      spec: '±0.02 mm',
      specLabel: 'Guaranteed Tolerance',
    },
    {
      icon: Cpu,
      title: 'Virgin NatureWorks Ingeo™ Resins',
      subtitle: 'Zero regrind, zero uncalibrated fillers',
      description: 'We exclusively process 100% medical/food-contact compliant virgin pellets. No recycled regrind or recycled waste dust ensures zero thermal carbonization inside 0.2mm nozzles.',
      spec: '100%',
      specLabel: 'Virgin Polymer Purity',
    },
    {
      icon: Layers,
      title: 'Robotic Tension-Calibrated Winding',
      subtitle: 'Precise 4.2 N loop tension',
      description: 'High-speed automated winding arms lay filament side-by-side with computer-controlled geometric pitch. Zero loop overlaps eliminate catastrophic mid-print spool snags.',
      spec: '0.00%',
      specLabel: 'Spool Snag Rate',
    },
    {
      icon: Droplets,
      title: 'Desiccant-Sealed Aluminum Barrier',
      subtitle: '&lt;0.05% moisture content at unboxing',
      description: 'Directly from the 60°C dry-air annealing chamber, spools are robotically sealed in multi-layer aluminum hermetic foil with high-absorption molecular sieve desiccant.',
      spec: '&lt;0.05%',
      specLabel: 'Moisture at Pack',
    },
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden border-b border-ufill-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider border border-ufill-secondary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Section 05 • Metrology & Standards</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest leading-[1.08]">
            Built with Metrology-Grade <br />
            Manufacturing Rigor.
          </h2>
          <p className="text-base sm:text-lg text-ufill-textMuted leading-relaxed">
            3D printing failures are rarely printer errors — they are caused by inconsistent filament diameter, moisture pockets, and filament tangles. We eliminate all three at the manufacturing source.
          </p>
        </div>

        {/* Feature Grid with Technical Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-8 rounded-3xl bg-ufill-background border border-ufill-border hover:border-ufill-secondary/40 hover:shadow-elevation-2 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-ufill-border flex items-center justify-center text-ufill-secondary shadow-sm mb-6 group-hover:bg-ufill-secondary group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-2xl font-bold font-mono text-ufill-primary block mb-1">
                    {pillar.spec}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ufill-secondary block mb-4">
                    {pillar.specLabel}
                  </span>

                  <h3 className="text-lg font-bold text-ufill-primary mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-ufill-textDim mb-3">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs text-ufill-textMuted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-ufill-border/60 flex items-center gap-2 text-xs font-semibold text-ufill-primary">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>QC Verified on Every Batch</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Diagram Banner */}
        <div className="mt-16 rounded-3xl bg-ufill-primary text-white p-8 sm:p-12 relative overflow-hidden shadow-elevation-3">
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-ufill-tertiary">
                Direct Lab Testing & Quality Control
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Scan the QR on your spool to view exact laser telemetry.
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Every UFill3D spool includes an individual batch QR code. Scan with your phone to view the real-time diameter graph recorded as your exact 330-meter spool passed through our laser micrometers.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover transition-all shadow-glow-purple"
              >
                <span>Read Factory Metrology Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Download RoHS & REACH Certificates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EngineeringQuality;
