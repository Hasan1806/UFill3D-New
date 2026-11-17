'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    currency,
    getSubtotal,
    getShippingFee,
    getTotalPrice,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const totalPrice = getTotalPrice();
  const freeShippingThreshold = 60;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-ufill-primary/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-ufill-border">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-ufill-secondary" />
              <h2 className="text-lg font-bold text-ufill-primary">Your Cart</h2>
              <span className="px-2 py-0.5 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-semibold">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Close cart drawer"
              className="p-2 text-ufill-textMuted hover:text-ufill-primary hover:bg-ufill-background rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-ufill-background px-6 py-3.5 border-b border-ufill-border">
            <div className="flex items-center justify-between text-xs font-medium text-ufill-text">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-ufill-secondary" />
                {amountToFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-ufill-secondary">{formatPrice(amountToFreeShipping, currency)}</strong> for Free Express Delivery
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Free Express Delivery Unlocked!
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-ufill-textDim">
                {progressPercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-ufill-border h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-ufill-secondary to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-ufill-tertiary flex items-center justify-center mx-auto text-ufill-secondary mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-ufill-primary">Your cart is currently empty</h3>
                <p className="text-sm text-ufill-textMuted mt-1 max-w-xs mx-auto">
                  Discover our flagship range of precision-wound filaments engineered for zero clogs.
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-ufill-secondary text-white text-sm font-semibold hover:bg-ufill-secondaryHover shadow-elevation-1 transition-all"
                >
                  <span>Explore Filaments</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl border border-ufill-border bg-white hover:border-ufill-secondary/30 transition-colors shadow-sm"
                >
                  {/* Color Swatch Icon / Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-black/10 shadow-inner"
                    style={{ backgroundColor: item.color.hex }}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-white/60 bg-black/20" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-bold text-ufill-primary hover:text-ufill-secondary truncate transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                        className="text-ufill-textDim hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-ufill-textMuted">
                      <span className="flex items-center gap-1 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        {item.color.name}
                      </span>
                      <span>•</span>
                      <span>{item.diameter}</span>
                      <span>•</span>
                      <span>{item.weight}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-ufill-border/40">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-ufill-border rounded-lg bg-ufill-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-ufill-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-ufill-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-ufill-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-bold text-ufill-primary">
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-ufill-border bg-ufill-background/60 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-ufill-textMuted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ufill-primary">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-ufill-textMuted">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-ufill-primary">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingFee, currency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-ufill-primary pt-2 border-t border-ufill-border">
                  <span>Total</span>
                  <span className="text-ufill-secondary text-lg">
                    {formatPrice(totalPrice, currency)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-ufill-secondary text-white font-semibold hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center py-2.5 text-xs font-semibold text-ufill-textMuted hover:text-ufill-primary transition-colors"
                >
                  View Full Cart & Shipping Calculator
                </Link>
              </div>

              <div className="text-center text-[11px] text-ufill-textDim flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Risk • 30-Day Tangle-Free Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
