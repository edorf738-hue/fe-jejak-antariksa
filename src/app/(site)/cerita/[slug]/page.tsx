import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container, Icon, SplitText, reveal, revealKataMuat, revealMuat } from "@/components/ui";
import { CERITA_SLUGS, getCerita, isCeritaSlug, type CeritaBab, type Foto } from "@/data";

/**
 * Detail Cerita per bab (/cerita/[slug]): hero, cerita kronologis, dokumentasi (video dan galeri), fakta dan artefak, tombol
 * ke lingkungan 3D, sumber, dan navigasi bab. Konten tiap bab berbeda (src/data/cerita.ts). Halaman scene 3D tetap di
 * /story/[bab]; halaman ini tidak menduplikasinya, hanya menautkannya.
 */
export function generateStaticParams() {
  return CERITA_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/cerita/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isCeritaSlug(slug)) return { title: "Cerita — Wayang Antariksa" };
  const c = getCerita(slug);
  return { title: `Bab ${c.nomor}: ${c.judul} — Wayang Antariksa`, description: c.pengantar };
}

const JUDUL_SEKSI = "text-heading-card text-text-primary-normal md:text-heading-section";
const EYEBROW = "text-eyebrow-15 uppercase text-aksen-warisan-normal";
const KOTAK_NAV =
  "group flex flex-col gap-1 rounded-[20px] border border-white/10 p-5 transition-colors duration-300 hover:border-aksen-informasi-normal";

function Gambar({ foto }: { foto: Foto }) {
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-secondary-normal ring-1 ring-inset ring-white/10">
        <Image src={foto.src} alt={foto.keterangan} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
      </div>
      <figcaption className="text-xs text-text-secondary-normal">
        {foto.keterangan} Kredit: {foto.kredit}.
      </figcaption>
    </figure>
  );
}

function Hero({ c }: { c: CeritaBab }) {
  return (
    <header className="relative -mt-(--navbar-offset) flex min-h-[520px] flex-col overflow-hidden bg-bg-primary-normal md:min-h-[480px] lg:min-h-[560px]">
      <Image src={c.hero.src} alt="" fill priority sizes="100vw" className="object-cover object-center" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,#080b12_0%,rgba(8,11,18,0.55)_45%,rgba(8,11,18,0.35)_100%),linear-gradient(to_right,rgba(8,11,18,0.8)_0%,rgba(8,11,18,0)_70%)]"
      />
      <div className="relative mx-auto flex w-full max-w-page flex-1 flex-col justify-end gap-4 px-page pb-12 pt-[150px] lg:pb-16">
        <p {...revealMuat(0)} className={`${EYEBROW} lg:text-eyebrow-20`}>Bab {c.nomor}</p>
        <h1 {...revealKataMuat(100)} className="text-hero-36 max-w-[900px] uppercase text-text-primary-normal md:text-heading-section lg:text-hero-70"><SplitText>{c.judul}</SplitText></h1>
        <p {...revealMuat(260)} className="text-body-large max-w-[680px] text-text-primary-normal">{c.pengantar}</p>
        <div {...revealMuat(380)} className="flex flex-col gap-3 pt-2 md:flex-row">
          <Button href="#cerita">Mulai Membaca</Button>
          {c.tiga3d && (
            <Button href={c.tiga3d.href} variant="secondary" glass iconRight="panah-kanan">
              Lihat di 3D
            </Button>
          )}
        </div>
        <p className="text-xs text-text-secondary-normal">
          Foto: {c.hero.keterangan} Kredit: {c.hero.kredit}.
        </p>
      </div>
    </header>
  );
}

