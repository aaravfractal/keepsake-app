import Link from "next/link";
import PageShell, { PageSection, PlaceholderBlock } from "@/components/marketing/PageShell";

export const metadata = {
  title: "About — Keepsake",
  description: "Why Keepsake exists — memory you actually own.",
};

const vaultCtaClass =
  "ds-focus-ring inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-wax px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-px hover:brightness-[0.94] motion-reduce:transition-none";

export default function AboutPage() {
  return (
    <PageShell eyebrow="About" title="Memory you actually own">
      <PageSection title="Mission">
        <p>
          Your life is made of moments — and they shouldn&apos;t live in apps that can delete them,
          sell them, or disappear. Keepsake is a companion that remembers your life and gives you
          memory you actually own.
        </p>
      </PageSection>

      <PageSection title="The honest story">
        <p>
          Keepsake was built by one person with AI, on the 0G decentralized network, during a
          global build tournament.
        </p>
      </PageSection>

      <PageSection title="How ownership works today">
        <p>
          Keepsake is architected for per-user ownership — each person gets their own identity and
          encryption key. The live testnet demo uses a single wallet so anyone can try it
          instantly, without wallet setup.
        </p>
      </PageSection>

      <PlaceholderBlock label="[TEAM/CONTACT]" />

      <div className="pt-2">
        <Link href="/app" className={vaultCtaClass}>
          Open your vault
        </Link>
      </div>
    </PageShell>
  );
}
