import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/className";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-md border border-line bg-ink/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-500",
          "focus:border-skybrand focus:ring-2 focus:ring-skybrand/30",
          error && "border-red-400 focus:border-red-300 focus:ring-red-400/30",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