function Cerita({ c }: { c: CeritaBab }) {
  return (
    <section id="cerita" aria-labelledby="judul-cerita" className="scroll-mt-24">
      <h2 id="judul-cerita" className={JUDUL_SEKSI}>
        Ceritanya
      </h2>
      <ol className="mt-10 flex flex-col md:mt-14">
        {c.bagian.map((b, i) => (
          <li
            key={b.judul}
            className="relative grid gap-5 border-l border-white/15 pb-14 pl-6 last:pb-0 md:gap-8 md:pl-10 lg:grid-cols-12 lg:gap-12"
          >
            <span aria-hidden="true" className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-aksen-informasi-normal" />
            <div {...reveal(0)} className={`flex flex-col gap-3 ${b.foto ? "lg:col-span-6" : "lg:col-span-9"} ${b.foto && i % 2 === 1 ? "lg:order-2" : ""}`}>
              <p className={EYEBROW}>{b.waktu}</p>
              <h3 className="text-heading-card text-text-primary-normal">{b.judul}</h3>
              <p className="text-body-large max-w-[600px] text-text-secondary-normal">{b.isi}</p>
            </div>
            {b.foto && (
              <div {...reveal(120)} className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <Gambar foto={b.foto} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Dokumentasi({ c }: { c: CeritaBab }) {
  return (
    <section aria-labelledby="judul-dokumentasi" className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p className={EYEBROW}>Dokumentasi</p>
        <h2 id="judul-dokumentasi" className={JUDUL_SEKSI}>
          Foto dan video
        </h2>
      </div>

      {c.video.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {c.video.map((vd) => (
            <figure key={vd.src} id={vd.src.split("/").pop()?.replace(".mp4", "")} className="flex scroll-mt-24 flex-col gap-2">
              <video
                controls
                preload="none"
                poster={vd.poster}
                className="aspect-video w-full rounded-[20px] bg-bg-secondary-normal object-cover ring-1 ring-inset ring-white/10"
              >
                <source src={vd.src} type="video/mp4" />
                Peramban Anda tidak mendukung pemutaran video.
              </video>
              <figcaption className="text-sm text-text-secondary-normal">
                <span className="font-bold text-text-primary-normal">{vd.judul}.</span> {vd.keterangan} Kredit: NASA.
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="text-body-large rounded-[20px] border border-white/10 px-6 py-5 text-text-secondary-normal">
          Video dokumentasi untuk bab ini belum tersedia.
        </p>
      )}

      <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {c.galeri.map((g) => (
          <li key={g.src} className="group">
            <figure className="flex flex-col gap-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-bg-secondary-normal ring-1 ring-inset ring-white/10">
                <Image
                  src={g.src}
                  alt={g.keterangan}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="text-xs text-text-secondary-normal">
                {g.keterangan} Kredit: {g.kredit}.
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FaktaArtefak({ c }: { c: CeritaBab }) {
  return (
    <section aria-labelledby="judul-artefak" className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p className={EYEBROW}>Fakta dan artefak</p>
        <h2 id="judul-artefak" className={JUDUL_SEKSI}>
          Yang tertinggal dan yang perlu diketahui
        </h2>
      </div>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {c.artefak.map((a) => (
          <li key={a.nama}>
            <article className="glass flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10">
              {a.foto && (
                <div className="relative aspect-[16/10] w-full">
                  <Image src={a.foto.src} alt={a.foto.keterangan} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-6">
                <p className="text-eyebrow-15 uppercase text-aksen-informasi-normal">{a.status}</p>
                <h3 className="text-heading-card text-text-primary-normal max-lg:text-2xl">{a.nama}</h3>
                <p className="text-base leading-6 text-text-secondary-normal">{a.deskripsi}</p>
                <p className="mt-auto pt-3 text-xs text-aksen-warisan-normal">{a.model}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <ul className="flex flex-col gap-3">
        {c.fakta.map((f) => (
          <li key={f.isi} className="flex flex-col gap-1 border-b border-white/10 pb-4">
            <p className="text-body-large text-text-primary-normal">{f.isi}</p>
            <p className="text-sm text-text-secondary-normal">Sumber: {f.sumber}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Eksplorasi3D({ c }: { c: CeritaBab }) {
  const berikut = c.babId < 4 ? getCerita(CERITA_SLUGS[c.babId]) : null;
  return (
    <section aria-labelledby="judul-3d" className="glass flex flex-col items-start gap-5 rounded-[28px] border border-white/10 p-8 md:p-12">
      <p className={EYEBROW}>Eksplorasi 3D</p>
      <h2 id="judul-3d" className={JUDUL_SEKSI}>
        {c.tiga3d ? "Datangi tempatnya" : "Bab ini belum punya lingkungan 3D"}
      </h2>
      {c.tiga3d ? (
        <>
          <p className="text-body-large max-w-[620px] text-text-secondary-normal">{c.tiga3d.deskripsi}</p>
          <Button href={c.tiga3d.href} iconRight="panah-kanan">
            {c.tiga3d.label}
          </Button>
        </>
      ) : (
        <>
          <p className="text-body-large max-w-[620px] text-text-secondary-normal">
            Bab Awal Eksplorasi berisi sejarah. Lingkungan 3D pertama ada di Bab 02, saat manusia menjejak Bulan.
          </p>
          {berikut && (
            <Button href={`/cerita/${berikut.slug}`} iconRight="panah-kanan">
              {`Lanjut ke Bab ${berikut.nomor}`}
            </Button>
          )}
        </>
      )}
    </section>
  );
}

function Sumber({ c }: { c: CeritaBab }) {
  return (
    <section aria-labelledby="judul-sumber-cerita" className="flex flex-col gap-4">
      <h2 id="judul-sumber-cerita" className="text-heading-card text-text-primary-normal">
        Sumber
      </h2>
      <ul>
        {c.sumber.map((s) => (
          <li key={s.url} className="border-b border-white/10 py-3">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-large text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover"
            >
              {s.judul}
              <span className="sr-only"> (buka di tab baru)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NavigasiBab({ c }: { c: CeritaBab }) {
  const sebelum = c.babId > 1 ? getCerita(CERITA_SLUGS[c.babId - 2]) : null;
  const sesudah = c.babId < 4 ? getCerita(CERITA_SLUGS[c.babId]) : null;
  return (
    <nav aria-label="Navigasi bab" className="grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2">
      <Link href={sebelum ? `/cerita/${sebelum.slug}` : "/story"} className={KOTAK_NAV}>
        <span className="flex items-center gap-2 text-sm text-text-secondary-normal">
          <Icon name="panah-kiri" size={20} />
          {sebelum ? `Bab ${sebelum.nomor}` : "Kembali"}
        </span>
        <span className="text-heading-card text-text-primary-normal max-lg:text-2xl">{sebelum ? sebelum.judul : "Semua bab"}</span>
      </Link>
      <Link href={sesudah ? `/cerita/${sesudah.slug}` : "/story"} className={`${KOTAK_NAV} sm:items-end sm:text-right`}>
        <span className="flex items-center gap-2 text-sm text-text-secondary-normal">
          {sesudah ? `Bab ${sesudah.nomor}` : "Selesai"}
          <Icon name="panah-kanan" size={20} />
        </span>
        <span className="text-heading-card text-text-primary-normal max-lg:text-2xl">{sesudah ? sesudah.judul : "Semua bab"}</span>
      </Link>
    </nav>
  );
}

export default async function CeritaDetailPage(props: PageProps<"/cerita/[slug]">) {
  const { slug } = await props.params;
  if (!isCeritaSlug(slug)) notFound();
  const c = getCerita(slug);

  return (
    <>
      <Hero c={c} />
      <Container className="flex flex-col gap-20 pb-20 pt-14 md:gap-24 md:pt-20 lg:gap-28 lg:pb-28 lg:pt-24">
        <Cerita c={c} />
        <Dokumentasi c={c} />
        <FaktaArtefak c={c} />
        <Eksplorasi3D c={c} />
        <Sumber c={c} />
        <NavigasiBab c={c} />
      </Container>
    </>
  );
}
