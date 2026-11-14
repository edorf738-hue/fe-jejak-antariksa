# Catatan Pengerjaan — Zhafran (3D objek dan hotspot; desain dan dokumen)

Aturan dan format entri ada di [README.md](README.md). Entri terbaru di atas.

## Entri

### [2026-11-14] Desain Figma dan dokumen serah terima *(diisi dari riwayat git; Zhafran silakan koreksi atau lengkapi)*
- **Tugas / klaim:** Desain Figma lengkap dan dokumentasi serah terima ke frontend
- **Branch / PR:** langsung ke `main` (commit `bc2daec`, `54a6227`, `04f62e4`, `44df314`, `d7dc27a`, `c634571`, `0cb35e0`, `cb700d8`)
- **Yang dikerjakan:**
  - Desain di Figma (halaman Prototype, tiga ukuran 1440/768/390): design system (token, gaya teks, komponen, set ikon), Home, Story (Pengantar dan empat bab imersif), Resources (Mars, Moon, Deep Space beserta panel), Journey Map, Source, state 3D, interaksi prototype, dan keyframe animasi HUD.
  - Konsep 3D imersif: objek 3D tanpa card, kartu deskripsi di samping, hotspot, kontrol scene, tombol kembali, navbar disembunyikan di halaman imersif.
  - Bab 5 dihapus (cerita kini empat bab); logo NASA diganti logo NASA Space Apps Challenge; header Story, Journey Map, dan Source memakai gambar baru.
  - Dokumen: `FIGMA_HANDOFF.md`, `content-data.json` (data dari dokumen NASA), dan `PEMBAGIAN_TUGAS.md`.
  - Folder `NASA 3D Resources` dikeluarkan dari repo; folder `NASA/` (materi mentah) diabaikan git.
- **File dibuat/diubah:** `docs/FIGMA_HANDOFF.md`, `docs/content-data.json`, `docs/PEMBAGIAN_TUGAS.md`, `.gitignore`
- **Cara menguji:** desain diperiksa lewat tangkapan layar Figma; audit keyframe animasi dan pengukuran kontras teks tercatat di bagian 8 `FIGMA_HANDOFF.md`
- **Hasil uji:** animasi belum diputar di mode present; kontras diukur untuk 8 frame kunci
- **Keputusan teknis & alasan:** lihat `FIGMA_HANDOFF.md` (bagian 7 dan 8) dan keputusan terbuka di `PEMBAGIAN_TUGAS.md`
- **Belum selesai / catatan untuk orang lain:** materi TBD (rover, kredit, lisensi, tanggal akses, logo SVG dari panitia); hotspot 2 dan 3 di tablet dan mobile mengikuti aturan tertulis, bukan frame sendiri
- **Status:** Done
