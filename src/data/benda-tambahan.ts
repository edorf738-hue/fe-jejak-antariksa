import type { BabId, DataBenda } from "./types";

/**
 * Benda tambahan yang sudah tercatat di NASA History/04_Artefak.md (sumber NSSDCA) tetapi belum ada di content-data.json.
 * Ditambahkan di belakang benda dari content-data.json, jadi urutan Titik Info lama tidak berubah. Tidak ada fakta baru:
 * semua nilai disalin dari catatan itu. Cek ulang bersama Dhika sebelum dipindah ke content-data.json. Hanya English: versi Indonesia sudah ada di snapshot API (scene-objects).
 */
export const BENDA_TAMBAHAN_EN: Partial<Record<BabId, DataBenda[]>> = {
  2: [
    {
      id: "2-3",
      hotspot: "Seismometer",
      nama: "Seismometer (PSE)",
      kategori: "Left behind, inactive",
      deskripsi: "A moonquake recorder, placed about 17 m south of the lander.",
      fakta: "Worked from 21 July to 27 August 1969",
      sumber: "NSSDCA",
      model3d: null,
    },
    {
      id: "2-4",
      hotspot: "Laser retroreflector",
      nama: "Laser retroreflector (LRRR)",
      kategori: "Left on the Moon",
      deskripsi: "A 46 cm panel of 100 corner mirrors that reflects lasers from Earth.",
      fakta: "Needs no power; placed about 5 m from the EASEP",
      sumber: "NSSDCA",
      model3d: null,
    },
    {
      id: "2-5",
      hotspot: "Eagle ascent stage",
      nama: "Eagle ascent stage",
      kategori: "Fate unknown",
      deskripsi: "Carried Armstrong and Aldrin back to Columbia.",
      fakta: "Released into lunar orbit on 22 July 1969; believed to have crashed into the Moon",
      sumber: "NSSDCA",
      model3d: { file: "Apollo Lunar Module.glb", jenis: "model umum", catatan: "The upper part of the lander model." },
    },
    {
      id: "2-6",
      hotspot: "Astronaut Bootprint",
      nama: "Astronaut Bootprint",
      kategori: "Photo from an Apollo mission",
      deskripsi: "An Apollo astronaut's bootprint in the lunar dust.",
      fakta: "The mission and date of the photo are not recorded",
      sumber: "NASA",
      model3d: null,
    },
    {
      id: "2-7",
      hotspot: "Commemorative items",
      nama: "Commemorative items",
      kategori: "Left on the Moon",
      deskripsi: "Medals for Apollo 1 astronauts and two cosmonauts, plus a silicon disc.",
      fakta: "A 1.5-inch disc holding messages from 73 countries",
      sumber: "NASA: Apollo 11 Mission Overview",
      model3d: null,
    },
    {
      id: "2-8",
      hotspot: "Other equipment",
      nama: "Other equipment",
      kategori: "Left on the Moon",
      deskripsi: "A TV camera, two still cameras, sampling tools, the PLSS, lunar boots, a gnomon.",
      fakta: "The lander's weight dropped from 15,897 to 10,821 pounds",
      sumber: "NASA: Apollo 11 log (1969)",
      model3d: null,
    },
    {
      id: "2-9",
      hotspot: "Solar wind experiment",
      nama: "Solar wind experiment",
      kategori: "An Apollo 11 experiment",
      deskripsi: "An experiment set up by the astronauts on the lunar surface.",
      fakta: "Buzz Aldrin can be seen beside it in a NASA photo",
      sumber: "NASA",
      model3d: null,
    },
    {
      id: "2-10",
      hotspot: "Moon samples",
      nama: "Rock and soil samples",
      kategori: "Brought home to Earth",
      deskripsi: "Armstrong collected samples of lunar rock and soil.",
      fakta: "21.55 kg brought home",
      sumber: "NASA (verification: TBD)",
      model3d: null,
    },
  ],
  4: [
    {
      id: "4-3",
      hotspot: "Golden Record Cover",
      nama: "Golden Record Cover",
      kategori: "Carried into interstellar space",
      deskripsi: "The disc's cover: a diagram of how to play it and where Earth is.",
      fakta: "Holds a symbol showing Earth's position relative to several pulsars",
      sumber: "NASA Science",
      model3d: null,
    },
  ],
};
