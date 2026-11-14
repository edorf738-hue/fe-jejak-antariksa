import { Container, LatarBerulang, PageHeader, PanelStatus, PenandaDestinasi } from "@/components/ui";
import { getJourneyTujuan, getKategori, JOURNEY_COPY, KATEGORI_SLUGS, STATUS_COPY, type KategoriSlug } from "@/data";
import { DetailDestinasi } from "./[kategori]/DetailDestinasi";

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

/**
 * Halaman Peta Perjalanan. Tanpa `slug` (belum ada tujuan dipilih) bagian detail diganti
 * panel state Kosong. Peta bersifat simbolis: bukan rute, jarak, atau skala sebenarnya.
 */
export function PetaPerjalanan({ slug }: { slug?: KategoriSlug }) {
  const tujuan = slug ? getJourneyTujuan(slug) : null;

  return (
    <>
      <PageHeader {...JOURNEY_COPY.header} gambar="/images/journey-map/header-peta.webp" />
      <div className="relative flex-1">
        <LatarBerulang gambar="/images/journey-map/latar-peta-bintang.webp" animasi />
        <Container className="relative flex flex-col gap-10 pb-16 pt-10 md:gap-12 md:pb-[72px] md:pt-14 lg:gap-14 lg:pb-24 lg:pt-[72px]">
          <section aria-labelledby="judul-peta" className="flex flex-col gap-6">
            <h2 id="judul-peta" className="text-heading-card text-text-primary-normal md:text-heading-section">
              {JOURNEY_COPY.peta.judul}
            </h2>
            <nav
              aria-label="Tujuan"
              className="relative h-[560px] overflow-hidden rounded-card border border-archive-slate-normal bg-bg-secondary-normal md:h-[520px]"
            >
              {KATEGORI_SLUGS.map((s) => (
                <PenandaDestinasi
                  key={s}
                  className={`absolute ${POSISI[s]}`}
                  label={getKategori(s).nama}
                  href={`/journey-map/${s}`}
                  gambar={GAMBAR_PENANDA[s]}
                  terpilih={s === slug}
                />
              ))}
              <p className="text-body-large absolute left-[23px] top-[449px] w-[294px] text-text-secondary-normal md:left-[35px] md:top-[467px] md:w-auto md:whitespace-nowrap">
                {JOURNEY_COPY.peta.catatan}
              </p>
            </nav>
          </section>

          {tujuan ? (
            <DetailDestinasi key={slug} tujuan={tujuan} />
          ) : (
            <PanelStatus varian="kosong" {...STATUS_COPY.tujuanKosong} />
          )}
        </Container>
      </div>
    </>
  );
}
