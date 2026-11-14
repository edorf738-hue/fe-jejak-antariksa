# FIGMA HANDOFF — NASA Hackathon 2026

**File Figma:** https://www.figma.com/design/T6NXM5c9ToMbrpSyoJfwG5/HACKATHON-NASA-2026 (halaman **Prototype**; halaman **Referensi** hanya bahan acuan).
**Status:** draf handoff. Semua isi teks/data bertanda `TBD` menunggu data terverifikasi (lihat `CONTENT_REQUIREMENT.md`). Dokumen ini hanya mencatat apa yang benar-benar ada di Figma.

## 1. Breakpoint dan layout
| Breakpoint | Lebar frame | Padding konten | Jarak antar section |
|---|---|---|---|
| Desktop | 1440 | 86 | 56 |
| Tablet | 768 | 40 | 48 |
| Mobile | 390 | 24 | 40 |

- Kartu 3 kolom di desktop (lebar 404, gap 28); 2 kolom di tablet (gap 20); 1 kolom di mobile.
- Radius kartu 24; tombol, chip, dan navbar berbentuk pill (radius 100).
- Tinggi header halaman: desktop 440, tablet 360, mobile 420. Hero Home: 849 / 720 / 760.
- Frame responsif dibuat dengan Auto Layout; frame desktop Home masih posisi manual (hero), konten di bawahnya Auto Layout.

## 2. Token
### Warna (variabel `Color`, 80 nilai, 1 mode)
Nama variabel: `Family/Level`. Level: `Light`, `Light :hover`, `Light :active`, `Normal`, `Normal :hover`, `Normal :active`, `Dark`, `Dark :hover`, `Dark :active`, `Darker`.
Code syntax web (usulan, belum ada konvensi di kode): `var(--color-<family>-<level>)`, huruf kecil, spasi menjadi `-`, ` :` menjadi `-` (contoh `var(--color-text-primary-normal-hover)`).

| Family | Peran | Light | Light :hover | Light :active | Normal | Normal :hover | Normal :active | Dark | Dark :hover | Dark :active | Darker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Bg Primary | latar halaman | e6e7e7 | dadadb | b2b3b6 | **080b12** | 070a10 | 06090e | 06080e | 05070b | 040508 | 030406 |
| Bg Secondary | permukaan kartu | e7e8e9 | dbdcdf | b5b7bc | **111827** | 0f1623 | 0e131f | 0d121d | 0a0e17 | 080b12 | 06080e |
| Archive Slate | kartu terpilih, garis | e9eaeb | dedfe1 | babdc2 | **202a3a** | 1d2634 | 1a222e | 18202c | 131923 | 0e131a | 0b0f14 |
| Text Primary | teks utama | fefefd | fdfdfc | fbfaf8 | **f3f0e8** | dbd8d1 | c2c0ba | b6b4ae | 92908b | 6d6c68 | 555451 |
| Text Secondary | teks sekunder | f6f7f9 | f2f3f6 | e4e7ec | **a8b1c2** | 979faf | 868e9b | 7e8592 | 656a74 | 4c5057 | 3b3e44 |
| Aksen Warisan | label, catatan | fbf6ef | f9f2e6 | f3e4cc | **d9a85b** | c39752 | ae8649 | a37e44 | 826537 | 624c29 | 4c3b20 |
| Aksen Informasi | tombol utama, tautan | f1f8fb | eaf4f9 | d3e9f2 | **72b8d5** | 67a6c0 | 5b93aa | 568aa0 | 446e80 | 335360 | 28404b |
| Aksen Visual | progres bab | f4f5fa | eef0f7 | dce0ee | **8d9bc9** | 7f8cb5 | 717ca1 | 6a7497 | 555d79 | 3f465a | 313646 |

Catatan: nama peran (Bg Primary, dst.) berasal dari nama frame di palet; pemetaan ke level belum dikonfirmasi designer. Fill pill aktif navbar (biru `#0067b2`, opacity 20%) belum menjadi token. Rasio kontras ada di frame **Color Palette**.

