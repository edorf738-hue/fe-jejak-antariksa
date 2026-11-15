import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DokBab, HalamanImersif, PanelGaleri, PanelMisi, PanelSumber } from "@/components/hud";
import { GALERI_FOTO, getBabImersif, getDaftarBab } from "@/data";
import type { Environment } from "@/components/three/scene/config";
import { HotspotLayer } from "@/components/three/scene/HotspotLayer";
import { ImersifScene } from "@/components/three/scene/ImersifScene";
import { SceneProvider } from "@/components/three/scene/scene-context";

/**
 * Story Bab 1-4 sebagai tampilan imersif satu layar (tanpa Navbar). Sumber desain: Figma
 * `Story — Bab 1..4` (1440x900), `(Tablet)` (768x1024), `(Mobile)` (390x844).
 * Scene 3D (Edo) dipasang di slot `scene` untuk Bab 2-4; Bab 1 belum punya aset 3D (latar gambar).
 * Hotspot/objek (Zhafran) dipasang kemudian.
 */
/** Bab -> environment 3D. Bab 1 tidak ada. */
const LINGKUNGAN: Partial<Record<number, Environment>> = { 2: "moon", 3: "mars", 4: "deep-space" };
export function generateStaticParams() {
  return getDaftarBab().map((b) => ({ bab: String(b.id) }));
}

export async function generateMetadata(props: PageProps<"/story/[bab]">): Promise<Metadata> {
  const { bab } = await props.params;
  const data = getBabImersif(Number(bab));
  return { title: data ? `Bab ${data.bab.id}: ${data.bab.judul} — Wayang Antariksa` : "Cerita — Wayang Antariksa" };
}

export default async function StoryBabPage(props: PageProps<"/story/[bab]">) {
  const { bab: param } = await props.params;
  const data = getBabImersif(Number(param));
  if (!data) notFound();

  const id = data.bab.id;
  const jumlah = data.labelBab.length;
  const terakhir = id === jumlah;
  const lingkungan = LINGKUNGAN[id];

  return (
    <main>
      <h1 className="sr-only">
        Bab {id}: {data.bab.judul}
      </h1>
      <SceneProvider>
      <HalamanImersif
        gambar={data.gambar}
        scenePlaceholder={data.scenePlaceholder}
        varian="story"
        kembali={{ href: "/story", label: "Kembali ke Cerita" }}
        narasi={data.narasi}
        benda={data.benda}
        posisiTitik={data.posisiTitik}
        fokusGambar={data.fokusGambar}
        scene={lingkungan ? <ImersifScene environment={lingkungan} /> : undefined}
        hotspots={lingkungan ? <HotspotLayer environment={lingkungan} /> : undefined}
        jenisPanel={lingkungan ? ["misi", "galeri", "sumber"] : ["misi", "sumber"]}
        panelKonten={{
          misi: <PanelMisi misi={data.panel.misi} />,
          galeri: lingkungan ? <PanelGaleri galeri={data.panel.galeri} foto={GALERI_FOTO[lingkungan]} /> : undefined,
          sumber: <PanelSumber sumber={data.panel.sumber} />,
        }}
        dok={
          <DokBab
            aktif={id}
            label={data.labelBab}
            hrefBab={(n) => `/story/${n}`}
            hrefSebelumnya={id > 1 ? `/story/${id - 1}` : undefined}
            labelSebelumnya={`Bab ${id - 1}`}
            hrefBerikutnya={terakhir ? "/story" : `/story/${id + 1}`}
            labelBerikutnya={terakhir ? "Daftar Bab" : `Bab ${id + 1}`}
          />
        }
      />
      </SceneProvider>
    </main>
  );
}
