import type { ReactNode } from "react";
import Link from "next/link";
import WaxSeal from "@/app/components/WaxSeal";
import FaqAccordion from "@/components/landing/FaqAccordion";
import FadeUp from "@/components/landing/FadeUp";
import { Card, Container, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";

const primaryLinkClass =
  "ds-focus-ring inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-wax px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-px hover:brightness-[0.94] active:translate-y-0 active:brightness-[0.88] motion-reduce:transition-none";

const ghostLinkClass =
  "ds-focus-ring inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-ink/20 bg-transparent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper-2 active:bg-paper-2/80 motion-reduce:transition-none";

function StepIcon({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] border border-ink/10 bg-paper text-ink-soft">
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <FadeUp>
            <h1 className="text-hero max-w-[16ch]">
              The AI that remembers your life —{" "}
              <span className="italic">and a memory no one can take from you.</span>
            </h1>
            <p className="mt-6 max-w-[42ch] text-ink-soft">
              Tell Keepsake your moments. Ask it anything. Your own memories answer — as a
              story. Encrypted before they leave your device, and provably yours, forever.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/app" className={primaryLinkClass}>
                Open your vault
              </Link>
              <Link href="/#how-it-works" className={ghostLinkClass}>
                See how it works
              </Link>
            </div>
          </FadeUp>

          <FadeUp className="flex justify-center lg:justify-end">
            <WaxSeal size="hero" className="opacity-95" />
          </FadeUp>
        </Container>
      </section>

      <section id="how-it-works" className="border-t border-ink/[0.08] py-16 md:py-20">
        <Container>
          <FadeUp>
            <Eyebrow>How it works</Eyebrow>
          </FadeUp>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Share a moment.",
                body: "Talk to Keepsake like a journal — a trip, a person, a feeling. Add a photo.",
                icon: (
                  <StepIcon>
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                      <rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M3 8.5 12 14l9-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </StepIcon>
                ),
              },
              {
                step: "02",
                title: "Ask anything later.",
                body: '"What did we do in Goa?" Your own memories answer, woven into a story.',
                icon: (
                  <StepIcon>
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                      <path
                        d="M6 8.5c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5c0 2.2-1.6 4-3.8 4.6L12 18l-2.2-5.4C7.6 12.5 6 10.7 6 8.5Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                      <path d="M10.5 8.2h.01M13.5 8.2h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </StepIcon>
                ),
              },
              {
                step: "03",
                title: "Own it forever.",
                body: "Each memory is encrypted and sealed onchain. Only you hold the key. No company can read it, sell it, or lose it.",
                icon: (
                  <div className="mb-4">
                    <WaxSeal size="sm" />
                  </div>
                ),
                seal: true,
              },
            ].map((item, index) => (
              <FadeUp key={item.step} className={index > 0 ? `delay-[${index * 80}ms]` : undefined}>
                <Card className={cn("h-full p-6", item.seal && "border border-brass/30")}>
                  <p className="text-caption mb-3">{item.step}</p>
                  {item.icon}
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm text-ink-soft">{item.body}</p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <FadeUp>
            <Eyebrow>Why own your memories</Eyebrow>
          </FadeUp>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <FadeUp>
              <Card className="h-full p-6 md:p-8">
                <p className="text-caption mb-3 uppercase">The problem</p>
                <p className="text-ink">
                  Your most personal moments live in apps that can delete them, sell them, or
                  vanish when the company does.
                </p>
              </Card>
            </FadeUp>
            <FadeUp>
              <Card className="h-full border border-brass/25 p-6 md:p-8">
                <p className="text-caption mb-3 uppercase">The solution</p>
                <p className="text-ink">
                  Keepsake gives you memory you actually own — encrypted, portable, and provably
                  yours.
                </p>
              </Card>
            </FadeUp>
          </div>
        </Container>
      </section>

      <section className="border-t border-ink/[0.08] py-16 md:py-20">
        <Container>
          <FadeUp>
            <Eyebrow>Features</Eyebrow>
          </FadeUp>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Capture",
                body: "Write or speak your moments. Keepsake remembers the details so you don't have to.",
              },
              {
                title: "Recall",
                body: "Ask a question; your memories answer as a story, not a search result.",
              },
              {
                title: "Own",
                body: "Every memory is sealed onchain with a key only you hold.",
              },
            ].map((feature) => (
              <FadeUp key={feature.title}>
                <Card hover className="h-full p-6">
                  <h3 className="font-display text-xl">{feature.title}</h3>
                  <p className="mt-3 text-sm text-ink-soft">{feature.body}</p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-ink/[0.08] bg-paper-2/40 py-10">
        <Container>
          <FadeUp className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Eyebrow>Built to be private</Eyebrow>
              <p className="mt-3 max-w-[52ch] text-ink">
                Encrypted before it leaves your device · Only you hold the key · No company can
                read it · Provably unaltered
              </p>
            </div>
            <Link href="/privacy" className={ghostLinkClass}>
              Privacy →
            </Link>
          </FadeUp>
        </Container>
      </section>

      <section id="plans" className="py-16 md:py-20">
        <Container>
          <FadeUp>
            <Eyebrow>Plans</Eyebrow>
          </FadeUp>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <FadeUp>
              <Card className="h-full p-6 md:p-8">
                <h3 className="font-display text-2xl">Free</h3>
                <p className="mt-3 text-ink-soft">
                  A handful of memories. Full recall. Real ownership.
                </p>
              </Card>
            </FadeUp>
            <FadeUp>
              <Card className="h-full border border-brass/30 p-6 md:p-8">
                <h3 className="font-display text-2xl">
                  Keepsake+ <span className="text-lg text-ink-soft">[PRICE]/mo</span>
                </h3>
                <p className="mt-3 text-ink-soft">
                  Unlimited memories, photos, deeper reflections, and family sharing.
                </p>
              </Card>
            </FadeUp>
          </div>
          <FadeUp>
            <p className="text-caption mt-6">You own your memories on every plan.</p>
          </FadeUp>
        </Container>
      </section>

      <section className="border-t border-ink/[0.08] py-16 md:py-20">
        <Container className="max-w-3xl">
          <FadeUp>
            <Eyebrow>FAQ</Eyebrow>
          </FadeUp>
          <FadeUp className="mt-8">
            <FaqAccordion />
          </FadeUp>
        </Container>
      </section>

      <section className="border-t border-ink/[0.08] py-16 md:pb-24">
        <Container className="text-center">
          <FadeUp>
            <h2 className="text-h2 mx-auto max-w-[18ch]">
              Start the memory only you will ever own.
            </h2>
            <div className="mt-8 flex justify-center">
              <Link href="/app" className={primaryLinkClass}>
                Open your vault
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
