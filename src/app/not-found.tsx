import { Button, Container, PanelStatus } from "@/components/ui";
import { STATUS_COPY } from "@/data";
import { getLang } from "@/lib/lang-server";

/**
 * 404 (rute tidak ada, `notFound()`, dan /ui-kit yang sudah dihapus). Berada di luar route group
 * (site), jadi tanpa Navbar: cukup panel status dan tombol ke Beranda. Copy: draf, lihat status.ts.
 */
export default async function NotFound() {
  const { judul, isi, kembali } = STATUS_COPY[await getLang()].tidakDitemukan;
  return (
    <main className="flex flex-1 items-center py-24">
      <Container>
        <PanelStatus varian="kosong" judul={judul} isi={isi} aksi={<Button href="/">{kembali}</Button>} />
      </Container>
    </main>
  );
}
