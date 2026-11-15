import type { CSSProperties } from "react";

/**
 * Props untuk elemen yang muncul saat masuk layar (naik 24 px sambil memudar), mengikuti bahasa
 * gerak nakala.digital. Disebar ke elemen server maupun client: `<p {...reveal(160)}>`.
 * `ms` = jeda sebelum mulai (untuk berurutan). CSS-nya ada di globals.css ("Gerak halaman");
 * pemicunya `<RevealObserver>` di layout.
 */
export function reveal(ms = 0) {
  return { "data-reveal": "", style: { "--reveal-delay": `${ms}ms` } as CSSProperties };
}

/** Jeda berurutan untuk daftar: item ke-`i` mulai `selang` ms setelah sebelumnya, dibatasi `maks` langkah agar daftar panjang tidak terasa lambat. */
export function revealUrut(i: number, selang = 80, maks = 5) {
  return reveal(Math.min(i, maks) * selang);
}

/** Untuk judul yang isinya dipecah per kata dengan `<SplitText>`: `<h1 {...revealKata(100)}>`. */
export function revealKata(ms = 0) {
  return { "data-reveal": "split", style: { "--reveal-delay": `${ms}ms` } as CSSProperties };
}

/**
 * Varian untuk konten di atas lipatan (hero, header halaman): animasi CSS yang jalan saat pertama
 * tampil, tanpa menunggu JavaScript/hidrasi sehingga teks hero tidak tertahan. Sama seperti
 * `reveal`/`revealKata` selebihnya (jeda `ms`).
 */
export function revealMuat(ms = 0) {
  return { "data-reveal-muat": "", style: { "--reveal-delay": `${ms}ms` } as CSSProperties };
}

export function revealKataMuat(ms = 0) {
  return { "data-reveal-muat": "split", style: { "--reveal-delay": `${ms}ms` } as CSSProperties };
}
