import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJourneyTujuan, isKategoriSlug, KATEGORI_SLUGS } from "@/data";
import { getLang } from "@/lib/lang-server";
import { DetailDestinasi } from "./DetailDestinasi";

/**
 * Peta Perjalanan per tujuan (Moon, Mars, Deep Space). Sumber desain: Figma
 * `Journey Map — Moon/Mars/Deep Space` (1440), `(Tablet)` (768), `(Mobile)` (390).
 * Peta bersifat simbolis: bukan rute, jarak, atau skala sebenarnya.
 */
export function generateStaticParams() {
  return KATEGORI_SLUGS.map((kategori) => ({ kategori }));
}

export async function generateMetadata(props: PageProps<"/journey-map/[kategori]">): Promise<Metadata> {
  const { kategori } = await props.params;
  const lang = await getLang();
  return { title: `${lang === "en" ? "Journey Map" : "Peta Perjalanan"}: ${isKategoriSlug(kategori) ? getJourneyTujuan(kategori, lang).kategori.nama : ""} — Jejak Antariksa` };
}

export default async function JourneyMapPage(props: PageProps<"/journey-map/[kategori]">) {
  const { kategori } = await props.params;
  if (!isKategoriSlug(kategori)) notFound();
  const lang = await getLang();
  // Peta (planet, jalur) ada di layout; halaman ini hanya detail tujuan, dimuat ulang per tujuan agar reveal-nya berulang.
  return <DetailDestinasi key={kategori} tujuan={getJourneyTujuan(kategori, lang)} />;
}
