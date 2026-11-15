"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { DataBenda, FokusGambar, PosisiTitik } from "@/data";
import { IMERSIF_COPY, MEDIA_BENDA } from "@/data";
import { ImersifContext, type ImersifState, type StatusScene } from "./ImersifContext";
import { ObjectPopup } from "./ObjectPopup";
import { KartuNarasi } from "./KartuNarasi";
import { KontrolScene } from "./KontrolScene";
import { Panel } from "./Panel";
import { LatarScene, Objek3DPlaceholder, PenandaPlaceholder, TitikInfoPlaceholder } from "./ScenePlaceholder";
import { OverlayMemuat3D, PesanFallback3D } from "./StatusScene";
import { TombolKembali } from "./TombolKembali";
import { Button } from "@/components/ui";
import { PANEL_META, type PanelJenis } from "./TombolPanel";

/**
 * Kerangka halaman imersif (Story Bab 1-4 dan Resources): scene 3D memenuhi layar
 * (lapisan 0), gradien keterbacaan (lapisan 1), lalu HUD (kembali, narasi, tombol panel,
 * kontrol scene, dok) dan panel.
 *
 * Slot 3D (opsional; tanpa slot, yang tampil adalah placeholder gambar dan titik statis):
 *  - `scene`: kanvas scene (Edo), menggantikan gambar latar; gradien HUD tetap di atasnya.
 *  - `hotspots`: lapisan Titik Info (Zhafran), menggantikan titik statis.
 *  - `objek`: pratinjau benda terpilih (Zhafran), menggantikan "Pratinjau model 3D".
 * Komponen di slot itu membaca state HUD lewat `useImersif()` dan menyambungkan tombol
 * Setel Ulang Kamera lewat `useResetKamera()` (lihat ImersifContext.tsx).
 *
 * Tata letak mengikuti Figma: desktop 1440x900 (posisi mutlak dari tepi konten),
 * tablet 768x1024 dan mobile 390x844 (HUD menumpuk di bawah; panel penuh layar).
 */
type HalamanImersifProps = {
  gambar: string;
  /** Scene 3D belum ada (Bab 1): tampilkan penanda placeholder. */
  scenePlaceholder?: boolean;
  /** Story: tombol panel berupa kolom di kanan atas; Resources: baris. */
  varian: "story" | "resources";
  kembali: { href: string; label: string };
  narasi: { eyebrow: string; judul: string; isi: string };
  benda: DataBenda[];
  /** Posisi Titik Info dari frame Figma (ilustrasi; menunggu proyeksi 3D). */
  posisiTitik: PosisiTitik;
  /** Fokus horizontal gambar latar per ukuran layar (crop Figma). */
  fokusGambar: FokusGambar;
  jenisPanel: PanelJenis[];
  /** Isi tiap panel (dirender server dari data). */
  panelKonten: Partial<Record<PanelJenis, ReactNode>>;
  /** Dok bawah: Dok Navigasi Bab (Story) atau Dok Kategori (Resources). */
  dok: ReactNode;
  /** Slot scene 3D (Edo): menggantikan gambar latar `gambar`. */
  scene?: ReactNode;
  /** Slot lapisan Titik Info (Zhafran): menggantikan titik statis `posisiTitik`. */
  hotspots?: ReactNode;
  /** Slot pratinjau benda terpilih (Zhafran): menggantikan placeholder "Pratinjau model 3D". */
  objek?: ReactNode;
};

/** Kelas posisi Titik Info; nilainya dari variabel CSS per ukuran layar (lihat `gayaTitik`). */
const KELAS_POSISI_TITIK =
  "left-[var(--lm)] top-[var(--tm)] md:left-[var(--lt)] md:top-[var(--tt)] lg:left-[var(--ld)] lg:top-[var(--td)]";

/** Ukuran frame Figma (lebar x tinggi) untuk mobile, tablet, desktop: dasar konversi piksel ke persen. */
const FRAME: Record<keyof PosisiTitik, readonly [number, number]> = { m: [390, 844], t: [768, 1024], d: [1440, 900] };

