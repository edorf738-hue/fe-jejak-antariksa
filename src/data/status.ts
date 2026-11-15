/** Teks state halaman (FIGMA frame "Panel — Kosong / Memuat / Galat" dan "Kosong (Source)"). Draf. */
export const STATUS_COPY = {
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
