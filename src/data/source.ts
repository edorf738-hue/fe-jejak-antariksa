import { DEFAULT_LANG, type Lang, type Widen } from "../lib/i18n";
import { KATALOG_API } from "./api";

/**
 * Katalog halaman Sumber: tiga kategori (Referensi, Kredit Media, Model 3D). Setiap item punya status verifikasi:
 *  - terverifikasi: halaman asal sudah dibuka dan dicek (URL aktif, judul cocok, kredit tercantum di halaman asal);
 *  - perlu-verifikasi: ada bagian yang belum bisa dipastikan (mis. kredit tidak tertulis di halaman asal, atau asal file
 *    belum dicatat per berkas);
 *  - belum-tersedia: asal atau kredit belum diketahui sama sekali.
 * Tidak ada kredit, lisensi, pembuat, atau URL yang dikarang: yang tidak diketahui ditulis apa adanya.
 * URL dan judul dicek 15 November 2026 (semua balas 200 dan judul halaman cocok).
 * Dua bahasa (id, en): teks katalog dibuat lewat `L(id, en)` di `buatKatalog(lang)`.
 */
const COPY_ID = {
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
  ui: {
    kategoriAria: "Kategori sumber",
    artiStatusAria: "Arti status",
    detail: "Detail Sumber",
    tutup: "Tutup",
    tutupAria: "Tutup detail sumber",
    kredit: "Kredit",
    penerbit: "Penerbit",
    urlAsal: "URL halaman asal",
    lisensi: "Lisensi atau ketentuan penggunaan",
    tanggalAkses: "Tanggal akses",
    belumTersedia: "Belum tersedia",
    belumDicatat: "Belum dicatat",
    tabBaru: " (buka di tab baru)",
    panduanNasa: "Panduan NASA",
    isiKelompok: "Isi kelompok ini",
    berkas: "berkas",
  },
} as const;

const COPY_EN: Widen<typeof COPY_ID> = {
  header: {
    eyebrow: "Source",
    judul: "Sources",
    deskripsi: "References, publishers, and credits behind every piece of information and media.",
  },
  tab: {
    referensi: "References",
    media: "Media Credits",
    model3d: "3D Models",
  },
  status: {
    terverifikasi: { label: "Verified", arti: "The source page was checked and its credit is listed." },
    "perlu-verifikasi": { label: "Needs verification", arti: "Some parts could not be confirmed." },
    "belum-tersedia": { label: "Information not available", arti: "The origin or credit is not known." },
  },
  ui: {
    kategoriAria: "Source categories",
    artiStatusAria: "Meaning of statuses",
    detail: "Source Details",
    tutup: "Close",
    tutupAria: "Close source details",
    kredit: "Credit",
    penerbit: "Publisher",
    urlAsal: "Source page URL",
    lisensi: "License or terms of use",
    tanggalAkses: "Date accessed",
    belumTersedia: "Not available yet",
    belumDicatat: "Not recorded yet",
    tabBaru: " (opens in a new tab)",
    panduanNasa: "NASA guidelines",
    isiKelompok: "Contents of this group",
    berkas: "files",
  },
};

export const SOURCE_COPY: Record<Lang, Widen<typeof COPY_ID>> = { id: COPY_ID, en: COPY_EN };

export type KategoriSumber = "referensi" | "media" | "model3d";
export type StatusSumber = keyof typeof COPY_ID.status;

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


