"use client";

import { IconButton } from "@/components/ui";

/**
 * Kontrol Scene (tampilan): hanya Layar Penuh. Setel Ulang Kamera dan Jeda Gerak dihapus atas permintaan (Jeda Gerak tetap
 * otomatis aktif bila pengguna memilih prefers-reduced-motion, diatur HalamanImersif). Kolom kecil di tepi layar.
 */
type KontrolSceneProps = {
  onToggleFullscreen?: () => void;
  className?: string;
};

export function KontrolScene({ onToggleFullscreen, className = "" }: KontrolSceneProps) {
  return (
    <div role="group" aria-label="Kontrol scene" className={`flex flex-col gap-3 ${className}`}>
      <IconButton icon="layar-penuh" label="Layar penuh" onClick={onToggleFullscreen} />
    </div>
  );
}
