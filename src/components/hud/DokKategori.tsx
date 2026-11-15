"use client";

import { Button, useLang } from "@/components/ui";
import { HUD } from "@/lib/ui-copy";

/**
 * Dok Kategori halaman Resources (Mars, Moon, Deep Space): glass radius 28, padding 16/24,
 * tombol berjajar di tengah (Primary = aktif, Secondary = lainnya), lebar 700 di desktop
 * dan penuh di bawah itu. Berupa navigasi antar halaman, jadi memakai tautan dan aria-current.
 */
type DokKategoriProps = {
  items: { label: string; href: string }[];
  /** href item yang aktif. */
  aktifHref: string;
  className?: string;
};

export function DokKategori({ items, aktifHref, className = "" }: DokKategoriProps) {
  const h = HUD[useLang()];
  return (
    <nav
      aria-label={h.kategori}
      className={`flex w-full flex-wrap items-center justify-center gap-3 lg:w-auto ${className}`}
    >
      {items.map((item) => {
        const aktif = item.href === aktifHref;
        return (
          <Button
            key={item.href}
            href={item.href}
            variant={aktif ? "primary" : "secondary"}
            kecil
            kaca
            aria-current={aktif ? "page" : undefined}
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
