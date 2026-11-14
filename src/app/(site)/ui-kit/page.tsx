import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Container, ICON_NAMES, Icon, IconButton } from "@/components/ui";

export const metadata: Metadata = { title: "UI Kit — Wayang Antariksa" };

// Halaman acuan internal untuk tim: token, text style, dan komponen fondasi.
const FAMILIES = [
  "bg-primary",
  "bg-secondary",
  "archive-slate",
  "text-primary",
  "text-secondary",
  "aksen-warisan",
  "aksen-informasi",
  "aksen-visual",
] as const;

const LEVELS = [
  "light",
  "light-hover",
  "light-active",
  "normal",
  "normal-hover",
  "normal-active",
  "dark",
  "dark-hover",
  "dark-active",
  "darker",
] as const;

const TEXT_STYLES = [
  { cls: "text-hero-90", name: "Hero/Headline 90", sample: "Wayang Antariksa" },
  { cls: "text-hero-70", name: "Hero/Headline 70", sample: "Wayang Antariksa" },
  { cls: "text-hero-36", name: "Hero/Headline 36 (usulan)", sample: "Wayang Antariksa" },
  { cls: "text-eyebrow-20", name: "Hero/Eyebrow 20", sample: "KISAH WAHANA" },
  { cls: "text-eyebrow-15", name: "Hero/Eyebrow 15", sample: "KISAH WAHANA" },
  { cls: "text-heading-section", name: "Heading/Section 48 (usulan)", sample: "Empat Bab Eksplorasi" },
  { cls: "text-heading-card", name: "Heading/Card 32 (usulan)", sample: "Bab 2: Bulan" },
  { cls: "text-body-large", name: "Body/Large 20", sample: "Teks isi untuk paragraf pengantar." },
  { cls: "text-button-label", name: "Button/Label 20", sample: "Mulai dari Bab 1" },
  { cls: "text-nav-link", name: "Nav/Link", sample: "Peta Perjalanan" },
  { cls: "text-nav-link-active", name: "Nav/Link Active", sample: "Peta Perjalanan" },
] as const;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-heading-card text-text-primary-normal">{title}</h2>
      {children}
    </section>
  );
}

export default function UiKitPage() {
  return (
    <Container className="flex flex-col gap-section pb-24">
      <header className="flex flex-col gap-3">
        <p className="text-eyebrow-15 text-aksen-warisan-normal">FONDASI UI</p>
        <h1 className="text-hero-36 text-text-primary-normal">UI Kit</h1>
        <p className="text-body-large max-w-2xl text-text-secondary-normal">
          Token, text style, dan komponen dasar dari <code>docs/FIGMA_HANDOFF.md</code>.
          Ubah lebar jendela untuk melihat tiga breakpoint (390 / 768 / 1440).
        </p>
        <Link href="/ui-kit/hud" className="text-aksen-informasi-normal underline underline-offset-4">
          Uji komponen HUD (kerangka halaman imersif)
        </Link>
      </header>

      <Block title="Warna">
        <div className="flex flex-col gap-4">
          {FAMILIES.map((family) => (
            <div key={family} className="flex flex-col gap-2">
              <p className="text-sm text-text-secondary-normal">{family}</p>
              <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                {LEVELS.map((level) => (
                  <div
                    key={level}
                    title={`--color-${family}-${level}`}
                    className="h-12 rounded-lg ring-1 ring-white/10"
                    style={{ background: `var(--color-${family}-${level})` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Text style">
        <div className="flex flex-col gap-6">
          {TEXT_STYLES.map((t) => (
            <div
              key={t.cls}
              className="flex flex-col gap-1 border-b border-archive-slate-normal pb-4"
            >
              <p className="text-sm text-text-secondary-normal">
                {t.name} · <code>{t.cls}</code>
              </p>
              <p className={`${t.cls} break-words text-text-primary-normal`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Button">
        <div className="flex flex-wrap items-center gap-6">
          <Button>Default</Button>
          <Button iconLeft="info">Ikon Kiri</Button>
          <Button iconRight="panah-kanan">Ikon Kanan</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Button variant="secondary">Default</Button>
          <Button variant="secondary" iconLeft="misi">
            Misi Terkait
          </Button>
          <Button variant="secondary" iconRight="panah-kanan">
            Bab 3
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" loading>
            Loading
          </Button>
        </div>
        <p className="text-sm text-text-secondary-normal">
          Hover, Active, dan Focus: arahkan kursor, tekan, atau tekan Tab.
        </p>
      </Block>

      <Block title="Tombol Ikon">
        <div className="flex flex-wrap items-center gap-6">
          <IconButton icon="panah-kiri" label="Kembali ke Beranda" />
          <IconButton icon="setel-ulang-kamera" label="Setel ulang kamera" />
          <IconButton icon="layar-penuh" label="Layar penuh" />
          <IconButton icon="jeda" label="Jeda gerak" />
          <IconButton icon="tutup" label="Tutup" disabled />
        </div>
      </Block>

      <Block title={`Ikon (${ICON_NAMES.length})`}>
        <ul className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-9">
          {ICON_NAMES.map((name) => (
            <li
              key={name}
              className="flex flex-col items-center gap-2 rounded-card bg-bg-secondary-normal p-4 text-text-primary-normal"
            >
              <Icon name={name} size={32} />
              <span className="text-center text-xs text-text-secondary-normal">{name}</span>
            </li>
          ))}
        </ul>
      </Block>
    </Container>
  );
}
