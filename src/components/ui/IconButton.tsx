import type { ComponentProps } from "react";
import { Icon, type IconName } from "./Icon";

/**
 * Tombol Ikon (FIGMA_HANDOFF bagian 3): 44x44, bulat, kaca (#111827 @ ~80% +
 * blur 24), garis 1,5 px bertoken. State Default, Hover, Focus.
 * Dipakai untuk Tombol Kembali, Kontrol Scene (Setel Ulang Kamera, Layar Penuh,
 * Jeda Gerak), dan tombol Menu/Tutup Navbar Ringkas.
 *
 * `label` wajib: tombol ikon tanpa teks harus punya nama aksesibel (aria-label).
 */
type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  icon: IconName;
  /** Nama aksesibel, mis. "Kembali ke Beranda". */
  label: string;
  /** Ukuran ikon dalam tombol (grid 24). */
  iconSize?: number;
};

export function IconButton({
  icon,
  label,
  iconSize = 24,
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={[
        "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full",
        "bg-bg-secondary-normal/80 text-text-primary-normal backdrop-blur-[24px]",
        "shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] transition-colors duration-150",
        "hover:bg-archive-slate-normal/90 hover:shadow-[0_0_0_1.5px_var(--color-aksen-informasi-normal)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen-informasi-normal",
        "disabled:cursor-not-allowed disabled:text-text-secondary-dark",
        className,
      ].join(" ")}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
