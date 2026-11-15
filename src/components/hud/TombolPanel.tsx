import { Button } from "@/components/ui";
import type { IconName } from "@/components/ui";
import { useLang } from "@/components/ui";
import { HUD } from "@/lib/ui-copy";

/**
 * Tombol Panel di scene: Button Secondary kaca dengan `Ikon Kiri`.
 * Fakta = Info, Misi Terkait = Misi, Galeri = Galeri, Sumber = Sumber.
 * Jangan beri overflow-hidden pada pembungkusnya (garis tombol di luar bingkai).
 */
export type PanelJenis = "fakta" | "misi" | "galeri" | "sumber";

export const PANEL_META: Record<PanelJenis, { icon: IconName }> = {
  fakta: { icon: "info" },
  misi: { icon: "misi" },
  galeri: { icon: "galeri" },
  sumber: { icon: "sumber" },
};

type TombolPanelProps = {
  jenis: PanelJenis;
  /** Panel ini sedang terbuka. */
  aktif?: boolean;
  onClick?: () => void;
  className?: string;
};

export function TombolPanel({ jenis, aktif = false, onClick, className }: TombolPanelProps) {
  const { icon } = PANEL_META[jenis];
  const label = HUD[useLang()].panel[jenis];
  return (
    <Button
      variant="secondary"
      iconLeft={icon}
      onClick={onClick}
      data-panel={jenis}
      aria-pressed={aktif}
      className={className}
    >
      {label}
    </Button>
  );
}
