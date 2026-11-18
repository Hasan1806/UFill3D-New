'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import { PRODUCTS } from '@/data/products';
import { 
  Palette, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Eye,
  Sliders,
  RotateCw,
  Gauge
} from 'lucide-react';
import { useSpoolJourneyStore } from '@/lib/spool-journey-store';

interface ExplorerColor {
  id: string;
  name: string;
  hex: string;
  finish: 'Silk' | 'Matte' | 'Gloss' | 'Translucent';
  pantone: string;
  category: 'Signature' | 'Vivid' | 'Neutral' | 'Engineering';
  tagline: string;
  description: string;
  temp: string;
  bedTemp: string;
  cielab: { l: number; a: number; b: number };
  deltaE: string;
  spectralPeak: string;
  svgPath: string;
  svgArea: string;
}

export function ColorExplorer() {
  const allColors: ExplorerColor[] = [
    {
      id: 'electric-periwinkle',
      name: 'Electric Periwinkle',
      hex: '#5401C5',
      finish: 'Silk',
      pantone: 'PANTONE 2685 C (Royal Signature)',
      category: 'Signature',
      tagline: 'Dual-phase optical refraction with specular violet sheen',
      description: 'Our flagship masterbatch. Formulated with pearlescent mica platelets that deflect incident light along a dynamic 420nm spectrum.',
      temp: '205 - 225 °C',
      bedTemp: '55 - 65 °C',
      cielab: { l: 28.4, a: 46.2, b: -78.5 },
      deltaE: '< 0.28',
      spectralPeak: '420 nm',
      svgPath: 'M 10 32 Q 50 20, 90 40 T 170 82 T 250 85 T 330 65 T 390 58',
      svgArea: 'M 10 32 Q 50 20, 90 40 T 170 82 T 250 85 T 330 65 T 390 58 L 390 100 L 10 100 Z',
    },
    {
      id: 'crimson-velocity',
      name: 'Crimson Velocity',
      hex: '#DC2626',
      finish: 'Gloss',
      pantone: 'PANTONE 186 C (Rally Red)',
      category: 'Vivid',
      tagline: 'High-temperature automotive organic dye synthesis',
      description: 'Race-bred saturated scarlet red. Synthesized with heat-stabilized organic chromophores that resist thermal degradation up to 260°C.',
      temp: '210 - 235 °C',
      bedTemp: '60 °C',
      cielab: { l: 44.2, a: 68.1, b: 42.3 },
      deltaE: '< 0.32',
      spectralPeak: '650 nm',
      svgPath: 'M 10 88 Q 90 88, 170 85 T 250 72 T 310 28 T 390 18',
      svgArea: 'M 10 88 Q 90 88, 170 85 T 250 72 T 310 28 T 390 18 L 390 100 L 10 100 Z',
    },
    {
      id: 'cyber-cyan',
      name: 'Cyber Cyan',
      hex: '#06B6D4',
      finish: 'Gloss',
      pantone: 'PANTONE 312 C (High-Saturation)',
      category: 'Vivid',
      tagline: 'High-chroma photonic cyan for prototype telemetry',
      description: 'Electric neon cyan calibrated for high-contrast engineering prototypes, drone canopies, and optical robotics housings.',
      temp: '205 - 225 °C',
      bedTemp: '55 °C',
      cielab: { l: 68.5, a: -32.4, b: -28.1 },
      deltaE: '< 0.30',
      spectralPeak: '490 nm',
      svgPath: 'M 10 82 Q 70 82, 130 35 T 210 20 T 290 68 T 390 85',
      svgArea: 'M 10 82 Q 70 82, 130 35 T 210 20 T 290 68 T 390 85 L 390 100 L 10 100 Z',
    },
    {
      id: 'hyper-lime',
      name: 'Hyper Lime',
      hex: '#84CC16',
      finish: 'Silk',
      pantone: 'PANTONE 382 C (Fluorescent)',
      category: 'Vivid',
      tagline: 'Fluorescent-shifted wavelength for extreme visibility',
      description: 'Photoluminescent green with high specular deflection. Ideal for safety tooling, robotic fixtures, and athletic equipment.',
      temp: '205 - 230 °C',
      bedTemp: '55 °C',
      cielab: { l: 76.1, a: -44.2, b: 68.4 },
      deltaE: '< 0.34',
      spectralPeak: '530 nm',
      svgPath: 'M 10 86 Q 90 85, 170 42 T 230 18 T 300 52 T 390 82',
      svgArea: 'M 10 86 Q 90 85, 170 42 T 230 18 T 300 52 T 390 82 L 390 100 L 10 100 Z',
    },
    {
      id: 'blaze-orange',
      name: 'Blaze Orange',
      hex: '#F97316',
      finish: 'Matte',
      pantone: 'PANTONE 1505 C (Safety Orange)',
      category: 'Vivid',
      tagline: 'Industrial high-contrast safety pigment for factory floors',
      description: 'Non-glare micro-matte surface formulated for factory jigs, CNC hold-downs, and high-vibration drone frames.',
      temp: '210 - 235 °C',
      bedTemp: '60 °C',
      cielab: { l: 62.4, a: 52.1, b: 64.2 },
      deltaE: '< 0.31',
      spectralPeak: '610 nm',
      svgPath: 'M 10 88 Q 110 88, 200 78 T 280 32 T 340 22 T 390 26',
      svgArea: 'M 10 88 Q 110 88, 200 78 T 280 32 T 340 22 T 390 26 L 390 100 L 10 100 Z',
    },
    {
      id: 'forged-carbon-black',
      name: 'Forged Carbon Black',
      hex: '#181818',
      finish: 'Matte',
      pantone: 'PANTONE Black 7 C (Stealth)',
      category: 'Engineering',
      tagline: '96% Light absorption with micro-textured layer concealment',
      description: 'Micro-matte textured resin infused with deep black carbon optics that effortlessly conceal layer lines and suppress specular reflection.',
      temp: '215 - 245 °C',
      bedTemp: '60 - 70 °C',
      cielab: { l: 12.1, a: 0.2, b: -0.4 },
      deltaE: '< 0.22',
      spectralPeak: '550 nm (Flat)',
      svgPath: 'M 10 85 Q 100 84, 200 86 T 300 85 T 390 84',
      svgArea: 'M 10 85 Q 100 84, 200 86 T 300 85 T 390 84 L 390 100 L 10 100 Z',
    },
    {
      id: 'porcelain-white',
      name: 'Porcelain White',
      hex: '#F8F9FA',
      finish: 'Matte',
      pantone: 'PANTONE Bright White (100% Opacity)',
      category: 'Neutral',
      tagline: 'High-purity titanium dioxide mineral masterbatch',
      description: 'Formulated with ultra-fine rutile TiO2 crystals yielding total opacity even at single-perimeter wall thicknesses.',
      temp: '200 - 220 °C',
      bedTemp: '55 °C',
      cielab: { l: 96.8, a: -0.5, b: 1.2 },
      deltaE: '< 0.25',
      spectralPeak: '460 nm (Broad)',
      svgPath: 'M 10 22 Q 100 20, 200 21 T 300 22 T 390 20',
      svgArea: 'M 10 22 Q 100 20, 200 21 T 300 22 T 390 20 L 390 100 L 10 100 Z',
    },
    {
      id: 'soft-lavender',
      name: 'Soft Lavender',
      hex: '#C7C2FA',
      finish: 'Silk',
      pantone: 'PANTONE 2635 C (Pastel Violet)',
      category: 'Signature',
      tagline: 'Refined editorial pastel with shimmering silk lustre',
      description: 'Delicate pastel purple balanced with pearlescent silk sheen. Engineered for sculptural art, architectural presentations, and consumer hardware.',
      temp: '200 - 220 °C',
      bedTemp: '55 °C',
      cielab: { l: 80.2, a: 12.4, b: -24.8 },
      deltaE: '< 0.29',
      spectralPeak: '440 nm',
      svgPath: 'M 10 38 Q 70 30, 140 38 T 240 52 T 320 54 T 390 50',
      svgArea: 'M 10 38 Q 70 30, 140 38 T 240 52 T 320 54 T 390 50 L 390 100 L 10 100 Z',
    },
    {
      id: 'midnight-navy',
      name: 'Midnight Navy',
      hex: '#161E38',
      finish: 'Matte',
      pantone: 'PANTONE 282 C (Deep Space)',
      category: 'Neutral',
      tagline: 'Authoritative deep maritime blue with velvet matte touch',
      description: 'Velvety dark navy with zero surface glare. Designed for aerospace enclosures, executive prototypes, and mission-critical hardware.',
      temp: '205 - 225 °C',
      bedTemp: '55 - 65 °C',
      cielab: { l: 18.5, a: 2.1, b: -18.4 },
      deltaE: '< 0.26',
      spectralPeak: '450 nm',
      svgPath: 'M 10 65 Q 80 50, 150 55 T 230 82 T 310 86 T 390 85',
      svgArea: 'M 10 65 Q 80 50, 150 55 T 230 82 T 310 86 T 390 85 L 390 100 L 10 100 Z',
    },
  ];

  const [selectedColor, setSelectedColor] = useState<ExplorerColor>(allColors[0]);
  const [selectedDiameter, setSelectedDiameter] = useState<'1.75 mm' | '2.85 mm'>('1.75 mm');
  const [selectedWeight, setSelectedWeight] = useState<'1.0 kg' | '3.0 kg'>('1.0 kg');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  const filteredColors = activeCategory === 'All' 
    ? allColors 
    : allColors.filter(c => c.category === activeCategory);

  const handleSelectColor = (color: ExplorerColor) => {
    setSelectedColor(color);
    useSpoolJourneyStore.getState().setColor(color.hex, color.finish, color.hex);
  };

  const handleAddToCart = () => {
    const baseProduct = PRODUCTS[0];
    addItem(
      baseProduct,
      {
        id: selectedColor.id,
        name: selectedColor.name,
        hex: selectedColor.hex,
        inStock: true,
      },
      selectedDiameter,
      selectedWeight,
      1
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2200);
  };

  return (
    <section 
      id="color-studio"
      className="relative overflow-hidden py-24 sm:py-32 bg-[#0C0C10] text-[#FAFAFA] border-b border-white/10 select-none transition-colors duration-700"
    >
      {/* High-Tech Industrial Laboratory Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Dynamic Chromatic Ambient Atmosphere (Backlit by the Active Masterbatch Pigment) */}
      <div 
        className="absolute top-1/4 right-1/4 w-[750px] h-[750px] rounded-full blur-[180px] opacity-25 pointer-events-none transition-all duration-700 will-change-transform"
        style={{ backgroundColor: selectedColor.hex }}
      />
      <div 
        className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: selectedColor.hex }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Editorial Section Header: Darkroom Laboratory Header */}
        <div className="max-w-4xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#EEEAF5] shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5401C5] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5401C5]" />
            </span>
            <span>Section 02 • Masterbatch Polymer Chemistry</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase leading-[0.94] tracking-tightest text-white">
            Chromatic Science. <br />
            <span className="text-[#9D68FF]">
              Molecular Precision.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
            Every masterbatch formulation is synthesized with automotive-grade organic dyes and inorganic mineral pigments. Monitored continuously via dual spectrophotometers for Delta-E &lt; 0.38 to guarantee zero batch-to-batch variation.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {['All', 'Signature', 'Vivid', 'Engineering', 'Neutral'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-white text-[#111111] shadow-lg shadow-white/10 scale-105'
                    : 'bg-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat} {cat === 'All' ? `(${allColors.length})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Dual-Bay Interactive Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT BAY: Masterbatch Capsules & Spectrophotometer HUD (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Tactile Pigment Capsules Grid */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B]/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A1A1AA] flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-[#9D68FF]" />
                  Select Physical Masterbatch Tone:
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  3D SPOOL SYNCED
                </span>
              </div>

              {/* Masterbatch Swatches Capsules */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredColors.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleSelectColor(color)}
                      aria-label={`Select ${color.name}`}
                      className={`group relative flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? 'border-white bg-white/15 shadow-xl ring-2 ring-[#9D68FF]/50 scale-[1.02]'
                          : 'border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07]'
                      }`}
                    >
                      {/* Physical Specular Orb */}
                      <div
                        className="w-10 h-10 rounded-xl relative shrink-0 shadow-md border border-white/20 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      >
                        {/* Realistic 3D Sphere Specular Highlight */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-black/40 via-transparent to-white/40 pointer-events-none" />
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-white truncate">
                          {color.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider">
                            {color.finish}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Live Spectrophotometer Wavelength Metrology Lab Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B]/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-5">
              
              {/* Metrology Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-[#9D68FF]" />
                  <div>
                    <span className="font-mono text-xs uppercase font-extrabold tracking-wider text-white block">
                      Optical Reflectance Spectrogram (380nm – 720nm)
                    </span>
                    <span className="text-[10px] font-mono text-[#A1A1AA]">
                      {selectedColor.pantone}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                  <span>Delta-E {selectedColor.deltaE}</span>
                  <span className="text-emerald-500/60">• PASS</span>
                </div>
              </div>

              {/* Dynamic Interactive SVG Spectrogram Curve */}
              <div className="relative h-32 w-full rounded-2xl bg-black/40 border border-white/10 p-3 flex flex-col justify-between overflow-hidden">
                
                {/* Horizontal reference grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                  <div className="border-b border-dashed border-white w-full" />
                  <div className="border-b border-dashed border-white w-full" />
                  <div className="border-b border-dashed border-white w-full" />
                </div>

                {/* SVG Curve */}
                <svg
                  className="w-full h-full overflow-visible transition-all duration-500"
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={selectedColor.hex} stopOpacity="0.45" />
                      <stop offset="100%" stopColor={selectedColor.hex} stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area under curve */}
                  <path
                    d={selectedColor.svgArea}
                    fill="url(#spectrumGradient)"
                    className="transition-all duration-700 ease-out"
                  />

                  {/* Solid Curve Line */}
                  <path
                    d={selectedColor.svgPath}
                    fill="none"
                    stroke={selectedColor.hex}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                    style={{
                      filter: `drop-shadow(0 0 8px ${selectedColor.hex})`,
                    }}
                  />
                </svg>

                {/* Spectral Axis Labels */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#A1A1AA] pt-1 z-10">
                  <span>380nm (UV)</span>
                  <span>450nm (Violet)</span>
                  <span className="text-white font-bold">Peak: {selectedColor.spectralPeak}</span>
                  <span>580nm (Amber)</span>
                  <span>720nm (Infra)</span>
                </div>
              </div>

              {/* CIE L*a*b* & Polymer Metrology Triad */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA] block">
                    CIE L* (Luminance)
                  </span>
                  <strong className="font-mono text-base sm:text-lg font-extrabold text-white block mt-0.5">
                    {selectedColor.cielab.l.toFixed(1)}%
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA] block">
                    a* (Chroma a)
                  </span>
                  <strong className="font-mono text-base sm:text-lg font-extrabold text-[#9D68FF] block mt-0.5">
                    {selectedColor.cielab.a > 0 ? `+${selectedColor.cielab.a.toFixed(1)}` : selectedColor.cielab.a.toFixed(1)}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA] block">
                    b* (Chroma b)
                  </span>
                  <strong className="font-mono text-base sm:text-lg font-extrabold text-white block mt-0.5">
                    {selectedColor.cielab.b > 0 ? `+${selectedColor.cielab.b.toFixed(1)}` : selectedColor.cielab.b.toFixed(1)}
                  </strong>
                </div>
              </div>

              {/* Thermal Slicing Parameters Readout */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#A1A1AA] block">Nozzle Window</span>
                    <span className="font-mono font-bold text-emerald-400">{selectedColor.temp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#A1A1AA] block">Heated Bed</span>
                    <span className="font-mono font-bold text-white">{selectedColor.bedTemp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-[#A1A1AA] block">Polymer Feedstock</span>
                  <span className="font-mono text-xs font-bold text-[#EEEAF5]">Ingeo™ 4043D Virgin</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT BAY: Dedicated 3D Spool Stage & Direct Checkout Suite (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Holographic 3D Spool Inspection Viewport Target */}
            <div className="relative p-6 sm:p-7 rounded-3xl bg-[#14141B]/95 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col justify-between">
              
              {/* Corner HUD Telemetry Brackets */}
              <div className="flex items-center justify-between font-mono text-[10px] text-[#A1A1AA] z-10">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9D68FF] animate-pulse" />
                  OPTICAL DOCK: ACTIVE
                </span>
                <span>MAG 1.0X • FOV 38°</span>
              </div>

              {/* Central Dedicated Clear Stage for the Travelling 3D Spool */}
              <div className="relative my-4 w-full h-[260px] sm:h-[300px] flex items-center justify-center">
                {/* Holographic Reticle Rings */}
                <div 
                  className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-dashed border-white/15 animate-spin-slow pointer-events-none"
                  style={{ animationDuration: '40s' }}
                />
                <div 
                  className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-white/10 pointer-events-none"
                />

                {/* Ambient Radial Spotlight inside Chamber */}
                <div 
                  className="w-36 h-36 rounded-full blur-[60px] opacity-40 pointer-events-none transition-colors duration-500"
                  style={{ backgroundColor: selectedColor.hex }}
                />

                {/* Guidance text for interaction */}
                <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A1AA]">
                    <RotateCw className="w-3 h-3 text-[#9D68FF]" />
                    3D Journey Model In Viewport
                  </span>
                </div>
              </div>

              {/* Active Pigment Briefing Banner */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white">
                    {selectedColor.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5401C5]/30 border border-[#5401C5]/60 text-[#EEEAF5] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {selectedColor.finish} Sheen
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {selectedColor.tagline}
                </p>
              </div>
            </div>

            {/* Precision Configurator & Direct Cart Addition */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B]/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Extrusion Diameter Selector */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA] block mb-2">
                    Diameter Gauge
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 text-xs font-mono font-bold">
                    {(['1.75 mm', '2.85 mm'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDiameter(d)}
                        className={`py-2 rounded-lg transition-all active:scale-95 ${
                          selectedDiameter === d
                            ? 'bg-white text-black shadow-md font-extrabold'
                            : 'text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spool Net Mass Selector */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA] block mb-2">
                    Spool Net Mass
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 text-xs font-mono font-bold">
                    {(['1.0 kg', '3.0 kg'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`py-2 rounded-lg transition-all active:scale-95 ${
                          selectedWeight === w
                            ? 'bg-white text-black shadow-md font-extrabold'
                            : 'text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#A1A1AA] block">Configured Price</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {formatPrice(selectedWeight === '3.0 kg' ? 69.99 : 24.99, currency)}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-white text-black font-extrabold uppercase tracking-wider text-xs hover:bg-[#EEEAF5] shadow-xl hover:shadow-white/20 transition-all active:scale-95 group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>{addedAnimation ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Direct Link to Full Product Specs */}
              <div className="text-center pt-1">
                <Link
                  href="/colors"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA] hover:text-white transition-colors"
                >
                  <span>Explore full 24-color industrial masterbatch catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ColorExplorer;
