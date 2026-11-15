import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/**
 * Pengganti sementara untuk bagian scene 3D, sampai komponen dari tim 3D tersedia:
 *  - `LatarScene`: gambar latar + tiga gradien keterbacaan (milik halaman; scene 3D
 *    Edo menggantikan gambarnya, gradiennya tetap).
 *  - `Objek3DPlaceholder`: pratinjau benda "MODEL 3D: TBD" (Zhafran: ObjectViewer).
 *  - `TitikInfoPlaceholder`: Titik Info statis (Zhafran: HotspotLayer, yang mengikuti
 *    benda lewat proyeksi 3D ke layar). Posisi di sini hanya ilustrasi.
 *  - `PenandaPlaceholder`: label "scene 3D final: TBD" (Bab 1 belum punya aset 3D).
 */
/** Fokus horizontal gambar latar (persen, `object-position-x`) per ukuran layar: mobile, tablet, desktop (dari crop Figma). */
export type FokusGambar = { m: number; t: number; d: number };

export function LatarScene({
  gambar,
  fokus,
  children,
}: {
  gambar: string;
  fokus?: FokusGambar;
  /** Scene 3D (Edo): bila ada, menggantikan gambar latar. Gradien tetap di atasnya. */
  children?: ReactNode;
}) {
  const gaya = fokus
    ? ({ "--opm": `${fokus.m}%`, "--opt": `${fokus.t}%`, "--opd": `${fokus.d}%` } as CSSProperties)
    : undefined;
  const adaScene = children !== undefined && children !== null;
  return (
    // Gambar latar dekoratif (aria-hidden); scene 3D mengurus aksesibilitasnya sendiri.
    <div aria-hidden={adaScene ? undefined : true} className="absolute inset-0">
      {/* Scene mengecil pelan 1,07 -> 1 selama 3 dtk saat halaman masuk. */}
      <div className="hud-scene absolute inset-0">
        {adaScene ? (
          children
        ) : (
          <Image
            src={gambar}
            alt=""
            fill
            priority
            sizes="100vw"
            style={gaya}
            className={fokus ? "object-cover object-[var(--opm)_50%] md:object-[var(--opt)_50%] lg:object-[var(--opd)_50%]" : "object-cover"}
          />
        )}
      </div>
      {/* Gradien Atas, Bawah, Kiri (Figma): rgba(8,11,18) 0,85/0,92/0,7 -> 0. Tidak menangkap pointer agar kanvas bisa diputar. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-[rgba(8,11,18,0.85)] to-[rgba(8,11,18,0)] lg:h-[240px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-gradient-to-b from-[rgba(8,11,18,0)] to-[rgba(8,11,18,0.92)] lg:h-[320px]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[620px] bg-gradient-to-r from-[rgba(8,11,18,0.7)] to-[rgba(8,11,18,0)] lg:block" />
    </div>
  );
}

export function PenandaPlaceholder({ teks, className = "" }: { teks: string; className?: string }) {
  return (
    <p
      className={`text-eyebrow-15 w-fit rounded-pill border border-aksen-warisan-normal bg-bg-secondary-normal/60 px-3.5 py-1.5 uppercase tracking-[3px]! whitespace-nowrap text-aksen-warisan-normal ${className}`}
    >
      {teks}
    </p>
  );
}

export function Objek3DPlaceholder({ judul, status, className = "" }: { judul: string; status: string; className?: string }) {
  return (
    <div
      className={`pointer-events-none flex h-[340px] w-[380px] max-w-full flex-col items-center justify-center gap-2 ${className}`}
      role="img"
      aria-label={`${judul} (${status})`}
    >
      <div className="absolute size-[300px] rounded-full border-[1.5px] border-dashed border-aksen-informasi-normal" aria-hidden="true" />
      <svg viewBox="0 0 24 24" className="size-[72px] text-aksen-informasi-normal" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5" />
      </svg>
      <p className="text-body-large relative text-center text-text-primary-normal [text-shadow:0_1px_8px_rgba(0,0,0,0.75)]">{judul}</p>
      <p className="text-eyebrow-15 relative text-center uppercase text-aksen-warisan-light-active [text-shadow:0_1px_8px_rgba(0,0,0,0.75)]">{status}</p>
    </div>
  );
}

type TitikInfoProps = {
  label: string;
  aktif?: boolean;
  onClick?: () => void;
  /** Urutan titik (0, 1, 2): menentukan jeda animasi masuk (+0,15 dtk) dan denyut (+0,4 dtk). */
  urutan?: number;
  /** Variabel CSS tambahan (posisi per ukuran layar dari HalamanImersif). */
  style?: CSSProperties;
  className?: string;
};

export function TitikInfoPlaceholder({ label, aktif = false, onClick, urutan = 0, style, className = "" }: TitikInfoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktif}
      aria-label={label}
      style={{ ...style, "--hud-delay": `${0.9 + urutan * 0.15}s`, "--denyut-delay": `${1.5 + urutan * 0.4}s` } as CSSProperties}
      className={`hud-titik group absolute flex min-h-11 cursor-pointer items-center gap-3 focus-visible:outline-none! ${className}`}
    >
      {/* Penanda 44 px; state Titik Info Figma (cincin / titik 14 px):
          Default 1,5 px Text Primary; Hover 2 px Aksen Informasi Light; Aktif 2,5 px Aksen Informasi; Focus 3 px Text Primary.
          Halo di luar cincin saat fokus keyboard (tambahan aksesibilitas, tidak ada di Figma). */}
      <span className="relative block size-11 shrink-0 rounded-full group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-aksen-informasi-normal">
        {/* Denyut: cincin tipis membesar 1 -> 2x sambil memudar, siklus 2 dtk, tiap titik bergeser 0,4 dtk. */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full border-[1.5px] opacity-0 motion-safe:hud-denyut in-data-[jeda]:[animation-play-state:paused]! ${aktif ? "border-aksen-informasi-normal" : "border-text-primary-normal"}`}
        />
        <span
          // Cincin dari bayangan dalam (bukan border): lebar pecahan 1,5 / 2,5 px tidak dibulatkan browser.
          className={`absolute inset-0 rounded-full transition-shadow duration-150 ${
            aktif
              ? "shadow-[inset_0_0_0_2.5px_var(--color-aksen-informasi-normal)]"
              : "shadow-[inset_0_0_0_1.5px_var(--color-text-primary-normal)] group-hover:shadow-[inset_0_0_0_2px_var(--color-aksen-informasi-light)] group-focus-visible:shadow-[inset_0_0_0_3px_var(--color-text-primary-normal)]"
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-150 ${
            aktif ? "bg-aksen-informasi-normal" : "bg-text-primary-normal group-hover:bg-aksen-informasi-light group-focus-visible:bg-text-primary-normal"
          }`}
        />
      </span>
      <span
        className={`glass text-button-label rounded-pill border border-archive-slate-normal px-4 py-2 max-md:hidden ${aktif ? "text-aksen-informasi-normal" : "text-text-primary-normal"}`}
      >
        {label}
      </span>
    </button>
  );
}
