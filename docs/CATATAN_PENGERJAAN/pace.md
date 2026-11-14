# Catatan Pengerjaan — Pace (UI per section)

Aturan dan format entri ada di [README.md](README.md). Entri terbaru di atas.

## Entri

### [2026-11-15] Aksesibilitas dan responsif (audit dan perbaikan)
- **Tugas / klaim:** Responsif dan aksesibilitas (PEMBAGIAN_TUGAS bagian 4, Pace nomor 9)
- **Branch / PR:** `pace-dev` (semua pekerjaan Pace bertumpuk di satu branch; sebelumnya `feat/ui-animasi`) / belum dibuka
- **Yang dikerjakan:**
  - **Audit otomatis** (skrip di konsol, iframe pada lebar 320, 768, 1024, 1920) untuk `/`, `/story`, `/story/1`, `/source`, `/journey-map`, `/journey-map/moon`, `/resources/mars`: scroll horizontal, tombol/tautan tanpa nama aksesibel, gambar tanpa alt, id ganda, urutan heading, jumlah `h1` dan `main`, `tabindex` positif, area sentuh < 44 px.
  - **Temuan dan perbaikan:** (1) tautan logo 42 px lebar -> `min-w-11`; (2) tautan URL di Entri Sumber dan Item Sumber 30 px tinggi -> `py-2` (44+); (3) **`loading.tsx` di Peta Perjalanan membuat halaman dirender dengan state Memuat + `h1` ganda** (isi sebenarnya ikut streaming): file itu **dihapus**; `PanelStatus` varian Memuat tetap ada untuk pemakaian nanti.
  - **Focus management panel** (`HalamanImersif`): fokus pindah ke panel saat dibuka, Tab/Shift+Tab dikurung di dalam panel, Escape menutup, fokus kembali ke tombol pemicu (`data-panel`). Panel kini `aria-modal="true"`.
  - **Jeda Gerak otomatis** aktif bila `prefers-reduced-motion` (pengguna tetap bisa mengubahnya).
  - **Tautan lompat** "Lewati ke konten" di layout situs (`#konten`); `role="status"` di Sumber yang mengumumkan jumlah entri hasil filter.
  - **Kontras hero:** eyebrow hero Beranda dan header halaman memakai Text Primary (rekomendasi handoff bagian 8, sebelumnya Text Secondary, terburuk 3,5:1 di atas foto). Ini menyimpang dari Figma.
- **File dibuat/diubah:** `src/components/hud/{HalamanImersif,Panel,TombolPanel}.tsx`, `src/components/ui/{Logo,EntriSumber,ItemSumber,PageHeader}.tsx`, `src/app/(site)/{layout.tsx,page.tsx,source/SumberDaftar.tsx}`; dihapus `src/app/(site)/journey-map/[kategori]/loading.tsx`.
- **Cara menguji:** buka `/resources/mars`, fokuskan tombol Misi Terkait dengan Tab, Enter; Tab berulang tetap di dalam panel; Escape menutup dan fokus kembali ke tombol. Tab dari awal halaman situs menampilkan "Lewati ke konten".
- **Hasil uji:** lint, tsc, dan build lolos. Setelah perbaikan: tanpa area sentuh < 44 px (selain Titik Info yang sedang beranimasi), satu `h1` per halaman, tanpa scroll horizontal di 320 dan 1024, tautan lompat ada. Focus trap dan pengembalian fokus diuji lewat peristiwa keyboard di build produksi (fokus ke panel, Tab dari elemen terakhir dan Shift+Tab dari pertama dicegah keluar, Escape mengembalikan fokus). Kontras dihitung untuk pasangan token di atas latar solid: semua >= 6,6:1 kecuali Text Secondary Dark (disabled) 3,9-5,3:1. **Belum diuji:** pembaca layar sungguhan (VoiceOver/NVDA), perangkat sentuh nyata, mode reduced-motion sungguhan, kontras di atas foto/scene (hasil terburuk handoff belum diukur ulang), navigasi keyboard penuh dari Tab fisik.
- **Keputusan teknis & alasan:**
  - Panel memakai focus trap di semua ukuran layar walau di desktop tidak menutup layar; lebih sederhana dan konsisten, dan aman bagi pengguna keyboard.
  - Halaman 404 dan galat global belum ditambah karena copy belum ada.
- **Belum selesai / catatan untuk orang lain:**
  - Edo dan Zhafran: kanvas 3D harus punya alternatif teks/kontrol keyboard (hotspot sebagai tombol sudah dipenuhi di placeholder `TitikInfoPlaceholder`; HotspotLayer asli perlu mempertahankannya).
  - Menyentuh file bersama `layout.tsx` (grup site) dan komponen `ui/`: Dhika perlu diberi tahu.
  - Uji nyata: pembaca layar dan perangkat sentuh perlu dilakukan sebelum demo.
- **Status:** Review

