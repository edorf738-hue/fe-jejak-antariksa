import Image from "next/image";
import { Button, Container, hitungKata, KartuPlanet, reveal, revealKata, revealKataMuat, revealMuat, SplitText, type JenisPlanet } from "@/components/ui";
import { getKartuLingkungan, HOME_COPY, type KategoriSlug } from "@/data";

/**
 * Beranda. Sumber desain: Figma halaman Prototype, frame `Home — Desktop`
 * (1440), `Home — Tablet` (768), `Home — Mobile` (390). Isi: hero, pengantar,
 * kartu Pilih Lingkungan. Latar Bima Sakti hanya ada di frame desktop.
 */
/** Jenis planet per lingkungan: Mars, Bulan (tekstur NASA), dan raksasa es bercincin untuk Deep Space (Voyager). */
const PLANET: Record<KategoriSlug, JenisPlanet> = { mars: "mars", moon: "bulan", "deep-space": "raksasa" };

export default function Home() {
  const { hero, lingkungan } = HOME_COPY;
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
              {/* Urutan masuk hero: eyebrow, judul per kata, deskripsi, tombol (jeda bertahap ala nakala.digital). */}
              <p
                className="text-eyebrow-15 uppercase text-text-primary-normal md:text-eyebrow-20"
                {...revealMuat(0)}
              >
                {hero.eyebrow}
              </p>
              <h1
                id="judul-hero"
                className="text-hero-36 uppercase text-text-primary-normal md:text-hero-70 lg:text-hero-90"
                {...revealKataMuat(120)}
              >
                {hero.headline.map((baris, i) => (
                  <span key={baris} className="lg:block">
                    <SplitText mulai={hero.headline.slice(0, i).reduce((n, b) => n + hitungKata(b), 0)}>{baris}</SplitText>{" "}
                  </span>
                ))}
              </h1>
            </div>

            <p className="text-body-large max-w-[640px] text-text-primary-normal" {...revealMuat(560)}>
              {hero.deskripsi}
            </p>

            <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row lg:gap-5" {...revealMuat(700)}>
              <Button href={hero.ctaUtama.href} sinyal>
                {hero.ctaUtama.label}
              </Button>
              <Button href={hero.ctaSekunder.href} variant="secondary" specular>
                {hero.ctaSekunder.label}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Latar Bumi dari orbit untuk Pilih Lingkungan. Mengalir dari hero: tepi atasnya memudar ke warna
          latar hero (#10131b) dan tepi bawahnya memudar kembali, jadi tidak ada garis pemisah. CSS background (bukan
          next/image) agar tidak ikut ke bundel; memenuhi seluruh tinggi bagian ini. */}
      <div className="relative overflow-hidden bg-bg-primary-normal bg-[linear-gradient(to_bottom,#10131b_0,var(--color-bg-primary-normal)_220px)] bg-no-repeat">
        <div
          aria-hidden="true"
          className="bumi-mask pointer-events-none absolute inset-0"
        >
          {/* Lapisan bergerak: melayang dan memperbesar pelan; pendar atmosfer ikut di dalamnya agar tetap di lengkung. */}
          <div className="bumi-melayang absolute inset-0 bg-[url('/images/home/latar-bumi.webp')] bg-cover bg-top bg-no-repeat">
            <div className="bumi-pendar absolute left-[-5%] top-[24%] hidden h-[14%] w-[100%] -rotate-[9deg] bg-[radial-gradient(ellipse_at_center,rgba(96,176,255,0.55),transparent_68%)] blur-2xl lg:block" />
            <div className="bumi-pendar-hangat absolute -left-[4%] top-[44%] hidden h-[22%] w-[38%] bg-[radial-gradient(ellipse_at_center,rgba(255,196,140,0.35),transparent_70%)] blur-2xl lg:block" />
          </div>
        </div>

        <section
          aria-labelledby="judul-lingkungan"
          className="relative py-14 md:py-[72px] lg:pb-[120px] lg:pt-[125px]"
        >
          <Container className="flex flex-col items-center gap-8 lg:gap-12">
            <div className="flex flex-col items-center gap-4 text-center [text-shadow:0_1px_16px_rgba(8,11,18,0.95)]">
              <h2
                id="judul-lingkungan"
                className="text-heading-card text-text-primary-normal md:text-heading-section"
                {...revealKata(0)}
              >
                <SplitText>{lingkungan.judul}</SplitText>
              </h2>
              <p className="text-body-large text-text-secondary-normal" {...reveal(200)}>
                {lingkungan.subjudul}
              </p>
            </div>

            {/* Tiga planet beranimasi sejajar (Mars, Bulan, Deep Space), masing-masing pintu ke lingkungan 3D-nya. */}
            <div className="grid w-full items-start justify-items-center gap-x-6 gap-y-12 md:grid-cols-3 lg:gap-x-10">
              {kartu.map((k, i) => (
                <KartuPlanet
                  key={k.slug}
                  jenis={PLANET[k.slug]}
                  delay={i * 140}
                  judul={k.judul}
                  ringkasan={k.ringkasan}
                  href={k.href}
                />
              ))}
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
