# API DOCUMENTATION — NASA Hackathon 2026

**Draft API contract.** Base URL, framework, dan deployment masih TBD.

## Konvensi
- Format JSON UTF-8.
- Tanggal ISO 8601.
- ID berupa string.
- Error response konsisten.
- Endpoint publik MVP tidak membutuhkan autentikasi kecuali ada kebutuhan baru.
- Base URL contoh: `/api/v1` (sesuaikan dengan implementasi).

## Endpoint usulan
| Method | Endpoint | Kegunaan |
|---|---|---|
| GET | `/api/v1/objects` | Daftar objek eksplorasi |
| GET | `/api/v1/objects/:slug` | Detail objek |
| GET | `/api/v1/stories` | Daftar chapter |
| GET | `/api/v1/stories/:slug` | Detail chapter |
| GET | `/api/v1/missions` | Daftar misi |
| GET | `/api/v1/missions/:slug` | Detail misi |
| GET | `/api/v1/sources` | Daftar sumber |
| GET | `/api/v1/media` | Daftar media bila diperlukan |

Query opsional: `category`, `destination`, `status`, `limit`, `offset`. Implementasikan hanya yang dibutuhkan UI.

## Contoh response objek
```json
{
  "data": [{
    "id": "object-mars",
    "slug": "mars",
    "name": "Mars",
    "category": "mars",
    "short_description": "Deskripsi yang sudah diverifikasi.",
    "model_asset": {
      "url": "/assets/3d/mars.glb",
      "format": "glb"
    },
    "sources": [{
      "title": "Judul referensi",
      "url": "https://example.org"
    }]
  }],
  "meta": { "count": 1 }
}
```
Contoh di atas hanya ilustrasi bentuk kontrak. Ganti data dan URL contoh dengan aset serta sumber aktual.

## Error response
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource tidak ditemukan."
  }
}
```

Status umum: `200` sukses, `400` parameter tidak valid, `404` tidak ditemukan, `500` kesalahan server.

## Penanganan di frontend
- Loading: skeleton/indikator.
- Empty: pesan bahwa data belum tersedia.
- Error: pesan ramah dan opsi retry.
- Partial data: tampilkan bagian yang tersedia tanpa mengarang nilai.

## Kontrak integrasi FE-BE
1. Sepakati nama field dan tipe data.
2. BE sediakan contoh response.
3. FE gunakan mock data yang mengikuti kontrak.
4. Perubahan kontrak dikomunikasikan.
5. Uji endpoint dengan data aktual.
6. Jangan mengubah response shape tanpa koordinasi.

Base URL, framework, CORS, autentikasi, hosting, dan rate limit: **TBD**. Jangan commit API key atau secret.
