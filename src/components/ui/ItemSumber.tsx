"use client";

import type { Sumber } from "@/data";
import { MISC } from "@/lib/ui-copy";
import { useLang } from "./LangProvider";
import { reveal } from "./reveal";

/**
 * Item Sumber (FIGMA_HANDOFF bagian 3): `Judul`, `Meta`, `URL`, baris dengan garis bawah.
 * Dipakai di Peta Perjalanan dan panel Sumber. (Entri Sumber lengkap untuk halaman
 * Sumber adalah komponen lain: `EntriSumber`.)
 */
export function ItemSumber({ judul, penerbit, url, diakses, delay }: Sumber & { delay?: number }) {
  const m = MISC[useLang()];
  return (
    <article {...(delay === undefined ? {} : reveal(delay))} className="flex flex-col gap-1.5 break-words border-b border-archive-slate-normal py-5">
      <h3 className="text-button-label text-text-primary-normal">{judul}</h3>
      <p className="text-body-large text-text-secondary-normal">
        {m.penerbit}: {penerbit} · {m.diakses}: {diakses ?? "TBD"}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body-large -my-2 block break-all py-2 text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover"
      >
        {url}
        <span className="sr-only">{m.tabBaru}</span>
      </a>
    </article>
  );
}
