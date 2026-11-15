import { GALERI_API, MEDIA_API } from "./api";

/**
 * Media popup objek (id benda, mis. "2-0"). Satu benda bisa punya beberapa media; popup memilih tampilan menurut jenis aset:
 *  - model3d : file .glb sungguhan dari NASA, diputar dan di-zoom di dalam popup;
 *  - image   : foto NASA (tidak pernah dijadikan model palsu), bisa diperbesar;
 *  - video   : video NASA (HTML5, tanpa putar otomatis);
 *  - tanpa media: hanya teks.
 * Kredit mengikuti catatan di NASA_ASSET_COLLECTION_REPORT.md; yang belum tercatat ditulis apa adanya.
 */
export type MediaItem =
  | { jenis: "model3d"; src: string; label?: string; keterangan: string; kredit: string }
  | { jenis: "image"; src: string; label?: string; keterangan: string; kredit: string }
  | { jenis: "video"; src: string; poster: string; label?: string; keterangan: string; kredit: string };
export type MediaBenda = { media: MediaItem[]; catatanModel?: string };

export const MEDIA_BENDA: Record<string, MediaBenda> = MEDIA_API;

/**
 * Foto galeri per lingkungan di panel Galeri halaman 3D. Sumbernya sama dengan galeri halaman cerita (src/data/cerita.ts),
 * jadi foto, keterangan, dan kredit selalu sama di kedua halaman.
 */
export type FotoGaleri = { src: string; keterangan: string; kredit: string };
export const GALERI_FOTO = GALERI_API;
