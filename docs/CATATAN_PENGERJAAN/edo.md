# Catatan Pengerjaan — Edo (3D scene)

Aturan dan format entri ada di [README.md](README.md). Entri terbaru di atas.


## 2026-11-15: Konten FE dibaca dari backend (snapshot API)
- Konten bab cerita, benda 3D beserta media popup, galeri, dan katalog Sumber dipindah ke backend Jejak Antariksa (`/api/v1/chapters`, `scene-objects`, `galleries`, `source-catalog`).
- FE membaca snapshot `src/data/api/*.json` lewat `src/data/api.ts`. `npm run data:sync` memperbarui snapshot dari API (jalan otomatis sebelum build bila `API_URL` diatur; bila API mati, snapshot yang di-commit dipakai).
- Keluaran `getCerita`, `MEDIA_BENDA`, `GALERI_FOTO`, dan `getKatalogSumber` sama persis dengan sebelumnya (dibandingkan dengan dump JSON). `benda-tambahan.ts` dihapus (isinya ada di BE).
- Peta Perjalanan (`journey.ts`, area Zhafran), narasi bab, dan kategori juga dari API (`/api/v1/journeys`, `chapters`). `content.ts` dan `journey.ts` kini hanya membaca snapshot; `content-data.json` tidak diimpor lagi (keluaran fungsi sama persis, dibandingkan dengan dump JSON). Zhafran dan Dhika perlu tahu: edit konten di BE, bukan di `content-data.json`.

## Entri

### [2026-11-15] Penggabungan `integrasi/gabungan`, backend API, dan verifikasi kredit Voyager
- **Tugas / klaim:** menyatukan 3D/Cerita/Sumber (Edo) dengan Beranda, Peta Perjalanan, navbar, tombol, dan animasi reveal (Zhafran); memindahkan konten FE ke backend; memverifikasi kredit aset Voyager.
- **Branch / PR:** FE `integrasi/gabungan` (sudah di-push, belum PR); BE `feat/api-readonly-awal` di `be-wayang-antariksa` (sudah di-push, belum PR).
- **Yang dikerjakan:** (1) FE: tombol halaman 3D memakai gaya kaca Zhafran; objek Bulan diberi slot sendiri agar tidak bertumpuk; GSAP dibuang (tween kamera sendiri). (2) BE: API read-only (`chapters`, `scene-objects`, `source-catalog`, `journeys`, `galleries`, plus resource lama), `stories` dan `sources` dihapus (digantikan), tes paginasi dan validasi. (3) FE membaca snapshot `src/data/api/*.json` hasil `npm run data:sync` (otomatis sebelum build bila `API_URL` diatur; tanpa itu snapshot yang di-commit dipakai); `content-data.json` tidak diimpor lagi. (4) Verifikasi 23 halaman NASA Voyager (`docs/VERIFIKASI_VOYAGER.md` di repo BE): 7 dari 8 foto Voyager dicocokkan dengan halaman NASA lewat perbandingan piksel; kredit, URL, dan tanggal akses 15 November 2026 dicatat di katalog.
- **Hasil uji:** `tsc`, `eslint`, `npm run build` lolos; semua rute 200 di EN dan ID, rute tak dikenal 404, tanpa teks Indonesia nyasar di mode English; tes BE lolos; simulasi merge ke `dev` dan `main` tanpa konflik.
- **Belum / perlu keputusan:** foto Jupiter dan Bintik Merah Besar serta diagram penjelasan sampul Golden Record belum ditemukan halaman asalnya (tetap perlu verifikasi); Voyager Probe (A) di NASA berlabel misi "Viking 1" (dipakai sebagai model umum); revisi aset 3D (Moon/Mars 360 derajat, ketajaman) dan model Mars yang kurang masih tertunda; hosting BE belum ditentukan (`/assets` BE membaca folder di luar repo); terjemahan English katalog Sumber harus ikut diperbarui tiap teks BE berubah.
- **Deploy (2026-11-15):** FE tayang di Vercel (project `jejak-antariksa`, produksi dari `main`): https://jejak-antariksa.vercel.app . Rute dan scene 3D dicek di versi live. Backend belum di-deploy (FE tidak membutuhkannya; perlu penyesuaian untuk Vercel).
- **Status:** In review

### [2026-11-15] Revisi halaman Sumber (katalog arsip)
- **Tugas / klaim:** brief "Revisi halaman SUMBER"
- **Branch / PR:** `feat/refinement-pengalaman-museum` / belum ada PR
- **Yang dikerjakan:** halaman Sumber jadi tiga tab (Referensi 13, Kredit Media 11, Model 3D 8) dengan kartu ringkas (jenis, nama, penerbit, status, tombol Detail Sumber) dan modal Detail Sumber (kredit, penerbit, URL asal, lisensi dan ketentuan, tanggal akses, rincian berkas untuk kelompok aset). Tiga status: Terverifikasi, Perlu verifikasi, Informasi belum tersedia; teks TBD dihapus. Semua URL sumber dicek 15 November 2026 (200 dan judul cocok); referensi digabung dengan sumber di halaman cerita tanpa duplikat (URL Apollo 11 yang sama digabung). Kredit tiap foto JPL dan Apollo dari metadata NASA Image Library; yang belum diketahui ditulis apa adanya. Lisensi: ringkasan panduan NASA (umumnya tidak berhak cipta di AS; logo dan materi pihak ketiga dikecualikan), tanpa menganggap semua aset bebas hak cipta.
- **File:** `src/data/source.ts` (ditulis ulang), `app/(site)/source/{page,SumberDaftar,DetailSumber,LencanaStatus}.tsx`; `ui/EntriSumber.tsx` dihapus (tidak dipakai lagi). Catatan: judul di content-data.json memuat karakter rusak (U+FFFD) pada tanda pisah; dibersihkan di tampilan, datanya sendiri belum diperbaiki (milik Dhika).
- **Perlu ditindaklanjuti tim:** foto Apollo dan Voyager yang dikumpulkan tim belum punya URL asal per berkas; video Apollo belum punya URL asal; foto latar Beranda belum diketahui asalnya; nama pembuat model lingkungan belum dicatat; MER_static: kredit tidak tertulis di halaman unduhan.
- **Hasil uji:** lint dan tsc lolos; tab, kartu, dan modal (Esc menutup) berjalan di browser desktop. Belum diuji: mobile, build produksi.
- **Status:** Draft

