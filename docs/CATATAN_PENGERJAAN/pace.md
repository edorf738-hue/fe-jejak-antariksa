# Catatan Pengerjaan — Pace (UI per section)

Aturan dan format entri ada di [README.md](README.md). Entri terbaru di atas.

## Entri

### [2026-11-15] Peta Perjalanan (Journey Map), Source, dan Cerita (Pengantar), dari Figma
Tiga butir dikerjakan di tiga branch bertumpuk (`feat/ui-story`, lalu `feat/ui-source`, lalu `feat/ui-journey-map`); entri ini ditulis di branch terakhir dan mencakup ketiganya.
- **Tugas / klaim:** Story Pengantar (butir 4), Journey Map (butir 5), Source (butir 6) di PEMBAGIAN_TUGAS bagian 4
- **Branch / PR:** `feat/ui-story` -> `feat/ui-source` -> `feat/ui-journey-map` / belum dibuka (rebase berurutan setelah fondasi, HUD, Home dimerge)
- **Yang dikerjakan:**
  - **Cerita** `/story`: `PageHeader`, `KartuBab`, daftar 4 bab dari content-data.json (`ringkasan`), tombol "Mulai dari Bab 1" (`/story/1`, belum ada).
  - **Sumber** `/source`: `EntriSumber`, filter kategori (Semua/Referensi/Gambar/Model 3D, client component `SumberDaftar`), catatan verifikasi, tiga kelompok entri, latar arsip.
  - **Peta Perjalanan** `/journey-map` (redirect ke `/journey-map/moon`) dan `/journey-map/[moon|mars|deep-space]`: `PenandaDestinasi` (peta simbolis), Misi Terkait (`KartuMisi` kini sesuai Figma dan bisa dipilih), `PanelBaris` (Detail Misi dan Kronologi), `ItemSumber`, latar peta bintang (`LatarBerulang`, dipakai juga oleh Sumber). Memilih misi mengganti Panel Detail Misi.
  - Pemuat data: `src/data/{story,source,journey}.ts`; `Misi` kini punya field opsional (misi belum lengkap tampil TBD).
  - Perubahan HUD: `ItemSumber` di panel Sumber memakai komponen `ui/ItemSumber` (gaya Figma: baris bergaris bawah); `KartuMisi` di panel Misi Terkait ikut tata letak Figma.
- **File dibuat/diubah:** `src/app/(site)/{story,source,journey-map}/**`, `src/components/ui/{PageHeader,KartuBab,EntriSumber,ItemSumber,KartuMisi,PanelBaris,PenandaDestinasi,LatarBerulang}`, `src/components/hud/PanelKonten.tsx`, `src/data/*`, `public/images/{story,source,journey-map}/**`.
- **Cara menguji:** `npm run lint`, `npm run build`; buka `/story`, `/source`, `/journey-map/moon|mars|deep-space` di 1440, 768, 390 dan bandingkan dengan frame Figma.
- **Hasil uji:** lint dan build lolos. Tinggi halaman build produksi dibandingkan dengan frame Figma: Cerita 1468/1420/1980 (Figma 1460/1412/1972), Peta Perjalanan Moon 3548/4603/6023 (Figma 3548/4603/6023, sama persis), Mars 3286 (sama), tanpa scroll horizontal; posisi header, peta, dan panel cocok. Filter Sumber dan pemilihan misi diuji lewat klik. Belum diuji: Mars dan Deep Space tablet/mobile, frame Source tablet (Figma tidak diambil; mengikuti pola Cerita tablet), keyboard menyeluruh, pembaca layar, perangkat nyata, panel Kosong/Memuat/Galat Journey Map dan Source (frame state belum dibuat).
- **Keputusan teknis & alasan:**
  - Halaman Sumber menampilkan semua 8 `sumber` dari content-data.json sebagai Referensi (Figma draf hanya 3); data jadi acuan sesuai handoff bagian 5a.
  - Kredit Gambar dan Kredit Model 3D belum ada di content-data.json: disalin dari Figma ke `src/data/source.ts` dan **diusulkan masuk ke content-data.json** (Dhika).
  - Pemetaan sumber per tujuan Peta Perjalanan (`INDEKS_SUMBER` di `src/data/journey.ts`) adalah usulan menurut topik; Moon cocok dengan Figma. Perlu dikonfirmasi tim konten.
  - Gambar penanda destinasi di Figma membawa cincin di dalam gambar; dipotong ke lingkaran dalam dan cincinnya dibuat dengan CSS agar state Default/Hover/Selected bisa berganti.
  - Latar Arsip dan Peta Bintang dibuat dari potongan berulang (CSS) mengikuti Figma; handoff menyarankan satu lapisan tetap yang bergerak pelan: belum.
