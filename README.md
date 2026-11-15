# Jejak Antariksa

Situs (produksi, otomatis di-deploy dari branch `main` lewat Vercel): **https://jejak-antariksa.vercel.app**

## Menjalankan
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # sebelum build, `npm run data:sync` memperbarui data dari backend bila API_URL diatur
```
Konten diambil dari snapshot `src/data/api/*.json` (diperbarui dari backend `be-jejak-antariksa` lewat `npm run data:sync`); tanpa `API_URL`, snapshot yang di-commit dipakai. Backend belum di-deploy: situs tidak membutuhkannya saat berjalan.
