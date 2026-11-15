import { Fragment, type CSSProperties } from "react";

/**
 * Memecah teks judul per kata (di server, jadi tanpa kedipan) agar tiap kata bisa muncul dari
 * bawah satu per satu (gerak ala nakala.digital). Pasang di dalam judul yang diberi
 * `{...revealKata(ms)}` (lihat reveal.ts). `mulai` = nomor kata pertama, untuk judul yang terdiri
 * dari beberapa `<SplitText>` (mis. satu per baris) supaya jeda per kata tetap berlanjut.
 * Teks tetap utuh untuk pembaca layar (kata dipisah spasi biasa).
 */
export function SplitText({ children, mulai = 0 }: { children: string; mulai?: number }) {
  const kata = children.split(/\s+/).filter(Boolean);
  return (
    <>
      {kata.map((k, i) => (
        <Fragment key={`${i}-${k}`}>
          {i > 0 && " "}
          <span className="split-word" style={{ "--word-index": mulai + i } as CSSProperties}>
            <span className="split-word-inner">{k}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** Jumlah kata dalam teks (untuk menghitung `mulai` baris berikutnya). */
export function hitungKata(teks: string) {
  return teks.split(/\s+/).filter(Boolean).length;
}
