import { cn } from "@/lib/cn";
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export default function Textarea({
  className,
  error,
  disabled,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
        disabled={disabled}
        className={cn(
          "ds-focus-ring w-full resize-y rounded-[var(--radius-sm)] border bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/70 transition-colors duration-200",
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
