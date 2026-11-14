"use client";

import { IconButton } from "@/components/ui";

/**
 * Kontrol Scene (tampilan): Setel Ulang Kamera, Layar Penuh, Jeda Gerak.
 * Desktop: baris; tablet dan mobile: kolom di tepi kanan. Perilaku (kamera,
 * fullscreen, jeda) dipasang oleh pemanggil lewat callback (Edo dan Zhafran);
 * komponen ini hanya tampilan. `paused` mengganti ikon Jeda/Putar dan label.
 * Jeda harus otomatis aktif bila `prefers-reduced-motion` (diatur pemanggil).
 */
type KontrolSceneProps = {
  paused?: boolean;
  onResetCamera?: () => void;
  onToggleFullscreen?: () => void;
  onTogglePause?: () => void;
  className?: string;
};

export function KontrolScene({
  paused = false,
  onResetCamera,
  onToggleFullscreen,
  onTogglePause,
  className = "",
}: KontrolSceneProps) {
  return (
    <div role="group" aria-label="Kontrol scene" className={`flex flex-col gap-3 lg:flex-row ${className}`}>
      <IconButton icon="setel-ulang-kamera" label="Setel ulang kamera" onClick={onResetCamera} />
      <IconButton icon="layar-penuh" label="Layar penuh" onClick={onToggleFullscreen} />
      <IconButton
        icon={paused ? "putar" : "jeda"}
        label={paused ? "Putar gerak" : "Jeda gerak"}
        aria-pressed={paused}
        onClick={onTogglePause}
      />
    </div>
  );
}
