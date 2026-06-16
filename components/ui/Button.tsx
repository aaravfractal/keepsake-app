import { cn } from "@/lib/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        "ds-focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-medium transition-all duration-200 motion-reduce:transition-none",
        variant === "primary" &&
          "bg-wax text-white shadow-[var(--shadow-sm)] hover:-translate-y-px hover:brightness-[0.94] active:translate-y-0 active:brightness-[0.88]",
        variant === "ghost" &&
          "border border-ink/20 bg-transparent text-ink hover:bg-paper-2 active:bg-paper-2/80",
        isDisabled && "cursor-not-allowed opacity-50 hover:translate-y-0 hover:brightness-100",
        className,
      )}
      {...props}
    >
      {loading ? <span className="ds-spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
