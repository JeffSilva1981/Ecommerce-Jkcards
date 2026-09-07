import type { TextareaHTMLAttributes } from "react";
import { cn } from "../utils/className";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
    variant?: "dark" | "light";
  };

const variants = {
  dark: {
    label: "text-slate-200",
    textarea:
      "border-line bg-ink/80 text-white placeholder:text-slate-500 focus:border-skybrand focus:ring-skybrand/30",
    error: "text-red-300",
    errorTextarea:
      "border-red-400 focus:border-red-300 focus:ring-red-400/30",
  },

  light: {
    label: "text-slate-700",
    textarea:
      "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-100",
    error: "text-red-600",
    errorTextarea:
      "border-red-400 focus:border-red-400 focus:ring-red-100",
  },
};

export function Textarea({
  label,
  error,
  variant = "light",
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name ?? label;
  const styles = variants[variant];

  return (
    <label className="block" htmlFor={inputId}>
      <span
        className={cn(
          "mb-2 block text-sm font-semibold",
          styles.label,
        )}
      >
        {label}
      </span>

      <textarea
        id={inputId}
        className={cn(
          "min-h-28 w-full resize-y rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
          styles.textarea,
          error && styles.errorTextarea,
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