### [2026-11-15] Animasi (HUD, latar) dan state Kosong/Memuat/Galat
- **Tugas / klaim:** Animasi HUD dan state loading/kosong/galat (PEMBAGIAN_TUGAS bagian 4, Pace nomor 8)
- **Branch / PR:** `feat/ui-animasi` (bertumpuk di atas `feat/ui-imersif`) / belum dibuka
- **Yang dikerjakan:**
  - **Animasi masuk HUD** halaman imersif dari `get_motion_context` Figma (frame Story Bab 1), CSS murni tanpa pustaka (`globals.css`: `hud-masuk`, `hud-titik`, `hud-denyut`, `hud-scene`): scene mengecil 1,07 ke 1 (3 dtk), tombol kembali 0,4/0,5 dtk, kartu narasi 0,3/0,7 dtk (geser dari kiri 40 px di desktop, naik di tablet/mobile), tombol panel 0,5/0,6, dok 0,6/0,6 (naik 40 px), kontrol scene 1,4/0,6, titik info membesar 0,4 ke 1 dengan pantulan, jeda 0,9 + 0,15 per titik, cincin denyut siklus 2 dtk dengan geseran 0,4 dtk per titik, kartu data benda dan objek fade 0,5 dtk saat dibuka, panel geser 60 px dari kanan (desktop) atau 80 px dari bawah (mobile) 0,5 dtk.
  - **Animasi latar:** Peta Perjalanan (`LatarBerulang animasi`): potongan bergeser +-45 px berlawanan arah dan napas opasitas 0,7 ke 1, 24 dtk. Beranda: latar Bima Sakti bergeser (70, 14) px, 16 dtk.
  - **State:** `PanelStatus` (Kosong, Memuat dengan kerangka berdenyut, Galat dengan aksi) memakai copy Figma di `src/data/status.ts`. Dipasang di: `/journey-map` tanpa tujuan (panel Kosong; kini tidak redirect), `journey-map/[kategori]/loading.tsx` (Memuat), `error.tsx` (Galat + Coba Lagi), filter Sumber tanpa hasil (Kosong Source).
  - `prefers-reduced-motion`: semua animasi dimatikan (durasi 0,01 ms, jeda 0, sekali jalan); cincin denyut hanya dipasang lewat `motion-safe:` sehingga tidak muncul.
  - Perbaikan terkait: Navbar tidak lagi membungkus teks di lebar 1024-1279 (tautan rata kanan; tata letak Figma tetap mulai 1280 ke atas).
- **File dibuat/diubah:** `src/app/globals.css`, `src/components/hud/{HalamanImersif,ScenePlaceholder}.tsx`, `src/components/ui/{PanelStatus,LatarBerulang,Navbar,index}`, `src/app/(site)/{page.tsx,journey-map/**,source/SumberDaftar.tsx}`, `src/data/{status,index}.ts`.
- **Cara menguji:** buka `/resources/mars` dan `/story/1` lalu muat ulang; di konsol `document.getAnimations()` menunjukkan nama, jeda, dan durasi tiap animasi. Buka `/journey-map` (state Kosong) dan `/journey-map/moon` (latar bergeser).
- **Hasil uji:** lint dan build lolos. Jeda dan durasi 12 animasi di `/resources/mars` dibaca lewat Web Animations API dan cocok dengan Figma (scene 3 dtk; titik info 0,9/1,05/1,2; denyut 1,5/1,9/2,3 berulang 2 dtk; kembali 0,4/0,5; narasi 0,3/0,7; panel 0,5/0,6; kontrol 1,4/0,6; dok 0,6/0,6); panel terbuka 0/0,5 dtk dengan geseran 60 px; 8 potongan latar peta berdurasi 24 dtk. Belum dilihat langsung gerakannya dalam waktu nyata (hanya parameter yang diverifikasi), belum diuji dengan mode reduced-motion sungguhan atau perangkat nyata, state Memuat dan Galat belum dipicu di browser (hanya lolos build dan tipe).
- **Keputusan teknis & alasan:**
  - CSS murni karena repo belum memakai pustaka gerak dan semua animasi sederhana; pustaka akan menambah ukuran bundel.
  - Latar Bima Sakti di Beranda adalah satu gambar hasil ekspor, jadi pita galaksi, kabut, dan bintang bergeser bersama (di Figma hanya pita yang bergeser dan 23 bintang berkelip sendiri-sendiri, kabut bernapas 0,06-0,14 dan 0,2-0,08). Kelip bintang dan napas kabut belum dibuat.
  - Garis penghubung hotspot (path trim) belum dibuat karena bagian HotspotLayer (Zhafran).
  - Animasi Figma berulang 12 dtk; di web urutan masuk dijalankan sekali, denyut dan latar berulang.
- **Belum selesai / catatan untuk orang lain:**
  - Copy state memakai teks Figma; halaman 404 dan galat global belum ada (copy belum didesain).
  - Navbar: frame Figma hanya 1440, 768, 390; perilaku di 1024-1279 adalah keputusan saya (tautan rata kanan).
  - State 3D Loading dan Fallback (frame State 3D) milik Edo.
  - Menyentuh file bersama `globals.css`: Dhika perlu diberi tahu.
