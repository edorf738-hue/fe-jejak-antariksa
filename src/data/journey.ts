import { getKategori, getSumber } from "./content";
import raw from "../../docs/content-data.json";
import rawEn from "../../docs/content-data.en.json";
import { DEFAULT_LANG, type Lang, type Widen } from "../lib/i18n";
import type { Kategori, KategoriSlug, Misi, Sumber } from "./types";

/**
 * Data halaman Peta Perjalanan (Journey Map) per tujuan: misi terkait, detail misi,
 * kronologi, sumber. Semua dari content-data.json; nilai kosong menjadi TBD di UI.
 */
const COPY_ID = {
  header: {
    eyebrow: "Journey Map",
    judul: "Peta perjalanan",
    deskripsi: "Pilih tujuan, lalu pilih misinya.",
  },
  peta: {
    judul: "Pilih Tujuan",
    catatan: "Tata letak simbolis. Bukan rute, jarak, atau skala sebenarnya.",
  },
  detail: { eyebrow: "DETAIL MISI" },
  /** Teks Daftar Misi dan Pratinjau Misi (permintaan Zhafran: peta sebagai pusat navigasi, bukan artikel). */
  pratinjau: {
    judulMisi: "Misi",
    labelTahun: "Tahun",
    labelStatus: "Status",
    labelWahana: "Wahana",
    labelTujuan: "Tujuan utama",
    labelTemuan: "Pencapaian penting",
    ctaCerita: "Baca Kisah Misi",
    tutupKisah: "Tutup Kisah Misi",
    eyebrowKisah: "KISAH MISI",
    cta3d: "Jelajahi Lingkungan 3D",
    kredit: "Kredit",
  },
  kronologi: { eyebrow: "KRONOLOGI" },
  sumber: "Sumber",
} as const;

const COPY_EN: Widen<typeof COPY_ID> = {
  header: { eyebrow: "Journey Map", judul: "Journey map", deskripsi: "Choose a destination, then choose a mission." },
  peta: { judul: "Choose a Destination", catatan: "A symbolic layout. Not the real route, distance, or scale." },
  detail: { eyebrow: "MISSION DETAILS" },
  pratinjau: {
    judulMisi: "Missions",
    labelTahun: "Year",
    labelStatus: "Status",
    labelWahana: "Spacecraft",
    labelTujuan: "Main goal",
    labelTemuan: "Key achievement",
    ctaCerita: "Read the Mission Story",
    tutupKisah: "Close the Mission Story",
    eyebrowKisah: "MISSION STORY",
    cta3d: "Explore the 3D Environment",
    kredit: "Credit",
  },
  kronologi: { eyebrow: "TIMELINE" },
  sumber: "Sources",
};

export const JOURNEY_COPY: Record<Lang, Widen<typeof COPY_ID>> = { id: COPY_ID, en: COPY_EN };

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
const DATA: Record<Lang, RawJourney> = { id: raw as unknown as RawJourney, en: rawEn as unknown as RawJourney };

const KEY: Record<KategoriSlug, "Bulan" | "Mars" | "Deep Space"> = {
  moon: "Bulan",
  mars: "Mars",
  "deep-space": "Deep Space",
};

/** Judul panel kronologi (handoff bagian 5a: Apollo 11, Spirit dan Opportunity, Voyager). */
const JUDUL_KRONOLOGI: Record<Lang, Record<KategoriSlug, string>> = {
  id: { moon: "Kronologi Apollo 11", mars: "Kronologi Spirit dan Opportunity", "deep-space": "Kronologi Voyager" },
  en: { moon: "Apollo 11 Timeline", mars: "Spirit and Opportunity Timeline", "deep-space": "Voyager Timeline" },
};

/**
 * Indeks `sumber` di content-data.json yang dipakai tiap tujuan.
 * USULAN, MENUNGGU KONFIRMASI TIM KONTEN: content-data.json belum memetakan sumber ke
 * tujuan. Moon cocok dengan frame Figma (Apollo 11 Mission Overview, NSSDCA Eagle); Mars
 * dan Deep Space dipilih menurut topiknya.
 */
const INDEKS_SUMBER: Record<KategoriSlug, number[]> = {
  moon: [0, 2],
  mars: [3, 4],
  "deep-space": [6, 7],
};

const TBD = "TBD";

export type BarisDetail = { label: string; nilai: string };

/** Ringkasan satu misi untuk Daftar Misi dan Pratinjau Misi di Peta Perjalanan. Nilai kosong = "TBD". */
export type PratinjauMisi = {
  nama: string;
  tahun: string;
  status: string;
  wahana: string;
  tujuan: string;
  temuan: string;
  /** Kisah singkat misi (paragraf); tampil di halaman saat tombol Baca Kisah Misi ditekan. */
  kisah: string[];
  /** Kronologi tujuan misi ini; kosong bila misi belum punya kronologi (Apollo 8 dan 10). */
  kronologi: BarisDetail[];
  judulKronologi: string;
  /** Lingkungan 3D (Resources) tujuan ini. */
  hrefLingkungan: string;
  foto: FotoMisi;
};

