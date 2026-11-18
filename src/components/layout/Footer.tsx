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
    <footer id="site-footer" className="relative bg-[#181818] text-[#FAFAFA] pt-16 pb-12 border-t border-[#E5E5E5]/15 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-[#E5E5E5]/15">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <UFillLogo variant="white" className="h-8" showTagline />
            </div>
            <p className="text-sm text-[#9CA3AF] max-w-md leading-relaxed">
              UFill3D is the premier engineering-grade filament manufacturer. Powered by continuous laser micrometer calibration, 100% virgin polymer feedstock, and certified robotic winding.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#696969] pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                ISO 9001:2015 Certified
              </span>
              <span>•</span>
              <span>RoHS & REACH Compliant</span>
              <span>•</span>
              <span>100% Recyclable Spools</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#252525] border border-[#E5E5E5]/15 rounded-2xl p-6 shadow-lg">
              <span className="text-xs font-bold tracking-widest uppercase text-[#5401C5]">
                Join the Maker Community
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Receive 10% off your first spool & slicing profiles
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-2">
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
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#696969]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your engineer or farm email..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#181818] border border-[#E5E5E5]/20 text-white placeholder-[#696969] text-sm focus:outline-none focus:border-[#5401C5] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#5401C5] hover:bg-[#43009E] text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-md active:scale-95"
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-14 border-b border-[#E5E5E5]/15 text-sm">
          {/* Col 1: Materials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-4 font-mono">
              Material Range
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/product/pla-ultra-precision" className="text-[#9CA3AF] hover:text-white transition-colors">
                  PLA Ultra Precision
                </Link>
              </li>
              <li>
                <Link href="/product/pla-plus-high-speed" className="text-[#9CA3AF] hover:text-white transition-colors">
                  PLA+ High-Speed HyperFlow
                </Link>
              </li>
              <li>
                <Link href="/product/petg-pro-industrial" className="text-[#9CA3AF] hover:text-white transition-colors">
                  PETG Pro Industrial
                </Link>
              </li>
              <li>
                <Link href="/product/carbon-fiber-pla-aerospace" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Carbon Fiber PLA Structural
                </Link>
              </li>
              <li>
                <Link href="/product/tpu-flex-95a" className="text-[#9CA3AF] hover:text-white transition-colors">
                  TPU 95A Elastomer Pro
                </Link>
              </li>
              <li>
                <Link href="/product/silk-alchemy-pla" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Silk Alchemy Dual PLA
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Profiles & Slicing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-4 font-mono">
              Print Profiles & Tools
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#5401C5]" />
                  <span>Bambu Lab Studio (.3mf)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#5401C5]" />
                  <span>UltiMaker Cura (.curaprofile)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#5401C5]" />
                  <span>PrusaSlicer Presets</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#5401C5]" />
                  <span>OrcaSlicer Profiles</span>
                </Link>
              </li>
              <li>
                <Link href="/colors" className="text-[#9CA3AF] hover:text-white transition-colors">
                  3D Colour Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Enterprise & Farms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-4 font-mono">
              Commercial & Farms
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/b2b" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Print Farm Bulk Procurement
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Tiered Volume Discounts
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Spoolless Refill Coils
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Educational & Lab Grants
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Custom Color Compounds
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quality & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-4 font-mono">
              Quality & Science
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Laser Micrometer Calibration
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Virgin Polymer Sourcing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors">
                  MSDS & Technical Datasheets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Eco-Cardboard Recycling
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Tangle-Free Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Company */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#696969] mb-4 font-mono">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-[#9CA3AF] hover:text-white transition-colors">
                  About UFill3D
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Full Store Catalog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Technical Support
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Cart & Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#696969] gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} UFill3D. All rights reserved. "Make it Real." is a registered trademark of UFill3D Technologies.</p>
            <div className="hidden sm:inline-flex items-center gap-2 pl-3 border-l border-[#E5E5E5]/20 font-mono text-[10px] text-[#9CA3AF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5401C5] animate-pulse" />
              <span>SPECIMEN CYCLE COMPLETED</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
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
