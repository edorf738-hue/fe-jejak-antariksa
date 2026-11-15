import { BAB_API, JOURNEYS_API } from "./api";
import type { Bab, Kategori, KategoriSlug } from "./types";

/**
 * Pemuat konten bab dan kategori (Mars, Moon, Deep Space). Datanya berasal dari backend lewat snapshot di ./api
 * (lihat api.ts); komponen tidak boleh menulis fakta sendiri, ambil lewat fungsi di sini. Nilai "TBD" dan null dipertahankan.
 */
export function getDaftarBab(): Bab[] {
  return BAB_API;
}

export function getBab(id: number): Bab | undefined {
  return BAB_API.find((b) => b.id === id);
}

export const KATEGORI_SLUGS: KategoriSlug[] = ["mars", "moon", "deep-space"];

export function isKategoriSlug(value: string): value is KategoriSlug {
  return (KATEGORI_SLUGS as string[]).includes(value);
}

export function getKategori(slug: KategoriSlug): Kategori {
  return (JOURNEYS_API.find((j) => j.slug === slug) as { kategori: Kategori }).kategori;
}
