import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { Select } from "../../components/Select";
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

const statusPresentation: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  WAITING_PAYMENT: {
    label: "Aguardando pagamento",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  PAID: {
    label: "Pago",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  SHIPPED: {
    label: "Enviado",
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  DELIVERED: {
    label: "Entregue",
    className: "border-teal-200 bg-teal-50 text-teal-700",
  },
  CANCELED: {
    label: "Cancelado",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

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
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: OrderStatus;
    }) => updateOrderStatus(id, status),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      alert("Status do pedido atualizado com sucesso.");
    },

    onError: () => {
      alert("Não foi possível atualizar o status do pedido.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-cards"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["store-products"],
        }),
      ]);

      alert("Pedido excluído com sucesso.");
    },

    onError: () => {
      alert("Não foi possível excluir o pedido.");
    },
  });

  const data = query.data as
    | Order[]
    | PageResponse<Order>
    | undefined;

  const orders = Array.isArray(data)
    ? data
    : data?.content ?? [];

  const actionPending =
    updateStatusMutation.isPending ||
    deleteMutation.isPending;

  function handleDeleteOrder(id: number) {
    if (actionPending) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir o pedido #${id}? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(id);
  }

  function handleStatusChange(
    order: Order,
    status: OrderStatus,
  ) {
    if (actionPending || status === order.status) {
      return;
    }

    updateStatusMutation.mutate({
      id: order.id,
      status,
    });
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#00102D]">
          Pedidos
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Gerencie os pedidos e acompanhe os detalhes das compras.
        </p>
      </div>

      <Panel className="overflow-hidden">
        {query.isLoading ? (
          <div className="p-6 text-sm text-slate-500">
            Carregando pedidos...
          </div>
        ) : query.isError ? (
          <div className="space-y-4 p-6">
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              Não foi possível carregar os pedidos.
            </p>

            <Button
              type="button"
              variant="secondary"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold text-[#00102D]">
              Nenhum pedido encontrado
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Os pedidos da loja serão exibidos aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-4">
                    Pedido
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Cliente
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Data
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Alterar
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Detalhes
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const presentation =
                    statusPresentation[order.status];

                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === order.id;

                  const isUpdating =
                    updateStatusMutation.isPending &&
                    updateStatusMutation.variables?.id === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-sky-50/50"
                    >
                      <td className="px-4 py-4 font-bold text-[#00102D]">
                        #{order.id}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {order.client.name}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(order.moment)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${presentation.className}`}
                        >
                          {presentation.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-bold text-[#00102D]">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-4 py-4">
                        <Select
                          id={`order-status-${order.id}`}
                          label="Status"
                          className="w-56"
                          value={order.status}
                          disabled={actionPending}
                          onChange={(event) =>
                            handleStatusChange(
                              order,
                              event.target.value as OrderStatus,
                            )
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {statusPresentation[status].label}
                            </option>
                          ))}
                        </Select>

                        {isUpdating ? (
                          <p
                            role="status"
                            className="mt-2 text-xs text-sky-700"
                          >
                            Atualizando status...
                          </p>
                        ) : null}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          to={`/pedidos/${order.id}`}
                          className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                        >
                          Ver detalhes
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <Button
                          type="button"
                          variant="danger"
                          icon={<Trash2 size={15} />}
                          disabled={actionPending}
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </section>
  );
}