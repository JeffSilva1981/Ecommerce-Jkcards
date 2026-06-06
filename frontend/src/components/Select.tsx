import type { SelectHTMLAttributes } from "react";
import { cn } from "../utils/className";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <select
        id={inputId}
        className={cn(
          "h-11 w-full rounded-md border border-line bg-ink/80 px-3 text-sm text-white outline-none transition focus:border-skybrand",
          error && "border-red-400 focus:border-red-300",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

