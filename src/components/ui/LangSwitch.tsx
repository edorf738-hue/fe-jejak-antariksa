"use client";

import { useTransition } from "react";
import { setLang } from "@/app/actions";
import { LANGS, type Lang } from "@/lib/i18n";
import { UI } from "@/lib/ui-copy";
import { useLang } from "./LangProvider";

/**
 * Pengalih bahasa EN/ID (pil kaca kecil). Memilih bahasa menyimpan cookie lewat Server Action; Next lalu
 * merender ulang halaman saat ini dalam bahasa baru. Bahasa aktif ditandai `aria-pressed`.
 */
export function LangSwitch({ className = "" }: { className?: string }) {
  const lang = useLang();
  const [menunggu, mulai] = useTransition();
  const t = UI[lang];

  return (
    <div
      role="group"
      aria-label={t.langLabel}
      className={`kaca-tepi relative inline-flex items-center rounded-pill bg-white/[0.06] p-0.5 shadow-[inset_0_0_10px_rgba(8,11,18,0.45)] [--kaca-blur:12px] ${className}`}
    >
      {LANGS.map((l: Lang) => {
        const aktif = l === lang;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={aktif}
            aria-label={t.langName[l]}
            disabled={menunggu}
            onClick={() => !aktif && mulai(() => setLang(l))}
            className={`relative min-h-8 min-w-10 cursor-pointer rounded-pill px-3 text-[13px] font-bold leading-none tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aksen-informasi-normal ${
              aktif ? "bg-[#0067b2]/45 text-text-primary-normal" : "text-text-secondary-normal hover:text-text-primary-normal"
            }`}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
