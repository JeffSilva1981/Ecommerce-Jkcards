import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  MapPin,
  MessageCircle,
  Store,
  Truck,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Panel } from "../../components/Panel";
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
  const isAdmin = useAuthStore((state) =>
    state.isAdmin()
  );

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Number.isFinite(orderId),
  });

  if (query.isLoading) {
    return (
      <div className="h-72 animate-pulse rounded-lg bg-white/5" />
    );
  }

  if (!query.data) {
    return (
      <EmptyState
        title="Pedido não encontrado"
        description="Confira o número do pedido."
      />
    );
  }

  const order = query.data;
  const isPickup =
    order.shipping?.method === "PICKUP";

  const calculatedProductsTotal =
    order.items.reduce(
      (total, item) =>
        total +
        (item.subTotal ??
          item.price * item.quantity),
      0
    );

  const productsTotal =
    order.productsTotal ??
    calculatedProductsTotal;

  const shippingPrice =
    order.shipping?.price ?? 0;

  const orderTotal =
    order.total ??
    productsTotal + shippingPrice;

  const canPay =
    !isAdmin &&
    order.status === "WAITING_PAYMENT" &&
    Boolean(order.payment?.checkoutUrl);

  function handlePayment() {
    if (order.payment?.checkoutUrl) {
      window.location.href =
        order.payment.checkoutUrl;
    }
  }

  function handleWhatsappOrder() {
    const itemsText = order.items
      .map((item) => {
        const subtotal =
          item.subTotal ??
          item.price * item.quantity;

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
        `\n\nTotal: ${formatCurrency(orderTotal)}`
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Pedido #{order.id}
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {formatDate(order.moment)}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {canPay ? (
        <Panel className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Pagamento pendente
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Clique no botão abaixo para finalizar
                o pagamento com Mercado Pago.
              </p>
            </div>

            <Button
              icon={<CreditCard size={17} />}
              onClick={handlePayment}
            >
              Pagar com Mercado Pago
            </Button>
          </div>
        </Panel>
      ) : null}

      <Panel className="p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-white">
            Itens
          </h2>

          {!isAdmin ? (
            <Button
              variant="secondary"
              icon={<MessageCircle size={17} />}
              onClick={handleWhatsappOrder}
            >
              Enviar pedido pelo WhatsApp
            </Button>
          ) : null}
        </div>

        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-md bg-white p-2">
                  <img
                    src={item.imgUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-white">
                    {item.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    {item.quantity} x{" "}
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <p className="shrink-0 font-bold text-gold">
                {formatCurrency(
                  item.subTotal ??
                    item.price * item.quantity
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-line pt-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Produtos</span>
            <span>
              {formatCurrency(productsTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>
              {isPickup ? "Retirada" : "Frete"}
            </span>

            <span>
              {isPickup
                ? "Grátis"
                : order.shipping
                  ? formatCurrency(shippingPrice)
                  : "Não informado"}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-3 text-xl font-bold text-white">
            <span>Total</span>
            <span>
              {formatCurrency(orderTotal)}
            </span>
          </div>
        </div>
      </Panel>

      {isPickup ? (
        <Panel className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
              <Store size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Retirada na loja
              </h2>

              <div className="mt-3 space-y-1 text-sm text-slate-300">
                <p className="font-semibold text-white">
                  JKCards
                </p>

                <p>Rua Camargo Fleury, nº 75</p>
                <p>Sorocaba/SP</p>
              </div>

              <p className="mt-3 text-sm text-slate-400">
                Após a confirmação do pagamento, envie-nos uma mensagem no WhatsApp para agendar a retirada.
              </p>
            </div>
          </div>
        </Panel>
      ) : order.shipping ? (
        <Panel className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
              <Truck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Entrega
              </h2>

              <p className="mt-2 font-semibold text-slate-200">
                {order.shipping.carrier}
              </p>

              <p className="text-sm text-slate-400">
                {order.shipping.serviceName}
              </p>

              {order.shipping.deliveryDays !=
              null ? (
                <p className="mt-2 text-sm text-slate-400">
                  Prazo estimado:{" "}
                  {order.shipping.deliveryDays}{" "}
                  {order.shipping.deliveryDays ===
                  1
                    ? "dia útil"
                    : "dias úteis"}
                </p>
              ) : null}
            </div>
          </div>
        </Panel>
      ) : null}

      {!isPickup && order.shippingAddress ? (
        <Panel className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Endereço de entrega
              </h2>

              <div className="mt-3 space-y-1 text-sm text-slate-300">
                <p className="font-semibold text-white">
                  {
                    order.shippingAddress
                      .recipientName
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      .recipientPhone
                  }
                </p>

                <p>
                  {order.shippingAddress.street},{" "}
                  {order.shippingAddress.number}
                </p>

                {order.shippingAddress
                  .complement ? (
                  <p>
                    {
                      order.shippingAddress
                        .complement
                    }
                  </p>
                ) : null}

                <p>
                  {
                    order.shippingAddress
                      .neighborhood
                  }
                </p>

                <p>
                  {order.shippingAddress.city}/
                  {order.shippingAddress.state}
                </p>

                <p>
                  CEP:{" "}
                  {formatPostalCode(
                    order.shippingAddress
                      .postalCode
                  )}
                </p>
              </div>
            </div>
          </div>
        </Panel>
      ) : null}

      <Panel className="p-5">
        <h2 className="text-lg font-bold text-white">
          Cliente
        </h2>

        <p className="mt-2 text-slate-300">
          {order.client.name}
        </p>
      </Panel>
    </section>
  );
}