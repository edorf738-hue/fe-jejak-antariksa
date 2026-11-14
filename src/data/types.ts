/** Tipe data konten. Sumber: docs/content-data.json (bukan teks layer Figma). */

export type BabId = 1 | 2 | 3 | 4;
export type KategoriSlug = "mars" | "moon" | "deep-space";

export type Model3D = {
  file: string;
  /** Mis. "model umum": tulis apa adanya di web. */
  jenis: string;
  catatan?: string;
};

/** Data benda (Kartu Data Benda). Nilai "TBD" dari sumber ditampilkan apa adanya. */
export type DataBenda = {
  /** Unik per bab, mis. "2-0". */
  id: string;
  /** Label Titik Info (hotspot) yang membuka benda ini. */
  hotspot: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  fakta: string;
  sumber: string;
  /** null bila belum ada file model. */
  model3d: Model3D | null;
};

export type Bab = {
  id: BabId;
  judul: string;
  status: string;
  narasi: string;
  /** Ringkasan untuk Kartu Bab di Story Pengantar. */
  ringkasan: string;
  hotspot: string[];
  benda: DataBenda[];
};

export type Fakta = { isi: string; sumber: string };

export type Misi = {
  nama: string;
  wahana: string;
  peluncuran: string;
  status: string;
  tiba: string;
  tujuan: string;
  temuan: string;
};

export type Kategori = {
  slug: KategoriSlug;
  nama: string;
  ringkasan: string;
  /** Bab yang scene-nya dipakai kategori ini (Mars = 3, Moon = 2, Deep Space = 4). */
  bab: Bab;
  fakta: Fakta[];
  /** Keterangan gambar galeri; null = gambar belum ada. */
  galeri: (string | null)[];
  /** null = misi ke-n belum terisi (TBD). */
  misi: (Misi | null)[];
};

export type Sumber = {
  judul: string;
  penerbit: string;
  url: string;
  /** Tanggal akses; null = belum dicatat. */
  diakses: string | null;
};
