import { getSumber } from "./content";

/**
 * Teks dan data halaman Sumber. Referensi berasal dari content-data.json
 * (`sumber`). Kredit gambar dan kredit model 3D BELUM ada di content-data.json:
 * isinya disalin dari frame Figma `Source` dan dari README paket model 3D, dan
 * diusulkan masuk ke content-data.json (lewat PR ke Dhika). Nilai TBD tetap TBD.
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

const KETENTUAN_GAMBAR =
  "Ketentuan penggunaan: TBD (jangan menganggap semua aset NASA bebas ketentuan pihak ketiga)";

const KREDIT_GAMBAR: EntriSumber[] = [
  {
    id: "gambar-aldrin",
    kategori: "gambar",
    labelKategori: "GAMBAR",
    judul:
      "Foto Buzz Aldrin memberi hormat di dekat bendera AS, Apollo 11 (Apollo11_BuzzAldrin_Salutes_USFlag)",
    meta: "Kredit: TBD (cek caption di halaman NASA) · Diakses: TBD",
    url: "https://www.nasa.gov/mission/apollo-11/",
    atribusi: KETENTUAN_GAMBAR,
  },
  {
    id: "gambar-golden-record",
    kategori: "gambar",
    labelKategori: "GAMBAR",
    judul: "Voyager Golden Record (Voyager_Golden_Record)",
    meta: "Kredit: TBD · Diakses: TBD",
    url: "URL halaman sumber: TBD",
    atribusi: KETENTUAN_GAMBAR,
  },
];

const KREDIT_MODEL3D: EntriSumber[] = [
  {
    id: "model-mars",
    kategori: "model3d",
    labelKategori: "MODEL 3D",
    judul: "Model environment Mars v3 (mars_environment_v3.glb)",
    meta: "Pembuat: TBD · Lisensi: TBD",
    url: "Sumber file: repo proyek › NASA 3D Resources/Mars Environment",
    atribusi:
      "GLB 4,6 MB (Draco), 3 kamera. Dibuat di Blender lewat skrip build; asal tekstur: TBD. Belum diuji di GPU atau perangkat nyata.",
  },
  {
    id: "model-moon",
    kategori: "model3d",
    labelKategori: "MODEL 3D",
    judul: "Model environment Moon v4 (lunar_environment_v4.glb + _tablet + _mobile)",
    meta: "Pembuat: TBD · Lisensi: TBD",
    url: "Sumber file: repo proyek › NASA 3D Resources/Lunar Environment dn Earthrise",
    atribusi:
      "GLB per perangkat: 3,7 MB, 2,1 MB, 1,0 MB (Draco). Medan prosedural, bukan data DEM asli. Bumi berupa garis besar sederhana, bukan geografi asli. Belum diuji di WebGL.",
  },
  {
    id: "model-deep-space",
    kategori: "model3d",
    labelKategori: "MODEL 3D",
    judul: "Model environment Deep Space v1 (deep_space_environment_v1.glb)",
    meta: "Pembuat: TBD · Lisensi: TBD",
    url: "Sumber file: repo proyek › NASA 3D Resources/Deep Space Environment",
    atribusi:
      "GLB 2,8 MB (tanpa Draco), 46 ribu segitiga. Tekstur prosedural, bukan data astronomi. Diuji di Three.js (headless), belum di GPU nyata.",
  },
];

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
  return { referensi, gambar: KREDIT_GAMBAR, model3d: KREDIT_MODEL3D };
}
