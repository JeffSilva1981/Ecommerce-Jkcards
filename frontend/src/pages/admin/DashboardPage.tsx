import { useQuery } from "@tanstack/react-query";
import { DollarSign, Package, ReceiptText, TrendingUp } from "lucide-react";
import { getDashboardSummary } from "../../api/dashboardApi";
import { Panel } from "../../components/Panel";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";

export function DashboardPage() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });

  const data = query.data;

  const byStatus = data?.byStatus ?? [];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Indicadores gerais da loja.
        </p>
      </div>

      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Pedidos" value={String(data.ordersCount ?? 0)} icon={<Package size={22} />} />
            <StatCard label="Receita bruta" value={formatCurrency(data.grossRevenue ?? 0)} icon={<DollarSign size={22} />} />
            <StatCard label="Receita liquida" value={formatCurrency(data.netRevenue ?? 0)} icon={<TrendingUp size={22} />} />
            <StatCard label="Ticket medio" value={formatCurrency(data.averageTicket ?? 0)} icon={<ReceiptText size={22} />} />
          </div>

          <Panel className="p-5">
            <h2 className="text-lg font-bold text-white">Pedidos por status</h2>

            {byStatus.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {byStatus.map((item) => (
                  <div key={item.status} className="rounded-md border border-line bg-white/5 p-4">
                    <StatusBadge status={item.status} />
                    <p className="mt-3 text-2xl font-bold text-white">{item.count}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Ainda não existem pedidos por status para exibir.
              </p>
            )}
          </Panel>
        </>
      ) : (
        <div className="h-80 animate-pulse rounded-lg bg-white/5" />
      )}
    </section>
  );
}