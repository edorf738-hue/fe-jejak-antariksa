import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";

/**
 * Kartu Lingkungan (FIGMA_HANDOFF bagian 3): `Judul`, `Deskripsi`, `Tautan`,
 * gambar. Seluruh kartu adalah satu tautan ke halaman Resources. State Figma:
 * Default, Hover, Selected, Focus (Selected belum dipakai di Beranda).
 * Gaya kaca gelap (navy 65% + blur 12 px + garis putih tipis; hover: naik, garis cyan). Radius 24, gambar 240 px, konten padding 24/28/28 dengan gap 12.
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
      className={`group relative flex flex-col overflow-hidden rounded-card border border-white/10 bg-[rgba(15,23,42,0.65)] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[12px] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan-400/60 hover:bg-[rgba(15,23,42,0.5)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.45),0_0_28px_rgba(34,211,238,0.14)] focus-visible:-translate-y-1.5 focus-visible:border-cyan-400/60 focus-visible:outline-offset-4 ${className}`}
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
      <div className="flex flex-col items-start gap-3 pb-7 pl-7 pr-6 pt-6">
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
