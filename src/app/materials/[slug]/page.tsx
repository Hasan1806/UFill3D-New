'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MATERIAL_CATEGORIES, PRODUCTS } from '@/data/products';
import { ArrowRight, ShieldCheck, Check, Thermometer, Layers, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function MaterialSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = MATERIAL_CATEGORIES.find((c) => c.slug === slug) || MATERIAL_CATEGORIES[0];
  const matchingProducts = PRODUCTS.filter((p) => p.material.toLowerCase().includes(category.slug));

  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center gap-2 text-xs text-ufill-textMuted mb-8 font-medium">
          <Link href="/" className="hover:text-ufill-primary">Home</Link>
          <span>/</span>
          <Link href="/materials" className="hover:text-ufill-primary">Materials</Link>
          <span>/</span>
          <span className="text-ufill-primary font-bold">{category.name}</span>
        </nav>

        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-ufill-border shadow-elevation-2 mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider">
            <span>Polymer Datasheet & Engineering Profile</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
            {category.name}
          </h1>
          <p className="text-lg font-medium text-ufill-secondary">
            {category.tagline}
          </p>
          <p className="text-base text-ufill-textMuted max-w-3xl leading-relaxed">
            {category.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-ufill-border">
            <div className="p-4 rounded-xl bg-ufill-background border border-ufill-border">
              <span className="text-xs text-ufill-textDim block">HDT Temperature</span>
              <span className="font-mono text-xl font-bold text-ufill-primary mt-1 block">
                {category.heatDeflection}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-ufill-background border border-ufill-border">
              <span className="text-xs text-ufill-textDim block">Tensile Stress Rating</span>
              <span className="font-mono text-xl font-bold text-ufill-primary mt-1 block">
                {category.tensileRating}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-ufill-background border border-ufill-border">
              <span className="text-xs text-ufill-textDim block">Printability Score</span>
              <span className="font-mono text-xl font-bold text-ufill-secondary mt-1 block">
                {category.easeOfPrint}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-ufill-background border border-ufill-border">
              <span className="text-xs text-ufill-textDim block">Tolerance Precision</span>
              <span className="font-mono text-xl font-bold text-emerald-600 mt-1 block">
                ±0.02 mm
              </span>
            </div>
          </div>
        </div>

        {/* Available Spool Series */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-ufill-primary">
            Available {category.name} Spool Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingProducts.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-white border border-ufill-border hover:border-ufill-secondary/40 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-ufill-secondary uppercase">{p.finish} Sheen</span>
                  <h3 className="text-lg font-bold text-ufill-primary mt-1">{p.name}</h3>
                  <p className="text-xs text-ufill-textMuted mt-1 line-clamp-2">{p.tagline}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-ufill-border flex items-center justify-between">
                  <span className="font-mono font-bold text-ufill-primary">{formatPrice(p.price)}</span>
                  <Link
                    href={`/product/${p.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-ufill-primary text-white text-xs font-semibold hover:bg-ufill-secondary transition-all"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
