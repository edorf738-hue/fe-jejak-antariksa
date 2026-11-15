import { getCerita } from "./cerita";

/**
 * Media popup objek (id benda, mis. "2-0"). Satu benda bisa punya beberapa media; popup memilih tampilan menurut jenis aset:
 *  - model3d : file .glb sungguhan dari NASA, diputar dan di-zoom di dalam popup;
 *  - image   : foto NASA (tidak pernah dijadikan model palsu), bisa diperbesar;
 *  - video   : video NASA (HTML5, tanpa putar otomatis);
 *  - tanpa media: hanya teks.
 * Kredit mengikuti catatan di NASA_ASSET_COLLECTION_REPORT.md; yang belum tercatat ditulis apa adanya.
 */
export type MediaItem =
  | { jenis: "model3d"; src: string; label?: string; keterangan: string; kredit: string }
  | { jenis: "image"; src: string; label?: string; keterangan: string; kredit: string }
  | { jenis: "video"; src: string; poster: string; label?: string; keterangan: string; kredit: string };
export type MediaBenda = { media: MediaItem[]; catatanModel?: string };

const BELUM = "NASA (kredit rinci belum dicatat)";
const SIM = "Belum ada model 3D NASA: ditampilkan sebagai pelat foto NASA di posisi perkiraan.";
const LM = "/models/objek/apollo-lunar-module.glb";
const MODEL_LM = "NASA/Michael D. Carbajal (menurut halaman NASA Science)";
const vid = (nama: string, keterangan: string): MediaItem => ({
  jenis: "video",
  src: `/videos/apollo-11/${nama}.mp4`,
  poster: `/videos/apollo-11/${nama}.webp`,
  keterangan,
  kredit: "NASA",
});
const foto = (src: string, keterangan: string, kredit = "NASA", label?: string): MediaItem => ({ jenis: "image", src, keterangan, kredit, label });

