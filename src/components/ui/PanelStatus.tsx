import type { ReactNode } from "react";

/**
 * Panel state halaman (FIGMA: "Panel — Kosong", "Memuat", "Galat"): kotak Bg Secondary,
 * radius 24, padding 40, isi di tengah, tinggi minimal 300.
 * - `kosong`: judul + keterangan (tidak ada data / belum memilih).
 * - `memuat`: tiga baris kerangka berdenyut + keterangan; `role="status"`, `aria-busy`.
 * - `galat`: judul + keterangan + `aksi` (mis. tombol "Coba Lagi"); `role="alert"`.
 */
type PanelStatusProps = {
  varian: "kosong" | "memuat" | "galat";
  judul?: string;
  isi: string;
  /** Tombol aksi (varian galat). */
  aksi?: ReactNode;
  className?: string;
};

const KERANGKA = ["w-80", "w-[420px]", "w-[260px]"];

export function PanelStatus({ varian, judul, isi, aksi, className = "" }: PanelStatusProps) {
  return (
    <section
      role={varian === "galat" ? "alert" : varian === "memuat" ? "status" : undefined}
      aria-busy={varian === "memuat" || undefined}
      className={`flex min-h-[300px] w-full flex-col items-center justify-center gap-4 break-words rounded-card border border-archive-slate-normal bg-bg-secondary-normal p-10 text-center ${className}`}
    >
      {varian === "memuat" &&
        KERANGKA.map((lebar) => (
          <span
            key={lebar}
            aria-hidden="true"
            className={`motion-safe:kerangka-napas h-5 max-w-full rounded-[10px] bg-archive-slate-normal ${lebar}`}
          />
        ))}
      {judul && <h2 className="text-heading-card text-text-primary-normal">{judul}</h2>}
      <p className="text-body-large text-text-secondary-normal">{isi}</p>
      {aksi}
    </section>
  );
}
