'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import { 
  Search, 
  Filter, 
  Star, 
  ArrowRight, 
  ShoppingBag, 
  SlidersHorizontal,
  RotateCcw,
  Check
} from 'lucide-react';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedFinish, setSelectedFinish] = useState<string>('All');
  const [selectedDiameter, setSelectedDiameter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  const materialsList = ['All', 'PLA', 'PLA+', 'PETG', 'Carbon Fiber', 'TPU'];
  const finishesList = ['All', 'Matte', 'Silk', 'Gloss', 'High-Speed'];
  const diametersList = ['All', '1.75 mm', '2.85 mm'];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.toLowerCase().includes(searchQuery.toLowerCase());

      // Material
      const matchesMaterial =
        selectedMaterial === 'All' || product.material === selectedMaterial;

      // Finish
      const matchesFinish =
        selectedFinish === 'All' || product.finish === selectedFinish;

      // Diameter
      const matchesDiameter =
        selectedDiameter === 'All' ||
        product.availableDiameters.includes(selectedDiameter as any);

      return matchesSearch && matchesMaterial && matchesFinish && matchesDiameter;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [searchQuery, selectedMaterial, selectedFinish, selectedDiameter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMaterial('All');
    setSelectedFinish('All');
    setSelectedDiameter('All');
    setSortBy('featured');
  };

  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page Header */}
        <div className="py-8 border-b border-ufill-border mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-3">
            <span>UFill3D Store Catalog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
            High-Performance Filaments
          </h1>
          <p className="text-base text-ufill-textMuted max-w-2xl mt-2 leading-relaxed">
            Every spool is laser-monitored to ±0.02 mm and robotically wound for zero tangles. Filter by polymer category, surface finish, and machine diameter.
          </p>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-white p-6 rounded-3xl border border-ufill-border shadow-elevation-1 mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PLA, Carbon, PETG, colors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <label className="text-xs font-bold text-ufill-textDim uppercase whitespace-nowrap">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-ufill-border text-xs font-semibold bg-ufill-background text-ufill-primary focus:outline-none focus:border-ufill-secondary"
              >
                <option value="featured">Featured Standards</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated (4.9+)</option>
              </select>

              {(selectedMaterial !== 'All' || selectedFinish !== 'All' || selectedDiameter !== 'All' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-ufill-secondary hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills Rows */}
          <div className="pt-4 border-t border-ufill-border/60 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Material */}
            <div>
              <span className="font-bold text-ufill-primary uppercase tracking-wider block mb-2">
                Polymer Grade:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {materialsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedMaterial === m
                        ? 'bg-ufill-primary text-white shadow-sm'
                        : 'bg-ufill-background text-ufill-textMuted hover:text-ufill-primary'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Finish */}
            <div>
              <span className="font-bold text-ufill-primary uppercase tracking-wider block mb-2">
                Surface Finish:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {finishesList.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedFinish === f
                        ? 'bg-ufill-secondary text-white shadow-sm'
                        : 'bg-ufill-background text-ufill-textMuted hover:text-ufill-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Extruder Diameter */}
            <div>
              <span className="font-bold text-ufill-primary uppercase tracking-wider block mb-2">
                Diameter:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {diametersList.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDiameter(d)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedDiameter === d
                        ? 'bg-ufill-primary text-white shadow-sm'
                        : 'bg-ufill-background text-ufill-textMuted hover:text-ufill-primary'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Count and Grid */}
        <div className="flex items-center justify-between mb-6 text-xs text-ufill-textMuted">
          <span>Showing <strong>{filteredProducts.length}</strong> precision filaments</span>
          <span>Guaranteed ±0.02 mm tolerance on all spools</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-ufill-border p-8">
            <h3 className="text-xl font-bold text-ufill-primary">No matching filaments found</h3>
            <p className="text-sm text-ufill-textMuted mt-1 max-w-sm mx-auto">
              Try adjusting your filter combinations or clearing your search term.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 rounded-xl bg-ufill-secondary text-white text-xs font-semibold shadow-elevation-1"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-ufill-border overflow-hidden hover:border-ufill-secondary/40 hover:shadow-elevation-3 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Top */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#F2F4FB] to-white p-6 flex items-center justify-center overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-ufill-primary/90 text-white text-[11px] font-mono tracking-wider backdrop-blur-md">
                      {product.badge}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-ufill-border text-xs font-bold text-ufill-primary shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                  </div>

                  <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* Info Bottom */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-ufill-textDim mb-1 font-mono">
                      <span className="font-semibold text-ufill-secondary uppercase">
                        {product.material} • {product.finish}
                      </span>
                      <span>{product.specs.tolerance}</span>
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

                  {/* Price and Action Buttons */}
                  <div className="pt-4 border-t border-ufill-border flex items-center justify-between">
                    <div>
                      <div className="text-xs text-ufill-textDim font-medium">Starting at</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-ufill-primary font-mono">
                          {formatPrice(product.price, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addItem(product, product.colors[0], '1.75 mm', '1.0 kg', 1)}
                        className="p-2.5 rounded-xl bg-ufill-background hover:bg-ufill-tertiary text-ufill-primary transition-colors border border-ufill-border"
                        title="Quick Add 1kg Spool"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/product/${product.slug}`}
                        className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-ufill-primary text-white font-semibold text-xs hover:bg-ufill-secondary transition-all shadow-sm"
                      >
                        <span>Configure</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
