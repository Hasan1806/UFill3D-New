import React from 'react';
import Link from 'next/link';
import { ArrowRight, CircleDot } from 'lucide-react';
import { MATERIAL_CATEGORIES } from '@/data/products';
import { formatPrice } from '@/lib/currency';

export function MaterialShowcase() {
  return (
    <section className="relative overflow-hidden border-b border-ufill-border bg-ufill-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-14 grid gap-6 border-b border-ufill-primary/20 pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ufill-secondary">Material systems / 01—04</div>
            <h2 className="max-w-3xl text-4xl font-bold leading-[0.98] tracking-tightest text-ufill-primary sm:text-6xl">
              Four material families. One exacting standard.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-ufill-textMuted lg:col-span-5 lg:justify-self-end">
            From rapid aesthetic prototypes to rigid end-use tooling, every formulation is continuously monitored for dimensional consistency.
          </p>
        </div>

        <div className="grid border-l border-t border-ufill-primary/30 md:grid-cols-2">
          {MATERIAL_CATEGORIES.map((material, index) => (
            <article key={material.slug} className="relative min-h-[390px] border-b border-r border-ufill-primary/30 bg-white/25 p-6 sm:p-8 lg:p-10">
              <div className="absolute right-0 top-0 min-w-[104px] border-b border-l border-ufill-primary/30 bg-ufill-primary px-4 py-3 text-right text-white">
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">Heat deflection</span>
                <strong className="mt-1 block font-mono text-2xl leading-none">{material.heatDeflection}</strong>
              </div>

              <div className="pr-24 text-xs font-bold uppercase tracking-[0.2em] text-ufill-secondary">
                {String(index + 1).padStart(2, '0')} / {material.slug}
              </div>
              <h3 className="mt-7 max-w-md text-3xl font-bold tracking-tight text-ufill-primary sm:text-4xl">{material.name}</h3>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ufill-textMuted">{material.description}</p>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {material.idealFor.map((application) => (
                  <div key={application} className="flex min-h-11 items-center gap-2 border border-ufill-primary/25 px-3 py-2 text-sm font-medium text-ufill-primary">
                    <CircleDot className="h-3.5 w-3.5 shrink-0 text-ufill-secondary" />
                    {application}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ufill-primary/15 pt-5">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-ufill-textDim">Starting at</span>
                  <strong className="font-mono text-lg text-ufill-primary">{formatPrice(material.startingPrice)} / 1 kg</strong>
                </div>
                <div className="flex gap-4">
                  <Link href={`/materials/${material.slug}`} className="text-sm font-bold text-ufill-primary hover:text-ufill-secondary">Specs</Link>
                  <Link href={`/shop?material=${material.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-ufill-secondary hover:underline">
                    Shop <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MaterialShowcase;
