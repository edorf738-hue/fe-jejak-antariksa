# PEMBAGIAN TUGAS — Wayang Antariksa (NASA Hackathon 2026)

**Status:** Usulan awal. Dilengkapi dengan nama PIC yang di `SPRINT.md` masih TBD. Tanggal dan jadwal checkpoint: **TBD** (isi dari jadwal hackathon sebenarnya).
**Dasar:** desain Figma (halaman Prototype), `FIGMA_HANDOFF.md`, `content-data.json`, `SPRINT.md`, `DEVELOPMENT_GUIDELINE.md`.

## 1. Tim dan peran
| Nama | Peran | Fokus |
|---|---|---|
| **Dhika** | Project Manager dan integrator | Menggabungkan (merge) semua kode ke `main`, mereview PR, menjaga jadwal dan prioritas, mengurus keputusan terbuka dan materi dari pihak luar |
| **Edo** | FE 3D — lapisan **scene** | Mesin scene 3D, environment Moon/Mars/Deep Space, kamera, loading dan fallback, performa |
| **Zhafran** | FE 3D — lapisan **objek dan interaksi** | Viewer objek 3D (data benda), hotspot yang mengikuti benda, kontrol scene, hubungan 3D dengan HUD |
| **Pace** | FE antarmuka — **per section** | Semua halaman dan komponen UI di luar 3D (Home, Story, Journey Map, Source, HUD, navigasi) |

Pembagian Edo dan Zhafran adalah usulan; boleh ditukar asal batas antarmukanya (bagian 5) tetap dijaga.
Backend belum ada di daftar tim. Data memakai `docs/content-data.json` sebagai mock (lihat bagian 4, tugas Pace). Jika backend diperlukan, tambahkan PIC di sini.

## 2. Aturan bersama
- **Next.js 16 punya perubahan besar.** Sebelum menulis kode, baca panduan di `node_modules/next/dist/docs/` (lihat `AGENTS.md`).
- **Branch:** `main` hanya diisi lewat PR yang dimerge Dhika. Nama branch: `feat/<fitur>` dan `fix/<bug>`. Commit: `feat: add home hero`, `fix: handle 3d fallback`, `docs: update ...`.
- **PR kecil dan sering** (idealnya satu fitur atau satu section per PR). Cantumkan tujuan, file terdampak, cara menguji, dan screenshot untuk perubahan UI (sesuai `DEVELOPMENT_GUIDELINE.md`).
- **Sumber kebenaran desain:** Figma (halaman Prototype, tiga ukuran: 1440 / 768 / 390) dan `FIGMA_HANDOFF.md`. Jangan mengarang fakta; teks dan data dari `content-data.json`, nilai `TBD` tetap tampil sebagai TBD sampai datanya ada.
- **Jangan commit folder `NASA/` (materi mentah) maupun file `.env`.** Berkas 3D yang dipakai di web ditaruh di tempat yang disepakati (bagian 8, keputusan 3), bukan berkas mentahnya.
- **Aksesibilitas wajib:** semantic HTML, fokus terlihat, area sentuh minimal 44 px, `aria-label` untuk tombol ikon, hormati `prefers-reduced-motion`.
- **Status tugas:** `Todo`, `In Progress`, `Review`, `Done`, `Blocked` (sesuai `SPRINT.md`).

## 3. Pembagian folder (agar tidak bentrok saat merge)
| Folder | Pemilik | Isi |
|---|---|---|
| `src/components/three/scene/` | Edo | Canvas, loader environment, rig kamera, fallback |
| `src/components/three/objects/` | Zhafran | Viewer objek, loader model benda |
| `src/components/three/hotspots/` | Zhafran | Lapisan hotspot, proyeksi 3D ke layar, garis penghubung |
| `src/components/hud/` | Pace | Kartu Narasi, Kartu Data Benda, Tombol Panel, Panel (Fakta/Misi/Galeri/Sumber), Dok Navigasi, Kontrol Scene (tampilan) |
| `src/components/ui/` | Pace | Button, Tombol Ikon, Ikon, Kartu, Navbar, dll. |
| `src/app/` | Pace (halaman); Dhika (integrasi halaman imersif) | Routing dan halaman |
| `src/data/` | Pace | Pemuat data dari `content-data.json` |
| `public/models/`, `public/media/` | Edo dan Zhafran (model), Dhika (aturan ukuran) | Aset siap web |
| `docs/` | Dhika | Dokumen; setiap orang boleh mengusulkan perubahan lewat PR |