function buatKatalog(lang: Lang): Record<KategoriSumber, SumberItem[]> {
  const L = (id: string, en: string) => (lang === "en" ? en : id);

  /** Ringkasan panduan NASA (halaman panduan dibuka 15 November 2026). Bukan jaminan bebas hak cipta untuk setiap aset. */
  const LISENSI_NASA = L(
    "Menurut panduan NASA, konten NASA umumnya tidak berhak cipta di Amerika Serikat, tetapi logo dan materi pihak ketiga dikecualikan; NASA harus dicantumkan sebagai sumber dan tidak boleh tampak mendukung produk. Halaman sumber ini tidak mencantumkan pembatasan khusus. Jangan dianggap bebas hak cipta tanpa memeriksa panduan.",
    "According to NASA's guidelines, NASA content is generally not copyrighted in the United States, but logos and third-party material are excluded; NASA must be credited as the source and must not appear to endorse products. This source page lists no special restrictions. Do not assume it is free of copyright without checking the guidelines.",
  );
  const LISENSI_BELUM = L(
    "Belum ada pernyataan lisensi untuk aset ini. Jangan dianggap bebas hak cipta sebelum diperiksa.",
    "There is no license statement for this asset yet. Do not assume it is free of copyright before checking.",
  );

  const jenisReferensi = (url: string): string => {
    if (url.includes("nssdc.gsfc")) return L("Basis data NSSDCA", "NSSDCA database");
    if (url.includes("news-release")) return L("Siaran pers NASA", "NASA press release");
    if (url.includes("/mission/") || url.includes("/missions/")) return L("Halaman misi NASA", "NASA mission page");
    return L("Artikel NASA", "NASA article");
  };

  /** Referensi dibaca dari API (nama, penerbit, URL, status); English hanya menerjemahkan jenis dan lisensi standar. */
  const referensi = (): SumberItem[] =>
    KATALOG_API.filter((i) => i.kategori === "referensi").map((a) =>
      lang === "id"
        ? a
        : { ...a, jenis: jenisReferensi(a.url ?? ""), lisensi: a.lisensi.startsWith("Menurut panduan NASA") ? LISENSI_NASA : a.lisensi },
    );

  const KREDIT_JSC = L("NASA (JSC); fotografer tidak tercatat di metadata", "NASA (JSC); photographer not recorded in the metadata");
  const apollo = (id: string, nama: string): RincianSumber => ({
    nama,
    kredit: KREDIT_JSC,
    url: `https://images.nasa.gov/details/${id.toLowerCase()}`,
  });
  const jpl = (id: string, nama: string, kredit: string): RincianSumber => ({ nama, kredit, url: `https://images.nasa.gov/details/${id}` });
  const JENIS_FOTO = L("Foto", "Photo");
  const JENIS_CITRA = L("Citra", "Imagery");
  const JENIS_MODEL = L("Model 3D (.glb)", "3D model (.glb)");
  const JENIS_LINGK = L("Lingkungan 3D (.glb)", "3D environment (.glb)");

  const MEDIA: SumberItem[] = [
    {
      id: "media-apollo-library",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Foto Apollo 11 dari NASA Image Library", "Apollo 11 photos from the NASA Image Library"),
      penerbit: "NASA (Johnson Space Center)",
      kredit: KREDIT_JSC,
      url: "https://images.nasa.gov/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      rincian: [
        apollo("AS11-40-5948", L("AS11-40-5948: Aldrin setelah memasang EASEP", "AS11-40-5948: Aldrin after deploying the EASEP")),
        apollo("AS11-40-5942", L("AS11-40-5942: Aldrin membawa seismometer dan retroreflektor", "AS11-40-5942: Aldrin carrying the seismometer and retroreflector")),
        apollo("AS11-37-5545", L("AS11-37-5545: Bendera AS terpasang", "AS11-37-5545: The U.S. flag planted")),
        apollo("AS11-37-5551", L("AS11-37-5551: Komponen EASEP", "AS11-37-5551: EASEP components")),
        apollo("AS11-40-5875", L("AS11-40-5875: Aldrin di samping bendera", "AS11-40-5875: Aldrin beside the flag")),
      ],
    },
    {
      id: "media-apollo-tim",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Foto Apollo 11 lainnya (dikumpulkan tim)", "Other Apollo 11 photos (collected by the team)"),
      penerbit: "NASA",
      kredit: L("NASA; halaman asal dan fotografer per foto belum dicatat", "NASA; source page and photographer per photo not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Foto ini dikumpulkan tim dari sumber NASA, tetapi alamat halaman asal tiap foto belum dicatat. Perlu dicocokkan ke NASA Image Library.",
        "The team collected these photos from NASA sources, but the source page address of each photo has not been recorded. They need to be matched to the NASA Image Library.",
      ),
      rincian: [
        { nama: "Apollo 11 View of the Moon", kredit: "NASA" },
        { nama: "Apollo Astronaut Bootprint", kredit: L("NASA (misi dan tanggal foto belum dicatat)", "NASA (mission and photo date not recorded)") },
        { nama: L("Aldrin di dekat tangga Lunar Module", "Aldrin near the Lunar Module ladder"), kredit: "NASA" },
        { nama: L("Buzz Aldrin di samping Lunar Module", "Buzz Aldrin beside the Lunar Module"), kredit: "NASA" },
        { nama: L("Buzz Aldrin di samping eksperimen angin Matahari", "Buzz Aldrin beside the solar wind experiment"), kredit: "NASA" },
        { nama: L("Buzz Aldrin memberi hormat di dekat bendera AS", "Buzz Aldrin saluting near the U.S. flag"), kredit: "NASA" },
        { nama: L("Plakat peringatan Apollo 11", "The Apollo 11 commemorative plaque"), kredit: "NASA" },
        { nama: L("Lunar Module dilihat dari kejauhan", "The Lunar Module seen from a distance"), kredit: "NASA" },
        { nama: L("Neil Armstrong mengumpulkan sampel Bulan", "Neil Armstrong collecting lunar samples"), kredit: "NASA" },
        { nama: L("Eksperimen angin Matahari Apollo 11", "The Apollo 11 solar wind experiment"), kredit: "NASA" },
        { nama: L("Modul komando Apollo 11 di orbit Bulan", "The Apollo 11 command module in lunar orbit"), kredit: "NASA" },
      ],
    },
    {
      id: "media-apollo-video",
      kategori: "media",
      jenis: "Video",
      nama: L("Video dokumentasi Apollo 11", "Apollo 11 documentary videos"),
      penerbit: "NASA",
      kredit: L("NASA; halaman asal tiap video belum dicatat", "NASA; source page of each video not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Video dikompres ke 480p untuk web; berkas asli utuh di folder aset tim.",
        "The videos are compressed to 480p for the web; the full original files are in the team's asset folder.",
      ),
      rincian: [
        { nama: L("Pengantar misi Apollo 11", "Introduction to the Apollo 11 mission"), kredit: "NASA" },
        { nama: L("Satu langkah kecil (Neil Armstrong)", "One small step (Neil Armstrong)"), kredit: "NASA" },
        { nama: L("Aldrin menjejak Bulan", "Aldrin steps onto the Moon"), kredit: "NASA" },
        { nama: L("Mengibarkan bendera", "Raising the flag"), kredit: "NASA" },
        { nama: L("Plakat peringatan", "The commemorative plaque"), kredit: "NASA" },
        { nama: L("Peluncuran Saturn V, 1969", "Saturn V launch, 1969"), kredit: "NASA" },
      ],
    },
    {
      id: "media-mars-jpl",
      kategori: "media",
      jenis: JENIS_CITRA,
      nama: L("Citra Mars: Spirit dan Opportunity", "Mars imagery: Spirit and Opportunity"),
      penerbit: "NASA/JPL-Caltech",
      kredit: L("Beragam (lihat rincian)", "Various (see details)"),
      url: "https://images.nasa.gov/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      rincian: [
        jpl("PIA05040", L("PIA05040: Spirit di Gusev Crater", "PIA05040: Spirit in Gusev Crater"), "NASA/JPL-Caltech"),
        jpl("PIA11990", L("PIA11990: Spirit di sekitar Home Plate", "PIA11990: Spirit near Home Plate"), "NASA/JPL-Caltech"),
        jpl("PIA12002", L("PIA12002: Spirit tergelincir di tanah lunak", "PIA12002: Spirit slipping in soft soil"), "NASA/JPL-Caltech"),
        jpl("PIA17759", L("PIA17759: Foto diri Opportunity", "PIA17759: Opportunity self-portrait"), "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
        jpl("PIA07402", L("PIA07402: Serpihan pelindung panas dan Heat Shield Rock", "PIA07402: Heat shield fragments and Heat Shield Rock"), "NASA/JPL/Cornell"),
        jpl("PIA07324", L("PIA07324: Panorama Opportunity sol 354", "PIA07324: Opportunity panorama, sol 354"), "NASA/JPL"),
        jpl("PIA16923", L("PIA16923: Kawah Endeavour", "PIA16923: Endeavour Crater"), "NASA/JPL-Caltech"),
        jpl("PIA22074", "PIA22074: Perseverance Valley", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
        jpl("PIA09364", "PIA09364: Meridiani Planum (HiRISE)", "NASA/JPL/Univ. of Arizona"),
      ],
    },
    {
      id: "media-voyager-jpl",
      kategori: "media",
      jenis: JENIS_CITRA,
      nama: L("Citra Voyager: Uranus, Neptunus, dan Golden Record", "Voyager imagery: Uranus, Neptune, and the Golden Record"),
      penerbit: "NASA/JPL-Caltech",
      kredit: L("Beragam (lihat rincian)", "Various (see details)"),
      url: "https://images.nasa.gov/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      rincian: [
        jpl("PIA18182", L("PIA18182: Uranus dilihat Voyager 2", "PIA18182: Uranus as seen by Voyager 2"), "NASA/JPL-Caltech"),
        jpl("PIA02210", L("PIA02210: Neptunus", "PIA02210: Neptune"), "NASA/JPL"),
        jpl("PIA00049", L("PIA00049: Neptunus, Bintik Gelap Besar", "PIA00049: Neptune, the Great Dark Spot"), "NASA/JPL"),
        jpl("PIA21839", L("PIA21839: Voyager di ruang antarbintang (konsep seniman)", "PIA21839: Voyager in interstellar space (artist's concept)"), "NASA/JPL-Caltech"),
        jpl("PIA21741", L("PIA21741: Persiapan Golden Record", "PIA21741: Preparing the Golden Record"), "NASA/JPL-Caltech"),
      ],
    },
    {
      id: "media-voyager-tim",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Foto Voyager lainnya (dikumpulkan tim)", "Other Voyager photos (collected by the team)"),
      penerbit: "NASA",
      kredit: L("NASA; halaman asal dan kredit rinci per foto belum dicatat", "NASA; source page and detailed credit per photo not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      rincian: [
        { nama: L("Voyager Golden Record (foto piringan dan sampul)", "Voyager Golden Record (photos of the disc and cover)"), kredit: "NASA" },
        { nama: L("Jupiter dan Bintik Merah Besar", "Jupiter and the Great Red Spot"), kredit: "NASA" },
        { nama: L("Mosaik bulan Io", "Mosaic of the moon Io"), kredit: "NASA" },
        { nama: L("Pale Blue Dot, ditinjau ulang", "Pale Blue Dot, revisited"), kredit: "NASA" },
        { nama: L("Perubahan atmosfer Saturnus", "Changes in Saturn's atmosphere"), kredit: "NASA" },
        { nama: L("Saturnus dalam perjalanan Voyager", "Saturn on Voyager's journey"), kredit: "NASA" },
        { nama: L("Detail cincin Saturnus", "Detail of Saturn's rings"), kredit: "NASA" },
        { nama: L("Voyager 2, penjelajah antarbintang (ilustrasi)", "Voyager 2, the interstellar traveler (illustration)"), kredit: "NASA" },
      ],
    },
    {
      id: "media-golden-sampul",
      kategori: "media",
      jenis: L("Gambar", "Image"),
      nama: L("Sampul Golden Record", "Golden Record cover"),
      penerbit: "NASA Science",
      kredit: L("Tidak dinyatakan di halaman sumber", "Not stated on the source page"),
      url: "https://science.nasa.gov/mission/voyager/golden-record-cover/",
      lisensi: L(
        "Halaman sumber tidak memuat kredit atau pernyataan hak cipta untuk gambar sampul. Halaman Golden Record Contents menyatakan 115 gambar di piringan dilindungi hak cipta dan tidak dipakai di situs ini.",
        "The source page gives no credit or copyright statement for the cover image. The Golden Record Contents page states that the 115 images on the disc are copyright protected, and they are not used on this site.",
      ),
      diakses: DICEK,
      status: "perlu-verifikasi",
      rincian: [
        { nama: L("Piring sampul Golden Record", "Golden Record cover plate"), kredit: L("Tidak dinyatakan", "Not stated") },
        { nama: L("Diagram sampul dengan instruksi", "Cover diagram with instructions"), kredit: L("Tidak dinyatakan", "Not stated") },
        { nama: L("Penjelasan diagram sampul", "Explanation of the cover diagram"), kredit: L("Tidak dinyatakan", "Not stated") },
      ],
    },
    {
      id: "media-hero-beranda",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Latar hero Beranda: Buzz Aldrin di samping bendera AS (Apollo 11)", "Home hero background: Buzz Aldrin beside the U.S. flag (Apollo 11)"),
      penerbit: "NASA",
      kredit: L("NASA; nomor foto dan fotografer belum dicatat di berkas", "NASA; photo number and photographer not recorded in the file"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Foto asli Apollo 11 dari paket aset NASA tim (Apollo-11-Buzz-Aldrin-Lunar-Module.jpg), dipotong 16:9. Nomor foto di NASA Image Library belum dicocokkan. Menggantikan gambar hero buatan AI.",
        "An original Apollo 11 photo from the team's NASA asset pack (Apollo-11-Buzz-Aldrin-Lunar-Module.jpg), cropped to 16:9. The photo number in the NASA Image Library has not been matched yet. It replaces the earlier AI-generated hero image.",
      ),
    },
    {
      id: "media-latar-beranda",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Latar Pilih Lingkungan: matahari terbit di atas lengkung Bumi (ISS)", "Choose an Environment background: sunrise above Earth's limb (ISS)"),
      penerbit: "NASA",
      kredit: L("NASA; fotografer tidak tercatat di halaman sumber", "NASA; photographer not recorded on the source page"),
      url: "https://www.nasa.gov/image-article/suns-first-rays-peek-above-earths-limb",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "\"The sun's first rays peek above Earth's limb\", iss059e027932, 21 April 2019, di atas Indonesia. Dipotong (perangkat ISS di tepi kanan dibuang), dicerahkan, dan dianimasikan dengan kode. Menggantikan latar Bumi buatan AI.",
        "\"The sun's first rays peek above Earth's limb\", iss059e027932, 21 April 2019, over Indonesia. Cropped (the ISS hardware on the right edge removed), slightly brightened, and animated with code. It replaces the earlier AI-generated Earth background.",
      ),
    },
    {
      id: "media-header-cerita",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Header Cerita: \"Earthrise\", Apollo 8 (AS08-14-2383)", "Story header: \"Earthrise\", Apollo 8 (AS08-14-2383)"),
      penerbit: "NASA (Johnson Space Center)",
      kredit: KREDIT_JSC,
      url: "https://images.nasa.gov/details/as08-14-2383",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Foto 24 Desember 1968: Bumi terbit di atas cakrawala Bulan. Dipotong dan diletakkan di kanvas gelap (sisi kiri cakrawala dipudarkan, bintang kecil buatan kode). Menggantikan header buatan AI.",
        "A photo from 24 December 1968: Earth rising above the lunar horizon. Cropped and placed on a dark canvas (the left side of the horizon faded, small stars made with code). It replaces the earlier AI-generated header.",
      ),
    },
    {
      id: "media-latar-peta",
      kategori: "media",
      jenis: JENIS_CITRA,
      nama: L("Header dan latar Peta Perjalanan: Galaxy Panorama (Spitzer)", "Journey Map header and background: Galaxy Panorama (Spitzer)"),
      penerbit: "NASA's Goddard Space Flight Center",
      kredit: "NASA/JPL-Caltech",
      url: "https://svs.gsfc.nasa.gov/11543",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Satu potongan pita Bima Sakti dari s3-original.jpg (mosaik inframerah Spitzer), digelapkan, dimiringkan, dan dihaluskan. Bintang kecil dan gradien dibuat dengan kode, bukan citra NASA dan bukan AI generatif.",
        "One slice of the Milky Way band from s3-original.jpg (a Spitzer infrared mosaic), darkened, tilted, and softened. The small stars and gradients are made with code: not NASA imagery and not generative AI.",
      ),
    },
    {
      id: "media-latar-sumber",
      kategori: "media",
      jenis: JENIS_FOTO,
      nama: L("Header dan latar Sumber: \"Pale Blue Dot\" ditinjau ulang (Voyager 1)", "Sources header and background: \"Pale Blue Dot\" revisited (Voyager 1)"),
      penerbit: "NASA/JPL-Caltech",
      kredit: L("NASA/JPL-Caltech; nomor PIA belum dicatat", "NASA/JPL-Caltech; PIA number not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Berkas Voyager_Pale_Blue_Dot_Revisited.jpg dari paket aset NASA tim; halaman asalnya belum dicatat. Dipotong dan digelapkan: header memakai bagian berkas cahaya dan titik Bumi, latar memakai sisi kiri foto.",
        "The file Voyager_Pale_Blue_Dot_Revisited.jpg from the team's NASA asset pack; its source page has not been recorded. Cropped and darkened: the header uses the light beam and the dot of Earth, the background uses the left side of the photo.",
      ),
    },
    {
      id: "media-tekstur-bulan",
      kategori: "media",
      jenis: L("Tekstur", "Texture"),
      nama: L("Tekstur Bulan pada planet di Beranda dan Peta Perjalanan", "Moon texture on the planets in Home and the Journey Map"),
      penerbit: "NASA's Goddard Space Flight Center",
      kredit: L(
        "NASA's Goddard Space Flight Center; produser Dan Gallagher (eMITS), penyedia data Ernie Wright (STC); citra Lunar Reconnaissance Orbiter",
        "NASA's Goddard Space Flight Center; producer Dan Gallagher (eMITS), data provider Ernie Wright (STC); Lunar Reconnaissance Orbiter imagery",
      ),
      url: "https://svs.gsfc.nasa.gov/14959/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Dari moon_small.glb (\"Moon 3D Models for Web, AR, and Animation\", NASA SVS #14959). Tekstur cube-map diubah menjadi peta ekuirektangular 2048x1024 dan dipakai sebagai tekstur bola di shader WebGL. Planet Mars dan raksasa es bercincin dibuat dengan kode (bukan citra atau data NASA).",
        "From moon_small.glb (\"Moon 3D Models for Web, AR, and Animation\", NASA SVS #14959). The cube-map texture was converted into a 2048x1024 equirectangular map and used as a sphere texture in a WebGL shader. The Mars and ringed ice giant planets are made with code (not NASA imagery or data).",
      ),
    },
    {
      id: "media-desain",
      kategori: "media",
      jenis: L("Gambar desain", "Design image"),
      nama: L("Gambar desain tim: header, latar, penanda peta, kartu lingkungan", "Team design images: headers, backgrounds, map markers, environment cards"),
      penerbit: "Tim JEJAK ANTARIKSA",
      kredit: L("Tim desain proyek", "The project's design team"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Dibuat tim lewat desain Figma. Asal citra dasar di dalamnya (mis. bagian yang berasal dari foto NASA) belum dicatat. Header Beranda, Cerita, Peta Perjalanan, dan Sumber kini memakai foto NASA (lihat entri tersendiri).",
        "Made by the team in Figma. The origin of the base imagery inside them (for example parts that come from NASA photos) has not been recorded. The headers of Home, Story, Journey Map, and Sources now use NASA photos (see their own entries).",
      ),
    },
    {
      id: "media-bab-1",
      kategori: "media",
      jenis: L("Gambar konsep", "Concept image"),
      nama: L("Gambar konsep Bab 1 (halaman imersif Bab 1)", "Chapter 1 concept image (the Chapter 1 immersive page)"),
      penerbit: L("Belum diketahui", "Unknown"),
      kredit: L("Belum diketahui", "Unknown"),
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
      lisensi: L(
        "Menurut panduan NASA, logo dan identitas NASA dikecualikan dari konten yang umumnya tidak berhak cipta. Izin penggunaan logo perlu dicek.",
        "According to NASA's guidelines, NASA logos and identity are excluded from content that is generally not copyrighted. Permission to use the logo needs to be checked.",
      ),
      diakses: null,
      status: "perlu-verifikasi",
    },
  ];

  const MODEL3D: SumberItem[] = [
    {
      id: "model-lm",
      kategori: "model3d",
      jenis: JENIS_MODEL,
      nama: "Apollo Lunar Module",
      penerbit: "NASA",
      kredit: "NASA/Michael D. Carbajal",
      url: "https://science.nasa.gov/3d-resources/apollo-lunar-module/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Model umum, bukan model khusus Eagle. Berkas 700 KB; dipakai di lingkungan Moon (Tahap turun dan Tahap naik).",
        "A generic model, not an Eagle-specific model. A 700 KB file; used in the Moon environment (the descent and ascent stages).",
      ),
    },
    {
      id: "model-mer-static",
      kategori: "model3d",
      jenis: JENIS_MODEL,
      nama: "Mars Exploration Rovers 3D Model (MER_static)",
      penerbit: "NASA Science",
      kredit: L(
        "Tidak tertulis di halaman unduhan; halaman kembar menyebut NASA/JPL-Caltech",
        "Not stated on the download page; the twin page says NASA/JPL-Caltech",
      ),
      url: "https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "perlu-verifikasi",
      catatan: L(
        "Satu mesh satu rover (Spirit dan Opportunity kembar). Halaman Spirit and Opportunity Rover 3D Model di mars.nasa.gov menawarkan berkas bernama sama (11,36 MB) dengan kredit NASA/JPL-Caltech, tetapi berkas kami berbeda 160 byte. Dikompres ke 0,7 MB untuk web.",
        "One mesh for one rover (Spirit and Opportunity are twins). The Spirit and Opportunity Rover 3D Model page on mars.nasa.gov offers a file of the same name (11.36 MB) credited to NASA/JPL-Caltech, but our file differs by 160 bytes. Compressed to 0.7 MB for the web.",
      ),
    },
    {
      id: "model-mer-b",
      kategori: "model3d",
      jenis: JENIS_MODEL,
      nama: "Mars Exploration Rover: Opportunity (MER-B)",
      penerbit: "NASA",
      kredit: "NASA/Ames Research Center",
      url: "https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Berkas 36 KB, bentuk sederhana tanpa tekstur. Dipakai untuk Rover Opportunity.",
        "A 36 KB file, a simple shape without textures. Used for the Opportunity rover.",
      ),
    },
    {
      id: "model-voyager-b",
      kategori: "model3d",
      jenis: JENIS_MODEL,
      nama: "Voyager Probe (B)",
      penerbit: "NASA",
      kredit: "NASA/Michael D. Carbajal",
      url: "https://science.nasa.gov/3d-resources/voyager-probe-b/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Model umum Voyager (halaman menyebut misi Voyager 1). Dipakai untuk Voyager 1.",
        "A generic Voyager model (the page mentions the Voyager 1 mission). Used for Voyager 1.",
      ),
    },
    {
      id: "model-voyager-a",
      kategori: "model3d",
      jenis: JENIS_MODEL,
      nama: "Voyager Probe (A)",
      penerbit: "NASA",
      kredit: "NASA/Christopher R. Meaney",
      url: "https://science.nasa.gov/3d-resources/voyager-probe-a/",
      lisensi: LISENSI_NASA,
      diakses: DICEK,
      status: "terverifikasi",
      catatan: L(
        "Halaman sumber mencantumkan misi Viking 1 untuk model ini, padahal modelnya Voyager; dipakai untuk Voyager 2 sebagai model umum.",
        "The source page lists the Viking 1 mission for this model, although the model is a Voyager; used for Voyager 2 as a generic model.",
      ),
    },
    {
      id: "env-moon",
      kategori: "model3d",
      jenis: JENIS_LINGK,
      nama: L("Lingkungan Moon (versi 5)", "Moon environment (version 5)"),
      penerbit: "Tim JEJAK ANTARIKSA",
      kredit: L("Nama pembuat belum dicatat", "Creator's name not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Dibuat di Blender, tiga versi per perangkat (5,15, 1,85, dan 1,04 MiB, Draco). Medan prosedural, bukan data DEM asli. Bumi berupa garis besar sederhana, bukan geografi asli.",
        "Made in Blender, three versions per device (5.15, 1.85, and 1.04 MiB, Draco). Procedural terrain, not real DEM data. Earth is a simple outline, not real geography.",
      ),
    },
    {
      id: "env-mars",
      kategori: "model3d",
      jenis: JENIS_LINGK,
      nama: L("Lingkungan Mars (versi 3)", "Mars environment (version 3)"),
      penerbit: "Tim JEJAK ANTARIKSA",
      kredit: L("Nama pembuat belum dicatat", "Creator's name not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "Dibuat di Blender lewat skrip build, 4,6 MB (Draco), tiga kamera. Asal tekstur belum dicatat.",
        "Made in Blender through a build script, 4.6 MB (Draco), three cameras. The origin of the textures has not been recorded.",
      ),
    },
    {
      id: "env-deep-space",
      kategori: "model3d",
      jenis: JENIS_LINGK,
      nama: L("Lingkungan Deep Space (versi 1)", "Deep Space environment (version 1)"),
      penerbit: "Tim JEJAK ANTARIKSA",
      kredit: L("Nama pembuat belum dicatat", "Creator's name not yet recorded"),
      url: null,
      lisensi: LISENSI_BELUM,
      diakses: null,
      status: "perlu-verifikasi",
      catatan: L(
        "2,8 MB, tanpa Draco. Tekstur prosedural, bukan data astronomi.",
        "2.8 MB, without Draco. Procedural textures, not astronomical data.",
      ),
    },
  ];

  return { referensi: referensi(), media: MEDIA, model3d: MODEL3D };
}

