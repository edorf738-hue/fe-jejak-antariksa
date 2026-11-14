import type { Metadata } from "next";
import { Inter, Rajdhani, Space_Grotesk } from "next/font/google";
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
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
