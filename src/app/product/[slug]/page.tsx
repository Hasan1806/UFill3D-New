'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';

const FilamentSpoolCanvas = dynamic(
  () => import('@/components/3d/FilamentSpoolCanvas').then((module) => module.FilamentSpoolCanvas),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-ufill-tertiary/40" /> }
);
import { 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Thermometer, 
  Gauge, 
  Zap, 
  Rotate3d,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="pt-36 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-ufill-primary">Product Not Found</h1>
        <p className="text-ufill-textMuted mt-2">The requested filament profile could not be located.</p>
        <Link href="/shop" className="mt-6 px-6 py-3 rounded-xl bg-ufill-secondary text-white font-semibold text-sm">
          Return to Store
        </Link>
      </div>
    );
  }

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedDiameter, setSelectedDiameter] = useState(product.availableDiameters[0] || '1.75 mm');
  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights[0] || '1.0 kg');
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const currency = useCartStore((state) => state.currency);

  const priceMultiplier = selectedWeight === '3.0 kg' ? 2.8 : selectedWeight === '5.0 kg' ? 4.5 : 1.0;
  const unitPrice = product.price * priceMultiplier;

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedDiameter, selectedWeight, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-ufill-textMuted mb-8 font-medium">
          <Link href="/" className="hover:text-ufill-primary">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ufill-primary">Shop</Link>
          <span>/</span>
          <span className="text-ufill-primary font-bold">{product.name}</span>
        </nav>

        {/* Top Section: Visual Stage & Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left: Product Visual Stage (3D Canvas / Photo Toggle) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-white border border-ufill-border shadow-elevation-2 overflow-hidden p-6 flex flex-col justify-between">
              {/* Top Controls */}
              <div className="flex items-center justify-between z-20">
                <span className="px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider">
                  {product.material} • {product.finish}
                </span>

                {/* 3D vs Photo Mode Switch */}
                <div className="flex items-center gap-1 bg-ufill-background p-1 rounded-xl border border-ufill-border text-xs font-bold">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === '3d'
                        ? 'bg-ufill-secondary text-white shadow-sm'
                        : 'text-ufill-textMuted hover:text-ufill-primary'
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span>Interactive 3D</span>
                  </button>
                  <button
                    onClick={() => setViewMode('photo')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      viewMode === 'photo'
                        ? 'bg-ufill-primary text-white shadow-sm'
                        : 'text-ufill-textMuted hover:text-ufill-primary'
                    }`}
                  >
                    Studio Still
                  </button>
                </div>
              </div>

              {/* Center Canvas or Still Photo */}
              <div className="w-full h-full my-auto flex items-center justify-center">
                {viewMode === '3d' ? (
                  <FilamentSpoolCanvas
                    color={selectedColor.hex}
                    finish={product.finish === 'Silk' ? 'Silk' : product.finish === 'Gloss' ? 'Gloss' : 'Matte'}
                    interactive={true}
                    scale={1.3}
                    rotationX={0.25}
                    rotationY={-0.6}
                    autoRotateSpeed={0.002}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Canvas Overlay */}
              <div className="flex items-center justify-between text-xs text-ufill-textDim pt-3 border-t border-ufill-border/60 z-20">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="font-bold text-ufill-primary">{selectedColor.name}</span>
                </div>
                <div className="font-mono text-[11px]">
                  Dual-Axis Laser Verified: ±0.02 mm
                </div>
              </div>
            </div>

            {/* Thumbnail previews */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setViewMode('photo')}
                  className="relative aspect-video rounded-xl overflow-hidden border border-ufill-border cursor-pointer hover:border-ufill-secondary transition-colors"
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Buy Box & Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-ufill-secondary uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Certified Virgin NatureWorks Pellet Feedstock</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ufill-primary tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm text-ufill-textMuted mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ufill-primary">{product.rating}</span>
                <span className="text-xs text-ufill-textDim">({product.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white border border-ufill-border flex items-baseline justify-between shadow-sm">
              <div>
                <span className="text-xs text-ufill-textDim block">Spool Unit Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-bold text-ufill-primary font-mono">
                    {formatPrice(unitPrice, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-ufill-textDim line-through font-mono">
                      {formatPrice(product.originalPrice * priceMultiplier, currency)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock & Ready
                </span>
                <span className="text-[11px] text-ufill-textDim block mt-1">Dispatches within 24h</span>
              </div>
            </div>

            {/* Colour Selector */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-ufill-primary uppercase tracking-wider">
                  Color: <strong className="text-ufill-secondary font-mono">{selectedColor.name}</strong>
                </span>
                {selectedColor.pantone && (
                  <span className="text-ufill-textDim font-mono">{selectedColor.pantone}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`group relative p-1 rounded-xl border-2 transition-all ${
                      selectedColor.id === c.id
                        ? 'border-ufill-secondary scale-110 shadow-md'
                        : 'border-transparent hover:border-ufill-border'
                    }`}
                    title={c.name}
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-black/15 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Diameter Selector */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-ufill-primary uppercase tracking-wider block">
                Extruder Diameter:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {product.availableDiameters.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDiameter(d)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      selectedDiameter === d
                        ? 'bg-ufill-primary text-white border-ufill-primary shadow-sm'
                        : 'bg-white text-ufill-text border-ufill-border hover:border-ufill-secondary'
                    }`}
                  >
                    {d} (Dual-Laser Verified)
                  </button>
                ))}
              </div>
            </div>

            {/* Spool Net Weight Selector */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-ufill-primary uppercase tracking-wider block">
                Spool Net Weight:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {product.availableWeights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedWeight === w
                        ? 'bg-ufill-secondary text-white border-ufill-secondary shadow-sm'
                        : 'bg-white text-ufill-text border-ufill-border hover:border-ufill-secondary'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-2 flex gap-4">
              <div className="flex items-center border border-ufill-border rounded-xl bg-white px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-ufill-textMuted hover:text-ufill-primary font-bold text-lg"
                >
                  -
                </button>
                <span className="px-3 font-mono font-bold text-ufill-primary text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-ufill-textMuted hover:text-ufill-primary font-bold text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isAdded ? 'Added to Cart!' : `Add to Cart • ${formatPrice(unitPrice * quantity, currency)}`}</span>
              </button>
            </div>

            {/* Reassurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-ufill-textMuted border-t border-ufill-border/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-ufill-secondary" />
                <span>Free shipping over {formatPrice(60, currency)}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-ufill-secondary" />
                <span>30-Day Tangle-Free Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Datasheet & Print Parameters Matrix */}
        <div className="bg-white rounded-3xl border border-ufill-border p-8 sm:p-12 mb-20 shadow-elevation-1 space-y-10">
          <div className="border-b border-ufill-border pb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-ufill-primary tracking-tight">
              Recommended Print Settings & Physical Metrics
            </h2>
            <p className="text-sm text-ufill-textMuted mt-1">
              Optimized for high-speed CoreXY kinematics, direct-drive extruders, and hardened nozzles.
            </p>
          </div>

          {/* Print Temperature Slider Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-ufill-background border border-ufill-border space-y-2">
              <div className="flex items-center justify-between text-xs text-ufill-textDim uppercase font-bold">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Nozzle Temperature
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-ufill-primary">
                {product.specs.nozzleTemp}
              </div>
              <p className="text-[11px] text-ufill-textMuted">
                Higher temperatures recommended for speeds &gt;300 mm/s.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ufill-background border border-ufill-border space-y-2">
              <div className="flex items-center justify-between text-xs text-ufill-textDim uppercase font-bold">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  Heated Bed Temperature
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-ufill-primary">
                {product.specs.bedTemp}
              </div>
              <p className="text-[11px] text-ufill-textMuted">
                Textured PEI or smooth engineering sheet recommended.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ufill-background border border-ufill-border space-y-2">
              <div className="flex items-center justify-between text-xs text-ufill-textDim uppercase font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-ufill-secondary" />
                  Rated Print Speed
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-ufill-secondary">
                {product.specs.printSpeed}
              </div>
              <p className="text-[11px] text-ufill-textMuted">
                High volumetric melt index supports up to 32 mm³/s flow.
              </p>
            </div>
          </div>

          {/* Full Engineering Metrics Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-ufill-textDim border-b border-ufill-border bg-ufill-background/60">
                <tr>
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Certified Value</th>
                  <th className="py-3 px-4">Test Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ufill-border text-xs">
                <tr>
                  <td className="py-3 px-4 font-semibold text-ufill-primary">Diameter Tolerance</td>
                  <td className="py-3 px-4 font-mono font-bold text-ufill-secondary">{product.specs.tolerance}</td>
                  <td className="py-3 px-4 text-ufill-textMuted">Continuous Dual-Axis Laser Micrometer</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-ufill-primary">Roundness / Circularity</td>
                  <td className="py-3 px-4 font-mono text-ufill-primary">{product.specs.roundness}</td>
                  <td className="py-3 px-4 text-ufill-textMuted">ISO 1183</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-ufill-primary">Density</td>
                  <td className="py-3 px-4 font-mono text-ufill-primary">{product.specs.density}</td>
                  <td className="py-3 px-4 text-ufill-textMuted">ASTM D792</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-ufill-primary">Tensile Strength</td>
                  <td className="py-3 px-4 font-mono text-ufill-primary">{product.specs.tensileStrength}</td>
                  <td className="py-3 px-4 text-ufill-textMuted">ASTM D638</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-ufill-primary">Heat Deflection Temp (HDT)</td>
                  <td className="py-3 px-4 font-mono text-ufill-primary">{product.specs.heatDeflectionTemp}</td>
                  <td className="py-3 px-4 text-ufill-textMuted">ISO 75 (0.45 MPa)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-ufill-primary">Cooling Fan Speed</td>
                  <td className="py-3 px-4 font-mono text-ufill-primary">{product.specs.fanSpeed}</td>
                  <td className="py-3 px-4 text-ufill-textMuted">Layer 2+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Filaments */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-ufill-primary">Frequently Paired Filaments</h3>
            <Link href="/shop" className="text-xs font-semibold text-ufill-secondary hover:underline flex items-center gap-1">
              <span>View All Spools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group p-5 rounded-2xl bg-white border border-ufill-border hover:border-ufill-secondary/40 hover:shadow-elevation-2 transition-all flex items-center gap-4"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-ufill-background flex-shrink-0">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-ufill-secondary uppercase">{p.material}</span>
                  <h4 className="text-sm font-bold text-ufill-primary group-hover:text-ufill-secondary transition-colors truncate">
                    {p.name}
                  </h4>
                  <span className="font-mono text-xs font-bold text-ufill-primary block mt-1">
                    {formatPrice(p.price, currency)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
