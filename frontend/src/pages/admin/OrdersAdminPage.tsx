import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../../api/ordersApi";
import { Panel } from "../../components/Panel";
import { Select } from "../../components/Select";
import { StatusBadge } from "../../components/StatusBadge";
import type { Order, OrderStatus } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

const statuses: OrderStatus[] = [
  "WAITING_PAYMENT",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

type PageResponse<T> = {
  content: T[];
};

export function OrdersAdminPage() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      alert("Status do pedido atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: () => {
      alert("Nao foi possivel atualizar o status do pedido.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      alert("Pedido excluido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: () => {
      alert("Nao foi possivel excluir o pedido.");
    },
  });

  const data = query.data as Order[] | PageResponse<Order> | undefined;

  const orders = Array.isArray(data)
    ? data
    : data?.content ?? [];

  function handleDeleteOrder(id: number) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o pedido #${id}? Essa acao nao pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(id);
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">Pedidos</h1>
        <p className="mt-2 text-sm text-slate-400">
          Gerencie os pedidos e acompanhe os detalhes das compras.
        </p>
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-line bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Alterar</th>
                <th className="px-4 py-3">Detalhes</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    #{order.id}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {order.client.name}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {formatDate(order.moment)}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-4 py-3 font-bold text-gold">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="px-4 py-3">
                    <Select
                      label="Status"
                      className="w-56"
                      value={order.status}
                      disabled={updateStatusMutation.isPending}
                      onChange={(event) =>
                        updateStatusMutation.mutate({
                          id: order.id,
                          status: event.target.value as OrderStatus,
                        })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/pedidos/${order.id}`}
                      className="rounded-md bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
                    >
                      Ver Detalhes
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDeleteOrder(order.id)}
                      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={14} />
                      {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}