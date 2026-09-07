import type { HTMLAttributes } from "react";
import { cn } from "../utils/className";

export function Panel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}