### [2026-11-15] Popup objek berbasis media (model 3D, foto, video, teks) + Astronaut Bootprint
- **Tugas / klaim:** brief "Revisi popup interaktif objek"
- **Branch / PR:** `feat/refinement-pengalaman-museum` / belum ada PR
- **Yang dikerjakan:** `KartuDataBenda` diganti `ObjectPopup` (`src/components/hud/`) yang memilih tampilan menurut jenis aset (`MediaItem` di `src/data/media.ts`): `Model3DViewer` (R3F Canvas sendiri, OrbitControls: putar, zoom, setel ulang; pencahayaan netral dan `flat` agar warna asli; GLB di-clone dari cache `useGLTF`, tidak diunduh ulang; loading dan fallback galat), `ImageViewer` (foto utuh `object-contain`, perbesar, Esc menutup), `VideoViewer` (HTML5, tanpa putar otomatis), atau teks saja; tab bila ada lebih dari satu media. Model 3D: Eagle dan Tahap naik (LM), Spirit (MER), Opportunity (MER-B), Voyager 1 (Probe B), Voyager 2 (Probe A). Foto saja: plakat dan bendera (juga video), seismometer, retroreflektor, Heat Shield Rock, Golden Record (foto dan sampul), Bootprint. Objek baru **Astronaut Bootprint** (Moon): foto asli `Apollo Astronaut Bootprint.jpg`, pelat foto di scene, kartu menyebut itu foto dan posisinya hanya representasi visual; teksnya hanya dari keterangan aset (misi dan tanggal foto belum dicatat). Popup hanya dipasang satu per breakpoint (desktop atau lembar bawah).
- **Marker tambahan Moon (dari folder NASA dan catatan 04_Artefak):** Paket barang peringatan dan Peralatan lain (hanya teks, penanda di tanah), Eksperimen angin Matahari dan Sampel batuan dan tanah (pelat foto). Halaman cerita Bab 02 ikut memuat Astronaut Bootprint dan keempatnya. Moon kini 11 titik.
- **Golden Record (Deep Space):** dipisah menjadi dua objek dengan marker sendiri (Golden Record dan Golden Record Cover), masing-masing potongan bulat dari foto asli NASA (bukan model 3D; popup menyebutnya), lebih kecil dan berjarak dari Voyager, dengan halo emas lembut, tepi logam tipis, dan kilau. Cover punya data baru (`4-3`) dan popup foto sampul dan penjelasan diagram. Model piringan buatan sendiri sengaja tidak dibuat (aturan: bukan model palsu NASA).
- **Popup:** jarak ke tombol di atasnya diperlebar (top 100 px); klik di area scene (bukan seret, geser kurang dari 6 px) atau tekan Esc menutup popup; klik di dalam popup, titik info, dan tombol HUD tidak menutupnya (`data-popup-objek`).
- **File:** `ObjectPopup.tsx`, `Model3DViewer.tsx`, `ObjectMedia.tsx` (baru), `HalamanImersif.tsx`, `hud/index.ts`, `src/data/media.ts`, `benda-tambahan.ts`, `scene/objects.ts`; `KartuDataBenda.tsx` dihapus.
- **Hasil uji (browser):** Eagle: tab Model 3D dan Foto, putar dengan seret, tombol setel ulang; Bootprint: foto saja; Plakat: tab Video dan Foto, video tidak putar otomatis, kontrol bawaan; mobile: lembar bawah berisi model 3D. Lint dan tsc lolos.
- **Belum diuji:** popup Mars dan Deep Space secara visual, memutar video sampai selesai, build produksi, tablet.
- **Status:** Draft

### [2026-11-15] Halaman detail Cerita per bab (/cerita/[slug])
- **Tugas / klaim:** pisahkan storytelling dan eksplorasi 3D
- **Branch / PR:** `feat/refinement-pengalaman-museum` / belum ada PR
- **Yang dikerjakan:** kartu bab di /story kini menuju `/cerita/awal-eksplorasi`, `/eksplorasi-bulan`, `/eksplorasi-mars`, `/deep-space` (satu route dinamis `(site)/cerita/[slug]`; `/cerita` dialihkan ke /story). Tiap halaman: hero, cerita kronologis (6/5/7/5 bagian, dengan foto NASA), dokumentasi (video Apollo 11 yang sudah dikompres ke 480p dan galeri berkredit), fakta dan artefak (dengan catatan jenis model: model NASA, model umum, atau pelat foto), tombol ke lingkungan 3D (`/story/2`, `/story/3`, `/story/4`; Bab 1 tanpa 3D, mengarah ke Bab 2), sumber, dan navigasi bab. Konten tiap bab berbeda, disusun dari catatan di NASA/NASA History dan content-data.json (`src/data/cerita.ts`), tanpa fakta baru. Tombol kembali di scene 3D kini menuju halaman cerita bab itu. Navbar menandai Cerita aktif di /cerita.
- **Tidak diubah:** scene 3D, /story/[bab], Peta Perjalanan, Beranda. `/story/1` (placeholder imersif Bab 1) tetap ada tapi tidak ditautkan.
- **Aset baru:** `public/videos/apollo-11/*` (6 video + poster, total sekitar 16 MB dari 225 MB asli; asli utuh di NASA Assets/Vidio).
- **Kekurangan sumber:** alur "awal perlombaan antariksa" untuk Bab 1 belum ada di catatan sumber, jadi Bab 1 hanya memuat sejarah NASA dan jalan menuju Apollo 11; video Mars dan Deep Space belum ada.
- **Hasil uji:** lint dan tsc lolos; empat halaman 200, slug tidak dikenal 404; mobile tanpa scroll horizontal; tautan bab, 3D, dan navigasi bab benar. Belum diuji: build produksi, tablet, klik tombol di browser sungguhan.
- **Status:** Draft

### [2026-11-15] Redesain halaman Cerita (editorial sinematik)
- **Tugas / klaim:** brief redesign halaman Cerita
- **Branch / PR:** `feat/refinement-pengalaman-museum` / belum ada PR
- **Yang dikerjakan:** hero lebih pendek (520 jadi 460 px) dengan latar panorama yang sama, gradasi untuk keterbacaan, deskripsi baru, tombol "Mulai Perjalanan" ke daftar bab; bagian pembuka singkat (judul, satu paragraf, foto Apollo 11 NASA); empat bab sebagai kartu editorial berselang-seling (nomor besar, judul, deskripsi, foto 4:3, tombol "Buka Bab 0X") dengan foto NASA yang relevan; layar sinematik bertitik carousel dan daftar bab lama dihapus (satu sistem navigasi). Teks bab tetap dari content-data.json (Bab 4 tetap "antarbintang", bukan "antarplanet" seperti di brief, karena sumbernya).
- **File:** `src/app/(site)/story/page.tsx`, `BabEditorial.tsx` (baru), `src/data/story.ts`, `public/images/story/bab-1-apollo-11-orbit.webp`; `CeritaSinematik.tsx` dihapus (juga memperbaiki galat removeChild).
- **Hasil uji:** lint dan tsc lolos; desktop dan mobile dilihat di browser; tautan bab 1-4 dan "Mulai Perjalanan" ada dan benar; tanpa dependensi baru.
- **Belum diuji:** tablet; klik tombol di browser sungguhan.
- **Status:** Draft

