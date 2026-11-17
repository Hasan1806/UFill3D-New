import React from 'react';
import { BulkOrdersB2B } from '@/components/home/BulkOrdersB2B';

export const metadata = {
  title: 'Commercial Print Farm Procurement & B2B | UFill3D',
  description: 'Enterprise filament supply for commercial 3D print farms, universities, and industrial manufacturing fleets. Tiered volume discounts up to 30%.',
};

export default function B2BPage() {
  return (
    <div className="pt-24 bg-ufill-background min-h-screen">
      <BulkOrdersB2B />
    </div>
  );
}
