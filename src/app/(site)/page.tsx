import Image from "next/image";
import { Button, Container, KartuLingkungan } from "@/components/ui";
import { getKartuLingkungan, HOME_COPY } from "@/data";

/**
 * Beranda. Sumber desain: Figma halaman Prototype, frame `Home — Desktop`
 * (1440), `Home — Tablet` (768), `Home — Mobile` (390). Isi: hero, pengantar,
 * kartu Pilih Lingkungan. Latar Bima Sakti hanya ada di frame desktop.
 */
export default function Home() {
  const { hero, pengantar, lingkungan } = HOME_COPY;
  const kartu = getKartuLingkungan();

  return (
    <>
      {/* Hero: navbar (absolute) berada di atasnya, jadi hero ditarik ke y = 0. */}
      <section
        aria-labelledby="judul-hero"
        className="relative -mt-(--navbar-offset) flex min-h-[760px] flex-col overflow-hidden bg-bg-primary-normal md:min-h-[720px] lg:min-h-[849px]"
      >
        <Image
          src="/images/home/hero-bulan.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,#10131b_0%,rgba(16,19,27,0.6)_50%,rgba(11,14,21,0.85)_100%)]"
        />

        <Container className="relative mt-auto pb-14 md:pb-[72px] lg:mt-0 lg:pb-0 lg:pt-[318px]">
          <div className="flex flex-col items-center gap-4 text-center lg:gap-9">
            <div className="flex flex-col items-center gap-4 lg:gap-1">
              <p className="text-eyebrow-15 uppercase text-text-secondary-normal md:text-eyebrow-20">
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

      {/* Latar Bima Sakti (desktop saja, 1440x1021 di bawah hero). */}
      <div className="relative bg-bg-primary-normal">
        {/* CSS background (bukan next/image) agar berkas tidak diunduh di tablet/mobile. Digeser pelan
            (70, 14) px selama 16 dtk; diperbesar 1,1x agar tepinya tidak terbuka saat bergeser. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1021px] overflow-hidden lg:block"
        >
          <div className="bima-geser absolute inset-0 scale-110 bg-[url('/images/home/latar-bima-sakti.webp')] bg-cover bg-top bg-no-repeat" />
        </div>

        <section
          aria-labelledby="judul-pengantar"
          className="relative px-page py-14 md:py-[72px] lg:pb-0 lg:pt-20"
        >
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
            <h2
              id="judul-pengantar"
              className="text-heading-card text-text-primary-normal md:text-heading-section"
            >
              {pengantar.judul}
            </h2>
            <p className="text-body-large text-text-secondary-normal">{pengantar.isi}</p>
          </div>
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
              {kartu.map((k) => (
                <KartuLingkungan
                  key={k.slug}
                  judul={k.judul}
                  deskripsi={k.deskripsi}
                  tautan={lingkungan.tautan}
                  href={k.href}
                  gambar={k.gambar}
                />
              ))}
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
