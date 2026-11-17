'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Tag,
  CheckCircle2
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    currency,
    getSubtotal,
    getShippingFee,
    getTotalPrice,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const subtotal = getSubtotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = getShippingFee();
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'REAL10') {
      setDiscountPercent(10);
      setPromoMessage('10% Welcome Discount Applied!');
    } else {
      setPromoMessage('Invalid coupon code. Try "REAL10"');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-6 border-b border-ufill-border mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ufill-primary tracking-tightest">
            Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} Spools)
          </h1>
          <p className="text-sm text-ufill-textMuted mt-1">
            Review your order before proceeding to secure express checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-ufill-border p-8">
            <div className="w-16 h-16 rounded-full bg-ufill-tertiary flex items-center justify-center mx-auto text-ufill-secondary mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-ufill-primary">Your cart is empty</h2>
            <p className="text-sm text-ufill-textMuted mt-1 max-w-sm mx-auto">
              Ready to print? Browse our lineup of precision-engineered 3D printing filaments.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-ufill-secondary text-white text-sm font-semibold hover:bg-ufill-secondaryHover shadow-elevation-1 transition-all"
            >
              <span>Explore Filaments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Items Table */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-ufill-border shadow-elevation-1 p-6 sm:p-8 space-y-6">
              {/* Items List */}
              <div className="divide-y divide-ufill-border">
                {items.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Color Swatch Icon */}
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 border border-black/10 shadow-inner"
                        style={{ backgroundColor: item.color.hex }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-white/60 bg-black/20" />
                      </div>

                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-base font-bold text-ufill-primary hover:text-ufill-secondary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-ufill-textMuted mt-1">
                          <span className="font-semibold">{item.color.name}</span>
                          <span>•</span>
                          <span>{item.diameter}</span>
                          <span>•</span>
                          <span>{item.weight}</span>
                        </div>
                        <div className="font-mono text-sm font-bold text-ufill-secondary mt-1">
                          {formatPrice(item.price, currency)} / unit
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-ufill-border rounded-xl bg-ufill-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 hover:text-ufill-secondary"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 font-mono font-bold text-xs text-ufill-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 hover:text-ufill-secondary"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-mono text-base font-bold text-ufill-primary">
                          {formatPrice(item.price * item.quantity, currency)}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-ufill-textDim hover:text-red-500 p-2"
                        title="Remove spool"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-ufill-border text-xs">
                <Link href="/shop" className="text-ufill-secondary font-semibold hover:underline">
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-ufill-textDim hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-ufill-border shadow-elevation-1 p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-ufill-primary">Order Summary</h2>

              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Coupon (try REAL10)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-ufill-border text-xs focus:outline-none focus:border-ufill-secondary uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ufill-primary text-white text-xs font-semibold rounded-xl hover:bg-ufill-secondary transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs ${discountPercent > 0 ? 'text-emerald-600 font-semibold' : 'text-red-500'}`}>
                    {promoMessage}
                  </p>
                )}
              </form>

              {/* Totals Breakdown */}
              <div className="space-y-3 text-xs pt-4 border-t border-ufill-border">
                <div className="flex justify-between text-ufill-textMuted">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-ufill-primary">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}% off)</span>
                    <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-ufill-textMuted">
                  <span>Shipping</span>
                  <span className="font-mono font-bold text-ufill-primary">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(shippingFee, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-ufill-primary pt-3 border-t border-ufill-border">
                  <span>Estimated Total</span>
                  <span className="font-mono text-xl text-ufill-secondary">
                    {formatPrice(grandTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-2 text-center text-xs text-ufill-textDim pt-2">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>30-Day Tangle-Free Guarantee & Free Returns</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