### [2026-11-15] Revisi halaman eksplorasi 3D: HUD minimalis, objek NASA, titik info di objek asli
- **Tugas / klaim:** brief "Revisi total halaman eksplorasi 3D"
- **Branch / PR:** `feat/refinement-pengalaman-museum` / belum ada PR
- **Audit aset NASA (`NASA/NASA Assets`):** model: Apollo Lunar Module.glb, Landing Site.stl, Saturn V.glb, Voyager Probe (B).glb, (antenna).glb, Voyager_Twin_Spacecraft.glb. Foto Apollo 11 (11) dan Voyager (8), 7 video. **Tidak ada** model Spirit, Opportunity, Heat Shield, dan Golden Record (hanya foto).
- **Yang dikerjakan:**
  - HUD disederhanakan: deretan tombol panel diganti satu tombol **Info** (isi Fakta/Misi/Galeri/Sumber jadi tab di dalam panel kaca); kartu narasi diringkas (2 baris); label Titik Info hanya muncul saat hover/fokus/terpilih.
  - Objek NASA di scene (`scene/objects.ts`): Lunar Module di Moon (diletakkan di tanah lewat raycast), Voyager 1 dan 2 (model umum yang sama, melayang) di Deep Space. Mars tidak diberi objek pengganti; tampil catatan "Objek 3D belum tersedia".
  - `HotspotLayer`: titik info mengikuti posisi dunia objek lewat `worldToScreen`; pilih titik = kamera berputar halus ke objek (`focusOn`, GSAP) dan kartu data terbuka; pilih lagi = tutup dan kamera kembali.
  - Mars: model resmi NASA `MER_static.glb` (11,9 MB, diunduh dari science.nasa.gov dengan izin user, disimpan utuh di `NASA/NASA Assets/3D models`) ternyata **satu mesh satu rover**, bukan dua file; dikompres jadi 0,7 MB (gltf-transform: Draco + WebP 1024 px) di `public/models/objek/mer-rover.glb` dan dipasang dua kali untuk Spirit dan Opportunity (kembar). Heat Shield Rock belum punya model.
  - Tata letak HUD dirapikan agar tengah layar bebas untuk objek: dok bab/kategori diringkas dan di tengah bawah, tombol kontrol scene jadi kolom di kiri bawah, kartu narasi diperkecil, kartu data di kanan atas berhenti di atas dok; setelah fokus, objek berada sedikit di atas tengah layar.
  - Pengumpulan aset NASA resmi (laporan: `NASA/NASA_ASSET_COLLECTION_REPORT.md`): 4 foto Apollo 11 (EASEP, bendera), 9 citra Mars (Spirit, Opportunity, Heat Shield Rock), 7 citra Voyager dan 3 gambar sampul Golden Record, model Opportunity (MER-B) dan Voyager Probe (A). Opportunity kini memakai model MER-B. Foto Golden Record 115 gambar tidak diunduh (hak cipta). Galeri tiga lingkungan diperbarui.
  - Scene dilengkapi titik info: Moon 5 titik (Lunar Module, plakat, bendera, seismometer, retroreflektor; tiga terakhir tanpa model, berupa penanda di tanah dengan catatan "posisi perkiraan, belum ada model 3D"), Mars 3 (Spirit, Opportunity, Heat Shield Rock yang juga penanda), Deep Space 3 (Voyager 1 dengan Probe B, Voyager 2 dengan Probe A, Golden Record di badan pesawat). Benda tambahan Moon (seismometer, retroreflektor) disalin dari NASA History/04_Artefak.md ke `src/data/benda-tambahan.ts` (cek ulang bersama Dhika). Kamera awal membidik tengah semua objek bermodel.
  - Gerak kamera: seret vertikal dan geser dua jari sudah memutar atas-bawah (diuji: seret ke bawah memiringkan pandangan ke atas); yang hanya kiri-kanan adalah gerak ikut mouse. Kini gerak ikut mouse juga atas-bawah (parallax 5 derajat) dan petunjuk di kartu narasi menyebut seret untuk melihat ke segala arah.
  - Daftar resmi NASA (github.com/nasa/NASA-3D-Resources, 227 model) tidak memuat bendera Apollo, seismometer, retroreflektor, atau Heat Shield Rock; yang ada terkait: Astronaut, Saturn V, Curiosity, Perseverance, Ingenuity. Penanda tanpa model tetap penanda.
  - Benda tanpa model NASA (bendera, seismometer, retroreflektor, Heat Shield Rock) kini tampil sebagai pelat foto NASA berbingkai emas di scene (`Pelat3D`, foto dari folder NASA Assets/Images), bukan model; kartu data menyebut itu. Terlihat di Moon.
  - Gerak kamera dihaluskan: input (seret, geser dua jari, roda, tombol, fokus, reset) kini menulis target dan tampilan mengejar target dengan easing (sekitar 80 ms), plus luncuran singkat setelah seret dilepas; saat jeda gerak (reduced-motion) langsung ke target. Kode di `SceneRenderer.tsx` (`su/sp/sz`, `vYaw/vPitch`).
  - Galeri: 10 foto Apollo 11 (Moon) dan 8 foto Voyager (Deep Space) dari folder NASA jadi isi panel Galeri (Story dan Resources), `GALERI_FOTO` di `src/data/media.ts`. Mars belum punya foto.
  - Kamera otomatis mendekat ke objek utama 2,4 dtk setelah scene siap; kartu data tidak lagi menimpa dok dan kontrol.
  - Perbaikan: objek tertempel di posisi salah karena kotak batas model dihitung di dalam grup yang sudah dipindah; kini diukur sendirian.
  - Kartu Data Benda: foto pendukung NASA (bukan model), catatan "model umum", tombol Tutup. Data media di `src/data/media.ts`.
- **File:** `src/components/hud/{HalamanImersif,Panel,KartuNarasi,KartuDataBenda,ScenePlaceholder}.tsx`, `src/components/three/scene/{HotspotLayer,objects,SceneRenderer,SceneCanvas,scene-context}.ts(x)`, dua halaman imersif, `src/data/{media,index}.ts`, aset di `public/models/objek` dan `public/images/objek`.
- **Belum diuji / perlu mata:** posisi, arah hadap, dan skala objek (angka awal di `objects.ts`), posisi titik di LM (plakat), kamera fokus, mobile. Browser pane tertahan saat uji.
- **Aset belum ada:** model Spirit, Opportunity, Heat Shield (Mars); Golden Record 3D; Landing Site STL belum dipakai (normal nol, 7 MB).
- **Untuk Zhafran:** HalamanImersif, Panel, KartuNarasi, KartuDataBenda disentuh; kontrak `useImersif` tidak berubah.
- **Status:** Draft

### [2026-11-15] Refinement pengalaman museum: GSAP, hero parallax, muncul saat scroll (Phase 1-6)
- **Tugas / klaim:** brief refinement website (audit, hero parallax, animasi)
- **Branch / PR:** `feat/refinement-pengalaman-museum` / belum ada PR, belum di-push
- **Yang dikerjakan:**
  - Audit Phase 1: struktur, deps, halaman, aset. Animasi lama murni CSS; tidak ada pustaka animasi.
  - Dependensi baru: `gsap` (disetujui user), dipakai hanya untuk parallax hero (ScrollTrigger) dan cerita sinematik berikutnya.
  - `ParallaxLatar` (gambar hero bergeser lebih lambat dari scroll, mati saat prefers-reduced-motion) dan `Muncul` (naik + memudar saat masuk layar, IntersectionObserver, tanpa kedipan untuk elemen yang sudah di layar).
  - Latar Beranda: satu foto lengkung Bumi dari orbit (`latar-bumi-orbit.webp`, kredit TBD di Sumber), menempel di layar (fixed) dengan geseran pelan dan gradasi gelap tipis; foto bulan dan latar Bima Sakti lama dihapus (ada di git). Kartu Pilih Lingkungan bergaya kaca gelap (navy 65%, blur 12, hover cyan).
  - Phase 4: `CeritaSinematik` di `/story` (layar penuh yang menempel, empat bab bergantian lewat crossfade, GSAP ScrollTrigger; aria-hidden, disembunyikan saat reduced-motion; daftar bab tetap di bawahnya).
  - Phase 5 Peta Perjalanan: penanda terangkat dan membesar saat hover/fokus, penanda terpilih berdenyut; detail destinasi dan panel misi masuk dengan fade-slide saat berganti. Tidak ada garis rute (peta simbolis, bukan rute).
  - Phase 6 Sumber: filter dan metadata sudah ada; teks kredit model 3D diperbarui (Moon v5 beserta ukuran, status uji render). Isi TBD tidak diubah.
  - Dipasang di Beranda (hero, pengantar, tiga kartu lingkungan) dan Cerita (daftar bab).
