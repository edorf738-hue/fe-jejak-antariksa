"use client";

import { useState } from "react";
import {
  DokBab,
  KartuDataBenda,
  KartuNarasi,
  KontrolScene,
  Panel,
  PanelFakta,
  PanelGaleri,
  PanelMisi,
  PanelSumber,
  PANEL_META,
  TombolKembali,
  TombolPanel,
  type PanelJenis,
} from "@/components/hud";
import type { Bab, Kategori, Sumber } from "@/data";

const JENIS: PanelJenis[] = ["fakta", "misi", "galeri", "sumber"];

/** Kerangka kasar halaman imersif untuk menguji HUD. Latar bukan scene 3D asli. */
export function HudDemo({ bab, kategori, sumber }: { bab: Bab; kategori: Kategori; sumber: Sumber[] }) {
  const [panel, setPanel] = useState<PanelJenis | null>(null);
  const [bendaIdx, setBendaIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const benda = bendaIdx === null ? null : bab.benda[bendaIdx];

  return (
    <div
      className="relative min-h-dvh overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 70% 30%, var(--color-aksen-visual-darker) 0%, var(--color-bg-primary-normal) 60%)",
      }}
    >
      <div className="absolute left-6 top-6 md:left-10 md:top-10 lg:left-[86px]">
        <TombolKembali href="/ui-kit" label="Kembali ke UI Kit" />
      </div>

      <div className="absolute inset-x-6 top-24 flex flex-col gap-4 md:inset-x-10 lg:inset-x-[86px] lg:top-28">
        {benda && !panel ? (
          <KartuDataBenda {...benda} className="lg:ml-auto" />
        ) : (
          <KartuNarasi
            eyebrow={`BAB ${bab.id}`}
            judul={bab.judul}
            isi={bab.narasi}
            petunjuk="Pilih titik info untuk melihat data benda"
          />
        )}
        <div className="flex flex-wrap gap-2">
          {bab.benda.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBendaIdx(bendaIdx === i ? null : i)}
              aria-pressed={bendaIdx === i}
              className="min-h-11 rounded-pill px-4 text-sm text-text-secondary-normal shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] aria-pressed:text-text-primary-normal"
            >
              {b.hotspot}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-6 top-[29rem] flex flex-wrap gap-2 md:inset-x-10 md:top-[24rem] lg:inset-x-auto lg:right-[86px] lg:top-10 lg:gap-3">
        {JENIS.map((j) => (
          <TombolPanel key={j} jenis={j} aktif={panel === j} onClick={() => setPanel(panel === j ? null : j)} />
        ))}
      </div>

      {panel && (
        <div className="absolute inset-x-0 bottom-0 top-0 z-20 p-6 md:inset-x-auto md:right-10 md:top-44 md:bottom-28 md:p-0 lg:right-[86px] lg:top-28">
          <Panel judul={PANEL_META[panel].label} onTutup={() => setPanel(null)} className="h-full md:h-auto">
            {panel === "fakta" && <PanelFakta fakta={kategori.fakta} />}
            {panel === "misi" && <PanelMisi misi={kategori.misi} />}
            {panel === "galeri" && <PanelGaleri galeri={kategori.galeri} />}
            {panel === "sumber" && <PanelSumber sumber={sumber} />}
          </Panel>
        </div>
      )}

      {!panel && (
        <KontrolScene
          paused={paused}
          onTogglePause={() => setPaused((p) => !p)}
          className="absolute bottom-24 right-6 md:right-10 lg:bottom-28 lg:right-[86px]"
        />
      )}

      <div className="absolute inset-x-6 bottom-6 md:inset-x-10 lg:inset-x-[86px]">
        <DokBab
          aktif={bab.id}
          hrefBab={() => "/ui-kit/hud"}
          hrefSebelumnya="/ui-kit/hud"
          hrefBerikutnya="/ui-kit/hud"
          className="mx-auto lg:max-w-3xl"
        />
      </div>
    </div>
  );
}