export const MEDIA_BENDA: Record<string, MediaBenda> = {
  // Moon
  "2-0": {
    media: [
      { jenis: "model3d", src: LM, keterangan: "Model umum Apollo Lunar Module (bukan model khusus Eagle).", kredit: MODEL_LM },
      foto("/images/objek/eagle.webp", "Apollo 11 Lunar Module dilihat dari kejauhan."),
    ],
    catatanModel: "Model 3D: model umum Apollo Lunar Module dari NASA.",
  },
  "2-1": { media: [vid("plakat-peringatan", "Plakat yang dipasang pada kaki pendarat."), foto("/images/objek/plakat.webp", "Plakat peringatan Apollo 11.")], catatanModel: SIM },
  "2-2": {
    media: [vid("mengibarkan-bendera", "Bendera AS didirikan di permukaan Bulan."), foto("/images/objek/bendera.webp", "Buzz Aldrin memberi hormat di dekat bendera AS.")],
    catatanModel: SIM,
  },
  "2-3": { media: [foto("/images/galeri/moon-komponen-easep.webp", "Komponen paket eksperimen EASEP, termasuk seismometer.")], catatanModel: SIM },
  "2-4": { media: [foto("/images/galeri/moon-aldrin-membawa-easep.webp", "Aldrin membawa seismometer dan retroreflektor laser.")], catatanModel: SIM },
  "2-5": {
    media: [
      { jenis: "model3d", src: LM, keterangan: "Tahap naik adalah bagian atas model umum Apollo Lunar Module.", kredit: MODEL_LM },
      foto("/images/galeri/moon-lm-jauh.webp", "Lunar Module dilihat dari kejauhan."),
    ],
    catatanModel: "Model 3D: bagian atas model umum Apollo Lunar Module dari NASA.",
  },
  "2-6": {
    media: [foto("/images/objek/bootprint.webp", "Jejak sepatu astronaut Apollo di debu Bulan.", BELUM)],
    catatanModel: "Ini foto, bukan model 3D. Penandanya di scene hanya representasi visual, bukan lokasi sebenarnya.",
  },
  "2-7": { media: [], catatanModel: "Belum ada model atau foto NASA untuk benda ini: hanya informasi teks. Posisi penanda hanya representasi visual." },
  "2-8": { media: [], catatanModel: "Belum ada model atau foto NASA untuk benda ini: hanya informasi teks. Posisi penanda hanya representasi visual." },
  "2-9": {
    media: [
      foto("/images/galeri/moon-angin-matahari.webp", "Eksperimen angin Matahari Apollo 11."),
      foto("/images/galeri/moon-aldrin-angin-matahari.webp", "Buzz Aldrin di samping eksperimen angin Matahari."),
    ],
    catatanModel: SIM,
  },
  "2-10": { media: [foto("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong mengumpulkan sampel Bulan.")], catatanModel: SIM },
  // Mars
  "3-0": {
    media: [
      { jenis: "model3d", src: "/models/objek/mer-rover.glb", keterangan: "Model umum rover MER; Spirit dan Opportunity adalah kembar.", kredit: "NASA/JPL-Caltech" },
      foto("/images/galeri/mars-spirit-gusev.webp", "Rover Spirit di Gusev Crater.", "NASA/JPL-Caltech"),
    ],
    catatanModel: "Model 3D: model umum rover MER (Spirit dan Opportunity kembar).",
  },
  "3-1": {
    media: [
      { jenis: "model3d", src: "/models/objek/mer-b-opportunity.glb", keterangan: "Model Mars Exploration Rover Opportunity (MER-B), bentuk sederhana tanpa tekstur.", kredit: "NASA/Ames Research Center" },
      foto("/images/galeri/mars-opportunity-foto-diri.webp", "Foto diri Opportunity, Januari 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
    ],
    catatanModel: "Model 3D: model rover Opportunity (MER-B) dari NASA.",
  },
  "3-2": {
    media: [foto("/images/galeri/mars-heat-shield-rock.webp", "Serpihan pelindung panas Opportunity; Heat Shield Rock di bagian kiri foto.", "NASA/JPL/Cornell")],
    catatanModel: SIM,
  },
  // Deep Space
  "4-0": {
    media: [
      { jenis: "model3d", src: "/models/objek/voyager-probe.glb", keterangan: "Model umum Voyager Probe (B).", kredit: "NASA/Michael D. Carbajal (menurut halaman NASA Science)" },
      foto("/images/objek/voyager-2.webp", "Ilustrasi NASA: posisi Voyager 1 dan 2 di ruang antarbintang.", BELUM),
    ],
    catatanModel: "Model 3D: model umum Voyager Probe (B) dari NASA.",
  },
  "4-1": {
    media: [
      { jenis: "model3d", src: "/models/objek/voyager-probe-a.glb", keterangan: "Model umum Voyager Probe (A).", kredit: "NASA/Christopher R. Meaney" },
      foto("/images/objek/voyager-2.webp", "Ilustrasi NASA: posisi Voyager 1 dan 2 di ruang antarbintang.", BELUM),
    ],
    catatanModel: "Model 3D: model umum Voyager Probe (A) dari NASA.",
  },
  "4-2": {
    media: [
      foto("/images/objek/golden-record.webp", "Voyager Golden Record: piringan dan sampulnya.", BELUM, "Foto"),
      foto("/images/galeri/deep-space-golden-record-persiapan.webp", "Persiapan Golden Record untuk Voyager.", "NASA/JPL-Caltech", "Persiapan"),
    ],
    catatanModel: "NASA hanya menyediakan foto Golden Record, tanpa model 3D: tampil sebagai potongan foto asli.",
  },
  "4-3": {
    media: [
      foto("/images/galeri/deep-space-golden-record-sampul.webp", "Sampul Golden Record: diagram cara memutar piringan dan lokasi Bumi.", BELUM, "Sampul"),
      foto("/images/galeri/deep-space-golden-record-diagram.webp", "Penjelasan diagram pada sampul Golden Record.", BELUM, "Penjelasan"),
    ],
    catatanModel: "NASA hanya menyediakan foto sampul, tanpa model 3D: tampil sebagai potongan foto asli.",
  },
};

/**
 * Foto galeri per lingkungan di panel Galeri halaman 3D. Sumbernya sama dengan galeri halaman cerita (src/data/cerita.ts),
 * jadi foto, keterangan, dan kredit selalu sama di kedua halaman.
 */
export type FotoGaleri = { src: string; keterangan: string; kredit: string };
export const GALERI_FOTO: Record<"moon" | "mars" | "deep-space", FotoGaleri[]> = {
  moon: getCerita("eksplorasi-bulan").galeri,
  mars: getCerita("eksplorasi-mars").galeri,
  "deep-space": getCerita("deep-space").galeri,
};
