"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Container } from "./Container";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";
import { useJellyNav } from "./useJellyNav";

/**
 * Navbar (desktop, 1268x80, kaca tipis (blur) dengan garis tipis, tautan 16 px; logo di kiri, tautan mulai dari
 * garis tengah navbar seperti di Figma pada lebar >= 1280, rata kanan di 1024-1279) dan Navbar Ringkas (tablet/mobile,
 * varian Menu Tertutup/Terbuka). Satu komponen: daftar tautan dirender sekali dan
 * berubah menjadi menu turun di bawah breakpoint `lg` (1024).
 *
 * Resources tidak ada di navbar; saat di Resources, "Beranda" ditandai aktif
 * (usulan di FIGMA_HANDOFF bagian 7), karena itu `Beranda` punya `alsoActiveOn`.
 *
 * Posisi `fixed`: navbar tetap terlihat di atas layar saat halaman digulir (permintaan Zhafran;
 * Figma hanya punya frame statis). Di puncak halaman posisinya sama dengan Figma (57 px dari atas
 * di desktop, di atas hero). Setelah digulir, navbar naik mendekati tepi atas dan pill-nya tetap
 * bening (tanpa fill gelap), hanya blur kacanya yang naik. Karena `fixed` tidak ikut
 * alur, tata letak halaman tidak berubah; halaman dengan hero tetap menariknya ke atas dengan
 * margin negatif sebesar --navbar-offset.
 */
export const NAV_ITEMS = [
  { label: "Beranda", href: "/", alsoActiveOn: ["/resources"] },
  { label: "Cerita", href: "/story" },
  { label: "Peta Perjalanan", href: "/journey-map" },
  { label: "Sumber", href: "/source" },
] as const;

type NavItem = {
  label: string;
  href: string;
  alsoActiveOn?: readonly string[];
};

/** True bila halaman sudah digulir lebih dari beberapa piksel (hanya berubah di ambang, jadi jarang render ulang). */
function useDigulir() {
  return useSyncExternalStore(
    (ubah) => {
      window.addEventListener("scroll", ubah, { passive: true });
      return () => window.removeEventListener("scroll", ubah);
    },
    () => window.scrollY > 8,
    () => false,
  );
}

function isActive(item: NavItem, pathname: string) {
  const matches = (base: string) =>
    base === "/" ? pathname === "/" : pathname === base || pathname.startsWith(`${base}/`);
  return matches(item.href) || (item.alsoActiveOn?.some(matches) ?? false);
}

export function Navbar() {
  const pathname = usePathname();
  // Menyimpan path saat menu dibuka: menu otomatis tertutup begitu halaman berganti.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Item aktif (-1 bila halaman tidak punya tautan di navbar) dan efek jelly saat berpindah (desktop).
  const aktifIdx = NAV_ITEMS.findIndex((item) => isActive(item, pathname));
  const jelly = useJellyNav(NAV_ITEMS.length, aktifIdx);
  const digulir = useDigulir();

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      setOpenedOn(null);
      toggleRef.current?.focus();
    }
  }

  return (
    // Header penuh lebar tidak menangkap klik (agar konten di bawah celah atasnya tetap bisa diklik);
    // hanya pill di dalamnya yang menerima klik. Padding atas mengecil saat digulir.
    <header
      onKeyDown={onKeyDown}
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-[padding] duration-300 ${
        digulir ? "pt-3 lg:pt-4" : "pt-6 lg:pt-[57px]"
      }`}
    >
      <Container>
        <div className="pointer-events-auto relative">
          {/* Pill: efek Glass Figma (fill putih 0%): blur 4, bayangan dalam, dan cincin cahaya di tepi (utility `kaca-tepi`).
              Saat digulir tetap bening (tanpa fill gelap); hanya blur-nya naik ke 16 agar teks tetap terbaca di atas konten. */}
          <div
            aria-hidden="true"
            className={`kaca-tepi absolute inset-0 rounded-pill shadow-[inset_0_0_24px_rgba(8,11,18,0.5)] ${
              digulir ? "[--kaca-blur:16px]" : ""
            }`}
          />
          <div className="relative flex h-[72px] items-center justify-between gap-4 px-4 lg:grid lg:h-[80px] lg:grid-cols-[auto_1fr] lg:gap-0 lg:px-8 xl:grid-cols-2">
            <Logo className="xl:ml-[142px] xl:justify-self-start" />

            <nav
              id="navigasi-utama"
              aria-label="Navigasi utama"
              className={[
                open ? "block" : "hidden",
                // Menu turun (tablet/mobile): kaca yang sama dengan pill. Penyimpangan sementara dari Figma
                // (komponen 91:97 belum didesain ulang); `max-lg:` agar cincin kaca tidak ikut ke desktop.
                // Fill gelap 80% menjaga kontras teks di atas hero (tanpa fill, teks hero tembus ke tautan).
                "absolute inset-x-0 top-full mt-3 rounded-card p-3 max-lg:bg-bg-primary-normal/80 max-lg:kaca-tepi max-lg:shadow-[inset_0_0_24px_rgba(8,11,18,0.5)]",
                // Baris tautan (desktop)
                "lg:static lg:mt-0 lg:block lg:justify-self-end xl:-ml-[13px] xl:justify-self-start lg:rounded-none lg:p-0",
              ].join(" ")}
            >
              <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-[14px]">
                {NAV_ITEMS.map((item, i) => {
                  const active = i === aktifIdx;
                  return (
                    // Tiga lapisan bersarang membawa transformasi jelly (geser X, skala X, skala Y) dari useJellyNav.
                    <li
                      key={item.href}
                      ref={jelly.x(i)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && jelly.hover(i)}
                      onPointerLeave={jelly.keluar}
                    >
                      <div ref={jelly.sx(i)}>
                        <div ref={jelly.sy(i)}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={[
                              "group relative flex min-h-11 items-center lg:min-h-10 lg:text-[16px] whitespace-nowrap rounded-pill px-[13px] transition-colors duration-150 max-lg:px-5 text-text-primary-normal",
                              active ? "text-nav-link-active" : "text-nav-link hover:bg-white/10",
                            ].join(" ")}
                          >
                            {/* Pil aktif: fill #0067b2 @ 20% + efek Glass Figma (belum menjadi token di Figma). Lapisan
                                terpisah yang memudar masuk/keluar, supaya perpindahan tautan terasa halus bersama jelly. */}
                            <span
                              aria-hidden="true"
                              className="kaca-tepi pointer-events-none absolute inset-0 rounded-pill bg-[#0067b2]/20 opacity-0 shadow-[inset_0_0_10px_rgba(8,11,18,0.45)] transition-opacity duration-200 [--rim:linear-gradient(135deg,rgba(255,255,255,0.5),rgba(140,190,255,0.14)_50%,rgba(255,255,255,0.45))] group-aria-[current=page]:opacity-100"
                            />
                            <span className="relative">{item.label}</span>
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <IconButton
              ref={toggleRef}
              icon={open ? "tutup" : "menu"}
              label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              aria-controls="navigasi-utama"
              onClick={() => setOpenedOn(open ? null : pathname)}
              tone="outline"
              className="lg:hidden"
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
