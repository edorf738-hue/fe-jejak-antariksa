"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { CSSProperties } from "react";
import { PlanetCanvas, reveal, type JenisPlanet } from "@/components/ui";
import type { KategoriSlug } from "@/data";

/**
 * Panggung peta Peta Perjalanan (menggantikan kotak peta dengan tiga lingkaran gambar): Bumi sebagai
 * titik berangkat dan tiga tujuan sebagai planet beranimasi (Bulan bertekstur NASA, Mars, raksasa es
 * bercincin untuk Deep Space), dihubungkan jalur putus-putus yang bergerak. Tujuan terpilih: jalurnya
 * menyala dengan wahana kecil yang melaju, planetnya dikelilingi cincin orbit yang berputar, dan
 * namanya berwarna Aksen Informasi. Tanpa tujuan terpilih, ketiga jalur dilalui wahana redup.
 *
 * Dipasang di `journey-map/layout.tsx` sehingga TIDAK dimuat ulang saat pindah tujuan (planet tetap
 * berputar, jalur dan cincin berpindah dengan transisi); tujuan aktif dibaca dari segmen rute.
 * Data (nama, misi) dari server lewat props agar JSON konten tidak ikut ke bundel klien.
 *
 * Peta tetap SIMBOLIS: posisi, ukuran, dan jalur bukan rute, jarak, atau skala sebenarnya (catatan di
 * kiri bawah). Desktop: tiga jalur menyebar dari Bumi. Mobile: dirantai Bumi -> Bulan -> Mars -> Deep Space
 * agar jalur tidak saling menabrak planet. Kotak peta berpatokan rasio 1268x620 di desktop sehingga
 * koordinat jalur (SVG) dan planet (persen) selalu sejajar.
 */
export type TujuanPeta = { slug: KategoriSlug; nama: string; misi: string[] };

type Id = "bumi" | KategoriSlug;

type Simpul = {
  jenis: JenisPlanet;
  /** Pusat (persen kotak) dan lebar (persen) di desktop (d) dan mobile (m). */
  xd: number; yd: number; wd: number;
  xm: number; ym: number; wm: number;
  /** Radius planet relatif terhadap kanvas (sama dengan di PlanetCanvas), untuk menaruh label dan cincin. */
  radius: number;
};

const SIMPUL: Record<Id, Simpul> = {
  bumi: { jenis: "bumi", xd: 10, yd: 56, wd: 24, xm: 50, ym: 7, wm: 60, radius: 0.5 },
  moon: { jenis: "bulan", xd: 33, yd: 24, wd: 19, xm: 36, ym: 27, wm: 50, radius: 0.5 },
  mars: { jenis: "mars", xd: 57, yd: 63, wd: 26, xm: 62, ym: 51, wm: 62, radius: 0.6 },
  "deep-space": { jenis: "raksasa", xd: 82, yd: 40, wd: 32, xm: 50, ym: 79, wm: 72, radius: 0.4 },
};

const DESKTOP = { w: 1268, h: 620 };
const MOBILE = { w: 390, h: 1130 };

type Titik = [number, number];
const pusat = (id: Id, mode: "d" | "m"): Titik => {
  const s = SIMPUL[id];
  return mode === "d" ? [(s.xd / 100) * DESKTOP.w, (s.yd / 100) * DESKTOP.h] : [(s.xm / 100) * MOBILE.w, (s.ym / 100) * MOBILE.h];
};

/** Busur kuadratik dari a ke b; `k` mengatur lengkungan (tanda = sisi melengkung). */
function busur(a: Titik, b: Titik, k: number) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = (a[0] + b[0]) / 2 + -dy * k;
  const cy = (a[1] + b[1]) / 2 + dx * k;
  return `M${a[0].toFixed(0)} ${a[1].toFixed(0)} Q${cx.toFixed(0)} ${cy.toFixed(0)} ${b[0].toFixed(0)} ${b[1].toFixed(0)}`;
}

const JALUR_DESKTOP: Record<KategoriSlug, string> = {
  moon: busur(pusat("bumi", "d"), pusat("moon", "d"), -0.22),
  mars: busur(pusat("bumi", "d"), pusat("mars", "d"), 0.2),
  "deep-space": busur(pusat("bumi", "d"), pusat("deep-space", "d"), -0.34),
};
const JALUR_MOBILE: Record<KategoriSlug, string> = {
  moon: busur(pusat("bumi", "m"), pusat("moon", "m"), 0.2),
  mars: busur(pusat("moon", "m"), pusat("mars", "m"), -0.18),
  "deep-space": busur(pusat("mars", "m"), pusat("deep-space", "m"), 0.2),
};
const DURASI: Record<KategoriSlug, string> = { moon: "6s", mars: "9s", "deep-space": "13s" };

function gayaSimpul(s: Simpul): CSSProperties {
  return {
    "--xd": `${s.xd}%`, "--yd": `${s.yd}%`, "--wd": `${s.wd}%`,
    "--xm": `${s.xm}%`, "--ym": `${s.ym}%`, "--wm": `${s.wm}%`,
  } as CSSProperties;
}

