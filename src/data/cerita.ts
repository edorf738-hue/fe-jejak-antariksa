import { getBab } from "./content";
import type { BabId } from "./types";

/**
 * Halaman detail Cerita (/cerita/[slug]): satu halaman editorial per bab. Semua teks disusun dari catatan sumber di
 * NASA/NASA History (Apollo11_Sejarah_Awal_NASA, Apollo11_Informasi_Utama_Misi, Apollo11_Kronologi_Misi, 03_Spirit_Opportunity,
 * 04_Artefak) dan docs/content-data.json. Tidak ada fakta baru: yang tidak ada di sumber tidak ditulis (mis. alur
 * "perlombaan antariksa" belum ada di sumber, jadi Bab 1 hanya memuat sejarah NASA dan jalan menuju Apollo 11).
 * Foto dan video berasal dari NASA/NASA Assets (versi web di /public).
 */
export type CeritaSlug = "awal-eksplorasi" | "eksplorasi-bulan" | "eksplorasi-mars" | "deep-space";

export type Foto = { src: string; keterangan: string; kredit: string };
export type Bagian = { waktu: string; judul: string; isi: string; foto?: Foto };
export type VideoCerita = { src: string; poster: string; judul: string; keterangan: string };
export type Artefak = { nama: string; status: string; deskripsi: string; foto?: Foto; model: string };
export type SumberCerita = { judul: string; url: string };

export type CeritaBab = {
  slug: CeritaSlug;
  babId: BabId;
  nomor: string;
  judul: string;
  ringkasan: string;
  hero: Foto;
  /** Kalimat pembuka hero (lebih panjang dari ringkasan kartu). */
  pengantar: string;
  bagian: Bagian[];
  galeri: Foto[];
  video: VideoCerita[];
  /** Fakta singkat (dengan sumbernya). */
  fakta: { isi: string; sumber: string }[];
  artefak: Artefak[];
  /** Tujuan eksplorasi 3D; null = bab ini belum punya scene 3D. */
  tiga3d: { label: string; href: string; deskripsi: string } | null;
  sumber: SumberCerita[];
};

export const CERITA_SLUGS: CeritaSlug[] = ["awal-eksplorasi", "eksplorasi-bulan", "eksplorasi-mars", "deep-space"];
export const SLUG_BAB: Record<BabId, CeritaSlug> = { 1: "awal-eksplorasi", 2: "eksplorasi-bulan", 3: "eksplorasi-mars", 4: "deep-space" };

export function isCeritaSlug(s: string): s is CeritaSlug {
  return (CERITA_SLUGS as string[]).includes(s);
}

const NASA = "NASA";
const f = (src: string, keterangan: string, kredit = NASA): Foto => ({ src, keterangan, kredit });
const v = (nama: string, judul: string, keterangan: string): VideoCerita => ({
  src: `/videos/apollo-11/${nama}.mp4`,
  poster: `/videos/apollo-11/${nama}.webp`,
  judul,
  keterangan,
});

const SUMBER_APOLLO = [
  { judul: "NASA: Apollo 11 Mission Overview", url: "https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/" },
  { judul: "NASA: Apollo 11", url: "https://www.nasa.gov/mission/apollo-11/" },
];

