'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto' | 'white';
  showTagline?: boolean;
}

export function UFillLogo({
  className = 'h-7 sm:h-8 w-auto',
  variant = 'auto',
  showTagline = false,
}: LogoProps) {
  // 'white' or 'light' = white logo for dark surfaces.
  // 'dark' or 'auto' (default) = original black-and-royal-violet logo for light surfaces.
  const isWhiteLogo = variant === 'white' || variant === 'light';

  return (
    <Link 
      href="/" 
      className="inline-flex items-center shrink-0 focus:outline-none transition-transform duration-200 active:scale-95"
      aria-label="UFill3D — Make it Real"
    >
      <div className="relative flex items-center shrink-0">
        <Image
          src={isWhiteLogo ? '/images/ufill3d-logo-white.png' : '/images/ufill3d-logo-dark.png'}
          alt="UFill3D Official Logo"
          width={180}
          height={32}
          priority
          className={`object-contain w-auto transition-all duration-300 ${className}`}
        />
      </div>
      {showTagline && (
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#5401C5] ml-2 select-none whitespace-nowrap hidden sm:inline-block">
          Make it Real.
        </span>
      )}
    </Link>
  );
}

export default UFillLogo;
