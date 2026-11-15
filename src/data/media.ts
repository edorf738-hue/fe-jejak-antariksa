import { DEFAULT_LANG, type Lang } from "../lib/i18n";
import { getCerita } from "./cerita";

/**
 * Media popup objek (id benda, mis. "2-0"). Satu benda bisa punya beberapa media; popup memilih tampilan menurut jenis aset:
 *  - model3d : file .glb sungguhan dari NASA, diputar dan di-zoom di dalam popup;
 *  - image   : foto NASA (tidak pernah dijadikan model palsu), bisa diperbesar;
 *  - video   : video NASA (HTML5, tanpa putar otomatis);
 *  - tanpa media: hanya teks.
 * Kredit mengikuti catatan di NASA_ASSET_COLLECTION_REPORT.md; yang belum tercatat ditulis apa adanya.
 * Teks per bahasa (id, en) ada di `TEKS`; susunan media sama untuk kedua bahasa.
 */
export type MediaItem =
  | { jenis: "model3d"; src: string; label?: string; keterangan: string; kredit: string }
  | { jenis: "image"; src: string; label?: string; keterangan: string; kredit: string }
  | { jenis: "video"; src: string; poster: string; label?: string; keterangan: string; kredit: string };
export type MediaBenda = { media: MediaItem[]; catatanModel?: string };

type Teks = {
  belum: string;
  sim: string;
  teksSaja: string;
  modelCarbajal: string;
  eagleLM: string;
  lmModelKet: string; lmModelCatatan: string;
  lmNaikKet: string; lmNaikCatatan: string;
  lmJauh: string;
  plakatVideo: string; plakatFoto: string;
  benderaVideo: string; benderaFoto: string;
  easepKomponen: string; easepAldrin: string;
  bootprintFoto: string; bootprintCatatan: string;
  anginMatahari: string; anginMatahariAldrin: string;
  sampelBulan: string;
  merModelKet: string; merFotoSpirit: string; merCatatan: string;
  merbKet: string; merbFoto: string; merbCatatan: string;
  heatShield: string;
  voyBKet: string; voyIlustrasi: string; voyBCatatan: string;
  voyAKet: string; voyACatatan: string;
  grFoto: string; grPersiapan: string; grCatatan: string; labelFoto: string; labelPersiapan: string;
  sampulFoto: string; sampulPenjelasan: string; sampulCatatan: string; labelSampul: string; labelPenjelasan: string;
  videoPlakatPoster: string;
};

