import React from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/home/Hero';
import { ColorExplorer } from '@/components/home/ColorExplorer';
import { EngineeringQuality } from '@/components/home/EngineeringQuality';
import { MaterialShowcase } from '@/components/home/MaterialShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ClosingBrandExperience } from '@/components/home/ClosingBrandExperience';

const SpoolJourneyOverlay = dynamic(
  () => import('@/components/3d/SpoolJourneyOverlay').then((mod) => mod.SpoolJourneyOverlay),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="relative flex flex-col w-full bg-[#FAFAFA] text-[#252525]">
      {/* Authoritative Single 3D Filament Spool Canvas Journey (Hero -> Footer) */}
      <SpoolJourneyOverlay />

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
