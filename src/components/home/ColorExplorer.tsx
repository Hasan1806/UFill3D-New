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
  Rotate3d, 
  ArrowRight, 
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { useSpoolJourneyStore } from '@/lib/spool-journey-store';

interface ExplorerColor {
  name: string;
  hex: string;
  finish: 'Silk' | 'Matte' | 'Gloss';
  pantone: string;
  category: 'Signature' | 'Vivid' | 'Neutral' | 'Engineering';
  description: string;
  temp: string;
  accentBg: string;
}

export function ColorExplorer() {
  const allColors: ExplorerColor[] = [
    {
      name: 'Electric Periwinkle',
      hex: '#5401C5',
      finish: 'Silk',
      pantone: 'PANTONE 2685 C (Signature)',
      category: 'Signature',
      description: 'Our flagship tone. A vibrant, iridescent royal violet-periwinkle designed to catch dynamic specular highlights.',
      temp: '205 - 225 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Crimson Velocity',
      hex: '#DC2626',
      finish: 'Gloss',
      pantone: 'PANTONE 186 C (Rally Red)',
      category: 'Vivid',
      description: 'Race-bred saturated red formulated with heat-stable automotive organic dyes. Zero thermal fading.',
      temp: '210 - 235 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Cyber Cyan',
      hex: '#06B6D4',
      finish: 'Gloss',
      pantone: 'PANTONE 312 C (High-Saturation)',
      category: 'Vivid',
      description: 'Electric neon cyan tuned for high-contrast prototypes, drone canopies, and tech enclosures.',
      temp: '205 - 225 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Hyper Lime',
      hex: '#84CC16',
      finish: 'Silk',
      pantone: 'PANTONE 382 C (Fluorescent)',
      category: 'Vivid',
      description: 'High-visibility safety and recreational filament with pearlescent light deflection.',
      temp: '205 - 230 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Blaze Orange',
      hex: '#F97316',
      finish: 'Matte',
      pantone: 'PANTONE 1505 C (Safety Orange)',
      category: 'Vivid',
      description: 'Industrial safety orange formulated for factory tooling, jigs, and high-vibration drone frames.',
      temp: '210 - 235 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Forged Carbon Black',
      hex: '#181818',
      finish: 'Matte',
      pantone: 'PANTONE Black 7 C (Stealth)',
      category: 'Engineering',
      description: 'Textured micro-matte surface infused with carbon optics that effortlessly conceals layer lines.',
      temp: '215 - 245 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Porcelain White',
      hex: '#F3F3F3',
      finish: 'Matte',
      pantone: 'PANTONE Bright White (100% Opacity)',
      category: 'Neutral',
      description: 'Pure titanium-dioxide white pigment with 100% opacity for flawless architectural models.',
      temp: '200 - 220 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Soft Lavender',
      hex: '#C7C2FA',
      finish: 'Silk',
      pantone: 'PANTONE 2635 C (Pastel)',
      category: 'Signature',
      description: 'Delicate pastel purple with a silky sheen. Ideal for organic vases and interior aesthetics.',
      temp: '200 - 220 °C',
      accentBg: '#FAFAFA',
    },
    {
      name: 'Midnight Navy',
      hex: '#11152E',
      finish: 'Matte',
      pantone: 'PANTONE 282 C (Deep Space)',
      category: 'Neutral',
      description: 'Deep, authoritatively dark navy with a velvety matte surface that absorbs ambient reflections.',
      temp: '205 - 225 °C',
      accentBg: '#FAFAFA',
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
        id: selectedColor.name.toLowerCase().replace(/\s+/g, '-'),
        name: selectedColor.name,
        hex: selectedColor.hex,
        inStock: true,
      },
      selectedDiameter,
      selectedWeight,
      1
    );

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <section 
      id="color-studio"
      className="relative overflow-hidden py-24 sm:py-32 bg-[#FAFAFA] text-[#252525] border-b border-[#E5E5E5]"
    >
      {/* Studio Ambient Illumination */}
      <div 
        className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full blur-[180px] opacity-15 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: selectedColor.hex }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Section Heading */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#111111] text-xs font-bold uppercase tracking-[0.2em] border border-[#E5E5E5] shadow-sm">
            <Palette className="w-3.5 h-3.5 text-[#5401C5]" />
            <span>Section 02 • Masterbatch Color Science</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase leading-[0.92] tracking-tightest text-[#111111]">
            A Spectrum of <br />
            <span className="text-[#5401C5]">
              Industrial Precision.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#696969] max-w-2xl leading-relaxed">
            Every masterbatch formulation is synthesized with automotive-grade organic dyes and inorganic mineral pigments. Monitored for Delta-E &lt; 0.5 to ensure zero color deviation between production lots.
          </p>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            {['All', 'Signature', 'Vivid', 'Neutral', 'Engineering'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white shadow-sm scale-105'
                    : 'bg-white text-[#696969] hover:text-[#111111] hover:bg-[#F3F3F3] border border-[#E5E5E5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Spool Studio & Control Suite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Polymer Spectrophotometer & Colorimetry Metrology Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-square max-w-[560px] mx-auto rounded-3xl bg-white border border-[#E5E5E5] shadow-xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              
              {/* Header Badges */}
              <div className="flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-mono text-[#111111]">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 transition-colors duration-300 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-bold">{selectedColor.name}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#696969] bg-[#F3F3F3] px-3 py-1.5 rounded-full border border-[#E5E5E5]">
                  <Activity className="w-3.5 h-3.5 text-[#5401C5] animate-pulse" />
                  <span>3D Spool Synchronized</span>
                </div>
              </div>

              {/* Central Spectrophotometer Reflectance Curve & Colorimetry Visualizer */}
              <div className="w-full my-auto py-6 flex flex-col items-center justify-center text-center">
                {/* Visualizer Orb & Glow */}
                <div 
                  className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-4 border-white"
                  style={{ backgroundColor: selectedColor.hex }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 via-transparent to-white/40 pointer-events-none" />
                  <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col items-center justify-center">
                    <span className="text-[9px] font-mono text-[#696969] uppercase font-bold tracking-tight">Delta-E</span>
                    <span className="text-xs font-mono font-extrabold text-[#111111]">&lt;0.38</span>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEEAF5] text-[#5401C5] text-[11px] font-mono font-bold uppercase tracking-wider">
                    Spectrophotometer Verified • Automotive Organic Grade
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                    {selectedColor.name} Masterbatch
                  </h3>
                  <p className="text-xs text-[#696969] max-w-sm mx-auto">
                    {selectedColor.description}
                  </p>
                </div>
              </div>

              {/* Footer info inside metrology card */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5] z-20 text-xs">
                <div className="flex items-center gap-5">
                  <div>
                    <span className="text-[#696969] block text-[10px] uppercase font-mono tracking-wider">Finish</span>
                    <span className="font-bold text-[#111111]">{selectedColor.finish} Sheen</span>
                  </div>
                  <div>
                    <span className="text-[#696969] block text-[10px] uppercase font-mono tracking-wider">Pantone Standard</span>
                    <span className="font-mono font-bold text-[#111111]">{selectedColor.pantone.split('(')[0]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#696969] block text-[10px] uppercase font-mono tracking-wider">Nozzle Window</span>
                  <span className="text-emerald-600 font-bold font-mono">
                    {selectedColor.temp}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Palette Swatches & Order Selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Color Swatches Grid */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xl space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#111111]">
                  Available Formulations
                </h3>
                <p className="text-xs text-[#696969] mt-1">
                  Click any swatch to load into the 3D inspection viewport
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {filteredColors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => handleSelectColor(color)}
                      aria-label={`Select ${color.name}`}
                      className={`group relative flex flex-col items-center p-2 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-[#111111] bg-[#F3F3F3] shadow-md scale-105'
                          : 'border-[#E5E5E5] hover:border-[#111111]/30 bg-white'
                      }`}
                    >
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl relative shadow-sm border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#111111] mt-1.5 text-center line-clamp-1">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Formulation Description */}
              <div className="p-3.5 rounded-2xl bg-[#F3F3F3] border border-[#E5E5E5] text-xs text-[#252525] leading-relaxed">
                <strong className="text-[#111111]">{selectedColor.name}: </strong>
                {selectedColor.description}
              </div>
            </div>

            {/* Diameter, Weight & Direct Checkout Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E5E5E5] shadow-xl space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#696969] block mb-1.5">
                    Extrusion Gauge
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F3F3F3] rounded-xl border border-[#E5E5E5] text-xs font-bold">
                    {(['1.75 mm', '2.85 mm'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDiameter(d)}
                        className={`py-2 rounded-lg transition-all ${
                          selectedDiameter === d
                            ? 'bg-[#111111] text-white shadow-sm'
                            : 'text-[#696969] hover:text-[#111111]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#696969] block mb-1.5">
                    Spool Net Mass
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F3F3F3] rounded-xl border border-[#E5E5E5] text-xs font-bold">
                    {(['1.0 kg', '3.0 kg'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`py-2 rounded-lg transition-all ${
                          selectedWeight === w
                            ? 'bg-[#111111] text-white shadow-sm'
                            : 'text-[#696969] hover:text-[#111111]'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart — Black Button with White Typography */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#696969] block">Price</span>
                  <div className="text-2xl font-extrabold text-[#111111] font-mono">
                    {formatPrice(selectedWeight === '3.0 kg' ? 69.99 : 24.99, currency)}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#111111] text-white font-extrabold uppercase tracking-wider text-xs hover:bg-[#252525] shadow-md transition-all active:scale-95 group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>{addedAnimation ? 'Added to Cart!' : 'Add Spool to Cart'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default ColorExplorer;
