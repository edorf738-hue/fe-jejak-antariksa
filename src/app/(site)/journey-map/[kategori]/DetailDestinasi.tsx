"use client";

import Image from "next/image";
import { useState } from "react";
import { Button, revealKata, revealMuat, revealUrut, SplitText } from "@/components/ui";
import { JOURNEY_COPY, type JourneyTujuan, type PratinjauMisi } from "@/data";

const T = JOURNEY_COPY.pratinjau;

/**
 * Isi Peta Perjalanan setelah tujuan dipilih: Daftar Misi (kartu ringkas), lalu Pratinjau Misi
 * (gambar + info singkat + dua tombol lanjut). Kronologi lengkap ada di Cerita dan daftar sumber di
 * Sumber, jadi tidak diulang di sini. Misi yang datanya belum ada (null) tidak ditampilkan; nilai
 * yang kosong tampil "TBD" apa adanya.
 */
function Info({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-eyebrow-15 text-aksen-warisan-normal">{label}</dt>
      <dd className="text-body-large break-words text-text-primary-normal">{nilai}</dd>
    </div>
  );
}

function Pratinjau({ m, namaTujuan }: { m: PratinjauMisi; namaTujuan: string }) {
  return (
    // `key` di pemanggil memasang ulang panel saat misi berganti, sehingga gerak masuk ringan terulang.
    <article
      aria-labelledby="judul-pratinjau"
      className="grid overflow-hidden rounded-card border border-archive-slate-normal bg-bg-secondary-normal lg:grid-cols-[1fr_1.1fr]"
      {...revealMuat(0)}
    >
      <figure className="relative min-h-[220px] bg-bg-primary-normal sm:min-h-[300px] lg:min-h-full">
        <Image
          src={m.foto.src}
          alt={m.foto.alt}
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          className="object-cover"
          style={{ objectPosition: m.foto.posisi }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-primary-normal/90 via-bg-primary-normal/10 to-transparent" />
        <figcaption className="absolute inset-x-5 bottom-4 text-[13px] leading-snug flex flex-col gap-1 text-text-primary-normal [text-shadow:0_1px_10px_rgba(8,11,18,0.95)]">
          <span>{m.foto.keterangan}</span>
          <span className="text-text-secondary-normal">
            {T.kredit}: {m.foto.kredit}
          </span>
        </figcaption>
      </figure>

      <div className="flex min-w-0 flex-col gap-6 px-5 py-7 md:p-10">
        <div className="flex flex-col gap-2">
          <p className="text-eyebrow-15 text-aksen-warisan-normal">{namaTujuan.toUpperCase()}</p>
          <h3 id="judul-pratinjau" className="text-heading-section text-text-primary-normal">
            {m.nama}
          </h3>
        </div>

        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Info label={T.labelTahun} nilai={m.tahun} />
          <Info label={T.labelWahana} nilai={m.wahana} />
          <div className="sm:col-span-2">
            <Info label={T.labelStatus} nilai={m.status} />
          </div>
          <div className="sm:col-span-2">
            <Info label={T.labelTujuan} nilai={m.tujuan} />
          </div>
        </dl>

        <div className="flex flex-col gap-1 border-l-2 border-aksen-informasi-normal pl-4">
          <p className="text-eyebrow-15 text-aksen-informasi-normal">{T.labelTemuan}</p>
          <p className="text-body-large text-text-primary-normal">{m.temuan}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button href={m.hrefCerita} iconRight="panah-kanan">
            {T.ctaCerita}
          </Button>
          <Button href={m.hrefLingkungan} variant="secondary" iconRight="panah-kanan">
            {T.cta3d}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function DetailDestinasi({ tujuan }: { tujuan: JourneyTujuan }) {
  const [dipilih, setDipilih] = useState(0);
  const { kategori, pratinjau } = tujuan;
  const aktif = pratinjau[dipilih];
  if (!aktif) return null;

  return (
    <section aria-labelledby="judul-misi-terkait" className="flex flex-col gap-6">
      <h2 id="judul-misi-terkait" className="text-heading-card text-text-primary-normal" {...revealKata(0)}>
        <SplitText>{`${T.judulMisi}: ${kategori.nama}`}</SplitText>
      </h2>

      <ul className="flex flex-wrap gap-3">
        {pratinjau.map((m, i) => {
          const terpilih = i === dipilih;
          return (
            <li key={m.nama} className="max-sm:w-full" {...revealUrut(i, 90, 4)}>
              <button
                type="button"
                onClick={() => setDipilih(i)}
                aria-pressed={terpilih}
                className={`flex min-h-11 min-w-[148px] cursor-pointer max-sm:w-full flex-col items-start gap-1 rounded-card px-5 py-3 text-left transition-[box-shadow,translate,background-color] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 ${
                  terpilih
                    ? "bg-archive-slate-normal ring-2 ring-inset ring-aksen-informasi-normal-hover"
                    : "bg-bg-secondary-normal ring-1 ring-inset ring-archive-slate-normal hover:ring-aksen-informasi-dark"
                }`}
              >
                <span className="text-eyebrow-15 text-aksen-warisan-normal">{m.tahun}</span>
                <span className="text-heading-card text-text-primary-normal">{m.nama}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <Pratinjau key={aktif.nama} m={aktif} namaTujuan={kategori.nama} />
    </section>
  );
}