const DATA: Record<CeritaSlug, Omit<CeritaBab, "slug" | "babId" | "nomor" | "judul" | "ringkasan">> = {
  "awal-eksplorasi": {
    hero: f("/images/story/bab-1-apollo-11-orbit.webp", "Apollo 11: modul komando di orbit Bulan.", "NASA"),
    pengantar:
      "Sebelum manusia meninggalkan jejak di Bulan, ada perjalanan panjang berisi penelitian, percobaan, dan keberanian untuk menjelajah tempat yang belum pernah dikunjungi manusia.",
    bagian: [
      {
        waktu: "29 Juli 1958",
        judul: "Dasar hukum NASA",
        isi: "Presiden Dwight D. Eisenhower menandatangani undang-undang yang menjadi dasar pembentukan NASA. Badan ini dibentuk untuk mengembangkan penelitian penerbangan dan mempelajari ruang angkasa.",
      },
      {
        waktu: "1 Oktober 1958",
        judul: "NASA mulai bekerja",
        isi: "NASA mulai beroperasi. T. Keith Glennan menjadi administrator pertama, dengan Hugh L. Dryden sebagai wakil administrator.",
      },
      {
        waktu: "25 Mei 1961",
        judul: "Target Kennedy",
        isi: "Presiden John F. Kennedy menetapkan target nasional: mendaratkan manusia di Bulan dan membawanya kembali ke Bumi dengan selamat.",
      },
      {
        waktu: "Dekade 1960-an",
        judul: "Jalan menuju Bulan",
        isi: "NASA berusaha mewujudkan target itu. Misi Apollo 8 dan Apollo 10 membantu membuktikan bahwa perjalanan ke Bulan dapat dilakukan dan mempersiapkan langkah berikutnya.",
        foto: f("/images/galeri/moon-view-moon.webp", "Apollo 11: pemandangan Bulan.", "NASA"),
      },
      {
        waktu: "Juli 1969",
        judul: "Ujian Apollo 11",
        isi: "Apollo 11 harus membuktikan bahwa manusia dapat melakukan perjalanan dari Bumi ke Bulan, mendarat di permukaan Bulan, dan kembali ke Bumi dengan selamat. Awaknya tiga astronaut: Neil Armstrong, Buzz Aldrin, dan Michael Collins.",
      },
    ],
    galeri: [
      f("/images/story/bab-1-apollo-11-orbit.webp", "Apollo 11: modul komando di orbit Bulan."),
      f("/images/galeri/moon-view-moon.webp", "Apollo 11: pemandangan Bulan."),
      f("/images/galeri/moon-aldrin-bendera.webp", "Buzz Aldrin memberi hormat di dekat bendera AS."),
    ],
    video: [
      v("saturn-v-peluncuran", "Peluncuran Saturn V, 1969", "Roket Saturn V yang meluncurkan Apollo 11."),
    ],
    fakta: [
      { isi: "Dasar pembentukan NASA ditandatangani 29 Juli 1958; NASA mulai beroperasi 1 Oktober 1958.", sumber: "NASA: Asal-usul NASA" },
      { isi: "Apollo 11 bukan awal NASA, melainkan salah satu pencapaian besarnya beberapa tahun kemudian.", sumber: "NASA: Tahun 1960-an" },
      { isi: "Misi sebelum Apollo 11 yang disebut dalam artikel NASA: Apollo 8 dan Apollo 10.", sumber: "NASA: Tahun 1960-an" },
    ],
    artefak: [
      {
        nama: "Roket Saturn V",
        status: "Peluncur Apollo 11",
        deskripsi: "Roket raksasa setinggi 363 kaki (sekitar 111 m) yang meluncurkan Apollo 11 dari Kennedy Space Center.",
        model: "Model 3D Saturn V ada di folder aset NASA, belum dipasang di lingkungan 3D.",
      },
      {
        nama: "Columbia, modul komando",
        status: "Tetap mengorbit Bulan",
        deskripsi: "Rumah para astronaut selama perjalanan. Michael Collins tetap di dalamnya saat Eagle turun ke permukaan.",
        foto: f("/images/story/bab-1-apollo-11-orbit.webp", "Modul komando di orbit Bulan.", "NASA"),
        model: "Belum ada model 3D NASA untuk Columbia.",
      },
    ],
    tiga3d: null,
    sumber: [
      { judul: "NASA: Asal-usul NASA", url: "https://www.nasa.gov/image-article/nasas-origins/" },
      { judul: "NASA: Tahun 1960-an, dari mimpi ke realitas dalam 10 tahun", url: "https://www.nasa.gov/history/the-1960s-from-dream-to-reality-in-10-years/" },
      ...SUMBER_APOLLO,
    ],
  },

  "eksplorasi-bulan": {
    hero: f("/images/galeri/moon-aldrin-bendera.webp", "Buzz Aldrin memberi hormat di dekat bendera AS, Apollo 11, Juli 1969.", "NASA"),
    pengantar:
      "Pada 20 Juli 1969, Eagle mendarat di Laut Ketenangan dan manusia menjejak Bulan untuk pertama kalinya. Ikuti perjalanannya, dan lihat apa yang ditinggalkan di sana.",
    bagian: [
      {
        waktu: "16 Juli 1969",
        judul: "Peluncuran",
        isi: "Roket Saturn V lepas landas dari Kennedy Space Center (Pad 39A) pukul 09.32 EDT. Sekitar 2 jam 44 menit kemudian mesinnya menyala lagi, mendorong pesawat keluar dari orbit Bumi menuju Bulan.",
      },
      {
        waktu: "16 sampai 19 Juli",
        judul: "Menuju Bulan",
        isi: "Columbia berpisah dari roket, lalu bergandengan dengan Eagle. Siaran TV berwarna dari pesawat bisa disaksikan orang di Bumi. Pada 19 Juli pesawat masuk orbit Bulan.",
        foto: f("/images/story/bab-1-apollo-11-orbit.webp", "Modul komando Columbia di orbit Bulan.", "NASA"),
      },
      {
        waktu: "20 Juli",
        judul: "Eagle mendarat",
        isi: "Eagle melepaskan diri dari Columbia. Armstrong dan Aldrin turun, sementara Collins tetap di orbit. Eagle mendarat di Sea of Tranquility (Laut Ketenangan), sekitar 4 mil dari titik yang direncanakan dan sedikit lebih awal dari jadwal.",
        foto: f("/images/galeri/moon-lm-jauh.webp", "Lunar Module dilihat dari kejauhan.", "NASA"),
      },
      {
        waktu: "20 Juli",
        judul: "Satu langkah kecil",
        isi: "Armstrong melangkah di Bulan, dan Aldrin menyusul sekitar 20 menit kemudian. \"Satu langkah kecil bagi manusia, lompatan besar bagi umat manusia.\"",
        foto: f("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong mengumpulkan sampel Bulan.", "NASA"),
      },
      {
        waktu: "20 sampai 21 Juli",
        judul: "Di permukaan Bulan",
        isi: "Mereka berjalan di Bulan sekitar 2,5 jam, total 21 jam 36 menit di permukaan. Mereka mengumpulkan sampel batuan dan memasang alat percobaan. Presiden Nixon menelepon para astronaut saat mereka di sana.",
        foto: f("/images/galeri/moon-easep-bendera.webp", "Aldrin setelah memasang EASEP: seismometer, retroreflektor laser, dan bendera AS di latar.", "NASA"),
      },
      {
        waktu: "21 sampai 24 Juli",
        judul: "Pulang",
        isi: "Eagle lepas landas dan menyambung kembali dengan Columbia, lalu mesin dinyalakan untuk pulang. Pada 24 Juli, pesawat mendarat di Samudra Pasifik dekat kapal USS Hornet. Total perjalanan sekitar 8 hari, dan 21,55 kg sampel batuan dan tanah Bulan dibawa pulang.",
      },
    ],
    galeri: [
      f("/images/galeri/moon-aldrin-bendera.webp", "Buzz Aldrin memberi hormat di dekat bendera AS."),
      f("/images/galeri/moon-lm-jauh.webp", "Lunar Module dilihat dari kejauhan."),
      f("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong mengumpulkan sampel Bulan."),
      f("/images/galeri/moon-aldrin-tangga.webp", "Buzz Aldrin di dekat tangga Lunar Module."),
      f("/images/galeri/moon-aldrin-lm.webp", "Buzz Aldrin di samping Lunar Module."),
      f("/images/galeri/moon-bootprint.webp", "Jejak sepatu astronaut Apollo di debu Bulan."),
      f("/images/galeri/moon-easep-bendera.webp", "Aldrin setelah memasang EASEP; bendera AS di latar."),
      f("/images/galeri/moon-aldrin-membawa-easep.webp", "Aldrin membawa seismometer dan retroreflektor laser."),
      f("/images/galeri/moon-komponen-easep.webp", "Komponen paket eksperimen EASEP."),
      f("/images/galeri/moon-bendera-terpasang.webp", "Bendera AS terpasang di permukaan Bulan."),
      f("/images/galeri/moon-aldrin-angin-matahari.webp", "Buzz Aldrin di samping eksperimen angin Matahari."),
      f("/images/galeri/moon-plakat.webp", "Plakat peringatan Apollo 11."),
      f("/images/galeri/moon-angin-matahari.webp", "Eksperimen angin Matahari Apollo 11."),
      f("/images/galeri/moon-view-moon.webp", "Apollo 11: pemandangan Bulan."),
    ],
    video: [
      v("pengantar-misi", "Pengantar misi Apollo 11", "Pengenalan misi Apollo 11."),
      v("satu-langkah-kecil", "Satu langkah kecil", "Neil Armstrong menjejak Bulan."),
      v("aldrin-menjejak-bulan", "Aldrin menjejak Bulan", "Buzz Aldrin turun ke permukaan Bulan."),
      v("mengibarkan-bendera", "Mengibarkan bendera", "Bendera AS didirikan di permukaan Bulan."),
      v("plakat-peringatan", "Plakat peringatan", "Plakat yang dipasang pada kaki pendarat."),
    ],
    fakta: [
      { isi: "Tahap turun Eagle berukuran lebar 4,2 m dan tebal 1,7 m, dengan massa kering 2.034 kg.", sumber: "NSSDCA" },
      { isi: "Total waktu di permukaan Bulan 21 jam 36 menit, dengan berjalan di Bulan sekitar 2,5 jam.", sumber: "NASA: Apollo 11 Mission Overview" },
      { isi: "Armstrong dan Aldrin meninggalkan medali peringatan untuk tiga astronaut Apollo 1 dan dua kosmonaut, serta cakram silikon berisi pesan dari 73 negara.", sumber: "NASA: Apollo 11 Mission Overview" },
    ],
    artefak: [
      {
        nama: "Tahap turun Eagle",
        status: "Ditinggalkan di Bulan",
        deskripsi: "Bagian bawah pendarat, berfungsi sebagai landasan peluncuran tahap naik. Prisma segi delapan, lebar 4,2 m.",
        foto: f("/images/galeri/moon-lm-jauh.webp", "Lunar Module dilihat dari kejauhan.", "NASA"),
        model: "Model 3D: model umum Apollo Lunar Module (bukan model khusus Eagle), tersedia di lingkungan 3D.",
      },
      {
        nama: "Plakat peringatan",
        status: "Ditinggalkan di Bulan",
        deskripsi: "Dipasang pada kaki pendarat. Tertulis: \"Here men from the planet Earth first set foot upon the moon. July 1969 A.D. We came in peace for all mankind.\"",
        foto: f("/images/galeri/moon-plakat.webp", "Plakat peringatan Apollo 11.", "NASA"),
        model: "Belum ada model 3D NASA: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Bendera Amerika",
        status: "Ditinggalkan di Bulan",
        deskripsi: "Didirikan para astronaut di permukaan Bulan.",
        foto: f("/images/galeri/moon-bendera-terpasang.webp", "Bendera AS terpasang di permukaan Bulan.", "NASA"),
        model: "Belum ada model 3D NASA: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Seismometer (PSE)",
        status: "Ditinggalkan, tidak aktif",
        deskripsi: "Pencatat gempa Bulan di paket EASEP, dipasang sekitar 17 m di selatan pendarat. Bekerja 21 Juli sampai 27 Agustus 1969.",
        foto: f("/images/galeri/moon-komponen-easep.webp", "Komponen paket eksperimen EASEP.", "NASA"),
        model: "Belum ada model 3D NASA: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Retroreflektor laser (LRRR)",
        status: "Ditinggalkan di Bulan",
        deskripsi: "Panel 46 cm berisi 100 cermin sudut dari silika, memantulkan laser dari Bumi. Tidak butuh listrik; dipasang sekitar 5 m dari EASEP.",
        foto: f("/images/galeri/moon-aldrin-membawa-easep.webp", "Aldrin membawa seismometer dan retroreflektor laser.", "NASA"),
        model: "Belum ada model 3D NASA: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Astronaut Bootprint",
        status: "Jejak di debu Bulan",
        deskripsi: "Jejak sepatu astronaut Apollo di permukaan Bulan. Misi dan tanggal foto belum dicatat.",
        foto: f("/images/galeri/moon-bootprint.webp", "Jejak sepatu astronaut Apollo di debu Bulan.", "NASA (kredit rinci belum dicatat)"),
        model: "Ini foto, bukan model 3D: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Paket barang peringatan",
        status: "Ditinggalkan di Bulan",
        deskripsi: "Medali untuk tiga astronaut Apollo 1 dan dua kosmonaut, serta cakram silikon 1,5 inci berisi pesan dari 73 negara.",
        model: "Belum ada model atau foto NASA: hanya informasi teks, ditandai dengan penanda di lingkungan 3D.",
      },
      {
        nama: "Peralatan lain",
        status: "Ditinggalkan di Bulan",
        deskripsi: "Kamera TV, dua kamera foto, peralatan pengambil sampel, ransel pendukung kehidupan (PLSS), sepatu Bulan, dan gnomon.",
        model: "Belum ada model atau foto NASA: hanya informasi teks, ditandai dengan penanda di lingkungan 3D.",
      },
      {
        nama: "Eksperimen angin Matahari",
        status: "Eksperimen Apollo 11",
        deskripsi: "Eksperimen yang dipasang astronaut di permukaan Bulan; Buzz Aldrin terlihat di sampingnya dalam foto NASA.",
        foto: f("/images/galeri/moon-angin-matahari.webp", "Eksperimen angin Matahari Apollo 11.", "NASA"),
        model: "Ini foto, bukan model 3D: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Sampel batuan dan tanah",
        status: "Dibawa pulang ke Bumi",
        deskripsi: "Armstrong mengumpulkan sampel batuan dan tanah Bulan; 21,55 kg dibawa pulang.",
        foto: f("/images/galeri/moon-armstrong-sampel.webp", "Neil Armstrong mengumpulkan sampel Bulan.", "NASA"),
        model: "Ini foto, bukan model 3D: tampil sebagai pelat foto di lingkungan 3D.",
      },
      {
        nama: "Tahap naik Eagle",
        status: "Nasib tidak diketahui",
        deskripsi: "Mengantar Armstrong dan Aldrin kembali ke Columbia, lalu dilepas ke orbit Bulan pada 22 Juli 1969. Diduga jatuh ke Bulan 1 sampai 4 bulan kemudian.",
        model: "Model 3D: bagian atas model umum Apollo Lunar Module, tersedia di lingkungan 3D.",
      },
    ],
    tiga3d: {
      label: "Jelajahi Lingkungan Bulan",
      href: "/story/2",
      deskripsi: "Berdiri di Tranquility Base: lihat Lunar Module dan benda-benda yang ditinggalkan, lalu pilih titik info untuk membaca datanya.",
    },
    sumber: [
      ...SUMBER_APOLLO,
      { judul: "NSSDCA: Apollo 11 (Eagle, EASEP, LRRR)", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C" },
    ],
  },

  "eksplorasi-mars": {
    hero: f("/images/galeri/mars-opportunity-foto-diri.webp", "Foto diri Opportunity, Januari 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
    pengantar:
      "Dua rover kembar mencari jejak air di Mars sejak 2004. Rencananya hanya sekitar 90 hari Mars, tetapi mereka bekerja bertahun-tahun dan mengubah cara kita memahami planet itu.",
    bagian: [
      {
        waktu: "2003",
        judul: "Mencari jejak air",
        isi: "NASA mengirim dua rover kembar ke Mars. Mars kini kering dan dingin, tetapi ilmuwan curiga dulunya basah. Spirit dikirim ke Gusev Crater, kawah besar yang mungkin dulunya danau. Opportunity dikirim ke Meridiani Planum, tempat yang mengandung mineral yang biasanya terbentuk di air.",
      },
      {
        waktu: "10 Juni dan 8 Juli 2003",
        judul: "Peluncuran",
        isi: "Spirit diluncurkan dengan roket Delta II pada 10 Juni 2003. Opportunity menyusul pada 8 Juli 2003 (waktu UT).",
      },
      {
        waktu: "3 dan 24 Januari 2004",
        judul: "Mendarat di dua tempat",
        isi: "Spirit mendarat di Gusev Crater pada 3 Januari 2004, dan Opportunity di Meridiani Planum pada 24 Januari 2004.",
        foto: f("/images/galeri/mars-spirit-gusev.webp", "Rover Spirit di Gusev Crater.", "NASA/JPL-Caltech"),
      },
      {
        waktu: "2 Maret 2004",
        judul: "Bukti air",
        isi: "NASA mengumumkan bukti kuat bahwa Meridiani Planum dulu basah. Opportunity menemukan mineral hematit dan jejak air asin; Spirit menemukan mineral goethite dan tanah yang 90 persen silika, yang juga berkaitan dengan air.",
        foto: f("/images/galeri/mars-meridiani-planum.webp", "Meridiani Planum, lokasi pendaratan Opportunity (citra HiRISE).", "NASA/JPL/Univ. of Arizona"),
      },
      {
        waktu: "Tahun-tahun berikutnya",
        judul: "Jauh melampaui rencana",
        isi: "Keduanya dirancang bekerja sekitar 90 sol (hari di Mars), tetapi terus berjalan. Opportunity menempuh 45,16 km, sedangkan Spirit sekitar 7,7 km. Opportunity juga menemukan Heat Shield Rock, meteorit besi-nikel.",
        foto: f("/images/galeri/mars-heat-shield-rock.webp", "Serpihan pelindung panas Opportunity; Heat Shield Rock di bagian kiri foto.", "NASA/JPL/Cornell"),
      },
      {
        waktu: "2009 sampai 2011",
        judul: "Spirit berhenti",
        isi: "Spirit terjebak di tanah lunak pada 1 Mei 2009, di tepi barat dataran Home Plate. Komunikasi terakhirnya 22 Maret 2010, dan upaya pemulihan resmi berakhir 25 Mei 2011.",
        foto: f("/images/galeri/mars-spirit-tanah-lunak.webp", "Spirit tergelincir di tanah lunak (sol 1889).", "NASA/JPL-Caltech"),
      },
      {
        waktu: "2018 sampai 2019",
        judul: "Opportunity berhenti",
        isi: "Kontak terakhir dengan Opportunity terjadi pada 10 Juni 2018 saat badai debu global, ketika ia berada di Perseverance Valley, ngarai di tepi barat Kawah Endeavour. NASA menyatakan misinya berakhir pada 13 Februari 2019.",
        foto: f("/images/galeri/mars-perseverance-valley.webp", "Pemandangan dari dalam Perseverance Valley.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      },
    ],
    galeri: [
      f("/images/galeri/mars-opportunity-foto-diri.webp", "Foto diri Opportunity, Januari 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      f("/images/galeri/mars-spirit-gusev.webp", "Rover Spirit di Gusev Crater.", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-spirit-home-plate.webp", "Spirit setelah berkendara di sebelah barat Home Plate.", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-spirit-tanah-lunak.webp", "Spirit tergelincir di tanah lunak (sol 1889).", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-heat-shield-rock.webp", "Serpihan pelindung panas Opportunity; Heat Shield Rock di bagian kiri foto.", "NASA/JPL/Cornell"),
      f("/images/galeri/mars-opportunity-sol-354.webp", "Panorama Opportunity sol 354; Heat Shield Rock di kanan.", "NASA/JPL"),
      f("/images/galeri/mars-kawah-endeavour.webp", "Bayangan Opportunity dan pemandangan Kawah Endeavour.", "NASA/JPL-Caltech"),
      f("/images/galeri/mars-perseverance-valley.webp", "Pemandangan dari dalam Perseverance Valley.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
      f("/images/galeri/mars-meridiani-planum.webp", "Meridiani Planum, lokasi pendaratan Opportunity (citra HiRISE).", "NASA/JPL/Univ. of Arizona"),
    ],
    video: [],
    fakta: [
      { isi: "Spirit dan Opportunity mendarat pada Januari 2004. Spirit bekerja sampai 2010 dan Opportunity sampai 2018, lebih dari 14 tahun.", sumber: "NASA Science" },
      { isi: "Opportunity menempuh 45,16 km, rekor sampai dilampaui Perseverance pada 11 Oktober 2026 (45,22 km). Spirit menempuh sekitar 7,7 km.", sumber: "NASA" },
    ],
    artefak: [
      {
        nama: "Rover Spirit",
        status: "Ditinggalkan di Mars, nonaktif",
        deskripsi: "Mendarat di Gusev Crater. Terjebak di tanah lunak di tepi barat Home Plate; komunikasi terakhir 22 Maret 2010.",
        foto: f("/images/galeri/mars-spirit-gusev.webp", "Rover Spirit di Gusev Crater.", "NASA/JPL-Caltech"),
        model: "Model 3D: model umum rover MER (Spirit dan Opportunity kembar), tersedia di lingkungan 3D.",
      },
      {
        nama: "Rover Opportunity",
        status: "Ditinggalkan di Mars, nonaktif",
        deskripsi: "Mendarat di Meridiani Planum. Kontak terakhir 10 Juni 2018 di Perseverance Valley.",
        foto: f("/images/galeri/mars-opportunity-foto-diri.webp", "Foto diri Opportunity, Januari 2014.", "NASA/JPL-Caltech/Cornell Univ./Arizona State Univ."),
        model: "Model 3D: model Mars Exploration Rover Opportunity (MER-B) dari NASA, tersedia di lingkungan 3D.",
      },
      {
        nama: "Heat Shield Rock",
        status: "Temuan Opportunity",
        deskripsi: "Meteorit besi-nikel yang ditemukan Opportunity. Bukan benda buatan manusia.",
        foto: f("/images/galeri/mars-heat-shield-rock.webp", "Serpihan pelindung panas Opportunity; Heat Shield Rock di bagian kiri foto.", "NASA/JPL/Cornell"),
        model: "Belum ada model 3D NASA: tampil sebagai pelat foto di lingkungan 3D.",
      },
    ],
    tiga3d: {
      label: "Jelajahi Lingkungan Mars",
      href: "/story/3",
      deskripsi: "Lihat kedua rover di permukaan Mars, lalu pilih titik info untuk membaca perjalanan masing-masing.",
    },
    sumber: [
      { judul: "NASA Science: Mars Exploration Rovers", url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/" },
      { judul: "NSSDCA: Spirit", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A" },
      { judul: "NSSDCA: Opportunity", url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A" },
      { judul: "NASA: Misi Opportunity berakhir", url: "https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/" },
    ],
  },

  "deep-space": {
    hero: f("/images/galeri/deep-space-voyager-konsep.webp", "Ilustrasi Voyager di ruang antarbintang (konsep seniman).", "NASA/JPL-Caltech"),
    pengantar:
      "Voyager 1 dan 2 terbang ke ruang antarbintang membawa Golden Record, pesan dari Bumi untuk siapa pun yang menemukannya.",
    bagian: [
      {
        waktu: "20 Agustus dan 5 September 1977",
        judul: "Dua pesawat kembar",
        isi: "Voyager 2 diluncurkan pada 20 Agustus 1977, disusul Voyager 1 pada 5 September 1977. Voyager 1 bermassa 721,9 kg.",
        foto: f("/images/galeri/deep-space-golden-record-persiapan.webp", "Persiapan Golden Record untuk Voyager.", "NASA/JPL-Caltech"),
      },
      {
        waktu: "1977 sampai 1989",
        judul: "Melewati planet-planet",
        isi: "Voyager 2 terbang melewati Jupiter, Saturnus, Uranus (24 Januari 1986), dan Neptunus (25 Agustus 1989).",
        foto: f("/images/galeri/deep-space-uranus.webp", "Uranus dilihat Voyager 2.", "NASA/JPL-Caltech"),
      },
      {
        waktu: "Dibawa terbang",
        judul: "Golden Record",
        isi: "Di kedua pesawat ada piringan tembaga berlapis emas selebar 30 cm. Isinya salam dalam 55 bahasa, 35 suara alam, sekitar 90 menit musik, 115 gambar, serta salam Presiden Carter dan Sekjen PBB Waldheim. Sampulnya memuat simbol yang menunjukkan posisi Bumi relatif terhadap beberapa pulsar.",
        foto: f("/images/galeri/deep-space-golden-record-sampul.webp", "Piring sampul Golden Record: diagram cara memutar dan lokasi Bumi.", "NASA (kredit rinci belum dicatat)"),
      },
      {
        waktu: "Agustus 2012 dan 5 November 2018",
        judul: "Keluar ke ruang antarbintang",
        isi: "Voyager 1 memasuki ruang antarbintang pada Agustus 2012, dan Voyager 2 pada 5 November 2018. Sejak 17 Februari 1998, Voyager 1 menjadi objek buatan manusia terjauh dari Matahari.",
      },
      {
        waktu: "Hari ini",
        judul: "Masih beroperasi",
        isi: "Keduanya masih beroperasi dalam misi yang diperpanjang. Sebagian instrumen sudah dimatikan untuk menghemat daya. Per 17 April 2026, instrumen aktif Voyager 1 adalah MAG dan PWS, sedangkan Voyager 2 memakai CRS, MAG, dan PWS. NASA memproyeksikan Voyager 1 berjarak 16,094 miliar mil (25,902 miliar km) dari Bumi pada 18 November 2026.",
      },
    ],
    galeri: [
      f("/images/galeri/deep-space-golden-record-sampul.webp", "Piring sampul Golden Record: diagram cara memutar dan lokasi Bumi.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-golden-record-diagram.webp", "Penjelasan diagram pada sampul Golden Record.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-golden-record.webp", "Voyager Golden Record.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-golden-record-persiapan.webp", "Persiapan Golden Record untuk Voyager.", "NASA/JPL-Caltech"),
      f("/images/galeri/deep-space-voyager-2-antarbintang.webp", "Voyager 2, penjelajah antarbintang.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-jupiter-bintik.webp", "Jupiter dan Bintik Merah Besar, dari Voyager.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-io.webp", "Mosaik bulan Io milik Jupiter, dari Voyager.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-saturnus-cincin.webp", "Detail cincin Saturnus.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-saturnus-atmosfer.webp", "Perubahan atmosfer Saturnus.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-uranus.webp", "Uranus dilihat Voyager 2.", "NASA/JPL-Caltech"),
      f("/images/galeri/deep-space-neptunus.webp", "Neptunus dilihat Voyager 2.", "NASA/JPL"),
      f("/images/galeri/deep-space-neptunus-bintik-gelap.webp", "Neptunus: Bintik Gelap Besar.", "NASA/JPL"),
      f("/images/galeri/deep-space-pale-blue-dot.webp", "Pale Blue Dot, ditinjau ulang.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-saturnus-lanjut.webp", "Saturnus dalam perjalanan Voyager.", "NASA (kredit rinci belum dicatat)"),
      f("/images/galeri/deep-space-voyager-konsep.webp", "Ilustrasi Voyager di ruang antarbintang (konsep seniman).", "NASA/JPL-Caltech"),
    ],
    video: [],
    fakta: [
      { isi: "Voyager 2 melewati Uranus pada 24 Januari 1986 dan Neptunus pada 25 Agustus 1989.", sumber: "NASA Science" },
      { isi: "Golden Record berisi salam 55 bahasa, 35 suara alam, sekitar 90 menit musik, dan 115 gambar.", sumber: "NASA Science" },
      { isi: "Per 21 Agustus 2024, Voyager 1 berjarak 164,7 SA dari Matahari dan melaju 17,0 km/detik relatif terhadap Matahari (data lama).", sumber: "NASA Science: Voyager 1" },
    ],
    artefak: [
      {
        nama: "Voyager 1",
        status: "Masih beroperasi",
        deskripsi: "Diluncurkan 5 September 1977, bermassa 721,9 kg. Memasuki ruang antarbintang pada Agustus 2012.",
        foto: f("/images/galeri/deep-space-voyager-konsep.webp", "Ilustrasi Voyager di ruang antarbintang (konsep seniman).", "NASA/JPL-Caltech"),
        model: "Model 3D: model umum Voyager Probe (B) dari NASA, tersedia di lingkungan 3D.",
      },
      {
        nama: "Voyager 2",
        status: "Masih beroperasi",
        deskripsi: "Diluncurkan 20 Agustus 1977. Memasuki ruang antarbintang pada 5 November 2018.",
        foto: f("/images/galeri/deep-space-voyager-2-antarbintang.webp", "Voyager 2, penjelajah antarbintang.", "NASA (kredit rinci belum dicatat)"),
        model: "Model 3D: model umum Voyager Probe (A) dari NASA, tersedia di lingkungan 3D.",
      },
      {
        nama: "Golden Record Cover",
        status: "Dibawa terbang ke ruang antarbintang",
        deskripsi: "Sampul piringan: diagram cara memutar dan lokasi Bumi, dengan simbol posisi Bumi relatif terhadap beberapa pulsar.",
        foto: f("/images/galeri/deep-space-golden-record-sampul.webp", "Sampul Golden Record.", "NASA (kredit rinci belum dicatat)"),
        model: "NASA hanya menyediakan foto: tampil sebagai potongan foto asli di lingkungan 3D.",
      },
      {
        nama: "Golden Record",
        status: "Dibawa terbang ke ruang antarbintang",
        deskripsi: "Piringan tembaga berlapis emas, 30 cm, ada di kedua pesawat.",
        foto: f("/images/galeri/deep-space-golden-record.webp", "Voyager Golden Record.", "NASA (kredit rinci belum dicatat)"),
        model: "NASA hanya menyediakan foto: tampil sebagai potongan foto asli di lingkungan 3D.",
      },
    ],
    tiga3d: {
      label: "Jelajahi Lingkungan Deep Space",
      href: "/story/4",
      deskripsi: "Lihat kedua Voyager melayang di ruang antarbintang, lalu pilih titik info untuk membaca kisah masing-masing.",
    },
    sumber: [
      { judul: "NASA Science: Voyager", url: "https://science.nasa.gov/mission/voyager/" },
      { judul: "NASA Science: Voyager 1", url: "https://science.nasa.gov/mission/voyager/voyager-1/" },
      { judul: "NASA Science: Where Are They Now", url: "https://science.nasa.gov/mission/voyager/where-are-they-now/" },
      { judul: "NASA Science: Golden Record", url: "https://science.nasa.gov/mission/voyager/golden-record-contents/" },
    ],
  },
};

export function getCerita(slug: CeritaSlug): CeritaBab {
  const babId = (CERITA_SLUGS.indexOf(slug) + 1) as BabId;
  const bab = getBab(babId);
  return {
    slug,
    babId,
    nomor: String(babId).padStart(2, "0"),
    judul: bab?.judul ?? "",
    ringkasan: bab?.ringkasan ?? "",
    ...DATA[slug],
  };
}
