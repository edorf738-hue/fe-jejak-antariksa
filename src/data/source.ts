import { getSumber } from "./content";
import { CERITA_SLUGS, getCerita } from "./cerita";

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

const DICEK = "15 November 2026";

/** Ringkasan panduan NASA (halaman panduan dibuka 15 November 2026). Bukan jaminan bebas hak cipta untuk setiap aset. */
const LISENSI_NASA =
  "Menurut panduan NASA, konten NASA umumnya tidak berhak cipta di Amerika Serikat, tetapi logo dan materi pihak ketiga dikecualikan; NASA harus dicantumkan sebagai sumber dan tidak boleh tampak mendukung produk. Halaman sumber ini tidak mencantumkan pembatasan khusus. Jangan dianggap bebas hak cipta tanpa memeriksa panduan.";
const LISENSI_BELUM = "Belum ada pernyataan lisensi untuk aset ini. Jangan dianggap bebas hak cipta sebelum diperiksa.";

const bersih = (t: string) => t.replace(/�/g, "—").replace(/\s+/g, " ").trim();
const norm = (u: string) => u.replace(/\/$/, "");

function jenisReferensi(url: string): string {
  if (url.includes("nssdc.gsfc")) return "Basis data NSSDCA";
  if (url.includes("news-release")) return "Siaran pers NASA";
  if (url.includes("/mission/") || url.includes("/missions/")) return "Halaman misi NASA";
  return "Artikel NASA";
}

function referensi(): SumberItem[] {
  const peta = new Map<string, { judul: string; penerbit: string }>();
  for (const s of getSumber()) peta.set(norm(s.url), { judul: bersih(s.judul), penerbit: s.penerbit });
  // sumber yang dipakai di halaman cerita ikut tercatat di sini (tanpa duplikat)
  for (const slug of CERITA_SLUGS) {
    for (const s of getCerita(slug).sumber) {
      if (!peta.has(norm(s.url))) peta.set(norm(s.url), { judul: bersih(s.judul), penerbit: "NASA" });
    }
  }
  return [...peta.entries()].map(([url, v], i) => ({
    id: `referensi-${i}`,
    kategori: "referensi" as const,
    jenis: jenisReferensi(url),
    nama: v.judul,
    penerbit: v.penerbit,
    kredit: v.penerbit,
    url,
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi" as const,
  }));
}

const apollo = (id: string, nama: string): RincianSumber => ({
  nama,
  kredit: "NASA (JSC); fotografer tidak tercatat di metadata",
  url: `https://images.nasa.gov/details/${id.toLowerCase()}`,
});
const jpl = (id: string, nama: string, kredit: string): RincianSumber => ({ nama, kredit, url: `https://images.nasa.gov/details/${id}` });

