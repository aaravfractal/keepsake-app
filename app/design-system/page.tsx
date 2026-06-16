"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Eyebrow,
  Input,
  Textarea,
} from "@/components/ui";

export default function DesignSystemPage() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="py-16">
      <Container className="space-y-12">
        <header>
          <Eyebrow>Keepsake design system</Eyebrow>
          <h1 className="text-hero mt-3">Prompt 0 foundation</h1>
          <p className="mt-4 max-w-[42ch] text-ink-soft">
            Tokens and primitives for the ui-redesign branch. App logic is
            unchanged.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-h2">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                window.setTimeout(() => setLoading(false), 1400);
              }}
            >
              {loading ? "Saving…" : "Loading demo"}
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-h2">Inputs</h2>
          <div className="grid max-w-md gap-4">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled" disabled />
            <Input placeholder="Error state" error="That didn't save." />
            <Textarea placeholder="Journal textarea" rows={4} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-h2">Card</h2>
          <Card hover className="max-w-sm p-6">
            <p className="font-display text-lg">Hover lift card</p>
            <p className="mt-2 text-sm text-ink-soft">
              Paper-2 surface with shadow-sm → shadow-lg on hover.
            </p>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-h2">Type scale</h2>
          <p className="text-hero">Hero Fraunces</p>
          <p className="text-h2">Heading two</p>
          <p>Body Inter at 1.0625rem / 1.7</p>
          <p className="text-caption">CAPTION JETBRAINS MONO</p>
        </section>
      </Container>
    </main>
  );
}
