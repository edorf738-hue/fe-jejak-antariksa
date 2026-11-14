import { IconLink } from "@/components/ui";

/**
 * Tombol Kembali (Tombol Ikon, Panah Kiri, 44 px) di pojok kiri atas halaman
 * imersif. Story kembali ke Cerita; Resources kembali ke Beranda (usulan, belum
 * disetujui tim). `label` wajib, mis. "Kembali ke Beranda" atau "Kembali ke Cerita".
 */
export function TombolKembali({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return <IconLink href={href} icon="panah-kiri" label={label} className={className} />;
}
