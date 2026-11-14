/**
 * Kartu Data Benda (panel kaca mengambang, teks saja, tanpa viewer):
 * `Nama`, `Kategori`, `Deskripsi`, `Fakta`. Desktop: kartu di kanan scene
 * (lebar 380); tablet dan mobile: di bawah, menggantikan Kartu Narasi.
 * Batas karakter: nama 24, kategori 40, deskripsi 60, fakta 70.
 */
type KartuDataBendaProps = {
  nama: string;
  kategori: string;
  deskripsi: string;
  fakta: string;
  className?: string;
};

export function KartuDataBenda({
  nama,
  kategori,
  deskripsi,
  fakta,
  className = "",
}: KartuDataBendaProps) {
  return (
    <article
      className={`glass flex w-full max-w-[380px] flex-col gap-3 rounded-card p-6 shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{kategori}</p>
      <h2 className="text-heading-card text-text-primary-normal">{nama}</h2>
      <p className="text-base leading-6 text-text-secondary-normal">{deskripsi}</p>
      <p className="border-t border-archive-slate-normal pt-3 text-base font-medium text-aksen-informasi-normal">
        {fakta}
      </p>
    </article>
  );
}
