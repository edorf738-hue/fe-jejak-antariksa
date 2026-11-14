# Catatan Pengerjaan — Pace (UI per section)

Aturan dan format entri ada di [README.md](README.md). Entri terbaru di atas.

## Entri

### [2026-11-14] Fondasi UI: token, font, Button, Tombol Ikon, ikon, Navbar, layout dasar
- **Tugas / klaim:** Fondasi UI (PEMBAGIAN_TUGAS bagian 4, Pace nomor 1)
- **Branch / PR:** `feat/ui-fondasi` / belum dibuka
- **Yang dikerjakan:**
  - Token warna (8 family x 10 level, 80 nilai) dan 11 text style dari FIGMA_HANDOFF bagian 2, di `globals.css` (`@theme static`, supaya semua `var(--color-*)` selalu tersedia untuk Edo dan Zhafran).
  - Font Space Grotesk, Rajdhani, Inter lewat `next/font/google` (self-host).
  - `Button` (Primary/Secondary; Default, Hover, Active, Focus, Disabled, Loading; `iconLeft`/`iconRight`; bisa jadi tautan lewat `href`), `IconButton` (Tombol Ikon, `label` wajib untuk aria-label), `Icon` (17 ikon, grid 24, garis 1,5).
  - `Navbar` (desktop) dan Navbar Ringkas (di bawah 1024, menu buka/tutup, Escape menutup, tertutup otomatis saat pindah halaman), `Logo` placeholder.
  - Layout dasar: `Container` (padding 24/40/86, maks 1440), variabel `--section-gap` 40/48/56, route group `(site)` berisi Navbar.
  - Halaman acuan `/ui-kit` (palet, text style, komponen, ikon) dan Home placeholder.
- **File dibuat/diubah:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(site)/` (layout, page, ui-kit), `src/components/ui/` (Button, IconButton, Icon, Navbar, Logo, Container, index).
- **Cara menguji:** `npm run lint`, `npm run build`, `npm run dev`; buka `/` dan `/ui-kit` di lebar 1440, 768, 390.
- **Hasil uji:** lint dan build lolos. Dicek manual di browser (build produksi): desktop 1440 dan mobile 390, menu mobile buka/tutup, Escape. Tablet 768 belum dicek visual. Belum diuji di perangkat nyata, belum diuji dengan pembaca layar. Dev server di panel browser gagal hidrasi karena websocket HMR diblokir, jadi interaksi diuji lewat build produksi.
- **Keputusan teknis & alasan:**
  - Nama token mengikuti usulan handoff: `--color-<family>-<level>` (mis. `text-text-primary-normal-hover`, `bg-aksen-informasi-normal`).
  - Navbar penuh mulai breakpoint `lg` (1024); tablet 768 memakai Navbar Ringkas sesuai Figma.
  - Garis Secondary dan Tombol Ikon memakai ring (box-shadow), bukan border, mengikuti catatan garis OUTSIDE di handoff.
  - Warna state hover/active Button dan Tombol Ikon diambil dari level token yang berdekatan; handoff tidak merinci nilainya, jadi perlu dicocokkan dengan Figma.
  - Fill pill aktif navbar memakai `#0067b2` @ 20% mentah (belum jadi token di Figma).
- **Belum selesai / catatan untuk orang lain:**
  - Logo masih placeholder "SA"; menunggu SVG dari panitia (keputusan terbuka nomor 6).
  - Rute `/story`, `/journey-map`, `/source` belum ada (tautan navbar 404 sampai halamannya dibuat).
  - Handoff menyebut 17 ikon, PEMBAGIAN_TUGAS menyebut 18; yang dibuat 17 sesuai daftar nama di handoff.
  - Ukuran teks bertanda "usulan" (Hero 36, Section 48, Card 32) belum disetujui designer.
  - Ukuran/padding Button (tinggi min 48, padding 32 atau 20 bila ada ikon) dan kaca Tombol Ikon belum dicocokkan piksel-per-piksel dengan Figma (Figma MCP belum terhubung).
  - Mengubah file bersama `globals.css` dan `layout.tsx`: Dhika perlu diberi tahu.
- **Status:** Review
