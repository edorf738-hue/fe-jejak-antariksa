import { SOURCE_COPY, type StatusSumber } from "@/data";

const GAYA: Record<StatusSumber, string> = {
  terverifikasi: "border-aksen-informasi-normal/50 bg-aksen-informasi-normal/10 text-aksen-informasi-normal",
  "perlu-verifikasi": "border-aksen-warisan-normal/50 bg-aksen-warisan-normal/10 text-aksen-warisan-normal",
  "belum-tersedia": "border-white/20 bg-white/5 text-text-secondary-normal",
};

/** Status verifikasi sumber: satu dari tiga (Terverifikasi, Perlu verifikasi, Informasi belum tersedia). */
export function LencanaStatus({ status }: { status: StatusSumber }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-pill border px-3 py-0.5 text-sm ${GAYA[status]}`}>
      {SOURCE_COPY.status[status].label}
    </span>
  );
}
