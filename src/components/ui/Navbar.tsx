"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { Container } from "./Container";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

/**
 * Navbar (desktop, 1268x80, kaca tipis (blur) dengan garis tipis, tautan 16 px; logo di kiri, tautan mulai dari
 * garis tengah navbar seperti di Figma pada lebar >= 1280, rata kanan di 1024-1279) dan Navbar Ringkas (tablet/mobile,
 * varian Menu Tertutup/Terbuka). Satu komponen: daftar tautan dirender sekali dan
 * berubah menjadi menu turun di bawah breakpoint `lg` (1024).
 *
 * Resources tidak ada di navbar; saat di Resources, "Beranda" ditandai aktif
 * (usulan di FIGMA_HANDOFF bagian 7), karena itu `Beranda` punya `alsoActiveOn`.
 *
 * Posisi `absolute` (ikut menggulir bersama halaman), sesuai Figma: navbar berada
 * di atas hero, bukan menempel di layar. Halaman dengan hero menariknya ke atas
 * dengan margin negatif sebesar --navbar-offset.
 */
export const NAV_ITEMS = [
  { label: "Beranda", href: "/", alsoActiveOn: ["/resources"] },
  { label: "Cerita", href: "/story", alsoActiveOn: ["/cerita"] },
  { label: "Peta Perjalanan", href: "/journey-map" },
  { label: "Sumber", href: "/source" },
] as const;

type NavItem = {
  label: string;
  href: string;
  alsoActiveOn?: readonly string[];
};

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

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      setOpenedOn(null);
      toggleRef.current?.focus();
    }
  }

  return (
    <header
      onKeyDown={onKeyDown}
      className="absolute inset-x-0 top-0 z-50 pt-6 lg:pt-[57px]"
    >
      <Container>
        <div className="relative">
          {/* Pill: efek Glass Figma (fill putih 0%): blur 4, bayangan dalam, dan cincin cahaya di tepi (utility `kaca-tepi`). */}
          <div
            aria-hidden="true"
            className="kaca-tepi absolute inset-0 rounded-pill shadow-[inset_0_0_24px_rgba(8,11,18,0.5)]"
          />
          <div className="relative flex h-[72px] items-center justify-between gap-4 px-4 lg:grid lg:h-[80px] lg:grid-cols-[auto_1fr] lg:gap-0 lg:px-8 xl:grid-cols-2">
            <Logo className="xl:ml-[142px] xl:justify-self-start" />

            <nav
              id="navigasi-utama"
              aria-label="Navigasi utama"
              className={[
                open ? "block" : "hidden",
                // Menu turun (tablet/mobile)
                "absolute inset-x-0 top-full mt-3 rounded-card bg-bg-secondary-normal/90 p-3",
                "shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] backdrop-blur-[24px]",
                // Baris tautan (desktop)
                "lg:static lg:mt-0 lg:block lg:justify-self-end xl:-ml-[13px] xl:justify-self-start lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
              ].join(" ")}
            >
              <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-[14px]">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item, pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "relative flex min-h-11 items-center lg:min-h-10 lg:text-[16px] whitespace-nowrap rounded-pill px-[13px] transition-colors duration-150 max-lg:px-5",
                          // Fill pill aktif: #0067b2 @ 20% + efek Glass Figma (belum menjadi token di Figma).
                          active
                            ? "kaca-tepi text-nav-link-active bg-[#0067b2]/20 text-text-primary-normal shadow-[inset_0_0_10px_rgba(8,11,18,0.45)] [--rim:linear-gradient(135deg,rgba(255,255,255,0.5),rgba(140,190,255,0.14)_50%,rgba(255,255,255,0.45))]"
                            : "text-nav-link text-text-primary-normal hover:bg-white/10",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
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
