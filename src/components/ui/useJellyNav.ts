"use client";

import { animate, useReducedMotion } from "motion/react";
import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";

/**
 * Efek jelly untuk tautan navigasi, diadaptasi dari React Bits "JellyRadio" (logika pegas
 * sama, dengan skala X dan Y yang bergerak berbeda). Bedanya dengan aslinya: item adalah tautan
 * (bukan radio), item aktif ditentukan dari rute, dan ukuran saat diam TIDAK berubah: semua tautan
 * tetap berukuran standar. Jelly hanya hentakan sesaat saat rute berganti: tautan yang baru aktif
 * muncul membengkak lalu berayun ke ukuran normal, tetangganya terdorong menjauh lalu kembali.
 *
 * Efek hanya berjalan di desktop (>= 1024 px, tautan berjajar); di menu turun (tablet/mobile)
 * semua item dibiarkan tanpa transformasi.
 *
 * Animasi memakai `animate()` pada elemen DOM (Web Animations API, pegas diubah menjadi kurva
 * `linear()`), jadi berjalan di compositor dan tidak tertahan saat navigasi Next merender halaman
 * baru. Pegas bergerak berdasarkan waktu: dengan versi JS per-frame, jeda ~300 ms dari render
 * halaman menghabiskan hampir seluruh ayunan (diukur di build produksi).
 *
 * Tiap item butuh tiga lapisan bersarang agar tiap sumbu punya pegas sendiri (efek jelly =
 * skala X dan Y bergerak berbeda): `li` (geser X), `div` (skala X), `div` (skala Y):
 *   <li ref={jelly.x(i)}><div ref={jelly.sx(i)}><div ref={jelly.sy(i)}> ...tautan... </div></div></li>
 */

// Besar hentakan awal (nilai bawaan JellyRadio: swell 0,2, barge 6, shrink 0,05, ...).
const SWELL = 0.2; // item yang baru aktif mulai dari skala 1 + SWELL, lalu berayun ke 1
const BARGE = 6; // dorongan tambahan (px) pada tetangga di awal hentakan
const SHRINK = 0.05; // tetangga mulai dari skala 1 - SHRINK, lalu kembali ke 1
const JELLY = 1; // kekuatan efek jelly (peregangan x dan y berbeda)
const BOUNCE = 0.25; // pantulan pegas (0-1)
const HOVER = 0.6; // kekuatan jelly saat hover relatif terhadap ganti rute
const HOVER_TUNDA = 90; // ms kursor harus bertahan sebelum jelly hover jalan (lewat cepat tidak memicu)
const HOVER_NAIK = 240; // kekakuan pegas saat membengkak (lembut, tanpa pantulan); ayun balik memakai pegas jelly
const STAGGER = 22; // jeda antar-item (ms) menurut jaraknya dari item aktif
const STIFFNESS = 580;
const MASSA = 0.9;

const spring = (k: number, m: number, bounce: number) => ({
  type: "spring" as const,
  stiffness: k,
  damping: 2 * Math.sqrt(k * m) * (1 - bounce),
  mass: m,
});

type Lapis = { x: HTMLLIElement | null; sx: HTMLDivElement | null; sy: HTMLDivElement | null };

const QUERY_DESKTOP = "(min-width: 1024px)";
function useDesktop() {
  return useSyncExternalStore(
    (ubah) => {
      const mq = window.matchMedia(QUERY_DESKTOP);
      mq.addEventListener("change", ubah);
      return () => mq.removeEventListener("change", ubah);
    },
    () => window.matchMedia(QUERY_DESKTOP).matches,
    () => false,
  );
}

const geserX = (n: number) => `translateX(${n}px)`;
const skalaX = (n: number) => `scaleX(${n})`;
const skalaY = (n: number) => `scaleY(${n})`;

