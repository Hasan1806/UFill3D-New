'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FilamentSpoolCanvas } from '@/components/3d/FilamentSpoolCanvas';
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
  Layers
} from 'lucide-react';

interface ExplorerColor {
  name: string;
  hex: string;
  finish: 'Silk' | 'Matte' | 'Gloss';
  pantone?: string;
  category: 'Signature' | 'Neutral' | 'Vivid' | 'Specialty';
  description: string;
}

export function ColorExplorer() {
  const allColors: ExplorerColor[] = [
    {
      name: 'Electric Periwinkle',
      hex: '#6258F5',
      finish: 'Silk',
      pantone: 'UFill Brand Signature',
      category: 'Signature',
      description: 'Our flagship tone. A vibrant, iridescent periwinkle designed to catch dynamic specular highlights.',
    },
    {
      name: 'Midnight Navy',
      hex: '#11152E',
      finish: 'Matte',
      pantone: 'Deep Space Navy',
      category: 'Signature',
      description: 'Deep, authoritatively dark navy with a velvety matte surface that absorbs ambient reflections.',
    },
    {
      name: 'Cyber Cyan',
      hex: '#06B6D4',
      finish: 'Gloss',
      pantone: 'High-Saturation Cyan',
      category: 'Vivid',
      description: 'Electric neon cyan tuned for high-contrast prototypes, drone canopies, and tech enclosures.',
    },
    {
      name: 'Porcelain White',
      hex: '#F8F9FC',
      finish: 'Matte',
      pantone: 'High-Opacity Architectural',
      category: 'Neutral',
      description: 'Pure titanium-dioxide white pigment with 100% opacity for flawless architectural models.',
    },
    {
      name: 'Forged Carbon Black',
      hex: '#18191D',
      finish: 'Matte',
      pantone: 'Stealth Anthracite',
      category: 'Neutral',
      description: 'Textured micro-matte surface infused with carbon fiber optics that effortlessly conceals layer lines.',
    },
    {
      name: 'Crimson Velocity',
      hex: '#DC2626',
      finish: 'Gloss',
      pantone: 'Rally Red',
      category: 'Vivid',
      description: 'Passionate race-bred red formulated with heat-stable automotive organic dyes.',
    },
    {
      name: 'Hyper Lime',
      hex: '#84CC16',
      finish: 'Silk',
      pantone: 'Fluorescent Green',
      category: 'Vivid',
      description: 'High-visibility safety and recreational filament with pearlescent light deflection.',
    },
    {
      name: 'Soft Lavender',
      hex: '#C7C2FA',
      finish: 'Silk',
      pantone: 'Pastel Lavender',
      category: 'Signature',
      description: 'Delicate pastel purple with a silky sheen. Ideal for organic vases and interior aesthetics.',
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

  const handleAddToCart = () => {
    const baseProduct = PRODUCTS[0]; // PLA Ultra Precision
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
    <section className="py-28 bg-ufill-background relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div 
        className="absolute top-1/2 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: selectedColor.hex }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-ufill-secondary text-xs font-bold uppercase tracking-wider border border-ufill-border shadow-sm">
            <Palette className="w-3.5 h-3.5" />
            <span>Interactive Colour Studio</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
            Explore 60+ Custom Formulated <br className="hidden sm:inline" />
            Vibrant Pigments.
          </h2>
          <p className="text-base text-ufill-textMuted leading-relaxed">
            Every masterbatch color is synthesized with high-purity organic and inorganic mineral pigments that resist thermal degradation and UV fading.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {['All', 'Signature', 'Vivid', 'Neutral'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-ufill-primary text-white shadow-sm'
                    : 'bg-white text-ufill-textMuted hover:text-ufill-primary border border-ufill-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Viewport: 3D Live Spool + Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 3D Live Spool Viewport */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-square max-w-[580px] mx-auto rounded-3xl bg-white border border-ufill-border shadow-elevation-2 p-6 flex flex-col justify-between overflow-hidden">
              {/* Header Badges on 3D Canvas */}
              <div className="flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ufill-background border border-ufill-border text-xs font-mono">
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-bold text-ufill-primary">{selectedColor.name}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-ufill-textDim bg-ufill-background px-3 py-1.5 rounded-full border border-ufill-border">
                  <Rotate3d className="w-3.5 h-3.5 text-ufill-secondary" />
                  <span>360° Drag & Inspect</span>
                </div>
              </div>

              {/* 3D Spool Canvas (Reactive to selected color) */}
              <div className="w-full h-full my-auto">
                <FilamentSpoolCanvas
                  color={selectedColor.hex}
                  finish={selectedColor.finish}
                  interactive={true}
                  scale={1.25}
                  rotationX={0.25}
                  rotationY={-0.6}
                  autoRotateSpeed={0.002}
                />
              </div>

              {/* Footer info inside canvas box */}
              <div className="flex items-center justify-between pt-4 border-t border-ufill-border/60 z-20 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-ufill-textDim block text-[10px] uppercase">Finish</span>
                    <span className="font-bold text-ufill-primary">{selectedColor.finish} Sheen</span>
                  </div>
                  <div>
                    <span className="text-ufill-textDim block text-[10px] uppercase">Hex Code</span>
                    <span className="font-mono font-bold text-ufill-secondary">{selectedColor.hex}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-ufill-textDim block text-[10px] uppercase">Status</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock & Ready to Ship
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Color Palette & Direct Order Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Color Swatches Grid */}
            <div className="p-6 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-ufill-primary">Select Palette Variant</h3>
                <p className="text-xs text-ufill-textMuted mt-1">
                  Click any swatch to load into the 3D studio viewport
                </p>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                {filteredColors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color.name}`}
                      className={`group relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-ufill-secondary bg-ufill-tertiary/20 shadow-md scale-105'
                          : 'border-transparent hover:border-ufill-border bg-ufill-background'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl relative shadow-inner border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5 text-ufill-primary stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-ufill-primary mt-2 text-center line-clamp-1">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Color Description Note */}
              <div className="p-3.5 rounded-xl bg-ufill-background border border-ufill-border/60 text-xs text-ufill-textMuted leading-relaxed">
                <strong className="text-ufill-primary">{selectedColor.name}: </strong>
                {selectedColor.description}
              </div>
            </div>

            {/* Direct Configuration Box */}
            <div className="p-6 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 space-y-5">
              {/* Diameter & Spool Size Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ufill-textDim block mb-1.5">
                    Diameter
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-ufill-background rounded-xl border border-ufill-border text-xs font-semibold">
                    {(['1.75 mm', '2.85 mm'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDiameter(d)}
                        className={`py-1.5 rounded-lg transition-all ${
                          selectedDiameter === d
                            ? 'bg-ufill-primary text-white shadow-sm'
                            : 'text-ufill-textMuted hover:text-ufill-primary'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ufill-textDim block mb-1.5">
                    Weight
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-ufill-background rounded-xl border border-ufill-border text-xs font-semibold">
                    {(['1.0 kg', '3.0 kg'] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => setSelectedWeight(w)}
                        className={`py-1.5 rounded-lg transition-all ${
                          selectedWeight === w
                            ? 'bg-ufill-primary text-white shadow-sm'
                            : 'text-ufill-textMuted hover:text-ufill-primary'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart Button */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-ufill-textDim block">Current Price</span>
                  <div className="text-2xl font-bold text-ufill-primary font-mono">
                    {formatPrice(selectedWeight === '3.0 kg' ? 69.99 : 24.99, currency)}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-ufill-secondary text-white font-semibold hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all active:scale-95 group"
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
