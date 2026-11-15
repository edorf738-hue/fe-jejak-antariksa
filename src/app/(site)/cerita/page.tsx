import { redirect } from "next/navigation";

// /cerita sendiri tidak punya isi: daftar bab ada di /story, detail tiap bab di /cerita/[slug].
export default function CeritaIndex() {
  redirect("/story");
}
