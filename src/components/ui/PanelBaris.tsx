/**
 * Panel dengan daftar baris label-nilai (Panel Detail Misi dan Panel Kronologi di
 * Peta Perjalanan): eyebrow, judul, lalu baris dengan garis bawah. Label selebar 220
 * (120 di mobile). Nilai kosong ditampilkan sebagai TBD oleh pemanggil.
 */
type PanelBarisProps = {
  eyebrow: string;
  judul: string;
  baris: { label: string; nilai: string }[];
  className?: string;
};

export function PanelBaris({ eyebrow, judul, baris, className = "" }: PanelBarisProps) {
  return (
    <section
      className={`flex min-w-0 flex-col gap-5 break-words rounded-card border border-archive-slate-normal bg-bg-secondary-normal px-5 py-7 md:p-10 ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{eyebrow}</p>
      <h2 className="text-heading-card text-text-primary-normal md:text-heading-section">{judul}</h2>
      <dl className="flex flex-col gap-5">
        {baris.map((b, i) => (
          <div
            key={`${b.label}-${i}`}
            className="text-body-large flex gap-4 border-b border-archive-slate-normal py-2.5 md:gap-6"
          >
            <dt className="w-[120px] shrink-0 text-text-secondary-normal md:w-[220px]">{b.label}</dt>
            <dd className="min-w-0 flex-1 text-text-primary-normal">{b.nilai}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
