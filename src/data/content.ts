import raw from "../../docs/content-data.json";
import type {
  Bab,
  BabId,
  DataBenda,
  Fakta,
  Kategori,
  KategoriSlug,
  Misi,
  Model3D,
  Sumber,
} from "./types";

/**
 * Pemuat data dari docs/content-data.json. Komponen tidak boleh menulis fakta
 * sendiri: ambil lewat fungsi di sini. Nilai "TBD" dan null dipertahankan.
 */
type RawBenda = {
  hotspot?: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  fakta: string;
  sumber: string;
  model3d?: Model3D | null;
};

type RawBab = {
  id: number;
  judul: string;
  status: string;
  narasi: string;
  hotspot: string[];
  dataBenda: RawBenda;
  dataBendaLain: RawBenda[];
};

type RawKategori = { ringkasan: string; pakaiBab: number };
type RawFaktaTuple = [string, string];

type RawContent = {
  bab: RawBab[];
  resources: {
    Mars: RawKategori;
    Moon: RawKategori;
    "Deep Space": RawKategori;
    faktaMars: Fakta[];
    /** Keterangan gambar galeri Mars; [] = belum ada data (panel menampilkan "Belum ada data."). */
    galeriMars: (string | null)[];
    panelTambahan: Record<
      "Moon" | "Deep Space",
      { fakta: RawFaktaTuple[]; galeri: (string | null)[] }
    >;
  };
  misi: Record<"Bulan" | "Mars" | "Deep Space", (Misi | null)[]>;
  sumber: Sumber[];
  kredit: { gambar: KreditEntri[]; model3d: KreditEntri[] };
  ringkasanBab: Record<string, string>;
};

const content = raw as unknown as RawContent;

function toBenda(babId: number, hotspot: string, index: number, b: RawBenda): DataBenda {
  return {
    id: `${babId}-${index}`,
    hotspot,
    nama: b.nama,
    kategori: b.kategori,
    deskripsi: b.deskripsi,
    fakta: b.fakta,
    sumber: b.sumber,
    model3d: b.model3d ?? null,
  };
}

function toBab(b: RawBab): Bab {
  const semua = [b.dataBenda, ...b.dataBendaLain];
  // Urutan benda mengikuti urutan hotspot; cocokkan lewat label hotspot atau nama.
  const benda = b.hotspot.flatMap((label, i) => {
    const match = semua.find((x) => (x.hotspot ?? x.nama) === label);
    return match ? [toBenda(b.id, label, i, match)] : [];
  });
  return {
    id: b.id as BabId,
    judul: b.judul,
    status: b.status,
    narasi: b.narasi,
    ringkasan: content.ringkasanBab[String(b.id)] ?? "",
    hotspot: b.hotspot,
    benda,
  };
}

const BAB: Bab[] = content.bab.map(toBab);

export function getDaftarBab(): Bab[] {
  return BAB;
}

export function getBab(id: number): Bab | undefined {
  return BAB.find((b) => b.id === id);
}

const KATEGORI_META: Record<
  KategoriSlug,
  { nama: "Mars" | "Moon" | "Deep Space"; misiKey: "Mars" | "Bulan" | "Deep Space" }
> = {
  mars: { nama: "Mars", misiKey: "Mars" },
  moon: { nama: "Moon", misiKey: "Bulan" },
  "deep-space": { nama: "Deep Space", misiKey: "Deep Space" },
};

export const KATEGORI_SLUGS = Object.keys(KATEGORI_META) as KategoriSlug[];

export function isKategoriSlug(value: string): value is KategoriSlug {
  return value in KATEGORI_META;
}

export function getKategori(slug: KategoriSlug): Kategori {
  const { nama, misiKey } = KATEGORI_META[slug];
  const res = content.resources[nama];
  const bab = getBab(res.pakaiBab) as Bab;
  const tambahan = nama === "Mars" ? undefined : content.resources.panelTambahan[nama];
  return {
    slug,
    nama,
    ringkasan: res.ringkasan,
    bab,
    fakta: tambahan
      ? tambahan.fakta.map(([isi, sumber]) => ({ isi, sumber }))
      : content.resources.faktaMars,
    galeri: tambahan?.galeri ?? content.resources.galeriMars,
    misi: content.misi[misiKey],
  };
}

export function getSumber(): Sumber[] {
  return content.sumber;
}

export type KreditEntri = {
  id: string;
  judul: string;
  meta: string;
  url: string;
  atribusi: string;
};

/** Kredit gambar dan model 3D (`kredit` di content-data.json). */
export function getKredit(): { gambar: KreditEntri[]; model3d: KreditEntri[] } {
  return content.kredit;
}