- **Belum selesai / catatan untuk orang lain:**
  - Rute `/story/1..4` dan `/resources/<slug>` belum ada (butir 7): tombol Mulai dari Bab 1, Kartu Bab, dan kartu Beranda masih 404.
  - Animasi (geser pelan latar peta bintang) belum dibuat (butir 8).
  - Kolom "Sumber" pada Panel Detail Misi memakai sumber pertama tujuan; belum ada pemetaan per misi di data.
  - Panel Kronologi punya judul tetap per tujuan (usulan dari handoff bagian 5a), bukan dari data.
  - Gambar header (2000 px) dan latar masih resolusi Figma; hasil generate AI harus dicatat di halaman Source (alat, tanggal, prompt).
- **Status:** Review

### [2026-11-15] Beranda (Home): hero, Pengantar, Pilih Lingkungan, dari Figma
- **Tugas / klaim:** Home (PEMBAGIAN_TUGAS bagian 4, Pace nomor 3)
- **Branch / PR:** `feat/ui-home` (bertumpuk di atas `feat/ui-hud`, yang bertumpuk di atas `feat/ui-fondasi`) / belum dibuka
- **Yang dikerjakan:**
  - Halaman `/` (`src/app/(site)/page.tsx`) dari frame Figma `Home — Desktop` (47:1365), `Home — Tablet` (91:98), `Home — Mobile` (91:144): hero foto + overlay gradien, headline, deskripsi, dua CTA, bagian Pengantar, bagian Pilih Lingkungan (3 kartu), latar Bima Sakti (desktop).
  - Komponen baru `KartuLingkungan` (`src/components/ui/`) dan teks Beranda di `src/data/home.ts` (`HOME_COPY`, `getKartuLingkungan`; nama kategori diambil dari content-data.json).
  - Aset Figma diunduh ke `public/images/` (hero WebP, 3 gambar kartu JPG, logo PNG, latar Bima Sakti WebP hasil ekspor node 137:3805).
  - Penyesuaian komponen fondasi agar cocok Figma: `Button` (tinggi 56, gap 10, garis Secondary memakai Text Secondary), `Navbar` (posisi `absolute`, tanpa fill, 72 px di tablet/mobile, 100 px di desktop, tautan mulai dari garis tengah navbar), `Logo` (kini memakai gambar logo Space Apps Challenge), `IconButton` (prop `tone="outline"` untuk tombol Menu).
- **File dibuat/diubah:** `src/app/(site)/page.tsx`, `src/components/ui/{KartuLingkungan,Button,IconButton,Navbar,Logo,index}`, `src/data/{home,index}.ts`, `public/images/**`.
- **Cara menguji:** `npm run lint`, `npm run build`, buka `/` di 1440, 768, 390 dan bandingkan dengan frame Figma.
- **Hasil uji:** lint dan build lolos. Posisi diukur terhadap Figma di build produksi: desktop hero 849, eyebrow y 318, headline 348, CTA 680, Pengantar 929, Pilih Lingkungan 1190, kartu 404 lebar (selisih 0-2 px); tablet hero 720 dan kartu 334; mobile hero 760 dan kartu 342; tanpa scroll horizontal. Menu Navbar Ringkas diuji buka/tutup. Belum diuji dengan keyboard menyeluruh, pembaca layar, atau perangkat nyata; state hover/focus kartu tidak dicocokkan dengan Figma (hanya ada Default di frame Home).
- **Keputusan teknis & alasan:**
  - Navbar `absolute` (bukan fixed) karena di Figma ia berada di atas hero dan tanpa fill; hero ditarik ke atas dengan margin negatif `--navbar-offset`.
  - Latar Bima Sakti dipasang sebagai satu gambar hasil ekspor (46 bintang, kabut, pita galaksi sudah menyatu), CSS background hanya di `lg` agar tidak diunduh di tablet/mobile; sesuai Figma, hanya frame desktop yang punya latar.
  - Headline "Ditinggal Bukan Berarti Dilupakan" tetap kandidat copy (UI_UX_GUIDELINE bagian 4).
  - Tinggi tombol 56 mengubah Button milik fondasi; tombol ber-ikon (Tombol Panel) tetap padding 20 dan gap 8 sesuai handoff.
