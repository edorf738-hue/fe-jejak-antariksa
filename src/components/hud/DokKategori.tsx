import { Button } from "@/components/ui";

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
  return (
    <nav
      aria-label="Kategori"
      className={`flex w-full flex-wrap items-center justify-center gap-3 lg:w-auto ${className}`}
    >
      {items.map((item) => {
        const aktif = item.href === aktifHref;
        return (
          <Button
            key={item.href}
            href={item.href}
            variant={aktif ? "primary" : "secondary"}
            glass={!aktif}
            aria-current={aktif ? "page" : undefined}
          >
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
}
