import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
}

export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[var(--maxw)] px-[var(--gutter)]", className)}
    >
      {children}
    </Tag>
  );
}
