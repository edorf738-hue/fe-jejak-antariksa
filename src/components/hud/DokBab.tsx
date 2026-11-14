import { Button } from "@/components/ui";
import Link from "next/link";

/**
 * Dok Navigasi Bab (dok bawah halaman imersif Story): Sebelumnya, Navigasi Bab
 * (stepper 1-4, warna Aksen Visual = progres bab), Berikutnya.
 * Di Bab 4 tombol berikutnya berlabel "Daftar Bab" dan kembali ke Cerita; karena
 * itu tujuan tiap tombol diberikan lewat props, bukan dihitung di sini.
 */
type DokBabProps = {
  /** Bab aktif (1-4). */
  aktif: number;
  jumlahBab?: number;
  /** Tautan ke bab n. */
  hrefBab: (bab: number) => string;
  /** Tujuan Sebelumnya; kosong = tombol nonaktif (Bab 1). */
  hrefSebelumnya?: string;
  hrefBerikutnya: string;
  labelBerikutnya?: string;
  className?: string;
};

export function DokBab({
  aktif,
  jumlahBab = 4,
  hrefBab,
  hrefSebelumnya,
  hrefBerikutnya,
  labelBerikutnya = "Berikutnya",
  className = "",
}: DokBabProps) {
  return (
    <div
      className={`glass flex w-full items-center justify-between gap-3 rounded-pill p-2 shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] ${className}`}
    >
      {hrefSebelumnya ? (
        <Button href={hrefSebelumnya} variant="secondary" iconLeft="panah-kiri" className="max-md:px-3">
          <span className="max-md:sr-only">Sebelumnya</span>
        </Button>
      ) : (
        <Button variant="secondary" iconLeft="panah-kiri" disabled className="max-md:px-3">
          <span className="max-md:sr-only">Sebelumnya</span>
        </Button>
      )}

      <nav aria-label="Navigasi bab">
        <ol className="flex items-center gap-2">
          {Array.from({ length: jumlahBab }, (_, i) => i + 1).map((bab) => {
            const sekarang = bab === aktif;
            return (
              <li key={bab}>
                <Link
                  href={hrefBab(bab)}
                  aria-current={sekarang ? "step" : undefined}
                  aria-label={`Bab ${bab}`}
                  className={[
                    "flex size-11 items-center justify-center rounded-full font-heading text-base font-bold transition-colors duration-150",
                    sekarang
                      ? "bg-aksen-visual-normal text-bg-primary-normal"
                      : "text-text-secondary-normal hover:bg-archive-slate-normal hover:text-text-primary-normal",
                  ].join(" ")}
                >
                  {bab}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <Button href={hrefBerikutnya} iconRight="panah-kanan" className="max-md:px-3">
        <span className="max-md:sr-only">{labelBerikutnya}</span>
      </Button>
    </div>
  );
}
