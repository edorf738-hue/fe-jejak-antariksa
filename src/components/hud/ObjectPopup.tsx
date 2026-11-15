"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { MediaItem } from "@/data";
import { ImageViewer, VideoViewer } from "./ObjectMedia";

// Three.js dan penampil model baru diunduh saat popup dengan model 3D dibuka.
const Model3DViewer = dynamic(() => import("./Model3DViewer"), {
  ssr: false,
  loading: () => <p className="flex h-full items-center justify-center text-sm text-text-secondary-normal">Memuat model 3D…</p>,
});

/**
 * Popup objek (Data Benda): media menjadi fokus, lalu teks ringkas. Media dipilih menurut jenis aset yang benar-benar ada:
 *  - model3d: penampil interaktif (putar, zoom, setel ulang);
 *  - image  : foto utuh (tidak terpotong), bisa diperbesar;
 *  - video  : pemutar HTML5 tanpa putar otomatis;
 *  - tanpa media: hanya teks.
 * Bila ada lebih dari satu media, pengguna berpindah lewat tab. Desktop: panel kaca di kanan; mobile: lembar di bawah.
 */
type ObjectPopupProps = {
  nama: string;
  kategori: string;
  deskripsi: string;
  fakta: string;
  sumber?: string;
  media?: MediaItem[];
  catatanModel?: string;
  eyebrow?: string;
  onTutup?: () => void;
  className?: string;
};

const LABEL: Record<MediaItem["jenis"], string> = { model3d: "Model 3D", image: "Foto", video: "Video" };
const TINGGI_MEDIA = "aspect-[4/3] max-lg:aspect-[16/10] max-lg:max-h-[34dvh]";

export function ObjectPopup({ nama, kategori, deskripsi, fakta, sumber, media = [], catatanModel, eyebrow = "DATA BENDA", onTutup, className = "" }: ObjectPopupProps) {
  const [dipilih, setDipilih] = useState(0);
  const aktif = media[Math.min(dipilih, media.length - 1)];

  return (
    <article
      data-popup-objek
      className={`flex w-full flex-col overflow-hidden break-words rounded-[24px] bg-[rgba(10,14,24,0.88)] backdrop-blur-[14px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] max-lg:max-h-[66dvh] max-lg:overflow-y-auto lg:w-[400px] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5">
        <p className="text-eyebrow-15 text-aksen-informasi-normal">{eyebrow}</p>
        {onTutup && (
          <button
            type="button"
            onClick={onTutup}
            className="cursor-pointer rounded-pill border border-white/15 px-3 py-1 text-sm text-text-primary-normal transition-colors duration-200 hover:border-aksen-informasi-normal"
          >
            Tutup
          </button>
        )}
      </div>

      {media.length > 1 && (
        <div role="tablist" aria-label="Jenis media" className="flex flex-wrap gap-2 px-5 pb-3">
          {media.map((m, i) => (
            <button
              key={`${m.jenis}-${m.src}`}
              type="button"
              role="tab"
              aria-selected={i === dipilih}
              onClick={() => setDipilih(i)}
              className={`cursor-pointer rounded-pill border px-3 py-1 text-sm transition-colors duration-200 ${
                i === dipilih
                  ? "border-aksen-informasi-normal bg-aksen-informasi-normal text-bg-primary-normal"
                  : "border-white/15 text-text-primary-normal hover:border-aksen-informasi-normal"
              }`}
            >
              {m.label ?? LABEL[m.jenis]}
            </button>
          ))}
        </div>
      )}

      {aktif && (
        <figure className="flex flex-col gap-1.5">
          {aktif.jenis === "model3d" && <Model3DViewer key={aktif.src} src={aktif.src} keterangan={aktif.keterangan} className={TINGGI_MEDIA} />}
          {aktif.jenis === "image" && <ImageViewer key={aktif.src} src={aktif.src} alt={aktif.keterangan} className={TINGGI_MEDIA} />}
          {aktif.jenis === "video" && <VideoViewer key={aktif.src} src={aktif.src} poster={aktif.poster} judul={aktif.keterangan} className={TINGGI_MEDIA} />}
          <figcaption className="px-5 text-xs text-text-secondary-normal">
            {aktif.keterangan} Kredit: {aktif.kredit}.
          </figcaption>
        </figure>
      )}

      <div className="flex flex-col gap-2 p-5">
        <h2 className="text-heading-card text-text-primary-normal max-lg:text-2xl">{nama}</h2>
        <p className="text-sm leading-5 text-text-secondary-normal">{kategori}</p>
        <p className="text-base leading-6 text-text-secondary-normal">{deskripsi}</p>
        <p className="text-base leading-6 text-text-secondary-normal">
          {fakta}
          {sumber ? ` (sumber: ${sumber})` : ""}
        </p>
        {catatanModel && <p className="text-xs text-aksen-warisan-normal">{catatanModel}</p>}
      </div>
    </article>
  );
}