- **File dibuat/diubah:** `src/components/ui/ParallaxLatar.tsx`, `Muncul.tsx`, `CeritaSinematik.tsx`, `PenandaDestinasi.tsx`, `DetailDestinasi.tsx`, `src/data/source.ts`, `index.ts`, `src/app/(site)/page.tsx`, `src/app/(site)/story/page.tsx`, `package.json`, lock.
- **Hasil uji:** lint dan build lolos. Efek gerak belum dilihat langsung: pane browser tertahan (rAF mati), perlu dicek mata di browser biasa.
- **Untuk Pace:** dua halaman milikmu (Beranda, Cerita) disentuh; perubahan hanya membungkus elemen yang ada.
- **Status:** Draft

### [2026-11-15] Integrasi SceneCanvas ke HUD, gerak kamera bebas, perbaikan NaN
- **Tugas / klaim:** pasang SceneCanvas di slot `scene` halaman imersif; kontrol kamera
- **Branch / PR:** `feat/scene-integrasi` (dibuat dari `zhafran-dev` + `feat/scene-canvas`) / belum ada PR, belum di-push
- **Yang dikerjakan:**
  - **Adaptor `ImersifScene`** (`src/components/three/scene/`): melapor status dan progres ke HUD (`setStatusScene`), mengikuti `paused` dari HUD, dan menyambungkan Setel Ulang Kamera (`useResetKamera`). Overlay Memuat dan kartu fallback (Coba Lagi, Lanjut tanpa 3D) milik HUD. `SceneCanvas` punya mode `headless` (poster tetap tampil, teks status disembunyikan) dan `onStatusChange`.
  - **Halaman:** Story Bab 2 (Moon), 3 (Mars), 4 (Deep Space) dan Resources (tiga kategori) memasang scene, dibungkus `SceneProvider`. Bab 1 tetap placeholder. Hanya dua file halaman yang disentuh; `HalamanImersif` tidak diubah.
  - **Gerak kamera bebas:** seret, geser dua jari di trackpad (tanpa klik), roda mouse (atas-bawah), cubit atau Ctrl+scroll untuk zoom, tombol panah, `+` dan `-`. Kamera hanya berputar dan zoom, tidak berpindah. Batas di `config.ts` (`rig`): Deep Space bebas 360° (atas dan bawah 85°); Moon dan Mars dijaga di dalam "baji" dunia (`worldHalfDeg` 62°, otomatis menyesuaikan zoom dan bentuk layar), atas 70° dan bawah 35°. Batu dan medan Moon/Mars hanya ada di depan kamera, jadi tidak bisa 360° tanpa revisi aset.
  - **Perbaikan "Coba Lagi":** GLB yang gagal dimuat dihapus dari cache drei supaya percobaan ulang benar-benar mengunduh lagi.
  - **Perbaikan layar hitam / "camera became NaN":** state rig diperbaiki otomatis bila ada nilai bukan angka (sempat terjadi karena Fast Refresh mempertahankan ref lama saat kode diedit ketika halaman terbuka; hanya mode dev), aspect canvas 0×0 tidak lagi ditulis, langkah waktu dibatasi, dan error pada rig tidak lagi membuat canvas hitam (kamera kembali ke sudut GLB, dilaporkan sekali di console dengan awalan `[SceneRig]`). Juga: frame digambar ulang setelah GLB tiba saat loop dijeda.
- **File dibuat/diubah:** `src/components/three/scene/` (`SceneCanvas.tsx`, `SceneRenderer.tsx`, `config.ts`, `scene-context.tsx`, baru: `ImersifScene.tsx`), `src/app/(imersif)/story/[bab]/page.tsx`, `src/app/(imersif)/resources/[kategori]/page.tsx`.
- **Hasil uji:** lint, `tsc`, dan build lolos. Di browser pane: Moon, Mars, dan Deep Space tampil di HUD; seret, geser dua jari (peristiwa roda sintetis), zoom, reset, jeda, dan fallback bekerja; Deep Space diputar 150° tanpa celah; atas-bawah Moon tanpa lubang.
- **Belum diuji:** trackpad dan layar sentuh asli (arah geser bisa terasa terbalik), Mars dan Resources dengan gerak baru, GPU dan perangkat nyata, fokus keyboard bersama pass aksesibilitas Pace.
- **Untuk Zhafran dan Pace:** Titik Info masih posisi layar statis (`posisiTitik`); HotspotLayer asli memakai `useScene().worldToScreen`, ditulis langsung ke `style.transform`. HUD menskalakan scene 1,07 → 1 selama 3 detik saat masuk, sehingga posisi layar hasil `worldToScreen` bergeser sedikit selama itu.
- **Belum selesai:** revisi aset (360° Moon/Mars, ketajaman, temuan audit) menunggu modeler; kode scene belum dipindah ke `feat/scene-canvas` (branch PR).
- **Status:** Review

### [2026-11-15] Pembersihan kode uji sebelum commit pertama
- **Tugas / klaim:** merapikan `feat/scene-canvas` untuk commit dan push (belum PR)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka
- **Yang dikerjakan:**
  - Dihapus: halaman uji `/dev/scene` dan panel ujinya (`src/app/dev/`), semua parameter uji URL (`?exp=`, `?amb=`, `?hemi=`, `?glow=`, `?gp=`, `?tm=`, `?pitch=`, `?sh=`, `?cap=`) beserta fungsi `tune()`, dan opsi `preserveDrawingBuffer`. Angka akhir kini tetap di `config.ts` (`look`, `rig`) dan konstanta `GLOW` di `SceneRenderer.tsx`.
  - Entri catatan di bawah yang menyebut `/dev/scene` atau parameter itu menggambarkan keadaan saat itu; kode-nya sudah tidak ada.
- **Akibat:** **belum ada halaman yang memakai `SceneCanvas`**; `npm run build` hanya memuat `/`. Komponen baru bisa dilihat setelah dipasang di slot `scene` pada `HalamanImersif` (branch `zhafran-dev`). Halaman uji lama ada di riwayat kerja lokal, bukan di commit.
- **Hasil uji:** `npm run lint`, `npm run build`, dan `tsc` lolos dari keadaan bersih (`.next` dihapus lebih dulu).
- **Belum selesai:** adaptor ke HUD (status, jeda, reset kamera, provider) menunggu integrasi dengan `zhafran-dev`; uji di perangkat/GPU nyata; perbaikan aset (lihat audit).
- **Status:** Review

### [2026-11-15] Nada poster disamakan dengan scene 3D
- **Tugas / klaim:** poster fallback/pemuatan tiga environment (bagian SceneCanvas)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka, belum di-commit
- **Yang dikerjakan:** sembilan poster WebP di `public/models/{moon,mars,deep-space}/` dikoreksi warnanya per kanal (RGB) supaya rata-rata dan sebarannya mendekati tampilan 3D hidup. Cara: bandingkan statistik poster dengan tangkapan layar 3D hidup untuk pasangan yang komposisinya sama (Moon: tablet 800×600, Mars dan Deep Space: desktop 800×450), lalu terapkan koreksi linear (geser dan skala per kanal, skala dibatasi 0,6–1,5) ke ketiga poster tiap environment. Poster asli tetap utuh di `fiks 3D/*/renders/`; salinan pra-koreksi ada di folder scratchpad sesi.
- **Hasil (rata-rata RGB poster → 3D):** Moon 35,6/35,2/33,7 → 39,0/38,7/38,0 (selisih kecil, sekitar 3 tingkat lebih terang); Mars 89,7/62,1/46,6 → 103,8/65,5/48,7 (3D lebih merah dan terang); Deep Space 36,1/21,5/15,1 → 24,9/12,1/8,0 (3D lebih gelap dan kurang hangat). Setelah koreksi, rata-rata sama dengan 3D dalam 1 tingkat, dan pasangan mobile (tidak dipakai untuk menghitung) ikut mendekat (mis. Mars mobile 82,3 → 96,5 dibanding 3D 96,9).
- **Batasan:** hanya nada global yang disamakan. Perbedaan detail (batu dan tanah Mars di poster lebih kaya) tetap ada, jadi tetap ada perubahan saat 3D mengambil alih. Statistik dihitung dari tangkapan layar JPEG beresolusi rendah di pane browser, bukan dari GPU nyata. Parameter dev `?cap=1` (preserveDrawingBuffer) ditambahkan untuk mencoba tangkapan langsung tapi pane browser tersembunyi, jadi tidak dipakai; kode itu sebaiknya dihapus bersama `tune()`.
- **Status:** Review

