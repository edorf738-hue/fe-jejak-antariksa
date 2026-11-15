import { JOURNEYS_API } from "./api";
import type { Kategori, KategoriSlug, Misi, Sumber } from "./types";

/**
 * Data halaman Peta Perjalanan (Journey Map) per tujuan: misi terkait, detail misi,
 * kronologi, sumber. Semua dari content-data.json; nilai kosong menjadi TBD di UI.
 */
export const JOURNEY_COPY = {
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

export function getJourneyTujuan(slug: KategoriSlug): JourneyTujuan {
  return JOURNEYS_API.find((j) => j.slug === slug) as JourneyTujuan;
}
