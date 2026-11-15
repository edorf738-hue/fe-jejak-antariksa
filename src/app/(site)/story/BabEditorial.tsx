import Image from "next/image";
import Link from "next/link";
import { Button, reveal } from "@/components/ui";

/**
 * Satu bab di halaman Cerita, gaya editorial: nomor besar, judul, deskripsi, foto 4:3, tombol buka. Bab genap membalik susunan
 * (foto di kiri). Foto dan tombol menuju bab yang sama. Murni server component; gerak hanya fade-naik saat masuk layar.
 */
type BabEditorialProps = {
  nomor: string;
  judul: string;
  ringkasan: string;
  href: string;
  gambar: string;
  keterangan: string;
  /** Susunan dibalik (foto di kiri pada desktop). */
  balik?: boolean;
  /** Teks per bahasa: label atas ("Bab 01") dan tombol ("Buka Bab 01"). */
  labelBab: string;
  labelTombol: string;
};

export function BabEditorial({ nomor, judul, ringkasan, href, gambar, keterangan, balik = false, labelBab, labelTombol }: BabEditorialProps) {
  return (
    <div {...reveal(0)}>
      <article className="group grid items-center gap-6 md:gap-8 lg:grid-cols-12 lg:gap-14">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className={`relative block aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-inset ring-white/10 lg:col-span-7 ${balik ? "lg:order-1" : "lg:order-2"}`}
        >
          <Image
            src={gambar}
            alt=""
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(8,11,18,0.85)] to-transparent px-5 pb-3 pt-10 text-xs text-text-secondary-normal">
            {keterangan}
          </span>
        </Link>

        <div className={`flex flex-col gap-4 lg:col-span-5 ${balik ? "lg:order-2" : "lg:order-1"}`}>
          <span
            aria-hidden="true"
            className="font-heading text-[88px] font-bold leading-none text-aksen-informasi-normal/25 transition-colors duration-500 group-hover:text-aksen-informasi-normal/60 md:text-[120px]"
          >
            {nomor}
          </span>
          <p className="text-eyebrow-15 uppercase text-aksen-warisan-normal">{labelBab}</p>
          <h3 className="text-heading-card text-text-primary-normal md:text-heading-section">{judul}</h3>
          <p className="text-body-large max-w-[520px] text-text-secondary-normal">{ringkasan}</p>
          <div className="pt-2">
            <Button href={href} variant="secondary" glass iconRight="panah-kanan" className="max-md:w-full">
              {labelTombol}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
