# DATABASE SCHEMA — NASA Hackathon 2026

**Draft logical schema.** Ini bukan migrasi SQL final; sesuaikan dengan database dan ORM yang dipilih.

## Prinsip
Gunakan ID stabil, pisahkan entitas dari media, simpan URL sumber/atribusi, gunakan tanggal ISO 8601, dan jangan menyimpan file 3D besar sebagai blob database.

## Tabel inti
### `space_objects`
- `id` (PK)
- `slug` (unique)
- `name`
- `category` (`mars`, `moon`, `deep_space`)
- `short_description`
- `overview`
- `created_at`, `updated_at`

### `stories`
- `id` (PK)
- `slug` (unique)
- `title`
- `chapter_number`
- `summary`
- `body`
- `cover_media_id` (nullable FK)
- `published`
- `sort_order`

### `missions`
- `id` (PK)
- `slug` (unique)
- `name`
- `agency`
- `destination_object_id` (nullable FK)
- `spacecraft`
- `launch_date`
- `arrival_date`
- `status`
- `status_verified_at`
- `objective`
- `discoveries`

### `media_assets`
- `id` (PK)
- `title`
- `asset_type` (`image`, `video`, `model_3d`, `texture`, `audio`, `other`)
- `url`
- `thumbnail_url`
- `format`
- `file_size_bytes`
- `attribution`
- `usage_notes`

### `sources`
- `id` (PK)
- `title`
- `publisher`
- `url`
- `source_type`
- `accessed_at`
- `notes`

## Tabel relasi
- `mission_sources(mission_id, source_id)`
- `object_sources(space_object_id, source_id)`
- `story_sources(story_id, source_id)`
- `mission_media(mission_id, media_asset_id, role)`
- `object_media(space_object_id, media_asset_id, role)`
- `story_missions(story_id, mission_id)`

Jika satu misi dapat memiliki beberapa destinasi, gunakan tabel junction `mission_destinations` alih-alih satu FK tujuan.

## Metadata 3D
Simpan format, URL/path, ukuran file, thumbnail, atribusi/lisensi, environment terkait, dan status optimasi pada `media_assets`.

## Validasi
Slug unik; kategori dibatasi; URL valid; tanggal tidak ditebak; status disertai waktu verifikasi; konten faktual memiliki sumber; foreign key valid.

## TBD
Database engine, ORM, strategi migration, format ID, soft delete, dan seed data. Untuk MVP, static JSON dapat dipakai sementara dengan struktur field yang konsisten.
