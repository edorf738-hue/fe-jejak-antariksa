# CATATAN PENGERJAAN

Folder ini adalah **buku catatan kerja tim**. Setiap orang yang mengubah file di repo mencatat apa yang ia kerjakan, supaya (1) ada dokumentasi, dan (2) anggota lain, termasuk Dhika saat merge, tahu apa yang sudah dibuat per orang dan tidak mengerjakan hal yang sama dua kali.

## Cara pakai
- **Satu orang, satu file.** Tulis hanya di file milikmu: `dhika.md`, `edo.md`, `zhafran.md`, `pace.md`. Dengan begitu catatan tidak pernah bentrok saat merge. Jangan mengedit file catatan orang lain.
- **Entri baru ditaruh paling atas** (terbaru di atas) di bawah garis `## Entri`.
- **Kapan menulis:** setiap kali sebuah pekerjaan selesai atau siap direview, **sebelum PR dibuka**. Satu PR minimal satu entri. Jangan menunggu akhir hari.
- **Dhika tidak merge PR yang belum punya entri catatan** (masuk checklist review di `PEMBAGIAN_TUGAS.md`). Catatan juga dipakai Dhika untuk mencocokkan apakah ada isi yang kembar antar branch.
- Catatan di folder ini ikut di-commit bersama PR-nya, jadi ia berada di branch yang sama dengan kodenya.
- `merge-log.md` hanya diisi Dhika (urutan merge, hasil uji gabungan, isi kembar yang ditemukan dan keputusannya).

## Format entri (salin dan isi)
```markdown
### [YYYY-MM-DD] Judul singkat pekerjaan
- **Tugas / klaim:** <nama komponen atau halaman, sesuai tabel klaim di PEMBAGIAN_TUGAS.md>
- **Branch / PR:** `feat/...` / <tautan PR atau "belum dibuka">
- **Yang dikerjakan:** <1–5 butir, apa yang kini ada atau berubah>
- **File dibuat/diubah:** <daftar file atau folder utama>
- **Cara menguji:** <langkah singkat; perintah yang dijalankan; layar yang dicek (1440/768/390)>
- **Hasil uji:** <lolos / tidak lolos dan kenapa; jujur soal yang belum diuji>
- **Keputusan teknis & alasan:** <bila ada; library, pola, kompromi>
- **Belum selesai / catatan untuk orang lain:** <sisa pekerjaan, blocker, hal yang perlu diketahui orang lain>
- **Status:** Todo | In Progress | Review | Done | Blocked
```

## Aturan penulisan
1. **Faktual dan singkat.** Tulis apa yang benar-benar sudah ada di kode, bukan rencana. Rencana masuk ke "Belum selesai".
2. **Jujur soal pengujian.** Jangan menulis "sudah jalan" bila belum dijalankan; tulis "belum diuji di mobile", "belum diuji di perangkat nyata", dan sebagainya.
3. **Sebut nama komponen dan file** supaya orang lain bisa mencarinya, dan supaya Dhika bisa mengecek tumpang tindih.
4. **Catat hal yang menyentuh milik orang lain** (file bersama, folder orang lain, perubahan kontrak antarmuka) dan sebutkan siapa yang sudah diberi tahu.
5. **Catat keputusan teknis** (library yang dipilih, alasan memilih satu pendekatan) agar tidak diperdebatkan ulang.
6. Jangan menaruh rahasia (kunci API, token, isi `.env`) di catatan.
7. Perbarui entri yang sama bila statusnya berubah (mis. Review → Done) daripada membuat entri baru untuk pekerjaan yang sama.

## Hubungan dengan dokumen lain
- `../PEMBAGIAN_TUGAS.md`: siapa memegang apa dan tabel klaim tugas. Catatan di sini adalah **hasilnya**.
- `../FIGMA_HANDOFF.md` dan `../content-data.json`: sumber desain dan data. Bila pekerjaanmu mengubah kesepakatan desain atau data, catat juga di sini dan beri tahu Dhika.
- `../SPRINT.md`: prioritas P0/P1/P2.

## Daftar file
| File | Pemilik |
|---|---|
| `dhika.md` | Dhika (PM) |
| `edo.md` | Edo (3D scene) |
| `zhafran.md` | Zhafran (3D objek dan hotspot; juga desain dan dokumen) |
| `pace.md` | Pace (UI per section) |
| `merge-log.md` | Dhika (log merge) |
