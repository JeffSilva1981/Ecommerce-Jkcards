import type { SelectHTMLAttributes } from "react";
import { cn } from "../utils/className";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  variant?: "dark" | "light";
};

const variants = {
  dark: {
    label: "text-slate-200",
    select:
      "border-line bg-ink/80 text-white focus:border-skybrand focus:ring-skybrand/30",
    error: "text-red-300",
    errorSelect:
      "border-red-400 focus:border-red-300 focus:ring-red-400/30",
  },

  light: {
    label: "text-slate-700",
    select:
      "border-slate-300 bg-white text-slate-900 focus:border-sky-400 focus:ring-sky-100",
    error: "text-red-600",
    errorSelect:
      "border-red-400 focus:border-red-400 focus:ring-red-100",
  },
};

export function Select({
  label,
  error,
  variant = "light",
  className,
  id,
  children,
  ...props
}: SelectProps) {
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

      <select
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
          styles.select,
          error && styles.errorSelect,
          className,
        )}
        {...props}
      >
        {children}
      </select>

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