### [2026-11-15] Environment Deep Space di SceneCanvas (langkah 3)
- **Tugas / klaim:** SceneCanvas environment Deep Space (satu GLB, tiga kamera)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka, belum di-commit
- **Yang dikerjakan:**
  - `SceneCanvas environment="deep-space"`: `deep_space_environment_v1.glb` (2,8 MB, tanpa Draco, tiga kamera, 46 ribu segitiga) + tiga poster WebP. Aset di `public/models/deep-space/`.
  - `look` Deep Space: ACES exposure 1, **tanpa** ambient/hemisphere/bintang tambahan/bayangan (hanya tekstur emisif dan satu matahari, sesuai README paketnya). Ditambahkan flag `shadows` per environment.
  - Urutan gambar dan culling (`prepareSky`, kini umum untuk semua environment): kubah (`*Dome`) digambar pertama (-10) dan tidak di-cull, bintang (`*_Stars`) -5, atmosfer (`*Atmosphere`) terakhir (+5). Tanpa ini, glow atmosfer atau bintang bisa tergambar dengan urutan salah (peringatan di README paketnya).
  - Batas putar yaw Deep Space **10°** (bukan 25°) dan intro 4°: planet dan bulan adalah satu-satunya subjek dan berada di satu sisi; pada yaw 25° keduanya keluar layar, terlihat di mobile. Angka di `config.ts` (`rig["deep-space"]`).
  - Halaman uji: `/dev/scene?env=deep-space`.
  - **Poster kini HTML biasa** (`<picture>` dengan media query, breakpoint sama dengan `deviceForWidth`), bukan `next/image` yang baru muncul setelah hidrasi: sebelumnya layar hitam kosong sampai JavaScript selesai dimuat (terlihat di dev saat kompilasi pertama). Poster sekarang ada di HTML dari server, jadi tampil sejak cat pertama. Belum dilihat ulang di browser setelah perubahan ini; `tsc` dan `eslint` lolos, dan HTML server memuat `<picture>`.
- **File dibuat/diubah:** `public/models/deep-space/*`, `src/components/three/scene/` (`config.ts`, `SceneRenderer.tsx`), `src/app/dev/scene/page.tsx`.
- **Hasil uji:** `tsc`, `npm run lint`, `npm run build` lolos.
  - Di browser pane: Deep Space tampil sebagai 3D di desktop (1280), tablet (800) dan mobile (390), komposisi sama dengan poster (bulan di atas, planet sabit di kanan bawah, nebula).
  - Berpindah desktop → tablet → mobile saat halaman terbuka: status "siap" di setiap perangkat, **GLB hanya diunduh satu kali**, satu canvas, poster sesuai perangkat. Ini sekaligus memverifikasi dua perbaikan Mars (status turunan dan jeda 3 detik sebelum GLB bersama dibebaskan).
  - Diamati: pada yaw +25° di mobile planet keluar dari layar, jadi batas diturunkan ke 10°. **Batas 10° belum dilihat ulang** (diubah setelah uji).
  - Belum diuji: perangkat nyata. Tidak ada artefak atmosfer yang terlihat saat berputar (atmosfer di-bake untuk kamera di titik asal; kamera hanya berputar), tapi hanya diperiksa pada satu sudut.
- **Keputusan teknis & alasan:** tanpa cahaya pengisi karena planet dan bulan memang diterangi satu matahari dan sisi gelap planet sengaja hitam (README paketnya: siluet); ini tetap tampak seperti "lubang" pada render (lihat audit).
- **Belum selesai / catatan untuk orang lain:**
  - Kualitas aset Deep Space (planet tanpa pita atau awan, sisi gelap hitam pekat) menunggu perbaikan aset dari audit.
  - Peringatan README: langit 4096 px per 360° jadi lembut bila FOV sempit (mobile); tidak ada paralaks bintang.
- **Status:** Review

### [2026-11-15] Environment Mars di SceneCanvas (langkah 2)
- **Tugas / klaim:** SceneCanvas environment Mars (satu GLB, tiga kamera)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka, belum di-commit
- **Yang dikerjakan:**
  - `SceneCanvas environment="mars"`: memakai `mars_environment_v3.glb` (4,6 MB, Draco, tiga kamera, satu file untuk semua perangkat) + tiga poster WebP dari `renders/`. Aset di `public/models/mars/` (5,4 MB total).
  - Kamera dipilih **berdasarkan nama** (`Cam_Desktop_16x9` / `Cam_Tablet_4x3` / `Cam_Mobile_9x16`) lewat `assets[env][device].camera`, bukan lagi `cameras[0]`.
  - `look` per environment di `config.ts` (tone mapping, exposure, ambient, hemisphere, bintang, luas bayangan). Mars: ACES, exposure 0,85, ambient `#ffd8c0` 0,3, hemisphere `#e0a07a`/`#5a2c1c` 0,35 (mengikuti viewer bawaan paket Mars), tanpa bintang (langit sudah kubah di GLB), bayangan ±90 m di desktop.
  - Kubah langit (`*SkyDome*`) tidak di-cull dan tidak ikut bayangan.
  - Offset pitch Mars 0: kamera GLB Mars sudah membawa pitch ±8° (berbeda dari Moon v4 yang kehilangannya).
  - Halaman uji: `/dev/scene?env=mars`.
  - **Perbaikan balapan status:** status SceneCanvas kini diturunkan dari kunci "scene mana yang sudah siap/gagal" (`environment-device`), bukan di-set dari efek. GLB yang sudah ada di cache (Mars dipakai bersama antar perangkat) melapor siap sebelum efek sempat mengembalikan status ke "memuat", sehingga status bisa tersangkut.
  - Jeda 3 detik sebelum GLB bersama dibebaskan, supaya canvas baru saat ganti perangkat memakai cache, tidak mengunduh ulang. Bayangan memakai PCF (`"percentage"`) karena three r187 menghapus PCFSoft.
- **File dibuat/diubah:** `public/models/mars/*`, `src/components/three/scene/` (`config.ts`, `SceneCanvas.tsx`, `SceneRenderer.tsx`), `src/app/dev/scene/` (halaman uji).
- **Hasil uji:** `tsc`, `npm run lint`, `npm run build` lolos. Di browser pane: Mars tampil sebagai 3D di tablet (800 px), desktop (1280 px, dengan bayangan) dan mobile (390 px), komposisi cocok dengan poster. **Belum terverifikasi ulang** setelah dua perbaikan terakhir (status turunan dan jeda cache): pane browser tersembunyi saat uji terakhir sehingga halaman tidak selesai dimuat. Sebelum perbaikan, berpindah tablet → mobile mengunduh GLB sekali lagi; setelahnya belum diamati.
- **Keputusan teknis & alasan:** exposure Mars 0,85 dipilih dengan mata dari perbandingan ACES 1,0 (terlalu jenuh dan terang dibanding render) dan AgX 1,15 (pucat kemerahan); bukan hasil ukur.
- **Belum selesai / catatan untuk orang lain:**
  - **Mars berat di mobile:** satu GLB yang sama dipakai semua perangkat, sekitar 823 ribu segitiga digambar, 350 draw call di desktop (README Mars: berat untuk HP low-end, belum diuji di GPU nyata). Mobile belum punya versi lebih ringan; perlu dibuat dari Blender atau pertimbangkan hanya menampilkan poster di perangkat lemah.
  - Temuan kualitas aset Mars (langit datar, batu tanpa tekstur, pola garis pada bukit) ada di audit; perlu perbaikan aset.
  - Deep Space belum dikerjakan.
