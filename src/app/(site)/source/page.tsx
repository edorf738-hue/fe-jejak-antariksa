import type { Metadata } from "next";
import { LatarBerulang, PageHeader } from "@/components/ui";
import { getKatalogSumber, SOURCE_COPY } from "@/data";
import { SumberDaftar } from "./SumberDaftar";

export const metadata: Metadata = { title: "Sumber — Wayang Antariksa" };

/**
 * Sumber: katalog referensi, kredit media, dan model 3D dengan tab, kartu ringkas, dan detail sumber. Sumber desain:
 * Figma `Source` (1440), `Source (Tablet)` (768), `Source (Mobile)` (390).
 */
export default function SourcePage() {
  return (
    <>
      <PageHeader {...SOURCE_COPY.header} gambar="/images/source/header-sumber.webp" />
      <div className="relative flex-1">
        <LatarBerulang gambar="/images/source/latar-arsip.webp" />
        <SumberDaftar katalog={getKatalogSumber()} />
      </div>
    </>
  );
}
