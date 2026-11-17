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
  Layers,
  Thermometer,
  ShieldCheck
} from 'lucide-react';

export function FeaturedProducts() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickColor, setQuickColor] = useState<ColorVariant | null>(null);
  const [quickDiameter, setQuickDiameter] = useState<string>('1.75 mm');
  const [quickWeight, setQuickWeight] = useState<string>('1.0 kg');
  const [notification, setNotification] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  const filterOptions = ['All', 'PLA', 'PLA+', 'PETG', 'Carbon Fiber', 'TPU'];

  const filteredProducts = selectedFilter === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.material === selectedFilter);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors[0];
    addItem(product, defaultColor, '1.75 mm', '1.0 kg', 1);
    setNotification(`Added ${product.name} (${defaultColor.name}) to cart!`);
    setTimeout(() => setNotification(null), 2500);
  };

  const openQuickView = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setQuickColor(product.colors[0]);
    setQuickDiameter(product.availableDiameters[0] || '1.75 mm');
    setQuickWeight(product.availableWeights[0] || '1.0 kg');
  };

  const handleModalAddToCart = () => {
    if (!quickViewProduct || !quickColor) return;
    addItem(quickViewProduct, quickColor, quickDiameter, quickWeight, 1);
    setQuickViewProduct(null);
  };

  return (
    <section 
      id="product-collection"
      className="py-24 sm:py-36 bg-[#0E1224] text-white relative overflow-hidden border-b border-white/10 select-none"
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white text-black font-bold text-xs shadow-2xl animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] border border-white/15">
              <span>Section 05 • Flagship Spool Catalog</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold uppercase leading-[0.92] tracking-tightest text-white">
              The Production Line.
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Every spool is vacuum-sealed with high-absorption molecular desiccant inside a moisture-barrier bag.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedFilter === filter
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/10'
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
              className="group bg-black/40 backdrop-blur-xl rounded-3xl border border-white/15 overflow-hidden hover:border-white/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Visual Top */}
              <div className="relative aspect-[4/3] bg-gradient-to-b from-white/10 to-black/30 p-6 flex items-center justify-center overflow-hidden">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
                    {product.badge}
                  </div>
                )}

                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-amber-400 font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{product.rating}</span>
                </div>

                {/* Spool Image */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-500 group-hover:scale-110">
                  <Image
                    src={product.images[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Quick Add Overlay on Hover */}
                <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="flex-1 py-3 px-4 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add • {formatPrice(product.price, currency)}</span>
                  </button>
                  <button
                    onClick={(e) => openQuickView(product, e)}
                    aria-label="Quick View Product"
                    className="p-3 bg-white/20 backdrop-blur-md text-white rounded-xl border border-white/20 hover:bg-white/30 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info Bottom */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/60 font-mono mb-1">
                    <span>{product.material}</span>
                    <span>{product.specs.tolerance}</span>
                  </div>

                  <Link href={`/product/${product.slug}`} className="group-hover:text-emerald-400 transition-colors">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-white/70 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Available Color Dots */}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.colors.slice(0, 6).map((color) => (
                      <span
                        key={color.id}
                        title={color.name}
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                    {product.colors.length > 6 && (
                      <span className="text-[10px] font-mono text-white/60 ml-1">
                        +{product.colors.length - 6} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Details */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold font-mono text-white">
                      {formatPrice(product.price, currency)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-xs line-through text-white/40 font-mono">
                        {formatPrice(product.originalPrice, currency)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && quickColor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#11152E] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                <Image
                  src={quickViewProduct.images[0] || ''}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                  {quickViewProduct.material} • {quickViewProduct.specs.tolerance}
                </span>

                <h3 className="text-2xl font-extrabold uppercase text-white">
                  {quickViewProduct.name}
                </h3>

                <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Color Choice */}
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block mb-2">
                    Select Color: <strong className="text-white">{quickColor.name}</strong>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setQuickColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          quickColor.id === c.id ? 'border-white scale-110 shadow-lg' : 'border-white/30 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Price & Add */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-2xl font-mono font-extrabold text-white">
                    {formatPrice(quickViewProduct.price, currency)}
                  </span>

                  <button
                    onClick={handleModalAddToCart}
                    className="px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-white/90 shadow-xl"
                  >
                    Add to Cart
                  </button>
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
