import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";
import { Panel } from "./Panel";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Panel className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="grid size-14 place-items-center rounded-2xl border border-line bg-white/5 text-skysoft">
        {icon ?? <PackageOpen size={26} />}
      </div>
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Panel>
  );
}
