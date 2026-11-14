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

Belum ada state Disabled untuk komponen non-Button, dan belum ada state loading/error di tingkat komponen (state halaman ada di bagian 5).

## 4. Halaman dan frame (halaman Prototype)
Setiap halaman punya versi Desktop / Tablet / Mobile; flow prototype terdaftar per breakpoint.

| Halaman | Frame |
|---|---|
| Home | `Home — Desktop` (hero foto, CTA, pengantar, pilihan Mars/Moon/Deep Space), `Home — Tablet`, `Home — Mobile` |
| Story | `Story — Pengantar` (daftar 5 bab), `Story — Bab 1…5` (judul, stepper progres, narasi, media, misi terkait, sumber, sebelumnya/berikutnya) |
| Journey Map | `Journey Map — Moon`, `— Mars`, `— Deep Space` (peta simbolis, misi terkait, detail misi, sumber) + panel state Kosong/Memuat/Galat |
| Source | `Source` (filter kategori, referensi, kredit gambar, kredit model 3D) + panel Kosong |
| Resources | `Resources — Mars`, `— Moon`, `— Deep Space` (viewer 3D, ringkasan, bagian khas kategori, fakta, misi, galeri, sumber) |

Resources tidak ada di navbar; diakses dari kartu environment di Home. Section `Resources — Referensi Aset (lama)` hanya acuan aset.

## 5. State dan interaksi
- **State 3D hero** (section **State 3D**): Loading, Loaded (Moon), Destination selected (Mars, Deep Space), Information open (Mars, Deep Space), Transition, Fallback. Durasi/easing transisi: TBD.
- **Interaksi prototype** (dissolve 0,3 dtk, nilai sementara): navbar antar halaman (desktop), kartu Home → Resources, tab kategori Resources, penanda Journey Map antar destinasi, daftar bab → bab, sebelumnya/berikutnya antar bab, tab dan panel di state 3D, tombol menu Navbar Ringkas (buka/tutup). Tautan di dalam menu terbuka dan stepper bab belum disambungkan.
- **Spesifikasi integrasi 3D** (usulan) ada di kotak teks dalam section State 3D.

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
- Penggunaan logo NASA di navbar dan posisinya (di Figma masih di x=252, belum sejajar tepi navbar).
- Persetujuan tiga ukuran teks "usulan" dan semua copy draf (headline, pengantar, teks pendukung, judul bab dalam Bahasa Indonesia).
- Navbar di Resources ditandai "Beranda" (usulan).
- Foto lunar lander di hero Home dan header halaman lain: asal dan lisensi belum tercatat.
- Isi konten: dataset misi, daftar sumber, narasi bab, fakta ilmiah, media galeri (semua `TBD`).
- Rasio hero terhadap kamera model, dan performa di perangkat nyata.
- Belum diperiksa: kontras teks satu per satu, prototype di mode present, tampilan di perangkat nyata.
