import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";

/**
 * Kartu Lingkungan (FIGMA_HANDOFF bagian 3): `Judul`, `Deskripsi`, `Tautan`,
 * gambar. Seluruh kartu adalah satu tautan ke halaman Resources. State Figma:
 * Default, Hover, Selected, Focus (Selected belum dipakai di Beranda).
 * Radius 24, gambar 240 px, konten padding 24/28/28 dengan gap 12.
 */
type KartuLingkunganProps = {
  judul: string;
  deskripsi: string;
  /** Teks tautan, mis. "Jelajahi". */
  tautan: string;
  href: string;
  gambar: string;
  /** Prioritaskan gambar (untuk kartu di atas lipatan). */
  priority?: boolean;
  className?: string;
};

export function KartuLingkungan({
  judul,
  deskripsi,
  tautan,
  href,
  gambar,
  priority = false,
  className = "",
}: KartuLingkunganProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-card border border-archive-slate-normal bg-bg-secondary-normal transition-colors duration-150 hover:border-aksen-informasi-dark focus-visible:outline-offset-4 ${className}`}
    >
      <div className="relative h-60 w-full shrink-0">
        <Image
          src={gambar}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 404px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col items-start gap-3 px-7 pb-7 pt-6">
        <h3 className="text-heading-card text-text-primary-normal">{judul}</h3>
        <p className="text-body-large text-text-secondary-normal">{deskripsi}</p>
        <span className="text-button-label inline-flex items-center gap-2 text-aksen-informasi-normal">
          {tautan}
          <Icon name="panah-kanan" size={20} />
        </span>
      </div>
    </Link>
  );
}
