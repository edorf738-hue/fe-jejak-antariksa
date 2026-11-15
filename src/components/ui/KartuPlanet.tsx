import Link from "next/link";
import { Icon } from "./Icon";
import { PlanetCanvas, type JenisPlanet } from "./PlanetCanvas";
import { reveal } from "./reveal";

/**
 * Planet beranimasi sebagai pintu ke lingkungan 3D (menggantikan Kartu Lingkungan di Beranda):
 * bola 3D yang berputar (`PlanetCanvas`), nama, satu kalimat ringkasan dari content-data.json, dan
 * ikon panah. Seluruh blok adalah satu tautan ke halaman Resources. Hover/fokus: planet membesar
 * sedikit, berputar lebih cepat, pendarnya menguat, dan panah bergeser.
 */
type KartuPlanetProps = {
  jenis: JenisPlanet;
  judul: string;
  ringkasan: string;
  /** Teks khusus pembaca layar (mis. "Explore the Mars 3D environment."). */
  deskripsi: string;
  href: string;
  /** Bila diisi (ms), muncul saat masuk layar dengan jeda ini (lihat reveal.ts). */
  delay?: number;
  className?: string;
};

export function KartuPlanet({ jenis, judul, ringkasan, deskripsi, href, delay, className = "" }: KartuPlanetProps) {
  return (
    <Link
      href={href}
      {...(delay === undefined ? {} : reveal(delay))}
      className={`group flex w-full flex-col items-center text-center focus-visible:outline-offset-8 ${className}`}
    >
      {/* Kanvas persegi punya ruang kosong untuk pendar dan cincin; margin negatif merapatkannya ke teks. */}
      <div className="-mb-6 -mt-6 w-full max-w-[380px] transition-transform duration-500 ease-(--ease-out-soft) group-hover:scale-[1.05] group-focus-visible:scale-[1.05] md:-mb-10 md:-mt-10">
        <PlanetCanvas jenis={jenis} />
      </div>
      <h3 className="text-heading-card text-text-primary-normal">{judul}</h3>
      <p className="text-body-large mt-3 max-w-[300px] text-text-secondary-normal [text-shadow:0_1px_14px_rgba(8,11,18,0.95),0_0_2px_rgba(8,11,18,0.9)]">
        {ringkasan}
      </p>
      <span
        aria-hidden="true"
        className="mt-5 inline-flex size-11 items-center justify-center rounded-full text-text-primary-normal ring-1 ring-inset ring-text-secondary-normal transition-[background-color,color,box-shadow,translate] duration-300 ease-(--ease-out-soft) group-hover:translate-x-1 group-hover:bg-aksen-informasi-normal group-hover:text-bg-primary-normal group-hover:ring-aksen-informasi-normal group-focus-visible:bg-aksen-informasi-normal group-focus-visible:text-bg-primary-normal"
      >
        <Icon name="panah-kanan" size={20} />
      </span>
      <span className="sr-only">{deskripsi}</span>
    </Link>
  );
}