File bersama (`package.json`, `globals.css`, `layout.tsx`): ubah lewat PR kecil tersendiri dan beri tahu Dhika.

## 4. Tugas per orang

### Dhika — PM dan integrator
1. Menyiapkan **aturan repo**: branch, template PR, checklist review, dan (bila perlu) CI lint dan build (`npm run lint`, `npm run build`).
2. **Merge PR** ke `main` mengikuti urutan di bagian 7, **hanya setelah pemeriksaan duplikasi dan tumpang tindih di bagian 7a**; menolak PR yang merusak build, melanggar kepemilikan folder, atau berisi pekerjaan yang sudah ada di branch lain.
3. **Integrasi halaman imersif** (Story Bab 1–4 dan Resources): menggabungkan HUD (Pace), scene (Edo), dan hotspot/objek (Zhafran) menjadi satu halaman, lalu QA terhadap Figma.
4. Menjaga **jadwal, prioritas P0/P1/P2**, dan daftar blocker; memimpin checkpoint singkat.
5. Mengurus **keputusan terbuka** (bagian 8) dan **materi dari pihak luar**: berkas logo SVG dari panitia, kredit dan lisensi aset, tanggal akses sumber, model rover, konten yang masih TBD.
6. Menjaga `FIGMA_HANDOFF.md`, `content-data.json`, dan dokumen ini tetap mutakhir.
7. Menyiapkan **build demo stabil** dan membekukan fitur baru sebelum demo.

### Edo — scene 3D
1. **SceneCanvas** (satu komponen untuk semua scene): memuat environment, mengatur renderer, ukuran, dan siklus hidup.
2. **Environment** Moon, Mars, Deep Space dari GLB yang ada (Draco untuk Moon dan Mars; Deep Space tanpa Draco). Moon punya tiga varian per perangkat (desktop/tablet/mobile).
3. **Kamera per breakpoint** memakai kamera dari GLB (16:9, 4:3, 9:16).
4. **Loading, error, dan fallback**: progres muat, gambar statis bila WebGL/model gagal, tidak memuat semua environment sekaligus (lazy load), ganti environment saat berpindah bab atau kategori.
5. **Performa**: ukuran muat, bebas kebocoran memori saat berganti scene, penurunan kualitas di mobile, jeda render saat tab tidak aktif.
6. **Jeda gerak** dan `prefers-reduced-motion` di sisi scene.
7. Mengekspos **API scene** ke Zhafran dan Pace (bagian 5).
8. Uji pointer dan sentuh di scene; catat hasil uji perangkat nyata (belum pernah dilakukan: hanya dites di Chrome headless).
**Selesai bila:** tiga environment tampil di desktop dan mobile dengan loading dan fallback, tanpa error konsol, dan API scene terdokumentasi.

### Zhafran — objek, hotspot, dan kontrol
1. **ObjectViewer** (Objek 3D tanpa card): memuat model benda, kamera bisa diseret untuk memutar, dimuat hanya saat hotspot dibuka, fallback gambar statis. Model yang ada: Apollo Lunar Module, Saturn V, Voyager Probe (B). **Rover Spirit/Opportunity belum ada file** (placeholder "MODEL 3D: TBD" sampai ada).
2. **HotspotLayer**: Titik Info yang mengikuti benda di scene (proyeksi koordinat 3D ke layar tiap frame), state Default/Hover/Aktif/Focus, denyut, dan garis penghubung ke objek.
3. Menyambungkan hotspot ke **Kartu Data Benda** (HUD milik Pace): klik hotspot membuka objek dan kartu deskripsi; berpindah antar hotspot.
4. **Kontrol Scene**: Setel Ulang Kamera, Layar Penuh, Jeda Gerak (tampilan dari Pace, perilaku dari Edo dan Zhafran).
5. **Konversi dan optimasi model** bila perlu: STL lokasi pendaratan Apollo 11 (6,8 MB, tanpa material) ke GLB; pilih salah satu model Voyager (versi "Twin" duplikat dari "(B)" dan tidak terkompresi).
6. **Scene Bab 1** (belum ada aset 3D): sementara gambar konsep statis dengan penanda placeholder.
**Selesai bila:** hotspot tepat di benda saat kamera bergerak, objek bisa diputar dengan mouse dan sentuh, dan semua dapat dipakai lewat keyboard.

