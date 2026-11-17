'use client';

import React, { useState } from 'react';
import { Download, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleDownloadProfile = (slicerName: string) => {
    setDownloadSuccess(slicerName);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="pt-28 pb-24 bg-ufill-background min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="py-8 border-b border-ufill-border mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufill-tertiary text-ufill-secondary text-xs font-bold uppercase tracking-wider mb-3">
            <span>Support & Profiles</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ufill-primary tracking-tightest">
            Print Profiles & Technical Inquiries
          </h1>
          <p className="text-base text-ufill-textMuted max-w-2xl mt-2 leading-relaxed">
            Download verified slicer profiles calibrated for maximum layer adhesion and minimum stringing, or connect with our materials engineering team.
          </p>
        </div>

        {/* Slicer Profiles Downloads Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-ufill-primary mb-6">
            Official Pre-Configured Slicing Profiles
          </h2>

          {downloadSuccess && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Downloaded {downloadSuccess} optimal tuning preset! Import directly into your slicer.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bambu Lab Studio', ext: '.3mf / .json', desc: 'Pre-tuned flow dynamics & pressure advance for X1C, P1S, A1' },
              { name: 'UltiMaker Cura', ext: '.curaprofile', desc: 'Optimized retraction speed and coasting for Bowden & Direct Drive' },
              { name: 'PrusaSlicer', ext: '.ini Config Bundle', desc: 'Precision volumetric extrusion limits for MK3S+, MK4, XL' },
              { name: 'OrcaSlicer', ext: '.json Presets', desc: 'High-acceleration calibration for Voron, RatRig, Creality K1' },
            ].map((slicer) => (
              <div
                key={slicer.name}
                className="p-6 rounded-2xl bg-white border border-ufill-border shadow-elevation-1 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-ufill-secondary block mb-1">
                    {slicer.ext}
                  </span>
                  <h3 className="text-base font-bold text-ufill-primary">{slicer.name}</h3>
                  <p className="text-xs text-ufill-textMuted mt-1.5 leading-relaxed">{slicer.desc}</p>
                </div>
                <button
                  onClick={() => handleDownloadProfile(slicer.name)}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-ufill-background hover:bg-ufill-secondary hover:text-white text-ufill-primary text-xs font-semibold border border-ufill-border transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Profile</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form & Facility Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-ufill-border shadow-elevation-1">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-ufill-primary">Inquiry Delivered</h3>
                <p className="text-sm text-ufill-textMuted max-w-sm mx-auto">
                  Our materials support engineers typically reply within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-ufill-background text-ufill-primary text-xs font-semibold rounded-xl border border-ufill-border"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-ufill-primary">Contact Materials Engineering</h3>
                <p className="text-xs text-ufill-textMuted">
                  Have questions about custom polymer blending, nozzle abrasion, or print speed optimization?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ufill-primary block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ufill-primary block mb-1">Inquiry Topic</label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background">
                    <option>Slicing Profile Tuning & Retraction</option>
                    <option>Commercial Bulk Wholesale Order</option>
                    <option>Tangle-Free Guarantee Support</option>
                    <option>Material Safety Data Sheet (MSDS) Request</option>
                    <option>Other Engineering Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ufill-primary block mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your printer setup, nozzle size, and question in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ufill-border text-sm focus:outline-none focus:border-ufill-secondary bg-ufill-background"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-ufill-secondary text-white font-semibold text-sm hover:bg-ufill-secondaryHover shadow-elevation-2 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Support</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white border border-ufill-border shadow-elevation-1 space-y-6">
            <h3 className="text-lg font-bold text-ufill-primary">UFill3D Technology Center</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-ufill-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ufill-primary block">Extrusion Plant & HQ</span>
                  <span className="text-ufill-textMuted">
                    UFill3D High-Precision Materials Corp.<br />
                    100 Innovation Way, Advanced Manufacturing Hub<br />
                    Tech Corridor, Europe / North America
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-ufill-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ufill-primary block">Direct Email</span>
                  <span className="text-ufill-textMuted">support@ufill3d.com / b2b@ufill3d.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-ufill-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ufill-primary block">Engineering Hotline</span>
                  <span className="text-ufill-textMuted">+1 (800) 834-5533 (Mon-Fri 8am-6pm EST)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ufill-background border border-ufill-border/80 text-xs text-ufill-textMuted space-y-1">
              <span className="font-bold text-ufill-primary block">Zero Downtime Pledge</span>
              <p>
                Every spool is backed by our 100% Tangle-Free guarantee. If any spool snags mid-print due to manufacturing overlap, we replace it with two new spools at zero charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