### Text style
| Style | Font | Ukuran / line height | Letter spacing |
|---|---|---|---|
| Hero/Headline 90 | Space Grotesk Bold | 90 / 100 | 5% |
| Hero/Headline 70 | Space Grotesk Bold | 70 / 80 | 0% |
| Hero/Headline 36 (usulan) | Space Grotesk Bold | 36 / 42 | 5% |
| Hero/Eyebrow 20 | Rajdhani SemiBold | 20 / auto | 40% |
| Hero/Eyebrow 15 | Rajdhani SemiBold | 15 / auto | 40% |
| Heading/Section 48 (usulan) | Space Grotesk Bold | 48 / 56 | 0% |
| Heading/Card 32 (usulan) | Space Grotesk Bold | 32 / 40 | 0% |
| Body/Large 20 | Inter Regular | 20 / 30 | 0% |
| Button/Label 20 | Inter Bold | 20 / auto | 0% |
| Nav/Link | Inter Medium | 20 / auto | 0% |
| Nav/Link Active | Inter Bold | 20 / auto | 0% |

Ukuran bertanda "usulan" belum disetujui designer.

## 3. Komponen (section **Komponen**)
| Komponen | Varian | Properti teks |
|---|---|---|
| Navbar | `Aktif` = Beranda, Cerita, Peta Perjalanan, Sumber (1268×100, efek glass) | label tetap |
| Navbar Ringkas | `Menu` = Tertutup, Terbuka (tablet/mobile; lebar diatur di instance) | label tetap |
| Button | `Tipe` Primary/Secondary × `State` Default, Hover, Active, Focus, Disabled, Loading | `Label` |
| Kartu Lingkungan | `State` Default, Hover, Selected, Focus | `Judul`, `Deskripsi`, `Tautan`; gambar = fill `Gambar` |
| Navigasi Bab | `Aktif` = 1–5 | — |
| Kartu Bab | `State` Default, Hover, Focus | `Nomor`, `Judul`, `Ringkasan` |
| Kartu Misi | `State` Default, Hover, Focus | `Nama`, `Wahana`, `Peluncuran`, `Status` |
| Penanda Destinasi | `State` Default, Hover, Selected, Focus | `Label`; gambar = fill `Gambar` |
| Item Sumber | — | `Judul`, `Meta`, `URL` |
| Entri Sumber | — | `Kategori`, `Judul`, `Meta`, `URL`, `Atribusi` |
| Kartu Fakta | — | `Isi`, `Sumber` |
| Item Galeri | — | `Keterangan`; gambar = fill `Gambar` |
| Titik Info (hotspot di scene 3D) | `State` Default, Hover, Aktif, Focus | `Label` |
| Kartu Narasi (panel kaca mengambang) | — | `Eyebrow`, `Judul`, `Isi`, `Petunjuk` |
| Kartu Data Benda (panel kaca mengambang) | — | `Nama`, `Kategori`, `Deskripsi`, `Fakta` (kartu teks saja, tanpa viewer) |
| Objek 3D (placeholder benda, tanpa card) | — | boolean `Cincin Putar`; teks `Keterangan`, `Penanda Placeholder`. Di produksi diganti kanvas 3D benda yang bisa diputar; cincin putus-putus hanya penanda placeholder |
| Ikon | `Nama` = Menu, Tutup, Panah Kiri/Kanan/Atas/Bawah, Tautan Keluar, Info, Peringatan, Cari, Setel Ulang Kamera, Layar Penuh, Putar, Jeda, Misi, Sumber, Galeri (17) | warna = stroke terikat token (default Text Primary/Normal; ubah per instance) |

**Ikon:** grid 24 px, garis 1,5 px, ujung dan sambungan membulat. Dipakai di Navbar Ringkas (Menu/Tutup), Kartu Bab (Panah Kanan 32 px), Kartu Lingkungan (`Tautan` = teks + Panah Kanan 20 px), dan Button (properti boolean `Ikon Kiri` / `Ikon Kanan`, default mati; label "Bab 3" tanpa karakter panah). Ikon dekoratif disembunyikan dari pembaca layar; ikon yang berdiri sendiri sebagai tombol butuh nama aksesibel (`aria-label`) dan area sentuh minimal 44 px. Tombol panel di scene memakai `Ikon Kiri`: Fakta = Info, Misi Terkait = Misi, Galeri = Galeri, Sumber = Sumber (padding horizontal 20, gap 8). Belum dipasang: spinner Loading (masih lingkaran manual).