/** `semuaLayar`: jalankan juga di bawah 1024 px (untuk deretan tombol seperti filter, bukan menu turun). */
export function useJellyNav(jumlah: number, aktif: number, semuaLayar = false) {
  const gerakDikurangi = useReducedMotion();
  const lebar = useDesktop();
  const desktop = lebar || semuaLayar;
  const lapis = useRef<Lapis[]>([]);
  const generasi = useRef(0); // naik tiap hentakan baru; tahap ayun hover yang usang berhenti
  const terakhir = useRef<{ aktif: number; terapkan: unknown } | null>(null);

  const terapkan = useCallback(
    (sel: number, instan: boolean) => {
      generasi.current++;
      const daftar = lapis.current;
      const dorong = ((daftar[sel]?.x?.offsetWidth ?? 0) * SWELL) / 2 + BARGE;
      const efek = desktop && sel >= 0 && !instan && !gerakDikurangi;
      for (let i = 0; i < jumlah; i++) {
        const l = daftar[i];
        if (!l) continue;
        const semua = [l.x, l.sx, l.sy];
        semua.forEach((e) => e?.getAnimations().forEach((a) => a.cancel()));
        if (!efek) {
          // Keadaan diam (juga di luar desktop): ukuran standar, tanpa transformasi.
          semua.forEach((e) => e && (e.style.transform = ""));
          continue;
        }
        const jauh = Math.abs(i - sel);
        const awalX = Math.sign(i - sel) * dorong;
        const awalS = i === sel ? 1 + SWELL : 1 - SHRINK;
        const k = STIFFNESS * (1 - 0.12 * Math.min(jauh, 3));
        const delay = (jauh * STAGGER) / 1000;
        // Hentakan: mulai dari bentuk "terdorong" lalu pegas kembali ke ukuran standar (tanpa transformasi).
        const jalan = (el: HTMLElement | null, fn: (n: number) => string, dari: number, akhir: number, o: ReturnType<typeof spring> & { delay: number }) => {
          if (!el) return;
          el.style.transform = fn(dari);
          // Setelah animasi selesai (motion menulis nilai akhir dulu, maka ditunda satu frame), kembali ke
          // keadaan standar tanpa transformasi; dilewati bila hentakan baru sudah berjalan di elemen ini.
          animate(el, { transform: [fn(dari), fn(akhir)] }, o).then(() => {
            requestAnimationFrame(() => {
              if (el.getAnimations().length === 0) el.style.transform = "";
            });
          });
        };
        jalan(l.x, geserX, awalX, 0, { ...spring(k, MASSA, BOUNCE), delay });
        jalan(l.sx, skalaX, awalS, 1, {
          ...spring(k * (1 + 0.24 * JELLY), MASSA - 0.1 * JELLY, Math.min(0.85, BOUNCE + 0.3 * JELLY)),
          delay,
        });
        jalan(l.sy, skalaY, awalS, 1, {
          ...spring(k * (1 - 0.14 * JELLY), MASSA + 0.05 * JELLY, BOUNCE),
          delay: delay + 0.05 * JELLY,
        });
      }
    },
    [jumlah, desktop, gerakDikurangi],
  );

  // Pertama kali (atau saat mode desktop/gerak berubah): langsung ke keadaan diam; ganti rute: hentakan jelly.
  useLayoutEffect(() => {
    const sebelumnya = terakhir.current;
    const instan = !sebelumnya || sebelumnya.terapkan !== terapkan;
    if (sebelumnya && !instan && sebelumnya.aktif === aktif) return;
    terakhir.current = { aktif, terapkan };
    terapkan(aktif, instan);
  }, [aktif, terapkan]);

  const pegang = (i: number) => lapis.current[i] ?? (lapis.current[i] = { x: null, sx: null, sy: null });

  // Hover: dua tahap supaya halus. (1) dari bentuk SAAT INI (tanpa lompat bila animasi sebelumnya masih
  // berjalan) membengkak pelan ke puncak tanpa pantulan; (2) berayun jelly kembali ke ukuran standar.
  const tunda = useRef(0);
  const hentakHover = (sel: number) => {
    if (!desktop || gerakDikurangi) return;
    const gen = ++generasi.current;
    const daftar = lapis.current;
    const dorong = ((daftar[sel]?.x?.offsetWidth ?? 0) * SWELL * HOVER) / 2 + BARGE * HOVER;
    for (let i = 0; i < jumlah; i++) {
      const l = daftar[i];
      if (!l) continue;
      const jauh = Math.abs(i - sel);
      const delay = (jauh * STAGGER * 2) / 1000;
      const puncakS = i === sel ? 1 + SWELL * HOVER : 1 - SHRINK * HOVER;
      const k = STIFFNESS * (1 - 0.12 * Math.min(jauh, 3));
      const tahap = (el: HTMLElement | null, fn: (n: number) => string, diam: number, puncak: number, balik: ReturnType<typeof spring>) => {
        if (!el) return;
        const kini = getComputedStyle(el).transform;
        const dari = kini && kini !== "none" ? kini : fn(diam);
        el.getAnimations().forEach((a) => a.cancel());
        animate(el, { transform: [dari, fn(puncak)] }, { ...spring(HOVER_NAIK, MASSA, 0), delay }).then(() => {
          if (gen !== generasi.current) return;
          animate(el, { transform: [fn(puncak), fn(diam)] }, balik).then(() => {
            requestAnimationFrame(() => {
              if (el.getAnimations().length === 0) el.style.transform = "";
            });
          });
        });
      };
      tahap(l.x, geserX, 0, Math.sign(i - sel) * dorong, spring(k, MASSA, BOUNCE));
      tahap(l.sx, skalaX, 1, puncakS, spring(k * (1 + 0.24 * JELLY), MASSA - 0.1 * JELLY, Math.min(0.85, BOUNCE + 0.3 * JELLY)));
      tahap(l.sy, skalaY, 1, puncakS, spring(k * (1 - 0.14 * JELLY), MASSA + 0.05 * JELLY, BOUNCE));
    }
  };

  return {
    /** Jelly saat kursor bertahan di tautan `i` (hanya mouse di desktop); `keluar` membatalkan bila kursor lewat cepat. */
    hover: (i: number) => {
      window.clearTimeout(tunda.current);
      tunda.current = window.setTimeout(() => hentakHover(i), HOVER_TUNDA);
    },
    keluar: () => window.clearTimeout(tunda.current),
    /** `ref` untuk `li` (geser X), `div` pertama (skala X), dan `div` kedua (skala Y) tiap item. */
    x: (i: number) => (el: HTMLLIElement | null) => {
      pegang(i).x = el;
    },
    sx: (i: number) => (el: HTMLDivElement | null) => {
      pegang(i).sx = el;
    },
    sy: (i: number) => (el: HTMLDivElement | null) => {
      pegang(i).sy = el;
    },
  };
}
