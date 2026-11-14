import { getKategori, KATEGORI_SLUGS } from "./content";
import type { KategoriSlug } from "./types";

/**
 * Teks dan tautan halaman Beranda (copy dari Figma, frame Home). Bagian ini
 * masih DRAF: headline "Ditinggal Bukan Berarti Dilupakan" adalah kandidat copy
 * (UI_UX_GUIDELINE bagian 4) dan semua teks menunggu persetujuan (keputusan #5).
 * Fakta ilmiah tidak ditulis di sini: nama kategori diambil dari content-data.json.
 */
export const HOME_COPY = {
  hero: {
    eyebrow: "Kisah wahana NASA yang masih berbicara",
    /** Dua baris di desktop; mengalir menjadi satu paragraf di tablet dan mobile. */
    headline: ["Ditinggal bukan", "berarti dilupakan"],
    deskripsi:
      "Telusuri perjalanan wahana antariksa lewat cerita, peta misi, dan lingkungan 3D.",
    ctaUtama: { label: "Mulai Jelajah", href: "/story" },
    ctaSekunder: { label: "Lihat Peta Perjalanan", href: "/journey-map" },
  },
  pengantar: {
    judul: "Menjelajah Lewat Cerita dan 3D",
    isi: "Setiap cerita, misi, dan lingkungan di sini bersumber dari NASA dan sumber primer yang relevan.",
  },
  lingkungan: {
    judul: "Pilih Lingkungan",
    subjudul: "Mars, Moon, dan Deep Space dalam tiga lingkungan 3D.",
    tautan: "Jelajahi",
  },
} as const;

/** Gambar kartu per kategori (diambil dari Figma, 1920x1080). */
const GAMBAR_KARTU: Record<KategoriSlug, string> = {
  mars: "/images/home/kartu-mars.jpg",
  moon: "/images/home/kartu-moon.jpg",
  "deep-space": "/images/home/kartu-deep-space.jpg",
};

export type KartuLingkunganData = {
  slug: KategoriSlug;
  judul: string;
  deskripsi: string;
  gambar: string;
  /** Halaman Resources imersif (dikerjakan di PR terpisah). */
  href: string;
};

export function getKartuLingkungan(): KartuLingkunganData[] {
  return KATEGORI_SLUGS.map((slug) => {
    const { nama } = getKategori(slug);
    return {
      slug,
      judul: nama,
      deskripsi: `Jelajahi lingkungan 3D ${nama}.`,
      gambar: GAMBAR_KARTU[slug],
      href: `/resources/${slug}`,
    };
  });
}
