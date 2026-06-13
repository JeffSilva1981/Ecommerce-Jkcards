import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminOrders, updateOrderStatus } from "../../api/ordersApi";
import { Panel } from "../../components/Panel";
import { Select } from "../../components/Select";
import { StatusBadge } from "../../components/StatusBadge";
import type { OrderStatus } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

const statuses: OrderStatus[] = [
  "WAITING_PAYMENT",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
];

export function OrdersAdminPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">Pedidos</h1>
        <p className="mt-2 text-sm text-slate-400">
          Atualizacao manual de status preparada para `PUT /orders/:id/status`.
        </p>
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Alterar</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.content?.map((order) => (
                <tr key={order.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-white">#{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.client.name}</td>
                  <td className="px-4 py-3 text-slate-300">{formatDate(order.moment)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 font-bold text-gold">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3">
                    <Select
                      label="Status"
                      className="w-56"
                      value={order.status}
                      onChange={(event) =>
                        mutation.mutate({
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

