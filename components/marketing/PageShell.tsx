import type { ReactNode } from "react";
import Link from "next/link";
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
    <main className="py-14 md:py-20">
      <Container>
        <div className="mx-auto w-full max-w-[42.5rem] text-left">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="text-h2 mt-4 font-display md:text-[2.25rem]">{title}</h1>
          {intro ? (
            <p className="mt-6 text-[1.0625rem] leading-[1.7] text-ink-soft">{intro}</p>
          ) : null}
          <div className="mt-12 space-y-12 text-[1.0625rem] leading-[1.7]">{children}</div>
          <div className="mt-12 border-t border-ink/[0.08] pt-8">
            <BackHomeLink />
          </div>
        </div>
      </Container>
    </main>
  );
}

export function BackHomeLink() {
  return (
    <Link
      href="/"
      className="ds-focus-ring inline-flex items-center text-sm text-ink-soft transition-colors hover:text-wax"
    >
      ← Back home
    </Link>
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
      <div className="mt-4 text-ink-soft">{children}</div>
    </section>
  );
}
