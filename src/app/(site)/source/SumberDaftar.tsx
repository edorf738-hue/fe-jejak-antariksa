"use client";

import { useState } from "react";
import { Button, Container, EntriSumber, PanelStatus } from "@/components/ui";
import { SOURCE_COPY, STATUS_COPY, type EntriSumber as Entri, type FilterSumber, type KategoriSumber } from "@/data";

const URUTAN: KategoriSumber[] = ["referensi", "gambar", "model3d"];

/** Filter kategori, catatan verifikasi, dan tiga kelompok entri sumber. */
export function SumberDaftar({ entri }: { entri: Record<KategoriSumber, Entri[]> }) {
  const [filter, setFilter] = useState<FilterSumber>("semua");
  const { catatan, bagian } = SOURCE_COPY;
  // Hanya kelompok yang cocok dengan filter dan punya entri; bila tidak ada, tampil state Kosong.
  const tampil = URUTAN.filter((k) => (filter === "semua" || filter === k) && entri[k].length > 0);

  return (
    <Container className="relative flex flex-col gap-10 pb-16 pt-10 md:gap-12 md:pb-[72px] md:pt-14 lg:gap-14 lg:pb-24 lg:pt-[72px]">
      <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-4">
        {SOURCE_COPY.filter.map((f) => (
          <Button
            key={f.id}
            variant={filter === f.id ? "primary" : "secondary"}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <aside className="flex flex-col gap-2 rounded-card border-[1.5px] border-aksen-warisan-normal px-5 py-6 md:px-8">
        <p className="text-button-label text-text-primary-normal">{catatan.judul}</p>
        <p className="text-body-large text-text-secondary-normal">{catatan.isi}</p>
      </aside>

      <p role="status" className="sr-only">
        Menampilkan {tampil.reduce((n, k) => n + entri[k].length, 0)} entri
      </p>

      {tampil.length === 0 && <PanelStatus varian="kosong" {...STATUS_COPY.sumberKosong} />}

      {tampil.map((k) => (
        <section key={k} aria-labelledby={`bagian-${k}`} className="flex flex-col gap-5">
          <h2
            id={`bagian-${k}`}
            className="text-heading-card text-text-primary-normal md:text-heading-section"
          >
            {bagian[k]}
          </h2>
          {entri[k].map((e) => (
            <EntriSumber key={e.id} {...e} />
          ))}
        </section>
      ))}
    </Container>
  );
}
