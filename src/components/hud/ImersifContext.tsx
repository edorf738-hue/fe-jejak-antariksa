"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type { DataBenda } from "@/data";

/**
 * Jembatan antara HUD (HalamanImersif) dan komponen 3D yang dipasang di slot `scene`,
 * `hotspots`, dan `objek` (kontrak 3D <-> HUD, PEMBAGIAN_TUGAS bagian 5). Komponen 3D
 * memakai hook di bawah; HUD tidak mengimpor Three.js.
 *
 *  - Edo (`SceneCanvas`): baca `paused`, pasang `useResetKamera(() => resetCamera())`.
 *  - Zhafran (`HotspotLayer`, `ObjectViewer`): baca `benda`, `bendaIdx`, panggil `pilihBenda(i)`.
 */
/** Status scene 3D (kontrak bagian 5): memuat aset, siap dipakai, atau gagal (tampil gambar statis). */
export type StatusScene = "memuat" | "siap" | "fallback";

export type ImersifState = {
  /** Status scene saat ini. Tanpa slot `scene`, selalu "siap" (gambar statis). */
  statusScene: StatusScene;
  /**
   * Dilaporkan scene: `setStatusScene("memuat", 0.4)` (progres 0-1 opsional; tanpa nilai bilah
   * bergerak), `setStatusScene("siap")` setelah termuat, `setStatusScene("fallback")` bila gagal.
   * Saat fallback, scene dilepas dan HUD menampilkan gambar statis; tombol Coba Lagi memasang
   * ulang slot `scene` (komponen dibuat baru, jadi harus melapor "memuat" lagi saat mulai).
   */
  setStatusScene: (status: StatusScene, progres?: number) => void;
  /** Daftar benda halaman ini; indeks = urutan Titik Info. */
  benda: DataBenda[];
  /** Indeks benda yang terbuka (kartu data tampil), atau null. */
  bendaIdx: number | null;
  /** Buka benda ke-`idx`; `null` menutup kartu data. */
  pilihBenda: (idx: number | null) => void;
  /** Jeda Gerak: pilihan pengguna, atau otomatis aktif bila `prefers-reduced-motion`. */
  paused: boolean;
  /** Daftarkan fungsi yang dipanggil tombol Setel Ulang Kamera. Mengembalikan fungsi pelepas. */
  daftarkanReset: (fn: () => void) => () => void;
};

export const ImersifContext = createContext<ImersifState | null>(null);

export function useImersif(): ImersifState {
  const ctx = useContext(ImersifContext);
  if (!ctx) throw new Error("useImersif hanya boleh dipakai di dalam HalamanImersif.");
  return ctx;
}

/** Hubungkan tombol Setel Ulang Kamera di HUD ke fungsi reset milik scene. */
export function useResetKamera(reset: () => void) {
  const { daftarkanReset } = useImersif();
  const terbaru = useRef(reset);
  useEffect(() => {
    terbaru.current = reset;
  });
  useEffect(() => daftarkanReset(() => terbaru.current()), [daftarkanReset]);
}