| Komponen | Varian | Properti |
|---|---|---|
| Tombol Ikon | `State` Default, Hover, Focus (44×44, bulat, kaca `#111827` @70–88% + blur 24, garis 1,5–2 px bertoken) | `Ikon` (instance swap) |

**Kontrol Scene** (grup di semua frame scene Story dan Resources): tiga Tombol Ikon, yaitu Setel Ulang Kamera, Layar Penuh, dan Jeda Gerak. Desktop: baris di kanan bawah scene (x 1198, y 692, di atas dok). Tablet dan mobile: kolom di tepi kanan, tepat di bawah Tombol Panel. Saat panel terbuka di desktop, kontrol bergeser ke kiri panel; di mobile, panel penuh layar menyembunyikannya. Animasi: fade-in 0→1 pada detik 1,4–2,0 (EASE_OUT). Perilaku masih usulan: Setel Ulang Kamera mengembalikan kamera ke posisi awal model, Layar Penuh membuka scene tanpa HUD sekunder, Jeda Gerak menghentikan animasi latar dan HUD (dan harus otomatis aktif bila `prefers-reduced-motion`). Setiap tombol butuh `aria-label` dan area sentuh 44 px.

Catatan teknis: garis tombol Secondary berada di luar bingkai (`OUTSIDE`), jadi frame induk (Tombol Panel, Dok, header panel) harus `clipsContent` mati agar garisnya tidak terpotong; di CSS jangan beri `overflow: hidden` pada pembungkus tombol.

Komponen HUD (Titik Info, Kartu Narasi, Kartu Data Benda, dok navigasi) berada **di atas canvas 3D**. Fill kaca memakai warna mentah `#111827` pada opasitas 62–78% dengan *background blur* 24–28 (variabel Figma tidak membawa opasitas, jadi belum jadi token).

Belum ada state Disabled untuk komponen non-Button, dan belum ada state loading/error di tingkat komponen (state halaman ada di bagian 5).

## 4. Halaman dan frame (halaman Prototype)
Setiap halaman punya versi Desktop / Tablet / Mobile; flow prototype terdaftar per breakpoint.
Frame dikelompokkan dalam tiga section berdampingan di halaman Prototype: **Desktop — 1440**, **Tablet — 768**, dan **Mobile — 390**. Di tiap section, frame disusun per baris halaman (Home, Story, Journey Map, Resources, Source) dengan label baris. Section fondasi (Color Palette, Komponen, State 3D, Resources — Referensi Aset (lama)) ada di sebelah kirinya.

| Halaman | Frame |
|---|---|
| Home | `Home — Desktop` (hero foto, CTA, pengantar, pilihan Mars/Moon/Deep Space), `Home — Tablet`, `Home — Mobile` |
| Story | `Story — Pengantar` (daftar 5 bab, halaman scroll) dan `Story — Bab 1…5` sebagai **tampilan 3D imersif satu layar** (1440×900 / 768×1024 / 390×844): scene 3D penuh, kartu narasi mengambang, titik info (hotspot) pada benda dengan kartu data benda, tombol panel Misi Terkait dan Sumber, dok bawah (sebelumnya, stepper bab, berikutnya). Frame pola tambahan: panel Misi Terkait dan Sumber (Bab 2 desktop dan mobile), data benda terbuka (Bab 2 tablet dan mobile) |
| Journey Map | `Journey Map — Moon`, `— Mars`, `— Deep Space` (peta simbolis, misi terkait, detail misi, sumber) + panel state Kosong/Memuat/Galat |
| Source | `Source` (filter kategori, referensi, kredit gambar, kredit model 3D) + panel Kosong |
| Resources | `Resources — Mars`, `— Moon`, `— Deep Space` sebagai **tampilan 3D imersif**: scene penuh, kartu ringkasan mengambang, titik info + kartu data benda, empat tombol panel (Fakta, Misi Terkait, Galeri, Sumber), dok tab kategori. Frame pola: empat panel pada Mars desktop |

