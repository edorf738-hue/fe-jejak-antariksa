import { bendaBab } from "./api";
import { BENDA_TAMBAHAN_EN } from "./benda-tambahan";
import { getBab } from "./content";
import { getJourneyTujuan } from "./journey";
import { getKategori, KATEGORI_SLUGS } from "./content";
import { STORY_COPY } from "./story";
import { DEFAULT_LANG, type Lang, type Widen } from "../lib/i18n";
import type { Bab, BabId, DataBenda, Fakta, KategoriSlug, Misi, Sumber } from "./types";

/**
 * Data halaman imersif (Story Bab 1-4 dan Resources): scene 3D penuh layar dengan
 * HUD di atasnya. Scene 3D dipasang tim 3D (Edo, Zhafran); sementara latar berupa
 * gambar statis dari Figma. Teks HUD di bawah ini adalah copy dari Figma (draf).
 */
const COPY_ID = {
  petunjuk: "Seret atau geser dua jari untuk melihat ke segala arah, pilih titik untuk melihat datanya.",
  placeholderScene: "Placeholder · Scene 3D final: TBD",
  placeholderModel: { judul: "Pratinjau model 3D", status: "Model 3D: TBD" },
  dataBenda: "Data benda",
  tutup: "Tutup",
} as const;

const COPY_EN: Widen<typeof COPY_ID> = {
  petunjuk: "Drag or swipe with two fingers to look in every direction, and choose a point to see its data.",
  placeholderScene: "Placeholder · Final 3D scene: TBD",
  placeholderModel: { judul: "3D model preview", status: "3D model: TBD" },
  dataBenda: "Object data",
  tutup: "Close",
};

export const IMERSIF_COPY: Record<Lang, Widen<typeof COPY_ID>> = { id: COPY_ID, en: COPY_EN };

/** Bab -> tujuan (kategori) yang scene dan datanya dipakai. Bab 1 (Bumi dari orbit saat matahari terbit) belum punya aset 3D dan data panelnya sendiri: narasi, hotspot, dan data benda sudah dari content-data.json (`bab`), sedangkan fakta/misi/sumber/galeri panel sementara memakai Moon. TBD: menunggu tim konten (Dhika). */
const BAB_KATEGORI: Record<BabId, KategoriSlug> = {
  1: "moon",
  2: "moon",
  3: "mars",
  4: "deep-space",
};

/** Latar sementara per bab/kategori (gambar Figma; Bab 1 = gambar konsep, bukan render 3D). */
export const GAMBAR_KATEGORI: Record<KategoriSlug, string> = {
  mars: "/images/home/kartu-mars.jpg",
  moon: "/images/home/kartu-moon.jpg",
  "deep-space": "/images/home/kartu-deep-space.jpg",
};

type Xy = readonly [number, number];

/**
 * Posisi Titik Info (Titik 1, 2, 3) dalam piksel dari kiri-atas frame Figma: `m` = mobile
 * 390x844, `t` = tablet 768x1024, `d` = desktop 1440x900. Hanya ilustrasi; posisi asli menunggu
 * proyeksi 3D (HotspotLayer). HalamanImersif mengubahnya menjadi persen dari layar.
 */
export type PosisiTitik = { m: readonly Xy[]; t: readonly Xy[]; d: readonly Xy[] };

const TITIK_MOBILE_RESOURCES: readonly Xy[] = [[173, 293], [109, 323], [237, 337]];
const TITIK_TABLET_RESOURCES: readonly Xy[] = [[262, 313], [159, 471], [365, 539]];

const TITIK_STORY: Record<BabId, PosisiTitik> = {
  1: { m: [[143, 337], [87, 282], [237, 330]], t: [[428, 413], [159, 434], [365, 494]], d: [[1032, 246], [948, 654], [324, 641]] },
  2: { m: [[308, 342], [109, 304], [237, 330]], t: [[485, 449], [215, 434], [498, 522]], d: [[1020, 246], [298, 626], [984, 629]] },
  3: { m: [[173, 242], [109, 304], [237, 330]], t: [[362, 294], [215, 434], [496, 494]], d: [[378, 660], [912, 654], [1152, 246]] },
  4: { m: [[173, 232], [109, 279], [237, 299]], t: [[362, 294], [215, 434], [509, 494]], d: [[1104, 624], [984, 246], [284, 573]] },
};

