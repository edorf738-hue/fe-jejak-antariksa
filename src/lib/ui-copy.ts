import type { Lang, Widen } from "./i18n";

/** Teks komponen bersama (navigasi, tombol, label aksesibilitas) per bahasa. Teks halaman ada di src/data. */
export const UI: Record<Lang, {
  nav: { home: string; story: string; map: string; source: string };
  navMain: string;
  skip: string;
  logoLabel: string;
  menuOpen: string;
  menuClose: string;
  langLabel: string;
  langName: Record<Lang, string>;
}> = {
  en: {
    nav: { home: "Home", story: "Story", map: "Journey Map", source: "Sources" },
    navMain: "Main navigation",
    skip: "Skip to content",
    logoLabel: "NASA Space Apps Challenge, go to Home",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langLabel: "Language",
    langName: { en: "English", id: "Bahasa Indonesia" },
  },
  id: {
    nav: { home: "Beranda", story: "Cerita", map: "Peta Perjalanan", source: "Sumber" },
    navMain: "Navigasi utama",
    skip: "Lewati ke konten",
    logoLabel: "NASA Space Apps Challenge, ke Beranda",
    menuOpen: "Buka menu",
    menuClose: "Tutup menu",
    langLabel: "Bahasa",
    langName: { en: "English", id: "Bahasa Indonesia" },
  },
};

/** Teks HUD halaman imersif (panel, popup objek, penampil model/foto, status scene) per bahasa. Aksesibilitas: label dipakai sebagai aria-label. */
const HUD_ID = {
  sebelumnya: "Sebelumnya",
  bab: "Bab",
  selesai: "selesai",
  kategori: "Kategori",
  kontrolScene: "Kontrol scene",
  layarPenuh: "Layar penuh",
  modelMemuat: "Memuat model 3D…",
  modelGagal: "Model 3D tidak dapat dimuat. Informasi objek tetap tersedia di bawah.",
  modelPetunjuk: "Seret untuk memutar, gulir atau cubit untuk zoom",
  modelReset: "Setel ulang tampilan",
  modelAria: "Model 3D interaktif.",
  perbesarFoto: "Perbesar foto:",
  perbesar: "Perbesar",
  tutup: "Tutup",
  videoTidakDidukung: "Peramban Anda tidak mendukung pemutaran video.",
  jenisMedia: "Jenis media",
  media: { model3d: "Model 3D", image: "Foto", video: "Video" },
  dataBenda: "DATA BENDA",
  sumber: "sumber",
  sumberLabel: "Sumber",
  kosong: "Belum ada data.",
  gambarBelum: "Gambar belum tersedia",
  kredit: "Kredit",
  panel: { fakta: "Fakta", misi: "Misi Terkait", galeri: "Galeri", sumber: "Sumber" },
  panelWord: "panel",
  isiPanel: "Isi panel",
  hotspotBelum: "Objek 3D untuk lingkungan ini belum tersedia.",
  sceneAria: "Scene 3D. Seret atau tekan tombol panah untuk melihat sekeliling, plus dan minus untuk zoom.",
  sceneMemuat: "Memuat scene 3D…",
  sceneFallback: "Tampilan 3D tidak tersedia, menampilkan gambar statis.",
  model3d: "Model 3D",
} as const;

export const HUD: Record<Lang, Widen<typeof HUD_ID>> = {
  id: HUD_ID,
  en: {
    sebelumnya: "Previous",
    bab: "Chapter",
    selesai: "done",
    kategori: "Categories",
    kontrolScene: "Scene controls",
    layarPenuh: "Fullscreen",
    modelMemuat: "Loading the 3D model…",
    modelGagal: "The 3D model could not be loaded. The object information is still available below.",
    modelPetunjuk: "Drag to rotate, scroll or pinch to zoom",
    modelReset: "Reset view",
    modelAria: "Interactive 3D model.",
    perbesarFoto: "Enlarge photo:",
    perbesar: "Enlarge",
    tutup: "Close",
    videoTidakDidukung: "Your browser does not support video playback.",
    jenisMedia: "Media type",
    media: { model3d: "3D model", image: "Photo", video: "Video" },
    dataBenda: "OBJECT DATA",
    sumber: "source",
    sumberLabel: "Source",
    kosong: "No data yet.",
    gambarBelum: "Image not available yet",
    kredit: "Credit",
    panel: { fakta: "Facts", misi: "Related Missions", galeri: "Gallery", sumber: "Sources" },
    panelWord: "panel",
    isiPanel: "Panel contents",
    hotspotBelum: "3D objects for this environment are not available yet.",
    sceneAria: "3D scene. Drag or press the arrow keys to look around, plus and minus to zoom.",
    sceneMemuat: "Loading the 3D scene…",
    sceneFallback: "The 3D view is not available, showing a still image.",
    model3d: "3D model",
  },
};

/** Teks kecil komponen bersama lain (kartu misi, item sumber, peta). */
const MISC_ID = {
  misi: "MISI",
  wahana: "Wahana",
  peluncuran: "Peluncuran",
  status: "Status",
  penerbit: "Penerbit",
  diakses: "Diakses",
  tabBaru: " (buka di tab baru)",
  tujuan: "Tujuan",
  bumi: "Bumi",
} as const;

export const MISC: Record<Lang, Widen<typeof MISC_ID>> = {
  id: MISC_ID,
  en: {
    misi: "MISSION",
    wahana: "Spacecraft",
    peluncuran: "Launch",
    status: "Status",
    penerbit: "Publisher",
    diakses: "Accessed",
    tabBaru: " (opens in a new tab)",
    tujuan: "Destinations",
    bumi: "Earth",
  },
};
