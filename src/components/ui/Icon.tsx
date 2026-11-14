import type { ReactNode, SVGProps } from "react";

/**
 * Set ikon (FIGMA_HANDOFF bagian 3): grid 24 px, garis 1,5 px, ujung dan
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
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  peringatan: <path d="M12 4l9 16H3zM12 10v4M12 17h.01" />,
  cari: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  "setel-ulang-kamera": <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4.5V9H8" />,
  "layar-penuh": <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  putar: <path d="M8 5l11 7-11 7z" />,
  jeda: <path d="M8 5v14M16 5v14" />,
  misi: (
    <>
      <path d="M12 3c3 2.5 4.5 6 4.5 9.5L12 17l-4.5-4.5C7.5 9 9 5.5 12 3zM7.5 12.5L5 15l2 1M16.5 12.5L19 15l-2 1M10 19.5l2 2 2-2" />
      <circle cx="12" cy="10" r="1.5" />
    </>
  ),
  sumber: <path d="M6 4h9l3 3v13H6zM15 4v3h3M9 12h6M9 16h6" />,
  galeri: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M4 17l5-5 4 4 3-3 4 4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

/** Daftar nama ikon (dipakai halaman ui-kit dan untuk iterasi). */
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
