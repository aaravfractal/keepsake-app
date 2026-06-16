import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export default function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-caption font-mono uppercase tracking-[0.18em] text-ink-soft",
        className,
      )}
    >
      {children}
    </p>
  );
}
