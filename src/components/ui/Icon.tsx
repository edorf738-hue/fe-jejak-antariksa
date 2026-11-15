import type { ReactNode, SVGProps } from "react";

/**
 * Set ikon (FIGMA_HANDOFF bagian 3; jalur SVG sama dengan komponen Ikon di Figma, 19 ikon): grid 24 px, garis 1,5 px, ujung dan
 * sambungan membulat. Warna mengikuti `currentColor` (default Text Primary).
 */
const ICONS = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  tutup: <path d="M6 6l12 12M18 6L6 18" />,
  "panah-kiri": <path d="M19 12H5M11 6l-6 6 6 6" />,
  "panah-kanan": <path d="M5 12h14M13 6l6 6-6 6" />,
  "panah-atas": <path d="M12 19V5M6 11l6-6 6 6" />,
  "panah-bawah": <path d="M12 5v14M6 13l6 6 6-6" />,
  "tautan-keluar": (
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </>
  ),
  peringatan: (
    <>
      <path d="M12 3.5l9.5 16.5h-19z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  cari: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20 20" />
    </>
  ),
  "setel-ulang-kamera": <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />,
  "layar-penuh": <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />,
  putar: <path d="M8 5l11 7-11 7z" />,
  jeda: <path d="M8 5v14M16 5v14" />,
  misi: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  sumber: <path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h6M9 16h6" />,
  galeri: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M3 17l5-5 4 4 3-3 6 6" />
    </>
  ),
  "model-3d": <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" />,
  memuat: <path d="M12 3a9 9 0 1 0 9 9" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/** Daftar nama ikon (untuk iterasi). */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

type IconProps = Omit<SVGProps<SVGSVGElement>, "name" | "children"> & {
  name: IconName;
  /** Ukuran piksel (grid 24). Kartu Bab memakai 32, tautan kartu 20. */
  size?: number;
  /**
   * Nama aksesibel. Kosongkan untuk ikon dekoratif (disembunyikan dari
   * pembaca layar). Ikon yang berdiri sendiri sebagai tombol harus diberi
   * nama lewat `aria-label` pada tombolnya (lihat IconButton).
   */
  title?: string;
};

export function Icon({ name, size = 24, title, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
}
