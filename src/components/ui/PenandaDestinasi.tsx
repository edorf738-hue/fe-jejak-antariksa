import Image from "next/image";
import Link from "next/link";

/**
 * Penanda Destinasi (FIGMA_HANDOFF bagian 3): lingkaran gambar 120 px + `Label`.
 * State Default, Hover (cincin putih), Selected (cincin biru), Focus. Gambar di
 * Figma sudah membawa cincin; di sini cincin dibuat dengan CSS agar bisa berganti
 * state, jadi gambar yang dipakai adalah potongan tengah lingkaran tanpa cincin.
 */
type PenandaDestinasiProps = {
  label: string;
  href: string;
  gambar: string;
  terpilih?: boolean;
  className?: string;
};

export function PenandaDestinasi({ label, href, gambar, terpilih = false, className = "" }: PenandaDestinasiProps) {
  return (
    <Link
      href={href}
      aria-current={terpilih ? "page" : undefined}
      className={`group flex flex-col items-center gap-4 p-[9px] ${className}`}
    >
      <span
        className={`relative block size-[120px] overflow-hidden rounded-full ring-2 transition-shadow duration-150 ${
          terpilih
            ? "ring-4 ring-aksen-informasi-normal"
            : "ring-archive-slate-normal group-hover:ring-text-primary-normal"
        }`}
      >
        <Image src={gambar} alt="" fill sizes="120px" className="object-cover" />
      </span>
      <span
        className={`text-button-label ${terpilih ? "text-aksen-informasi-normal" : "text-text-primary-normal"}`}
      >
        {label}
      </span>
    </Link>
  );
}
