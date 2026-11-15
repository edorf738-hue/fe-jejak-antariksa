"use client";

import { Button, Container, PanelStatus } from "@/components/ui";
import { STATUS_COPY } from "@/data";

/** Galat saat render halaman (di dalam root layout). Copy: draf, lihat status.ts. `retry` = API Next 16.4. */
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  const { judul, isi, coba, kembali } = STATUS_COPY.halamanGalat;
  return (
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
  );
}
