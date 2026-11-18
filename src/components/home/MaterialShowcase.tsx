'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CircleDot, 
  Sparkles, 
  Thermometer, 
  Wind, 
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { useCartStore } from '@/lib/cart-store';

interface MaterialFamily {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  startingPrice: number;
  heatDeflection: string;
  printSpeed: string;
  tensileStrength: string;
  nozzleTemp: string;
  bedTemp: string;
  accent: string;
  idealFor: string[];
}

export function MaterialShowcase() {
  const currency = useCartStore((state) => state.currency);
  const [selectedMaterialSlug, setSelectedMaterialSlug] = useState('pla-ultra-precision');

  const materials: MaterialFamily[] = [
    {
      slug: 'pla-ultra-precision',
      name: 'PLA Ultra Precision',
      badge: 'Flagship Metric Standard',
      tagline: 'Dimensional Precision & Silky Micro-Matte Finish',
      description: 'Engineered from ultra-purified Virgin NatureWorks Ingeo™ biopolymer. Delivers flawless overhangs, razor-sharp corners, and zero micro-voids across architectural and mechanical parts.',
      startingPrice: 24.99,
      heatDeflection: '57 °C',
      printSpeed: 'Up to 500 mm/s',
      tensileStrength: '59 MPa',
      nozzleTemp: '200 - 225 °C',
      bedTemp: '50 - 65 °C',
      accent: '#5401C5',
      idealFor: [
        'Industrial Concept Prototyping',
        'Precision Mechanical Fit Checks',
        'Consumer Product Enclosures',
        'Architectural Scale Models',
      ],
    },
    {
      slug: 'pla-plus-high-speed',
      name: 'PLA+ High-Speed HyperFlow',
      badge: 'CoreXY 600 mm/s Certified',
      tagline: 'Extreme Acceleration & 4x Impact Toughness',
      description: 'Specially synthesized for modern CoreXY motion systems (Bambu Lab, Voron, Creality K1, Prusa MK4). Modified with impact-modifier elastomers to provide instant melt-zone thermal dissipation.',
      startingPrice: 27.99,
      heatDeflection: '60 °C',
      printSpeed: 'Up to 600 mm/s',
      tensileStrength: '64 MPa',
      nozzleTemp: '215 - 240 °C',
      bedTemp: '55 - 65 °C',
      accent: '#DC2626',
      idealFor: [
        'High-Acceleration Production Farms',
        'Functional Brackets & Robotics',
        'Snap-Fit Electronic Housings',
        'Impact-Resistant Tooling Fixtures',
      ],
    },
    {
      slug: 'petg-pro-industrial',
      name: 'PETG Pro Industrial',
      badge: 'Chemical & Weather Resistant',
      tagline: 'High Thermal Endurance & Glycol Durability',
      description: 'Glycol-modified polyester delivering superior interlayer fusion, moisture impermeability, and resistance to acids, oils, and UV radiation. Perfect for outdoor functional equipment.',
      startingPrice: 26.99,
      heatDeflection: '75 °C',
      printSpeed: 'Up to 400 mm/s',
      tensileStrength: '52 MPa',
      nozzleTemp: '230 - 255 °C',
      bedTemp: '70 - 85 °C',
      accent: '#06B6D4',
      idealFor: [
        'Outdoor Sensor & Camera Housings',
        'Chemical-Contact Lab Fixtures',
        'Automotive Under-Dash Mounts',
        'Water-Impermeable Containers',
      ],
    },
    {
      slug: 'carbon-fiber-pla-aerospace',
      name: 'Carbon Fiber PLA Aerospace',
      badge: '15% Chopped Carbon Fiber',
      tagline: 'Extreme Torsional Rigidity & Zero Layer Lines',
      description: 'Reinforced with 15% micro-milled high-modulus chopped carbon fibers. Eliminates visible layer lines with an ultra-matte charcoal texture while vastly reducing thermal shrinkage.',
      startingPrice: 38.99,
      heatDeflection: '72 °C',
      printSpeed: 'Up to 350 mm/s',
      tensileStrength: '71 MPa',
      nozzleTemp: '215 - 245 °C',
      bedTemp: '55 - 65 °C',
      accent: '#181818',
      idealFor: [
        'Aerospace Drone Arms & Gimbals',
        'High-Stiffness Robotic End-Effectors',
        'Motorsport Intake Ducts & Bezels',
        'Precision Tooling Inspection Jigs',
      ],
    },
    {
      slug: 'tpu-flex-95a',
      name: 'TPU 95A Elastomer',
      badge: '580% Elongation at Break',
      tagline: 'High-Tear Resistance & Vibration Damping',
      description: 'Thermoplastic polyurethane offering Shore 95A hardness. Resists abrasion, ozone, greases, and repetitive cyclic deformation without cracking or permanent strain.',
      startingPrice: 32.99,
      heatDeflection: '85 °C',
      printSpeed: '40 - 120 mm/s',
      tensileStrength: '48 MPa',
      nozzleTemp: '220 - 245 °C',
      bedTemp: '40 - 60 °C',
      accent: '#F97316',
      idealFor: [
        'Vibration Dampers & Motor Mounts',
        'Industrial Protective Gaskets & Seals',
        'RC Car Wheels & Drone Bumpers',
        'Ergonomic Tool Handles & Grips',
      ],
    },
  ];

  const activeMaterial = materials.find((m) => m.slug === selectedMaterialSlug) || materials[0];

  return (
    <section 
      id="materials-applications"
      className="relative overflow-hidden py-24 sm:py-36 bg-[#FAFAFA] text-[#252525] border-b border-[#E5E5E5] select-none"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Header */}
        <div className="mb-14 grid gap-6 border-b border-[#E5E5E5] pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#111111] text-xs font-bold uppercase tracking-[0.2em] border border-[#E5E5E5] shadow-sm">
              <Layers className="w-3.5 h-3.5 text-[#5401C5]" />
              <span>Section 04 • Material Architectures</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase leading-[0.92] tracking-tightest text-[#111111]">
              Five Material Families. <br />
              <span className="text-[#5401C5]">
                One Exacting Standard.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#696969] lg:col-span-4 lg:justify-self-end">
            From rapid aesthetic prototypes to high-modulus structural tooling, each formulation is tailored with specific molecular modifiers for peak performance.
          </p>
        </div>

        {/* Material Selection Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {materials.map((mat) => {
            const isSelected = mat.slug === selectedMaterialSlug;
            return (
              <button
                key={mat.slug}
                onClick={() => setSelectedMaterialSlug(mat.slug)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#111111] text-white shadow-sm scale-105'
                    : 'bg-white text-[#696969] hover:text-[#111111] hover:bg-[#F3F3F3] border border-[#E5E5E5]'
                }`}
              >
                {mat.name.split(' ')[0]} {mat.name.includes('+') ? '+' : ''}
              </button>
            );
          })}
        </div>

        {/* Active Material Deep Dive Spotlight Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E5E5] shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F3F3] text-xs font-mono font-bold uppercase tracking-wider text-[#111111] border border-[#E5E5E5]">
                <span>{activeMaterial.badge}</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111]">
                {activeMaterial.name}
              </h3>

              <p className="text-sm sm:text-base text-[#696969] leading-relaxed">
                {activeMaterial.description}
              </p>

              {/* Real World Applications */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#696969] block">
                  Verified Real-World Engineering Applications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeMaterial.idealFor.map((app) => (
                    <div
                      key={app}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-medium text-[#252525]"
                    >
                      <CircleDot className="w-3.5 h-3.5 shrink-0 text-[#5401C5]" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons — Primary is Black with White Typography */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/product/${activeMaterial.slug}`}
                  className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#252525] shadow-md transition-all active:scale-95"
                >
                  <span>Shop {activeMaterial.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/materials`}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white border border-[#E5E5E5] text-[#111111] font-bold text-xs uppercase tracking-wider hover:bg-[#F3F3F3] transition-all shadow-sm"
                >
                  Datasheet & Profile
                </Link>

                <div className="ml-auto pl-4 hidden sm:block">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#696969] block">Starting at</span>
                  <strong className="text-xl font-mono font-extrabold text-[#111111]">
                    {formatPrice(activeMaterial.startingPrice, currency)} / 1 kg
                  </strong>
                </div>
              </div>
            </div>

            {/* Right Technical Metrology Specs Matrix */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#F3F3F3] border border-[#E5E5E5] space-y-5">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#696969] border-b border-[#E5E5E5] pb-3">
                Thermal & Mechanical Profile
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#696969] block">Heat Deflection</span>
                  <strong className="text-2xl font-extrabold font-mono text-[#111111] mt-0.5 block">
                    {activeMaterial.heatDeflection}
                  </strong>
                  <span className="text-[10px] text-[#696969]">@ 0.45 MPa load</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#696969] block">Rated Speed</span>
                  <strong className="text-2xl font-extrabold font-mono text-emerald-600 mt-0.5 block">
                    {activeMaterial.printSpeed}
                  </strong>
                  <span className="text-[10px] text-[#696969]">CoreXY kinematic</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#696969] block">Tensile Strength</span>
                  <strong className="text-2xl font-extrabold font-mono text-[#111111] mt-0.5 block">
                    {activeMaterial.tensileStrength}
                  </strong>
                  <span className="text-[10px] text-[#696969]">ASTM D638</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#696969] block">Nozzle Window</span>
                  <strong className="text-2xl font-extrabold font-mono text-[#111111] mt-0.5 block">
                    {activeMaterial.nozzleTemp.split(' ')[0]}°
                  </strong>
                  <span className="text-[10px] text-[#696969]">{activeMaterial.nozzleTemp}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <span className="text-[#696969] font-mono">Bed Temperature:</span>
                <span className="font-mono font-bold text-[#111111]">{activeMaterial.bedTemp}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default MaterialShowcase;
