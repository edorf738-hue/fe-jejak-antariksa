import chapters from "./api/chapters.json";
import journeys from "./api/journeys.json";
import galleries from "./api/galleries.json";
import sceneObjects from "./api/scene-objects.json";
import sourceCatalog from "./api/source-catalog.json";
import type { CeritaBab } from "./cerita";
import type { JourneyTujuan } from "./journey";
import type { MediaBenda } from "./media";
import type { SumberItem } from "./source";
import type { DataBenda } from "./types";

/**
 * Konten dari backend (be-wayang-antariksa). Berkas di ./api/*.json adalah snapshot yang diperbarui `npm run data:sync`
 * (otomatis sebelum build bila API_URL diatur); jangan diedit tangan, ubah datanya di backend.
 * Fungsi di bawah hanya memetakan nama field API (Inggris) ke bentuk yang dipakai komponen (Indonesia).
 */
type ChapterApi = (typeof chapters)[number];
type ObjectApi = (typeof sceneObjects)[number];

export function chapterToCerita(c: ChapterApi): CeritaBab {
  return {
    slug: c.slug,
    babId: c.chapter_number,
    nomor: String(c.chapter_number).padStart(2, "0"),
    judul: c.title,
    ringkasan: c.summary,
    hero: c.hero,
    pengantar: c.intro,
    bagian: c.sections,
    galeri: c.gallery,
    video: c.videos,
    fakta: c.facts,
    artefak: c.artifacts,
    tiga3d: c.scene,
    sumber: c.sources,
  } as CeritaBab;
}

export const CERITA_API: CeritaBab[] = chapters.map(chapterToCerita);

const toBenda = (o: ObjectApi): DataBenda =>
  ({ id: o.id, hotspot: o.hotspot, nama: o.name, kategori: o.label, deskripsi: o.description, fakta: o.fact, sumber: o.source, model3d: o.model3d }) as DataBenda;

/** Semua benda (hotspot) satu bab, berurutan seperti di scene. */
export const bendaBab = (babId: number): DataBenda[] => sceneObjects.filter((o) => o.chapter_number === babId).map(toBenda);

export const MEDIA_API: Record<string, MediaBenda> = Object.fromEntries(
  sceneObjects.filter((o) => o.media.length > 0 || o.model_note).map((o) => [o.id, { media: o.media, ...(o.model_note ? { catatanModel: o.model_note } : {}) } as MediaBenda]),
);

export const GALERI_API = Object.fromEntries(galleries.map((g) => [g.slug, g.photos])) as Record<"moon" | "mars" | "deep-space", { src: string; keterangan: string; kredit: string }[]>;

export const KATALOG_API = sourceCatalog as unknown as SumberItem[];

export const JOURNEYS_API = journeys as unknown as (JourneyTujuan & { slug: string })[];

/** Bab untuk halaman cerita/imersif: judul, narasi, ringkasan, hotspot, dan semua benda. */
export const BAB_API = chapters.map((c) => ({
  id: c.chapter_number,
  judul: c.title,
  status: c.status,
  narasi: c.narration,
  ringkasan: c.summary,
  hotspot: c.hotspots,
  benda: bendaBab(c.chapter_number),
})) as unknown as import("./types").Bab[];
