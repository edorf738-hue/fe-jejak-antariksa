"use client";

import { useEffect, useRef } from "react";
import { Button, useLang } from "@/components/ui";
import { SOURCE_COPY, URL_PANDUAN_NASA, type SumberItem } from "@/data";
import { LencanaStatus } from "./LencanaStatus";

/**
 * Detail Sumber: modal berisi nama aset, kredit, penerbit, URL halaman asal, lisensi atau ketentuan, tanggal akses, dan
 * status verifikasi. Esc, klik latar, atau tombol Tutup menutupnya; fokus dikurung di dalam dan dikembalikan ke tombol pemicu.
 */
export function DetailSumber({ item, onTutup }: { item: SumberItem; onTutup: () => void }) {
  const c = SOURCE_COPY[useLang()];
  const u = c.ui;
  const kotak = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pemicu = document.activeElement as HTMLElement | null;
    kotak.current?.focus();
    const tombol = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onTutup();
        return;
      }
      if (e.key !== "Tab" || !kotak.current) return;
      const fokus = [...kotak.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (fokus.length === 0) return;
      const awal = fokus[0];
      const akhir = fokus[fokus.length - 1];
      if (e.shiftKey && (document.activeElement === awal || document.activeElement === kotak.current)) {
        e.preventDefault();
        akhir.focus();
      } else if (!e.shiftKey && document.activeElement === akhir) {
        e.preventDefault();
        awal.focus();
      }
    };
    window.addEventListener("keydown", tombol);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tombol);
      document.body.style.overflow = overflow;
      pemicu?.focus();
    };
  }, [onTutup]);

  const baris: { label: string; isi: React.ReactNode }[] = [
    { label: u.kredit, isi: item.kredit },
    { label: u.penerbit, isi: item.penerbit },
    {
      label: u.urlAsal,
      isi: item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="break-all text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover">
          {item.url}
          <span className="sr-only">{u.tabBaru}</span>
        </a>
      ) : (
        u.belumTersedia
      ),
    },
    {
      label: u.lisensi,
      isi: (
        <>
          {item.lisensi}{" "}
          <a href={URL_PANDUAN_NASA} target="_blank" rel="noopener noreferrer" className="text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover">
            {u.panduanNasa}<span className="sr-only">{u.tabBaru}</span>
          </a>
        </>
      ),
    },
    { label: u.tanggalAkses, isi: item.diakses ?? u.belumDicatat },
  ];

  return (
    <div
      onClick={onTutup}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-8"
    >
      <div
        ref={kotak}
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-detail-sumber"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-[720px] flex-col gap-5 overflow-y-auto rounded-t-[28px] border border-white/10 bg-[rgba(10,14,24,0.96)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] outline-none md:rounded-[28px] md:p-8"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow-15 uppercase text-aksen-warisan-normal">{item.jenis}</p>
            <h2 id="judul-detail-sumber" className="text-heading-card text-text-primary-normal max-md:text-2xl">
              {item.nama}
            </h2>
            <LencanaStatus status={item.status} />
          </div>
          <Button kecil kaca variant="secondary" onClick={onTutup} aria-label={u.tutupAria} className="shrink-0">
            {u.tutup}
          </Button>
        </header>

        <dl className="flex flex-col gap-4">
          {baris.map((b) => (
            <div key={b.label} className="flex flex-col gap-1 border-t border-white/10 pt-4">
              <dt className="text-sm text-text-secondary-normal">{b.label}</dt>
              <dd className="text-base leading-6 text-text-primary-normal">{b.isi}</dd>
            </div>
          ))}
        </dl>

        {item.catatan && (
          <p className="rounded-[16px] border border-white/10 px-4 py-3 text-sm leading-5 text-text-secondary-normal">{item.catatan}</p>
        )}

        {item.rincian && (
          <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
            <p className="text-sm text-text-secondary-normal">{u.isiKelompok} ({item.rincian.length} {u.berkas})</p>
            <ul className="flex flex-col gap-3">
              {item.rincian.map((r) => (
                <li key={r.nama} className="flex flex-col gap-0.5">
                  <span className="text-base leading-6 text-text-primary-normal">
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-aksen-informasi-normal hover:text-aksen-informasi-normal-hover">
                        {r.nama}
                        <span className="sr-only">{u.tabBaru}</span>
                      </a>
                    ) : (
                      r.nama
                    )}
                  </span>
                  <span className="text-xs text-text-secondary-normal">{u.kredit}: {r.kredit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-text-secondary-normal">{c.status[item.status].arti}</p>
      </div>
    </div>
  );
}