const TEKS: Record<Lang, Teks> = {
  id: {
    belum: "NASA (kredit rinci belum dicatat)",
    sim: "Belum ada model 3D NASA: ditampilkan sebagai pelat foto NASA di posisi perkiraan.",
    teksSaja: "Belum ada model atau foto NASA untuk benda ini: hanya informasi teks. Posisi penanda hanya representasi visual.",
    modelCarbajal: "NASA/Michael D. Carbajal (menurut halaman NASA Science)",
    eagleLM: "Apollo 11 Lunar Module dilihat dari kejauhan.",
    lmModelKet: "Model umum Apollo Lunar Module (bukan model khusus Eagle).", lmModelCatatan: "Model 3D: model umum Apollo Lunar Module dari NASA.",
    lmNaikKet: "Tahap naik adalah bagian atas model umum Apollo Lunar Module.", lmNaikCatatan: "Model 3D: bagian atas model umum Apollo Lunar Module dari NASA.",
    lmJauh: "Lunar Module dilihat dari kejauhan.",
    plakatVideo: "Plakat yang dipasang pada kaki pendarat.", plakatFoto: "Plakat peringatan Apollo 11.",
    benderaVideo: "Bendera AS didirikan di permukaan Bulan.", benderaFoto: "Buzz Aldrin memberi hormat di dekat bendera AS.",
    easepKomponen: "Komponen paket eksperimen EASEP, termasuk seismometer.", easepAldrin: "Aldrin membawa seismometer dan retroreflektor laser.",
    bootprintFoto: "Jejak sepatu astronaut Apollo di debu Bulan.", bootprintCatatan: "Ini foto, bukan model 3D. Penandanya di scene hanya representasi visual, bukan lokasi sebenarnya.",
    anginMatahari: "Eksperimen angin Matahari Apollo 11.", anginMatahariAldrin: "Buzz Aldrin di samping eksperimen angin Matahari.",
    sampelBulan: "Neil Armstrong mengumpulkan sampel Bulan.",
    merModelKet: "Model umum rover MER; Spirit dan Opportunity adalah kembar.", merFotoSpirit: "Rover Spirit di Gusev Crater.", merCatatan: "Model 3D: model umum rover MER (Spirit dan Opportunity kembar).",
    merbKet: "Model Mars Exploration Rover Opportunity (MER-B), bentuk sederhana tanpa tekstur.", merbFoto: "Foto diri Opportunity, Januari 2014.", merbCatatan: "Model 3D: model rover Opportunity (MER-B) dari NASA.",
    heatShield: "Serpihan pelindung panas Opportunity; Heat Shield Rock di bagian kiri foto.",
    voyBKet: "Model umum Voyager Probe (B).", voyIlustrasi: "Ilustrasi NASA: posisi Voyager 1 dan 2 di ruang antarbintang.", voyBCatatan: "Model 3D: model umum Voyager Probe (B) dari NASA.",
    voyAKet: "Model umum Voyager Probe (A).", voyACatatan: "Model 3D: model umum Voyager Probe (A) dari NASA.",
    grFoto: "Voyager Golden Record: piringan dan sampulnya.", grPersiapan: "Persiapan Golden Record untuk Voyager.",
    grCatatan: "NASA hanya menyediakan foto Golden Record, tanpa model 3D: tampil sebagai potongan foto asli.", labelFoto: "Foto", labelPersiapan: "Persiapan",
    sampulFoto: "Sampul Golden Record: diagram cara memutar piringan dan lokasi Bumi.", sampulPenjelasan: "Penjelasan diagram pada sampul Golden Record.",
    sampulCatatan: "NASA hanya menyediakan foto sampul, tanpa model 3D: tampil sebagai potongan foto asli.", labelSampul: "Sampul", labelPenjelasan: "Penjelasan",
    videoPlakatPoster: "",
  },
  en: {
    belum: "NASA (detailed credit not yet recorded)",
    sim: "There is no NASA 3D model yet: shown as a NASA photo plate at an approximate position.",
    teksSaja: "There is no NASA model or photo for this item: text information only. The pin position is only a visual representation.",
    modelCarbajal: "NASA/Michael D. Carbajal (per the NASA Science page)",
    eagleLM: "The Apollo 11 Lunar Module seen from a distance.",
    lmModelKet: "A generic Apollo Lunar Module model (not an Eagle-specific model).", lmModelCatatan: "3D model: NASA's generic Apollo Lunar Module model.",
    lmNaikKet: "The ascent stage is the upper part of the generic Apollo Lunar Module model.", lmNaikCatatan: "3D model: the upper part of NASA's generic Apollo Lunar Module model.",
    lmJauh: "The Lunar Module seen from a distance.",
    plakatVideo: "The plaque mounted on the lander's leg.", plakatFoto: "The Apollo 11 commemorative plaque.",
    benderaVideo: "The U.S. flag is planted on the lunar surface.", benderaFoto: "Buzz Aldrin saluting near the U.S. flag.",
    easepKomponen: "Components of the EASEP experiment package, including the seismometer.", easepAldrin: "Aldrin carrying the seismometer and laser retroreflector.",
    bootprintFoto: "An Apollo astronaut's bootprint in the lunar dust.", bootprintCatatan: "This is a photo, not a 3D model. Its pin in the scene is only a visual representation, not the real location.",
    anginMatahari: "The Apollo 11 solar wind experiment.", anginMatahariAldrin: "Buzz Aldrin beside the solar wind experiment.",
    sampelBulan: "Neil Armstrong collecting lunar samples.",
    merModelKet: "A generic MER rover model; Spirit and Opportunity are twins.", merFotoSpirit: "The Spirit rover in Gusev Crater.", merCatatan: "3D model: the generic MER rover model (Spirit and Opportunity are twins).",
    merbKet: "The Mars Exploration Rover Opportunity (MER-B) model, a simple shape without textures.", merbFoto: "Self-portrait of Opportunity, January 2014.", merbCatatan: "3D model: NASA's Opportunity (MER-B) rover model.",
    heatShield: "Opportunity's heat shield fragments; Heat Shield Rock on the left of the photo.",
    voyBKet: "A generic Voyager Probe (B) model.", voyIlustrasi: "NASA illustration: the positions of Voyager 1 and 2 in interstellar space.", voyBCatatan: "3D model: NASA's generic Voyager Probe (B) model.",
    voyAKet: "A generic Voyager Probe (A) model.", voyACatatan: "3D model: NASA's generic Voyager Probe (A) model.",
    grFoto: "The Voyager Golden Record: the disc and its cover.", grPersiapan: "Preparing the Golden Record for Voyager.",
    grCatatan: "NASA only provides photos of the Golden Record, with no 3D model: shown as a cut-out of the real photo.", labelFoto: "Photo", labelPersiapan: "Preparation",
    sampulFoto: "The Golden Record cover: a diagram of how to play the disc and where Earth is.", sampulPenjelasan: "An explanation of the diagram on the Golden Record cover.",
    sampulCatatan: "NASA only provides photos of the cover, with no 3D model: shown as a cut-out of the real photo.", labelSampul: "Cover", labelPenjelasan: "Explanation",
    videoPlakatPoster: "",
  },
};

