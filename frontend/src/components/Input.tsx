import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/className";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  variant?: "dark" | "light";
};

const variants = {
  dark: {
    label: "text-slate-200",
    input:
      "border-line bg-ink/70 text-white placeholder:text-slate-500 focus:border-skybrand focus:ring-skybrand/30",
    error: "text-red-300",
    errorInput:
      "border-red-400 focus:border-red-300 focus:ring-red-400/30",
  },

  light: {
    label: "text-slate-700",
    input:
      "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-100",
    error: "text-red-600",
    errorInput:
      "border-red-400 focus:border-red-400 focus:ring-red-100",
  },
};

export function Input({
  label,
  error,
  variant = "dark",
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? label;
  const styles = variants[variant];

  return (
    <label
      htmlFor={inputId}
      className="block"
    >
      <span
        className={cn(
          "mb-2 block text-sm font-semibold",
          styles.label,
        )}
      >
        {label}
      </span>

      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4",
          styles.input,
          error && styles.errorInput,
          className,
        )}
        {...props}
      />

      {error ? (
        <span
          className={cn(
            "mt-1.5 block text-xs font-medium",
            styles.error,
          )}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}