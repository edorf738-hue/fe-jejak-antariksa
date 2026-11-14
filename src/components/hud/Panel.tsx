import type { ReactNode } from "react";
import { IconButton } from "@/components/ui";

/**
 * Panel kaca (Fakta, Misi Terkait, Galeri, Sumber). Di desktop berada di kanan
 * scene; di tablet dan mobile penuh lebar menutupi scene. Penempatan (absolute
 * atau fixed) diatur oleh halaman yang memakainya. Fill 95% (lebih pekat dari
 * kartu kaca biasa) agar teks tetap terbaca saat menutupi scene dan dok. Tombol Tutup memanggil `onTutup`.
 */
type PanelProps = {
  judul: string;
  onTutup: () => void;
  children: ReactNode;
  className?: string;
};

export function Panel({ judul, onTutup, children, className = "" }: PanelProps) {
  const headingId = `panel-${judul.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      className={`flex max-h-full w-full flex-col gap-5 rounded-card bg-bg-secondary-normal/95 p-6 backdrop-blur-[24px] shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] md:w-[420px] ${className}`}
    >
      <header className="flex items-center justify-between gap-4">
        <h2 id={headingId} className="text-heading-card text-text-primary-normal">
          {judul}
        </h2>
        <IconButton icon="tutup" label={`Tutup panel ${judul}`} onClick={onTutup} />
      </header>
      <div className="flex flex-col gap-4 overflow-y-auto">{children}</div>
    </aside>
  );
}
