'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Check, ArrowRight, ShieldCheck, Calculator, Mail, Send } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export function BulkOrdersB2B() {
  const [spoolCount, setSpoolCount] = useState<number>(50);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    printerFleet: '10 - 25 Printers',
    notes: '',
  });

  // Calculate volume discount
  const basePricePerSpool = 24.99;
  let discountPercent = 0;
  if (spoolCount >= 200) discountPercent = 30;
  else if (spoolCount >= 100) discountPercent = 25;
  else if (spoolCount >= 50) discountPercent = 20;
  else if (spoolCount >= 20) discountPercent = 15;
  else if (spoolCount >= 10) discountPercent = 10;

  const discountedPricePerSpool = basePricePerSpool * (1 - discountPercent / 100);
  const totalEstimatedCost = discountedPricePerSpool * spoolCount;
  const totalSavings = (basePricePerSpool - discountedPricePerSpool) * spoolCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-28 bg-ufill-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ufill-primary text-white text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-ufill-secondary" />
            <span>Section 08 • B2B & Print Farms</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest leading-[1.08]">
            Built for Commercial Print Farms & <br />
            Industrial Production Fleets.
          </h2>
          <p className="text-base sm:text-lg text-ufill-textMuted leading-relaxed">
            Eliminate print failure downtime across 50+ machine clusters. We offer dedicated batch lot numbers, custom spool sizing (up to 10kg spools), masterspool refills, and wholesale tiered discounting.
          </p>
        </div>

        {/* Interactive Volume Discount Calculator + Procurement Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left: Volume Calculator */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-white border border-ufill-border shadow-elevation-2 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-ufill-border">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-ufill-secondary" />
                  <span className="font-bold text-ufill-primary text-sm">Print Farm Tier Estimator</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {discountPercent}% Tier Discount
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-bold uppercase tracking-wider text-ufill-textDim">
                    Estimated Monthly Spool Volume
                  </label>
                  <span className="text-2xl font-bold text-ufill-primary font-mono">
                    {spoolCount} Spools
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={spoolCount}
                  onChange={(e) => setSpoolCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-ufill-background rounded-lg appearance-none cursor-pointer accent-ufill-secondary"
                />
                <div className="flex justify-between text-[11px] font-mono text-ufill-textDim">
                  <span>10 spools (10% off)</span>
                  <span>50 spools (20% off)</span>
                  <span>200+ spools (30% off)</span>
                </div>
              </div>

              {/* Cost Calculation Summary */}
              <div className="p-6 rounded-2xl bg-ufill-background border border-ufill-border space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ufill-textMuted">Unit Price per 1kg Spool:</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-ufill-primary text-base">
                      {formatPrice(discountedPricePerSpool)}
                    </span>
                    <span className="text-xs text-ufill-textDim line-through block">
                      {formatPrice(basePricePerSpool)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-ufill-textMuted">Estimated Monthly Total:</span>
                  <span className="font-mono font-bold text-2xl text-ufill-secondary">
                    {formatPrice(totalEstimatedCost)}
                  </span>
                </div>

                <div className="pt-2 border-t border-ufill-border flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>Total Monthly Fleet Savings:</span>
                  <span>+{formatPrice(totalSavings)}</span>
                </div>
              </div>

              {/* B2B Perks Checklist */}
              <div className="space-y-2.5 pt-2">
                {[
                  'Single batch lot extrusion to ensure 100% color consistency',
                  'Dedicated technical account manager & priority production queue',
                  'Custom cardboard masterspool refill options to cut plastic waste',
                  'NET30 invoicing terms available for qualified enterprises & schools',
                ].map((perk) => (
                  <div key={perk} className="flex items-start gap-2.5 text-xs text-ufill-text">
                    <Check className="w-4 h-4 text-ufill-secondary flex-shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/b2b"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-ufill-primary text-white font-semibold text-sm hover:bg-ufill-secondary transition-all shadow-elevation-1"
              >
                <span>Explore Full B2B Partner Program</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Quick Quote Request Form */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-white border border-ufill-border shadow-elevation-2 flex flex-col justify-between">
            {submitted ? (
              <div className="my-auto text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-ufill-primary">Wholesale Quote Request Received</h3>
                <p className="text-sm text-ufill-textMuted max-w-sm mx-auto">
                  Thank you, <strong>{formData.name || 'Partner'}</strong>. Our commercial engineering team will review your fleet requirements and deliver a customized quote within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-ufill-background hover:bg-ufill-tertiary text-ufill-primary text-xs font-semibold rounded-xl border border-ufill-border transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-ufill-primary">Request a Custom B2B Quote</h3>
                  <p className="text-xs text-ufill-textMuted mt-1">
                    Receive customized tiered rates, pallet shipping, and complimentary test sample spools.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Alex Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@aerotech.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="AeroTech Labs / Print Farm LLC"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">
                      Printer Fleet Size
                    </label>
                    <select
                      value={formData.printerFleet}
                      onChange={(e) => setFormData({ ...formData, printerFleet: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    >
                      <option>1 - 5 Printers</option>
                      <option>6 - 15 Printers</option>
                      <option>16 - 50 Printers</option>
                      <option>50+ Industrial Fleet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ufill-primary block mb-1">
                    Specific Materials or Target Delivery Date
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Need 100x PLA+ HyperFlow in Electric Periwinkle and 30x Carbon Fiber PLA. Ship to California warehouse."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Fleet Quote Request</span>
                  </button>
                  <p className="text-[11px] text-center text-ufill-textDim mt-2">
                    NDAs honored. Free sample pack shipped to verified print farms.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BulkOrdersB2B;
