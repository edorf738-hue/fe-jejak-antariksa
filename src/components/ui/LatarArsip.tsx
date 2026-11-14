/**
 * Latar Arsip (halaman Sumber, FIGMA_HANDOFF bagian 7): gradien slate dengan
 * grain dan grid sangat samar. Di Figma berupa potongan 1440x720 (700 di mobile)
 * yang diulang, tiap potongan diputar 180 derajat bergantian, tumpang tindih 20%,
 * dengan mask pudar vertikal (0 -> 100% di 22% -> 100% di 78% -> 0). Pasang di
 * dalam pembungkus `relative`; berada di bawah konten dan tidak menerima klik.
 * Untuk web, sebaiknya satu lapisan tetap yang bergerak pelan (belum dibuat).
 */
const JUMLAH_SEGMEN = 8;
const MASK = "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";

export function LatarArsip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden [--seg-h:700px] md:[--seg-h:720px]"
    >
      {Array.from({ length: JUMLAH_SEGMEN }, (_, i) => (
        <div
          key={i}
          className={`absolute inset-x-0 h-(--seg-h) bg-[url('/images/source/latar-arsip.webp')] bg-cover bg-center ${i % 2 === 1 ? "rotate-180" : ""}`}
          style={{
            top: `calc(${i} * var(--seg-h) * 0.8)`,
            maskImage: MASK,
            WebkitMaskImage: MASK,
          }}
        />
      ))}
    </div>
  );
}
