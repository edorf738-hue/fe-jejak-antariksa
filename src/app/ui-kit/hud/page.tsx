import type { Metadata } from "next";
import { getBab, getKategori, getSumber } from "@/data";
import { HudDemo } from "./HudDemo";

export const metadata: Metadata = { title: "UI Kit HUD — Wayang Antariksa" };

// Halaman uji HUD (internal). Tanpa Navbar, seperti halaman imersif sesungguhnya.
export default function HudDemoPage() {
  const bab = getBab(2)!;
  const kategori = getKategori("moon");
  return <HudDemo bab={bab} kategori={kategori} sumber={getSumber().slice(0, 3)} />;
}