- **Status:** Review

### [2026-11-15] Pakai Lunar v5, hapus penambal pitch dan uji kisi
- **Tugas / klaim:** environment Moon (aset v5 dari pembuat model, penyesuaian viewer)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka, belum di-commit
- **Yang dikerjakan:**
  - GLB Moon v4 diganti **v5** di `public/models/moon/` (nama tetap `moon-environment-{desktop,tablet,mobile}.glb`): 5,15 / 1,85 / 1,04 MiB. Poster belum diganti.
  - `rig.moon.pitchDeg` semua jadi **0**: kamera GLB v5 sudah membawa pitch render (7° / 8,8° / 12,9°).
  - Kode uji pola kisi (`tweakTerrain`, parameter `?vc=` dan `?sn=`) **dihapus**; terbukti bukan penyebab.
- **Pemeriksaan v5 oleh Edo (independen dari klaim pembuat model):**
  - **Penyebab kisi benar kuantisasi Draco, bukan warna vertex** (dugaan saya di brief sebelumnya salah). Saya mendekode mesh tanah dengan decoder Draco three.js dan mengukur: v4 langkah posisi **0,184 m** (130 nilai x berbeda dalam 24 m dari kamera), v5 **0,0057 m** (4.046 nilai). Cocok dengan angka di `README_v5.md`.
  - Mars (`Mars_Terrain_Near`, 79.200 titik) langkah posisi **0,0115 m**, jadi tidak terkena masalah posisi yang sama. UV Mars belum diukur.
  - Struktur v5: node, satu kamera, Draco, lampu dan tekstur normal sesuai `verify_v5.txt`; saya cek ulang jumlah titik tanah (88.400/28.500/11.520) dan material `LunarGround_web` punya normal map.
  - Dimuat di viewer asli (`/dev/scene`, desktop): **pola kisi hilang**, tanah berkawah mikro dan AO terlihat, cakrawala sesuai render tanpa offset pitch. Tangkapan layar pane 800 px lebar.
- **File dibuat/diubah:** `public/models/moon/*.glb`, `src/components/three/scene/config.ts`, `SceneRenderer.tsx`.
- **Hasil uji:** `tsc`, `npm run lint`, dan `npm run build` lolos (dijalankan ulang setelah v5). v5 sudah dilihat di viewer asli di **desktop, tablet (800 px), dan mobile (390 px)**: kisi hilang, cakrawala sesuai poster, Bumi di posisi yang benar. Beban GPU dan waktu dekode di perangkat nyata belum diuji. Poster fallback masih render v4 (tampilan Cycles tidak berubah di v5, jadi tidak diganti).
- **Catatan audit aset 3D (temuan, belum ada perubahan aset):** lihat ringkasan di chat; file halaman uji sementara sudah dihapus.
- **Status:** Review

### [2026-11-15] Mendekatkan tampilan Moon ke render Blender (bayangan, cahaya pengisi, framing, uji pola kisi)
- **Tugas / klaim:** tampilan environment Moon di viewer (bagian SceneCanvas)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka, belum di-commit
- **Yang dikerjakan:**
  - **Bayangan (desktop saja):** matahari dari GLB menyalakan bayangan (shadow map 2048, kamera bayangan ±70 m, bias dan normalBias diatur). Karena scene tidak berubah, shadow map digambar **sekali** (`autoUpdate = false`), bukan tiap frame. Tablet dan mobile tanpa bayangan.
  - **Cahaya pengisi:** `hemisphereLight` (langit gelap, tanah abu hangat, 0,35) sebagai pengganti kasar pantulan cahaya (Cycles punya GI sungguhan); ambient turun ke 0,1.
  - **Framing:** offset pitch tetap per perangkat di `config.ts` (`rig.moon.pitchDeg`: desktop 8°, tablet 9°, mobile 8°) supaya cakrawala mendekati poster (±56% dari atas, bukan ±42% seperti kamera GLB). Ini sudut dasar, bukan interaksi: drag dan parallax tetap yaw saja. Angka 8–9° saya hitung kasar dari posisi cakrawala poster dan GLB, bukan dikalibrasi dengan alat ukur.
  - **Uji pola kisi tanah (`tweakTerrain`):** parameter dev `?vc=0` mematikan warna vertex pada `Lunar_Terrain_Near`, `?sn=1` menghitung ulang normal halus. Hasil pengecekan mesh: `Lunar_Terrain_Near` ber-indeks, 52.000 titik (grid 260×200), punya `NORMAL`, `TEXCOORD_0`, `COLOR_0`.
  - Parameter dev tambahan: `hemi`, `pitch`, `sh=0` (matikan bayangan). Semua hanya aktif di build dev dan **harus dihapus** begitu nilai final (bersama `tune()` dari entri sebelumnya).
- **File dibuat/diubah:** `src/components/three/scene/SceneRenderer.tsx`, `config.ts`.
- **Cara menguji:** buka `/dev/scene` lalu bandingkan: tanpa parameter; `?vc=0`; `?sn=1`; `?sh=0`; `?pitch=0` (framing lama); `?hemi=0`.
- **Hasil uji:**
  - Lolos: `tsc` dan `eslint`; tidak ada error konsol saat scene dimuat di desktop. **`npm run build` belum dijalankan ulang.**
  - Terlihat di browser pane (tangkapan layar sangat kecil, 385 px): cakrawala sekarang sekitar 58% dari atas, mendekati poster. Itu satu-satunya hal yang bisa saya konfirmasi dari gambar.
  - **Belum bisa dinilai dari sini:** apakah pola kisi hilang, kualitas bayangan, dan perubahan kecerahan. Resolusi tangkapan layar terlalu rendah, jadi hasilnya harus dilihat langsung di browser penuh.
  - Belum diuji: beban GPU bayangan di perangkat nyata (shadow map sekali gambar seharusnya murah per frame, tapi pass pertama dan memori 2048² belum diukur), tablet dan mobile dengan pitch baru.
- **Keputusan teknis & alasan:**
  - Bayangan hanya di desktop karena Moon desktop sekitar 490 ribu segitiga dan mobile jauh lebih terbatas.
  - Shadow map statis: kamera hanya berputar (tidak berpindah) dan cahaya serta geometri tidak berubah.
  - Hemisphere light dipilih karena murah; ini bukan pengganti GI, hanya mengisi bayangan.
- **Belum selesai / catatan untuk orang lain:**
  - Perbaikan aset (kerapatan grid tanah, bake normal map dan AO ke tekstur/warna vertex, tekstur tanah 2048) perlu dikerjakan di Blender oleh pembuat model; script ekspor ada di `fiks 3D/Lunar Environment dn Earthrise/scripts/export_glb_v4.py`. Blender tidak ditemukan di mesin ini.
- **Status:** Review

