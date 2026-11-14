/**
 * Kartu Misi (FIGMA_HANDOFF bagian 3): properti `Nama`, `Wahana`, `Peluncuran`,
 * `Status`. Teks berasal dari data (`misi` di content-data.json); null berarti
 * misi belum terisi dan ditampilkan sebagai TBD.
 */
type KartuMisiProps = {
  nama?: string;
  wahana?: string;
  peluncuran?: string;
  status?: string;
  className?: string;
};

export function KartuMisi({
  nama = "TBD",
  wahana = "TBD",
  peluncuran = "TBD",
  status = "TBD",
  className = "",
}: KartuMisiProps) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-card bg-archive-slate-normal p-5 ${className}`}
    >
      <h3 className="font-heading text-xl font-bold text-text-primary-normal">{nama}</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-text-secondary-normal">Wahana</dt>
        <dd className="text-text-primary-normal">{wahana}</dd>
        <dt className="text-text-secondary-normal">Peluncuran</dt>
        <dd className="text-text-primary-normal">{peluncuran}</dd>
        <dt className="text-text-secondary-normal">Status</dt>
        <dd className="text-text-primary-normal">{status}</dd>
      </dl>
    </article>
  );
}
