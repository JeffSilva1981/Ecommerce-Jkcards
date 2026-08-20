import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  KeyRound,
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
    ["PAID", "SHIPPED", "DELIVERED"].includes(order.status),
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#00102D] via-[#06234A] to-[#073B66] p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid size-24 shrink-0 place-items-center rounded-full border-2 border-cyan-300/60 bg-white/10 text-3xl font-black text-white shadow-lg">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Cliente JKCards
              </p>

              <h1 className="mt-1 truncate text-3xl font-black text-white md:text-4xl">
                {user.name}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-slate-200">
                <Mail size={16} />
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              <LogOut size={17} />
              Sair da conta
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total de pedidos"
          value={ordersQuery.isLoading ? "..." : String(orders.length)}
          icon={<Package size={22} />}
          iconClassName="bg-cyan-50 text-cyan-600"
        />

        <SummaryCard
          label="Aguardando pagamento"
          value={
            ordersQuery.isLoading
              ? "..."
              : String(pendingOrders.length)
          }
          icon={<Clock3 size={22} />}
          iconClassName="bg-amber-50 text-amber-600"
          valueClassName="text-amber-600"
        />

        <SummaryCard
          label="Pedidos entregues"
          value={
            ordersQuery.isLoading
              ? "..."
              : String(deliveredOrders.length)
          }
          icon={<CheckCircle2 size={22} />}
          iconClassName="bg-emerald-50 text-emerald-600"
          valueClassName="text-emerald-600"
        />

        <SummaryCard
          label="Total em compras"
          value={
            ordersQuery.isLoading
              ? "..."
              : formatCurrency(totalSpent)
          }
          icon={<WalletCards size={22} />}
          iconClassName="bg-violet-50 text-violet-600"
          valueClassName="text-[#00102D]"
          compact
        />
      </div>

      {ordersQuery.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Não foi possível carregar o resumo dos seus pedidos.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#00102D]">
                Informações pessoais
              </h2>

              <p className="text-sm text-slate-500">
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

          <p className="mt-5 rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-xs text-slate-600">
            A edição dos dados pessoais será disponibilizada em uma
            próxima atualização.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#00102D]">
                Último pedido
              </h2>

              <p className="text-sm text-slate-500">
                Sua compra mais recente.
              </p>
            </div>
          </div>

          {ordersQuery.isLoading ? (
            <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-100" />
          ) : null}

          {!ordersQuery.isLoading && latestOrder ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#00102D]">
                    Pedido #{latestOrder.id}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(latestOrder.moment)}
                  </p>
                </div>

                <p className="font-black text-cyan-600">
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
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                Você ainda não realizou nenhum pedido.
              </p>

              <Link to="/produtos" className="mt-4 block">
                <Button className="w-full">
                  Conhecer produtos
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-xl font-bold text-[#00102D]">
          Ações rápidas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Acesse rapidamente as principais áreas da sua conta.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

          <QuickLink
            to="/esqueci-senha"
            icon={<KeyRound size={20} />}
            title="Alterar senha"
            description="Receber um link seguro por e-mail"
          />
        </div>
      </div>
    </section>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName: string;
  valueClassName?: string;
  compact?: boolean;
};

function SummaryCard({
  label,
  value,
  icon,
  iconClassName,
  valueClassName = "text-[#00102D]",
  compact = false,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 truncate font-black ${compact ? "text-2xl" : "text-3xl"} ${valueClassName}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </div>
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words font-semibold text-[#00102D]">
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
      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-sm"
    >
      <div className="text-cyan-600">
        {icon}
      </div>

      <p className="mt-3 font-bold text-[#00102D] transition group-hover:text-cyan-700">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </Link>
  );
}