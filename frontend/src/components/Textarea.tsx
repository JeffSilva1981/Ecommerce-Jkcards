import type { TextareaHTMLAttributes } from "react";
import { cn } from "../utils/className";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name ?? label;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <textarea
        id={inputId}
        className={cn(
          "min-h-28 w-full resize-y rounded-md border border-line bg-ink/80 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-skybrand",
          error && "border-red-400 focus:border-red-300",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

