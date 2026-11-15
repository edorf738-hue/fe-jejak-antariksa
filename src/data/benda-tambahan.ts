import type { BabId, DataBenda } from "./types";

/**
 * Benda tambahan yang sudah tercatat di NASA History/04_Artefak.md (sumber NSSDCA) tetapi belum ada di content-data.json.
 * Ditambahkan di belakang benda dari content-data.json, jadi urutan Titik Info lama tidak berubah. Tidak ada fakta baru:
 * semua nilai disalin dari catatan itu. Cek ulang bersama Dhika sebelum dipindah ke content-data.json.
 */
export const BENDA_TAMBAHAN: Partial<Record<BabId, DataBenda[]>> = {
  2: [
    {
      id: "2-3",
      hotspot: "Seismometer",
      nama: "Seismometer (PSE)",
      kategori: "Ditinggalkan, tidak aktif",
      deskripsi: "Pencatat gempa Bulan, dipasang sekitar 17 m di selatan pendarat.",
      fakta: "Bekerja 21 Juli sampai 27 Agustus 1969",
      sumber: "NSSDCA",
      model3d: null,
    },
    {
      id: "2-4",
      hotspot: "Retroreflektor laser",
      nama: "Retroreflektor laser (LRRR)",
      kategori: "Ditinggalkan di Bulan",
      deskripsi: "Panel 46 cm berisi 100 cermin sudut, memantulkan laser dari Bumi.",
      fakta: "Tidak butuh listrik; dipasang sekitar 5 m dari EASEP",
      sumber: "NSSDCA",
      model3d: null,
    },
    {
      id: "2-5",
      hotspot: "Tahap naik Eagle",
      nama: "Tahap naik Eagle",
      kategori: "Nasib tidak diketahui",
      deskripsi: "Mengantar Armstrong dan Aldrin kembali ke Columbia.",
      fakta: "Dilepas ke orbit Bulan 22 Juli 1969; diduga jatuh ke Bulan",
      sumber: "NSSDCA",
      model3d: { file: "Apollo Lunar Module.glb", jenis: "model umum", catatan: "Bagian atas model pendarat." },
    },
    {
      id: "2-6",
      hotspot: "Astronaut Bootprint",
      nama: "Astronaut Bootprint",
      kategori: "Foto dari misi Apollo",
      deskripsi: "Jejak sepatu astronaut Apollo di debu Bulan.",
      fakta: "Misi dan tanggal foto belum dicatat",
      sumber: "NASA",
      model3d: null,
    },
    {
      id: "2-7",
      hotspot: "Paket barang peringatan",
      nama: "Paket barang peringatan",
      kategori: "Ditinggalkan di Bulan",
      deskripsi: "Medali untuk astronaut Apollo 1 dan dua kosmonaut, serta cakram silikon.",
      fakta: "Cakram 1,5 inci berisi pesan dari 73 negara",
      sumber: "NASA: Apollo 11 Mission Overview",
      model3d: null,
    },
    {
      id: "2-8",
      hotspot: "Peralatan lain",
      nama: "Peralatan lain",
      kategori: "Ditinggalkan di Bulan",
      deskripsi: "Kamera TV, dua kamera foto, alat pengambil sampel, PLSS, sepatu Bulan, gnomon.",
      fakta: "Berat pendarat turun dari 15.897 ke 10.821 pon",
      sumber: "NASA: log Apollo 11 (1969)",
      model3d: null,
    },
    {
      id: "2-9",
      hotspot: "Eksperimen angin Matahari",
      nama: "Eksperimen angin Matahari",
      kategori: "Eksperimen Apollo 11",
      deskripsi: "Eksperimen yang dipasang astronaut di permukaan Bulan.",
      fakta: "Buzz Aldrin terlihat di sampingnya dalam foto NASA",
      sumber: "NASA",
      model3d: null,
    },
    {
      id: "2-10",
      hotspot: "Sampel Bulan",
      nama: "Sampel batuan dan tanah",
      kategori: "Dibawa pulang ke Bumi",
      deskripsi: "Armstrong mengumpulkan sampel batuan dan tanah Bulan.",
      fakta: "21,55 kg dibawa pulang",
      sumber: "NASA (verifikasi: TBD)",
      model3d: null,
    },
  ],
  4: [
    {
      id: "4-3",
      hotspot: "Golden Record Cover",
      nama: "Golden Record Cover",
      kategori: "Dibawa terbang ke ruang antarbintang",
      deskripsi: "Sampul piringan: diagram cara memutar dan lokasi Bumi.",
      fakta: "Memuat simbol posisi Bumi relatif terhadap beberapa pulsar",
      sumber: "NASA Science",
      model3d: null,
    },
  ],
};
