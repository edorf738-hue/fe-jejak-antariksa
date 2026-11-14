/**
 * Kartu Data Benda (panel kaca mengambang, teks saja): `Nama`, `Kategori`, `Deskripsi`,
 * `Fakta` (+ sumber; setiap fakta wajib punya sumber). Figma: lebar 380, padding 28,
 * radius 24, garis 1,5 px Aksen Informasi. Desktop: di kanan scene; tablet dan mobile:
 * di bawah, menggantikan Kartu Narasi. Batas karakter: nama 24, kategori 40, deskripsi 60,
 * fakta 70.
 */
type KartuDataBendaProps = {
  nama: string;
  kategori: string;
  deskripsi: string;
  fakta: string;
  sumber?: string;
  /** Eyebrow, mis. "DATA BENDA". */
  eyebrow?: string;
  className?: string;
};

export function KartuDataBenda({
  nama,
  kategori,
  deskripsi,
  fakta,
  sumber,
  eyebrow = "DATA BENDA",
  className = "",
}: KartuDataBendaProps) {
  return (
    <article
      className={`glass flex w-full flex-col gap-3 break-words rounded-card border-[1.5px] border-aksen-informasi-normal p-7 lg:w-[380px] ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-informasi-normal">{eyebrow}</p>
      <h2 className="text-heading-card text-text-primary-normal">{nama}</h2>
      <p className="text-body-large text-text-secondary-normal">Kategori: {kategori}</p>
      <p className="text-body-large text-text-secondary-normal">Deskripsi: {deskripsi}</p>
      <p className="text-body-large text-text-secondary-normal">
        Fakta: {fakta}
        {sumber ? ` (sumber: ${sumber})` : ""}
      </p>
    </article>
  );
}
