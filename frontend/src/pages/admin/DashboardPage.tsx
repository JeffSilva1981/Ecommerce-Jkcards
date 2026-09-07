import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  CircleOff,
  Clock,
  DollarSign,
  Layers,
  Link2,
  Package,
  ReceiptText,
  RefreshCw,
  TrendingUp,
  Truck,
  Warehouse,
} from "lucide-react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { getDashboardSummary } from "../../api/dashboardApi";
import {
  getMelhorEnvioAuthorizationStatus,
  getMelhorEnvioAuthorizationUrl,
} from "../../api/shippingApi";
import { formatCurrency } from "../../utils/currency";

const numberFormatter = new Intl.NumberFormat("pt-BR");

const statusPresentation: Record<
  string,
  { label: string; className: string }
> = {
  WAITING_PAYMENT: {
    label: "Aguardando pagamento",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  PAID: {
    label: "Pago",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  SHIPPED: {
    label: "Enviado",
    className: "border-sky-200 bg-sky-50 text-sky-800",
  },
  DELIVERED: {
    label: "Entregue",
    className: "border-teal-200 bg-teal-50 text-teal-800",
  },
  CANCELED: {
    label: "Cancelado",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl " +
  "bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition " +
  "hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl " +
  "border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold " +
  "text-sky-700 transition hover:bg-sky-50 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

function DashboardCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
          {icon}
        </div>
      </div>

      <p className="mt-4 break-words text-2xl font-black tracking-tight text-[#00102D]">
        {value}
      </p>
    </div>
  );
}

export function DashboardPage() {
  const [searchParams] = useSearchParams();

  const authorizationCompleted =
    searchParams.get("melhorEnvio") === "authorized";

  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });

  const shippingAuthorizationQuery = useQuery({
    queryKey: ["melhor-envio-authorization"],
    queryFn: getMelhorEnvioAuthorizationStatus,
  });

  const connectMutation = useMutation({
    mutationFn: getMelhorEnvioAuthorizationUrl,
    onSuccess: (authorizationUrl) => {
      window.location.assign(authorizationUrl);
    },
  });

  const data = query.data;
  const byStatus = data?.byStatus ?? [];
  const inventoryByCategory = data?.inventoryByCategory;

  const melhorEnvioAuthorized =
    shippingAuthorizationQuery.data?.authorized === true;

  const refreshing =
    query.isFetching || shippingAuthorizationQuery.isFetching;

  function handleRefresh() {
    void query.refetch();
    void shippingAuthorizationQuery.refetch();
  }

  return (
    <section
      className="-mx-4 -my-6 min-h-screen bg-[#f4f7fb] px-4 py-8 text-slate-700 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      style={{ colorScheme: "light" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Visão geral da loja
            </span>
            <h1 className="mt-2 text-3xl font-black text-[#00102D] sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Acompanhe pedidos, receitas e valores em estoque.
            </p>
          </div>

          <button
            type="button"
            className={secondaryButton}
            disabled={refreshing}
            onClick={handleRefresh}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </button>
        </div>

        {authorizationCompleted && melhorEnvioAuthorized ? (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            A conta Melhor Envio foi conectada com sucesso.
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <Truck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#00102D]">
                  Integração Melhor Envio
                </h2>

                {shippingAuthorizationQuery.isLoading ? (
                  <p className="mt-2 text-sm text-slate-500">
                    Verificando autorização...
                  </p>
                ) : shippingAuthorizationQuery.isError ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-700">
                    <CircleOff size={17} className="shrink-0" />
                    Não foi possível consultar a integração.
                  </div>
                ) : melhorEnvioAuthorized ? (
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 size={17} />
                    Melhor Envio conectado
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-700">
                    <AlertTriangle size={17} className="shrink-0" />
                    A conta ainda não foi conectada.
                  </div>
                )}

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Autorize a conta para utilizar a integração de frete
                  da loja.
                </p>
              </div>
            </div>

            {shippingAuthorizationQuery.isError ? (
              <button
                type="button"
                className={secondaryButton}
                disabled={shippingAuthorizationQuery.isFetching}
                onClick={() => void shippingAuthorizationQuery.refetch()}
              >
                Tentar novamente
              </button>
            ) : shippingAuthorizationQuery.isSuccess &&
              !melhorEnvioAuthorized ? (
              <button
                type="button"
                className={primaryButton}
                disabled={
                  shippingAuthorizationQuery.isFetching ||
                  connectMutation.isPending
                }
                onClick={() => connectMutation.mutate()}
              >
                <Link2 size={17} />
                {connectMutation.isPending
                  ? "Abrindo autorização..."
                  : "Conectar Melhor Envio"}
              </button>
            ) : null}
          </div>

          {connectMutation.isError ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              Não foi possível iniciar a autorização da Melhor Envio.
              Tente novamente.
            </p>
          ) : null}
        </div>

        {query.isLoading ? (
          <div
            role="status"
            aria-label="Carregando indicadores"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="h-3 w-28 rounded bg-slate-100" />
                <div className="mt-6 h-8 w-36 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : query.isError ? (
          <div
            role="alert"
            className="space-y-4 rounded-2xl border border-red-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-red-700">
              Não foi possível carregar os indicadores do dashboard.
            </p>
            <button
              type="button"
              className={secondaryButton}
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              Tentar novamente
            </button>
          </div>
        ) : data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardCard
                label="Pedidos"
                value={numberFormatter.format(data.ordersCount)}
                icon={<Package size={21} />}
              />
              <DashboardCard
                label="Receita bruta"
                value={formatCurrency(data.grossRevenue)}
                icon={<DollarSign size={21} />}
              />
              <DashboardCard
                label="Receita líquida"
                value={formatCurrency(data.netRevenue)}
                icon={<TrendingUp size={21} />}
              />
              <DashboardCard
                label="Ticket médio"
                value={formatCurrency(data.averageTicket)}
                icon={<ReceiptText size={21} />}
              />
              <DashboardCard
                label="Valor em estoque"
                value={formatCurrency(data.inventoryValue)}
                icon={<Warehouse size={21} />}
              />
              <DashboardCard
                label="Produtos cadastrados"
                value={numberFormatter.format(data.productsCount)}
                icon={<Boxes size={21} />}
              />
              <DashboardCard
                label="Unidades em estoque"
                value={numberFormatter.format(data.stockUnits)}
                icon={<Package size={21} />}
              />
              <DashboardCard
                label="Produtos esgotados"
                value={numberFormatter.format(data.outOfStockProducts)}
                icon={<AlertTriangle size={21} />}
              />
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 p-5 sm:p-6">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <Layers size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#00102D]">
                    Estoque por categoria
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Valor calculado pelo preço de venda multiplicado
                    pela quantidade em estoque, incluindo produtos ocultos.
                  </p>
                </div>
              </div>

              {!Array.isArray(inventoryByCategory) ? (
                <p className="mx-5 mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:mx-6 sm:mb-6">
                  O resumo recebido ainda não contém os valores por
                  categoria. Confira se o backend atualizado está em execução.
                </p>
              ) : inventoryByCategory.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-slate-500 sm:px-6">
                  Nenhuma categoria para exibir.
                </p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
                        <tr>
                          <th scope="col" className="px-6 py-4 font-bold">
                            Categoria
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-right font-bold"
                          >
                            Unidades em estoque
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-4 text-right font-bold"
                          >
                            Valor em estoque
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {inventoryByCategory.map((category) => (
                          <tr
                            key={category.categoryId}
                            className="border-b border-slate-100 transition last:border-b-0 hover:bg-sky-50/50"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-semibold text-[#00102D]"
                            >
                              {category.categoryName}
                            </th>
                            <td className="px-6 py-4 text-right tabular-nums text-slate-600">
                              {numberFormatter.format(category.stockUnits)}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right font-bold tabular-nums text-[#00102D]">
                              {formatCurrency(category.inventoryValue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                    <p className="text-xs leading-5 text-slate-500">
                      Produtos vinculados a mais de uma categoria aparecem
                      em cada uma delas. Por isso, a soma das categorias
                      pode superar o valor geral do estoque, que conta
                      cada produto uma única vez.
                    </p>
                  </div>
                </>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black text-[#00102D]">
                  Pedidos por status
                </h2>

                <div className="inline-flex items-center gap-2 self-start rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  <Clock size={16} />
                  {numberFormatter.format(data.waitingPaymentOrders)}{" "}
                  aguardando pagamento
                </div>
              </div>

              {byStatus.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {byStatus.map((item) => {
                    const presentation = statusPresentation[item.status] ?? {
                      label: item.status,
                      className:
                        "border-slate-200 bg-slate-100 text-slate-700",
                    };

                    return (
                      <div
                        key={item.status}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <span
                          className={`inline-flex rounded-lg border px-2 py-1 text-xs font-bold ${presentation.className}`}
                        >
                          {presentation.label}
                        </span>
                        <p className="mt-4 text-3xl font-black text-[#00102D]">
                          {numberFormatter.format(item.count)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  Ainda não existem pedidos por status para exibir.
                </p>
              )}
            </section>
          </>
        ) : null}
      </div>
    </section>
  );
}