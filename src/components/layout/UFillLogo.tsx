'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
}

export function UFillLogo({
  className = 'h-9 w-auto',
  variant = 'auto',
  showTagline = false,
}: LogoProps) {
  // We use the exact supplied logo image from the project
  return (
    <Link 
      href="/" 
      className="inline-flex flex-col group items-start focus:outline-none transition-transform duration-200 active:scale-95"
      aria-label="UFill3D — Make it Real"
    >
      <div className={`relative flex items-center ${variant === 'dark' ? 'brightness-125 contrast-125' : ''}`}>
        {/* Exact official logo image */}
        <div className="relative overflow-hidden rounded">
          <Image
            src="/images/ufill3d-logo.jpg"
            alt="UFill3D Official Logo"
            width={280}
            height={70}
            priority
            className={`object-contain transition-all duration-300 ${
              variant === 'dark' 
                ? 'invert hue-rotate-180 mix-blend-screen filter drop-shadow-[0_0_12px_rgba(98,88,245,0.4)]' 
                : 'mix-blend-multiply'
            } ${className}`}
          />
        </div>
      </div>
      {showTagline && (
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-ufill-secondary mt-0.5 ml-1 select-none">
          Make it Real.
        </span>
      )}
    </Link>
  );
}

export default UFillLogo;
