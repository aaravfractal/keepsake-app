import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] bg-paper-2 shadow-[var(--shadow-sm)]",
        hover &&
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
