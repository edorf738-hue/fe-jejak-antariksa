import type { EntriSumber as EntriSumberData } from "@/data";
import { reveal } from "./reveal";

/**
 * Entri Sumber (FIGMA_HANDOFF bagian 3): `Kategori`, `Judul`, `Meta`, `URL`,
 * `Atribusi`. Nilai yang belum ada tampil sebagai TBD (jangan diisi dari
 * perkiraan). URL penuh menjadi tautan tab baru; selain itu teks biasa.
 */
type EntriSumberProps = Pick<
  EntriSumberData,
  "labelKategori" | "judul" | "meta" | "url" | "atribusi"
> & {
  /** Bila diisi (ms), entri muncul saat masuk layar dengan jeda ini (lihat reveal.ts). */
  delay?: number;
  className?: string;
};

export function EntriSumber({
  labelKategori,
  judul,
  meta,
  url,
  atribusi,
  delay,
  className = "",
}: EntriSumberProps) {
  const adaTautan = /^https?:\/\//.test(url);
  return (
    <article
      {...(delay === undefined ? {} : reveal(delay))}
      className={`flex flex-col gap-2.5 break-words rounded-card border border-archive-slate-normal bg-bg-secondary-normal px-5 py-6 md:px-8 md:py-7 ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{labelKategori}</p>
      <h3 className="text-button-label text-text-primary-normal">{judul}</h3>
      <p className="text-body-large text-text-secondary-normal">{meta}</p>
      {adaTautan ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-large -my-2 block break-all py-2 text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover"
        >
          {url}
          <span className="sr-only"> (buka di tab baru)</span>
        </a>
      ) : (
        <p className="text-body-large text-aksen-informasi-normal">{url}</p>
      )}
      <p className="text-body-large text-text-secondary-normal">{atribusi}</p>
    </article>
  );
}
