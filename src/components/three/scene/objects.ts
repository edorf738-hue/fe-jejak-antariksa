import type { Environment } from "./config";

/**
 * NASA objects placed inside the environments, and the hotspots tied to them.
 * Only objects with a real NASA model are listed. Heat Shield Rock (Mars), the flag (Moon) and the Golden Record (Deep Space)
 * have no model in the pack, so they get no stand-in object.
 * Model files are the "model umum" from the NASA pack, not models of the exact spacecraft (see content-data.json).
 */
export type ObjekDef = {
  id: string;
  /** File in /public/models/objek. Omitted = only a hotspot marker on the ground (no model exists for this item). */
  model?: string;
  /** Largest dimension of the model, in scene metres (the Moon/Deep Space GLBs are in metres). */
  sizeM?: number;
  /** Horizontal place [x, z]. */
  at: [number, number];
  /** Items with no 3D model are shown as a framed NASA photo plate standing at `at` (file in /public). */
  foto?: string;
  /** "bulat": the photo is a round cut-out (a disc) with a soft glow instead of a framed rectangle. */
  bentuk?: "bulat";
  /** Width of that plate in metres. */
  fotoLebarM?: number;
  /** Rest on the ground found under `at` (Moon). Otherwise it floats at `y` (Deep Space). */
  ground: boolean;
  y?: number;
  yawDeg: number;
  /** Hotspots on this object: index into the page's `benda`, and offset from the object's centre as a fraction of `sizeM`. */
  titik: { bendaIdx: number; offset: [number, number, number]; label?: string }[];
};

export const objek: Record<Environment, ObjekDef[]> = {
  moon: [
    {
      id: "lunar-module",
      model: "/models/objek/apollo-lunar-module.glb",
      sizeM: 7,
      at: [3, -30],
      ground: true,
      yawDeg: 200,
      titik: [
        { bendaIdx: 0, offset: [0, -0.1, 0] }, // Tahap turun Eagle (the lower, gold part)
        { bendaIdx: 5, offset: [0, 0.22, 0] }, // Tahap naik Eagle (the upper part)
        { bendaIdx: 1, offset: [0.28, -0.2, 0.3] }, // Plakat, on a landing leg
      ],
    },
    // No models exist for these (not in the NASA pack): each stands as a framed NASA photo plate, placed roughly (PSE about 17 m from the lander,
    // LRRR about 5 m from it, per NSSDCA); the data card says so.
    { id: "bendera", foto: "/images/galeri/moon-bendera-terpasang.webp", fotoLebarM: 3, at: [-9, -38], ground: true, yawDeg: 0, titik: [{ bendaIdx: 2, offset: [0, 0, 0] }] },
    { id: "seismometer", foto: "/images/galeri/moon-komponen-easep.webp", fotoLebarM: 2.1, at: [-3.5, -23], ground: true, yawDeg: 0, titik: [{ bendaIdx: 3, offset: [0, 0, 0] }] },
    { id: "bootprint", foto: "/images/objek/bootprint.webp", fotoLebarM: 1.8, at: [0.5, -17], ground: true, yawDeg: 0, titik: [{ bendaIdx: 6, offset: [0, 0, 0] }] },
    { id: "angin-matahari", foto: "/images/galeri/moon-angin-matahari.webp", fotoLebarM: 2, at: [7.5, -21], ground: true, yawDeg: 0, titik: [{ bendaIdx: 9, offset: [0, 0, 0] }] },
    { id: "sampel-bulan", foto: "/images/galeri/moon-armstrong-sampel.webp", fotoLebarM: 2.2, at: [-8, -27], ground: true, yawDeg: 0, titik: [{ bendaIdx: 10, offset: [0, 0, 0] }] },
    // Text-only items (no model and no photo exist): a plain ground marker, the popup shows the information.
    { id: "paket-peringatan", at: [-1.5, -33], ground: true, yawDeg: 0, titik: [{ bendaIdx: 7, offset: [0, 0, 0] }] },
    { id: "peralatan-lain", at: [6, -36], ground: true, yawDeg: 0, titik: [{ bendaIdx: 8, offset: [0, 0, 0] }] },
    { id: "retroreflektor", foto: "/images/galeri/moon-aldrin-membawa-easep.webp", fotoLebarM: 2.4, at: [10, -27], ground: true, yawDeg: 0, titik: [{ bendaIdx: 4, offset: [0, 0, 0] }] },
  ],
  // Spirit uses the official "Mars Exploration Rovers 3D Model" (one rover mesh; Spirit and Opportunity are twins of one design).
  // Opportunity uses NASA's own "Mars Exploration Rover - Opportunity (MER-B)" model. Heat Shield Rock has no model.
  mars: [
    {
      id: "spirit",
      model: "/models/objek/mer-rover.glb",
      sizeM: 2.6,
      at: [-5.5, -23],
      ground: true,
      yawDeg: -25,
      titik: [{ bendaIdx: 0, offset: [0, 0.1, 0] }], // Rover Spirit
    },
    {
      id: "opportunity",
      model: "/models/objek/mer-b-opportunity.glb",
      sizeM: 2.6,
      at: [4, -17.5],
      ground: true,
      yawDeg: 65,
      titik: [{ bendaIdx: 1, offset: [0, 0.1, 0] }], // Rover Opportunity
    },
    // Heat Shield Rock has no model: a ground marker near Opportunity (symbolic position; the card says so).
    { id: "heat-shield-rock", foto: "/images/galeri/mars-heat-shield-rock.webp", fotoLebarM: 2.6, at: [-0.5, -31], ground: true, yawDeg: 0, titik: [{ bendaIdx: 2, offset: [0, 0, 0] }] },
  ],
  "deep-space": [
    {
      id: "voyager-1",
      model: "/models/objek/voyager-probe.glb",
      sizeM: 8,
      at: [-6, -30],
      ground: false,
      y: 3,
      yawDeg: 35,
      titik: [
        { bendaIdx: 0, offset: [0, 0.12, 0] }, // Voyager 1
      ],
    },
    // The Golden Record and its cover are two artifacts carried by both Voyagers. NASA has only photos, so each is a cut-out of a
    // real NASA photo (not a 3D model; the popup says so), kept small and apart from the spacecraft so Voyager stays in view.
    { id: "golden-record", bentuk: "bulat", foto: "/images/objek/golden-record-cakram.webp", fotoLebarM: 2.3, at: [0.6, -25], ground: false, y: 1.2, yawDeg: -20, titik: [{ bendaIdx: 2, offset: [0.27, -0.22, 0] }] },
    { id: "golden-record-sampul", bentuk: "bulat", foto: "/images/objek/golden-record-sampul.webp", fotoLebarM: 2.2, at: [5, -26.5], ground: false, y: 0.9, yawDeg: 22, titik: [{ bendaIdx: 3, offset: [0.2, -0.28, 0] }] },
    {
      id: "voyager-2",
      model: "/models/objek/voyager-probe-a.glb",
      sizeM: 8,
      at: [9, -42],
      ground: false,
      y: 7,
      yawDeg: -60,
      titik: [{ bendaIdx: 1, offset: [0, 0, 0] }], // Voyager 2
    },
  ],
};
