import { Icon, KartuMisi } from "@/components/ui";
import type { Fakta, Misi, Sumber } from "@/data";

/**
 * Isi panel: Kartu Fakta, Kartu Misi, Item Galeri, Item Sumber. Semua murni
 * presentasi dan menerima data dari src/data. Nilai kosong ditampilkan sebagai TBD.
 */
const KOSONG = "Belum ada data.";

function Kosong({ teks = KOSONG }: { teks?: string }) {
  return <p className="text-text-secondary-normal">{teks}</p>;
}

export function KartuFakta({ isi, sumber }: Fakta) {
  return (
    <article className="flex flex-col gap-2 rounded-card bg-archive-slate-normal p-5">
      <p className="text-base leading-6 text-text-primary-normal">{isi}</p>
      <p className="text-sm text-text-secondary-normal">Sumber: {sumber}</p>
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
  return (
    <figure className="flex flex-col gap-2">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={keterangan ?? ""} className="aspect-video w-full rounded-card object-cover" />
      ) : (
        <div
          role="img"
          aria-label="Gambar belum tersedia"
          className="flex aspect-video w-full items-center justify-center rounded-card bg-archive-slate-normal text-eyebrow-15 text-text-secondary-normal"
        >
          GAMBAR: TBD
        </div>
      )}
      <figcaption className="text-sm text-text-secondary-normal">{keterangan ?? "TBD"}</figcaption>
    </figure>
  );
}

export function PanelGaleri({ galeri }: { galeri: (string | null)[] }) {
  if (galeri.length === 0) return <Kosong />;
  return (
    <>
      {galeri.map((keterangan, i) => (
        <ItemGaleri key={keterangan ?? `tbd-${i}`} keterangan={keterangan} />
      ))}
    </>
  );
}

/** Item Sumber: `Judul`, `Meta`, `URL`. Tautan keluar membuka tab baru. */
export function ItemSumber({ judul, penerbit, url, diakses }: Sumber) {
  return (
    <article className="flex flex-col gap-1 rounded-card bg-archive-slate-normal p-5">
      <h3 className="text-base font-bold text-text-primary-normal">{judul}</h3>
      <p className="text-sm text-text-secondary-normal">
        {penerbit} · Diakses: {diakses ?? "TBD"}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 break-all text-sm text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover"
      >
        <span>{url}</span>
        <Icon name="tautan-keluar" size={16} />
        <span className="sr-only">(buka di tab baru)</span>
      </a>
    </article>
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