### [2026-11-15] Glow atmosfer Bumi dan penyetelan tone (Moon)
- **Tugas / klaim:** tampilan environment Moon di viewer (bagian SceneCanvas)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka, belum di-commit
- **Yang dikerjakan:**
  - `EarthGlow` di `SceneRenderer.tsx`: cangkang bola sedikit lebih besar dari Bumi (×1,08), render sisi belakang dengan shader sederhana: paling terang di tepi planet, memudar ke luar, dan hanya di sisi yang terkena matahari (arah matahari dibaca dari node `Sun_Directional` di GLB). Posisi dan radius Bumi dibaca dari node `Earth_Globe`. Blending aditif, tanpa menulis depth, jadi medan tetap menutupi glow.
  - Tone mapping diganti dari ACES ke **AgX** (Blender memakai AgX; README Lunar menyebut perbedaan ini), exposure 0,5, ambient 0,2 (naik dari 0,12 agar sisi bayangan tidak hitam pekat).
  - Parameter uji sementara lewat URL **hanya di build dev**: `?exp=0.6&amb=0.2&glow=3&gp=2&tm=aces|agx|neutral`. Ada di `SceneRenderer.tsx` (`tune()`, `toneMapping()`) dan **harus dihapus** begitu angkanya final.
- **File dibuat/diubah:** `src/components/three/scene/SceneRenderer.tsx`.
- **Cara menguji:** `npm run dev`, buka `/dev/scene`, perhatikan tepi Bumi; coba parameter URL di atas.
- **Hasil uji:**
  - Lolos: `tsc`, `npm run lint`, `npm run build`.
  - Terlihat di browser pane: halo biru tipis di sisi Bumi yang terang, dan tanah dengan tone yang mendekati poster. Itu pengamatan mata pada tangkapan layar beresolusi rendah, bukan pengukuran.
  - **Nilai final (`glow` 3, `ambient` 0,2) belum dilihat langsung.** Pane browser tersembunyi saat uji terakhir, sehingga tampilan dengan nilai akhir tidak sempat diperiksa. Yang saya lihat adalah nilai sebelumnya (glow 2,2, ambient 0,12). Mohon dicek dan disetel lewat parameter URL.
  - Belum diuji: perangkat nyata, biaya GPU glow (satu bola 64×48 dengan blending, murah, tapi tidak diukur).
- **Keputusan teknis & alasan:**
  - Glow memakai shader sendiri, bukan pustaka post-processing, supaya tidak menambah dependensi dan tidak menggandakan biaya render.
  - Vignette dan grain tidak dibuat: itu lapisan tampilan (gradien untuk keterbacaan) yang masuk wilayah desain/HUD (Pace) dan Figma.
  - Bayangan belum dihidupkan: butuh uji GPU di perangkat nyata karena Moon desktop menggambar sekitar 490 ribu segitiga.
- **Belum selesai / catatan untuk orang lain:**
  - Ukuran JS produksi diukur dari `npm run build`: seluruh chunk JS sekitar 1,6 MB mentah, sekitar 0,46 MB setelah gzip (termasuk runtime Next.js, bukan hanya three/R3F; bagian scene dimuat lazy dan tidak dipisah dalam angka ini).
  - Pola kisi di tanah (aset) belum berubah, perlu perbaikan dari pembuat model.
- **Status:** Review

### [2026-11-15] Camera rig: drag, parallax, dan intro terpandu (hanya yaw)
- **Tugas / klaim:** kamera scene (bagian dari SceneCanvas), jawaban sementara untuk keputusan #10 (usulan, belum disetujui Zhafran dan Dhika)
- **Branch / PR:** `feat/scene-canvas` (sama dengan entri di bawah) / belum dibuka, belum di-commit
- **Yang dikerjakan:**
  - `CameraRig` di `SceneRenderer.tsx`: tiga lapisan yang hanya memutar kamera kiri-kanan (yaw): (1) intro terpandu sekali (mulai 6° dari samping, melambat ke sudut GLB dalam 2,2 dtk), (2) drag atau tombol panah oleh pengunjung, dibatasi ±25°, **tetap di tempat setelah dilepas**, (3) parallax ±3° yang mengikuti mouse. Pitch tidak pernah diubah dan kamera tidak berpindah (penting untuk atmosfer Deep Space).
  - Render tetap `demand`: hanya merender selama ada gerak. Saat dijeda (Jeda Gerak atau `prefers-reduced-motion`), intro dan parallax mati, drag tetap bekerja lewat satu frame manual (`advance`).
  - API baru `rotateYaw(deltaDeg)` di `useScene()`; `resetCamera()` sekarang mengembalikan yaw ke 0 dan membatalkan intro.
  - Prop `interactive` di `SceneCanvas` (default `true`): bila `true`, canvas menangkap drag dan `touch-action: none`, dan wadah scene bisa difokus dengan keyboard (tombol panah ±5°). Isi `false` untuk halaman yang bisa di-scroll.
  - Batas dan kecepatan ada di `config.ts` (`rig`), per environment.
  - Halaman uji `/dev/scene`: tombol ◀ 5° / 5° ▶, dan lingkaran emas yang membaca `worldToScreen(Bumi)` tiap frame lewat `requestAnimationFrame` (contoh cara hotspot mengikuti benda).
- **File dibuat/diubah:** `src/components/three/scene/` (`config.ts`, `scene-context.tsx`, `SceneCanvas.tsx`, `SceneRenderer.tsx`), `src/app/dev/scene/` (halaman uji sementara).
- **Cara menguji:** `npm run dev`, buka `/dev/scene` di tab baru; seret scene, gerakkan mouse, tombol panah setelah klik pada scene, tombol di panel uji.
- **Hasil uji:**
  - Lolos: `tsc` dan `eslint`. **`npm run build` belum dijalankan ulang setelah perubahan ini.**
  - Di browser pane: posisi Bumi di layar bergeser sesuai yaw (+5° menggeser ±44 px di lebar 467); batas ±25° tertahan di kedua arah; Setel ulang kembali ke posisi semula; drag 140 px menggeser Bumi ±142 px dan posisinya bertahan setelah dilepas; tombol panah bekerja; dalam keadaan jeda tombol rotasi tetap menggeser tampilan; intro terpandu terlihat melambat dari ±60 px ke posisi akhir dalam sekitar 1,7 dtk; lingkaran penanda mengikuti Bumi.
  - **Catatan keterbatasan uji:** di pane ini frame dirender lambat (hingga sekitar 1–2 detik per frame pada perangkat lunak), jadi **frame rate dan kehalusan gerak belum bisa dinilai**. Parallax saya lihat dari angka posisi, bukan dari kehalusannya.
  - **Belum diuji:** perangkat nyata, drag dengan jari di layar sentuh (hanya mouse yang diuji), gyro (tidak dibuat), beban GPU saat bergerak, bentrok dengan HUD (belum ada HUD).
- **Keputusan teknis & alasan:**
  - Hanya yaw atas permintaan Edo: mencegah tampilan yang penuh langit atau penuh tanah (dan memperlihatkan pola kisi di aset) dan menjaga komposisi Bumi-cakrawala.
  - Setelah drag dilepas kamera tetap di tempat, atas permintaan Edo.
  - Gyro dan parallax sentuh tidak dibuat: gyro iOS butuh izin pengguna, sebaiknya jadi opsi terpisah.
- **Belum selesai / catatan untuk orang lain:**
  - Zhafran: hotspot cukup memakai `worldToScreen` tiap frame dan menulis langsung ke `style.transform` (lihat `SceneDevPanel.tsx`), bukan lewat `setState`.
  - Pace: Kontrol Scene dapat memakai `resetCamera()`, `setPaused()`, dan `rotateYaw()`.
  - Keputusan #10 masih milik Edo dan Zhafran; rig dibuat agar tiap lapisan bisa dimatikan lewat `config.ts` (isi 0).
  - Batas ±25° diterapkan sama untuk semua perangkat; mungkin perlu dipersempit di mobile dan untuk Mars.
