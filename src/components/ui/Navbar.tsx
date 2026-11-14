"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { Container } from "./Container";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

/**
 * Navbar (desktop, 1268x100, efek glass) dan Navbar Ringkas (tablet/mobile,
 * varian Menu Tertutup/Terbuka). Satu komponen: daftar tautan dirender sekali dan
 * berubah menjadi menu turun di bawah breakpoint `lg` (1024).
 *
 * Resources tidak ada di navbar; saat di Resources, "Beranda" ditandai aktif
 * (usulan di FIGMA_HANDOFF bagian 7), karena itu `Beranda` punya `alsoActiveOn`.
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
      className="fixed inset-x-0 top-0 z-50 pt-4 md:pt-6 lg:pt-10"
    >
      <Container>
        <div className="relative">
          {/* Lapisan kaca dipisah dari konten agar menu turun bisa punya blur sendiri. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-pill bg-bg-secondary-normal/70 shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] backdrop-blur-[24px]"
          />
          <div className="relative flex h-16 items-center justify-between gap-4 px-3 lg:h-[100px] lg:px-8">
            <Logo />

            <nav
              id="navigasi-utama"
              aria-label="Navigasi utama"
              className={[
                open ? "block" : "hidden",
                // Menu turun (tablet/mobile)
                "absolute inset-x-0 top-full mt-3 rounded-card bg-bg-secondary-normal/90 p-3",
                "shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] backdrop-blur-[24px]",
                // Baris tautan (desktop)
                "lg:static lg:mt-0 lg:block lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
              ].join(" ")}
            >
              <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item, pathname);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "flex min-h-11 items-center rounded-pill px-6 py-2 transition-colors duration-150",
                          // Fill pill aktif: #0067b2 @ 20% (belum menjadi token di Figma).
                          active
                            ? "text-nav-link-active bg-[#0067b2]/20 text-text-primary-normal"
                            : "text-nav-link text-text-secondary-normal hover:text-text-primary-normal",
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
              className="lg:hidden"
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