### Pace — UI per section
Urutan pengerjaan yang disarankan (dari yang paling dibutuhkan orang lain):
1. **Fondasi:** token warna dan gaya teks (dari Figma), `Button`, `Tombol Ikon`, set ikon (18), `Navbar` dan `Navbar Ringkas` (logo NASA Space Apps Challenge, **bukan** logo NASA), layout dasar 3 breakpoint.
2. **HUD** (dipakai halaman imersif): Kartu Narasi, Kartu Data Benda, Tombol Panel, Panel Fakta/Misi Terkait/Galeri/Sumber, Dok Navigasi Bab (1–4), Dok Kategori (Mars/Moon/Deep Space), Tombol Kembali, Kontrol Scene. Dengan data dari `content-data.json`.
3. **Home:** hero, kartu Pilih Lingkungan, Pengantar.
4. **Story Pengantar:** header, daftar 4 bab, tombol Mulai dari Bab 1.
5. **Journey Map:** peta ikhtisar, daftar misi, panel detail misi (lokasi, kru, fakta, **Panel Kronologi**), sumber untuk Moon/Mars/Deep Space.
6. **Source:** referensi, kredit gambar, kredit model 3D, filter kategori.
7. **Halaman imersif (kerangka):** layout Story Bab 1–4 dan Resources yang menampung HUD; tempat scene dipasang Edo.
8. **Animasi HUD** sesuai spesifikasi di handoff (urutan masuk, denyut, `prefers-reduced-motion`) dan state loading/kosong/galat.
9. **Responsif dan aksesibilitas** di semua halaman; pemuat data `src/data/` berbasis `content-data.json`.
**Selesai bila:** halaman sesuai Figma di 1440/768/390, bisa dinavigasi dengan keyboard, dan tidak ada fakta yang di-hardcode di komponen.

## 5. Kontrak antarmuka 3D ↔ HUD (usulan, disepakati Edo, Zhafran, Pace; Dhika menyetujui)
- **Edo menyediakan** `<SceneCanvas environment="moon|mars|deep-space" />` dan hook `useScene()` yang mengembalikan: referensi kamera, `worldToScreen(posisi3D) → {x, y, terlihat}`, status (`memuat | siap | fallback`), dan fungsi `resetCamera()`, `setPaused(boolean)`.
- **Zhafran menyediakan** `<HotspotLayer anchors={[{id, label, posisi: [x,y,z]}]} activeId onSelect />` dan `<ObjectViewer model="..." />`. Anchor diambil dari data per scene.
- **Pace menyediakan** komponen HUD yang murni presentasi (menerima props dan data), tanpa mengimpor Three.js.
- **Data** yang dipakai bersama: `content-data.json` (bab, hotspot, data benda, misi). Field baru di data diusulkan lewat PR ke Dhika.
- **Fallback:** bila scene gagal, halaman tetap berfungsi dengan gambar statis dan HUD yang sama.

## 6. Prioritas (dari `SPRINT.md`)
- **P0:** navigasi, Home, tiga environment atau fallback, konten inti tiga kategori, Story ringkas, Journey Map dengan misi terverifikasi, Source dan kredit, build demo stabil.
- **P1:** detail misi lebih lengkap, galeri, filter Source, animasi lanjutan.
- **P2:** model 3D tambahan, simulasi, akun, CMS.

