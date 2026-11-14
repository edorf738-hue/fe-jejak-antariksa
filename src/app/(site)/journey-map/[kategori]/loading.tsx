import { Container, PageHeader, PanelStatus } from "@/components/ui";
import { JOURNEY_COPY, STATUS_COPY } from "@/data";

// State Memuat (FIGMA "Panel — Memuat"): header tetap, isi diganti kerangka.
export default function Loading() {
  return (
    <>
      <PageHeader {...JOURNEY_COPY.header} gambar="/images/journey-map/header-peta.webp" />
      <Container className="pb-16 pt-10 md:pb-[72px] md:pt-14 lg:pb-24 lg:pt-[72px]">
        <PanelStatus varian="memuat" isi={STATUS_COPY.misiMemuat} />
      </Container>
    </>
  );
}
