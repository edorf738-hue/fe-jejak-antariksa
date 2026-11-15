import type { ReactNode } from "react";
import { Container, LatarBerulang, PageHeader, revealKata, SplitText } from "@/components/ui";
import { getKategori, JOURNEY_COPY, KATEGORI_SLUGS } from "@/data";
import { getLang } from "@/lib/lang-server";
import { PanggungPeta, type TujuanPeta } from "./PanggungPeta";

/**
 * Layout Peta Perjalanan: header, latar peta bintang, judul, dan panggung peta ditaruh DI LAYOUT agar
 * tidak dimuat ulang saat pindah tujuan (Next memasang ulang halaman saat parameter rute berganti, tetapi
 * tidak layout): planet tetap berputar dan animasi masuk tidak berulang; jalur dan cincin pilihan
 * berpindah dengan transisi. `children` = bagian detail tujuan (halaman) atau panel Kosong.
 * Peta bersifat simbolis: bukan rute, jarak, atau skala sebenarnya. Sumber desain: Figma `Journey Map`.
 */
export default async function JourneyMapLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  const copy = JOURNEY_COPY[lang];
  const daftar: TujuanPeta[] = KATEGORI_SLUGS.map((slug) => {
    const { nama, misi } = getKategori(slug, lang);
    return { slug, nama, misi: misi.filter((m): m is NonNullable<typeof m> => !!m).slice(0, 3).map((m) => m.nama) };
  });
  return (
    <>
      <PageHeader {...copy.header} gambar="/images/journey-map/header-peta-nasa.webp" />
      {/* Pangkal section: gradien dari warna dasar header (#10131b) agar sambungan header ke latar tidak terlihat. */}
      <div className="relative flex-1 bg-[linear-gradient(to_bottom,#10131b_0,transparent_260px)] bg-no-repeat">
        <LatarBerulang gambar="/images/journey-map/latar-peta-bintang-nasa.webp" />
        <Container className="relative flex flex-col gap-10 pb-16 pt-10 md:gap-12 md:pb-[72px] md:pt-14 lg:gap-14 lg:pb-24 lg:pt-[72px]">
          <section aria-labelledby="judul-peta" className="flex flex-col gap-6">
            <h2
              id="judul-peta"
              className="text-heading-card text-text-primary-normal md:text-heading-section"
              {...revealKata(0)}
            >
              <SplitText>{copy.peta.judul}</SplitText>
            </h2>
            <PanggungPeta daftar={daftar} catatan={copy.peta.catatan} />
          </section>
          {children}
        </Container>
      </div>
    </>
  );
}
