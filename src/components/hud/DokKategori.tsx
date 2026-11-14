import Link from "next/link";

/**
 * Dok tab kategori di halaman Resources (Mars, Moon, Deep Space). Berupa
 * navigasi antar halaman, jadi memakai tautan dengan aria-current (bukan role tab).
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
      className={`glass inline-flex w-full items-center justify-center gap-1 rounded-pill p-2 shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] md:w-auto ${className}`}
    >
      {items.map((item) => {
        const aktif = item.href === aktifHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={aktif ? "page" : undefined}
            className={[
              "flex min-h-11 flex-1 items-center justify-center rounded-pill px-5 py-2 transition-colors duration-150 md:flex-none md:px-8",
              aktif
                ? "text-nav-link-active bg-[#0067b2]/20 text-text-primary-normal"
                : "text-nav-link text-text-secondary-normal hover:text-text-primary-normal",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
