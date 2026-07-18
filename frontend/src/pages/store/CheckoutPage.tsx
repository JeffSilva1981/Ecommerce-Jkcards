import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import { formatCurrency } from "../../utils/currency";

export function CheckoutPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const { items, clear, totalPrice } = useCartStore();

  const mutation = useMutation({
    mutationFn: () =>
      createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    onSuccess: (order) => {
      clear();

      if (order.payment?.checkoutUrl) {
        window.location.assign(order.payment.checkoutUrl);
        return;
      }

      navigate(`/pedidos/${order.id}`);
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: "/checkout" }} />;
  }

  if (items.length === 0) {
    return <Navigate to="/carrinho" replace />;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
        <p className="mt-2 text-sm text-slate-400">
          Revise os itens. O pedido sera criado como aguardando pagamento.
        </p>
      </div>

      <Panel className="p-5">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-slate-400">
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>

              <p className="font-bold text-gold">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-xl font-bold text-white">
          <span>Total</span>
          <span>{formatCurrency(totalPrice())}</span>
        </div>

        {mutation.error ? (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
            Nao foi possivel criar o pedido agora.
          </p>
        ) : null}

        <Button
          className="mt-6 w-full"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Criando pedido..." : "Confirmar pedido"}
        </Button>
      </Panel>
    </section>
  );
}
