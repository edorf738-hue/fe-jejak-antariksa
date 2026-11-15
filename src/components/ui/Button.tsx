import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { SpecularLayer } from "./SpecularLayer";

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
  /** Kilau spekular WebGL di tepi tombol yang mengikuti kursor (React Bits "SpecularButton"); bentuk dan warna tombol tidak berubah. */
  specular?: boolean;
  /**
   * Animasi "sinyal" untuk tombol utama di hero: denyut cincin 3 kali setelah masuk, kilau menyapu isi,
   * naik 2 px dengan pendar saat hover, dan memantul saat ditekan (CSS di globals.css "Tombol sinyal").
   * Ukuran dan warna tombol tidak berubah; dimatikan saat tombol nonaktif atau gerak dikurangi.
   */
  sinyal?: boolean;
  /** Ukuran kecil (teks 15 px, tinggi 40 px) untuk deretan filter/tab; bentuk dan warna sama. */
  kecil?: boolean;
  /** Kaca bening seperti Navbar (blur, bayangan dalam, cincin cahaya di tepi); Primary = kaca bertint biru (terpilih), Secondary = kaca netral. */
  kaca?: boolean;
  /** Untuk tautan di dalam navigasi (mis. tab kategori, langkah bab). */
  "aria-current"?: "page" | "step" | boolean;
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
  "text-button-label inline-flex min-h-11 select-none items-center justify-center " +
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
      "text-text-primary-normal shadow-[0_0_0_1.5px_var(--color-text-secondary-normal)] " +
      "hover:bg-aksen-informasi-dark/40 hover:shadow-[0_0_0_1.5px_var(--color-aksen-informasi-normal)] " +
      "active:bg-aksen-informasi-dark/60",
    disabled:
      "text-text-secondary-dark shadow-[0_0_0_1.5px_var(--color-archive-slate-normal)]",
  },
};

/** Varian kaca (prop `kaca`): efek Glass Navbar; cincin tepi dari utility `kaca-tepi` (butuh `relative`). */
const KACA: Record<ButtonVariant, string> =
  {
    primary:
      "kaca-tepi relative text-text-primary-normal bg-[#0067b2]/30 shadow-[inset_0_0_10px_rgba(8,11,18,0.45)] [--kaca-blur:12px] [--rim:linear-gradient(135deg,rgba(255,255,255,0.55),rgba(140,190,255,0.16)_50%,rgba(255,255,255,0.5))] hover:bg-[#0067b2]/40",
    secondary:
      "kaca-tepi relative text-text-primary-normal bg-white/[0.06] shadow-[inset_0_0_10px_rgba(8,11,18,0.45)] [--kaca-blur:12px] hover:bg-white/[0.14] active:bg-white/[0.2]",
  };

/** Spinner Loading (Figma): ikon Memuat 20 px (busur 3/4 lingkaran) yang berputar. */
function Spinner() {
  return <Icon name="memuat" size={20} className="shrink-0 animate-spin" />;
}

export function Button({
  variant = "primary",
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  glass = false,
  specular = false,
  sinyal = false,
  kecil = false,
  kaca = false,
  "aria-current": ariaCurrent,
  className = "",
  children,
  href,
  type = "button",
  ...rest
}: ButtonProps & { type?: ButtonHTMLAttributes<HTMLButtonElement>["type"] }) {
  const inactive = disabled || loading;
  // Figma: padding horizontal 32; tombol panel ber-ikon memakai 20 dan gap 8.
  const padding = kecil
    ? "min-h-10! gap-2 px-5 py-2 text-[15px]!"
    : iconLeft || iconRight
      ? "gap-2 px-5 py-4"
      : "gap-[10px] px-8 py-4";
  const animasiSinyal = sinyal && !inactive;
  const classes = [
    BASE,
    padding,
    kaca && !disabled ? KACA[variant] : VARIANTS[variant][disabled ? "disabled" : "enabled"],
    inactive ? "cursor-not-allowed" : "cursor-pointer",
    glass ? "glass" : "",
    // Lapisan kilau diposisikan terhadap tombol; `isolate` menjaga z-index kanvas di dalam tombol.
    specular || animasiSinyal ? "relative isolate" : "",
    animasiSinyal ? "tombol-sinyal" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {specular && <SpecularLayer disabled={inactive} />}
      {animasiSinyal && (
        <>
          {/* Cincin denyut (di luar tepi tombol) dan pita kilau (dipotong di dalam tepi). */}
          <span aria-hidden="true" className="tombol-denyut pointer-events-none absolute inset-0 rounded-pill" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-pill">
            <span className="tombol-kilau absolute inset-y-0 left-0 w-2/5" />
          </span>
        </>
      )}
      {loading ? <Spinner /> : iconLeft && <Icon name={iconLeft} size={20} />}
      <span className={specular || animasiSinyal ? "relative z-[2]" : undefined}>{children}</span>
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
      <Link href={href} aria-current={ariaCurrent} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      type={type}
      aria-current={ariaCurrent}
      disabled={inactive}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
