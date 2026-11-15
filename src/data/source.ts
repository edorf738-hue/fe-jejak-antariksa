import { KATALOG_API } from "./api";

/**
 * Katalog halaman Sumber: tiga kategori (Referensi, Kredit Media, Model 3D). Setiap item punya status verifikasi:
 *  - terverifikasi: halaman asal sudah dibuka dan dicek (URL aktif, judul cocok, kredit tercantum di halaman asal);
 *  - perlu-verifikasi: ada bagian yang belum bisa dipastikan (mis. kredit tidak tertulis di halaman asal, atau asal file
 *    belum dicatat per berkas);
 *  - belum-tersedia: asal atau kredit belum diketahui sama sekali.
 * Tidak ada kredit, lisensi, pembuat, atau URL yang dikarang: yang tidak diketahui ditulis apa adanya.
 * URL dan judul dicek 15 November 2026 (semua balas 200 dan judul halaman cocok).
 */
export const SOURCE_COPY = {
  header: {
    eyebrow: "Source",
    judul: "Sumber",
    deskripsi: "Referensi, penerbit, dan kredit di balik setiap informasi dan media.",
  },
  tab: {
    referensi: "Referensi",
    media: "Kredit Media",
    model3d: "Model 3D",
  },
  status: {
    terverifikasi: { label: "Terverifikasi", arti: "Halaman asal sudah dicek dan kreditnya tercantum." },
    "perlu-verifikasi": { label: "Perlu verifikasi", arti: "Ada bagian yang belum bisa dipastikan." },
    "belum-tersedia": { label: "Informasi belum tersedia", arti: "Asal atau kredit belum diketahui." },
  },
} as const;

export type KategoriSumber = "referensi" | "media" | "model3d";
export type StatusSumber = keyof typeof SOURCE_COPY.status;

export type RincianSumber = { nama: string; kredit: string; url?: string };

export type SumberItem = {
  id: string;
  kategori: KategoriSumber;
  /** Jenis aset: "Halaman misi NASA", "Foto", "Video", "Model 3D", ... */
  jenis: string;
  nama: string;
  /** Penerbit atau pembuat, satu baris untuk kartu. */
  penerbit: string;
  /** Kredit pembuat atau fotografer, persis seperti tercantum di sumbernya. */
  kredit: string;
  /** URL halaman asal; null bila belum ada. */
  url: string | null;
  lisensi: string;
  diakses: string | null;
  status: StatusSumber;
  catatan?: string;
  /** Untuk kelompok aset: daftar berkas beserta kredit masing-masing. */
  rincian?: RincianSumber[];
};

export const URL_PANDUAN_NASA = "https://www.nasa.gov/nasa-brand-center/images-and-media/";

export function getKatalogSumber(): Record<KategoriSumber, SumberItem[]> {
  return {
    referensi: KATALOG_API.filter((i) => i.kategori === "referensi"),
    media: KATALOG_API.filter((i) => i.kategori === "media"),
    model3d: KATALOG_API.filter((i) => i.kategori === "model3d"),
  };
}
