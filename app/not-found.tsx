import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-20 md:py-28">
      <Container className="max-w-lg text-center">
        <p className="text-caption uppercase">404</p>
        <h1 className="text-h2 mt-4">This page was never sealed.</h1>
        <p className="mt-4 text-ink-soft">
          Whatever you were looking for isn&apos;t here — but your vault still is.
        </p>
        <Link
          href="/"
          className="ds-focus-ring mt-8 inline-flex items-center text-sm font-medium text-wax underline decoration-wax/30 underline-offset-4 transition-colors hover:decoration-wax"
        >
          Back home →
        </Link>
      </Container>
    </main>
  );
}
