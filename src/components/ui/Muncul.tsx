"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Konten muncul pelan (naik 24 px + memudar) saat masuk layar. Tanpa JS atau saat prefers-reduced-motion
 * konten langsung terlihat; elemen yang sudah di layar saat dimuat tidak disembunyikan (tanpa kedipan).
 */
export function Muncul({ children, jeda = 0, className = "" }: { children: ReactNode; jeda?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const transisi = `opacity 0.7s cubic-bezier(0,0,0.58,1) ${jeda}s, translate 0.7s cubic-bezier(0,0,0.58,1) ${jeda}s`;
    el.style.opacity = "0";
    el.style.translate = "0 24px";
    el.style.transition = transisi;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.style.opacity = "1";
        el.style.translate = "0 0";
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [jeda]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
