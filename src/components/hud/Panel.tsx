import type { ReactNode } from "react";
import { Button } from "@/components/ui";

/**
 * Panel (Fakta, Misi Terkait, Galeri, Sumber) di atas scene. Figma: lebar 440, tinggi 564,
 * padding 28, radius 28, fill #111827 @ 78% + blur 14, garis 1,5 px Aksen Informasi;
 * judul 32/40 dan tombol Tutup (Secondary) sebaris; isi bisa digulir. Di tablet dan
 * mobile panel penuh menutupi scene. Penempatan diatur oleh halaman yang memakainya.
 * Fokus dipindahkan ke panel saat dibuka, dikurung di dalamnya (Tab), dan dikembalikan ke
 * tombol pemicu saat ditutup: semuanya diatur `HalamanImersif`.
 */
type PanelProps = {
  judul: string;
  onTutup: () => void;
  /** Label tombol Tutup. */
  labelTutup?: string;
  /** Pilihan isi (tab) di bawah judul. */
  tab?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ judul, onTutup, labelTutup = "Tutup", tab, children, className = "" }: PanelProps) {
  const headingId = `panel-${judul.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      tabIndex={-1}
      className={`flex w-full flex-col gap-4 overflow-hidden rounded-[28px] border-[1.5px] border-aksen-informasi-normal bg-[rgba(15,23,42,0.7)] shadow-[0_16px_48px_rgba(0,0,0,0.4)] outline-none p-7 backdrop-blur-[14px] ${className}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-4">
        <h2 id={headingId} className="text-heading-card text-text-primary-normal">
          {judul}
        </h2>
        <Button variant="secondary" onClick={onTutup} aria-label={`${labelTutup} panel ${judul}`}>
          {labelTutup}
        </Button>
      </header>
      {tab}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">{children}</div>
    </aside>
  );
}
