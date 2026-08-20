import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/ordersApi";
import { StatusBadge } from "../../components/StatusBadge";
import type { Order } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

export function MyOrdersPage() {
  const query = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const orders = (query.data ?? []) as Order[];

  if (query.isLoading) {
    return (
      <section className="space-y-5">
        <PageHeader />

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  if (query.isError) {
    return (
      <section className="space-y-5">
        <PageHeader />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            Não foi possível carregar seus pedidos.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Tente atualizar a página dentro de alguns instantes.
          </p>
        </div>
      </section>
    );
  }

  if (!orders.length) {
    return (
      <section className="space-y-5">
        <PageHeader />

        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-cyan-50 text-cyan-600">
            <ShoppingBag size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#00102D]">
            Nenhum pedido ainda
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Quando você finalizar uma compra, os pedidos aparecerão
            aqui para que possa acompanhar todos os detalhes.
          </p>

          <Link
            to="/produtos"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white transition hover:bg-cyan-600"
          >
            Conhecer produtos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <PageHeader />

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/pedidos/${order.id}`}
            className="group block"
          >
            <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md md:flex-row md:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Package size={23} />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[#00102D]">
                    Pedido #{order.id}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <CalendarDays size={15} />
                    {formatDate(order.moment)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 md:border-0 md:pt-0">
                <StatusBadge status={order.status} />

                <p className="min-w-28 text-right text-lg font-black text-[#00102D]">
                  {formatCurrency(order.total)}
                </p>

                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-cyan-500 group-hover:text-white">
                  <ChevronRight size={19} />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PageHeader() {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wider text-cyan-600">
        Minha conta
      </p>

      <h1 className="mt-1 text-3xl font-black text-[#00102D]">
        Meus pedidos
      </h1>

      <p className="mt-2 text-slate-500">
        Consulte suas compras e acompanhe o andamento de cada pedido.
      </p>
    </div>
  );
}