'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { Product, ColorVariant } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import { 
  ShoppingBag, 
  Eye, 
  Star, 
  ArrowRight, 
  Check, 
  Sparkles, 
  X,
  Thermometer
} from 'lucide-react';

export function FeaturedProducts() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickColor, setQuickColor] = useState<ColorVariant | null>(null);
  const [quickDiameter, setQuickDiameter] = useState<string>('1.75 mm');
  const [quickWeight, setQuickWeight] = useState<string>('1.0 kg');

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  const filterOptions = ['All', 'PLA', 'PLA+', 'PETG', 'Carbon Fiber', 'TPU'];

  const filteredProducts = selectedFilter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.material === selectedFilter);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.colors[0], '1.75 mm', '1.0 kg', 1);
  };

  const openQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setQuickColor(product.colors[0]);
    setQuickDiameter(product.availableDiameters[0] || '1.75 mm');
    setQuickWeight(product.availableWeights[0] || '1.0 kg');
  };

  return (
    <section className="py-28 bg-ufill-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-3">
              <span>Section 06 • Catalog Spotlight</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
              Flagship Spool Collection.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === filter
                    ? 'bg-ufill-primary text-white shadow-elevation-1'
                    : 'bg-white text-ufill-textMuted hover:text-ufill-primary border border-ufill-border'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-ufill-border overflow-hidden hover:border-ufill-secondary/40 hover:shadow-elevation-3 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Visual Top */}
              <div className="relative aspect-[4/3] bg-gradient-to-b from-[#F2F4FB] to-white p-6 flex items-center justify-center overflow-hidden">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-ufill-primary/90 text-white text-[11px] font-mono tracking-wider backdrop-blur-md">
                    {product.badge}
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-ufill-border text-xs font-bold text-ufill-primary shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-ufill-textDim text-[10px]">({product.reviewCount})</span>
                </div>

                {/* Image with zoom effect */}
                <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Hover Quick View Overlay Action */}
                <div className="absolute inset-0 bg-ufill-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => openQuickView(product, e)}
                    className="p-3 rounded-xl bg-white text-ufill-primary hover:bg-ufill-secondary hover:text-white shadow-elevation-2 transition-all transform translate-y-3 group-hover:translate-y-0"
                    title="Quick Specs View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="p-3 rounded-xl bg-ufill-secondary text-white hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all transform translate-y-3 group-hover:translate-y-0"
                    title="Quick Add 1kg Spool"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info Bottom */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-ufill-textDim mb-1">
                    <span className="font-semibold text-ufill-secondary uppercase tracking-wider">
                      {product.material} • {product.finish}
                    </span>
                    <span className="font-mono text-ufill-textMuted">{product.specs.tolerance}</span>
                  </div>

                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-xl font-bold text-ufill-primary hover:text-ufill-secondary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-ufill-textMuted mt-1 line-clamp-2 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 mt-4">
                    {product.colors.slice(0, 6).map((c) => (
                      <span
                        key={c.id}
                        title={c.name}
                        className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {product.colors.length > 6 && (
                      <span className="text-[10px] font-bold text-ufill-textDim pl-1">
                        +{product.colors.length - 6}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-4 border-t border-ufill-border flex items-center justify-between">
                  <div>
                    <div className="text-xs text-ufill-textDim font-medium">Starting at</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-ufill-primary font-mono">
                        {formatPrice(product.price, currency)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-ufill-textDim line-through font-mono">
                          {formatPrice(product.originalPrice, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ufill-tertiary text-ufill-secondary font-semibold text-xs hover:bg-ufill-secondary hover:text-white transition-all shadow-sm"
                  >
                    <span>Configure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTAs */}
        <div className="text-center mt-16">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-ufill-primary text-white font-semibold text-sm hover:bg-ufill-secondary transition-all shadow-elevation-2 active:scale-95"
          >
            <span>View Complete Store Catalog ({PRODUCTS.length} Series)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ufill-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-elevation-3 overflow-hidden border border-ufill-border p-6 sm:p-8 animate-fade-in">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-ufill-textMuted hover:text-ufill-primary hover:bg-ufill-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-ufill-background border border-ufill-border">
                <Image
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono font-bold text-ufill-secondary uppercase">
                    {quickViewProduct.material}
                  </span>
                  <h3 className="text-2xl font-bold text-ufill-primary">
                    {quickViewProduct.name}
                  </h3>
                  <div className="text-xl font-bold text-ufill-primary font-mono mt-1">
                    {formatPrice(quickViewProduct.price, currency)}
                  </div>
                </div>

                {/* Color picker */}
                <div>
                  <span className="text-xs font-semibold text-ufill-primary block mb-2">
                    Colour: <strong className="text-ufill-secondary">{quickColor?.name}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setQuickColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          quickColor?.id === c.id ? 'border-ufill-secondary scale-110 shadow-sm' : 'border-black/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Specs snapshot */}
                <div className="p-3 bg-ufill-background rounded-xl text-xs space-y-1 text-ufill-textMuted border border-ufill-border">
                  <div className="flex justify-between">
                    <span>Nozzle Temp:</span>
                    <strong className="text-ufill-primary">{quickViewProduct.specs.nozzleTemp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bed Temp:</span>
                    <strong className="text-ufill-primary">{quickViewProduct.specs.bedTemp}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tolerance:</span>
                    <strong className="text-ufill-secondary font-mono">{quickViewProduct.specs.tolerance}</strong>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      if (quickColor) {
                        addItem(quickViewProduct, quickColor, quickDiameter, quickWeight, 1);
                        setQuickViewProduct(null);
                      }
                    }}
                    className="flex-1 py-3 bg-ufill-secondary text-white font-semibold text-xs rounded-xl hover:bg-ufill-secondaryHover shadow-elevation-1 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <Link
                    href={`/product/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="px-4 py-3 bg-ufill-background text-ufill-primary font-semibold text-xs rounded-xl hover:bg-ufill-tertiary transition-all border border-ufill-border"
                  >
                    Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
