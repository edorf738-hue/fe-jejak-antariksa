import { Navbar } from "@/components/ui";

/**
 * Layout halaman biasa (Beranda, Cerita, Peta Perjalanan, Sumber): ada Navbar.
 * Navbar `fixed`, jadi konten diberi ruang di atas lewat `--navbar-offset`
 * (halaman dengan hero di bawah navbar boleh menimpanya dengan margin negatif).
 * Halaman imersif (Story Bab dan Resources) menyembunyikan navbar dan akan
 * memakai layout sendiri.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col pt-(--navbar-offset)">{children}</main>
    </>
  );
}
