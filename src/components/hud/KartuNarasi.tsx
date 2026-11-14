/**
 * Kartu Narasi (panel kaca mengambang): properti `Eyebrow`, `Judul`, `Isi`,
 * `Petunjuk`. Komponen murni presentasi: teks datang dari data (content-data.json),
 * batas karakter narasi 90 (lihat _meta.batasKarakter).
 */
type KartuNarasiProps = {
  eyebrow: string;
  judul: string;
  isi: string;
  /** Petunjuk interaksi (mis. cara memutar benda). Opsional. */
  petunjuk?: string;
  className?: string;
};

export function KartuNarasi({ eyebrow, judul, isi, petunjuk, className = "" }: KartuNarasiProps) {
  return (
    <article
      className={`glass flex w-full max-w-[420px] flex-col gap-3 rounded-card p-6 shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{eyebrow}</p>
      <h2 className="text-heading-card text-text-primary-normal">{judul}</h2>
      <p className="text-base leading-6 text-text-secondary-normal md:text-xl md:leading-[30px]">
        {isi}
      </p>
      {petunjuk && <p className="text-sm text-text-secondary-dark">{petunjuk}</p>}
    </article>
  );
}
