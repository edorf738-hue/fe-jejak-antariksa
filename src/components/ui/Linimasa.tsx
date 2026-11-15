import { revealUrut } from "./reveal";

/**
 * Linimasa kronologi (menggantikan tabel baris di Panel Kronologi pada Peta Perjalanan): eyebrow dan
 * judul, lalu butir bertanggal pada satu garis vertikal. Tiap butir muncul saat digulir (reveal),
 * titiknya membesar dengan pantulan, dan garis ke butir berikutnya "tergambar" dari atas ke bawah
 * (gerak ala nakala.digital). Desktop: tanggal di kiri, garis di tengah, peristiwa di kanan; mobile:
 * garis di kiri, tanggal di atas peristiwa. Isi dari content-data.json (`kronologi`); tanpa
 * JavaScript semua butir dan garis tetap terlihat.
 */
type LinimasaProps = {
  eyebrow: string;
  judul: string;
  baris: { label: string; nilai: string }[];
  className?: string;
};

export function Linimasa({ eyebrow, judul, baris, className = "" }: LinimasaProps) {
  return (
    <section
      className={`flex min-w-0 flex-col gap-5 break-words rounded-card border border-archive-slate-normal bg-bg-secondary-normal px-5 py-7 md:p-10 ${className}`}
    >
      <p className="text-eyebrow-15 text-aksen-warisan-normal">{eyebrow}</p>
      <h2 className="text-heading-card text-text-primary-normal md:text-heading-section">{judul}</h2>
      <ol className="mt-4 flex flex-col">
        {baris.map((b, i) => (
          <li
            key={`${b.label}-${i}`}
            {...revealUrut(i, 70, 4)}
            className="linimasa-butir grid grid-cols-[28px_1fr] gap-x-3 pb-7 last:pb-0 md:grid-cols-[190px_36px_1fr] md:gap-x-5"
          >
            <span
              aria-hidden="true"
              className="linimasa-rel relative col-start-1 row-span-2 row-start-1 md:col-start-2 md:row-span-1"
            />
            <p className="text-eyebrow-15 col-start-2 uppercase text-aksen-warisan-normal md:col-start-1 md:row-start-1 md:pt-0.5 md:text-right">
              {b.label}
            </p>
            <p className="text-body-large col-start-2 text-text-primary-normal md:col-start-3 md:row-start-1">{b.nilai}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
