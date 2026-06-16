import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui";

interface PageShellProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <main className="py-12 md:py-16">
      <Container className="max-w-3xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="text-h2 mt-3 md:text-[2.25rem]">{title}</h1>
        {intro ? <p className="mt-6 text-lg text-ink-soft">{intro}</p> : null}
        <div className="mt-10 space-y-10">{children}</div>
      </Container>
    </main>
  );
}

interface PageSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export function PageSection({ id, title, children }: PageSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-xl text-ink md:text-2xl">{title}</h2>
      <div className="mt-3 text-ink-soft">{children}</div>
    </section>
  );
}

export function PlaceholderBlock({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-dashed border-ink/20 bg-paper-2/50 px-5 py-4">
      <p className="text-caption uppercase">{label}</p>
      <p className="mt-2 text-sm text-ink-soft">
        Placeholder for content to be added later.
      </p>
    </div>
  );
}