/** Foto dokumentasi NASA untuk Pratinjau Misi (berkas di public/images/misi; kredit lengkap di content-data.json `kredit.gambar`). */
export type FotoMisi = { src: string; alt: string; keterangan: string; kredit: string; posisi?: string };

const FOTO_ID: Record<string, FotoMisi> = {
  "Apollo 11": {
    src: "/images/misi/apollo-11.webp",
    alt: "Astronaut Buzz Aldrin berdiri di samping bendera Amerika Serikat di permukaan Bulan",
    keterangan: "Edwin Aldrin di samping bendera AS, Apollo 11, Juli 1969 (AS11-40-5875)",
    kredit: "NASA (JSC)",
    posisi: "50% 18%",
  },
  Spirit: {
    src: "/images/misi/spirit.webp",
    alt: "Rover Spirit di permukaan Mars",
    keterangan: "Rover Spirit di Gusev Crater, Mars (PIA05040)",
    kredit: "NASA/JPL-Caltech",
  },
  Opportunity: {
    src: "/images/misi/opportunity.webp",
    alt: "Foto diri rover Opportunity di Mars",
    keterangan: "Foto diri rover Opportunity, Januari 2014 (PIA17759)",
    kredit: "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.",
  },
  "Voyager 1": {
    src: "/images/misi/voyager-1.webp",
    alt: "Ilustrasi pesawat Voyager di ruang antarbintang",
    keterangan: "Voyager di ruang antarbintang, konsep seniman (bukan foto) (PIA21839)",
    kredit: "NASA/JPL-Caltech",
  },
  "Voyager 2": {
    src: "/images/misi/voyager-2.webp",
    alt: "Planet Uranus dilihat dari pesawat Voyager 2",
    keterangan: "Uranus dilihat dari Voyager 2 (PIA18182)",
    kredit: "NASA/JPL-Caltech",
  },
};

const FOTO_EN: Record<string, FotoMisi> = {
  "Apollo 11": {
    ...FOTO_ID["Apollo 11"],
    alt: "Astronaut Buzz Aldrin standing beside the flag of the United States on the Moon's surface",
    keterangan: "Edwin Aldrin beside the U.S. flag, Apollo 11, July 1969 (AS11-40-5875)",
  },
  Spirit: { ...FOTO_ID.Spirit, alt: "The Spirit rover on the surface of Mars", keterangan: "The Spirit rover in Gusev Crater, Mars (PIA05040)" },
  Opportunity: { ...FOTO_ID.Opportunity, alt: "A self-portrait of the Opportunity rover on Mars", keterangan: "Self-portrait of the Opportunity rover, January 2014 (PIA17759)" },
  "Voyager 1": {
    ...FOTO_ID["Voyager 1"],
    alt: "An illustration of the Voyager spacecraft in interstellar space",
    keterangan: "Voyager in interstellar space, artist's concept (not a photo) (PIA21839)",
  },
  "Voyager 2": { ...FOTO_ID["Voyager 2"], alt: "The planet Uranus as seen by the Voyager 2 spacecraft", keterangan: "Uranus as seen by Voyager 2 (PIA18182)" },
};

/** Misi tanpa foto sendiri (Apollo 8, Apollo 10): peta Bulan NASA, diberi keterangan bahwa foto khusus belum ada. */
const CADANGAN_ID: FotoMisi = {
  src: "/images/planet/bulan.webp",
  alt: "Peta permukaan Bulan",
  keterangan: "Peta Bulan NASA (citra LRO), bukan foto misi ini: foto khusus belum tersedia",
  kredit: "NASA's Goddard Space Flight Center",
};
const CADANGAN_EN: FotoMisi = {
  ...CADANGAN_ID,
  alt: "A map of the Moon's surface",
  keterangan: "NASA Moon map (LRO imagery), not a photo of this mission: no dedicated photo is available yet",
};

const FOTO: Record<Lang, { misi: Record<string, FotoMisi>; cadangan: FotoMisi }> = {
  id: { misi: FOTO_ID, cadangan: CADANGAN_ID },
  en: { misi: FOTO_EN, cadangan: CADANGAN_EN },
};

const tahunDari = (teks?: string) => teks?.match(/\b(19|20)\d{2}\b/)?.[0] ?? TBD;

