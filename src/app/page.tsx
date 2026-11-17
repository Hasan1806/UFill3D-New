import React from 'react';
import { Hero } from '@/components/home/Hero';
import { ColorExplorer } from '@/components/home/ColorExplorer';
import { EngineeringQuality } from '@/components/home/EngineeringQuality';
import { MaterialShowcase } from '@/components/home/MaterialShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ClosingBrandExperience } from '@/components/home/ClosingBrandExperience';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-[#080B16]">
      {/* Section 1 — Immersive Hero with Dynamic Color Themes & 3D Spool Movement */}
      <Hero />

      {/* Section 2 — Explore Filament Colours (Color Science Studio & 3D Selector) */}
      <ColorExplorer />

      {/* Section 3 — Premium Filament Quality & Dual-Axis Metrology Standards */}
      <EngineeringQuality />

      {/* Section 4 — Materials & Engineering Applications */}
      <MaterialShowcase />

      {/* Section 5 — Product Collection & Flagship Catalog Spotlight */}
      <FeaturedProducts />

      {/* Section 6 — Closing Brand Experience & Shopping CTA */}
      <ClosingBrandExperience />
    </div>
  );
}
