import { getDaftarBab } from "./content";

/** Teks halaman Cerita (Pengantar), dari Figma frame `Story — Pengantar`. Draf. */
export const STORY_COPY = {
  header: {
    eyebrow: "Cerita",
    judul: "Empat bab eksplorasi",
    deskripsi: "Ikuti kisah eksplorasi bab demi bab.",
  },
  daftar: { judul: "Daftar Bab", ctaMulai: "Mulai dari Bab 1" },
} as const;

export type BabRingkas = { nomor: string; judul: string; ringkasan: string; href: string };

/** Daftar bab untuk Kartu Bab: nomor dua digit, judul, dan ringkasan dari content-data.json. */
export function getDaftarBabRingkas(): BabRingkas[] {
  return getDaftarBab().map((b) => ({
    nomor: String(b.id).padStart(2, "0"),
    judul: b.judul,
    ringkasan: b.ringkasan,
    href: `/story/${b.id}`,
  }));
}
