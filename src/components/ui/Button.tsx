import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

/**
 * Button (FIGMA_HANDOFF bagian 3): `Tipe` Primary/Secondary dan `State`
 * Default, Hover, Active, Focus, Disabled, Loading. Bentuk pill, label Inter Bold 20.
 * Properti `Ikon Kiri` / `Ikon Kanan` di Figma menjadi `iconLeft` / `iconRight`.
 *
 * Catatan: garis Secondary berada di luar bingkai (OUTSIDE di Figma), jadi
 * dibuat dengan ring (box-shadow), bukan border. Jangan beri `overflow-hidden`
 * pada pembungkus tombol agar garisnya tidak terpotong.
 */
type ButtonVariant = "primary" | "secondary";

type ButtonOwnProps = {
  variant?: ButtonVariant;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Menampilkan spinner dan menonaktifkan klik. */
  loading?: boolean;
  disabled?: boolean;
  /** Fill kaca + blur, untuk tombol yang berada di atas scene 3D (Tombol Panel, Dok). */
  glass?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonOwnProps & {
  /** Bila diisi, tombol dirender sebagai tautan (next/link). */
  href: string;
  onClick?: undefined;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE =
  "text-button-label inline-flex min-h-12 select-none items-center justify-center gap-2 " +
  "rounded-pill transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen-informasi-normal";

const VARIANTS: Record<ButtonVariant, { enabled: string; disabled: string }> = {
  primary: {
    enabled:
      "bg-aksen-informasi-normal text-bg-primary-normal " +
      "hover:bg-aksen-informasi-normal-hover active:bg-aksen-informasi-normal-active",
    disabled: "bg-archive-slate-normal text-text-secondary-dark",
  },
  secondary: {
    enabled:
      "text-text-primary-normal shadow-[0_0_0_1.5px_var(--color-aksen-informasi-normal)] " +
      "hover:bg-aksen-informasi-dark/40 hover:shadow-[0_0_0_1.5px_var(--color-aksen-informasi-normal-hover)] " +
      "active:bg-aksen-informasi-dark/60",
    disabled:
      "text-text-secondary-dark shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)]",
  },
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export function Button({
  variant = "primary",
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  glass = false,
  className = "",
  children,
  href,
  type = "button",
  ...rest
}: ButtonProps & { type?: ButtonHTMLAttributes<HTMLButtonElement>["type"] }) {
  const inactive = disabled || loading;
  const padding = iconLeft || iconRight ? "px-5" : "px-8";
  const classes = [
    BASE,
    padding,
    VARIANTS[variant][disabled ? "disabled" : "enabled"],
    inactive ? "cursor-not-allowed" : "cursor-pointer",
    glass ? "glass" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {loading ? <Spinner /> : iconLeft && <Icon name={iconLeft} size={20} />}
      <span>{children}</span>
      {!loading && iconRight && <Icon name={iconRight} size={20} />}
    </>
  );

  if (href !== undefined) {
    if (inactive) {
      // Tautan tidak punya atribut disabled: pakai aria-disabled dan tanpa navigasi.
      return (
        <span
          role="link"
          aria-disabled="true"
          aria-busy={loading || undefined}
          className={classes}
        >
          {content}
        </span>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      disabled={inactive}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
