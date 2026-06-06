import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/className";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const variants = {
  primary:
    "bg-brand-gradient text-ink shadow-glow hover:shadow-glow hover:brightness-110 active:brightness-95",
  secondary:
    "border border-line bg-white/5 text-white backdrop-blur hover:border-skybrand/60 hover:bg-white/10",
  ghost: "text-slate-200 hover:bg-white/10",
  danger:
    "border border-red-400/40 bg-red-400/10 text-red-200 hover:bg-red-400/20",
};

export function Button({
  className,
  children,
  variant = "primary",
  icon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-skybrand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
