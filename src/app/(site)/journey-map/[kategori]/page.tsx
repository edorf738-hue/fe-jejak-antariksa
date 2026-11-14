import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, LatarBerulang, PageHeader, PenandaDestinasi } from "@/components/ui";
import { getJourneyTujuan, isKategoriSlug, JOURNEY_COPY, KATEGORI_SLUGS, type KategoriSlug } from "@/data";
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
  return { title: `Peta Perjalanan: ${isKategoriSlug(kategori) ? getJourneyTujuan(kategori).kategori.nama : ""} — Wayang Antariksa` };
}

/** Posisi penanda di kotak peta (persen lebar, px tinggi): mobile / tablet-desktop. */
const POSISI: Record<KategoriSlug, string> = {
  moon: "left-[6.7%] top-[29px] md:left-[11.75%] md:top-[59px]",
  mars: "left-[29.5%] top-[249px] md:left-[44.87%] md:top-[229px]",
  "deep-space": "left-[52.3%] top-[29px] md:left-[77.2%] md:top-[79px]",
};

const GAMBAR_PENANDA: Record<KategoriSlug, string> = {
  moon: "/images/journey-map/penanda-moon.webp",
  mars: "/images/journey-map/penanda-mars.webp",
  "deep-space": "/images/journey-map/penanda-deep-space.webp",
};

export default async function JourneyMapPage(props: PageProps<"/journey-map/[kategori]">) {
  const { kategori } = await props.params;
  if (!isKategoriSlug(kategori)) notFound();
  const tujuan = getJourneyTujuan(kategori);

  return (
    <>
      <PageHeader {...JOURNEY_COPY.header} gambar="/images/journey-map/header-peta.webp" />
      <div className="relative flex-1">
        <LatarBerulang gambar="/images/journey-map/latar-peta-bintang.webp" opacity={0.9} />
        <Container className="relative flex flex-col gap-10 pb-16 pt-10 md:gap-12 md:pb-[72px] md:pt-14 lg:gap-14 lg:pb-24 lg:pt-[72px]">
          <section aria-labelledby="judul-peta" className="flex flex-col gap-6">
            <h2 id="judul-peta" className="text-heading-card text-text-primary-normal md:text-heading-section">
              {JOURNEY_COPY.peta.judul}
            </h2>
            <nav
              aria-label="Tujuan"
              className="relative h-[560px] overflow-hidden rounded-card border border-archive-slate-normal bg-bg-secondary-normal md:h-[520px]"
            >
              {KATEGORI_SLUGS.map((slug) => (
                <PenandaDestinasi
                  key={slug}
                  className={`absolute ${POSISI[slug]}`}
                  label={slug === kategori ? tujuan.kategori.nama : getJourneyTujuan(slug).kategori.nama}
                  href={`/journey-map/${slug}`}
                  gambar={GAMBAR_PENANDA[slug]}
                  terpilih={slug === kategori}
                />
              ))}
              <p className="text-body-large absolute left-[23px] top-[449px] w-[294px] text-text-secondary-normal md:left-[35px] md:top-[467px] md:w-auto md:whitespace-nowrap">
                {JOURNEY_COPY.peta.catatan}
              </p>
            </nav>
          </section>

          <DetailDestinasi key={kategori} tujuan={tujuan} />
        </Container>
      </div>
    </>
  );
}
