'use client';

import React from 'react';
import { ColorExplorer } from '@/components/home/ColorExplorer';
import { Palette, Sparkles, ShieldCheck } from 'lucide-react';

export default function ColorsPage() {
  return (
    <div className="pt-24 pb-20 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6">
        <div className="py-6 border-b border-ufill-border mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>Official Color Science Lab</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
            UFill3D Masterbatch Color Studio
          </h1>
          <p className="text-base text-ufill-textMuted max-w-2xl mt-2 leading-relaxed">
            Formulated with heat-stable automotive organic dyes and high-purity inorganic minerals. Zero discoloration or shade variation between batch lots.
          </p>
        </div>
      </div>

      <ColorExplorer />
    </div>
  );
}