const TITIK_RESOURCES: Record<KategoriSlug, PosisiTitik> = {
  mars: { m: TITIK_MOBILE_RESOURCES, t: TITIK_TABLET_RESOURCES, d: [[378, 680], [912, 654], [1152, 246]] },
  moon: { m: TITIK_MOBILE_RESOURCES, t: TITIK_TABLET_RESOURCES, d: [[1020, 246], [298, 626], [984, 629]] },
  "deep-space": { m: TITIK_MOBILE_RESOURCES, t: TITIK_TABLET_RESOURCES, d: [[1104, 624], [540, 173], [284, 573]] },
};

/** Fokus horizontal gambar latar (persen) per ukuran layar, dihitung dari crop Figma (`Latar 3D`). */
export type FokusGambar = { m: number; t: number; d: number };
const FOKUS_MOON: FokusGambar = { m: 71.6, t: 77.7, d: 100 };
const FOKUS: Record<KategoriSlug, FokusGambar> = {
  mars: { m: 50, t: 50, d: 50 },
  moon: FOKUS_MOON,
  "deep-space": FOKUS_MOON,
};
const FOKUS_BAB_1: FokusGambar = { m: 87.9, t: 93.3, d: 100 };

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
  posisiTitik: PosisiTitik;
  fokusGambar: FokusGambar;
  panel: PanelData;
};

/** Indonesia: API sudah memuat semua benda satu bab. English: benda terjemahan bab + benda tambahan terjemahan. */
const semuaBenda = (babId: number, lang: Lang, benda: DataBenda[]): DataBenda[] =>
  lang === "id" ? bendaBab(babId) : [...benda, ...(BENDA_TAMBAHAN_EN[babId as BabId] ?? [])];

export function getBabImersif(id: number, lang: Lang = DEFAULT_LANG): (HalamanImersifData & { bab: Bab; labelBab: readonly string[] }) | undefined {
  const bab = getBab(id, lang);
  if (!bab) return undefined;
  const slug = BAB_KATEGORI[bab.id];
  const tujuan = getJourneyTujuan(slug, lang);
  return {
    bab,
    labelBab: STORY_COPY[lang].labelBab,
    gambar: bab.id === 1 ? "/images/imersif/bab-1-bumi.webp" : GAMBAR_KATEGORI[slug],
    scenePlaceholder: bab.id === 1,
    narasi: { eyebrow: `${lang === "en" ? "CHAPTER" : "BAB"} ${bab.id}`, judul: bab.judul, isi: bab.narasi },
    benda: semuaBenda(bab.id, lang, bab.benda),
    posisiTitik: TITIK_STORY[bab.id],
    fokusGambar: bab.id === 1 ? FOKUS_BAB_1 : FOKUS[slug],
    panel: { fakta: tujuan.kategori.fakta, misi: tujuan.misi, galeri: tujuan.kategori.galeri, sumber: tujuan.sumber },
  };
}

export function getResourcesImersif(slug: KategoriSlug, lang: Lang = DEFAULT_LANG): HalamanImersifData & {
  nama: string;
  dok: { label: string; href: string }[];
} {
  const tujuan = getJourneyTujuan(slug, lang);
  const k = tujuan.kategori;
  return {
    nama: k.nama,
    gambar: GAMBAR_KATEGORI[slug],
    scenePlaceholder: false,
    narasi: { eyebrow: "RESOURCES", judul: k.nama, isi: k.ringkasan },
    benda: semuaBenda(k.bab.id, lang, k.bab.benda),
    posisiTitik: TITIK_RESOURCES[slug],
    fokusGambar: FOKUS[slug],
    panel: { fakta: k.fakta, misi: tujuan.misi, galeri: k.galeri, sumber: tujuan.sumber },
    dok: KATEGORI_SLUGS.map((s) => ({ label: getKategori(s, lang).nama, href: `/resources/${s}` })),
  };
}
