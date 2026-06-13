import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/ordersApi";
import { EmptyState } from "../../components/EmptyState";
import { Panel } from "../../components/Panel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

export function MyOrdersPage() {
  const query = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });


  if (query.isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!query.data?.length) {
    return (
      <EmptyState
        title="Nenhum pedido ainda"
        description="Quando voce finalizar um carrinho, seus pedidos aparecem aqui."
      />
    );
  }

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold text-white">Meus pedidos</h1>
      <div className="space-y-3">
        {query.data.map((order) => (
          <Link key={order.id} to={`/pedidos/${order.id}`}>
            <Panel className="flex flex-col gap-3 p-4 transition hover:border-skybrand/60 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-white">Pedido #{order.id}</p>
                <p className="text-sm text-slate-400">{formatDate(order.moment)}</p>
              </div>
              <StatusBadge status={order.status} />
              <p className="font-bold text-gold">{formatCurrency(order.total)}</p>
            </Panel>
          </Link>
        ))}
      </div>
    </section>
  );
}

