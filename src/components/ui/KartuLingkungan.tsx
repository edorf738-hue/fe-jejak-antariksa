import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icon";
import { reveal } from "./reveal";

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
  /** Bila diisi (ms), kartu muncul saat masuk layar dengan jeda ini (lihat reveal.ts). */
  delay?: number;
  className?: string;
};

export function KartuLingkungan({
  judul,
  deskripsi,
  tautan,
  href,
  gambar,
  priority = false,
  delay,
  className = "",
}: KartuLingkunganProps) {
  return (
    <Link
      href={href}
      {...(delay === undefined ? {} : reveal(delay))}
      // Hover: kartu naik 4 px (transisi 300 ms), seperti kartu di nakala.digital.
      className={`group relative flex flex-col overflow-hidden rounded-card bg-bg-secondary-normal transition-transform duration-300 ease-(--ease-out-soft) hover:-translate-y-1 after:pointer-events-none after:absolute after:inset-0 after:rounded-card after:ring-1 after:ring-inset after:ring-archive-slate-normal after:transition-shadow after:duration-150 after:content-[''] hover:after:ring-aksen-informasi-dark focus-visible:outline-offset-4 ${className}`}
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
