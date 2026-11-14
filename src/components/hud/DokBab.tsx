import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * Dok Navigasi Bab (dok bawah halaman imersif Story): Navigasi Bab (stepper dengan
 * penanda 44 px, garis penghubung, label bab) dan tombol bab berikutnya (Primary,
 * `Ikon Kanan`), ditambah Sebelumnya (Secondary) mulai Bab 2. Figma: glass #111827 @ 62%
 * + blur 12, radius 28, padding 16/24. Di mobile label bab disembunyikan dan tombol
 * berada di bawah stepper selebar penuh.
 *
 * Tujuan tiap tautan diberikan lewat props: Bab 4 berlabel "Daftar Bab" dan kembali ke Cerita.
 */
type DokBabProps = {
  /** Bab aktif (1-4). */
  aktif: number;
  /** Label singkat tiap bab, mis. ["Awal", "Bulan", "Mars", "Deep Space"]. */
  label: readonly string[];
  hrefBab: (bab: number) => string;
  /** Tujuan Sebelumnya; kosong = tidak ditampilkan (Bab 1). */
  hrefSebelumnya?: string;
  hrefBerikutnya: string;
  labelBerikutnya: string;
  className?: string;
};

export function DokBab({
  aktif,
  label,
  hrefBab,
  hrefSebelumnya,
  hrefBerikutnya,
  labelBerikutnya,
  className = "",
}: DokBabProps) {
  return (
    <div
      className={`glass flex w-full flex-col gap-3 rounded-[28px] border border-archive-slate-normal p-4 md:flex-row md:items-center md:gap-6 md:px-6 ${className}`}
    >
      <nav aria-label="Navigasi bab" className="min-w-0 flex-1">
        <ol className="flex items-start gap-3">
          {label.map((nama, i) => {
            const bab = i + 1;
            const sekarang = bab === aktif;
            return (
              <li key={bab} className="contents">
                {i > 0 && (
                  <span aria-hidden="true" className="flex h-11 min-w-0 flex-1 items-center">
                    <span className="h-0.5 flex-1 bg-archive-slate-normal" />
                  </span>
                )}
                <Link
                  href={hrefBab(bab)}
                  aria-current={sekarang ? "step" : undefined}
                  aria-label={`Bab ${bab}: ${nama}`}
                  className="flex shrink-0 flex-col items-center gap-2.5"
                >
                  <span
                    className={`text-button-label flex size-11 items-center justify-center rounded-full ${
                      sekarang
                        ? "bg-aksen-informasi-normal text-bg-primary-normal"
                        : "border-[1.5px] border-text-secondary-dark text-text-secondary-normal"
                    }`}
                  >
                    {bab}
                  </span>
                  <span
                    className={`hidden md:block ${
                      sekarang
                        ? "text-button-label text-text-primary-normal"
                        : "text-nav-link text-text-secondary-normal"
                    }`}
                  >
                    {nama}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex gap-3 md:shrink-0">
        {hrefSebelumnya && (
          <Button href={hrefSebelumnya} variant="secondary" iconLeft="panah-kiri" className="flex-1 md:flex-none">
            Sebelumnya
          </Button>
        )}
        <Button href={hrefBerikutnya} iconRight="panah-kanan" className="flex-1 md:flex-none">
          {labelBerikutnya}
        </Button>
      </div>
    </div>
  );
}
