import { cn } from "@/lib/cn";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({
  className,
  error,
  disabled,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <input
        disabled={disabled}
        className={cn(
          "ds-focus-ring w-full rounded-[var(--radius-sm)] border bg-paper px-4 py-2.5 text-ink placeholder:text-ink-soft/70 transition-colors duration-200",
          error ? "border-wax" : "border-ink/12 focus:border-wax",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1.5 text-sm text-wax">{error}</p> : null}
    </div>
  );
}