const MEDIA: SumberItem[] = [
  {
    id: "media-apollo-library",
    kategori: "media",
    jenis: "Foto",
    nama: "Foto Apollo 11 dari NASA Image Library",
    penerbit: "NASA (Johnson Space Center)",
    kredit: "NASA (JSC); fotografer tidak tercatat di metadata",
    url: "https://images.nasa.gov/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    rincian: [
      apollo("AS11-40-5948", "AS11-40-5948: Aldrin setelah memasang EASEP"),
      apollo("AS11-40-5942", "AS11-40-5942: Aldrin membawa seismometer dan retroreflektor"),
      apollo("AS11-37-5545", "AS11-37-5545: Bendera AS terpasang"),
      apollo("AS11-37-5551", "AS11-37-5551: Komponen EASEP"),
      apollo("AS11-40-5875", "AS11-40-5875: Aldrin di samping bendera"),
    ],
  },
  {
    id: "media-apollo-tim",
    kategori: "media",
    jenis: "Foto",
    nama: "Foto Apollo 11 lainnya (dikumpulkan tim)",
    penerbit: "NASA",
    kredit: "NASA; halaman asal dan fotografer per foto belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan: "Foto ini dikumpulkan tim dari sumber NASA, tetapi alamat halaman asal tiap foto belum dicatat. Perlu dicocokkan ke NASA Image Library.",
    rincian: [
      { nama: "Apollo 11 View of the Moon", kredit: "NASA" },
      { nama: "Apollo Astronaut Bootprint", kredit: "NASA (misi dan tanggal foto belum dicatat)" },
      { nama: "Aldrin di dekat tangga Lunar Module", kredit: "NASA" },
      { nama: "Buzz Aldrin di samping Lunar Module", kredit: "NASA" },
      { nama: "Buzz Aldrin di samping eksperimen angin Matahari", kredit: "NASA" },
      { nama: "Buzz Aldrin memberi hormat di dekat bendera AS", kredit: "NASA" },
      { nama: "Plakat peringatan Apollo 11", kredit: "NASA" },
      { nama: "Lunar Module dilihat dari kejauhan", kredit: "NASA" },
      { nama: "Neil Armstrong mengumpulkan sampel Bulan", kredit: "NASA" },
      { nama: "Eksperimen angin Matahari Apollo 11", kredit: "NASA" },
      { nama: "Modul komando Apollo 11 di orbit Bulan", kredit: "NASA" },
    ],
  },
  {
    id: "media-apollo-video",
    kategori: "media",
    jenis: "Video",
    nama: "Video dokumentasi Apollo 11",
    penerbit: "NASA",
    kredit: "NASA; halaman asal tiap video belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan: "Video dikompres ke 480p untuk web; berkas asli utuh di folder aset tim.",
    rincian: [
      { nama: "Pengantar misi Apollo 11", kredit: "NASA" },
      { nama: "Satu langkah kecil (Neil Armstrong)", kredit: "NASA" },
      { nama: "Aldrin menjejak Bulan", kredit: "NASA" },
      { nama: "Mengibarkan bendera", kredit: "NASA" },
      { nama: "Plakat peringatan", kredit: "NASA" },
      { nama: "Peluncuran Saturn V, 1969", kredit: "NASA" },
    ],
  },
  {
    id: "media-mars-jpl",
    kategori: "media",
    jenis: "Citra",
    nama: "Citra Mars: Spirit dan Opportunity",
    penerbit: "NASA/JPL-Caltech",
    kredit: "Beragam (lihat rincian)",
    url: "https://images.nasa.gov/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    rincian: [
      jpl("PIA05040", "PIA05040: Spirit di Gusev Crater", "NASA/JPL-Caltech"),
      jpl("PIA11990", "PIA11990: Spirit di sekitar Home Plate", "NASA/JPL-Caltech"),
      jpl("PIA12002", "PIA12002: Spirit tergelincir di tanah lunak", "NASA/JPL-Caltech"),
      jpl("PIA17759", "PIA17759: Foto diri Opportunity", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      jpl("PIA07402", "PIA07402: Serpihan pelindung panas dan Heat Shield Rock", "NASA/JPL/Cornell"),
      jpl("PIA07324", "PIA07324: Panorama Opportunity sol 354", "NASA/JPL"),
      jpl("PIA16923", "PIA16923: Kawah Endeavour", "NASA/JPL-Caltech"),
      jpl("PIA22074", "PIA22074: Perseverance Valley", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      jpl("PIA09364", "PIA09364: Meridiani Planum (HiRISE)", "NASA/JPL/Univ. of Arizona"),
    ],
  },
  {
    id: "media-voyager-jpl",
    kategori: "media",
    jenis: "Citra",
    nama: "Citra Voyager: Uranus, Neptunus, dan Golden Record",
    penerbit: "NASA/JPL-Caltech",
    kredit: "Beragam (lihat rincian)",
    url: "https://images.nasa.gov/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    rincian: [
      jpl("PIA18182", "PIA18182: Uranus dilihat Voyager 2", "NASA/JPL-Caltech"),
      jpl("PIA02210", "PIA02210: Neptunus", "NASA/JPL"),
      jpl("PIA00049", "PIA00049: Neptunus, Bintik Gelap Besar", "NASA/JPL"),
      jpl("PIA21839", "PIA21839: Voyager di ruang antarbintang (konsep seniman)", "NASA/JPL-Caltech"),
      jpl("PIA21741", "PIA21741: Persiapan Golden Record", "NASA/JPL-Caltech"),
    ],
  },
  {
    id: "media-voyager-tim",
    kategori: "media",
    jenis: "Foto",
    nama: "Foto Voyager lainnya (dikumpulkan tim)",
    penerbit: "NASA",
    kredit: "NASA; halaman asal dan kredit rinci per foto belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    rincian: [
      { nama: "Voyager Golden Record (foto piringan dan sampul)", kredit: "NASA" },
      { nama: "Jupiter dan Bintik Merah Besar", kredit: "NASA" },
      { nama: "Mosaik bulan Io", kredit: "NASA" },
      { nama: "Pale Blue Dot, ditinjau ulang", kredit: "NASA" },
      { nama: "Perubahan atmosfer Saturnus", kredit: "NASA" },
      { nama: "Saturnus dalam perjalanan Voyager", kredit: "NASA" },
      { nama: "Detail cincin Saturnus", kredit: "NASA" },
      { nama: "Voyager 2, penjelajah antarbintang (ilustrasi)", kredit: "NASA" },
    ],
  },
  {
    id: "media-golden-sampul",
    kategori: "media",
    jenis: "Gambar",
    nama: "Sampul Golden Record",
    penerbit: "NASA Science",
    kredit: "Tidak dinyatakan di halaman sumber",
    url: "https://science.nasa.gov/mission/voyager/golden-record-cover/",
    lisensi:
      "Halaman sumber tidak memuat kredit atau pernyataan hak cipta untuk gambar sampul. Halaman Golden Record Contents menyatakan 115 gambar di piringan dilindungi hak cipta dan tidak dipakai di situs ini.",
    diakses: DICEK,
    status: "perlu-verifikasi",
    rincian: [
      { nama: "Piring sampul Golden Record", kredit: "Tidak dinyatakan" },
      { nama: "Diagram sampul dengan instruksi", kredit: "Tidak dinyatakan" },
      { nama: "Penjelasan diagram sampul", kredit: "Tidak dinyatakan" },
    ],
  },
  {
    id: "media-hero-beranda",
    kategori: "media",
    jenis: "Foto",
    nama: "Latar hero Beranda: Buzz Aldrin di samping bendera AS (Apollo 11)",
    penerbit: "NASA",
    kredit: "NASA; nomor foto dan fotografer belum dicatat di berkas",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan:
      "Foto asli Apollo 11 dari paket aset NASA tim (Apollo-11-Buzz-Aldrin-Lunar-Module.jpg), dipotong 16:9. Nomor foto di NASA Image Library belum dicocokkan. Menggantikan gambar hero buatan AI.",
  },
  {
    id: "media-latar-beranda",
    kategori: "media",
    jenis: "Foto",
    nama: "Latar Pilih Lingkungan: matahari terbit di atas lengkung Bumi (ISS)",
    penerbit: "NASA",
    kredit: "NASA; fotografer tidak tercatat di halaman sumber",
    url: "https://www.nasa.gov/image-article/suns-first-rays-peek-above-earths-limb",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan:
      "\"The sun's first rays peek above Earth's limb\", iss059e027932, 21 April 2019, di atas Indonesia. Dipotong (perangkat ISS di tepi kanan dibuang), dicerahkan, dan dianimasikan dengan kode. Menggantikan latar Bumi buatan AI.",
  },
  {
    id: "media-header-cerita",
    kategori: "media",
    jenis: "Foto",
    nama: "Header Cerita: \"Earthrise\", Apollo 8 (AS08-14-2383)",
    penerbit: "NASA (Johnson Space Center)",
    kredit: "NASA (JSC); fotografer tidak tercatat di metadata",
    url: "https://images.nasa.gov/details/as08-14-2383",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan:
      "Foto 24 Desember 1968: Bumi terbit di atas cakrawala Bulan. Dipotong dan diletakkan di kanvas gelap (sisi kiri cakrawala dipudarkan, bintang kecil buatan kode). Menggantikan header buatan AI.",
  },
  {
    id: "media-latar-peta",
    kategori: "media",
    jenis: "Citra",
    nama: "Header dan latar Peta Perjalanan: Galaxy Panorama (Spitzer)",
    penerbit: "NASA's Goddard Space Flight Center",
    kredit: "NASA/JPL-Caltech",
    url: "https://svs.gsfc.nasa.gov/11543",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan:
      "Satu potongan pita Bima Sakti dari s3-original.jpg (mosaik inframerah Spitzer), digelapkan, dimiringkan, dan dihaluskan. Bintang kecil dan gradien dibuat dengan kode, bukan citra NASA dan bukan AI generatif.",
  },
  {
    id: "media-latar-sumber",
    kategori: "media",
    jenis: "Foto",
    nama: "Header dan latar Sumber: \"Pale Blue Dot\" ditinjau ulang (Voyager 1)",
    penerbit: "NASA/JPL-Caltech",
    kredit: "NASA/JPL-Caltech; nomor PIA belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan:
      "Berkas Voyager_Pale_Blue_Dot_Revisited.jpg dari paket aset NASA tim; halaman asalnya belum dicatat. Dipotong dan digelapkan: header memakai bagian berkas cahaya dan titik Bumi, latar memakai sisi kiri foto.",
  },
  {
    id: "media-tekstur-bulan",
    kategori: "media",
    jenis: "Tekstur",
    nama: "Tekstur Bulan pada planet di Beranda dan Peta Perjalanan",
    penerbit: "NASA's Goddard Space Flight Center",
    kredit: "NASA's Goddard Space Flight Center; produser Dan Gallagher (eMITS), penyedia data Ernie Wright (STC); citra Lunar Reconnaissance Orbiter",
    url: "https://svs.gsfc.nasa.gov/14959/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan:
      "Dari moon_small.glb (\"Moon 3D Models for Web, AR, and Animation\", NASA SVS #14959). Tekstur cube-map diubah menjadi peta ekuirektangular 2048x1024 dan dipakai sebagai tekstur bola di shader WebGL. Planet Mars dan raksasa es bercincin dibuat dengan kode (bukan citra atau data NASA).",
  },
  {
    id: "media-desain",
    kategori: "media",
    jenis: "Gambar desain",
    nama: "Gambar desain tim: header, latar, penanda peta, kartu lingkungan",
    penerbit: "Tim WAYANG ANTARIKSA",
    kredit: "Tim desain proyek",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan:
      "Dibuat tim lewat desain Figma. Asal citra dasar di dalamnya (mis. bagian yang berasal dari foto NASA) belum dicatat. Header Beranda, Cerita, Peta Perjalanan, dan Sumber kini memakai foto NASA (lihat entri tersendiri).",
  },
  {
    id: "media-bab-1",
    kategori: "media",
    jenis: "Gambar konsep",
    nama: "Gambar konsep Bab 1 (halaman imersif Bab 1)",
    penerbit: "Belum diketahui",
    kredit: "Belum diketahui",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "belum-tersedia",
  },
  {
    id: "media-logo-space-apps",
    kategori: "media",
    jenis: "Logo",
    nama: "Logo NASA Space Apps Challenge",
    penerbit: "NASA Space Apps Challenge",
    kredit: "NASA Space Apps Challenge",
    url: null,
    lisensi:
      "Menurut panduan NASA, logo dan identitas NASA dikecualikan dari konten yang umumnya tidak berhak cipta. Izin penggunaan logo perlu dicek.",
    diakses: null,
    status: "perlu-verifikasi",
  },
];

