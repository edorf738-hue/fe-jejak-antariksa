import { Button, Container } from "@/components/ui";

// Placeholder: Home (hero, kartu lingkungan, pengantar) dikerjakan di PR terpisah.
export default function Home() {
  return (
    <Container className="flex flex-col items-start gap-6 py-10">
      <p className="text-eyebrow-15 text-aksen-warisan-normal">FONDASI UI</p>
      <h1 className="text-hero-36 text-text-primary-normal">Wayang Antariksa</h1>
      <p className="text-body-large max-w-xl text-text-secondary-normal">
        Halaman Beranda belum dibuat. Lihat token dan komponen fondasi di halaman
        ui-kit.
      </p>
      <Button href="/ui-kit" iconRight="panah-kanan">
        Buka ui-kit
      </Button>
    </Container>
  );
}
