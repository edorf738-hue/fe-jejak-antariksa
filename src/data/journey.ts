import { getKategori, getSumber } from "./content";
import raw from "../../docs/content-data.json";
import type { Kategori, KategoriSlug, Misi, Sumber } from "./types";

/**
 * Data halaman Peta Perjalanan (Journey Map) per tujuan: misi terkait, detail misi,
 * kronologi, sumber. Semua dari content-data.json; nilai kosong menjadi TBD di UI.
 */
export const JOURNEY_COPY = {
  header: {
    eyebrow: "Journey Map",
    judul: "Peta perjalanan",
    deskripsi: "Pilih tujuan untuk melihat misi terkait.",
  },
  peta: {
    judul: "Pilih Tujuan",
    catatan: "Tata letak simbolis. Bukan rute, jarak, atau skala sebenarnya.",
  },
  detail: { eyebrow: "DETAIL MISI" },
  kronologi: { eyebrow: "KRONOLOGI" },
  sumber: "Sumber",
} as const;

type DetailTambahan = {
  lokasi?: string;
  kru?: string;
  tokoh?: string;
  faktaMenarik?: string;
};

type DetailUtama = {
  wahana: string;
  peluncuran: string;
  tiba: string;
  tujuan: string;
  status: string;
  temuan: string;
};

type RawJourney = {
  detailMisi: Record<"Bulan" | "Mars" | "Deep Space", DetailUtama>;
  detailMisiTambahan: Record<"Bulan" | "Mars" | "Deep Space", DetailTambahan>;
  kronologi: Record<"Bulan" | "Mars" | "Deep Space", [string, string][]>;
};
const data = raw as unknown as RawJourney;

const KEY: Record<KategoriSlug, "Bulan" | "Mars" | "Deep Space"> = {
  moon: "Bulan",
  mars: "Mars",
  "deep-space": "Deep Space",
};

/** Judul panel kronologi (handoff bagian 5a: Apollo 11, Spirit dan Opportunity, Voyager). */
const JUDUL_KRONOLOGI: Record<KategoriSlug, string> = {
  moon: "Kronologi Apollo 11",
  mars: "Kronologi Spirit dan Opportunity",
  "deep-space": "Kronologi Voyager",
};

/**
 * Indeks `sumber` di content-data.json yang dipakai tiap tujuan (usulan: content-data.json
 * belum memetakan sumber ke tujuan). Moon cocok dengan frame Figma (Apollo 11 Mission
 * Overview, NSSDCA Eagle); Mars dan Deep Space dipilih menurut topiknya.
 */
const INDEKS_SUMBER: Record<KategoriSlug, number[]> = {
  moon: [0, 2],
  mars: [3, 4],
  "deep-space": [6, 7],
};

export type BarisDetail = { label: string; nilai: string };

export type JourneyTujuan = {
  kategori: Kategori;
  /** Misi terkait; null = belum terisi (kartu TBD). */
  misi: (Misi | null)[];
  /** Baris detail untuk misi ke-i (misi pertama mendapat baris tambahan lokasi, kru/tokoh, fakta). */
  detail: BarisDetail[][];
  judulKronologi: string;
  kronologi: BarisDetail[];
  sumber: Sumber[];
};

const TBD = "TBD";

function detailMisi(
  m: Misi | null,
  utama: DetailUtama | undefined,
  tambahan: DetailTambahan | undefined,
  sumber: Sumber | undefined,
): BarisDetail[] {
  // Misi pertama tiap tujuan memakai teks rinci (`detailMisi` di content-data.json, sama dengan Figma);
  // misi lain memakai field di `misi`.
  const baris: BarisDetail[] = [
    { label: "Wahana", nilai: utama?.wahana ?? m?.wahana ?? TBD },
    { label: "Tanggal peluncuran", nilai: utama?.peluncuran ?? m?.peluncuran ?? TBD },
    { label: "Tanggal tiba / landing", nilai: utama?.tiba ?? m?.tiba ?? TBD },
    { label: "Tujuan misi", nilai: utama?.tujuan ?? m?.tujuan ?? TBD },
    { label: "Status misi", nilai: utama?.status ?? m?.status ?? TBD },
    { label: "Temuan penting", nilai: utama?.temuan ?? m?.temuan ?? TBD },
  ];
  if (tambahan) {
    baris.push({ label: "Lokasi", nilai: tambahan.lokasi ?? TBD });
    if (tambahan.kru) baris.push({ label: "Kru", nilai: tambahan.kru });
    if (tambahan.tokoh) baris.push({ label: "Tokoh", nilai: tambahan.tokoh });
    if (tambahan.faktaMenarik) baris.push({ label: "Fakta menarik", nilai: tambahan.faktaMenarik });
  }
  baris.push({ label: "Sumber", nilai: sumber?.judul ?? TBD });
  return baris;
}

export function getJourneyTujuan(slug: KategoriSlug): JourneyTujuan {
  const kategori = getKategori(slug);
  const key = KEY[slug];
  const semuaSumber = getSumber();
  const sumber = INDEKS_SUMBER[slug].flatMap((i) => (semuaSumber[i] ? [semuaSumber[i]] : []));
  const misi = kategori.misi;
  return {
    kategori,
    misi,
    detail: misi.map((m, i) =>
      detailMisi(
        m,
        i === 0 ? data.detailMisi[key] : undefined,
        i === 0 ? data.detailMisiTambahan[key] : undefined,
        sumber[0],
      ),
    ),
    judulKronologi: JUDUL_KRONOLOGI[slug],
    kronologi: data.kronologi[key].map(([label, nilai]) => ({ label, nilai })),
    sumber,
  };
}
