import { DEFAULT_LANG, type Lang, type Widen } from "../lib/i18n";
import { getKategori, KATEGORI_SLUGS } from "./content";
import type { KategoriSlug } from "./types";

/**
 * Teks dan tautan halaman Beranda (copy dari Figma, frame Home), per bahasa. Bagian ini
 * masih DRAF: headline adalah kandidat copy (UI_UX_GUIDELINE bagian 4).
 * Fakta ilmiah tidak ditulis di sini: nama kategori diambil dari content-data.json.
 */
const ID = {
  hero: {
    eyebrow: "Kisah wahana NASA yang masih berbicara",
    /** Dua baris di desktop; mengalir menjadi satu paragraf di tablet dan mobile. */
    headline: ["Ditinggal bukan", "berarti dilupakan"],
    deskripsi: "Telusuri perjalanan wahana antariksa lewat cerita, peta misi, dan lingkungan 3D.",
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

const EN: Widen<typeof ID> = {
  hero: {
    eyebrow: "The stories of NASA spacecraft that still speak",
    headline: ["Left behind,", "never forgotten"],
    deskripsi: "Trace the journeys of spacecraft through stories, a mission map, and 3D environments.",
    ctaUtama: { label: "Start Exploring", href: "/story" },
    ctaSekunder: { label: "View Journey Map", href: "/journey-map" },
  },
  pengantar: {
    judul: "Explore Through Stories and 3D",
    isi: "Every story, mission, and environment here comes from NASA and relevant primary sources.",
  },
  lingkungan: {
    judul: "Choose an Environment",
    subjudul: "Mars, the Moon, and Deep Space in three 3D environments.",
    tautan: "Explore",
  },
};

export const HOME_COPY: Record<Lang, Widen<typeof ID>> = { id: ID, en: EN };

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
  /** Satu kalimat ringkasan dari content-data.json (`resources.<kategori>.ringkasan`). */
  ringkasan: string;
  gambar: string;
  /** Halaman Resources imersif (dikerjakan di PR terpisah). */
  href: string;
};

export function getKartuLingkungan(lang: Lang = DEFAULT_LANG): KartuLingkunganData[] {
  return KATEGORI_SLUGS.map((slug) => {
    const { nama, ringkasan } = getKategori(slug, lang);
    return {
      slug,
      judul: nama,
      deskripsi: lang === "en" ? `Explore the ${nama} 3D environment.` : `Jelajahi lingkungan 3D ${nama}.`,
      ringkasan,
      gambar: GAMBAR_KARTU[slug],
      href: `/resources/${slug}`,
    };
  });
}
