import { useQuery } from "@tanstack/react-query";
import { CreditCard, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Panel } from "../../components/Panel";
import { StatusBadge } from "../../components/StatusBadge";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

const whatsappNumber = "5515988233584";

export function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const query = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Number.isFinite(orderId),
  });

  if (query.isLoading) {
    return <div className="h-72 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!query.data) {
    return (
      <EmptyState
        title="Pedido nao encontrado"
        description="Confira o numero do pedido."
      />
    );
  }

  const order = query.data;
  const canPay =
    order.status === "WAITING_PAYMENT" && Boolean(order.payment?.checkoutUrl);

  function handlePayment() {
    if (order.payment?.checkoutUrl) {
      window.location.href = order.payment.checkoutUrl;
    }
  }

  function handleWhatsappOrder() {
    const itemsText = order.items
      .map((item) => {
        const subtotal = item.subTotal ?? item.price * item.quantity;

        return `- ${item.quantity}x ${item.name} - ${formatCurrency(subtotal)}`;
      })
      .join("\n");

    const message = encodeURIComponent(
      `Olá! Gostaria de falar sobre meu pedido #${order.id}.\n\n` +
        `Cliente: ${order.client.name}\n` +
        `Status: ${order.status}\n\n` +
        `Itens:\n${itemsText}\n\n` +
        `Total: ${formatCurrency(order.total)}`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pedido #{order.id}</h1>
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
                Clique no botao abaixo para finalizar o pagamento com Mercado Pago.
              </p>
            </div>

            <Button icon={<CreditCard size={17} />} onClick={handlePayment}>
              Pagar com Mercado Pago
            </Button>
          </div>
        </Panel>
      ) : null}

      <Panel className="p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-white">Itens</h2>

          <Button
            variant="secondary"
            icon={<MessageCircle size={17} />}
            onClick={handleWhatsappOrder}
          >
            Enviar pedido pelo WhatsApp
          </Button>
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
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              <p className="shrink-0 font-bold text-gold">
                {formatCurrency(item.subTotal ?? item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-xl font-bold text-white">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </Panel>

      <Panel className="p-5">
        <h2 className="text-lg font-bold text-white">Cliente</h2>
        <p className="mt-2 text-slate-300">{order.client.name}</p>
      </Panel>
    </section>
  );
}