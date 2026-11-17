import React from 'react';
import { Hero } from '@/components/home/Hero';
import { MaterialShowcase } from '@/components/home/MaterialShowcase';
import { ColorExplorer } from '@/components/home/ColorExplorer';
import { EngineeringQuality } from '@/components/home/EngineeringQuality';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { MadeToCreate } from '@/components/home/MadeToCreate';
import { BulkOrdersB2B } from '@/components/home/BulkOrdersB2B';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Section 1 — Cinematic Hero */}
      <Hero />

      {/* Section 2 — Flagship Scroll-Controlled 3D Spool Showcase (3D4Makers inspired) */}

      {/* Section 3 — Material Collections */}
      <MaterialShowcase />

      {/* Section 4 — Interactive Colour Explorer */}
      <ColorExplorer />

      {/* Section 5 — Engineering and Quality */}
      <EngineeringQuality />

      {/* Section 6 — Featured Products */}
      <FeaturedProducts />

      {/* Section 7 — Made to Create */}
      <MadeToCreate />

      {/* Section 8 — Bulk Orders & Print Farms */}
      <BulkOrdersB2B />
    </div>
  );
}
