import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container, SplitText, reveal, revealKataMuat, revealMuat } from "@/components/ui";
import { getDaftarBabRingkas, STORY_COPY } from "@/data";
import { BabEditorial } from "./BabEditorial";

export const metadata: Metadata = { title: "Cerita — Wayang Antariksa" };

/**
 * Cerita: hero (latar Bumi dari orbit), pengantar singkat, lalu empat bab bergaya editorial yang masing-masing menuju bab
 * imersifnya (/story/1..4). Foto bab dari folder NASA/NASA Assets (foto Apollo 11, Opportunity, ilustrasi Voyager); bab 1
 * memakai foto Apollo 11 karena bab itu menuju Apollo 11. Teks bab dari content-data.json.
 */
const FOTO_BAB = [
  { gambar: "/images/story/bab-1-apollo-11-orbit.webp", keterangan: "Apollo 11: modul komando di orbit Bulan. Kredit: NASA." },
  { gambar: "/images/galeri/moon-aldrin-bendera.webp", keterangan: "Buzz Aldrin memberi hormat di dekat bendera AS. Kredit: NASA." },
  { gambar: "/images/galeri/mars-opportunity-foto-diri.webp", keterangan: "Foto diri Opportunity, Januari 2014. Kredit: NASA/JPL-Caltech/Cornell Univ./Arizona State Univ." },
  { gambar: "/images/galeri/deep-space-voyager-konsep.webp", keterangan: "Ilustrasi Voyager di ruang antarbintang. Kredit: NASA/JPL-Caltech." },
];

export default function StoryPage() {
  const { header, pembuka, daftar } = STORY_COPY;
  const bab = getDaftarBabRingkas();

  return (
    <>
      <header className="relative -mt-(--navbar-offset) flex min-h-[440px] flex-col overflow-hidden bg-bg-primary-normal md:min-h-[400px] lg:min-h-[460px]">
        <Image src="/images/story/header-cerita.webp" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,#080b12_0%,rgba(8,11,18,0)_40%),linear-gradient(to_right,rgba(8,11,18,0.7)_0%,rgba(8,11,18,0)_65%)]"
        />
        <div className="relative mx-auto flex w-full max-w-page flex-1 flex-col justify-end gap-4 px-page pb-12 pt-[150px] lg:pb-14 lg:pt-[160px]">
          <p {...revealMuat(0)} className="text-eyebrow-15 uppercase text-aksen-warisan-normal lg:text-eyebrow-20">{header.eyebrow}</p>
          <h1 {...revealKataMuat(100)} className="text-hero-36 max-w-[900px] uppercase text-text-primary-normal md:text-heading-section lg:text-hero-70">
            <SplitText>{header.judul}</SplitText>
          </h1>
          <p {...revealMuat(260)} className="text-body-large max-w-[640px] text-text-primary-normal">{header.deskripsi}</p>
          <div {...revealMuat(380)} className="pt-2">
            <Button href="#daftar-bab" className="max-md:w-full">
              {header.cta}
            </Button>
          </div>
        </div>
      </header>

      <Container className="flex flex-col gap-20 pb-20 pt-14 md:gap-24 md:pt-20 lg:gap-28 lg:pb-28 lg:pt-24">
        <div {...reveal(0)}>
          <section aria-labelledby="judul-pembuka" className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="flex flex-col gap-4 lg:col-span-6">
              <p className="text-eyebrow-15 uppercase text-aksen-warisan-normal">{pembuka.eyebrow}</p>
              <h2 id="judul-pembuka" className="text-heading-card text-text-primary-normal md:text-heading-section">
                {pembuka.judul}
              </h2>
              <p className="text-body-large max-w-[560px] text-text-secondary-normal">{pembuka.isi}</p>
            </div>
            <figure className="flex flex-col gap-2 lg:col-span-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] ring-1 ring-inset ring-white/10">
                <Image src={pembuka.foto} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
              </div>
              <figcaption className="text-xs text-text-secondary-normal">{pembuka.keterangan}</figcaption>
            </figure>
          </section>
        </div>

        <section id="daftar-bab" aria-labelledby="judul-daftar" className="flex scroll-mt-24 flex-col gap-14 md:gap-20">
          <h2 id="judul-daftar" className="sr-only">
            {daftar.judul}
          </h2>
          {bab.map((b, i) => (
            <BabEditorial key={b.href} {...b} {...FOTO_BAB[i]} balik={i % 2 === 1} />
          ))}
        </section>
      </Container>
    </>
  );
}
