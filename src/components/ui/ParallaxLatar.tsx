"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lapisan latar yang bergeser lebih lambat dari scroll (parallax). Taruh di dalam pembungkus
 * `relative overflow-hidden`; ia mengisi pembungkus itu. Diperbesar 1,06x agar tepi tidak terbuka.
 * Mati bila pengguna memilih prefers-reduced-motion.
 */
export function ParallaxLatar({ children, geser = 3 }: { children: ReactNode; geser?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el?.parentElement) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(el, {
        yPercent: geser,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, [geser]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 scale-[1.06] will-change-transform">
      {children}
    </div>
  );
}
