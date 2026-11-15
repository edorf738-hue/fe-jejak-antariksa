/** Bahasa situs: English (bawaan, sesuai aturan NASA Space Apps) dan Indonesia. Aman dipakai di server maupun klien. */
export const LANGS = ["en", "id"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

export function isLang(v: unknown): v is Lang {
  return v === "en" || v === "id";
}

/** Pilih nilai menurut bahasa: `pick(lang, { en: "...", id: "..." })`. */
export function pick<T>(lang: Lang, v: Record<Lang, T>): T {
  return v[lang];
}

/** Bentuk yang sama dengan T tetapi string literal dilebarkan menjadi `string` (untuk terjemahan `as const`). */
export type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: Widen<T[K]> }
      : T;