- **Belum selesai / catatan untuk orang lain:**
  - Animasi Beranda (Figma punya gerak pada latar Bima Sakti dan bintang) belum dibuat; masuk butir 8. `get_motion_context` belum dipanggil.
  - Tautan CTA dan kartu mengarah ke `/story`, `/journey-map`, `/resources/<slug>` yang belum ada (404 sampai butir 4, 5, 7).
  - Gambar hero (1634x963) dan latar (ekspor 2x) masih resolusi Figma; produksi butuh versi lebih besar (handoff bagian 7). Foto hero: asal dan lisensi belum tercatat (keputusan #9 dan #7), dan semua gambar AI harus dicatat di halaman Source.
  - Kontras eyebrow dan deskripsi hero terhadap foto sudah diperingatkan di handoff bagian 8 (rekomendasi: gelapkan overlay atau pakai Text Primary); belum diubah karena mengikuti Figma.
  - Logo masih PNG hasil ekstrak; minta SVG resmi dari panitia. Posisi logo di desktop kini sejajar tepi dalam navbar (Figma: x=252, catatan handoff menyebut belum sejajar).
  - Menyentuh file bersama `globals.css`? Tidak di entri ini. Mengubah komponen `ui/` fondasi: Dhika perlu diberi tahu.
- **Status:** Review

### [2026-11-15] HUD: kartu, tombol panel, panel, dok, kontrol scene + pemuat data
- **Tugas / klaim:** HUD (PEMBAGIAN_TUGAS bagian 4, Pace nomor 2) dan pemuat data `src/data/`
- **Branch / PR:** `feat/ui-hud` (bertumpuk di atas `feat/ui-fondasi`, rebase setelah fondasi dimerge) / belum dibuka
- **Yang dikerjakan:**
  - `src/components/hud/`: `KartuNarasi`, `KartuDataBenda`, `TombolPanel`, `Panel` + isi panel (`PanelFakta`, `PanelMisi`, `PanelGaleri`, `PanelSumber`, `KartuFakta`, `ItemGaleri`, `ItemSumber`), `DokBab` (stepper 1-4), `DokKategori`, `TombolKembali`, `KontrolScene`. Semua murni presentasi, tanpa Three.js (kontrak bagian 5).
  - `src/data/` (`getDaftarBab`, `getBab`, `getKategori`, `getSumber`, tipe di `types.ts`) membaca `docs/content-data.json` langsung; "TBD" dan null dipertahankan (galeri null jadi kotak "GAMBAR: TBD", misi null jadi kartu TBD).
  - Tambahan di `src/components/ui/`: `KartuMisi`, `IconLink` (Tombol Ikon sebagai tautan), prop `glass` pada `Button`. Tambahan di `globals.css`: utilitas `glass`.
  - Halaman uji `/ui-kit/hud` (kerangka kasar halaman imersif, tanpa Navbar, latar gradien sementara).
- **File dibuat/diubah:** `src/components/hud/*`, `src/data/*`, `src/components/ui/{KartuMisi,IconButton,Button,index}`, `src/app/globals.css`, `src/app/ui-kit/hud/*`, `src/app/(site)/ui-kit/page.tsx` (tautan ke halaman uji).
- **Cara menguji:** `npm run lint`, `npm run build`, lalu buka `/ui-kit/hud` di 1440, 768, 390: buka tiap Tombol Panel, pilih benda, jeda/putar, tutup panel.
- **Hasil uji:** lint dan build lolos; dicek visual di build produksi pada 1440, 768, 390 (tanpa scroll horizontal). Belum diuji dengan keyboard secara menyeluruh atau pembaca layar, belum di perangkat nyata. Fokus panel (focus trap, kembali ke tombol pemicu) belum dikerjakan.
- **Keputusan teknis & alasan:**
  - Panel memakai fill 95% (bukan kaca 70%) agar terbaca saat menutupi scene.
  - Tujuan tombol Sebelumnya/Berikutnya di `DokBab` diberikan lewat props karena Bab 4 berlabel "Daftar Bab" dan kembali ke Cerita.
  - Titik Info (hotspot) tidak dibuat: itu `HotspotLayer` milik Zhafran.
- **Belum selesai / catatan untuk orang lain:**
  - Panel Sumber per scene: `content-data.json` hanya punya satu daftar `sumber` (8 item) tanpa pemetaan ke scene; demo memakai 3 item pertama. Perlu field pemetaan dari Dhika.
  - Ukuran kartu/panel (420 dan 380 lebar maks, padding 24) dan Tombol Panel di mobile (grid yang membungkus) adalah perkiraan; belum dicocokkan dengan Figma. Animasi masuk HUD (butir 8) belum.
  - Zhafran: `KontrolScene` menerima callback `onResetCamera`, `onToggleFullscreen`, `onTogglePause`; perilakunya dipasang di sisi 3D.
  - Menyentuh file bersama `globals.css` (utilitas `glass`): Dhika perlu diberi tahu.
- **Status:** Review

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
