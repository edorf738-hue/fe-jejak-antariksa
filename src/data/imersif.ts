import { getBab } from "./content";
import { getJourneyTujuan } from "./journey";
import { getKategori, KATEGORI_SLUGS } from "./content";
import { STORY_COPY } from "./story";
import type { Bab, BabId, DataBenda, Fakta, KategoriSlug, Misi, Sumber } from "./types";

/**
 * Data halaman imersif (Story Bab 1-4 dan Resources): scene 3D penuh layar dengan
 * HUD di atasnya. Scene 3D dipasang tim 3D (Edo, Zhafran); sementara latar berupa
 * gambar statis dari Figma. Teks HUD di bawah ini adalah copy dari Figma (draf).
 */
export const IMERSIF_COPY = {
  petunjuk: "Pilih titik pada benda untuk melihat datanya.",
  placeholderScene: "Placeholder · Scene 3D final: TBD",
  placeholderModel: { judul: "Pratinjau model 3D", status: "Model 3D: TBD" },
  dataBenda: "Data benda",
  tutup: "Tutup",
} as const;

/** Bab -> tujuan (kategori) yang scene dan datanya dipakai. Bab 1 belum punya aset 3D (memakai Moon untuk misi/sumber). */
const BAB_KATEGORI: Record<BabId, KategoriSlug> = {
  1: "moon",
  2: "moon",
  3: "mars",
  4: "deep-space",
};

/** Latar sementara per bab/kategori (gambar Figma; Bab 1 = gambar konsep, bukan render 3D). */
const GAMBAR_KATEGORI: Record<KategoriSlug, string> = {
  mars: "/images/home/kartu-mars.jpg",
  moon: "/images/home/kartu-moon.jpg",
  "deep-space": "/images/home/kartu-deep-space.jpg",
};

export type PanelData = {
  fakta: Fakta[];
  misi: (Misi | null)[];
  galeri: (string | null)[];
  sumber: Sumber[];
};

export type HalamanImersifData = {
  gambar: string;
  /** Scene 3D belum ada (Bab 1): tampilkan penanda placeholder. */
  scenePlaceholder: boolean;
  narasi: { eyebrow: string; judul: string; isi: string };
  benda: DataBenda[];
  panel: PanelData;
};

export function getBabImersif(id: number): (HalamanImersifData & { bab: Bab; labelBab: readonly string[] }) | undefined {
  const bab = getBab(id);
  if (!bab) return undefined;
  const slug = BAB_KATEGORI[bab.id];
  const tujuan = getJourneyTujuan(slug);
  return {
    bab,
    labelBab: STORY_COPY.labelBab,
    gambar: bab.id === 1 ? "/images/imersif/bab-1-bumi.webp" : GAMBAR_KATEGORI[slug],
    scenePlaceholder: bab.id === 1,
    narasi: { eyebrow: `BAB ${bab.id}`, judul: bab.judul, isi: bab.narasi },
    benda: bab.benda,
    panel: { fakta: tujuan.kategori.fakta, misi: tujuan.misi, galeri: tujuan.kategori.galeri, sumber: tujuan.sumber },
  };
}

export function getResourcesImersif(slug: KategoriSlug): HalamanImersifData & {
  nama: string;
  dok: { label: string; href: string }[];
} {
  const tujuan = getJourneyTujuan(slug);
  const k = tujuan.kategori;
  return {
    nama: k.nama,
    gambar: GAMBAR_KATEGORI[slug],
    scenePlaceholder: false,
    narasi: { eyebrow: "RESOURCES", judul: k.nama, isi: k.ringkasan },
    benda: k.bab.benda,
    panel: { fakta: k.fakta, misi: tujuan.misi, galeri: k.galeri, sumber: tujuan.sumber },
    dok: KATEGORI_SLUGS.map((s) => ({ label: getKategori(s).nama, href: `/resources/${s}` })),
  };
}
