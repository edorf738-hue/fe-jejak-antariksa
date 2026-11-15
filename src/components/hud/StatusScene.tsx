import { useEffect, useRef } from "react";
import { STATUS_COPY } from "@/data";
import { Button, PanelStatus } from "@/components/ui";

/**
 * State scene 3D di atas scene (FIGMA State 3D): "1 Loading" dan "6 Fallback".
 *  - `OverlayMemuat3D`: gambar latar diredam (Bg Primary 65%), spinner putus-putus 56 px,
 *    judul 32, bilah kemajuan 360x6, keterangan. Tanpa `progres`, bilah bergerak bolak-balik.
 *  - `PesanFallback3D`: kartu 640 px (PanelStatus galat) dengan Coba Lagi dan Lanjut tanpa 3D,
 *    di atas gambar statis.
 */
export function OverlayMemuat3D({ progres = null, className = "" }: { progres?: number | null; className?: string }) {
  const nilai = progres === null ? null : Math.min(1, Math.max(0, progres));
  const { judul, isi } = STATUS_COPY.scene3dMemuat;
  return (
    <div
      role="status"
      aria-busy="true"
      className={`flex flex-col items-center justify-center bg-bg-primary-normal/65 px-6 text-center ${className}`}
    >
      <svg viewBox="0 0 56 56" className="size-14 text-aksen-informasi-normal motion-safe:animate-spin" fill="none" aria-hidden="true">
        <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="4" strokeDasharray="10 6" />
      </svg>
      <p className="text-heading-card mt-[22px] text-text-primary-normal">{judul}</p>
      <div
        role="progressbar"
        aria-label={judul}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={nilai === null ? undefined : Math.round(nilai * 100)}
        className="relative mt-[30px] h-1.5 w-[360px] max-w-full overflow-hidden rounded-[3px] bg-archive-slate-normal"
      >
        <span
          className={`absolute inset-y-0 left-0 rounded-[3px] bg-aksen-informasi-normal ${nilai === null ? "w-[40%] motion-safe:progres-luncur" : ""}`}
          style={nilai === null ? undefined : { width: `${nilai * 100}%` }}
        />
      </div>
      <p className="text-body-large mt-6 text-text-secondary-normal">{isi}</p>
    </div>
  );
}

export function PesanFallback3D({
  onCobaLagi,
  onLanjut,
  className = "",
}: {
  onCobaLagi: () => void;
  onLanjut: () => void;
  className?: string;
}) {
  const { judul, isi, cobaLagi, lanjut } = STATUS_COPY.scene3dFallback;
  const aksi = useRef<HTMLDivElement>(null);
  // Pesan galat muncul tiba-tiba: pindahkan fokus ke aksi utama (Coba Lagi) agar terjangkau keyboard.
  useEffect(() => {
    aksi.current?.querySelector("button")?.focus();
  }, []);
  return (
    <div className={`pointer-events-none flex items-center justify-center px-6 ${className}`}>
      <PanelStatus
        varian="galat"
        judul={judul}
        isi={isi}
        className="pointer-events-auto max-w-[640px] min-h-0! px-10! py-9!"
        aksi={
          <div ref={aksi} className="flex flex-wrap justify-center gap-4">
            <Button onClick={onCobaLagi}>
              {cobaLagi}
            </Button>
            <Button variant="secondary" onClick={onLanjut}>
              {lanjut}
            </Button>
          </div>
        }
      />
    </div>
  );
}