const MODEL3D: SumberItem[] = [
  {
    id: "model-lm",
    kategori: "model3d",
    jenis: "Model 3D (.glb)",
    nama: "Apollo Lunar Module",
    penerbit: "NASA",
    kredit: "NASA/Michael D. Carbajal",
    url: "https://science.nasa.gov/3d-resources/apollo-lunar-module/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan: "Model umum, bukan model khusus Eagle. Berkas 700 KB; dipakai di lingkungan Moon (Tahap turun dan Tahap naik).",
  },
  {
    id: "model-mer-static",
    kategori: "model3d",
    jenis: "Model 3D (.glb)",
    nama: "Mars Exploration Rovers 3D Model (MER_static)",
    penerbit: "NASA Science",
    kredit: "Tidak tertulis di halaman unduhan; halaman kembar menyebut NASA/JPL-Caltech",
    url: "https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "perlu-verifikasi",
    catatan:
      "Satu mesh satu rover (Spirit dan Opportunity kembar). Halaman Spirit and Opportunity Rover 3D Model di mars.nasa.gov menawarkan berkas bernama sama (11,36 MB) dengan kredit NASA/JPL-Caltech, tetapi berkas kami berbeda 160 byte. Dikompres ke 0,7 MB untuk web.",
  },
  {
    id: "model-mer-b",
    kategori: "model3d",
    jenis: "Model 3D (.glb)",
    nama: "Mars Exploration Rover: Opportunity (MER-B)",
    penerbit: "NASA",
    kredit: "NASA/Ames Research Center",
    url: "https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan: "Berkas 36 KB, bentuk sederhana tanpa tekstur. Dipakai untuk Rover Opportunity.",
  },
  {
    id: "model-voyager-b",
    kategori: "model3d",
    jenis: "Model 3D (.glb)",
    nama: "Voyager Probe (B)",
    penerbit: "NASA",
    kredit: "NASA/Michael D. Carbajal",
    url: "https://science.nasa.gov/3d-resources/voyager-probe-b/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan: "Model umum Voyager (halaman menyebut misi Voyager 1). Dipakai untuk Voyager 1.",
  },
  {
    id: "model-voyager-a",
    kategori: "model3d",
    jenis: "Model 3D (.glb)",
    nama: "Voyager Probe (A)",
    penerbit: "NASA",
    kredit: "NASA/Christopher R. Meaney",
    url: "https://science.nasa.gov/3d-resources/voyager-probe-a/",
    lisensi: LISENSI_NASA,
    diakses: DICEK,
    status: "terverifikasi",
    catatan: "Halaman sumber mencantumkan misi Viking 1 untuk model ini, padahal modelnya Voyager; dipakai untuk Voyager 2 sebagai model umum.",
  },
  {
    id: "env-moon",
    kategori: "model3d",
    jenis: "Lingkungan 3D (.glb)",
    nama: "Lingkungan Moon (versi 5)",
    penerbit: "Tim WAYANG ANTARIKSA",
    kredit: "Nama pembuat belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan: "Dibuat di Blender, tiga versi per perangkat (5,15, 1,85, dan 1,04 MiB, Draco). Medan prosedural, bukan data DEM asli. Bumi berupa garis besar sederhana, bukan geografi asli.",
  },
  {
    id: "env-mars",
    kategori: "model3d",
    jenis: "Lingkungan 3D (.glb)",
    nama: "Lingkungan Mars (versi 3)",
    penerbit: "Tim WAYANG ANTARIKSA",
    kredit: "Nama pembuat belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan: "Dibuat di Blender lewat skrip build, 4,6 MB (Draco), tiga kamera. Asal tekstur belum dicatat.",
  },
  {
    id: "env-deep-space",
    kategori: "model3d",
    jenis: "Lingkungan 3D (.glb)",
    nama: "Lingkungan Deep Space (versi 1)",
    penerbit: "Tim WAYANG ANTARIKSA",
    kredit: "Nama pembuat belum dicatat",
    url: null,
    lisensi: LISENSI_BELUM,
    diakses: null,
    status: "perlu-verifikasi",
    catatan: "2,8 MB, tanpa Draco. Tekstur prosedural, bukan data astronomi.",
  },
];

export function getKatalogSumber(): Record<KategoriSumber, SumberItem[]> {
  return { referensi: referensi(), media: MEDIA, model3d: MODEL3D };
}