## 7. Urutan kerja dan merge (tanpa tanggal; sesuaikan dengan jadwal hackathon)
| Tahap | Edo | Zhafran | Pace | Dhika |
|---|---|---|---|---|
| **0. Setup** | Pilih dan uji library 3D (usul) | Siapkan model dan jalur aset | Token, layout, komponen dasar | Aturan repo, tempat aset, review |
| **1. Fondasi paralel** | SceneCanvas + Moon | ObjectViewer berdiri sendiri (halaman uji) | HUD + Home | Merge tahap 0 |
| **2. Halaman** | Mars dan Deep Space, kamera, fallback | Hotspot (di atas Moon) dan kontrol | Pengantar, Journey Map, Source | Merge per PR kecil |
| **3. Integrasi** | API scene final | Hotspot + objek + kartu data tersambung | Kerangka halaman imersif | **Integrasi Story Bab 1–4 dan Resources**, QA ke Figma |
| **4. Stabilisasi** | Performa, uji perangkat | Uji sentuh dan keyboard | Animasi, responsif, aksesibilitas | Bug bash, isi TBD yang sudah tersedia, build demo |
Aturan merge: PR fondasi (token, komponen, API scene) dimerge **lebih dulu**; halaman imersif hanya diintegrasikan setelah HUD, scene, dan hotspot masing-masing sudah di `main`.

## 7a. Mencegah isi kembar antar branch (Dhika jangan langsung merge)
Tiga anggota bekerja paralel, jadi dua orang bisa tanpa sengaja membuat hal yang sama (komponen, util, model loader, bahkan file yang sama). Dhika **tidak menggabungkan PR begitu saja**; alurnya:

**A. Sebelum mulai (mencegah)**
1. Setiap orang **mengklaim tugas** di tabel klaim di bawah (nama komponen atau halaman, branch, status) sebelum menulis kode. Satu komponen hanya punya satu pemilik.
2. Bila butuh sesuatu milik orang lain (mis. Zhafran butuh tombol dari Pace), **minta lewat Dhika atau pakai versi sementara** di folder sendiri, jangan membuat duplikat di folder bersama. Setelah versi resmi di `main`, versi sementara dihapus.
3. Komponen dasar (`src/components/ui/`, token, ikon) hanya dibuat oleh Pace. Orang lain mengimpor, tidak membuat ulang.
4. Tarik `main` terbaru (`git pull --rebase origin main`) **sebelum mulai dan sebelum membuka PR**, supaya tahu apa yang sudah ada.

**B. Saat review (Dhika memeriksa)**
1. Daftar file tiap branch dan cari yang tumpang tindih:
```bash
git fetch origin
git diff --name-only main...origin/feat/<branch-edo>      > /tmp/edo.txt
git diff --name-only main...origin/feat/<branch-zhafran>  > /tmp/zhafran.txt
git diff --name-only main...origin/feat/<branch-pace>     > /tmp/pace.txt
sort /tmp/edo.txt /tmp/zhafran.txt /tmp/pace.txt | uniq -d   # file yang disentuh lebih dari satu branch
```
2. Cek **isi yang mirip walau nama file berbeda** (komponen kembar, util kembar, loader kembar):
```bash
git diff --stat main...origin/feat/<branch>
grep -rn "export function\|export const" src/components src/lib | sort -k2   # nama ekspor ganda
```
Periksa juga secara manual: dua tombol, dua loader model, dua pemuat data, dua definisi tipe untuk hal yang sama.
3. Uji gabungan sebelum merge: `git merge --no-commit --no-ff origin/feat/<branch>` pada branch sementara, lalu `npm run lint` dan `npm run build`; batalkan dengan `git merge --abort` bila bermasalah.

**C. Saat merge**
1. **Satu PR dalam satu waktu.** Setelah satu PR masuk `main`, anggota lain **rebase** branch mereka ke `main` baru, lalu Dhika memeriksa PR berikutnya. Jangan menggabungkan tiga branch sekaligus.
2. Bila ada isi kembar: **pemilik folder menang** (tabel bagian 3). Pihak lain menghapus miliknya dan mengimpor yang resmi. Bila pemiliknya tidak jelas, Dhika memutuskan dan mencatatnya di tabel klaim.
3. Setelah merge, uji ulang halaman yang terdampak di `main` (bukan hanya di branch), dan bagikan hasilnya ke tim.
4. Jangan merge PR yang berisi perubahan di luar tugasnya (refactor besar, ganti nama massal, format ulang) tanpa persetujuan Dhika.

