import type { Metadata } from "next";
import { PetaPerjalanan } from "./PetaPerjalanan";

export const metadata: Metadata = { title: "Peta Perjalanan — Wayang Antariksa" };

// Belum ada tujuan dipilih: peta tanpa penanda terpilih dan panel state Kosong.
export default function JourneyMapIndex() {
  return <PetaPerjalanan />;
}
