"use client";

import { Button, Container, PanelStatus } from "@/components/ui";
import { STATUS_COPY } from "@/data";
import "./globals.css";

/**
 * Galat di root layout: menggantikan seluruh dokumen, jadi memuat globals.css sendiri.
 * Font web (next/font) tidak dimuat di sini (jatuh ke font sistem). Hanya tombol Coba Lagi
 * (tanpa next/link, karena router mungkin ikut rusak). Copy: draf, lihat status.ts.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  const { judul, isi, coba } = STATUS_COPY.halamanGalat;
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 items-center py-24">
          <Container>
            <PanelStatus varian="galat" judul={judul} isi={isi} aksi={<Button onClick={() => retry()}>{coba}</Button>} />
          </Container>
        </main>
      </body>
    </html>
  );
}