Resources tidak ada di navbar; diakses dari kartu environment di Home. Section `Resources — Referensi Aset (lama)` hanya acuan aset.

## 5. State dan interaksi
- **State 3D hero** (section **State 3D**): Loading, Loaded (Moon), Destination selected (Mars, Deep Space), Information open (Mars, Deep Space), Transition, Fallback. Durasi/easing transisi: TBD.
- **Interaksi prototype** (dissolve 0,3 dtk, nilai sementara): navbar antar halaman (desktop), kartu Home → Resources imersif, tab kategori Resources, penanda Journey Map antar destinasi, daftar bab → bab imersif, sebelumnya/berikutnya antar bab (bab 5 → daftar bab), tombol panel → panel dan tombol Tutup (Story Bab 2, Resources Mars desktop), hotspot → data benda terbuka (Story Bab 2 tablet dan mobile), tab dan panel di state 3D, tombol menu Navbar Ringkas (buka/tutup). Tautan di dalam menu terbuka dan stepper bab belum disambungkan.
- **Cara kerja tampilan 3D imersif (usulan untuk FE):** scene 3D memenuhi layar (lapisan 0), gradien untuk keterbacaan (lapisan 1), lalu HUD (navbar, kartu narasi, tombol panel, dok). **Titik Info** harus mengikuti benda di scene: posisi layar = proyeksi koordinat 3D benda ke layar, dihitung ulang tiap frame/saat kamera bergerak. Klik titik membuka Kartu Data Benda di dekatnya (garis penghubung 1,5 px, warna Aksen Informasi). Di mobile, label titik disembunyikan (hanya titik) dan kartu data menggantikan kartu narasi. Posisi titik di Figma hanya ilustrasi; label titik kini memakai nama benda dari dokumen NASA (lihat bagian 5a), tetapi scene Moon/Mars/Deep Space belum memuat model benda itu (Lunar Module, rover, Voyager), jadi posisi dan keberadaan benda di scene harus disamakan dengan tim 3D.
- **Animasi HUD (keyframe Figma, nilai usulan):** dibuat pada frame dasar Story dan Resources (timeline 12 dtk). Urutan masuk: scene mengecil pelan dari skala 1,07 ke 1,0 (0–3 dtk, ease-out); navbar fade + turun 20 px (0 dtk, 0,5 dtk); kartu narasi fade + geser dari kiri 40 px (desktop) atau naik 40 px (tablet/mobile) (0,3 dtk, 0,7 dtk); tombol panel fade + geser (0,5 dtk, 0,6 dtk); dok fade + naik 40 px (0,6 dtk, 0,6 dtk); titik info membesar 0,4→1 dengan sedikit pantulan (*ease-out-back*), berurutan tiap 0,15 dtk mulai 0,9 dtk; garis penghubung "tergambar" (trim 0→1, 1,3–1,9 dtk); kartu data fade + geser 30 px (1,7 dtk, 0,6 dtk). **Denyut titik:** cincin tipis (1,5 px) membesar 1→2× sambil memudar (opasitas 0,7→0), siklus 2 dtk, ulang tanpa henti, tiap titik bergeser 0,4 dtk. Frame state (panel, data benda) hanya menganimasikan panel/kartu yang muncul (0,5 dtk; panel geser 60 px dari kanan di desktop, naik 80 px di mobile). Timeline Figma hanya berjalan sekali; di web denyut dan latar diulang tanpa henti. Matikan semua gerak jika `prefers-reduced-motion`. Logo di dalam Navbar Ringkas tidak dianimasikan terpisah (Figma tidak mengizinkan animasi pada sublayer instance).
- **Scene 3D per bab:** Bab 2 = Moon, Bab 3 = Mars, Bab 4 = Deep Space. **Bab 1 dan Bab 5 belum punya aset 3D**; frame memakai gambar konsep sebagai placeholder, dengan penanda "PLACEHOLDER · SCENE 3D FINAL: TBD". Bab 1 = Bumi dari orbit saat matahari terbit (benda yang bisa diberi titik info: cahaya fajar, lapisan atmosfer, lampu kota sisi malam, satelit generik); Bab 5 = wahana generik yang melayang senyap dengan Bumi kecil di kejauhan dan pita Bima Sakti tipis (titik info: antena parabola, boom/instrumen, debu Bima Sakti; Bumi tidak diberi titik di desktop karena tertutup tombol panel). Wahana pada gambar Bab 5 mirip wahana nyata, tetapi ini ilustrasi; jangan dilabeli sebagai wahana atau misi tertentu tanpa sumber terverifikasi. Di tablet dan mobile, gambar Bab 5 hanya mengisi sekitar 62–70% tinggi layar (bagian bawah memudar) supaya wahana tidak tertutup kartu narasi. Kedua gambar hasil generate AI (catat di halaman Source: alat, tanggal, prompt).
- **Spesifikasi integrasi 3D** (usulan) ada di kotak teks dalam section State 3D.

