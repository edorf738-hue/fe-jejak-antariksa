"use client";

import { useEffect } from "react";

/**
 * Pemicu gerak reveal (padanan skrip reveal nakala.digital): menambah atribut `data-visible` pada
 * tiap elemen `[data-reveal]` begitu masuk layar (15% terlihat, margin bawah -8%), sekali saja.
 * Atribut, bukan kelas: React menimpa seluruh `class` saat `className` sebuah elemen berubah
 * (mis. KartuMisi saat dipilih), yang akan menghapus penanda dan menyembunyikan elemen lagi.
 * Satu observer di layout cukup untuk semua halaman: elemen yang muncul belakangan (pindah halaman,
 * filter Sumber) ditangkap lewat MutationObserver. Gerak dikurangi atau tanpa IntersectionObserver:
 * semua langsung ditampilkan. Tidak merender apa pun.
 */
const BELUM = "[data-reveal]:not([data-visible])";

export function RevealObserver() {
  useEffect(() => {
    const tampil = (el: Element) => el.setAttribute("data-visible", "");
    const hemat = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io =
      hemat || !("IntersectionObserver" in window)
        ? null
        : new IntersectionObserver(
            (entri) => {
              entri.forEach((e) => {
                // Terlihat, atau sudah terlewati di atas layar (mis. lompatan gulir): langsung tandai agar
                // tidak "meledak masuk" saat pengguna menggulir kembali.
                if (!e.isIntersecting && e.boundingClientRect.bottom >= 0) return;
                tampil(e.target);
                io?.unobserve(e.target);
              });
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
          );

    const pantau = (el: Element) => {
      if (io) io.observe(el);
      else tampil(el);
    };
    document.querySelectorAll(BELUM).forEach(pantau);

    const mo = new MutationObserver((daftar) => {
      daftar.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches(BELUM)) pantau(n);
          n.querySelectorAll(BELUM).forEach(pantau);
        }),
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, []);

  return null;
}
