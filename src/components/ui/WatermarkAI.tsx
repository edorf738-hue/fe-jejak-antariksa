/**
 * Penanda gambar buatan AI untuk NASA Space Apps ("Use of SI": gambar hasil SI wajib punya watermark yang
 * terlihat). Pil kecil bergaya kaca; letakkan di dalam pembungkus `relative` yang memuat gambar AI-nya,
 * lewat `className` (mis. `absolute bottom-4 right-4 z-[2]`). Tidak menerima klik.
 */
export function WatermarkAI({ className = "" }: { className?: string }) {
  return (
    <span
      role="note"
      className={`pointer-events-none inline-flex select-none items-center gap-1.5 rounded-pill border border-white/25 bg-bg-primary-normal/65 px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide text-text-primary-normal/85 backdrop-blur-sm ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3 shrink-0 fill-aksen-informasi-normal">
        <path d="M12 2l1.8 5.4L19 9.2l-5.2 1.8L12 16.4l-1.8-5.4L5 9.2l5.2-1.8L12 2zm7 12l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
      </svg>
      AI-generated image
    </span>
  );
}
