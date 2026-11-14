import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon, type IconName } from "./Icon";

/**
 * Tombol Ikon (FIGMA_HANDOFF bagian 3): 44x44, bulat, kaca (#111827 @ ~80% +
 * blur 24), garis 1,5 px bertoken. State Default, Hover, Focus.
 * Dipakai untuk Tombol Kembali, Kontrol Scene (Setel Ulang Kamera, Layar Penuh,
 * Jeda Gerak), dan tombol Menu/Tutup Navbar Ringkas.
 *
 * `label` wajib: tombol ikon tanpa teks harus punya nama aksesibel (aria-label).
 * `IconLink` adalah versi tautan (mis. Tombol Kembali).
 */
const ICON_BUTTON_BASE =
  "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full " +
  "text-text-primary-normal transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen-informasi-normal " +
  "disabled:cursor-not-allowed disabled:text-text-secondary-dark";

/**
 * `glass` (default): kaca di atas scene 3D. `outline`: tanpa fill, garis Text
 * Secondary, untuk tombol Menu Navbar Ringkas di atas hero (Figma "Tombol Menu").
 */
export type IconButtonTone = "glass" | "outline";

const TONES: Record<IconButtonTone, string> = {
  glass:
    "bg-bg-secondary-normal/80 backdrop-blur-[24px] shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)] " +
    "hover:bg-archive-slate-normal/90 hover:shadow-[0_0_0_1.5px_var(--color-aksen-informasi-normal)]",
  outline:
    "shadow-[0_0_0_1.5px_var(--color-text-secondary-normal)] " +
    "hover:bg-archive-slate-normal/60 hover:shadow-[0_0_0_1.5px_var(--color-aksen-informasi-normal)]",
};

const iconButtonClass = (tone: IconButtonTone, className: string) =>
  `${ICON_BUTTON_BASE} ${TONES[tone]} ${className}`;

type IconProps = {
  icon: IconName;
  /** Nama aksesibel, mis. "Kembali ke Beranda". */
  label: string;
  /** Ukuran ikon dalam tombol (grid 24). */
  iconSize?: number;
  tone?: IconButtonTone;
};

type IconButtonProps = IconProps &
  Omit<ComponentProps<"button">, "children" | "aria-label">;

export function IconButton({
  icon,
  label,
  iconSize = 24,
  tone = "glass",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={iconButtonClass(tone, className)}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}

type IconLinkProps = IconProps &
  Omit<ComponentProps<typeof Link>, "children" | "aria-label">;

export function IconLink({
  icon,
  label,
  iconSize = 24,
  tone = "glass",
  className = "",
  ...rest
}: IconLinkProps) {
  return (
    <Link aria-label={label} className={iconButtonClass(tone, className)} {...rest}>
      <Icon name={icon} size={iconSize} />
    </Link>
  );
}
