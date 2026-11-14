# UI/UX GUIDELINE — NASA Hackathon 2026

**Acuan utama desain untuk UI/UX Designer, Claude, dan Figma MCP.**

## 1. Konteks produk
Website menggunakan mixed storytelling dan mixed mission scope. Pengalaman menghubungkan narasi, informasi ilmiah, misi, serta visualisasi environment 3D: Mars, Moon, dan Deep Space.

## 2. Arah visual
Kata kunci: cinematic, immersive, minimalist, futuristic, educational, scientifically credible.

Prinsip:
- 3D menjadi daya tarik, bukan penghalang membaca konten.
- Gunakan hierarki visual dan tipografi yang jelas.
- Hindari dekorasi yang tidak mendukung pemahaman.
- Jaga konsistensi komponen ant halaman.
- Setiap interaksi harus memberi feedback.
- Perhatikan aksesibilitas dan performa.

Gunakan warna, font, ukuran, dan token yang benar-benar ada di file Figma. Jangan mengarang token atau mengganti design system tanpa persetujuan designer.

## 3. Navigasi
Navbar utama: **Home · Story · Journey Map · Source**. Resources adalah bagian pengalaman eksplorasi yang dapat diakses dari Home atau halaman terkait, bukan item navbar wajib.

## 4. Struktur halaman
### Home
Hero 3D, headline, supporting text, CTA utama, pengantar proyek, dan pilihan eksplorasi Mars/Moon/Deep Space.

### Story
Introduction, chapter navigation/progress, judul dan narasi chapter, media pendukung, misi terkait, sumber, previous/next.

### Journey Map
Overview map/visual, destination markers, mission cards/detail. Jangan menggambarkan seluruh misi sebagai satu rute perjalanan fisik jika data tidak mendukung.

### Resources
Konten Mars, Moon, Deep Space. Setiap kategori dapat memiliki visual 3D, ringkasan, fakta, misi terkait, galeri, dan sumber.

### Source
Daftar referensi, organisasi/penerbit, judul, URL, tanggal akses, serta kredit gambar/model.

Headline “Ditinggal Bukan Berarti Dilupakan” adalah kandidat copy, bukan teks final otomatis.

## 5. Komponen
Navbar/nav link, button, hero content, destination/resource card, mission card, information panel/modal, chapter navigation, gallery, source item, loading/error/empty/fallback state.

Gunakan komponen reusable yang sudah ada di Figma sebelum membuat duplikat.

## 6. Integrasi 3D
Desain harus menjelaskan posisi dan proporsi 3D, overlay/gradient untuk keterbacaan, panel informasi, navigasi antar-environment, loading, fallback, dan perilaku mobile. Jangan menganggap aset perlu dibuat ulang sebelum memeriksa file yang tersedia.

## 7. Responsive
- Desktop: manfaatkan ruang untuk komposisi 3D dan konten.
- Tablet: sesuaikan panel, ukuran visual, dan spacing.
- Mobile: susun konten vertikal, tombol mudah disentuh, dan siapkan fallback 3D bila perlu.
Breakpoint final mengikuti frame dan implementasi yang disepakati.

## 8. Interaction states
Default, hover, active/selected, focus, disabled, loading, error, empty. Untuk 3D: loading, loaded, destination selected, information open, transition, fallback.

## 9. Panduan Claude + Figma MCP
Sebelum mengedit:
1. Baca `PROJECT.md`, dokumen ini, dan `CONTENT_REQUIREMENT.md`.
2. Periksa file Figma yang benar: pages, frames, layers, components, variables, styles, Auto Layout, prototype.
3. Laporkan kondisi saat ini dan rencana perubahan.

Saat mengedit:
- Jangan redesign keseluruhan tanpa instruksi.
- Jangan menghapus layer/frame/component tanpa persetujuan.
- Jangan mengubah navigasi atau identitas visual sepihak.
- Jangan membuat fakta ilmiah.
- Hindari duplikasi komponen.

Setelah mengedit:
- Verifikasi hasil pada frame target.
- Laporkan perubahan dan bagian yang belum selesai.
- Jangan menyatakan berhasil sebelum hasil benar-benar diperiksa.

## 10. Handoff ke FE
Sertakan frame/page structure, component hierarchy, token aktual, spacing, asset reference, interaction behavior, responsive behavior, dan loading/error/fallback states.
