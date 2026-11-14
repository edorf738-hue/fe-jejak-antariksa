"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { DataBenda } from "@/data";
import { IMERSIF_COPY } from "@/data";
import { KartuDataBenda } from "./KartuDataBenda";
import { KartuNarasi } from "./KartuNarasi";
import { KontrolScene } from "./KontrolScene";
import { Panel } from "./Panel";
import { LatarScene, Objek3DPlaceholder, PenandaPlaceholder, TitikInfoPlaceholder } from "./ScenePlaceholder";
import { TombolKembali } from "./TombolKembali";
import { PANEL_META, TombolPanel, type PanelJenis } from "./TombolPanel";

/**
 * Kerangka halaman imersif (Story Bab 1-4 dan Resources): scene 3D memenuhi layar
 * (lapisan 0), gradien keterbacaan (lapisan 1), lalu HUD (kembali, narasi, tombol panel,
 * kontrol scene, dok) dan panel. Scene, hotspot, dan objek 3D dipasang tim 3D di
 * tempat `LatarScene`, `TitikInfoPlaceholder`, dan `Objek3DPlaceholder`.
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
  jenisPanel: PanelJenis[];
  /** Isi tiap panel (dirender server dari data). */
  panelKonten: Partial<Record<PanelJenis, ReactNode>>;
  /** Dok bawah: Dok Navigasi Bab (Story) atau Dok Kategori (Resources). */
  dok: ReactNode;
};

/** Posisi ilustrasi Titik Info (persen dari scene): mobile / tablet / desktop. */
const POSISI_TITIK = [
  "left-[44%] top-[35%] md:left-[34%] md:top-[31%] lg:left-[71.7%] lg:top-[27%]",
  "left-[28%] top-[38%] md:left-[21%] md:top-[46%] lg:left-[62%] lg:top-[78%]",
  "left-[61%] top-[40%] md:left-[47.5%] md:top-[52.5%] lg:left-[22.5%] lg:top-[71.2%]",
];

export function HalamanImersif({
  gambar,
  scenePlaceholder = false,
  varian,
  kembali,
  narasi,
  benda,
  jenisPanel,
  panelKonten,
  dok,
}: HalamanImersifProps) {
  const [panel, setPanel] = useState<PanelJenis | null>(null);
  const [bendaIdx, setBendaIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const akar = useRef<HTMLDivElement>(null);
  const bendaAktif = bendaIdx === null ? null : benda[bendaIdx];
  const story = varian === "story";

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && panel) setPanel(null);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void akar.current?.requestFullscreen?.();
  }

  const kartuBawah = bendaAktif ? (
    <KartuDataBenda
      key={bendaAktif.id}
      {...bendaAktif}
      eyebrow={IMERSIF_COPY.dataBenda.toUpperCase()}
      className="hud-masuk [--hud-delay:0s] [--hud-dur:0.5s] [--hud-dy:20px] lg:hidden"
    />
  ) : (
    <KartuNarasi {...narasi} className="hud-masuk [--hud-delay:0.3s] [--hud-dur:0.7s] [--hud-dy:40px] lg:hidden" />
  );

  return (
    <div
      ref={akar}
      onKeyDown={onKeyDown}
      className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-bg-primary-normal"
    >
      <LatarScene gambar={gambar} />

      {bendaAktif && (
        <div className="absolute left-1/2 top-[30%] z-[5] -translate-x-1/2 -translate-y-1/2 lg:top-[47%]">
          {/* Dibungkus terpisah: animasi memakai properti translate yang sama dengan pemusatan di atas. */}
          <div key={bendaAktif.id} className="hud-masuk [--hud-delay:0.3s] [--hud-dur:0.5s]">
            <Objek3DPlaceholder
              judul={IMERSIF_COPY.placeholderModel.judul}
              status={IMERSIF_COPY.placeholderModel.status}
            />
          </div>
        </div>
      )}

      {benda.slice(0, 3).map((b, i) => (
        <TitikInfoPlaceholder
          key={b.id}
          label={b.hotspot}
          aktif={bendaIdx === i}
          urutan={i}
          onClick={() => setBendaIdx(bendaIdx === i ? null : i)}
          className={`z-10 ${POSISI_TITIK[i]}`}
        />
      ))}

      {/* Lapisan HUD: selaras dengan konten halaman (padding 24/40/86, lebar maksimum 1440). */}
      <div className="pointer-events-none absolute inset-0 z-20 mx-auto max-w-page px-page [&>*]:pointer-events-auto">
        <div className="relative h-full">
          <TombolKembali
            href={kembali.href}
            label={kembali.label}
            className="hud-masuk absolute left-0 top-6 [--hud-delay:0.4s] [--hud-dur:0.5s] lg:top-5"
          />

          {scenePlaceholder && (
            <PenandaPlaceholder
              teks={IMERSIF_COPY.placeholderScene}
              className="hud-masuk absolute left-0 top-[142px] [--hud-delay:0.4s] [--hud-dur:0.5s] lg:left-14 lg:top-[26px]"
            />
          )}

          {/* Desktop: narasi di kiri atas, kartu data di kanan. */}
          <KartuNarasi
            {...narasi}
            petunjuk={IMERSIF_COPY.petunjuk}
            className="hud-masuk absolute left-0 top-[77px] [--hud-delay:0.3s] [--hud-dur:0.7s] [--hud-dx:-40px] max-lg:hidden"
          />
          {bendaAktif && !panel && (
            <KartuDataBenda
              key={bendaAktif.id}
              {...bendaAktif}
              eyebrow={IMERSIF_COPY.dataBenda.toUpperCase()}
              className="hud-masuk absolute right-0 top-[300px] [--hud-delay:0s] [--hud-dur:0.5s] [--hud-dx:30px] max-lg:hidden"
            />
          )}

          {!panel && (
            <div
              className={`hud-masuk absolute left-0 top-20 flex w-full flex-wrap gap-2.5 [--hud-delay:0.5s] [--hud-dx:30px] max-lg:[--hud-dx:0px] max-lg:[--hud-dy:-20px] lg:left-auto lg:right-0 lg:top-[57px] lg:w-auto lg:gap-3 ${
                story ? "lg:flex-col lg:items-end" : "lg:flex-row"
              }`}
            >
              {jenisPanel.map((j) => (
                <TombolPanel key={j} jenis={j} aktif={panel === j} onClick={() => setPanel(j)} />
              ))}
            </div>
          )}

          <KontrolScene
            paused={paused}
            onTogglePause={() => setPaused((p) => !p)}
            onToggleFullscreen={toggleFullscreen}
            className={`hud-masuk absolute right-0 [--hud-delay:1.4s] ${
              story ? "top-[191px]" : "top-[218px]"
            } md:top-[152px] lg:bottom-40 lg:top-auto ${panel ? "max-lg:hidden lg:right-[456px]" : ""}`}
          />

          {/* Tumpukan bawah (tablet/mobile): kartu narasi atau data benda, lalu dok. */}
          <div className="absolute inset-x-0 bottom-6 flex flex-col gap-5 lg:hidden">
            {kartuBawah}
            <div className="hud-masuk [--hud-delay:0.6s] [--hud-dy:40px]">{dok}</div>
          </div>
          {/* Dok desktop. */}
          <div
            className={`absolute inset-x-0 hidden justify-center lg:flex ${story ? "bottom-[52px]" : "bottom-[30px]"}`}
          >
            <div className="hud-masuk w-full [--hud-delay:0.6s] [--hud-dy:40px] lg:flex lg:justify-center">{dok}</div>
          </div>

          {panel && (
            <Panel
              judul={PANEL_META[panel].label}
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
  );
}
