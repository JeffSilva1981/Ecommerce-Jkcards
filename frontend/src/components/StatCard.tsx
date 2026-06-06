import type { ReactNode } from "react";
import { Panel } from "./Panel";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Panel className="relative overflow-hidden p-5 transition hover:border-skybrand/40">
      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-skybrand/10 blur-2xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-white">{value}</p>
        </div>
        <div className="grid size-12 place-items-center rounded-xl border border-skybrand/30 bg-skybrand/10 text-skysoft shadow-glow-soft">
          {icon}
        </div>
      </div>
    </Panel>
  );
}
