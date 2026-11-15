import { DEFAULT_LANG, type Lang } from "../lib/i18n";
import { DATA_EN } from "./cerita.en";
import { CERITA_API } from "./api";
import { getBab } from "./content";
import type { BabId } from "./types";

/**
 * Halaman detail Cerita (/cerita/[slug]): satu halaman editorial per bab. Semua teks disusun dari catatan sumber di
 * NASA/NASA History (Apollo11_Sejarah_Awal_NASA, Apollo11_Informasi_Utama_Misi, Apollo11_Kronologi_Misi, 03_Spirit_Opportunity,
 * 04_Artefak). Bahasa Indonesia dibaca dari snapshot API (./api); English di cerita.en.ts. Tidak ada fakta baru: yang tidak ada di sumber tidak ditulis (mis. alur
 * "perlombaan antariksa" belum ada di sumber, jadi Bab 1 hanya memuat sejarah NASA dan jalan menuju Apollo 11).
 * Foto dan video berasal dari NASA/NASA Assets (versi web di /public).
 */
export type CeritaSlug = "awal-eksplorasi" | "eksplorasi-bulan" | "eksplorasi-mars" | "deep-space";

export type Foto = { src: string; keterangan: string; kredit: string };
export type Bagian = { waktu: string; judul: string; isi: string; foto?: Foto };
export type VideoCerita = { src: string; poster: string; judul: string; keterangan: string };
export type Artefak = { nama: string; status: string; deskripsi: string; foto?: Foto; model: string };
export type SumberCerita = { judul: string; url: string };

export type CeritaBab = {
  slug: CeritaSlug;
  babId: BabId;
  nomor: string;
  judul: string;
  ringkasan: string;
  hero: Foto;
  /** Kalimat pembuka hero (lebih panjang dari ringkasan kartu). */
  pengantar: string;
  bagian: Bagian[];
  galeri: Foto[];
  video: VideoCerita[];
  /** Fakta singkat (dengan sumbernya). */
  fakta: { isi: string; sumber: string }[];
  artefak: Artefak[];
  /** Tujuan eksplorasi 3D; null = bab ini belum punya scene 3D. */
  tiga3d: { label: string; href: string; deskripsi: string } | null;
  sumber: SumberCerita[];
};

export const CERITA_SLUGS: CeritaSlug[] = ["awal-eksplorasi", "eksplorasi-bulan", "eksplorasi-mars", "deep-space"];
export const SLUG_BAB: Record<BabId, CeritaSlug> = { 1: "awal-eksplorasi", 2: "eksplorasi-bulan", 3: "eksplorasi-mars", 4: "deep-space" };

export function isCeritaSlug(s: string): s is CeritaSlug {
  return (CERITA_SLUGS as string[]).includes(s);
}

export function getCerita(slug: CeritaSlug, lang: Lang = DEFAULT_LANG): CeritaBab {
  // Bahasa Indonesia: snapshot API backend; English: terjemahan di cerita.en.ts.
  if (lang === "id") return CERITA_API.find((c) => c.slug === slug) as CeritaBab;
  const babId = (CERITA_SLUGS.indexOf(slug) + 1) as BabId;
  const bab = getBab(babId, lang);
  return {
    slug,
    babId,
    nomor: String(babId).padStart(2, "0"),
    judul: bab?.judul ?? "",
    ringkasan: bab?.ringkasan ?? "",
    ...DATA_EN[slug],
  };
}
