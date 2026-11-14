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
      className={`glass flex w-full flex-col gap-3.5 break-words rounded-[28px] border border-archive-slate-normal p-8 lg:w-[440px] ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{eyebrow}</p>
      <h2 className="text-heading-card text-text-primary-normal">{judul}</h2>
      <p className="text-body-large text-text-secondary-normal">{isi}</p>
      {petunjuk && <p className="text-body-large text-aksen-informasi-normal max-lg:hidden">{petunjuk}</p>}
    </article>
  );
}
