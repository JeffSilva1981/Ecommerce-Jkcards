import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  LogOut,
  Mail,
  Package,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Store,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { useAuthStore } from "../../stores/authStore";
import type { Order } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

export function ProfilePage() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const ordersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  const orders = (ordersQuery.data ?? []) as Order[];

  const pendingOrders = orders.filter(
    (order) => order.status === "WAITING_PAYMENT",
  );

  const paidOrders = orders.filter((order) =>
    ["PAID", "SHIPPED", "DELIVERED"].includes(
      order.status,
    ),
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );

  const totalSpent = paidOrders.reduce(
    (total, order) => total + order.total,
    0,
  );

  const latestOrder = [...orders].sort(
    (first, second) =>
      new Date(second.moment).getTime() -
      new Date(first.moment).getTime(),
  )[0];

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "JK";

  function handleLogout() {
    logout();
    navigate("/");
  }

  function formatBirthDate(value?: string) {
    if (!value) {
      return "Não informado";
    }

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) {
      return value;
    }

    return `${day}/${month}/${year}`;
  }

  if (!user) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <Panel className="overflow-hidden">
        <div className="border-b border-line bg-gradient-to-r from-skybrand/20 via-white/5 to-gold/10 p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid size-24 shrink-0 place-items-center rounded-full border-2 border-skybrand/50 bg-skybrand/15 text-3xl font-black text-skysoft shadow-glow">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-skysoft">
                Cliente JKCards
              </p>

              <h1 className="mt-1 truncate text-3xl font-black text-white md:text-4xl">
                {user.name}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-slate-300">
                <Mail size={16} />
                {user.email}
              </p>
            </div>

            <Button
              variant="secondary"
              icon={<LogOut size={17} />}
              onClick={handleLogout}
            >
              Sair da conta
            </Button>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total de pedidos
              </p>

              <p className="mt-2 text-3xl font-black text-white">
                {ordersQuery.isLoading ? "..." : orders.length}
              </p>
            </div>

            <div className="grid size-11 place-items-center rounded-lg bg-skybrand/15 text-skysoft">
              <Package size={22} />
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Aguardando pagamento
              </p>

              <p className="mt-2 text-3xl font-black text-gold">
                {ordersQuery.isLoading
                  ? "..."
                  : pendingOrders.length}
              </p>
            </div>

            <div className="grid size-11 place-items-center rounded-lg bg-gold/15 text-gold">
              <Clock3 size={22} />
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Pedidos entregues
              </p>

              <p className="mt-2 text-3xl font-black text-emerald-300">
                {ordersQuery.isLoading
                  ? "..."
                  : deliveredOrders.length}
              </p>
            </div>

            <div className="grid size-11 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total em compras
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {ordersQuery.isLoading
                  ? "..."
                  : formatCurrency(totalSpent)}
              </p>
            </div>

            <div className="grid size-11 place-items-center rounded-lg bg-purple-400/10 text-purple-300">
              <WalletCards size={22} />
            </div>
          </div>
        </Panel>
      </div>

      {ordersQuery.isError ? (
        <div className="rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          Não foi possível carregar o resumo dos seus
          pedidos.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-5 md:p-6">
          <div className="flex items-center gap-3">
            <UserRound className="text-skysoft" size={21} />

            <div>
              <h2 className="text-xl font-bold text-white">
                Informações pessoais
              </h2>

              <p className="text-sm text-slate-400">
                Dados cadastrados na sua conta.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProfileField
              icon={<UserRound size={18} />}
              label="Nome"
              value={user.name}
            />

            <ProfileField
              icon={<Mail size={18} />}
              label="E-mail"
              value={user.email}
            />

            <ProfileField
              icon={<Phone size={18} />}
              label="Telefone"
              value={user.phone || "Não informado"}
            />

            <ProfileField
              icon={<CalendarDays size={18} />}
              label="Data de nascimento"
              value={formatBirthDate(user.birthDate)}
            />

            <ProfileField
              icon={<Hash size={18} />}
              label="Código do cliente"
              value={`#${user.id}`}
            />

            <ProfileField
              icon={<CheckCircle2 size={18} />}
              label="Situação da conta"
              value="Ativa"
            />
          </div>

          <p className="mt-5 rounded-md border border-line bg-white/5 p-3 text-xs text-slate-400">
            A edição dos dados pessoais será disponibilizada
            em uma próxima atualização.
          </p>
        </Panel>

        <Panel className="p-5 md:p-6">
          <div className="flex items-center gap-3">
            <ShoppingBag
              className="text-gold"
              size={21}
            />

            <div>
              <h2 className="text-xl font-bold text-white">
                Último pedido
              </h2>

              <p className="text-sm text-slate-400">
                Sua compra mais recente.
              </p>
            </div>
          </div>

          {ordersQuery.isLoading ? (
            <div className="mt-6 h-32 animate-pulse rounded-lg bg-white/5" />
          ) : null}

          {!ordersQuery.isLoading && latestOrder ? (
            <div className="mt-6 rounded-lg border border-line bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-white">
                    Pedido #{latestOrder.id}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {formatDate(latestOrder.moment)}
                  </p>
                </div>

                <p className="font-black text-gold">
                  {formatCurrency(latestOrder.total)}
                </p>
              </div>

              <Link
                to={`/pedidos/${latestOrder.id}`}
                className="mt-4 block"
              >
                <Button className="w-full">
                  Ver detalhes
                </Button>
              </Link>
            </div>
          ) : null}

          {!ordersQuery.isLoading && !latestOrder ? (
            <div className="mt-6 rounded-lg border border-line bg-white/5 p-5 text-center">
              <p className="text-sm text-slate-400">
                Você ainda não realizou nenhum pedido.
              </p>

              <Link
                to="/produtos"
                className="mt-4 block"
              >
                <Button className="w-full">
                  Conhecer produtos
                </Button>
              </Link>
            </div>
          ) : null}
        </Panel>
      </div>

      <Panel className="p-5 md:p-6">
        <h2 className="text-xl font-bold text-white">
          Ações rápidas
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Acesse rapidamente as principais áreas da sua conta.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            to="/pedidos"
            icon={<Package size={20} />}
            title="Meus pedidos"
            description="Acompanhar todas as compras"
          />

          <QuickLink
            to="/produtos"
            icon={<Store size={20} />}
            title="Ir para a loja"
            description="Continuar comprando"
          />

          <QuickLink
            to="/carrinho"
            icon={<ShoppingCart size={20} />}
            title="Meu carrinho"
            description="Conferir produtos selecionados"
          />

          <QuickLink
            to={
              pendingOrders[0]
                ? `/pedidos/${pendingOrders[0].id}`
                : "/pedidos"
            }
            icon={<Clock3 size={20} />}
            title="Pagamentos pendentes"
            description={
              pendingOrders.length > 0
                ? `${pendingOrders.length} pedido(s) aguardando`
                : "Nenhum pagamento pendente"
            }
          />
        </div>
      </Panel>
    </section>
  );
}

type ProfileFieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function ProfileField({
  icon,
  label,
  value,
}: ProfileFieldProps) {
  return (
    <div className="rounded-lg border border-line bg-white/5 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

type QuickLinkProps = {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

function QuickLink({
  to,
  icon,
  title,
  description,
}: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-line bg-white/5 p-4 transition hover:border-skybrand/60 hover:bg-white/10"
    >
      <div className="text-skysoft">{icon}</div>

      <p className="mt-3 font-bold text-white group-hover:text-skysoft">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {description}
      </p>
    </Link>
  );
}