import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  CircleOff,
  DollarSign,
  Link2,
  Package,
  ReceiptText,
  TrendingUp,
  Truck,
  Warehouse,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getDashboardSummary } from "../../api/dashboardApi";
import {
  getMelhorEnvioAuthorizationStatus,
  getMelhorEnvioAuthorizationUrl,
} from "../../api/shippingApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";

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
  const melhorEnvioAuthorized =
    shippingAuthorizationQuery.data?.authorized ?? false;

  if (query.isLoading) {
    return <div className="h-80 animate-pulse rounded-lg bg-white/5" />;
  }

  if (query.isError) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">
            Indicadores gerais da loja.
          </p>
        </div>

        <Panel className="p-5">
          <p className="text-sm text-red-200">
            Não foi possível carregar o dashboard agora.
          </p>
        </Panel>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Indicadores gerais da loja.
        </p>
      </div>

      {authorizationCompleted ? (
        <Panel className="border-emerald-400/30 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-3 text-emerald-200">
            <CheckCircle2 size={20} />
            <p className="text-sm font-semibold">
              A conta Melhor Envio foi conectada com sucesso.
            </p>
          </div>
        </Panel>
      ) : null}

      <Panel className="p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Integração Melhor Envio
              </h2>

              {shippingAuthorizationQuery.isLoading ? (
                <p className="mt-1 text-sm text-slate-400">
                  Verificando autorização...
                </p>
              ) : null}

              {shippingAuthorizationQuery.isError ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-200">
                  <CircleOff size={16} />
                  Não foi possível consultar a integração.
                </div>
              ) : null}

              {!shippingAuthorizationQuery.isLoading &&
              !shippingAuthorizationQuery.isError ? (
                melhorEnvioAuthorized ? (
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    <CheckCircle2 size={17} />
                    Melhor Envio conectado
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-sm text-yellow-200">
                    <AlertTriangle size={17} />
                    A conta ainda não foi conectada.
                  </div>
                )
              ) : null}

              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                A autorização permite calcular o frete no carrinho e renovar
                automaticamente o acesso à Melhor Envio.
              </p>
            </div>
          </div>

          {!melhorEnvioAuthorized ? (
            <Button
              icon={<Link2 size={17} />}
              disabled={
                shippingAuthorizationQuery.isLoading ||
                connectMutation.isPending
              }
              onClick={() => connectMutation.mutate()}
            >
              {connectMutation.isPending
                ? "Abrindo autorização..."
                : "Conectar Melhor Envio"}
            </Button>
          ) : null}
        </div>

        {connectMutation.isError ? (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
            Não foi possível iniciar a autorização da Melhor Envio.
          </p>
        ) : null}
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pedidos"
          value={String(data?.ordersCount ?? 0)}
          icon={<Package size={22} />}
        />

        <StatCard
          label="Receita bruta"
          value={formatCurrency(data?.grossRevenue ?? 0)}
          icon={<DollarSign size={22} />}
        />

        <StatCard
          label="Receita líquida"
          value={formatCurrency(data?.netRevenue ?? 0)}
          icon={<TrendingUp size={22} />}
        />

        <StatCard
          label="Ticket médio"
          value={formatCurrency(data?.averageTicket ?? 0)}
          icon={<ReceiptText size={22} />}
        />

        <StatCard
          label="Valor em estoque"
          value={formatCurrency(data?.inventoryValue ?? 0)}
          icon={<Warehouse size={22} />}
        />

        <StatCard
          label="Produtos cadastrados"
          value={String(data?.productsCount ?? 0)}
          icon={<Boxes size={22} />}
        />

        <StatCard
          label="Unidades em estoque"
          value={String(data?.stockUnits ?? 0)}
          icon={<Package size={22} />}
        />

        <StatCard
          label="Produtos esgotados"
          value={String(data?.outOfStockProducts ?? 0)}
          icon={<AlertTriangle size={22} />}
        />
      </div>

      <Panel className="p-5">
        <h2 className="text-lg font-bold text-white">
          Pedidos por status
        </h2>

        {byStatus.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {byStatus.map((item) => (
              <div
                key={item.status}
                className="rounded-md border border-line bg-white/5 p-4"
              >
                <StatusBadge status={item.status} />

                <p className="mt-3 text-2xl font-bold text-white">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Ainda não existem pedidos por status para exibir.
          </p>
        )}
      </Panel>
    </section>
  );
}