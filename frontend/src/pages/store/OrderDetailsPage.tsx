import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  MessageCircle,
  Package,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuthStore } from "../../stores/authStore";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

const whatsappNumber = "5515988233584";

function formatPostalCode(value: string) {
  const postalCode = value.replace(/\D/g, "");

  if (postalCode.length !== 8) {
    return value;
  }

  return `${postalCode.slice(0, 5)}-${postalCode.slice(5)}`;
}

export function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const isAdmin = useAuthStore((state) => state.isAdmin());

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Number.isFinite(orderId),
  });

  if (query.isLoading) {
    return (
      <section className="mx-auto max-w-4xl space-y-5">
        <div className="h-20 animate-pulse rounded-2xl bg-white" />
        <div className="h-80 animate-pulse rounded-2xl bg-white" />
        <div className="h-40 animate-pulse rounded-2xl bg-white" />
      </section>
    );
  }

  if (query.isError || !query.data) {
    return (
      <section className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-cyan-50 text-cyan-600">
            <Package size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#00102D]">
            Pedido não encontrado
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Confira o número do pedido ou volte para sua lista de compras.
          </p>

          <Link
            to="/pedidos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white transition hover:bg-cyan-600"
          >
            <ArrowLeft size={18} />
            Voltar aos pedidos
          </Link>
        </div>
      </section>
    );
  }

  const order = query.data;
  const isPickup = order.shipping?.method === "PICKUP";

  const calculatedProductsTotal = order.items.reduce(
    (total, item) =>
      total + (item.subTotal ?? item.price * item.quantity),
    0,
  );

  const productsTotal =
    order.productsTotal ?? calculatedProductsTotal;

  const shippingPrice = order.shipping?.price ?? 0;

  const orderTotal =
    order.total ?? productsTotal + shippingPrice;

  const canPay =
    !isAdmin &&
    order.status === "WAITING_PAYMENT" &&
    Boolean(order.payment?.checkoutUrl);

  function handlePayment() {
    if (order.payment?.checkoutUrl) {
      window.location.href = order.payment.checkoutUrl;
    }
  }

  function handleWhatsappOrder() {
    const itemsText = order.items
      .map((item) => {
        const subtotal =
          item.subTotal ?? item.price * item.quantity;

        return `- ${item.quantity}x ${item.name} - ${formatCurrency(subtotal)}`;
      })
      .join("\n");

    const deliveryText = isPickup
      ? "\nEntrega: Retirada na loja - Rua Camargo Fleury, nº 75 - Sorocaba/SP"
      : order.shipping
        ? `\nFrete: ${order.shipping.carrier} - ${order.shipping.serviceName} - ${formatCurrency(order.shipping.price)}`
        : "";

    const message = encodeURIComponent(
      `Olá! Gostaria de falar sobre meu pedido #${order.id}.\n\n` +
        `Cliente: ${order.client.name}\n` +
        `Status: ${order.status}\n\n` +
        `Itens:\n${itemsText}\n` +
        deliveryText +
        `\n\nTotal: ${formatCurrency(orderTotal)}`,
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/pedidos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-600"
      >
        <ArrowLeft size={17} />
        Voltar aos pedidos
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-cyan-600">
            Detalhes da compra
          </p>

          <h1 className="mt-1 text-3xl font-black text-[#00102D]">
            Pedido #{order.id}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Realizado em {formatDate(order.moment)}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {canPay ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#00102D]">
                Pagamento pendente
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Finalize o pagamento para que possamos dar continuidade ao pedido.
              </p>
            </div>

            <Button
              icon={<CreditCard size={17} />}
              onClick={handlePayment}
            >
              Pagar com Mercado Pago
            </Button>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
              <Package size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#00102D]">
                Itens do pedido
              </h2>

              <p className="text-sm text-slate-500">
                {order.items.length} produto(s) nesta compra
              </p>
            </div>
          </div>

          {!isAdmin ? (
            <button
              type="button"
              onClick={handleWhatsappOrder}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle size={17} />
              Falar pelo WhatsApp
            </button>
          ) : null}
        </div>

        <div className="mt-6 divide-y divide-slate-100">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-24 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[#00102D]">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-lg font-black text-[#00102D]">
                {formatCurrency(
                  item.subTotal ?? item.price * item.quantity,
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Produtos</span>
            <span className="font-semibold text-[#00102D]">
              {formatCurrency(productsTotal)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>{isPickup ? "Retirada" : "Frete"}</span>

            <span className="font-semibold text-[#00102D]">
              {isPickup
                ? "Grátis"
                : order.shipping
                  ? formatCurrency(shippingPrice)
                  : "Não informado"}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-xl font-black text-[#00102D]">
            <span>Total</span>
            <span>{formatCurrency(orderTotal)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isPickup ? (
          <InfoCard
            icon={<Store size={21} />}
            iconClassName="bg-emerald-50 text-emerald-600"
            title="Retirada na loja"
          >
            <div className="space-y-1 text-sm text-slate-600">
              <p className="font-bold text-[#00102D]">
                JKCards
              </p>

              <p>Rua Camargo Fleury, nº 75</p>
              <p>Sorocaba/SP</p>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Após a confirmação do pagamento, envie-nos uma mensagem
              no WhatsApp para agendar a retirada.
            </p>
          </InfoCard>
        ) : order.shipping ? (
          <InfoCard
            icon={<Truck size={21} />}
            iconClassName="bg-cyan-50 text-cyan-600"
            title="Entrega"
          >
            <p className="font-bold text-[#00102D]">
              {order.shipping.carrier}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {order.shipping.serviceName}
            </p>

            {order.shipping.deliveryDays != null ? (
              <p className="mt-3 text-sm text-slate-600">
                Prazo estimado:{" "}
                <strong>
                  {order.shipping.deliveryDays}{" "}
                  {order.shipping.deliveryDays === 1
                    ? "dia útil"
                    : "dias úteis"}
                </strong>
              </p>
            ) : null}
          </InfoCard>
        ) : null}

        {!isPickup && order.shippingAddress ? (
          <InfoCard
            icon={<MapPin size={21} />}
            iconClassName="bg-cyan-50 text-cyan-600"
            title="Endereço de entrega"
          >
            <div className="space-y-1 text-sm text-slate-600">
              <p className="font-bold text-[#00102D]">
                {order.shippingAddress.recipientName}
              </p>

              <p>{order.shippingAddress.recipientPhone}</p>

              <p>
                {order.shippingAddress.street},{" "}
                {order.shippingAddress.number}
              </p>

              {order.shippingAddress.complement ? (
                <p>{order.shippingAddress.complement}</p>
              ) : null}

              <p>{order.shippingAddress.neighborhood}</p>

              <p>
                {order.shippingAddress.city}/
                {order.shippingAddress.state}
              </p>

              <p>
                CEP:{" "}
                {formatPostalCode(
                  order.shippingAddress.postalCode,
                )}
              </p>
            </div>
          </InfoCard>
        ) : null}
      </div>

      <InfoCard
        icon={<UserRound size={21} />}
        iconClassName="bg-violet-50 text-violet-600"
        title="Cliente"
      >
        <p className="font-semibold text-[#00102D]">
          {order.client.name}
        </p>
      </InfoCard>
    </section>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  children: React.ReactNode;
};

function InfoCard({
  icon,
  iconClassName,
  title,
  children,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#00102D]">
            {title}
          </h2>

          <div className="mt-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}