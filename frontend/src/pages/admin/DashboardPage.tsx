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

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Indicadores mockados ate o backend expor `/admin/dashboard`.
        </p>
      </div>

      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Pedidos" value={String(data.ordersCount)} icon={<Package size={22} />} />
            <StatCard label="Receita bruta" value={formatCurrency(data.grossRevenue)} icon={<DollarSign size={22} />} />
            <StatCard label="Receita liquida" value={formatCurrency(data.netRevenue)} icon={<TrendingUp size={22} />} />
            <StatCard label="Ticket medio" value={formatCurrency(data.averageTicket)} icon={<ReceiptText size={22} />} />
          </div>
          <Panel className="p-5">
            <h2 className="text-lg font-bold text-white">Pedidos por status</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {data.byStatus.map((item) => (
                <div key={item.status} className="rounded-md border border-line bg-white/5 p-4">
                  <StatusBadge status={item.status} />
                  <p className="mt-3 text-2xl font-bold text-white">{item.count}</p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : (
        <div className="h-80 animate-pulse rounded-lg bg-white/5" />
      )}
    </section>
  );
}

