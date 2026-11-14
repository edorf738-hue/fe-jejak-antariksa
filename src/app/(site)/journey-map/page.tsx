import { redirect } from "next/navigation";

// Peta Perjalanan tanpa tujuan terpilih: buka Moon (tujuan pertama di peta).
export default function JourneyMapIndex() {
  redirect("/journey-map/moon");
}
