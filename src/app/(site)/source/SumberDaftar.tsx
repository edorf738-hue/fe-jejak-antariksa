"use client";

import { useState } from "react";
import { Button, Container, EntriSumber, PanelStatus, reveal, revealKata, SplitText } from "@/components/ui";
import { useJellyNav } from "@/components/ui/useJellyNav";
import { SOURCE_COPY, STATUS_COPY, type EntriSumber as Entri, type FilterSumber, type KategoriSumber } from "@/data";

const URUTAN: KategoriSumber[] = ["referensi", "gambar", "model3d"];

/** Filter kategori, catatan verifikasi, dan tiga kelompok entri sumber. */
export function SumberDaftar({ entri }: { entri: Record<KategoriSumber, Entri[]> }) {
  const [filter, setFilter] = useState<FilterSumber>("semua");
  const { catatan, bagian } = SOURCE_COPY;
  // Jelly saat filter dipilih atau kursor menyentuh tombol (pustaka yang sama dengan navbar), di semua ukuran layar.
  const jelly = useJellyNav(
    SOURCE_COPY.filter.length,
    SOURCE_COPY.filter.findIndex((f) => f.id === filter),
    true,
  );
  // Hanya kelompok yang cocok dengan filter dan punya entri; bila tidak ada, tampil state Kosong.
  const tampil = URUTAN.filter((k) => (filter === "semua" || filter === k) && entri[k].length > 0);

  return (
    <Container className="relative flex flex-col gap-10 pb-16 pt-10 md:gap-12 md:pb-[72px] md:pt-14 lg:gap-14 lg:pb-24 lg:pt-[72px]">
      <ul aria-label="Filter kategori" className="flex flex-wrap gap-3" {...reveal(0)}>
        {SOURCE_COPY.filter.map((f, i) => (
          // Tiga lapisan bersarang membawa transformasi jelly (geser X, skala X, skala Y), lihat useJellyNav.
          <li key={f.id} ref={jelly.x(i)} onPointerEnter={(e) => e.pointerType === "mouse" && jelly.hover(i)} onPointerLeave={jelly.keluar}>
            <div ref={jelly.sx(i)}>
              <div ref={jelly.sy(i)}>
                <Button
                  kecil
                  kaca
                  variant={filter === f.id ? "primary" : "secondary"}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside
        className="flex flex-col gap-2 rounded-card border-[1.5px] border-aksen-warisan-normal px-5 py-6 md:px-8"
        {...reveal(120)}
      >
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
            {...revealKata(0)}
          >
            <SplitText>{bagian[k]}</SplitText>
          </h2>
          {entri[k].map((e, i) => (
            <EntriSumber key={e.id} {...e} delay={100 + Math.min(i, 4) * 70} />
          ))}
        </section>
      ))}
    </Container>
  );
}
