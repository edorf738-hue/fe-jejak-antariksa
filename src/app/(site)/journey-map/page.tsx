import type { Metadata } from "next";
import { PanelStatus } from "@/components/ui";
import { STATUS_COPY } from "@/data";

export const metadata: Metadata = { title: "Peta Perjalanan — Wayang Antariksa" };

// Belum ada tujuan dipilih: peta tanpa penanda terpilih (di layout) dan panel state Kosong.
export default function JourneyMapIndex() {
  return <PanelStatus varian="kosong" {...STATUS_COPY.tujuanKosong} />;
}