**Tabel klaim tugas** (isi sebelum mengerjakan; perbarui statusnya):
| Tugas (komponen atau halaman) | Pemilik | Branch | Status |
|---|---|---|---|
| *(contoh)* Tombol Ikon | Pace | `feat/ui-tombol-ikon` | Todo |
| *(contoh)* SceneCanvas | Edo | `feat/scene-canvas` | Todo |
| *(contoh)* HotspotLayer | Zhafran | `feat/hotspot-layer` | Todo |

## 8. Keputusan terbuka dan pemiliknya
| # | Keputusan | Pemilik |
|---|---|---|
| 1 | Library 3D dan stack pendukung (di `DEVELOPMENT_GUIDELINE.md` masih TBD) | Edo dan Zhafran, disetujui Dhika |
| 2 | Perlu backend atau cukup `content-data.json`? | Dhika |
| 3 | Tempat aset 3D yang siap web (`public/models` atau penyimpanan luar). Folder `NASA 3D Resources` sudah dihapus dari repo; berkas ada di riwayat git, mis. `git checkout 54a6227 -- "NASA 3D Resources"` | Dhika |
| 4 | Posisi hotspot: scene Moon/Mars/Deep Space belum memuat model benda (Lunar Module, rover, Voyager). Apakah benda ditempatkan di scene, atau hotspot hanya menandai titik medan dan objek tampil di viewer? | Edo, Zhafran, Dhika |
| 5 | Persetujuan tiga ukuran teks baru dan draf copy | Dhika (bersama tim konten) |
| 6 | Berkas logo NASA Space Apps Challenge versi SVG dari panitia | Dhika |
| 7 | Kredit, lisensi, tanggal akses, dan gambar Galeri | Dhika |
| 8 | Model 3D rover Spirit/Opportunity | Dhika (cari sumber), Zhafran (impor) |
| 9 | Teks hero Home yang berkontras tipis dan lambang NASA pada foto pendarat | Dhika |
| 10 | Perilaku kamera 3D (bebas, terpandu, atau terkunci) dan tombol layar penuh | Edo dan Zhafran |

## 9. Risiko
- **Model berat dan perangkat lemah:** lazy load, varian per perangkat, fallback gambar statis. Belum ada uji GPU nyata.
- **Hotspot tidak sejajar benda** bila kamera berubah: proyeksi dihitung ulang tiap frame; uji di tiga breakpoint.
- **Konflik merge** pada file bersama: patuhi pembagian folder bagian 3.
- **Materi tertunda** (rover, kredit, logo SVG): tampilkan placeholder TBD, jangan menahan integrasi.
- **Ruang lingkup melebar:** tunda P1 dan P2 sebelum P0 stabil.

## 10. Checklist review (Dhika)
- [ ] `npm run lint` dan `npm run build` lolos.
- [ ] Sesuai Figma di 1440 / 768 / 390 (cantumkan screenshot).
- [ ] Tidak ada fakta yang di-hardcode; teks berasal dari data dan nilai TBD tetap TBD.
- [ ] Loading, error, kosong, dan fallback ditangani.
- [ ] Keyboard, fokus terlihat, area sentuh 44 px, `aria-label` pada tombol ikon.
- [ ] **Tidak ada isi kembar dengan branch lain** (cek file tumpang tindih dan ekspor ganda, bagian 7a) dan PR sudah di-rebase ke `main` terbaru.
- [ ] Tugas ada di tabel klaim dan PR tidak membuat ulang komponen milik orang lain.
- [ ] Tidak ada berkas besar atau mentah yang ikut ter-commit; tidak menyentuh folder milik orang lain tanpa koordinasi.
- [ ] Dokumen yang relevan diperbarui.
