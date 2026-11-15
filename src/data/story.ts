import { getDaftarBab } from "./content";
import { SLUG_BAB } from "./cerita";

/** Teks halaman Cerita (Pengantar), dari Figma frame `Story — Pengantar`. Draf. */
export const STORY_COPY = {
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

export type BabRingkas = { nomor: string; judul: string; ringkasan: string; href: string };

/** Daftar bab untuk Kartu Bab: nomor dua digit, judul, dan ringkasan dari content-data.json. */
export function getDaftarBabRingkas(): BabRingkas[] {
  return getDaftarBab().map((b) => ({
    nomor: String(b.id).padStart(2, "0"),
    judul: b.judul,
    ringkasan: b.ringkasan,
    href: `/cerita/${SLUG_BAB[b.id]}`,
  }));
}