## 5a. Konten dari dokumen NASA (`NASA/NASA History`)
Isi teks di Figma kini berasal dari dokumen itu. **Sumber data untuk FE adalah [`docs/content-data.json`](content-data.json)**, bukan teks layer Figma, supaya tidak ada salah salin. Field JSON cocok dengan properti komponen: `narasi` = Kartu Narasi `Isi`; `hotspot[n]` = Titik Info `Teks`; `dataBenda.*` = Kartu Data Benda `Nama/Kategori/Deskripsi/Fakta`; `misi.*` = Kartu Misi dan Panel Detail Misi; `sumber[]` = Item/Entri Sumber (`Judul/Meta/URL`).

| Halaman | Terisi dari dokumen | Masih TBD |
|---|---|---|
| Story Pengantar | Ringkasan Bab 1–4 | Bab 5 |
| Story Bab 1–4 (3 breakpoint) | Narasi, label hotspot, Kartu Data Benda hotspot 1; **8 frame state baru di Desktop (baris paling bawah) untuk hotspot 2 dan 3** (klik hotspot berpindah antar state) | Bab 5; hotspot 2 dan 3 belum didesain untuk tablet dan mobile maupun halaman Resources; "Fakta" Heat Shield Rock |
| Story Bab 2 panel | Misi Terkait (Apollo 11, 8, 10) dan Sumber (3) | Wahana dan peluncuran Apollo 8 dan 10; tanggal akses |
| Resources Mars/Moon/Deep Space | Ringkasan, hotspot, data benda | Panel Galeri (belum ada gambar Mars) |
| Resources Mars panel | Fakta (3), Misi Terkait (Spirit, Opportunity), Sumber (3) | Misi Terkait ke-3 |
| Journey Map Moon/Mars/Deep Space | Kartu Misi, Panel Detail Misi (plus baris Lokasi/koordinat, Kru atau Tokoh, Fakta menarik), **Panel Kronologi baru** (Apollo 11, Spirit dan Opportunity, Voyager), Sumber (2) | Kartu Misi ke-3 Mars dan Deep Space; "Tujuan misi" Voyager; tokoh Deep Space |
| Source | Referensi 1–3, Kredit Gambar 1–2 (sebagian) | Tanggal akses, kredit foto, lisensi, pembuat model |

**Batas karakter** (ukuran kartu di Figma, mobile 342 px): narasi 90, label hotspot 24, nama benda 24, kategori 40, deskripsi 60, fakta 70, status misi 50. Teks lebih panjang menambah tinggi kartu dan bisa menutup hotspot atau dok.

**Hal yang masih perlu dicek tim konten:** tanggal peluncuran Opportunity (7 atau 8 Juli 2003), kalimat "air asin yang cukup dalam untuk dipercik" di `03_Spirit_Opportunity.md` (kemungkinan salah terjemah), `Apollo11_Informasi_Utama_Misi.md` yang sudah usang soal tanggal pendaratan, dan peristiwa Voyager 1 satu hari cahaya pada 18 November 2026. Model 3D Apollo/Voyager adalah model umum, tulis "model umum" di web. Folder `NASA/` (251 MB) belum aman di-commit mentah; gunakan Git LFS atau penyimpanan luar.

