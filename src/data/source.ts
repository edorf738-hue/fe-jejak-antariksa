import { getKredit, getSumber } from "./content";

/**
 * Teks dan data halaman Sumber. Referensi berasal dari content-data.json
 * (`sumber`); kredit gambar dan model 3D dari content-data.json (`kredit`). Nilai TBD tetap TBD.
 */
export const SOURCE_COPY = {
  header: {
    eyebrow: "Source",
    judul: "Sumber",
    deskripsi: "Referensi, penerbit, dan kredit di balik setiap informasi dan media.",
  },
  catatan: {
    judul: "Tentang status verifikasi",
    isi: "Informasi yang belum diverifikasi ditandai TBD atau Needs verification. Setiap sumber mencatat tanggal akses dan ketentuan penggunaannya.",
  },
  filter: [
    { id: "semua", label: "Semua" },
    { id: "referensi", label: "Referensi" },
    { id: "gambar", label: "Gambar" },
    { id: "model3d", label: "Model 3D" },
  ],
  bagian: {
    referensi: "Referensi",
    gambar: "Kredit Gambar dan Media",
    model3d: "Kredit Model 3D",
  },
} as const;

export type KategoriSumber = "referensi" | "gambar" | "model3d";
export type FilterSumber = "semua" | KategoriSumber;

export type EntriSumber = {
  id: string;
  kategori: KategoriSumber;
  /** Label eyebrow, mis. "REFERENSI". */
  labelKategori: string;
  judul: string;
  meta: string;
  /** URL penuh (http...) atau teks pengganti bila belum ada ("URL ...: TBD"). */
  url: string;
  atribusi: string;
};


export function getEntriSumber(): Record<KategoriSumber, EntriSumber[]> {
  const referensi: EntriSumber[] = getSumber().map((s, i) => ({
    id: `referensi-${i}`,
    kategori: "referensi",
    labelKategori: "REFERENSI",
    judul: s.judul,
    meta: `Penerbit: ${s.penerbit} · Diakses: ${s.diakses ?? "TBD"}`,
    url: s.url,
    atribusi: "Atribusi dan ketentuan penggunaan: TBD",
  }));
  const kredit = getKredit();
  const toEntri = (kategori: "gambar" | "model3d", labelKategori: string): EntriSumber[] =>
    kredit[kategori].map((k) => ({ ...k, kategori, labelKategori }));
  return { referensi, gambar: toEntri("gambar", "GAMBAR"), model3d: toEntri("model3d", "MODEL 3D") };
}
