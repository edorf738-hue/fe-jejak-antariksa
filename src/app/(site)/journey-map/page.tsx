import type { Metadata } from "next";
import { PanelStatus } from "@/components/ui";
import { STATUS_COPY } from "@/data";
import { getLang } from "@/lib/lang-server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: `${(await getLang()) === "en" ? "Journey Map" : "Peta Perjalanan"} — Wayang Antariksa` };
}

// Belum ada tujuan dipilih: peta tanpa penanda terpilih (di layout) dan panel state Kosong.
export default async function JourneyMapIndex() {
  return <PanelStatus varian="kosong" {...STATUS_COPY[await getLang()].tujuanKosong} />;
}