- **Status:** Review

### [2026-11-15] Kerangka halaman imersif: Story Bab 1-4 dan Resources
- **Tugas / klaim:** Halaman imersif (kerangka) (PEMBAGIAN_TUGAS bagian 4, Pace nomor 7)
- **Branch / PR:** `feat/ui-imersif` (bertumpuk di atas `feat/ui-journey-map`) / belum dibuka
- **Yang dikerjakan:**
  - Rute `/story/[bab]` (1-4) dan `/resources/[kategori]` (mars, moon, deep-space) di route group `(imersif)` (tanpa Navbar). Satu komponen client `HalamanImersif` (`src/components/hud/`) menyusun lapisan scene, gradien, HUD, dan panel; state: panel terbuka, benda terpilih, jeda gerak, layar penuh (Fullscreen API), Escape menutup panel.
  - Komponen HUD disesuaikan dengan Figma yang baru terbaca: `KartuNarasi`, `KartuDataBenda` (eyebrow DATA BENDA, baris Kategori/Deskripsi/Fakta + sumber), `Panel` (440x564, tombol Tutup), `DokBab` (Navigasi Bab + tombol bab; Sebelumnya mulai Bab 2), `DokKategori`, `TombolPanel` (tanpa fill), utilitas `glass` (62% + blur 12), Tombol Ikon glass (70% + blur 12, garis Text Secondary), `Button` menerima `aria-current` pada tautan.
  - `src/components/hud/ScenePlaceholder.tsx`: `LatarScene` (gambar + tiga gradien), `Objek3DPlaceholder`, `TitikInfoPlaceholder` (dengan denyut 2 dtk, mati bila `prefers-reduced-motion`), `PenandaPlaceholder`. **Ini pengganti sementara** untuk SceneCanvas (Edo), ObjectViewer dan HotspotLayer (Zhafran).
  - Data: `src/data/imersif.ts` (`getBabImersif`, `getResourcesImersif`, `IMERSIF_COPY`), label bab di `STORY_COPY.labelBab`. Halaman uji `/ui-kit/hud` dihapus (digantikan halaman asli).
- **File dibuat/diubah:** `src/app/(imersif)/**`, `src/components/hud/*`, `src/components/ui/{Button,IconButton}`, `src/app/globals.css`, `src/data/{imersif,story,index}.ts`, `public/images/imersif/bab-1-bumi.webp`.
- **Cara menguji:** `npm run lint`, `npm run build`, buka `/story/1..4` dan `/resources/mars|moon|deep-space` di 1440x900, 768x1024, 390x844; klik titik info, tombol panel, kontrol scene, dok.
- **Hasil uji:** lint dan build lolos. Build produksi diukur terhadap Figma: panel desktop tepat di x 914, y 57, 440x564; kontrol scene bergeser ke x 742 saat panel terbuka; tablet kontrol di x 684, y 152; mobile dok 342 lebar, narasi di bawah, tombol panel dan kontrol di posisi Figma; tanpa scroll horizontal. Belum diuji: Bab 2-4 dan Moon/Deep Space secara visual (data sama), frame panel Fakta/Galeri/Sumber desktop dibandingkan piksel, keyboard menyeluruh, focus trap, pembaca layar, perangkat nyata.
- **Keputusan teknis & alasan:**
  - HUD berada di lapisan selaras konten (padding 24/40/86, maks 1440) dengan jangkar atas/kanan/bawah, bukan posisi piksel dari kiri atas, agar tetap rapi di tinggi layar berbeda.
  - Latar scene memakai gambar yang sama dengan kartu Beranda (Bab 2-4, Resources) dan gambar konsep Figma untuk Bab 1; tanpa efek parallax (overscan 111%) yang ada di Figma.
  - Bab 1 memakai data Moon untuk Misi Terkait, Sumber, dan Fakta (belum ada data khusus Bab 1).
  - Titik Info statis memakai 3 posisi ilustrasi per ukuran layar (bukan posisi benda di scene), karena posisi asli menunggu proyeksi 3D.
- **Belum selesai / catatan untuk orang lain:**
  - Edo dan Zhafran: ganti `LatarScene` / `TitikInfoPlaceholder` / `Objek3DPlaceholder` dengan komponen asli; kontrak props `onResetCamera`, `onTogglePause` di `KontrolScene` tersedia (kini hanya `onTogglePause` dan layar penuh yang tersambung). Garis penghubung hotspot ke objek belum dibuat (bagian HotspotLayer).
  - Fokus: focus trap panel dan pengembalian fokus ke tombol pemicu belum dibuat (butir 9). Animasi masuk HUD (butir 8) belum.
  - Panel Galeri Mars kosong karena content-data.json belum punya galeri Mars ("Belum ada data.").
  - Perilaku kembali (Story ke Cerita, Resources ke Beranda) masih usulan tim.
- **Status:** Review

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
