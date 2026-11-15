import Link from "next/link";
import { Button } from "@/components/ui";

/**
 * Dok Navigasi Bab (dok bawah halaman imersif Story). Mengikuti Figma:
 *  - Desktop (>= lg): satu baris [Sebelumnya] [Navigasi Bab] [Berikutnya], gap 24, padding 16/24.
 *  - Tablet dan mobile: Navigasi Bab (tanpa label bab) di atas, lalu dua tombol selebar sama di bawahnya.
 *  - Navigasi Bab: penanda 44 px; bab selesai Aksen Informasi Dark, bab aktif Aksen Informasi Normal,
 *    bab berikutnya berupa lingkaran bergaris; garis penghubung berwarna bila bab di kirinya selesai.
 *  - Glass #111827 @ 62% + blur 12, radius 28.
 *
 * Label tombol berupa nama bab tujuan ("Bab 1", "Bab 3"); Bab 4 berlabel "Daftar Bab" dan kembali ke Cerita.
 * Bab 1 tidak punya tombol Sebelumnya.
 */
type DokBabProps = {
  /** Bab aktif (1-4). */
  aktif: number;
  /** Label singkat tiap bab, mis. ["Awal", "Bulan", "Mars", "Deep Space"]. */
  label: readonly string[];
  hrefBab: (bab: number) => string;
  /** Tujuan Sebelumnya; kosong = tidak ditampilkan (Bab 1). */
  hrefSebelumnya?: string;
  labelSebelumnya?: string;
  hrefBerikutnya: string;
  labelBerikutnya: string;
  /** Teks per bahasa untuk label aksesibilitas: "Navigasi bab", kata "Bab", dan "selesai". */
  labelNav?: string;
  kataBab?: string;
  kataSelesai?: string;
  className?: string;
};

export function DokBab({
  aktif,
  label,
  hrefBab,
  hrefSebelumnya,
  labelSebelumnya = "Sebelumnya",
  hrefBerikutnya,
  labelBerikutnya,
  labelNav = "Navigasi bab",
  kataBab = "Bab",
  kataSelesai = "selesai",
  className = "",
}: DokBabProps) {
  return (
    <div
      className={`glass flex w-full flex-col gap-2 rounded-[20px] border border-white/10 p-2.5 lg:w-[760px] lg:gap-3 lg:rounded-[24px] lg:p-3 lg:flex-row lg:items-center lg:gap-4 lg:px-4 ${className}`}
    >
      <nav aria-label={labelNav} className="order-1 min-w-0 lg:order-2 lg:flex-1">
        <ol className="flex items-start gap-3">
          {label.map((nama, i) => {
            const bab = i + 1;
            const sekarang = bab === aktif;
            const selesai = bab < aktif;
            return (
              <li key={bab} className="contents">
                {i > 0 && (
                  <span aria-hidden="true" className="flex h-9 min-w-0 flex-1 items-center lg:h-11">
                    <span
                      className={`h-0.5 flex-1 ${i < aktif ? "bg-aksen-informasi-dark" : "bg-archive-slate-normal"}`}
                    />
                  </span>
                )}
                <Link
                  href={hrefBab(bab)}
                  aria-current={sekarang ? "step" : undefined}
                  aria-label={`${kataBab} ${bab}: ${nama}${selesai ? ` (${kataSelesai})` : ""}`}
                  className="flex shrink-0 flex-col items-center gap-2.5"
                >
                  <span
                    className={`text-button-label flex size-9 items-center justify-center rounded-full lg:size-11 ${
                      sekarang
                        ? "bg-aksen-informasi-normal text-bg-primary-normal"
                        : selesai
                          ? "bg-aksen-informasi-dark text-bg-primary-normal"
                          : "border-[1.5px] border-text-secondary-dark text-text-secondary-normal"
                    }`}
                  >
                    {bab}
                  </span>
                  <span
                    className={`hidden lg:block ${
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

      {/* Di tablet/mobile kedua tombol berbagi satu baris; di desktop `contents` menempatkannya di kiri dan kanan Navigasi Bab. */}
      <div className="order-2 flex gap-3 lg:contents">
        {hrefSebelumnya && (
          <Button
            href={hrefSebelumnya}
            variant="secondary"
            kaca
            iconLeft="panah-kiri"
            className="min-w-0 flex-1 py-2! max-lg:px-3! max-lg:text-base! lg:order-1 lg:w-[140px] whitespace-nowrap lg:flex-none"
          >
            {labelSebelumnya}
          </Button>
        )}
        <Button href={hrefBerikutnya} kaca iconRight="panah-kanan" className="min-w-0 flex-1 py-2! max-lg:px-3! max-lg:text-base! lg:order-3 lg:w-[140px] whitespace-nowrap lg:flex-none">
          {labelBerikutnya}
        </Button>
      </div>
    </div>
  );
}
