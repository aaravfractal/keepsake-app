"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

const faqItems = [
  {
    question: "Is it really private?",
    answer:
      "Yes. Memories are encrypted on your device before they're stored, and reflection happens inside a trusted enclave. The plaintext is never exposed.",
  },
  {
    question: "Do I actually own my memories?",
    answer:
      "Yes. Each memory is stored as an asset tied to your identity, with a key only you control — not a record in a company's database.",
  },
  {
    question: "What is 0G?",
    answer:
      "The decentralized AI network Keepsake runs on. It's what lets your memories be owned by you instead of by us.",
  },
  {
    question: "Can I export or delete my memories?",
    answer: "Yes — they're yours to take or remove.",
  },
  {
    question: "Is my data used to train AI?",
    answer: "No. Never.",
  },
] as const;

export default function FaqAccordion() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 rounded-[var(--radius)] border border-ink/10 bg-paper-2/60">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="ds-focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg text-ink"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span
                  className={cn(
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center text-ink-soft transition-transform duration-200 motion-reduce:transition-none",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4 text-ink-soft"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
