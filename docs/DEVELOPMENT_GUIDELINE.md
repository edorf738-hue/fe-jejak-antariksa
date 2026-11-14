# DEVELOPMENT GUIDELINE — NASA Hackathon 2026

## Tujuan
Menetapkan aturan implementasi dan kolaborasi agar FE, BE, dan integrasi aset berjalan konsisten.

## Prinsip
Fokus MVP, integrasi sejak awal, hindari overengineering, gunakan data terverifikasi, jaga performa 3D, dan dokumentasikan keputusan teknis.

## Stack teknologi
| Area | Pilihan |
|---|---|
| Frontend framework | TBD |
| Styling/UI | TBD |
| 3D renderer | TBD |
| Backend framework | TBD |
| Database | TBD |
| Deployment | TBD |
| Package manager | TBD |

Jangan menganggap stack tertentu sudah disepakati sebelum tim mengonfirmasinya.

## Struktur repository yang disarankan
```text
project-root/
├── docs/
│   ├── PROJECT.md
│   ├── SPRINT.md
│   ├── UI_UX_GUIDELINE.md
│   ├── CONTENT_REQUIREMENT.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── ASSET_DOCUMENTATION.md
│   └── DEVELOPMENT_GUIDELINE.md
├── frontend/
├── backend/
├── assets/
├── README.md
├── .gitignore
└── .env.example
```
Sesuaikan dengan struktur monorepo/framework yang akhirnya dipilih.

## Branch dan commit
Branch sederhana: `main`, `feat/<nama-fitur>`, `fix/<nama-bug>`. Contoh commit: `feat: add home hero`, `fix: handle 3d fallback`, `docs: update api contract`.

## Frontend
- Buat komponen reusable dan pisahkan UI/data/logic.
- Ikuti Figma dan design token aktual.
- Tangani loading, error, dan empty state.
- Optimalkan pemuatan model 3D; lazy-load bila sesuai.
- Sediakan fallback untuk perangkat/peramban yang tidak mendukung 3D.
- Jangan hardcode fakta yang seharusnya berasal dari data.

## Backend
- Ikuti `DATABASE_SCHEMA.md` dan `API_DOCUMENTATION.md`.
- Validasi input dan konsistenkan response/error.
- Gunakan environment variables.
- Sediakan seed/mock data.
- Catat sumber data dan waktu verifikasi status misi.

## Integrasi 3D
Verifikasi format dan ukuran; tampilkan loading; sediakan fallback; jangan memuat semua environment sekaligus tanpa kebutuhan; uji pointer dan touch; jaga keterbacaan UI.

## Keamanan
Sediakan `.env.example` tanpa secret. Jangan commit `.env`. Jangan menaruh API key privat di frontend. Validasi input dan atur CORS sesuai environment.

## Accessibility dan responsive
Gunakan semantic HTML, keyboard navigation, focus state yang terlihat, kontras memadai, alt text untuk gambar informatif, dan jangan mengandalkan warna saja. Uji desktop serta mobile.

## Testing minimum
- **FE:** navigasi, CTA, render halaman, 3D loading/fallback, responsive.
- **BE:** endpoint sukses, not found, parameter tidak valid, error server, relasi data.
- **Integrasi:** FE-BE, data kosong/error, media/3D, alur demo.

## Review
Perubahan sebaiknya mencantumkan tujuan, file terdampak, cara menguji, screenshot untuk perubahan UI, serta risiko/pekerjaan tersisa.

## Definition of Ready
Tujuan, PIC, acceptance criteria, dependency, dan sumber desain/data/API sudah jelas.

## Definition of Done
Kriteria terpenuhi, diuji, tidak ada bug kritis yang diketahui, dokumentasi relevan diperbarui, dan perubahan direview/diintegrasikan.

## Keputusan teknis TBD
Stack, database/ORM, library 3D, hosting, testing framework, strategi pengambilan data NASA, dan batas rate limit layanan eksternal.
