"use client";

import { useState } from "react";
import { ItemSumber, KartuMisi, PanelBaris } from "@/components/ui";
import { JOURNEY_COPY, type JourneyTujuan } from "@/data";

/** Misi Terkait (daftar pilihan), Panel Detail Misi, Panel Kronologi, dan Sumber untuk satu tujuan. */
export function DetailDestinasi({ tujuan }: { tujuan: JourneyTujuan }) {
  const [dipilih, setDipilih] = useState(0);
  const { kategori, misi, detail } = tujuan;
  const misiAktif = misi[dipilih];

  return (
    <div className="hud-masuk flex flex-col gap-10 [--hud-dy:24px] md:gap-12 lg:gap-14">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <section aria-labelledby="judul-misi-terkait" className="flex w-full shrink-0 flex-col gap-5 lg:w-[420px]">
          <h2 id="judul-misi-terkait" className="text-heading-card text-text-primary-normal">
            Misi Terkait: {kategori.nama}
          </h2>
          {misi.map((m, i) => (
            <KartuMisi
              key={m?.nama ?? `tbd-${i}`}
              nama={m?.nama}
              wahana={m?.wahana}
              peluncuran={m?.peluncuran}
              status={m?.status}
              terpilih={i === dipilih}
              onPilih={() => setDipilih(i)}
            />
          ))}
        </section>
        <PanelBaris
          key={dipilih}
          className="hud-masuk w-full [--hud-dur:0.35s] [--hud-dy:8px] lg:flex-1"
          eyebrow={JOURNEY_COPY.detail.eyebrow}
          judul={misiAktif?.nama ?? "TBD"}
          baris={detail[dipilih]}
        />
      </div>

      <PanelBaris
        eyebrow={JOURNEY_COPY.kronologi.eyebrow}
        judul={tujuan.judulKronologi}
        baris={tujuan.kronologi}
      />

      <section aria-labelledby="judul-sumber-jm" className="flex flex-col gap-2">
        <h2 id="judul-sumber-jm" className="text-heading-card text-text-primary-normal">
          {JOURNEY_COPY.sumber}
        </h2>
        {tujuan.sumber.map((s) => (
          <ItemSumber key={s.url} {...s} />
        ))}
      </section>
    </div>
  );
}
