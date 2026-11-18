'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
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
  Zap
} from 'lucide-react';
import { SpoolCanvasHandle } from '@/components/3d/FilamentSpoolCanvas';

const FilamentSpoolCanvas = dynamic(
  () => import('@/components/3d/FilamentSpoolCanvas').then((mod) => mod.FilamentSpoolCanvas),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-white/5" /> }
);

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
      hex: '#6258F5',
      finish: 'Silk',
      pantone: 'PANTONE 2685 C (Signature)',
      category: 'Signature',
      description: 'Our flagship tone. A vibrant, iridescent periwinkle designed to catch dynamic specular highlights.',
      temp: '205 - 225 °C',
      accentBg: '#1C1754',
    },
    {
      name: 'Crimson Velocity',
      hex: '#DC2626',
      finish: 'Gloss',
      pantone: 'PANTONE 186 C (Rally Red)',
      category: 'Vivid',
      description: 'Race-bred saturated red formulated with heat-stable automotive organic dyes. Zero thermal fading.',
      temp: '210 - 235 °C',
      accentBg: '#450A0E',
    },
    {
      name: 'Cyber Cyan',
      hex: '#06B6D4',
      finish: 'Gloss',
      pantone: 'PANTONE 312 C (High-Saturation)',
      category: 'Vivid',
      description: 'Electric neon cyan tuned for high-contrast prototypes, drone canopies, and tech enclosures.',
      temp: '205 - 225 °C',
      accentBg: '#082D3D',
    },
    {
      name: 'Hyper Lime',
      hex: '#84CC16',
      finish: 'Silk',
      pantone: 'PANTONE 382 C (Fluorescent)',
      category: 'Vivid',
      description: 'High-visibility safety and recreational filament with pearlescent light deflection.',
      temp: '205 - 230 °C',
      accentBg: '#1B2C08',
    },
    {
      name: 'Blaze Orange',
      hex: '#F97316',
      finish: 'Matte',
      pantone: 'PANTONE 1505 C (Safety Orange)',
      category: 'Vivid',
      description: 'Industrial safety orange formulated for factory tooling, jigs, and high-vibration drone frames.',
      temp: '210 - 235 °C',
      accentBg: '#441605',
    },
    {
      name: 'Forged Carbon Black',
      hex: '#18191D',
      finish: 'Matte',
      pantone: 'PANTONE Black 7 C (Stealth)',
      category: 'Engineering',
      description: 'Textured micro-matte surface infused with carbon optics that effortlessly conceals layer lines.',
      temp: '215 - 245 °C',
      accentBg: '#0E1017',
    },
    {
      name: 'Porcelain White',
      hex: '#F8F9FC',
      finish: 'Matte',
      pantone: 'PANTONE Bright White (100% Opacity)',
      category: 'Neutral',
      description: 'Pure titanium-dioxide white pigment with 100% opacity for flawless architectural models.',
      temp: '200 - 220 °C',
      accentBg: '#151D2D',
    },
    {
      name: 'Soft Lavender',
      hex: '#C7C2FA',
      finish: 'Silk',
      pantone: 'PANTONE 2635 C (Pastel)',
      category: 'Signature',
      description: 'Delicate pastel purple with a silky sheen. Ideal for organic vases and interior aesthetics.',
      temp: '200 - 220 °C',
      accentBg: '#231B4D',
    },
    {
      name: 'Midnight Navy',
      hex: '#11152E',
      finish: 'Matte',
      pantone: 'PANTONE 282 C (Deep Space)',
      category: 'Neutral',
      description: 'Deep, authoritatively dark navy with a velvety matte surface that absorbs ambient reflections.',
      temp: '205 - 225 °C',
      accentBg: '#0A0E22',
    },
  ];

  const [selectedColor, setSelectedColor] = useState<ExplorerColor>(allColors[0]);
  const [selectedDiameter, setSelectedDiameter] = useState<'1.75 mm' | '2.85 mm'>('1.75 mm');
  const [selectedWeight, setSelectedWeight] = useState<'1.0 kg' | '3.0 kg'>('1.0 kg');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const spoolRef = useRef<SpoolCanvasHandle>(null);

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  const filteredColors = activeCategory === 'All' 
    ? allColors 
    : allColors.filter(c => c.category === activeCategory);

  const handleSelectColor = (color: ExplorerColor) => {
    setSelectedColor(color);
    spoolRef.current?.triggerColorSwitch(color.hex, color.finish, color.hex);
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
      className="relative overflow-hidden py-24 sm:py-32 transition-colors duration-700 ease-in-out border-b border-white/10"
      style={{ backgroundColor: selectedColor.accentBg }}
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full blur-[160px] opacity-35 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: selectedColor.hex }}
      />

      {/* Atmospheric Luminous Light Bridge from Hero Transition */}
      <div 
        className="absolute inset-x-0 top-0 h-44 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(248, 249, 252, 0.12), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Section Heading */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.2em] border border-white/20">
            <Palette className="w-3.5 h-3.5 text-white" />
            <span>Section 02 • Masterbatch Color Science</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase leading-[0.92] tracking-tightest text-white">
            A Spectrum of <br />
            <span style={{ color: selectedColor.hex === '#18191D' || selectedColor.hex === '#11152E' ? '#94A3B8' : selectedColor.hex }}>
              Industrial Precision.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed">
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
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Spool Studio & Control Suite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive 3D Spool Viewport */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-square max-w-[560px] mx-auto rounded-3xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              
              {/* Header Badges on 3D Canvas */}
              <div className="flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-white">
                  <span
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-bold">{selectedColor.name}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/70 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <Rotate3d className="w-3.5 h-3.5 text-white" />
                  <span>360° Drag & Inspect</span>
                </div>
              </div>

              {/* 3D Spool Canvas */}
              <div className="w-full h-full my-auto">
                <FilamentSpoolCanvas
                  ref={spoolRef}
                  color={selectedColor.hex}
                  finish={selectedColor.finish}
                  rimColor={selectedColor.hex}
                  interactive={true}
                  scale={1.3}
                  rotationX={0.24}
                  rotationY={-0.5}
                  autoRotateSpeed={0.003}
                />
              </div>

              {/* Footer info inside canvas box */}
              <div className="flex items-center justify-between pt-4 border-t border-white/15 z-20 text-xs">
                <div className="flex items-center gap-5">
                  <div>
                    <span className="text-white/60 block text-[10px] uppercase font-mono tracking-wider">Finish</span>
                    <span className="font-bold text-white">{selectedColor.finish} Sheen</span>
                  </div>
                  <div>
                    <span className="text-white/60 block text-[10px] uppercase font-mono tracking-wider">Pantone Standard</span>
                    <span className="font-mono font-bold text-white">{selectedColor.pantone.split('(')[0]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white/60 block text-[10px] uppercase font-mono tracking-wider">Nozzle Window</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {selectedColor.temp}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Palette Swatches & Order Selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Color Swatches Grid */}
            <div className="p-6 sm:p-7 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl space-y-5">
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                  Available Formulations
                </h3>
                <p className="text-xs text-white/70 mt-1">
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
                          ? 'border-white bg-white/20 shadow-lg scale-105'
                          : 'border-white/10 hover:border-white/30 bg-white/5'
                      }`}
                    >
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl relative shadow-md border border-white/30 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-white mt-1.5 text-center line-clamp-1">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Formulation Description */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 leading-relaxed">
                <strong className="text-white">{selectedColor.name}: </strong>
                {selectedColor.description}
              </div>
            </div>

            {/* Diameter, Weight & Direct Checkout Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1.5">
                    Extrusion Gauge
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/10 rounded-xl border border-white/15 text-xs font-bold">
                    {(['1.75 mm', '2.85 mm'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDiameter(d)}
                        className={`py-2 rounded-lg transition-all ${
                          selectedDiameter === d
                            ? 'bg-white text-black shadow-sm'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1.5">
                    Spool Net Mass
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/10 rounded-xl border border-white/15 text-xs font-bold">
                    {(['1.0 kg', '3.0 kg'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`py-2 rounded-lg transition-all ${
                          selectedWeight === w
                            ? 'bg-white text-black shadow-sm'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono text-white/60 block">Price</span>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {formatPrice(selectedWeight === '3.0 kg' ? 69.99 : 24.99, currency)}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white text-black font-extrabold uppercase tracking-wider text-xs hover:bg-white/90 shadow-xl transition-all active:scale-95 group"
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
