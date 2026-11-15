"use server";

import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, type Lang } from "@/lib/i18n";

/** Simpan pilihan bahasa; menulis cookie di Server Action membuat Next merender ulang halaman saat ini. */
export async function setLang(lang: Lang) {
  if (!isLang(lang)) return;
  (await cookies()).set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