/** Props simpul: variabel posisi + atribut reveal (style digabung agar tidak saling menimpa). */
function propsSimpul(s: Simpul, ms: number) {
  const r = reveal(ms);
  return { "data-reveal": r["data-reveal"], style: { ...gayaSimpul(s), ...r.style } };
}

const KELAS_SIMPUL =
  "absolute left-(--xm) top-(--ym) w-(--wm) -translate-x-1/2 -translate-y-1/2 md:left-(--xd) md:top-(--yd) md:w-(--wd)";

function Jalur({ mode, slugs, slug }: { mode: "d" | "m"; slugs: KategoriSlug[]; slug?: KategoriSlug }) {
  const jalur = mode === "d" ? JALUR_DESKTOP : JALUR_MOBILE;
  const ukuran = mode === "d" ? DESKTOP : MOBILE;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${ukuran.w} ${ukuran.h}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 size-full ${mode === "d" ? "max-md:hidden" : "md:hidden"}`}
    >
      {slugs.map((s) => (
        <path key={s} d={jalur[s]} className={`jejak ${s === slug ? "jejak-aktif" : ""}`} />
      ))}
      {/* Wahana kecil: di jalur terpilih (terang), atau di ketiga jalur (redup) bila belum memilih. */}
      {slugs
        .filter((s) => !slug || s === slug)
        .map((s) => (
          <g key={s} className={`wahana ${slug ? "wahana-aktif" : ""}`}>
            <circle r="11" className="wahana-halo" />
            <circle r="3.4" className="wahana-inti" />
            <animateMotion dur={DURASI[s]} repeatCount="indefinite" path={jalur[s]} />
          </g>
        ))}
    </svg>
  );
}

export function PanggungPeta({ daftar, catatan }: { daftar: TujuanPeta[]; catatan: string }) {
  const segmen = useSelectedLayoutSegment();
  const slug = daftar.find((t) => t.slug === segmen)?.slug;
  const slugs = daftar.map((t) => t.slug);
  const bumi = SIMPUL.bumi;
  return (
    <nav
      aria-label="Tujuan"
      className="relative h-[1130px] overflow-hidden rounded-card border border-archive-slate-normal/70 bg-bg-primary-normal/40 bg-[radial-gradient(ellipse_at_16%_52%,rgba(46,100,180,0.22),transparent_58%)] md:aspect-[1268/620] md:h-auto"
      {...reveal(160)}
    >
      <Jalur mode="d" slugs={slugs} slug={slug} />
      <Jalur mode="m" slugs={slugs} slug={slug} />

      {/* Titik berangkat: Bumi (bukan tautan). */}
      <div className={KELAS_SIMPUL} {...propsSimpul(bumi, 0)}>
        <PlanetCanvas jenis={bumi.jenis} />
        <p
          className="text-button-label absolute left-1/2 -translate-x-1/2 text-center text-text-primary-normal [text-shadow:0_1px_12px_rgba(8,11,18,0.95)]"
          style={{ top: `${50 + bumi.radius * 50 + 2}%` }}
        >
          Bumi
        </p>
      </div>

      <ul>
        {daftar.map((t, i) => {
          const s = t.slug;
          const sm = SIMPUL[s];
          const terpilih = s === slug;
          return (
            <li key={s} className={KELAS_SIMPUL} {...propsSimpul(sm, 140 + i * 140)}>
              <Link
                href={`/journey-map/${s}`}
                aria-current={terpilih ? "page" : undefined}
                className="group relative block focus-visible:outline-offset-8"
              >
                <div className="transition-transform duration-500 ease-(--ease-out-soft) group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                  <PlanetCanvas jenis={sm.jenis} />
                </div>
                {terpilih && (
                  <span
                    aria-hidden="true"
                    className="cincin-pilih pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: `${sm.radius * 100 + 14}%`, aspectRatio: "1" }}
                  />
                )}
                <span
                  className="absolute left-1/2 flex w-[240px] -translate-x-1/2 flex-col items-center gap-2 text-center [text-shadow:0_1px_12px_rgba(8,11,18,0.95)] md:w-[150%]"
                  style={{ top: `${50 + sm.radius * 50 + 2}%` }}
                >
                  <span
                    className={`text-button-label transition-colors duration-300 ${
                      terpilih ? "text-aksen-informasi-normal" : "text-text-primary-normal group-hover:text-aksen-informasi-normal"
                    }`}
                  >
                    {t.nama}
                  </span>
                  <span className="flex flex-wrap justify-center gap-1.5">
                    {t.misi.map((nama) => (
                      <span
                        key={nama}
                        className="text-eyebrow-15 rounded-pill border border-white/20 bg-bg-primary-normal/50 px-2.5 py-0.5 uppercase text-text-secondary-normal"
                      >
                        {nama}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="text-body-large absolute bottom-5 left-5 right-5 text-text-secondary-normal md:bottom-6 md:left-8 md:right-auto">
        {catatan}
      </p>
    </nav>
  );
}
