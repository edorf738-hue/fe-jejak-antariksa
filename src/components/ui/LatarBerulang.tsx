/**
 * Latar berulang untuk halaman non-imersif (FIGMA_HANDOFF bagian 7):
 * - Sumber: "Latar Arsip" (gradien slate, grain, grid sangat samar), statis.
 * - Peta Perjalanan: "Latar Peta Bintang" (grid lengkung, orbit samar, bintang),
 *   di Figma bergerak sangat pelan (belum dibuat; masuk butir animasi).
 *
 * Di Figma berupa potongan 1440x720 (700 di mobile) yang diulang, tiap potongan
 * diputar 180 derajat bergantian, tumpang tindih 20%, dengan mask pudar vertikal
 * (0 -> 100% di 22% -> 100% di 78% -> 0). Pasang di dalam pembungkus `relative`;
 * berada di bawah konten dan tidak menerima klik. Untuk web, sebaiknya satu lapisan
 * tetap (`position: fixed`) yang bergerak pelan, bukan potongan berulang.
 */
const MASK = "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";

type LatarBerulangProps = {
  /** Path gambar potongan di /public. */
  gambar: string;
  /** Jumlah potongan; cukup banyak untuk menutup tinggi halaman terpanjang. */
  jumlah?: number;
  /** Opasitas gambar (Peta Bintang 0,9). */
  opacity?: number;
};

export function LatarBerulang({ gambar, jumlah = 8, opacity = 1 }: LatarBerulangProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [--seg-h:700px] md:[--seg-h:720px]"
    >
      {Array.from({ length: jumlah }, (_, i) => (
        <div
          key={i}
          className={`absolute inset-x-0 h-(--seg-h) bg-cover bg-center ${i % 2 === 1 ? "rotate-180" : ""}`}
          style={{
            top: `calc(${i} * var(--seg-h) * 0.8)`,
            backgroundImage: `url('${gambar}')`,
            maskImage: MASK,
            WebkitMaskImage: MASK,
            opacity,
          }}
        />
      ))}
    </div>
  );
}
