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
      {/* Tautan lompat: muncul saat difokuskan dengan Tab dari awal halaman. */}
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-aksen-informasi-normal focus:px-6 focus:py-3 focus:font-bold focus:text-bg-primary-normal"
      >
        Lewati ke konten
      </a>
      <Navbar />
      <main id="konten" tabIndex={-1} className="flex flex-1 flex-col pt-(--navbar-offset) outline-none">
        {children}
      </main>
    </>
  );
}