**Data Benda = objek 3D langsung + kartu deskripsi:** saat hotspot dibuka, benda (mis. Rover Spirit) tampil langsung sebagai objek 3D di scene tanpa card (komponen Objek 3D, placeholder "MODEL 3D: TBD"), dan deskripsinya muncul di kartu terpisah. Desktop: objek di tengah, kartu di kanan (x 974, lebar 380); tablet dan mobile: objek di atas, kartu di bawah menggantikan kartu narasi. Garis penghubung (desktop) menyambung hotspot aktif ke objek. Perilaku usulan: objek bisa diseret untuk memutar, model dimuat hanya saat hotspot dibuka, dan jatuh ke gambar statis bila WebGL gagal. Status model: Apollo Lunar Module dan Voyager sudah ada (model umum); rover Spirit/Opportunity **belum ada file di repo** (lihat `model3d` di `content-data.json`). Di mobile hotspot diletakkan di tepi kiri dan kanan objek.

**Navbar disembunyikan di halaman imersif:** semua frame Story Bab dan Resources (termasuk state panel dan data benda) tidak lagi menampilkan navbar dan logo (layer disembunyikan, bukan dihapus; tombol panel, kartu narasi, dan kontrol scene digeser ke atas mengisi ruangnya). Akibatnya 52 interaksi prototype dari tautan navbar di frame itu hilang. Sebagai gantinya ada **Tombol Kembali** (Tombol Ikon, ikon Panah Kiri, 44 px) di pojok kiri atas: dari Story kembali ke halaman Cerita (Pengantar), dari Resources kembali ke Beranda (dissolve 0,3 dtk, nilai sementara; interaksi tersambung di desktop, tablet, dan mobile). Di tablet dan mobile tombol panel, penanda placeholder, dan kontrol scene bergeser 56 px ke bawah memberi ruang. Fade-in tombol kembali 0,4–0,9 dtk. Perlu `aria-label` "Kembali ke Beranda" atau "Kembali ke Cerita"; tujuan kembali adalah usulan, belum disetujui tim.

Efek ke tata letak: karena teks lebih panjang, tinggi frame Journey Map, Source, dan Pengantar bertambah. Baris di section Desktop/Tablet/Mobile sudah disusun ulang (jarak 240) dan latar bintang/arsip diperpanjang.

## 6. Aset 3D (repo: `NASA 3D Resources/`)
| Environment | Model | Ukuran | Catatan |
|---|---|---|---|
| Mars v3 | `mars_environment_v3.glb` | 4,6 MB, Draco | satu file untuk semua perangkat; 3 kamera; berat untuk HP low-end; belum diuji di GPU nyata |
| Moon v4 | `lunar_environment_v4.glb` / `_tablet` / `_mobile` | 3,7 / 2,1 / 1,0 MB, Draco | GLB per perangkat; atmosfer Bumi, bintang, dan ambient light tidak ada di GLB (tambahkan di viewer); belum diuji di WebGL |
| Deep Space v1 | `deep_space_environment_v1.glb` | 2,8 MB, tanpa Draco | 46 ribu segitiga; atmosfer di-bake untuk kamera di origin; kiri atas komposisi dikosongkan untuk teks |

- Kamera model: desktop 16:9, tablet 4:3, mobile 9:16. Hero di Figma belum mengikuti rasio ini (1440×849, 768×720, 390×760).
- Loader: Three.js perlu `DRACOLoader` untuk Mars dan Moon.
- Poster/fallback: pakai `renders/*_2560.webp`, `_tablet.webp`, `_mobile.webp` dari tiap paket. Gambar di Figma memakai `previews/*.jpg` (1920×1080) karena Figma tidak merender WebP.
- Untuk produksi cukup salin GLB dan render ke `public/`; folder `.blend`, `.blend1`, `previews.zip`, dan `viewer/vendor` tidak perlu ikut.
- Penamaan file di repo (`snake_case` + versi) berbeda dari konvensi `ASSET_DOCUMENTATION.md` (`kebab-case`); belum diputuskan.
- Kredit: README menyatakan model dibuat di Blender dengan tekstur/medan prosedural (Moon: bukan DEM asli, Bumi hanya garis besar sederhana; Deep Space: bukan data astronomi). Jangan dilabeli sebagai data NASA. Pembuat dan lisensi: TBD.

