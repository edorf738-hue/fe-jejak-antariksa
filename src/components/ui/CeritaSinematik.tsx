"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type LayarCerita = { nomor: string; judul: string; ringkasan: string; gambar: string };

/**
 * Cerita sinematik: satu layar penuh yang menempel (pin) selama pengguna menggulir; tiap bab bergantian
 * lewat crossfade gambar dan teks, dengan penanda kemajuan. Murni dekoratif (aria-hidden): daftar bab
 * di bawahnya tetap jalur navigasi dan bacaan utama. Disembunyikan saat prefers-reduced-motion.
 */
export function CeritaSinematik({ layar }: { layar: LayarCerita[] }) {
  const akar = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = akar.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lapis = gsap.utils.toArray<HTMLElement>("[data-lapis]", el);
      const teks = gsap.utils.toArray<HTMLElement>("[data-teks]", el);
      const titik = gsap.utils.toArray<HTMLElement>("[data-titik]", el);
      const langkah = lapis.length - 1;
      gsap.set(lapis.slice(1), { opacity: 0 });
      gsap.set(titik[0], { scale: 1.4 });
      gsap.set(teks.slice(1), { opacity: 0, y: 32 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: `+=${langkah * 80}%`, pin: true, scrub: 0.6 },
      });
      for (let i = 1; i <= langkah; i++) {
        tl.to(teks[i - 1], { opacity: 0, y: -32, duration: 0.4 }, i - 1 + 0.6)
          .to(lapis[i - 1], { opacity: 0, duration: 0.6 }, i - 1 + 0.6)
          .to(lapis[i], { opacity: 1, duration: 0.6 }, i - 1 + 0.6)
          .to(teks[i], { opacity: 1, y: 0, duration: 0.4 }, i - 1 + 0.9)
          .to(titik[i], { opacity: 1, scale: 1.4, duration: 0.2 }, i - 1 + 0.8)
          .to(titik[i - 1], { opacity: 0.4, scale: 1, duration: 0.2 }, i - 1 + 0.8);
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={akar}
      aria-hidden="true"
      className="relative h-svh w-full overflow-hidden bg-bg-primary-normal motion-reduce:hidden"
    >
      {layar.map((l, i) => (
        <div key={l.nomor} data-lapis className="absolute inset-0">
          <Image src={l.gambar} alt="" fill sizes="100vw" quality={85} priority={i === 0} className="object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#080b12_5%,rgba(8,11,18,0.55)_55%,rgba(8,11,18,0.8)_100%)]" />

      <div className="px-page absolute inset-x-0 bottom-0 top-0 mx-auto flex max-w-(--container-page) items-end pb-24 md:pb-28">
        <div className="relative h-72 w-full md:h-64 md:max-w-[720px]">
          {layar.map((l) => (
            <div key={l.nomor} data-teks className="absolute inset-x-0 bottom-0 flex flex-col gap-3">
              <p className="text-eyebrow-15 uppercase text-aksen-warisan-normal md:text-eyebrow-20">Bab {l.nomor}</p>
              <h2 className="text-heading-card text-text-primary-normal md:text-heading-section">{l.judul}</h2>
              <p className="text-body-large text-text-secondary-normal">{l.ringkasan}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3">
        {layar.map((l, i) => (
          <span
            key={l.nomor}
            data-titik
            className="size-2 rounded-full bg-text-primary-normal"
            style={{ opacity: i === 0 ? 1 : 0.4 }}
          />
        ))}
      </div>
    </section>
  );
}
