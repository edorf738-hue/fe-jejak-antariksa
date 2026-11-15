/**
 * Kartu Narasi (panel kaca mengambang): `Eyebrow`, `Judul`, `Isi`, `Petunjuk`.
 * Figma: lebar 440 di desktop, penuh di tablet/mobile; padding 32, radius 28, gap 14,
 * fill #111827 @ 62% + blur 12, garis 1 px Archive Slate. Murni presentasi: teks dari
 * data (batas karakter narasi 90, lihat _meta.batasKarakter).
 */
type KartuNarasiProps = {
  eyebrow: string;
  judul: string;
  isi: string;
  /** Petunjuk interaksi (Aksen Informasi). Opsional; disembunyikan di mobile oleh pemanggil. */
  petunjuk?: string;
  className?: string;
};

export function KartuNarasi({ eyebrow, judul, isi, petunjuk, className = "" }: KartuNarasiProps) {
  return (
    <article
      className={`glass flex w-full flex-col gap-2 break-words rounded-[24px] border border-white/10 p-5 lg:w-[330px] lg:p-5 ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{eyebrow}</p>
      <h2 className="text-2xl font-bold leading-8 text-text-primary-normal">{judul}</h2>
      <p className="line-clamp-2 text-sm leading-5 text-text-secondary-normal">{isi}</p>
      {petunjuk && <p className="text-sm text-aksen-informasi-normal max-lg:hidden">{petunjuk}</p>}
    </article>
  );
}