const FIELD_TEKS = ["jenis", "nama", "penerbit", "kredit", "lisensi", "catatan"] as const;

/**
 * Menerjemahkan satu item API ke English memakai terjemahan tulisan tangan (dicocokkan lewat id). Sebuah field hanya
 * diterjemahkan bila teks Indonesia di API masih sama dengan teks yang diterjemahkan; kalau backend mengubahnya,
 * field itu tampil apa adanya (Indonesia) sampai terjemahannya diperbarui. URL, status, dan tanggal selalu dari API.
 */
function terjemah(a: SumberItem, daftarId: SumberItem[], daftarEn: SumberItem[]): SumberItem {
  const m = daftarId.find((x) => x.id === a.id);
  const e = daftarEn.find((x) => x.id === a.id);
  if (!m || !e) return a;
  const out: SumberItem = { ...a };
  for (const k of FIELD_TEKS) if (m[k] === a[k] && e[k] !== undefined) (out as Record<string, unknown>)[k] = e[k];
  if (a.rincian) {
    out.rincian = a.rincian.map((r) => {
      const i = m.rincian?.findIndex((x) => x.nama === r.nama) ?? -1;
      const te = i >= 0 ? e.rincian?.[i] : undefined;
      if (!te) return r;
      return { ...r, nama: te.nama, kredit: m.rincian?.[i].kredit === r.kredit ? te.kredit : r.kredit };
    });
  }
  return out;
}