## 7. Belum final / menunggu keputusan
- **Logo (sudah diputuskan):** panitia tidak mengizinkan logo NASA, jadi navbar memakai logo **NASA Space Apps Challenge** (PNG transparan; kata "NASA" merah, sisanya putih). Layer bernama `Logo Space Apps`: 84 px di desktop, 44 px di Navbar Ringkas (tablet dan mobile; teks "Space Apps Challenge" di ukuran ini hampir tidak terbaca, jadi tampil sebagai lambang). Gambar sumber dari panitia (1920×1080 dengan latar biru) diekstrak menjadi PNG transparan; untuk produksi minta berkas logo resmi (SVG) dari panitia. Posisi logo di desktop masih di x=252, belum sejajar tepi navbar. Foto hero Home menampilkan lambang NASA di badan pendarat (bagian dari foto); teks "Kisah wahana NASA" di Home tidak diubah.
- Persetujuan tiga ukuran teks "usulan" dan semua copy draf (headline, pengantar, teks pendukung, judul bab dalam Bahasa Indonesia).
- Navbar di Resources ditandai "Beranda" (usulan).
- Konsep 3D imersif menggantikan halaman scroll Story Bab dan Resources (disepakati antar tim). Yang belum diputuskan: scene 3D final Bab 1 dan 5, daftar benda dan data per scene, cara pengguna kembali ke "mode baca" (bila diperlukan), dan perilaku kamera (bebas, terpandu, atau terkunci).
- **Latar per halaman:** Story dan Resources memakai scene 3D sebagai latar. **Journey Map** memakai peta bintang (grid lengkung, orbit samar, bintang; tanpa garis rute) dan **Source** memakai latar arsip (gradien slate dengan grain dan grid sangat samar). Keduanya dipasang sebagai potongan berulang bergantian arah (rotasi 180°) dengan mask pudar di tepi, di bawah konten dan di bawah header. Journey Map punya gerak sangat pelan (geser horizontal ±45 px dan napas opasitas 0,7–1,0, timeline 24 dtk, arah berlawanan tiap potongan); Source dibiarkan statis. Untuk web, latar sebaiknya satu lapisan tetap (`position: fixed`) yang bergerak pelan, bukan potongan berulang. **Home** baru punya prototipe Bima Sakti (desktop). Semua gambar latar hasil generate AI beresolusi 1774 px (perlu versi ≥3840 px untuk produksi) dan harus dicatat di halaman Source sebagai ilustrasi buatan AI.
- **Header Story (Pengantar) dan Journey Map:** tidak lagi memakai foto hero Home. Story memakai panorama 3:1 (Bumi, Bulan, wahana, Mars, gugus bintang yang dihubungkan satu garis tipis); Journey Map memakai panorama 3:1 peta navigasi (orbit samar, lintasan putus-putus, Bumi, Bulan, Mars, titik biru). Detail ada di strip atas dan bawah karena teks header rata tengah; di mobile hanya bagian tengah gambar yang tampil. Lapisan Overlay header diturunkan ke opasitas 30% agar gambar terlihat. Source dan Home masih memakai foto lama. Kedua gambar hasil generate AI (2000×672 px; butuh versi 3840 px untuk produksi): catat alat, tanggal, dan prompt di halaman Source.
- Foto lunar lander di hero Home dan header halaman lain: asal dan lisensi belum tercatat.
- Isi konten: dataset misi, daftar sumber, narasi bab, fakta ilmiah, media galeri (semua `TBD`).
- Rasio hero terhadap kamera model, dan performa di perangkat nyata.
- Belum diperiksa: kontras teks satu per satu, prototype di mode present, tampilan di perangkat nyata.
