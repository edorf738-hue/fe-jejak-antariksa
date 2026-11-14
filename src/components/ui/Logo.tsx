import Link from "next/link";

/**
 * PLACEHOLDER logo NASA Space Apps Challenge.
 *
 * Panitia tidak mengizinkan logo NASA (FIGMA_HANDOFF bagian 7), jadi yang dipakai
 * adalah logo Space Apps Challenge: 84 px di desktop, 44 px (lambang) di
 * Navbar Ringkas. Berkas resmi (SVG) belum ada dari panitia (keputusan terbuka #6
 * di PEMBAGIAN_TUGAS.md); ganti isi komponen ini dengan <Image> begitu berkasnya ada.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="NASA Space Apps Challenge, ke Beranda"
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-archive-slate-normal text-eyebrow-15 !tracking-normal text-text-primary-normal lg:size-[84px] ${className}`}
    >
      <span aria-hidden="true">SA</span>
    </Link>
  );
}
