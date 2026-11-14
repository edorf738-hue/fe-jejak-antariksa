import Image from "next/image";

/**
 * Header halaman (Cerita, Peta Perjalanan, Sumber): panorama 3:1 sebagai latar,
 * overlay gradien 30%, lalu eyebrow, judul, deskripsi (rata tengah). Navbar
 * (absolute) berada di atasnya, jadi header ditarik ke y = 0 dengan margin negatif.
 *
 * Tinggi Figma: mobile 420, tablet 360, desktop 440 (Cerita 520). Di tablet dan
 * mobile teks mulai 140 px dari atas; di desktop teks menempel 80 px dari bawah.
 * Beri tinggi desktop lewat `className`, mis. `lg:min-h-[520px]`.
 */
type PageHeaderProps = {
  eyebrow: string;
  judul: string;
  deskripsi: string;
  /** Path gambar panorama di /public. */
  gambar: string;
  className?: string;
};

export function PageHeader({ eyebrow, judul, deskripsi, gambar, className = "lg:min-h-[440px]" }: PageHeaderProps) {
  return (
    <header
      className={`relative -mt-(--navbar-offset) flex min-h-[420px] flex-col overflow-hidden bg-bg-primary-normal md:min-h-[360px] ${className}`}
    >
      <Image src={gambar} alt="" fill priority sizes="100vw" className="object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,#10131b_0%,rgba(16,19,27,0.6)_50%,rgba(11,14,21,0.85)_100%)] opacity-30"
      />
      <div className="relative mx-auto flex w-full max-w-page flex-1 flex-col items-center gap-3 px-page pt-[140px] text-center lg:justify-end lg:pb-20 lg:pt-0">
        <p className="text-eyebrow-15 uppercase text-text-primary-normal lg:text-eyebrow-20">{eyebrow}</p>
        <h1 className="text-hero-36 uppercase text-text-primary-normal md:text-heading-section lg:text-hero-70">
          {judul}
        </h1>
        <p className="text-body-large max-w-[900px] text-text-primary-normal lg:mt-3">{deskripsi}</p>
      </div>
    </header>
  );
}
