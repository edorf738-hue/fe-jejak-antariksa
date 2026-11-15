import type { Metadata } from "next";
import { Inter, Rajdhani, Space_Grotesk } from "next/font/google";
import { RevealObserver } from "@/components/ui/RevealObserver";
import "./globals.css";

// Font sesuai text style di Figma (docs/FIGMA_HANDOFF.md bagian 2).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Wayang Antariksa",
  description:
    "Website eksplorasi luar angkasa: storytelling, informasi ilmiah, perjalanan misi, dan visualisasi 3D.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: skrip di <head> menambah kelas `js` ke <html> sebelum hidrasi.
    <html
      lang="id"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Gerak reveal (globals.css "Gerak halaman") hanya aktif bila JavaScript berjalan; tanpa kelas ini semua konten terlihat. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
