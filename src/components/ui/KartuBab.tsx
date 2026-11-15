import Link from "next/link";
import { Icon } from "./Icon";

/**
 * Kartu Bab (FIGMA_HANDOFF bagian 3): baris bab di halaman pengantar Story.
 * Properti `Nomor`, `Judul`, `Ringkasan`; ikon Panah Kanan 32 px. State Figma:
 * Default, Hover, Focus. Seluruh baris adalah satu tautan ke bab.
 */
type KartuBabProps = {
  nomor: string;
  judul: string;
  ringkasan: string;
  href: string;
  className?: string;
};

export function KartuBab({ nomor, judul, ringkasan, href, className = "" }: KartuBabProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-card bg-bg-secondary-normal p-5 ring-1 ring-inset ring-archive-slate-normal transition-shadow duration-150 hover:ring-aksen-informasi-dark md:gap-8 md:px-10 md:py-7 ${className}`}
    >
      <span
        aria-hidden="true"
        className="text-heading-card w-20 shrink-0 text-aksen-informasi-normal md:text-heading-section"
      >
        {nomor}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-heading-card text-text-primary-normal">
          <span className="sr-only">Bab {nomor}: </span>
          {judul}
        </span>
        <span className="text-body-large text-text-secondary-normal">{ringkasan}</span>
      </span>
      <Icon name="panah-kanan" size={32} className="shrink-0 text-aksen-informasi-normal" />
    </Link>
  );
}
