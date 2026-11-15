"use client";

import { ItemSumber, KartuMisi, useLang } from "@/components/ui";
import { HUD } from "@/lib/ui-copy";
import type { Fakta, Misi, Sumber } from "@/data";

/**
 * Isi panel: Kartu Fakta, Kartu Misi, Item Galeri, Item Sumber. Semua murni
 * presentasi dan menerima data dari src/data. Nilai kosong ditampilkan sebagai TBD.
 */
function Kosong({ teks }: { teks?: string }) {
  const h = HUD[useLang()];
  return <p className="text-text-secondary-normal">{teks ?? h.kosong}</p>;
}

export function KartuFakta({ isi, sumber }: Fakta) {
  const h = HUD[useLang()];
  return (
    <article className="flex flex-col gap-2 rounded-card bg-archive-slate-normal p-5">
      <p className="text-base leading-6 text-text-primary-normal">{isi}</p>
      <p className="text-sm text-text-secondary-normal">{h.sumberLabel}: {sumber}</p>
    </article>
  );
}

export function PanelFakta({ fakta }: { fakta: Fakta[] }) {
  if (fakta.length === 0) return <Kosong />;
  return (
    <>
      {fakta.map((f) => (
        <KartuFakta key={f.isi} {...f} />
      ))}
    </>
  );
}

export function PanelMisi({ misi }: { misi: (Misi | null)[] }) {
  if (misi.length === 0) return <Kosong />;
  return (
    <>
      {misi.map((m, i) => (
        <KartuMisi
          key={m?.nama ?? `tbd-${i}`}
          nama={m?.nama}
          wahana={m?.wahana}
          peluncuran={m?.peluncuran}
          status={m?.status}
        />
      ))}
    </>
  );
}

/** Item Galeri: `Keterangan` + gambar. Gambar belum ada (null) tampil sebagai kotak TBD. */
export function ItemGaleri({ keterangan, src }: { keterangan: string | null; src?: string }) {
  const h = HUD[useLang()];
  return (
    <figure className="flex flex-col gap-2">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={keterangan ?? ""} loading="lazy" className="aspect-video w-full rounded-card object-cover" />
      ) : (
        <div
          role="img"
          aria-label={h.gambarBelum}
          className="flex aspect-video w-full items-center justify-center rounded-card bg-archive-slate-normal text-eyebrow-15 text-text-secondary-normal"
        >
          {h.gambarBelum.toUpperCase()}: TBD
        </div>
      )}
      <figcaption className="text-sm text-text-secondary-normal">{keterangan ?? "TBD"}</figcaption>
    </figure>
  );
}

export function PanelGaleri({ galeri, foto }: { galeri: (string | null)[]; foto?: { src: string; keterangan: string; kredit?: string }[] }) {
  const h = HUD[useLang()];
  if (foto && foto.length > 0) {
    return (
      <>
        {foto.map((f) => (
          <ItemGaleri key={f.src} keterangan={`${f.keterangan} ${h.kredit}: ${f.kredit ?? "NASA"}.`} src={f.src} />
        ))}
      </>
    );
  }
  if (galeri.length === 0) return <Kosong />;
  return (
    <>
      {galeri.map((keterangan, i) => (
        <ItemGaleri key={keterangan ?? `tbd-${i}`} keterangan={keterangan} />
      ))}
    </>
  );
}

export function PanelSumber({ sumber }: { sumber: Sumber[] }) {
  if (sumber.length === 0) return <Kosong />;
  return (
    <>
      {sumber.map((s) => (
        <ItemSumber key={s.url} {...s} />
      ))}
    </>
  );
}
