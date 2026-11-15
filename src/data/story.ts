import { DEFAULT_LANG, type Lang, type Widen } from "../lib/i18n";
import { getDaftarBab } from "./content";
import { SLUG_BAB } from "./cerita";

/** Teks halaman Cerita (Pengantar), dari Figma frame `Story — Pengantar`, per bahasa. Draf. */
const ID = {
  header: {
    eyebrow: "Cerita",
    judul: "Empat bab eksplorasi",
    deskripsi: "Perjalanan manusia melampaui batas Bumi, meninggalkan jejak yang masih bercerita hingga hari ini.",
    cta: "Mulai Perjalanan",
  },
  /** Pengantar singkat setelah hero. Hanya merangkum empat bab; tidak memuat fakta baru. */
  pembuka: {
    eyebrow: "Sebelum mulai",
    judul: "Jejak yang ditinggalkan, kisah yang berlanjut",
    isi: "Empat bab ini mengikuti kisah wahana NASA: dari berdirinya NASA, pendaratan manusia di Bulan, dua rover di Mars, hingga Voyager di ruang antarbintang. Tiap bab membuka lingkungan 3D yang bisa kamu jelajahi sendiri.",
    foto: "/images/galeri/moon-view-moon.webp",
    keterangan: "Apollo 11: pemandangan Bulan. Kredit: NASA.",
  },
  daftar: { judul: "Empat bab perjalanan", ctaMulai: "Mulai dari Bab 1" },
  /** Label singkat di Navigasi Bab (stepper), dari Figma `Navigasi Bab`. */
  labelBab: ["Awal", "Bulan", "Mars", "Deep Space"],
} as const;

const EN: Widen<typeof ID> = {
  header: {
    eyebrow: "Story",
    judul: "Four chapters of exploration",
    deskripsi: "Humanity's journey beyond Earth, leaving traces that still tell their stories today.",
    cta: "Begin the Journey",
  },
  pembuka: {
    eyebrow: "Before you begin",
    judul: "Traces left behind, stories that continue",
    isi: "These four chapters follow the story of NASA's spacecraft: from the founding of NASA, the first human landing on the Moon, and two rovers on Mars, to the Voyagers in interstellar space. Each chapter opens a 3D environment you can explore yourself.",
    foto: "/images/galeri/moon-view-moon.webp",
    keterangan: "Apollo 11: a view of the Moon. Credit: NASA.",
  },
  daftar: { judul: "Four chapters of the journey", ctaMulai: "Start from Chapter 1" },
  labelBab: ["Beginning", "Moon", "Mars", "Deep Space"],
};

export const STORY_COPY: Record<Lang, Widen<typeof ID>> = { id: ID, en: EN };

export type BabRingkas = { nomor: string; judul: string; ringkasan: string; href: string };

/** Daftar bab untuk Kartu Bab: nomor dua digit, judul, dan ringkasan dari content-data.json. */
export function getDaftarBabRingkas(lang: Lang = DEFAULT_LANG): BabRingkas[] {
  return getDaftarBab(lang).map((b) => ({
    nomor: String(b.id).padStart(2, "0"),
    judul: b.judul,
    ringkasan: b.ringkasan,
    href: `/cerita/${SLUG_BAB[b.id]}`,
  }));
}
