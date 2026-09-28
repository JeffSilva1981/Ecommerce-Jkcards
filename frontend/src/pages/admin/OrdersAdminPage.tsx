import { useEffect, useState, type FormEvent } from "react";
import { Input } from "../../components/Input";
import { Pagination } from "../../components/Pagination";
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



export function OrdersAdminPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const emptyFilters = { search: "", status: "" as OrderStatus | "", from: "", until: "" };
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const invalidDates = Boolean(draft.from && draft.until && draft.from > draft.until);
  function applyFilters(event: FormEvent) {
    event.preventDefault();
    if (invalidDates) return;
    setFilters({ ...draft });
    setPage(0);
  }
  function dateBoundary(value: string, nextDay = false) {
    if (!value) return undefined;
    const date = new Date(value + "T00:00:00");
    if (nextDay) date.setDate(date.getDate() + 1);
    return date.toISOString();
  }

  const query = useQuery({
    queryKey: ["admin-orders", page, size, filters],
    queryFn: () => getAdminOrders({ page, size, search: filters.search,
      status: filters.status, from: dateBoundary(filters.from), until: dateBoundary(filters.until, true) }),
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

  const orders = query.data?.content ?? [];
  const totalPages = query.data?.totalPages ?? 0;
  const totalElements = query.data?.totalElements ?? 0;
  useEffect(() => {
    if (query.data && page > 0 && page >= totalPages) setPage(Math.max(0, totalPages - 1));
  }, [query.data, page, totalPages]);

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
    <section className="min-w-0 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#00102D]">Pedidos</h1>
        <p className="mt-2 text-sm text-slate-500">Consulte as compras, confira os itens e gerencie os pedidos.</p>
      </div>
      <Panel className="p-4 sm:p-6">
        <form onSubmit={applyFilters} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Input label="Cliente ou número do pedido" value={draft.search} placeholder="Nome ou #123"
              onChange={e => setDraft({ ...draft, search: e.target.value })} />
            <Select label="Status do pedido" value={draft.status}
              onChange={e => setDraft({ ...draft, status: e.target.value as OrderStatus | "" })}>
              <option value="">Todos os status</option>
              {statuses.map(status => <option key={status} value={status}>{statusPresentation[status].label}</option>)}
            </Select>
            <Input label="Data inicial" type="date" value={draft.from} max={draft.until || undefined}
              onChange={e => setDraft({ ...draft, from: e.target.value })} />
            <Input label="Data final" type="date" value={draft.until} min={draft.from || undefined}
              onChange={e => setDraft({ ...draft, until: e.target.value })} />
          </div>
          {invalidDates && <p role="alert" className="text-sm text-red-700">A data final deve ser igual ou posterior à inicial.</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={invalidDates}>Aplicar filtros</Button>
            <Button type="button" variant="secondary" onClick={() => { setDraft(emptyFilters); setFilters(emptyFilters); setPage(0); }}>Limpar filtros</Button>
          </div>
        </form>
      </Panel>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p role="status" className="text-sm text-slate-600">
          {query.isLoading ? "Carregando pedidos..." : query.isError ? "Consulta indisponível" : totalElements === 0 ? "Nenhum pedido encontrado" :
            `Mostrando ${page * size + 1}–${Math.min((page + 1) * size, totalElements)} de ${totalElements} pedidos`}
        </p>
        <Select label="Pedidos por página" value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}>
          {[10, 20, 50].map(value => <option key={value} value={value}>{value}</option>)}
        </Select>
      </div>
      {query.isError ? <Panel className="space-y-4 p-6">
        <p role="alert" className="text-red-700">Não foi possível carregar os pedidos.</p>
        <Button variant="secondary" onClick={() => void query.refetch()}>Tentar novamente</Button>
      </Panel> : query.isLoading ? <Panel className="p-6">Carregando pedidos...</Panel> : orders.length === 0 ?
        <Panel className="p-8 text-center">Nenhum pedido corresponde aos filtros selecionados.</Panel> :
        <div className="space-y-4">
          {orders.map(order => {
            const presentation = statusPresentation[order.status];
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === order.id;
            const isUpdating = updateStatusMutation.isPending && updateStatusMutation.variables?.id === order.id;
            return <Panel key={order.id} className="min-w-0 p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#00102D]">Pedido #{order.id}</h2>
                  <p className="mt-1 break-words font-medium">{order.client.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(order.moment)}</p>
                </div>
                <div className="space-y-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${presentation.className}`}>{presentation.label}</span>
                  <p className="text-lg font-bold text-[#00102D]">{formatCurrency(order.total)}</p>
                </div>
              </div>
              <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-sky-800">Itens e entrega ({order.items.reduce((sum, item) => sum + item.quantity, 0)} unidades)</summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {order.items.map(item => <li key={item.productId} className="flex flex-wrap justify-between gap-2">
                    <span className="min-w-0 break-words">{item.quantity} × {item.name}</span>
                    <span className="font-semibold">{formatCurrency(item.subTotal ?? item.price * item.quantity)}</span>
                  </li>)}
                </ul>
                <p className="mt-3 border-t border-slate-200 pt-3 text-sm">{order.shipping?.method === "PICKUP" ? "Retirada na loja" : order.shipping?.serviceName || "Entrega não informada"}
                  {order.shipping && <> · Frete: {formatCurrency(order.shipping.price)}</>}</p>
                {order.shippingAddress && <p className="mt-2 break-words text-sm">{order.shippingAddress.recipientName} · {order.shippingAddress.street}, {order.shippingAddress.number} {order.shippingAddress.complement} · {order.shippingAddress.neighborhood} · {order.shippingAddress.city}/{order.shippingAddress.state} · CEP {order.shippingAddress.postalCode}</p>}
              </details>
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-end">
                <div className="w-full sm:w-56">
                  <Select label="Alterar status" id={`order-status-${order.id}`} value={order.status} disabled={actionPending}
                    onChange={e => handleStatusChange(order, e.target.value as OrderStatus)}>
                    {statuses.map(status => <option key={status} value={status}>{statusPresentation[status].label}</option>)}
                  </Select>
                </div>
                <Link to={`/pedidos/${order.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-sky-700 hover:bg-sky-50">Ver detalhes completos</Link>
                <Button type="button" variant="danger" icon={<Trash2 size={15} />} disabled={actionPending} onClick={() => handleDeleteOrder(order.id)}>
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
                {isUpdating && <p role="status" className="text-sm text-sky-700">Atualizando status...</p>}
              </div>
            </Panel>;
          })}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>}
    </section>
  );
}
