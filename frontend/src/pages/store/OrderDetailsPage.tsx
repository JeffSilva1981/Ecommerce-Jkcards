import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/ordersApi";
import { EmptyState } from "../../components/EmptyState";
import { Panel } from "../../components/Panel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

export function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Number.isFinite(orderId),
  });

  if (query.isLoading) {
    return <div className="h-72 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!query.data) {
    return <EmptyState title="Pedido nao encontrado" description="Confira o numero do pedido." />;
  }

  const order = query.data;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pedido #{order.id}</h1>
          <p className="mt-1 text-sm text-slate-400">{formatDate(order.moment)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <Panel className="p-5">
        <h2 className="text-lg font-bold text-white">Itens</h2>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0">
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-400">
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-bold text-gold">
                {formatCurrency(item.subTotal ?? item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between text-xl font-bold text-white">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </Panel>
      <Panel className="p-5">
        <h2 className="text-lg font-bold text-white">Cliente</h2>
        <p className="mt-2 text-slate-300">{order.client.name}</p>
      </Panel>
    </section>
  );
}

