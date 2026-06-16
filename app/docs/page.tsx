import Link from "next/link";
import PageShell, { PageSection } from "@/components/marketing/PageShell";
import { site } from "@/lib/site";

export const metadata = {
  title: "Docs — Keepsake",
  description: "Technical overview of how Keepsake uses 0G Storage, Compute, and Chain.",
};

const loopSteps = [
  "Share a memory",
  "Encrypt on device",
  "Store on 0G Storage",
  "Recall",
  "Reflect with 0G Compute (TEE)",
  "Provenance proof on 0G Chain",
] as const;

const monoChipClass =
  "rounded-[var(--radius-sm)] border border-ink/10 bg-paper px-3 py-2 font-mono text-xs leading-snug text-ink";

export default function DocsPage() {
  return (
    <PageShell
      eyebrow="Documentation"
      title="How Keepsake works on 0G"
      intro="Keepsake runs on three load-bearing layers of the 0G network. Remove any one and the product stops being itself."
    >
      <PageSection title="The loop">
        <ol className="space-y-2 md:hidden">
          {loopSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="text-caption mt-2 shrink-0 tabular-nums">{index + 1}.</span>
              <span className={monoChipClass}>{step}</span>
            </li>
          ))}
        </ol>
        <div className="hidden rounded-[var(--radius)] border border-ink/10 bg-paper-2/60 p-5 md:block">
          <div className="flex flex-wrap items-center gap-2">
            {loopSteps.map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className={monoChipClass}>{step}</span>
                {index < loopSteps.length - 1 ? (
                  <span className="font-mono text-xs text-ink-soft" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection title="0G Storage">
        <p>
          Memories are stored as encrypted, user-owned assets. Each upload returns a root hash
          recorded onchain — ciphertext on 0G, keys with you.
        </p>
      </PageSection>

      <PageSection title="0G Compute / TEE">
        <p>
          Reflection runs in a trusted execution enclave. When you ask a question, Keepsake
          decrypts your relevant memories, sends them to{" "}
          <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.8125rem] text-ink">
            qwen2.5-omni
          </code>{" "}
          inside the enclave, and each run returns a sealed-inference receipt (provider + request
          ID) you can verify.
        </p>
      </PageSection>

      <PageSection title="0G Chain">
        <p>
          Provenance proofs for every memory — root hash, owner, timestamp — plus the reflection
          certificate tying each story to the onchain memories it drew from. Built on Agentic ID
          identity; iNFT-ready (
          <code className="font-mono text-[0.8125rem] text-ink">ERC-7857</code>).
        </p>
        <p className="mt-4 font-mono text-[0.8125rem] leading-relaxed text-ink-soft">
          chainscan-galileo.0g.ai
          <br />
          indexer-storage-testnet-turbo.0g.ai
        </p>
      </PageSection>

      <PageSection title="Security model">
        <ul className="list-disc space-y-2 pl-5">
          <li>Client-side ECIES encryption before anything leaves the device.</li>
          <li>Encrypt-to-self — the operator cannot read your memories.</li>
          <li>No third-party credentials held by Keepsake.</li>
          <li>No secrets in the public repo.</li>
        </ul>
      </PageSection>

      <PageSection title="Run it locally">
        <p>
          Clone the repo, add your keys, and run the full loop on your machine. See the README for
          environment variables and setup:
        </p>
        <pre className="mt-4 max-w-full overflow-x-auto rounded-[var(--radius-sm)] border border-ink/10 bg-paper-2/80 p-4 font-mono text-[0.8125rem] leading-relaxed text-ink">
          {`npm install
# .env.local: PRIVATE_KEY, OG_API_KEY,
#            KV_REST_API_URL, KV_REST_API_TOKEN
npm run dev`}
        </pre>
        <p className="mt-4">
          <Link
            href={site.repoUrl}
            className="text-wax underline decoration-wax/30 underline-offset-4 transition-colors hover:decoration-wax ds-focus-ring rounded-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            View README on GitHub →
          </Link>
        </p>
      </PageSection>
    </PageShell>
  );
}
