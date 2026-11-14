# SPRINT — NASA Hackathon 2026

**Status:** Rencana kerja awal. Sesuaikan durasi dengan sisa waktu hackathon yang sebenarnya.

## Struktur tim
| Peran | Jumlah | Tanggung jawab |
|---|---:|---|
| UI/UX Designer | 1 | Figma, user flow, desain dan handoff |
| Frontend Developer | 2 | UI, 3D, routing, integrasi API |
| Backend Developer | 1 | Schema, API, data, validasi |

Nama anggota dan PIC per tugas: **TBD**.

## Pembagian workstream
### UI/UX Designer
- Finalisasi sitemap dan user flow.
- Audit desain Figma yang sudah ada.
- Finalisasi Home, Story, Journey Map, Source, dan Resources section.
- Tentukan responsive layout, komponen, serta interaction states.
- Handoff spesifikasi ke FE.

### FE 1 — Experience & 3D
- Setup aplikasi dan routing dasar bersama FE 2.
- Implementasi hero dan environment 3D.
- Loading, error, dan fallback state.
- Optimasi ukuran dan waktu muat model.

### FE 2 — Content & Interface
- Navbar dan sistem layout.
- Implementasi Story, Journey Map, Source, dan Resources.
- Komponen kartu, panel detail, chapter navigation, dan galeri.
- Integrasi API/mock data serta responsive layout.

### BE — Data & API
- Finalisasi struktur data bersama FE.
- Implementasi schema dan endpoint yang benar-benar dibutuhkan.
- Menyiapkan data objek, misi, story, media, dan source.
- Validasi data dan menyediakan contoh response.
- Dokumentasi cara menjalankan backend.

## Fase kerja
1. **Align:** scope MVP, PIC, repository, prioritas.
2. **Design & contract:** Figma handoff, schema, API contract.
3. **Build parallel:** FE/BE/konten berjalan paralel menggunakan mock data bila API belum siap.
4. **Integrate:** hubungkan UI, API, dan 3D sedini mungkin.
5. **Stabilize:** perbaiki bug, performa, responsive, dan fallback.
6. **Demo:** siapkan alur presentasi dan build stabil.

## Prioritas
- **P0:** navigasi, Home, tiga environment atau fallback, konten inti tiga kategori, Story ringkas, Journey Map dengan misi terverifikasi, Source/credits, build demo stabil.
- **P1:** detail misi lebih lengkap, galeri tambahan, filter sederhana, animasi lanjutan.
- **P2:** akun pengguna, CMS kompleks, simulasi kompleks, model 3D tambahan.

## Definition of Done
Tugas selesai jika acceptance criteria terpenuhi, sudah diuji, tidak merusak fitur lain, state penting ditangani, fakta memiliki sumber, dan perubahan terdokumentasi.

## Koordinasi
Gunakan status `Todo`, `In Progress`, `Review`, `Done`, `Blocked`. Lakukan checkpoint singkat dan integrasi berkala. Bekukan penambahan fitur sebelum demo.

## Risiko dan mitigasi
- Model 3D berat: optimasi, lazy loading, fallback.
- API terlambat: FE memakai mock sesuai kontrak.
- Data belum lengkap: batasi dataset P0.
- Scope melebar: tunda P1/P2.

Tanggal hackathon, jadwal checkpoint, nama anggota, dan PIC final: **TBD**.