const LM = "/models/objek/apollo-lunar-module.glb";
const vid = (nama: string, keterangan: string): MediaItem => ({
  jenis: "video",
  src: `/videos/apollo-11/${nama}.mp4`,
  poster: `/videos/apollo-11/${nama}.webp`,
  keterangan,
  kredit: "NASA",
});
const foto = (src: string, keterangan: string, kredit = "NASA", label?: string): MediaItem => ({ jenis: "image", src, keterangan, kredit, label });

function buat(t: Teks): Record<string, MediaBenda> {
  const BELUM = t.belum;
  const SIM = t.sim;
  const MODEL_LM = t.modelCarbajal;
  return {
    // Moon
    "2-0": {
      media: [
        { jenis: "model3d", src: LM, keterangan: t.lmModelKet, kredit: MODEL_LM },
        foto("/images/objek/eagle.webp", t.eagleLM),
      ],
      catatanModel: t.lmModelCatatan,
    },
    "2-1": { media: [vid("plakat-peringatan", t.plakatVideo), foto("/images/objek/plakat.webp", t.plakatFoto)], catatanModel: SIM },
    "2-2": { media: [vid("mengibarkan-bendera", t.benderaVideo), foto("/images/objek/bendera.webp", t.benderaFoto)], catatanModel: SIM },
    "2-3": { media: [foto("/images/galeri/moon-komponen-easep.webp", t.easepKomponen)], catatanModel: SIM },
    "2-4": { media: [foto("/images/galeri/moon-aldrin-membawa-easep.webp", t.easepAldrin)], catatanModel: SIM },
    "2-5": {
      media: [
        { jenis: "model3d", src: LM, keterangan: t.lmNaikKet, kredit: MODEL_LM },
        foto("/images/galeri/moon-lm-jauh.webp", t.lmJauh),
      ],
      catatanModel: t.lmNaikCatatan,
    },
    "2-6": { media: [foto("/images/objek/bootprint.webp", t.bootprintFoto, BELUM)], catatanModel: t.bootprintCatatan },
    "2-7": { media: [], catatanModel: t.teksSaja },
    "2-8": { media: [], catatanModel: t.teksSaja },
    "2-9": {
      media: [
        foto("/images/galeri/moon-angin-matahari.webp", t.anginMatahari),
        foto("/images/galeri/moon-aldrin-angin-matahari.webp", t.anginMatahariAldrin),
      ],
      catatanModel: SIM,
    },
    "2-10": { media: [foto("/images/galeri/moon-armstrong-sampel.webp", t.sampelBulan)], catatanModel: SIM },
    // Mars
    "3-0": {
      media: [
        { jenis: "model3d", src: "/models/objek/mer-rover.glb", keterangan: t.merModelKet, kredit: "NASA/JPL-Caltech" },
        foto("/images/galeri/mars-spirit-gusev.webp", t.merFotoSpirit, "NASA/JPL-Caltech"),
      ],
      catatanModel: t.merCatatan,
    },
    "3-1": {
      media: [
        { jenis: "model3d", src: "/models/objek/mer-b-opportunity.glb", keterangan: t.merbKet, kredit: "NASA/Ames Research Center" },
        foto("/images/galeri/mars-opportunity-foto-diri.webp", t.merbFoto, "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      ],
      catatanModel: t.merbCatatan,
    },
    "3-2": { media: [foto("/images/galeri/mars-heat-shield-rock.webp", t.heatShield, "NASA/JPL/Cornell")], catatanModel: SIM },
    // Deep Space
    "4-0": {
      media: [
        { jenis: "model3d", src: "/models/objek/voyager-probe.glb", keterangan: t.voyBKet, kredit: t.modelCarbajal },
        foto("/images/objek/voyager-2.webp", t.voyIlustrasi, BELUM),
      ],
      catatanModel: t.voyBCatatan,
    },
    "4-1": {
      media: [
        { jenis: "model3d", src: "/models/objek/voyager-probe-a.glb", keterangan: t.voyAKet, kredit: "NASA/Christopher R. Meaney" },
        foto("/images/objek/voyager-2.webp", t.voyIlustrasi, BELUM),
      ],
      catatanModel: t.voyACatatan,
    },
    "4-2": {
      media: [
        foto("/images/objek/golden-record.webp", t.grFoto, BELUM, t.labelFoto),
        foto("/images/galeri/deep-space-golden-record-persiapan.webp", t.grPersiapan, "NASA/JPL-Caltech", t.labelPersiapan),
      ],
      catatanModel: t.grCatatan,
    },
    "4-3": {
      media: [
        foto("/images/galeri/deep-space-golden-record-sampul.webp", t.sampulFoto, BELUM, t.labelSampul),
        foto("/images/galeri/deep-space-golden-record-diagram.webp", t.sampulPenjelasan, BELUM, t.labelPenjelasan),
      ],
      catatanModel: t.sampulCatatan,
    },
  };
}

export const MEDIA_BENDA: Record<Lang, Record<string, MediaBenda>> = { id: buat(TEKS.id), en: buat(TEKS.en) };

/**
 * Foto galeri per lingkungan di panel Galeri halaman 3D. Sumbernya sama dengan galeri halaman cerita (src/data/cerita.ts),
 * jadi foto, keterangan, dan kredit selalu sama di kedua halaman.
 */
export type FotoGaleri = { src: string; keterangan: string; kredit: string };
export function getGaleriFoto(lang: Lang = DEFAULT_LANG): Record<"moon" | "mars" | "deep-space", FotoGaleri[]> {
  return {
    moon: getCerita("eksplorasi-bulan", lang).galeri,
    mars: getCerita("eksplorasi-mars", lang).galeri,
    "deep-space": getCerita("deep-space", lang).galeri,
  };
}
