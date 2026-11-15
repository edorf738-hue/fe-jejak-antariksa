"use client";

import { Button, PanelStatus, useLang } from "@/components/ui";
import { STATUS_COPY } from "@/data";

// State Galat (FIGMA "Panel — Galat"): tombol Coba Lagi memuat ulang segmen.
export default function JourneyMapError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { judul, isi, coba } = STATUS_COPY[useLang()].misiGalat;
  return (
    <PanelStatus varian="galat" judul={judul} isi={isi} aksi={<Button onClick={reset}>{coba}</Button>} />
  );
}
