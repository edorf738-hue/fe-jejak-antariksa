/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

/**
 * Penampil media untuk popup objek: foto (bisa diperbesar) dan video (pemutar HTML5). Penampil model 3D ada di
 * Model3DViewer.tsx. Tidak ada media yang diputar otomatis.
 */
export function ImageViewer({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [besar, setBesar] = useState(false);

  useEffect(() => {
    if (!besar) return;
    const tutup = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setBesar(false);
      }
    };
    window.addEventListener("keydown", tutup, true);
    return () => window.removeEventListener("keydown", tutup, true);
  }, [besar]);

  return (
    <>
      <button
        type="button"
        onClick={() => setBesar(true)}
        aria-label={`Perbesar foto: ${alt}`}
        className={`group relative block w-full cursor-zoom-in overflow-hidden bg-black/50 ${className}`}
      >
        {/* object-contain: foto tidak pernah terpotong */}
        <img src={src} alt={alt} loading="lazy" className="size-full object-contain" />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-pill bg-black/60 px-3 py-1 text-xs text-text-primary-normal opacity-80 transition-opacity group-hover:opacity-100">
          Perbesar
        </span>
      </button>
      {besar && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setBesar(false)}
          className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-black/90 p-4 md:p-10"
        >
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
          <button
            type="button"
            onClick={() => setBesar(false)}
            className="absolute right-4 top-4 cursor-pointer rounded-pill border border-white/30 bg-black/60 px-4 py-2 text-sm text-text-primary-normal hover:border-aksen-informasi-normal"
          >
            Tutup
          </button>
        </div>
      )}
    </>
  );
}

export function VideoViewer({ src, poster, judul, className = "" }: { src: string; poster: string; judul: string; className?: string }) {
  return (
    // preload="metadata": hanya data awal diunduh; video tidak diputar sampai pengguna menekan play.
    <video controls playsInline preload="metadata" poster={poster} aria-label={judul} className={`w-full bg-black object-contain ${className}`}>
      <source src={src} type="video/mp4" />
      Peramban Anda tidak mendukung pemutaran video.
    </video>
  );
}
