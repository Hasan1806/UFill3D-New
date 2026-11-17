'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UFillLogo } from './UFillLogo';
import { useCartStore } from '@/lib/cart-store';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  Globe, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [materialsDropdownOpen, setMaterialsDropdownOpen] = useState(false);
  const isDarkHomeHero = pathname === '/' && !isScrolled;
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  const currency = useCartStore((state) => state.currency);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Materials', href: '/materials', hasDropdown: true },
    { label: 'Colour Studio', href: '/colors' },
    { label: 'B2B & Print Farms', href: '/b2b' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const materialSubmenu = [
    { name: 'PLA Ultra Precision', desc: '±0.02mm Virgin Biopolymer', href: '/product/pla-ultra-precision' },
    { name: 'PLA+ High-Speed HyperFlow', desc: 'CoreXY 600mm/s Certified', href: '/product/pla-plus-high-speed' },
    { name: 'PETG Pro Industrial', desc: 'Chemical & Weather Endurance', href: '/product/petg-pro-industrial' },
    { name: 'Carbon Fiber PLA', desc: '15% Chopped Carbon Composite', href: '/product/carbon-fiber-pla-aerospace' },
    { name: 'TPU 95A Elastomer', desc: '580% Elongation Flexible', href: '/product/tpu-flex-95a' },
    { name: 'Silk Alchemy PLA', desc: 'Pearlescent Metallic Sheen', href: '/product/silk-alchemy-pla' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-ufill-border shadow-elevation-1 py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <UFillLogo className="h-8 sm:h-9" showTagline={!isScrolled} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setMaterialsDropdownOpen(true)}
                    onMouseLeave={() => setMaterialsDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                        pathname.startsWith(link.href)
                          ? 'text-ufill-secondary font-semibold'
                          : isDarkHomeHero
                            ? 'text-white/85 hover:text-white hover:bg-white/10'
                            : 'text-ufill-primary hover:text-ufill-secondary hover:bg-ufill-tertiary/40'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </Link>

                    {/* Mega Dropdown */}
                    <div
                      className={`absolute top-full left-0 w-80 p-3 bg-white rounded-2xl shadow-elevation-3 border border-ufill-border transition-all duration-200 transform origin-top ${
                        materialsDropdownOpen
                          ? 'opacity-100 scale-100 pointer-events-auto'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wider text-ufill-textDim px-3 py-1 mb-1">
                        High-Performance Polymers
                      </div>
                      <div className="space-y-1">
                        {materialSubmenu.map((mat) => (
                          <Link
                            key={mat.name}
                            href={mat.href}
                            className="block p-2.5 rounded-xl hover:bg-ufill-tertiary/50 transition-colors group/item"
                          >
                            <div className="text-sm font-semibold text-ufill-primary group-hover/item:text-ufill-secondary transition-colors">
                              {mat.name}
                            </div>
                            <div className="text-xs text-ufill-textMuted mt-0.5">
                              {mat.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-ufill-border px-3">
                        <Link
                          href="/materials"
                          className="flex items-center justify-between text-xs font-semibold text-ufill-secondary hover:underline"
                        >
                          <span>Compare All Polymer Specs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? 'text-ufill-secondary font-semibold bg-ufill-tertiary/50'
                      : isDarkHomeHero
                        ? 'text-white/85 hover:text-white hover:bg-white/10'
                        : 'text-ufill-primary hover:text-ufill-secondary hover:bg-ufill-tertiary/30'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities (Currency Selector, Search, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center rounded-lg border border-ufill-border bg-ufill-background px-2.5 py-1.5 text-xs font-bold text-ufill-primary" aria-label="Store currency">
              ₹ {currency}
            </div>

            {/* Quick Link to Shop */}
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase bg-ufill-tertiary text-ufill-secondary hover:bg-ufill-secondary hover:text-white transition-all duration-300"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Spools</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={toggleDrawer}
              aria-label="View Shopping Cart"
              className={`relative p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${isDarkHomeHero ? 'text-white hover:bg-white/10' : 'text-ufill-primary hover:text-ufill-secondary hover:bg-ufill-tertiary/50'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ufill-secondary text-[11px] font-bold text-white shadow-glow-purple">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`lg:hidden p-2 rounded-xl ${isDarkHomeHero ? 'text-white hover:bg-white/10' : 'text-ufill-primary hover:bg-ufill-tertiary/50'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white border-b border-ufill-border shadow-elevation-3 py-6 px-6 max-h-[85vh] overflow-y-auto animate-fade-in">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-base font-semibold text-ufill-primary hover:text-ufill-secondary border-b border-ufill-border/40"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-ufill-textDim mb-2">Store currency</div>
              <div className="rounded-lg border border-ufill-border bg-ufill-background px-3 py-2 text-sm font-bold text-ufill-primary">₹ {currency}</div>
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-ufill-secondary text-white rounded-xl font-medium shadow-elevation-2"
              >
                <span>Shop Filament Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