/** Teks yang diubah atau ditambah backend setelah terjemahan dibuat: persis Indonesia -> English. */
const TEKS_BARU_EN: Record<string, string> = {
  "Menurut panduan NASA, konten NASA umumnya tidak berhak cipta di Amerika Serikat, tetapi logo dan materi pihak ketiga dikecualikan; NASA harus dicantumkan sebagai sumber dan tidak boleh tampak mendukung produk. Halaman sumber ini tidak mencantumkan pembatasan khusus. Jangan dianggap bebas hak cipta tanpa memeriksa panduan.":
    "According to NASA's guidelines, NASA content is generally not copyrighted in the United States, but logos and third-party material are excluded; NASA must be credited as the source and must not appear to endorse products. This source page lists no special restrictions. Do not assume it is free of copyright without checking the guidelines.",
  "NASA — Apollo 11 (halaman misi)": "NASA — Apollo 11 (mission page)",
  "NASA: Tahun 1960-an, dari mimpi ke realitas dalam 10 tahun": "NASA: The 1960s, From Dream to Reality in 10 Years",
  "Belum ada pernyataan lisensi untuk sumber ini. Jangan dianggap bebas hak cipta sebelum diperiksa.":
    "There is no license statement for this source yet. Do not assume it is free of copyright before checking.",
  "Dipindahkan dari daftar sumber lama; halaman belum dibuka ulang, jadi belum diverifikasi.":
    "Moved over from the old source list; the page has not been reopened, so it is not verified.",
  "Enam dari delapan foto sudah dicocokkan dengan halaman NASA (berkas identik dengan gambar di halaman): Pale Blue Dot Revisited, Saturn's Rings, Io 2x2 Mosaic, Crescent Saturn, Golden Record, dan Two Interstellar Travelers. Dua foto belum ditemukan halaman asalnya: Jupiter dan Bintik Merah Besar, serta Perubahan atmosfer Saturnus (tidak ada di 23 halaman yang diperiksa). Foto isi Golden Record (48 gambar) tidak dipakai: menurut NASA gambar-gambar itu berhak cipta.":
    "Six of the eight photos have been matched to NASA pages (files identical to the images on the page): Pale Blue Dot Revisited, Saturn's Rings, Io 2x2 Mosaic, Crescent Saturn, Golden Record, and Two Interstellar Travelers. Two photos have no source page yet: Jupiter and the Great Red Spot, and Changes in Saturn's atmosphere (not found on any of the 23 pages checked). The Golden Record content photos (48 images) are not used: according to NASA they are copyrighted.",
  "Foto piringan sampul identik dengan gambar di halaman Golden Record Contents (NASA); halaman itu tidak menyebut kredit foto. NASA menyatakan gambar-gambar yang ada di dalam Golden Record berhak cipta dan tidak boleh direproduksi tanpa izin; kita hanya menampilkan foto piringan dan sampul.":
    "The photo of the disc and cover is identical to the image on the Golden Record Contents page (NASA); that page does not state a photo credit. NASA states that the images inside the Golden Record are copyrighted and may not be reproduced without permission; we only show the photo of the disc and cover.",
  "Tujuh dari delapan foto sudah dicocokkan dengan halaman NASA (berkas identik dengan gambar di halaman): Pale Blue Dot Revisited, Saturn's Rings, Io 2x2 Mosaic, Crescent Saturn, Saturn's Atmospheric Changes, Golden Record, dan Two Interstellar Travelers. Satu foto belum ditemukan halaman asalnya: Jupiter dan Bintik Merah Besar. Foto isi Golden Record (48 gambar) tidak dipakai: menurut NASA gambar-gambar itu berhak cipta.":
    "Seven of the eight photos have been matched to NASA pages (files identical to the images on the page): Pale Blue Dot Revisited, Saturn's Rings, Io 2x2 Mosaic, Crescent Saturn, Saturn's Atmospheric Changes, Golden Record, and Two Interstellar Travelers. One photo has no source page yet: Jupiter and the Great Red Spot. The Golden Record content photos (48 images) are not used: according to NASA they are copyrighted.",
  "Foto piringan sampul dan diagram sampul identik dengan gambar di halaman NASA (Golden Record Contents dan Golden Record Cover); halaman Golden Record Contents tidak menyebut kredit foto. Penjelasan diagram belum ditemukan halamannya. NASA menyatakan gambar-gambar yang ada di dalam Golden Record berhak cipta dan tidak boleh direproduksi tanpa izin; kita hanya menampilkan foto piringan dan sampul.":
    "The photo of the cover disc and the cover diagram are identical to images on NASA pages (Golden Record Contents and Golden Record Cover); the Golden Record Contents page does not state a photo credit. The page for the diagram explanation has not been found. NASA states that the images inside the Golden Record are copyrighted and may not be reproduced without permission; we only show the photo of the disc and cover.",
  "\"Pale Blue Dot Revisited\", PIA23645, diterbitkan 12 Februari 2020. Berkas Voyager_Pale_Blue_Dot_Revisited.jpg identik dengan gambar di halaman NASA (5230x5175 px). Dipotong dan digelapkan: header memakai bagian berkas cahaya dan titik Bumi, latar memakai sisi kiri foto.":
    "\"Pale Blue Dot Revisited\", PIA23645, published 12 February 2020. The file Voyager_Pale_Blue_Dot_Revisited.jpg is identical to the image on the NASA page (5230x5175 px). Cropped and darkened: the header uses the part of the file with the light rays and the Earth dot, the background uses the left side of the photo.",
};
const dalamEn = (i: SumberItem): SumberItem => ({
  ...i,
  nama: TEKS_BARU_EN[i.nama] ?? i.nama,
  lisensi: TEKS_BARU_EN[i.lisensi] ?? i.lisensi,
  ...(i.catatan ? { catatan: TEKS_BARU_EN[i.catatan] ?? i.catatan } : {}),
});

export function getKatalogSumber(lang: Lang = DEFAULT_LANG): Record<KategoriSumber, SumberItem[]> {
  const api = (k: KategoriSumber) => KATALOG_API.filter((i) => i.kategori === k);
  if (lang === "id") return { referensi: api("referensi"), media: api("media"), model3d: api("model3d") };
  const id = buatKatalog("id");
  const en = buatKatalog("en");
  return {
    referensi: en.referensi.map(dalamEn),
    media: api("media").map((a) => dalamEn(terjemah(a, id.media, en.media))),
    model3d: api("model3d").map((a) => dalamEn(terjemah(a, id.model3d, en.model3d))),
  };
}