/** Posisi Titik ke-`i` (piksel Figma) sebagai variabel CSS persen: --lm/--tm (mobile), --lt/--tt, --ld/--td. */
function gayaTitik(posisi: PosisiTitik, i: number): CSSProperties {
  const gaya: Record<string, string> = {};
  for (const k of ["m", "t", "d"] as const) {
    const p = posisi[k][i];
    if (!p) continue;
    gaya[`--l${k}`] = `${((p[0] / FRAME[k][0]) * 100).toFixed(3)}%`;
    gaya[`--t${k}`] = `${((p[1] / FRAME[k][1]) * 100).toFixed(3)}%`;
  }
  return gaya as CSSProperties;
}

const QUERY_GERAK = "(prefers-reduced-motion: reduce)";

/** True bila pengguna meminta gerak dikurangi; dipakai agar Jeda Gerak otomatis aktif (handoff bagian 3). */
function useGerakDikurangi() {
  return useSyncExternalStore(
    (ubah) => {
      const mq = window.matchMedia(QUERY_GERAK);
      mq.addEventListener("change", ubah);
      return () => mq.removeEventListener("change", ubah);
    },
    () => window.matchMedia(QUERY_GERAK).matches,
    () => false,
  );
}

const QUERY_DESKTOP = "(min-width: 1024px)";

/** True di layar desktop (lg). Popup objek hanya dipasang satu (desktop ATAU bawah), supaya tidak ada dua penampil 3D sekaligus. */
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

const FOKUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function HalamanImersif({
  gambar,
  scenePlaceholder = false,
  varian,
  kembali,
  narasi,
  benda,
  posisiTitik,
  fokusGambar,
  jenisPanel,
  panelKonten,
  dok,
  scene,
  hotspots,
  objek,
}: HalamanImersifProps) {
  const [panel, setPanel] = useState<PanelJenis | null>(null);
  const [bendaIdx, setBendaIdx] = useState<number | null>(null);
  const gerakDikurangi = useGerakDikurangi();
  const desktop = useDesktop();
  // Tombol Jeda Gerak dihapus: jeda hanya aktif otomatis bila pengguna meminta gerak dikurangi.
  const paused = gerakDikurangi;
  const akar = useRef<HTMLDivElement>(null);
  /** Jenis panel yang terakhir dibuka: tombol pemicunya mendapat kembali fokus saat panel ditutup. */
  const pemicu = useRef<PanelJenis | null>(null);
  const bendaAktif = bendaIdx === null ? null : benda[bendaIdx];

  // Fungsi reset kamera milik scene (didaftarkan lewat `useResetKamera`); null bila belum ada scene.
  const resetKamera = useRef<(() => void) | null>(null);
  const daftarkanReset = useCallback((fn: () => void) => {
    resetKamera.current = fn;
    return () => {
      if (resetKamera.current === fn) resetKamera.current = null;
    };
  }, []);

  // Status scene (State 3D Figma): dengan slot `scene`, mulai dari "memuat" sampai scene melapor.
  const adaScene = scene !== undefined && scene !== null;
  const [statusScene, setStatus] = useState<StatusScene>(adaScene ? "memuat" : "siap");
  const [progres, setProgres] = useState<number | null>(null);
  // Naik saat Coba Lagi: slot `scene` dipasang ulang dari awal.
  const [percobaan, setPercobaan] = useState(0);
  // "Lanjut tanpa 3D": tetap pada gambar statis dan titik statis.
  const [tanpa3d, setTanpa3d] = useState(false);
  const setStatusScene = useCallback((status: StatusScene, nilai?: number) => {
    setStatus(status);
    setProgres(status === "memuat" ? (nilai ?? null) : null);
  }, []);
  const fallback = statusScene === "fallback" && !tanpa3d;
  const modeStatis = tanpa3d || statusScene === "fallback";
  const memuat = !modeStatis && statusScene === "memuat";
  // Titik dan objek: slot 3D hanya bila scene siap; mode statis memakai placeholder; saat memuat tidak ada.
  const pakaiSlot = !modeStatis;

  function cobaLagi() {
    setPercobaan((n) => n + 1);
    setStatusScene("memuat");
  }

  const konteks: ImersifState = {
    benda,
    bendaIdx,
    pilihBenda: setBendaIdx,
    paused,
    daftarkanReset,
    statusScene,
    setStatusScene,
  };

  // Klik di area scene (bukan seret) menutup popup objek. Klik di dalam popup, di titik info, atau di tombol HUD tidak menutupnya.
  useEffect(() => {
    if (bendaIdx === null) return;
    let awal: { x: number; y: number } | null = null;
    const turun = (e: PointerEvent) => {
      awal = { x: e.clientX, y: e.clientY };
    };
    const naik = (e: PointerEvent) => {
      if (!awal) return;
      const geser = Math.hypot(e.clientX - awal.x, e.clientY - awal.y);
      awal = null;
      if (geser > 6) return; // a drag turns the view; it is not a click-away
      const t = e.target;
      if (t instanceof HTMLCanvasElement && !t.closest("[data-popup-objek]")) setBendaIdx(null);
    };
    window.addEventListener("pointerdown", turun, true);
    window.addEventListener("pointerup", naik, true);
    return () => {
      window.removeEventListener("pointerdown", turun, true);
      window.removeEventListener("pointerup", naik, true);
    };
  }, [bendaIdx]);

  // Fokus: ke panel saat dibuka, kembali ke tombol pemicu saat ditutup.
  useEffect(() => {
    if (panel) {
      akar.current?.querySelector<HTMLElement>("aside[role=dialog]")?.focus();
    } else if (pemicu.current) {
      akar.current?.querySelector<HTMLElement>(`[data-panel="${pemicu.current}"]`)?.focus();
    }
  }, [panel]);

  function bukaPanel(jenis: PanelJenis) {
    pemicu.current = jenis;
    setPanel(jenis);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!panel && e.key === "Escape" && bendaIdx !== null) {
      setBendaIdx(null);
      return;
    }
    if (!panel) return;
    if (e.key === "Escape") {
      setPanel(null);
      return;
    }
    if (e.key !== "Tab") return;
    // Kurung fokus di dalam panel (penting di tablet/mobile saat panel menutupi layar).
    const dialog = akar.current?.querySelector<HTMLElement>("aside[role=dialog]");
    const item = dialog ? [...dialog.querySelectorAll<HTMLElement>(FOKUSABLE)] : [];
    if (!dialog || item.length === 0) return;
    const pertama = item[0];
    const terakhir = item[item.length - 1];
    const aktifEl = document.activeElement;
    if (!dialog.contains(aktifEl) || aktifEl === dialog) {
      e.preventDefault();
      (e.shiftKey ? terakhir : pertama).focus();
    } else if (e.shiftKey && aktifEl === pertama) {
      e.preventDefault();
      terakhir.focus();
    } else if (!e.shiftKey && aktifEl === terakhir) {
      e.preventDefault();
      pertama.focus();
    }
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void akar.current?.requestFullscreen?.();
  }

  const media = bendaAktif ? MEDIA_BENDA[bendaAktif.id] : undefined;
  const catatanModel = media?.catatanModel ?? (bendaAktif?.model3d ? `Model 3D: ${bendaAktif.model3d.jenis}` : undefined);
  const kartuBawah = bendaAktif && !desktop ? (
    <ObjectPopup
      key={bendaAktif.id}
      {...bendaAktif}
      media={media?.media}
      catatanModel={catatanModel}
      onTutup={() => setBendaIdx(null)}
      eyebrow={IMERSIF_COPY.dataBenda.toUpperCase()}
      className="hud-masuk [--hud-delay:0s] [--hud-dur:0.5s] [--hud-dy:20px] lg:hidden"
    />
  ) : (
    // mb-1: jarak narasi ke dok 16 px (kartu data benda 12 px), sesuai Figma.
    <KartuNarasi {...narasi} className="hud-masuk mb-1 [--hud-delay:0.3s] [--hud-dur:0.7s] [--hud-dy:40px] lg:hidden" />
  );

  return (
    <ImersifContext.Provider value={konteks}>
    <div
      ref={akar}
      onKeyDown={onKeyDown}
      className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-bg-primary-normal"
    >
      <LatarScene gambar={gambar} fokus={fokusGambar}>
        {/* Fallback / tanpa 3D: scene dilepas, gambar statis tampil. `key` memasang ulang scene saat Coba Lagi. */}
        {modeStatis ? null : <Fragment key={percobaan}>{scene}</Fragment>}
      </LatarScene>

      {/* Saat scene memuat, objek dan titik 3D belum ada. */}
      {bendaAktif && !memuat && !(pakaiSlot && hotspots) && (
        <div className="absolute left-1/2 top-[30%] z-[5] -translate-x-1/2 -translate-y-1/2 lg:top-[47%]">
          {/* Dibungkus terpisah: animasi memakai properti translate yang sama dengan pemusatan di atas. */}
          <div key={bendaAktif.id} className="hud-masuk [--hud-delay:0.3s] [--hud-dur:0.5s]">
            {(pakaiSlot && objek) || (
              <Objek3DPlaceholder
                judul={IMERSIF_COPY.placeholderModel.judul}
                status={IMERSIF_COPY.placeholderModel.status}
              />
            )}
          </div>
        </div>
      )}

      {!memuat &&
        ((pakaiSlot && hotspots) ||
          benda.slice(0, 3).map((b, i) => (
            <TitikInfoPlaceholder
              key={b.id}
              label={b.hotspot}
              aktif={bendaIdx === i}
              urutan={i}
              onClick={() => setBendaIdx(bendaIdx === i ? null : i)}
              style={gayaTitik(posisiTitik, i)}
              className={`z-10 ${KELAS_POSISI_TITIK}`}
            />
          )))}

      {memuat && <OverlayMemuat3D progres={progres} className="absolute inset-0 z-[15]" />}
      {fallback && (
        <PesanFallback3D
          onCobaLagi={cobaLagi}
          onLanjut={() => setTanpa3d(true)}
          // Di atas HUD (z-20): pesan galat tidak boleh tertimpa kartu narasi.
          className="absolute inset-0 z-[25]"
        />
      )}

      {/* Lapisan HUD: selaras dengan konten halaman (padding 24/40/86, lebar maksimum 1440). */}
      {/* Lapisan ini dan pembungkusnya tidak menangkap pointer: hanya elemen HUD di dalamnya (`[&>*]`), supaya kanvas scene dan hotspot di bawahnya tetap bisa diklik/diputar. */}
      <div className="pointer-events-none absolute inset-0 z-20 mx-auto max-w-page px-page">
        <div className="pointer-events-none relative h-full [&>*]:pointer-events-auto">
          <TombolKembali
            href={kembali.href}
            label={kembali.label}
            className="hud-masuk absolute left-0 top-6 [--hud-delay:0.4s] [--hud-dur:0.5s] lg:top-5"
          />

          {scenePlaceholder && (
            <PenandaPlaceholder
              teks={IMERSIF_COPY.placeholderScene}
              className="hud-masuk absolute left-0 top-[142px] [--hud-delay:0.4s] [--hud-dur:0.5s] lg:left-28 lg:top-[26px]"
            />
          )}

          {/* Desktop: narasi di kiri atas, kartu data di kanan. */}
          <KartuNarasi
            {...narasi}
            petunjuk={IMERSIF_COPY.petunjuk}
            className="hud-masuk absolute left-0 top-[77px] [--hud-delay:0.3s] [--hud-dur:0.7s] [--hud-dx:-40px] max-lg:hidden"
          />
          {bendaAktif && !panel && desktop && (
            <ObjectPopup
              key={bendaAktif.id}
              {...bendaAktif}
      media={media?.media}
              catatanModel={catatanModel}
              onTutup={() => setBendaIdx(null)}
              eyebrow={IMERSIF_COPY.dataBenda.toUpperCase()}
              className="hud-masuk absolute right-0 top-[100px] max-h-[calc(100%-220px)] [--hud-delay:0s] [--hud-dur:0.5s] [--hud-dx:30px] max-lg:hidden lg:overflow-y-auto"
            />
          )}

          {/* Satu tombol Info menggantikan deretan tombol panel; isi lain (Misi, Sumber, ...) ada sebagai tab di dalam panel. */}
          {!panel && jenisPanel.length > 0 && (
            <Button
              variant="secondary"
              glass
              iconLeft="info"
              data-panel={jenisPanel[0]}
              onClick={() => bukaPanel(jenisPanel[0])}
              className="hud-masuk absolute right-0 top-6 [--hud-delay:0.5s] [--hud-dx:30px] max-lg:[--hud-dx:0px] lg:top-5"
            >
              Info
            </Button>
          )}

          <KontrolScene
            onToggleFullscreen={toggleFullscreen}
            className="hud-masuk absolute left-14 top-6 [--hud-delay:0.4s] lg:top-5"
          />

          {/* Tumpukan bawah (tablet/mobile): kartu narasi atau data benda, lalu dok. */}
          <div className="absolute inset-x-0 bottom-3 flex flex-col gap-3 lg:hidden">
            {kartuBawah}
            <div className="hud-masuk [--hud-delay:0.6s] [--hud-dy:40px]">{dok}</div>
          </div>
          {/* Dok desktop: 36 px dari tepi bawah (Figma: dok y 752 + 112 dari 900; Resources y 774 + 90). */}
          {varian === "resources" ? (
            // Resources: pemilih lingkungan di samping tombol Info (kanan atas), supaya bagian bawah bebas untuk objek.
            // Disembunyikan saat panel Info terbuka (panel memakai sisi kanan atas).
            !panel && (
              <div className="pointer-events-none! absolute right-[124px] top-5 hidden lg:block">
                <div className="hud-masuk pointer-events-none [&>*]:pointer-events-auto [--hud-delay:0.6s] [--hud-dy:-20px]">{dok}</div>
              </div>
            )
          ) : (
            <div className="pointer-events-none! absolute inset-x-0 bottom-4 hidden justify-start lg:flex">
              <div className="hud-masuk pointer-events-none w-full [&>*]:pointer-events-auto [--hud-delay:0.6s] [--hud-dy:40px] lg:flex lg:justify-start">{dok}</div>
            </div>
          )}

          {panel && (
            <Panel
              judul={PANEL_META[panel].label}
              tab={
                jenisPanel.length > 1 ? (
                  <div role="group" aria-label="Isi panel" className="flex flex-wrap gap-2">
                    {jenisPanel.map((j) => (
                      <button
                        key={j}
                        type="button"
                        aria-pressed={panel === j}
                        onClick={() => setPanel(j)}
                        className={`text-button-label cursor-pointer rounded-pill border px-4 py-2 transition-colors duration-200 ${
                          panel === j
                            ? "border-aksen-informasi-normal bg-aksen-informasi-normal text-bg-primary-normal"
                            : "border-archive-slate-normal text-text-primary-normal hover:border-aksen-informasi-normal"
                        }`}
                      >
                        {PANEL_META[j].label}
                      </button>
                    ))}
                  </div>
                ) : undefined
              }
              onTutup={() => setPanel(null)}
              labelTutup={IMERSIF_COPY.tutup}
              className="hud-masuk absolute inset-x-0 bottom-6 top-6 z-30 [--hud-dur:0.5s] [--hud-dy:80px] lg:[--hud-dx:60px] lg:[--hud-dy:0px] lg:inset-x-auto lg:bottom-auto lg:right-0 lg:top-[57px] lg:h-[564px] lg:w-[440px]"
            >
              {panelKonten[panel]}
            </Panel>
          )}
        </div>
      </div>
    </div>
    </ImersifContext.Provider>
  );
}
