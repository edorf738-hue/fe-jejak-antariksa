import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DokKategori, HalamanImersif, PanelFakta, PanelGaleri, PanelMisi, PanelSumber } from "@/components/hud";
import { getResourcesImersif, isKategoriSlug, KATEGORI_SLUGS } from "@/data";
import { ImersifScene } from "@/components/three/scene/ImersifScene";
import { SceneProvider } from "@/components/three/scene/scene-context";

/**
 * Resources (Mars, Moon, Deep Space) sebagai tampilan imersif satu layar, diakses dari kartu
 * Pilih Lingkungan di Beranda. Tidak ada di navbar. Sumber desain: Figma `Resources — Mars/Moon/Deep Space`
 * (1440x900), `(Tablet)`, `(Mobile)`, plus frame panel Fakta, Misi Terkait, Galeri, Sumber.
 */
export function generateStaticParams() {
  return KATEGORI_SLUGS.map((kategori) => ({ kategori }));
}

export async function generateMetadata(props: PageProps<"/resources/[kategori]">): Promise<Metadata> {
  const { kategori } = await props.params;
  return { title: `Resources: ${isKategoriSlug(kategori) ? getResourcesImersif(kategori).nama : ""} — Wayang Antariksa` };
}

export default async function ResourcesPage(props: PageProps<"/resources/[kategori]">) {
  const { kategori } = await props.params;
  if (!isKategoriSlug(kategori)) notFound();
  const data = getResourcesImersif(kategori);

  return (
    <main>
      <h1 className="sr-only">Resources: {data.nama}</h1>
      <SceneProvider>
      <HalamanImersif
        gambar={data.gambar}
        varian="resources"
        kembali={{ href: "/", label: "Kembali ke Beranda" }}
        narasi={data.narasi}
        benda={data.benda}
        posisiTitik={data.posisiTitik}
        fokusGambar={data.fokusGambar}
        scene={<ImersifScene environment={kategori} />}
        jenisPanel={["fakta", "misi", "galeri", "sumber"]}
        panelKonten={{
          fakta: <PanelFakta fakta={data.panel.fakta} />,
          misi: <PanelMisi misi={data.panel.misi} />,
          galeri: <PanelGaleri galeri={data.panel.galeri} />,
          sumber: <PanelSumber sumber={data.panel.sumber} />,
        }}
        dok={<DokKategori items={data.dok} aktifHref={`/resources/${kategori}`} />}
      />
      </SceneProvider>
    </main>
  );
}
