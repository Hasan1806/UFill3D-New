'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FilamentSpoolCanvas, SpoolCanvasHandle } from './FilamentSpoolCanvas';
import { useSpoolJourneyStore } from '@/lib/spool-journey-store';

export function SpoolJourneyOverlay() {
  const canvasRef = useRef<SpoolCanvasHandle>(null);
  const color = useSpoolJourneyStore((state) => state.color);
  const finish = useSpoolJourneyStore((state) => state.finish);
  const rimColor = useSpoolJourneyStore((state) => state.rimColor);
  const setSpoolHandle = useSpoolJourneyStore((state) => state.setSpoolHandle);

  // Register imperative handle in store
  useEffect(() => {
    if (canvasRef.current) {
      setSpoolHandle(canvasRef.current);
    }
    return () => {
      setSpoolHandle(null);
    };
  }, [setSpoolHandle]);

  // Global GSAP ScrollTriggers: Hero Phase + Homepage Journey Phase
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger 1: Hero Scroll Track (0.0 -> 1.0 Hero Climax)
    const heroTrigger = ScrollTrigger.create({
      trigger: '.hero-scroll-track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.25,
      onUpdate: (self) => {
        if (!reducedMotion && canvasRef.current) {
          canvasRef.current.setProgress(self.progress);
        }
      },
    });

    // Trigger 2: Journey Track (From Hero Exit down to Footer Bottom)
    const footerEl = document.getElementById('site-footer') || document.querySelector('footer');
    let journeyTrigger: ScrollTrigger | null = null;

    if (footerEl) {
      journeyTrigger = ScrollTrigger.create({
        trigger: '.hero-scroll-track',
        start: 'bottom bottom',
        endTrigger: footerEl,
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          if (!reducedMotion && canvasRef.current) {
            canvasRef.current.setJourneyProgress(self.progress);
          }
        },
      });
    }

    return () => {
      heroTrigger.kill();
      if (journeyTrigger) journeyTrigger.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
    >
      <FilamentSpoolCanvas
        ref={canvasRef}
        scrollDriven
        interactive={false}
        enableMouseParallax
        color={color}
        finish={finish}
        rimColor={rimColor}
        className="w-full h-full"
      />
    </div>
  );
}

export default SpoolJourneyOverlay;
