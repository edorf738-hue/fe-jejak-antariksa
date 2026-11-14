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
} as const;
