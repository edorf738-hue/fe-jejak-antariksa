# ASSET DOCUMENTATION — NASA Hackathon 2026

## Tujuan
Mencatat aset visual dan multimedia yang dipakai website, terutama environment 3D yang telah dibuat serta data visual NASA yang akan dikumpulkan.

## Environment 3D utama
| Environment | Fungsi | Status awal |
|---|---|---|
| Mars | Background/visual eksplorasi Mars | Sudah dibuat; perlu validasi file dan integrasi |
| Moon | Background/visual eksplorasi Bulan | Sudah dibuat; perlu validasi file dan integrasi |
| Deep Space | Background/visual deep space | Sudah dibuat; perlu validasi file dan integrasi |

Status “dibuat” tidak otomatis berarti siap produksi. Verifikasi file aktual, format, ukuran, material, lisensi, dan performa.

## Template inventaris aset
Catat untuk setiap aset:
- `asset_id`, `asset_name`, `category`
- `related_page`, `related_object_or_mission`
- `file_path_or_url`, `format`, `file_size`, `dimensions`
- `attribution`, `license_or_usage`
- `optimization_status`, `owner`

## Struktur folder usulan
```text
assets/
├── 3d/
│   ├── mars/
│   ├── moon/
│   └── deep-space/
├── images/
│   ├── mars/
│   ├── moon/
│   ├── deep-space/
│   └── missions/
├── videos/
├── textures/
├── icons/
└── fonts/
```

## Validasi model 3D
Periksa file dapat dibuka, format kompatibel dengan renderer FE, skala/orientasi benar, material/tekstur termuat, ukuran file tercatat, performa diuji, fallback tersedia, serta asal dan ketentuan penggunaan dicatat.

## Validasi gambar/media NASA
Catat URL halaman sumber, judul media, kredit fotografer/organisasi, tanggal akses, ketentuan penggunaan, resolusi/format, dan halaman yang memakai media. Jangan menganggap setiap aset pada situs NASA otomatis bebas dari ketentuan pihak ketiga.

## Penamaan
Gunakan lowercase dan kebab-case. Contoh konvensi: `mars-environment.glb`, `moon-environment.glb`, `deep-space-environment.glb`. Nama ini contoh, bukan klaim bahwa file tersebut sudah ada.

## Status aset
`DISCOVERED` → `DOWNLOADED` → `LICENSE_CHECK` → `OPTIMIZATION` → `READY` → `INTEGRATED`.

## Checklist
- [ ] Lokasi file diketahui.
- [ ] Format dan ukuran dicatat.
- [ ] File dapat dibuka.
- [ ] Kredit/ketentuan penggunaan dicatat.
- [ ] Optimasi dilakukan bila perlu.
- [ ] FE berhasil memuat aset.
- [ ] Fallback tersedia.
