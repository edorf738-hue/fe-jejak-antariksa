import Image from "next/image";
import Link from "next/link";

/**
 * Logo NASA Space Apps Challenge (FIGMA_HANDOFF bagian 7): panitia tidak
 * mengizinkan logo NASA, jadi yang dipakai logo Space Apps Challenge. Ukuran
 * Figma: 60 px tinggi di desktop (navbar 80), 44 px (lambang) di Navbar Ringkas.
 *
 * Berkas masih PNG transparan hasil ekstrak dari gambar panitia (847x882);
 * untuk produksi minta berkas resmi (SVG) dari panitia (keputusan terbuka #6 di
 * PEMBAGIAN_TUGAS.md) dan ganti `src` di sini.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="NASA Space Apps Challenge, ke Beranda"
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center ${className}`}
    >
      <Image
        src="/images/logo-space-apps.png"
        alt=""
        width={847}
        height={882}
        priority
        sizes="(min-width: 1024px) 58px, 43px"
        className="h-11 w-auto lg:h-[60px]"
      />
    </Link>
  );
}
