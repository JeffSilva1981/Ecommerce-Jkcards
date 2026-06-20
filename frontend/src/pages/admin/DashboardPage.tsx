import { DollarSign, Package, ReceiptText, TrendingUp } from "lucide-react";
import { Panel } from "../../components/Panel";
import { StatCard } from "../../components/StatCard";
import { formatCurrency } from "../../utils/currency";

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Indicadores gerais da loja.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pedidos" value="0" icon={<Package size={22} />} />
        <StatCard
          label="Receita bruta"
          value={formatCurrency(0)}
          icon={<DollarSign size={22} />}
        />
        <StatCard
          label="Receita liquida"
          value={formatCurrency(0)}
          icon={<TrendingUp size={22} />}
        />
        <StatCard
          label="Ticket medio"
          value={formatCurrency(0)}
          icon={<ReceiptText size={22} />}
        />
      </div>

      <Panel className="p-5">
        <h2 className="text-lg font-bold text-white">Pedidos por status</h2>

        <p className="mt-4 text-sm text-slate-400">
          O resumo do dashboard será exibido quando o endpoint do backend for implementado.
        </p>
      </Panel>
    </section>
  );
}