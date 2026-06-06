import type { HTMLAttributes } from "react";
import { cn } from "../utils/className";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line/80 bg-panel-gradient shadow-glow-soft shadow-inset backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
