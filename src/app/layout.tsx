import type { Metadata } from "next";
import { Inter, Rajdhani, Space_Grotesk } from "next/font/google";
import { LangProvider } from "@/components/ui/LangProvider";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { getLang } from "@/lib/lang-server";
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

const DESKRIPSI = {
  en: "A space exploration website: storytelling, scientific information, mission journeys, and 3D visualization.",
  id: "Website eksplorasi luar angkasa: storytelling, informasi ilmiah, perjalanan misi, dan visualisasi 3D.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Jejak Antariksa", description: DESKRIPSI[await getLang()] };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    // suppressHydrationWarning: skrip di <head> menambah kelas `js` ke <html> sebelum hidrasi.
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Gerak reveal (globals.css "Gerak halaman") hanya aktif bila JavaScript berjalan; tanpa kelas ini semua konten terlihat. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <LangProvider lang={lang}>{children}</LangProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
