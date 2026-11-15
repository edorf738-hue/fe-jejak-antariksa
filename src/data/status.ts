import type { Lang, Widen } from "../lib/i18n";

/** Teks state halaman (FIGMA frame "Panel — Kosong / Memuat / Galat" dan "Kosong (Source)"), per bahasa. Draf. */
const ID = {
  tujuanKosong: {
    judul: "Belum ada tujuan dipilih",
    isi: "Pilih Mars, Moon, atau Deep Space di peta untuk melihat misi terkait.",
  },
  misiMemuat: "Memuat data misi…",
  misiGalat: {
    judul: "Data misi tidak dapat dimuat",
    isi: "Periksa koneksi lalu coba lagi.",
    coba: "Coba Lagi",
  },
  sumberKosong: {
    judul: "Belum ada sumber di kategori ini",
    isi: "Pilih kategori lain atau kembali ke Semua.",
  },
  /**
   * Halaman 404 dan galat global. DRAF: copy belum didesain di Figma, menunggu
   * persetujuan Zhafran/Dhika.
   */
  tidakDitemukan: {
    judul: "Halaman tidak ditemukan",
    isi: "Alamat yang dibuka tidak ada atau sudah dipindahkan.",
    kembali: "Kembali ke Beranda",
  },
  halamanGalat: {
    judul: "Terjadi kesalahan",
    isi: "Halaman tidak dapat ditampilkan. Coba lagi, atau kembali ke Beranda.",
    coba: "Coba Lagi",
    kembali: "Kembali ke Beranda",
  },
  /** State scene 3D (FIGMA State 3D: "1 Loading" dan "6 Fallback"). Draf. */
  scene3dMemuat: {
    judul: "Memuat lingkungan 3D…",
    isi: "Gambar statis ditampilkan selama aset dimuat.",
  },
  scene3dFallback: {
    judul: "Lingkungan 3D tidak dapat dimuat",
    isi: "Menampilkan gambar statis. Periksa koneksi atau coba lagi.",
    cobaLagi: "Coba Lagi",
    lanjut: "Lanjut tanpa 3D",
  },
} as const;

const EN: Widen<typeof ID> = {
  tujuanKosong: {
    judul: "No destination selected",
    isi: "Choose Mars, the Moon, or Deep Space on the map to see its missions.",
  },
  misiMemuat: "Loading mission data…",
  misiGalat: {
    judul: "Mission data could not be loaded",
    isi: "Check your connection and try again.",
    coba: "Try Again",
  },
  sumberKosong: {
    judul: "No sources in this category yet",
    isi: "Choose another category or go back to All.",
  },
  tidakDitemukan: {
    judul: "Page not found",
    isi: "The address you opened does not exist or has been moved.",
    kembali: "Back to Home",
  },
  halamanGalat: {
    judul: "Something went wrong",
    isi: "The page could not be displayed. Try again, or go back to Home.",
    coba: "Try Again",
    kembali: "Back to Home",
  },
  scene3dMemuat: {
    judul: "Loading the 3D environment…",
    isi: "A still image is shown while the assets load.",
  },
  scene3dFallback: {
    judul: "The 3D environment could not be loaded",
    isi: "Showing a still image. Check your connection or try again.",
    cobaLagi: "Try Again",
    lanjut: "Continue without 3D",
  },
};

export const STATUS_COPY: Record<Lang, Widen<typeof ID>> = { id: ID, en: EN };
