import Link from "next/link";
import PageShell, { PageSection, PlaceholderBlock } from "@/components/marketing/PageShell";

export const metadata = {
  title: "Privacy — Keepsake",
  description: "How Keepsake keeps your memories private, encrypted, and yours.",
};

const vaultCtaClass =
  "ds-focus-ring inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-wax px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-px hover:brightness-[0.94] motion-reduce:transition-none";

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy & security"
      title="Your memories stay yours"
      intro="Keepsake is built so your most personal moments stay yours. Here's exactly how."
    >
      <PageSection title="What we collect">
        <p>
          Almost nothing. Your memories are encrypted on your device before they ever reach us.
          We can&apos;t read them, and we don&apos;t want to.
        </p>
      </PageSection>

      <PageSection id="security" title="How it stays private">
        <p>
          Every memory is encrypted on your device before it&apos;s stored. Reflection runs inside
          a trusted enclave, so even while your memories are being read to write a story, the
          plaintext is never exposed to us or anyone else. We hold no keys to your content.
        </p>
      </PageSection>

      <PageSection id="ownership" title="What you own">
        <p>
          Each memory is stored as an asset tied to your identity, with a key only you control —
          not a row in our database. You can take your memories with you, or delete them.
          They&apos;re yours.
        </p>
      </PageSection>

      <PageSection title="Your data is never sold or used to train AI">
        <p>
          We never sell your data. We never use your memories to train any AI model. Ever.
        </p>
      </PageSection>

      <PlaceholderBlock label="[FORMAL_POLICY]" />

      <div className="pt-2">
        <Link href="/app" className={vaultCtaClass}>
          Open your vault
        </Link>
      </div>
    </PageShell>
  );
}
