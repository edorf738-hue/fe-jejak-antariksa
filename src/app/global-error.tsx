"use client";

import { Button, Container, PanelStatus, useLang } from "@/components/ui";
import { STATUS_COPY } from "@/data";
import "./globals.css";

/**
 * Galat di root layout: menggantikan seluruh dokumen, jadi memuat globals.css sendiri.
 * Font web (next/font) tidak dimuat di sini (jatuh ke font sistem).
 * Copy: draf, lihat status.ts.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  const { judul, isi, coba, kembali } = STATUS_COPY[useLang()].halamanGalat;
  return (
    <html lang={useLang()} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <title>Wayang Antariksa</title>
        <main className="flex flex-1 items-center py-24">
          <Container>
            <PanelStatus
              varian="galat"
              judul={judul}
              isi={isi}
              aksi={
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => retry()}>{coba}</Button>
                  <Button href="/" variant="secondary">
                    {kembali}
                  </Button>
                </div>
              }
            />
          </Container>
        </main>
      </body>
    </html>
  );
}
