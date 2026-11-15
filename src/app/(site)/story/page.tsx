import type { Metadata } from "next";
import { Button, CeritaSinematik, Container, KartuBab, Muncul, PageHeader } from "@/components/ui";
import { getDaftarBabRingkas, STORY_COPY } from "@/data";

export const metadata: Metadata = { title: "Cerita — Wayang Antariksa" };

/**
 * Cerita (Pengantar): header, daftar 4 bab, tombol Mulai dari Bab 1. Sumber desain:
 * Figma `Story — Pengantar` (1440), `(Tablet)` (768), `(Mobile)` (390).
 * Halaman bab imersif (/story/1..4) dikerjakan di PR terpisah.
 */
const GAMBAR_BAB = [
  "/images/imersif/bab-1-bumi.webp",
  "/images/home/kartu-moon.jpg",
  "/images/home/kartu-mars.jpg",
  "/images/home/kartu-deep-space.jpg",
];

export default function StoryPage() {
  const { header, daftar } = STORY_COPY;
  const bab = getDaftarBabRingkas();

  return (
    <>
      <PageHeader {...header} gambar="/images/story/header-cerita.webp" className="lg:min-h-[520px]" />
      <CeritaSinematik layar={bab.map((b, i) => ({ ...b, gambar: GAMBAR_BAB[i] }))} />
      <Container className="flex flex-col gap-10 pb-16 pt-10 md:gap-12 md:pb-[72px] md:pt-14 lg:gap-8 lg:pb-24 lg:pt-[72px]">
        <h2 className="text-heading-card text-text-primary-normal md:text-heading-section">{daftar.judul}</h2>
        <ol className="flex flex-col gap-5">
          {bab.map((b, i) => (
            <li key={b.href}>
              <Muncul jeda={i * 0.1}>
                <KartuBab {...b} />
              </Muncul>
            </li>
          ))}
        </ol>
        <Button href="/story/1" className="w-full md:w-fit">
          {daftar.ctaMulai}
        </Button>
      </Container>
    </>
  );
}