- **Status:** Review

### [2026-11-15] SceneCanvas + environment Moon + useScene (langkah 1)
- **Tugas / klaim:** SceneCanvas dan environment Moon, kontrak API scene (`useScene()`)
- **Branch / PR:** `feat/scene-canvas` / belum dibuka (belum di-commit)
- **Yang dikerjakan:**
  - `SceneProvider` + `useScene()`: `status` (`memuat | siap | fallback`), `paused`, `setPaused`, `getCamera()`, `worldToScreen(pos) → {x, y, terlihat}`, `resetCamera()`. Provider dipasang di atas halaman agar `SceneCanvas` dan komponen lain (hotspot, HUD) berbagi satu scene.
  - `SceneCanvas` (`environment="moon"`): memilih GLB per perangkat (desktop/tablet/mobile) dari breakpoint Figma, memuat bundle three/R3F secara lazy (`next/dynamic`, `ssr: false`), menampilkan poster WebP selama memuat dan saat fallback.
  - Environment Moon: GLB Draco, kamera dari GLB, lampu dari GLB (matahari dan earthshine) + ambient, lapisan bintang (tidak ada di GLB, sesuai README Lunar), background hitam opak.
  - Fallback ke gambar statis bila WebGL tidak ada, GLB gagal dimuat (error boundary), atau context WebGL hilang.
  - Render `demand` (hanya saat perlu); `setPaused(true)` menghentikan render loop dan menggambar satu frame; mulai dalam keadaan jeda bila `prefers-reduced-motion`.
  - Membersihkan geometri, material, dan tekstur GLB saat scene diganti atau dilepas.
  - Halaman uji sementara `/dev/scene` (`?webgl=off` untuk menguji fallback).
- **File dibuat/diubah:**
  - Baru: `src/components/three/scene/` (`config.ts`, `scene-context.tsx`, `SceneCanvas.tsx`, `SceneRenderer.tsx`), `src/app/dev/scene/` (halaman uji sementara, di folder `src/app` milik Pace; hapus bila tidak dibutuhkan), `public/models/moon/` (3 GLB + 3 poster), `public/draco/` (decoder Draco dari three.js).
  - **File bersama (beri tahu Dhika):** `package.json` dan `package-lock.json` (+ `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`), `eslint.config.mjs` (abaikan `public/draco/**`), `docs/PEMBAGIAN_TUGAS.md` (baris klaim).
- **Cara menguji:** `npm run dev`, buka `/dev/scene`; ubah ukuran jendela untuk berpindah desktop/tablet/mobile; `?webgl=off` untuk fallback; `npm run lint`, `npm run build`.
- **Hasil uji:**
  - Lolos: `tsc`, `npm run lint`, `npm run build`.
  - Lolos di browser pane aplikasi desktop (bukan perangkat nyata): Moon tampil di desktop (1440), tablet (1024, 800) dan mobile (375); perpindahan ukuran jendela secara langsung memuat GLB yang sesuai dan hanya menyisakan satu canvas; tombol Jeda/Lanjut/Setel ulang kamera tidak merusak tampilan; fallback `?webgl=off` menampilkan poster tanpa mengunduh GLB; error boundary menangkap error render di dalam Canvas dan beralih ke gambar statis (terjadi tidak sengaja saat pane memuat modul usang, bukan diuji dengan GLB yang rusak).
  - `worldToScreen` untuk posisi Bumi memberi titik di dalam layar yang konsisten dengan tampilan, tetapi belum dibandingkan per piksel.
  - **Belum diuji:** perangkat nyata dan GPU nyata (frame time, panas, memori), pengukuran kebocoran memori setelah berpindah scene berulang kali, sentuh/pointer, layar sangat lebar, keyboard.
- **Keputusan teknis & alasan:**
  - R3F + drei (disepakati dengan Edo): komponen React, loader Draco/GLB siap pakai, cleanup lebih mudah.
  - `SceneProvider` ditambahkan di atas kontrak awal (`<SceneCanvas />` + `useScene()`), karena hotspot Zhafran dan HUD Pace adalah saudara `SceneCanvas` di halaman, bukan anaknya. **Perlu disepakati dengan Zhafran dan Pace.**
  - Moon: exposure 0,5 (ACES). Matahari GLB diekspor mentah (6,5), pada exposure 1,0 tanah terlalu terang. Angka ini hasil mata di Chrome, bukan pengukuran.
  - Poster tanpa image optimizer (`unoptimized`): sudah WebP per perangkat.
  - Penamaan aset kebab-case (`moon-environment-desktop.glb`) sesuai `ASSET_DOCUMENTATION.md`; nama asli di `fiks 3D` berbeda.
- **Belum selesai / catatan untuk orang lain:**
  - **Masalah di aset (bukan kode):** tanah dekat kamera di Moon menampilkan pola kisi/kotak terang-gelap. Pola yang sama tampak samar di `previews/glb_check_tablet.png` pada README Lunar; di WebGL jauh lebih jelas. Kemungkinan dari warna vertex hasil bake di grid tanah. Perlu dicek oleh pembuat model.
  - Kamera dari GLB tidak sama dengan render hero Blender (cakrawala lebih tinggi, ±42% dari atas dibanding ±56% di poster). Posisi di `glb_check_tablet.png` cocok dengan tampilan kita, jadi ini isi GLB. Poster dan scene 3D tidak persis sama bingkainya saat transisi.
  - Glow atmosfer Bumi belum ada (tidak ada di GLB); bayangan belum dihidupkan (mahal di mobile).
  - Kamera masih statis. Soal kamera bebas/terpandu/terkunci (keputusan #10) belum diputuskan.
  - Mars dan Deep Space belum dikerjakan (PR berikutnya). Catatan: atmosfer Deep Space di-bake untuk kamera di titik asal, jadi kamera di sana hanya boleh berputar, tidak berpindah.
  - Peringatan `THREE.Clock deprecated` di konsol berasal dari library, bukan dari kode kita.
  - `npm audit` melaporkan 7 kerentanan moderate (terlihat dari rantai `@typescript-eslint`/tooling lint). Belum dibandingkan dengan `main`, jadi belum jelas apakah sudah ada sebelum penambahan paket.
  - Halaman `/dev/scene` hanya untuk uji dan sebaiknya dihapus sebelum demo.
- **Status:** Review

### [2026-11-14] Setup awal proyek dan folder data 3D *(diisi dari riwayat git; Edo silakan koreksi atau lengkapi)*
- **Tugas / klaim:** Fondasi repo dan aset 3D
- **Branch / PR:** langsung ke `main` (commit `3d286fa`, `e9ceca9`, `b7335f1`)
- **Yang dikerjakan:**
  - Inisialisasi aplikasi Next.js dan setup TypeScript.
  - Menambahkan folder data 3D (environment Moon, Mars, Deep Space). Folder itu kemudian dikeluarkan dari repo atas permintaan tim (commit `04f62e4`); isinya masih ada di riwayat git.
- **File dibuat/diubah:** `package.json`, `src/app/*`, konfigurasi Next.js dan TypeScript, folder data 3D (kini dihapus)
- **Cara menguji:** `npm run dev`, `npm run build`
- **Hasil uji:** belum dicatat
- **Keputusan teknis & alasan:** belum dicatat
- **Belum selesai / catatan untuk orang lain:** library 3D belum dipilih (lihat keputusan terbuka nomor 1 di `PEMBAGIAN_TUGAS.md`).
- **Status:** Done
