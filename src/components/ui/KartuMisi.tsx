import type { ReactNode } from "react";
import { reveal } from "./reveal";

/**
 * Kartu Misi (FIGMA_HANDOFF bagian 3): properti `Nama`, `Wahana`, `Peluncuran`,
 * `Status`; state Default, Hover, Focus. Dipakai di Peta Perjalanan (Misi Terkait)
 * dan panel Misi Terkait di halaman imersif. Teks berasal dari data (`misi` di
 * content-data.json); null berarti misi belum terisi dan tampil sebagai TBD.
 * Bila `onPilih` diberikan, kartu menjadi tombol pilihan (`terpilih` = state Hover/Selected:
 * fill Archive Slate, garis 2 px Aksen Informasi Hover).
 */
type KartuMisiProps = {
  nama?: string;
  wahana?: string;
  peluncuran?: string;
  status?: string;
  terpilih?: boolean;
  onPilih?: () => void;
  /** Bila diisi (ms), kartu muncul saat masuk layar dengan jeda ini (lihat reveal.ts). */
  delay?: number;
  className?: string;
};

export function KartuMisi({
  nama = "TBD",
  wahana = "TBD",
  peluncuran = "TBD",
  status = "TBD",
  terpilih = false,
  onPilih,
  delay,
  className = "",
}: KartuMisiProps) {
  const gerak = delay === undefined ? {} : reveal(delay);
  const isi: ReactNode = (
    <>
      <span className="text-eyebrow-15 text-aksen-warisan-normal">MISI</span>
      <span className="text-heading-card text-text-primary-normal">{nama}</span>
      <span className="text-body-large text-text-secondary-normal">Wahana: {wahana}</span>
      <span className="text-body-large text-text-secondary-normal">Peluncuran: {peluncuran}</span>
      <span className="text-body-large text-text-secondary-normal">Status: {status}</span>
    </>
  );
  const kelas = `flex w-full flex-col items-start gap-3 break-words rounded-card p-7 text-left transition-[box-shadow,translate] duration-300 ease-(--ease-out-soft) ${
    onPilih ? "hover:-translate-y-1" : ""
  } ${
    terpilih
      ? "bg-archive-slate-normal ring-2 ring-inset ring-aksen-informasi-normal-hover"
      : "bg-bg-secondary-normal ring-1 ring-inset ring-archive-slate-normal hover:ring-aksen-informasi-dark"
  } ${className}`;

  if (onPilih) {
    return (
      <button type="button" onClick={onPilih} aria-pressed={terpilih} className={`${kelas} cursor-pointer`} {...gerak}>
        {isi}
      </button>
    );
  }
  return (
    <article className={kelas} {...gerak}>
      {isi}
    </article>
  );
}
