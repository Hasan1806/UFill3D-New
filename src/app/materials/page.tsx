import React from 'react';
import Link from 'next/link';
import { MATERIAL_CATEGORIES } from '@/data/products';
import { ShieldCheck, ArrowRight, Zap, Check, Thermometer, Layers } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export const metadata = {
  title: 'Polymer Engineering & Materials | UFill3D',
  description: 'Deep dive into UFill3D technical materials: PLA Ultra, PLA+ High-Speed, PETG Pro, Carbon Fiber Composites, and TPU Elastomers.',
};

export default function MaterialsPage() {
  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="py-8 border-b border-ufill-border mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-3">
            <span>Engineering Metrology</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
            Polymer Science & Material Hierarchy
          </h1>
          <p className="text-base text-ufill-textMuted max-w-2xl mt-2 leading-relaxed">
            Every polymer grade manufactured at UFill3D is subjected to differential scanning calorimetry (DSC), melt flow rate verification, and multi-axis tensile stress analysis.
          </p>
        </div>

        {/* Materials Detailed Breakdown */}
        <div className="space-y-12">
          {MATERIAL_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.slug}
              className="p-8 sm:p-12 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-ufill-secondary bg-ufill-tertiary px-3 py-1 rounded-full">
                    Category 0{idx + 1}
                  </span>
                  <span className="text-xs text-ufill-textDim font-bold uppercase">
                    Starting at {formatPrice(cat.startingPrice)}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-ufill-primary">
                  {cat.name}
                </h2>
                <p className="text-sm font-semibold text-ufill-secondary">
                  {cat.tagline}
                </p>
                <p className="text-sm text-ufill-textMuted leading-relaxed">
                  {cat.description}
                </p>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-ufill-border">
                  <div>
                    <span className="text-[11px] text-ufill-textDim block uppercase">Heat Deflection</span>
                    <span className="font-mono font-bold text-ufill-primary text-sm mt-0.5 block">{cat.heatDeflection}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-ufill-textDim block uppercase">Tensile Modulus</span>
                    <span className="font-mono font-bold text-ufill-primary text-sm mt-0.5 block">{cat.tensileRating}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-ufill-textDim block uppercase">Printability</span>
                    <span className="font-mono font-bold text-ufill-secondary text-sm mt-0.5 block">{cat.easeOfPrint}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-ufill-primary uppercase tracking-wider block mb-2">
                    Engineered For:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.idealFor.map((app) => (
                      <span
                        key={app}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-ufill-background border border-ufill-border text-xs text-ufill-text font-medium"
                      >
                        <Check className="w-3.5 h-3.5 text-ufill-secondary" />
                        <span>{app}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-6 rounded-2xl bg-ufill-background border border-ufill-border space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ufill-primary">
                    Dimensional Quality Certification
                  </h4>
                  <ul className="text-xs text-ufill-textMuted space-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Dual-axis laser micrometer tolerance: <strong>±0.02mm</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Roundness ovality check: <strong>≥98%</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Calibrated robotic spooling tension: <strong>4.2 N</strong></span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/shop?material=${cat.slug}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-ufill-primary text-white text-xs font-semibold hover:bg-ufill-secondary transition-all flex items-center justify-center gap-2"
                  >
                    <span>Shop {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/materials/${cat.slug}`}
                    className="py-3 px-4 rounded-xl bg-white border border-ufill-border text-ufill-primary text-xs font-semibold hover:bg-ufill-tertiary transition-all"
                  >
                    Datasheet
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
