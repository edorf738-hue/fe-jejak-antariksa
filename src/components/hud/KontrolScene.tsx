"use client";

import { IconButton, useLang } from "@/components/ui";
import { HUD } from "@/lib/ui-copy";

/**
 * Kontrol Scene (tampilan): hanya Layar Penuh. Setel Ulang Kamera dan Jeda Gerak dihapus atas permintaan (Jeda Gerak tetap
 * otomatis aktif bila pengguna memilih prefers-reduced-motion, diatur HalamanImersif). Kolom kecil di tepi layar.
 */
type KontrolSceneProps = {
  onToggleFullscreen?: () => void;
  className?: string;
};

export function KontrolScene({ onToggleFullscreen, className = "" }: KontrolSceneProps) {
  const h = HUD[useLang()];
  return (
    <div role="group" aria-label={h.kontrolScene} className={`flex flex-col gap-3 ${className}`}>
      <IconButton icon="layar-penuh" label={h.layarPenuh} onClick={onToggleFullscreen} />
    </div>
  );
}
