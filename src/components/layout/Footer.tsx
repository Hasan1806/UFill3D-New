'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UFillLogo } from './UFillLogo';
import { ShieldCheck, Mail, ArrowRight, Download, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-ufill-primary text-white pt-16 pb-12 border-t border-ufill-borderDark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <UFillLogo variant="dark" className="h-9" showTagline />
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              UFill3D is the premier engineering-grade filament manufacturer. Powered by continuous laser micrometer calibration, 100% virgin polymer feedstock, and certified robotic winding.
            </p>
            <div className="flex items-center gap-4 text-xs text-ufill-tertiary pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ISO 9001:2015 Certified
              </span>
              <span>•</span>
              <span>RoHS & REACH Compliant</span>
              <span>•</span>
              <span>100% Recyclable Spools</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <span className="text-xs font-bold tracking-widest uppercase text-ufill-secondary">
                Join the Maker Community
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Receive 10% off your first spool & slicing profiles
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Get monthly engineering benchmarks, tuned Cura/Bambu/Prusa presets, and member-only filament drops.
              </p>

              {subscribed ? (
                <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-sm text-emerald-300 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome! Check your inbox for your 10% code: <strong>REAL10</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your engineer or farm email..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-ufill-secondary transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-ufill-secondary hover:bg-ufill-secondaryHover text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-glow-purple"
                  >
                    <span>Claim</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-14 border-b border-white/10 text-sm">
          {/* Col 1: Materials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
              Material Range
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/product/pla-ultra-precision" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  PLA Ultra Precision
                </Link>
              </li>
              <li>
                <Link href="/product/pla-plus-high-speed" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  PLA+ High-Speed HyperFlow
                </Link>
              </li>
              <li>
                <Link href="/product/petg-pro-industrial" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  PETG Pro Industrial
                </Link>
              </li>
              <li>
                <Link href="/product/carbon-fiber-pla-aerospace" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Carbon Fiber PLA Structural
                </Link>
              </li>
              <li>
                <Link href="/product/tpu-flex-95a" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  TPU 95A Elastomer Pro
                </Link>
              </li>
              <li>
                <Link href="/product/silk-alchemy-pla" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Silk Alchemy Dual PLA
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Profiles & Slicing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
              Print Profiles & Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-ufill-secondary" />
                  <span>Bambu Lab Studio (.3mf)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-ufill-secondary" />
                  <span>UltiMaker Cura (.curaprofile)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-ufill-secondary" />
                  <span>PrusaSlicer Presets</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-ufill-secondary" />
                  <span>OrcaSlicer Profiles</span>
                </Link>
              </li>
              <li>
                <Link href="/colors" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  3D Colour Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Enterprise & Farms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
              Commercial & Farms
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/b2b" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Print Farm Bulk Procurement
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Tiered Volume Discounts
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Spoolless Refill Coils
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Educational & Lab Grants
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Custom Color Compounds
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
              Quality & Science
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Laser Micrometer Calibration
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Virgin Polymer Sourcing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  MSDS & Technical Datasheets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Eco-Cardboard Recycling
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Tangle-Free Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  About UFill3D
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Full Store Catalog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Technical Support
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-slate-300 hover:text-ufill-secondary transition-colors">
                  Cart & Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} UFill3D. All rights reserved. "Make it Real." is a registered trademark of UFill3D Technologies.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
