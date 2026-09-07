import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/className";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const variants = {
  primary:
    "border border-transparent bg-sky-500 text-white shadow-sm hover:bg-sky-600 active:bg-sky-700",

  secondary:
    "border border-slate-200 bg-white text-sky-700 shadow-sm hover:border-sky-300 hover:bg-sky-50 active:bg-sky-100",

  ghost:
    "border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",

  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 active:bg-red-200",
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
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition duration-150",
        "focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
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