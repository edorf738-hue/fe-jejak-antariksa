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
      <PageHeader {...SOURCE_COPY.header} gambar="/images/source/header-sumber-nasa.webp" />
      {/* Pangkal section: gradien dari warna dasar header (#10131b) agar sambungan header ke latar tidak terlihat. */}
      <div className="relative flex-1 bg-[linear-gradient(to_bottom,#10131b_0,transparent_260px)] bg-no-repeat">
        <LatarBerulang gambar="/images/source/latar-arsip-nasa.webp" />
        <SumberDaftar katalog={getKatalogSumber()} />
      </div>
    </>
  );
}