export type JourneyTujuan = {
  kategori: Kategori;
  /** Misi terkait; null = belum terisi (kartu TBD). */
  misi: (Misi | null)[];
  /** Baris detail untuk misi ke-i (misi pertama mendapat baris tambahan lokasi, kru/tokoh, fakta). */
  detail: BarisDetail[][];
  judulKronologi: string;
  kronologi: BarisDetail[];
  sumber: Sumber[];
  /** Misi yang sudah terisi (tanpa yang null), siap untuk Daftar Misi dan Pratinjau Misi. */
  pratinjau: PratinjauMisi[];
};

const LABEL_DETAIL: Record<Lang, string[]> = {
  id: ["Wahana", "Tanggal peluncuran", "Tanggal tiba / landing", "Tujuan misi", "Status misi", "Temuan penting", "Lokasi", "Kru", "Tokoh", "Fakta menarik", "Sumber"],
  en: ["Spacecraft", "Launch date", "Arrival / landing date", "Mission goal", "Mission status", "Key finding", "Location", "Crew", "Key figure", "Fun fact", "Source"],
};

function detailMisi(
  lang: Lang,
  m: Misi | null,
  utama: DetailUtama | undefined,
  tambahan: DetailTambahan | undefined,
  sumber: Sumber | undefined,
): BarisDetail[] {
  // Misi pertama tiap tujuan memakai teks rinci (`detailMisi` di content-data.json, sama dengan Figma);
  // misi lain memakai field di `misi`.
  const L = LABEL_DETAIL[lang];
  const baris: BarisDetail[] = [
    { label: L[0], nilai: utama?.wahana ?? m?.wahana ?? TBD },
    { label: L[1], nilai: utama?.peluncuran ?? m?.peluncuran ?? TBD },
    { label: L[2], nilai: utama?.tiba ?? m?.tiba ?? TBD },
    { label: L[3], nilai: utama?.tujuan ?? m?.tujuan ?? TBD },
    { label: L[4], nilai: utama?.status ?? m?.status ?? TBD },
    { label: L[5], nilai: utama?.temuan ?? m?.temuan ?? TBD },
  ];
  if (tambahan) {
    baris.push({ label: L[6], nilai: tambahan.lokasi ?? TBD });
    if (tambahan.kru) baris.push({ label: L[7], nilai: tambahan.kru });
    if (tambahan.tokoh) baris.push({ label: L[8], nilai: tambahan.tokoh });
    if (tambahan.faktaMenarik) baris.push({ label: L[9], nilai: tambahan.faktaMenarik });
  }
  baris.push({ label: L[10], nilai: sumber?.judul ?? TBD });
  return baris;
}

export function getJourneyTujuan(slug: KategoriSlug, lang: Lang = DEFAULT_LANG): JourneyTujuan {
  const data = DATA[lang];
  const kategori = getKategori(slug, lang);
  const key = KEY[slug];
  const semuaSumber = getSumber(lang);
  const sumber = INDEKS_SUMBER[slug].flatMap((i) => (semuaSumber[i] ? [semuaSumber[i]] : []));
  const misi = kategori.misi;
  return {
    kategori,
    misi,
    detail: misi.map((m, i) =>
      detailMisi(
        lang,
        m,
        i === 0 ? data.detailMisi[key] : undefined,
        i === 0 ? data.detailMisiTambahan[key] : undefined,
        sumber[0],
      ),
    ),
    pratinjau: misi.flatMap((m, i) => {
      if (!m) return [];
      // Misi pertama tiap tujuan punya teks rinci di `detailMisi`; field `misi` yang kosong dilengkapi darinya.
      const utama = i === 0 ? data.detailMisi[key] : undefined;
      return [
        {
          nama: m.nama,
          tahun: tahunDari(m.peluncuran),
          status: m.status || utama?.status || TBD,
          wahana: m.wahana || utama?.wahana || TBD,
          tujuan: m.tujuan ?? utama?.tujuan ?? TBD,
          temuan: m.temuan ?? utama?.temuan ?? TBD,
          kisah: m.kisah ?? [],
          // Kronologi di content-data.json milik tujuan: Apollo 11 untuk Bulan (Apollo 8 dan 10 belum punya), seluruh misi di Mars dan Deep Space.
          kronologi: slug !== "moon" || i === 0 ? data.kronologi[key].map(([label, nilai]) => ({ label, nilai })) : [],
          judulKronologi: JUDUL_KRONOLOGI[lang][slug],
          hrefLingkungan: `/resources/${slug}`,
          foto: FOTO[lang].misi[m.nama] ?? FOTO[lang].cadangan,
        },
      ];
    }),
    judulKronologi: JUDUL_KRONOLOGI[lang][slug],
    kronologi: data.kronologi[key].map(([label, nilai]) => ({ label, nilai })),
    sumber,
  };
}
