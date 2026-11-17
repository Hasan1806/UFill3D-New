'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GALLERY_ITEMS } from '@/data/products';
import { Sparkles, Clock, Printer, Layers, ArrowUpRight } from 'lucide-react';

export function MadeToCreate() {
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(0);
  const current = GALLERY_ITEMS[selectedGalleryItem];

  return (
    <section className="py-28 bg-white relative overflow-hidden border-b border-ufill-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider border border-ufill-secondary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Section 07 • Real-World Engineering</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest leading-[1.08]">
            Made to Create. <br />
            From Digital Mesh to Functional Metal Replacement.
          </h2>
          <p className="text-base sm:text-lg text-ufill-textMuted leading-relaxed">
            Witness what is achievable when high-modulus virgin polymers meet tight ±0.02 mm extrusion tolerance. Built by aerospace engineers, surgical tool designers, and industrial roboticists.
          </p>
        </div>

        {/* Gallery Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Visual Feature */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden min-h-[480px] bg-ufill-primary shadow-elevation-3 group">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ufill-primary via-ufill-primary/30 to-transparent" />

            {/* Bottom Meta Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-8 sm:p-10 text-white space-y-4 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-mono">
                <span>{current.material}</span>
                <span>•</span>
                <span>{current.color}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {current.description}
              </p>

              {/* Print Specs Bar */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 text-xs">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-ufill-secondary" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Machine</span>
                    <span className="font-semibold text-white">{current.printer.split('(')[0]}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ufill-secondary" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Print Time</span>
                    <span className="font-semibold text-white">{current.printTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-ufill-secondary" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Layer Height</span>
                    <span className="font-semibold text-white">{current.layerHeight}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Selector List */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            {GALLERY_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedGalleryItem(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedGalleryItem === idx
                    ? 'bg-ufill-background border-ufill-secondary shadow-elevation-1 scale-[1.02]'
                    : 'bg-white border-ufill-border hover:border-ufill-border/80 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-ufill-textDim mb-1 font-mono">
                  <span>Project 0{idx + 1}</span>
                  <span className="text-ufill-secondary font-bold">{item.layerHeight}</span>
                </div>
                <h4 className="text-sm font-bold text-ufill-primary line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-ufill-textMuted mt-1 line-clamp-1">
                  {item.material}
                </p>
              </button>
            ))}

            <div className="p-6 rounded-2xl bg-ufill-tertiary/40 border border-ufill-secondary/20 text-xs text-ufill-primary space-y-2">
              <span className="font-bold text-ufill-secondary uppercase tracking-wider block">
                Submit Your Print
              </span>
              <p className="text-ufill-textMuted leading-relaxed">
                Tag <strong>#UFill3D</strong> or <strong>#MakeItReal</strong> on Instagram or X to be featured in our permanent engineering gallery and receive complimentary spools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MadeToCreate;
