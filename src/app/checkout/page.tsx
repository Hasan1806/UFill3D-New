'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/currency';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Building2,
  Lock,
  ShoppingBag
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, getSubtotal, getShippingFee, getTotalPrice, currency, clearCart } = useCartStore();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    paymentMethod: 'card',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotalPrice();

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6258F5', '#11152E', '#E9E8FF', '#10B981'],
    });
    setStep('confirmation');
    clearCart();
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="pt-36 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-ufill-primary">Your Cart is Empty</h1>
        <p className="text-sm text-ufill-textMuted mt-1">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="mt-6 px-6 py-3 rounded-xl bg-ufill-secondary text-white font-semibold text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="pt-32 pb-24 max-w-2xl mx-auto px-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-block px-3 py-1 bg-ufill-tertiary text-ufill-secondary text-xs font-mono font-bold rounded-full">
          ORDER #UF-98421 CONFIRMED
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ufill-primary tracking-tight">
          Thank You, {formData.firstName || 'Maker'}!
        </h1>
        <p className="text-base text-ufill-textMuted leading-relaxed max-w-md mx-auto">
          Your precision-wound spools are queued for optical QC inspection and will be dispatched via express courier with real-time laser tracking.
        </p>

        <div className="p-6 rounded-2xl bg-white border border-ufill-border text-left space-y-3 text-xs shadow-sm">
          <div className="flex justify-between border-b border-ufill-border pb-2">
            <span className="text-ufill-textDim">Shipping Destination:</span>
            <span className="font-semibold text-ufill-primary">{formData.address || '742 Evergreen Terrace'}, {formData.city || 'Springfield'}</span>
          </div>
          <div className="flex justify-between border-b border-ufill-border pb-2">
            <span className="text-ufill-textDim">Carrier / Speed:</span>
            <span className="font-semibold text-ufill-primary">DHL Express (1-2 Business Days)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ufill-textDim">Order Total Paid:</span>
            <span className="font-bold text-ufill-secondary font-mono">{formatPrice(total, currency)}</span>
          </div>
        </div>

        <div className="pt-4 flex gap-4 justify-center">
          <Link
            href="/shop"
            className="px-6 py-3.5 rounded-xl bg-ufill-primary text-white font-semibold text-xs hover:bg-ufill-secondary transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-white border border-ufill-border text-ufill-primary font-semibold text-xs hover:bg-ufill-tertiary transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 py-8 mb-6 text-xs font-semibold">
          <span className={`flex items-center gap-1.5 ${step === 'details' ? 'text-ufill-secondary font-bold' : 'text-emerald-600'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
            Customer & Delivery
          </span>
          <span className="text-ufill-textDim">———</span>
          <span className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-ufill-secondary font-bold' : 'text-ufill-textDim'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
            Secure Payment
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form Area */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-ufill-border shadow-elevation-1 p-6 sm:p-10">
            {step === 'details' ? (
              <form onSubmit={handleNextToPayment} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-ufill-primary">Contact Information</h2>
                  <div className="mt-3">
                    <label className="text-xs font-bold text-ufill-primary block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="engineer@studio.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-ufill-border space-y-4">
                  <h2 className="text-xl font-bold text-ufill-primary">Shipping Address</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-ufill-primary block mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-ufill-primary block mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 500 Additive Ave, Suite 4B"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-ufill-primary block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-ufill-primary block mb-1">State / Prov *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-ufill-primary block mb-1">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-ufill-border">
                  <h2 className="text-xl font-bold text-ufill-primary">Payment Information</h2>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>256-Bit Encrypted</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="grid grid-cols-3 gap-3">
                  {['Credit Card', 'Apple Pay', 'B2B Net30 Invoicing'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: p })}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        formData.paymentMethod === p
                          ? 'border-ufill-secondary bg-ufill-tertiary/30 text-ufill-secondary'
                          : 'border-ufill-border text-ufill-text'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {formData.paymentMethod === 'Credit Card' && (
                  <div className="space-y-4 p-5 rounded-2xl bg-ufill-background border border-ufill-border">
                    <div>
                      <label className="text-xs font-bold text-ufill-primary block mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border font-mono text-sm bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-ufill-primary block mb-1">Expiration</label>
                        <input
                          type="text"
                          defaultValue="12 / 28"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border font-mono text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-ufill-primary block mb-1">CVC Code</label>
                        <input
                          type="text"
                          defaultValue="842"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border font-mono text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="py-4 px-6 rounded-xl border border-ufill-border text-ufill-primary font-semibold text-xs hover:bg-ufill-background"
                  >
                    Back to Address
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 px-6 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order ({formatPrice(total, currency)})</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-ufill-border shadow-elevation-1 p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-ufill-primary border-b border-ufill-border pb-3">
              Order Review ({items.length} Lines)
            </h3>

            <div className="divide-y divide-ufill-border/60 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: item.color.hex }}
                    />
                    <div>
                      <div className="font-semibold text-ufill-primary">{item.name}</div>
                      <div className="text-ufill-textDim">
                        Qty {item.quantity} • {item.diameter} • {item.weight}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-ufill-primary">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-ufill-border space-y-2 text-xs">
              <div className="flex justify-between text-ufill-textMuted">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-ufill-primary">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-ufill-textMuted">
                <span>Shipping</span>
                <span className="font-mono font-bold text-emerald-600">
                  {shipping === 0 ? 'FREE' : formatPrice(shipping, currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-ufill-primary pt-2 border-t border-ufill-border">
                <span>Total</span>
                <span className="font-mono text-xl text-ufill-secondary">{formatPrice(total, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
