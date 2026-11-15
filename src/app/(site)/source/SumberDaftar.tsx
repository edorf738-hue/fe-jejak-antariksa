"use client";

import { useCallback, useState } from "react";
import { Button, Container } from "@/components/ui";
import { SOURCE_COPY, type KategoriSumber, type SumberItem } from "@/data";
import { DetailSumber } from "./DetailSumber";
import { LencanaStatus } from "./LencanaStatus";

const URUTAN: KategoriSumber[] = ["referensi", "media", "model3d"];

/**
 * Katalog sumber: tiga tab (Referensi, Kredit Media, Model 3D), kartu ringkas (nama, jenis, penerbit, status, tombol Detail
 * Sumber), dan modal detail berisi kredit, URL, lisensi, dan tanggal akses.
 */
export function SumberDaftar({ katalog }: { katalog: Record<KategoriSumber, SumberItem[]> }) {
  const [tab, setTab] = useState<KategoriSumber>("referensi");
  const [terbuka, setTerbuka] = useState<SumberItem | null>(null);
  const tutup = useCallback(() => setTerbuka(null), []);
  const daftar = katalog[tab];

  return (
    <Container className="relative flex flex-col gap-8 pb-16 pt-10 md:gap-10 md:pb-[72px] md:pt-14 lg:pb-24 lg:pt-[72px]">
      <div className="flex flex-col gap-5">
        <div role="tablist" aria-label="Kategori sumber" className="flex flex-wrap gap-3">
          {URUTAN.map((k) => (
            <Button
              key={k}
              role="tab"
              id={`tab-${k}`}
              aria-selected={tab === k}
              aria-controls={`panel-${k}`}
              variant={tab === k ? "primary" : "secondary"}
              glass={tab !== k}
              onClick={() => setTab(k)}
            >
              {`${SOURCE_COPY.tab[k]} (${katalog[k].length})`}
            </Button>
          ))}
        </div>
        <ul aria-label="Arti status" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary-normal max-md:hidden">
          {(Object.keys(SOURCE_COPY.status) as (keyof typeof SOURCE_COPY.status)[]).map((s) => (
            <li key={s} className="flex items-center gap-2">
              <LencanaStatus status={s} />
              {SOURCE_COPY.status[s].arti}
            </li>
          ))}
        </ul>
      </div>

      <ul id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {daftar.map((item) => (
          <li key={item.id}>
            <article className="glass flex h-full flex-col gap-3 rounded-[24px] border border-white/10 p-6 transition-colors duration-300 hover:border-aksen-informasi-normal/60">
              <p className="text-eyebrow-15 uppercase text-aksen-warisan-normal">{item.jenis}</p>
              <h3 className="text-button-label break-words text-text-primary-normal">{item.nama}</h3>
              <p className="text-base leading-6 text-text-secondary-normal">{item.penerbit}</p>
              <div className="mt-auto flex flex-col items-start gap-4 pt-2">
                <LencanaStatus status={item.status} />
                <Button variant="secondary" iconRight="panah-kanan" onClick={() => setTerbuka(item)} className="py-2!">
                  Detail Sumber
                  <span className="sr-only">: {item.nama}</span>
                </Button>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {terbuka && <DetailSumber item={terbuka} onTutup={tutup} />}
    </Container>
  );
}
