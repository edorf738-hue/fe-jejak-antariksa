"use client";

import { Button, Container, PanelStatus } from "@/components/ui";
import { STATUS_COPY } from "@/data";

// State Galat (FIGMA "Panel — Galat"): tombol Coba Lagi memuat ulang segmen.
export default function JourneyMapError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { judul, isi, coba } = STATUS_COPY.misiGalat;
  return (
    <Container className="py-24">
      <PanelStatus varian="galat" judul={judul} isi={isi} aksi={<Button onClick={reset}>{coba}</Button>} />
    </Container>
  );
}
