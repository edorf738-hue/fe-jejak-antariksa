import Image from "next/image";
import { Button, Container, KartuLingkungan, Muncul } from "@/components/ui";
import { getKartuLingkungan, HOME_COPY } from "@/data";

/**
 * Beranda. Sumber desain: Figma halaman Prototype, frame `Home — Desktop`
 * (1440), `Home — Tablet` (768), `Home — Mobile` (390). Isi: hero, pengantar,
 * kartu Pilih Lingkungan. Satu latar di atas halaman, memudar ke gelap: Bumi dan matahari terbit (render model 3D Earth Horizon v3, 2560 px).
 */
export default function Home() {
  const { hero, pengantar, lingkungan } = HOME_COPY;
  const kartu = getKartuLingkungan();

  return (
    <div className="relative -mt-(--navbar-offset)">
      {/* Satu latar saja: render Bumi menempel di layar (fixed) selama halaman di-scroll, jadi tidak ada bagian kosong
          dan gambar 2560 px tidak pernah diperbesar (tetap tajam). Bergeser pelan (CSS). Gradasi tipis menjaga teks terbaca. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg-primary-normal">
        {/* Selebar 80 px lebih di kiri-kanan agar geseran pelan (70, 14 px, 16 dtk) tidak membuka tepi. */}
        <div className="bima-geser absolute inset-y-0 -inset-x-20">
          <Image
            src="/images/home/latar-bumi-orbit.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1920px) 100vw, 2880px"
            quality={95}
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,11,18,0.1)_0%,rgba(8,11,18,0.5)_100%)]" />
      </div>

      {/* Hero: navbar berada di atasnya, jadi wrapper ditarik ke y = 0. */}
      <section
        aria-labelledby="judul-hero"
        className="relative flex min-h-[760px] flex-col md:min-h-[720px] lg:min-h-[849px]"
      >
        <Container className="relative mt-auto pb-14 md:pb-[72px] lg:mt-0 lg:pb-0 lg:pt-[318px]">
          <div className="hud-masuk flex flex-col items-center gap-4 text-center [--hud-dy:24px] [--hud-dur:0.9s] lg:gap-9">
            <div className="flex flex-col items-center gap-4 lg:gap-1">
              <p className="text-eyebrow-15 uppercase text-text-primary-normal md:text-eyebrow-20">
                {hero.eyebrow}
              </p>
              <h1
                id="judul-hero"
                className="text-hero-36 uppercase text-text-primary-normal md:text-hero-70 lg:text-hero-90"
              >
                {hero.headline.map((baris) => (
                  <span key={baris} className="lg:block">
                    {baris}{" "}
                  </span>
                ))}
              </h1>
            </div>

            <p className="text-body-large max-w-[640px] text-text-primary-normal">
              {hero.deskripsi}
            </p>

            <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row lg:gap-5">
              <Button href={hero.ctaUtama.href}>{hero.ctaUtama.label}</Button>
              <Button href={hero.ctaSekunder.href} variant="secondary">
                {hero.ctaSekunder.label}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <div className="relative">
        <section
          aria-labelledby="judul-pengantar"
          className="relative px-page py-14 md:py-[72px] lg:pb-0 lg:pt-20"
        >
          <Muncul className="mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
            <h2
              id="judul-pengantar"
              className="text-heading-card text-text-primary-normal md:text-heading-section"
            >
              {pengantar.judul}
            </h2>
            <p className="text-body-large text-text-secondary-normal">{pengantar.isi}</p>
          </Muncul>
        </section>

        <section
          aria-labelledby="judul-lingkungan"
          className="relative py-14 md:py-[72px] lg:pb-[120px] lg:pt-[125px]"
        >
          <Container className="flex flex-col items-center gap-8 lg:gap-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2
                id="judul-lingkungan"
                className="text-heading-card text-text-primary-normal md:text-heading-section"
              >
                {lingkungan.judul}
              </h2>
              <p className="text-body-large text-text-secondary-normal">
                {lingkungan.subjudul}
              </p>
            </div>

            <div className="grid w-full items-start gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {kartu.map((k, i) => (
                <Muncul key={k.slug} jeda={i * 0.12}>
                  <KartuLingkungan
                    judul={k.judul}
                    deskripsi={k.deskripsi}
                    tautan={lingkungan.tautan}
                    href={k.href}
                    gambar={k.gambar}
                  />
                </Muncul>
              ))}
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}
