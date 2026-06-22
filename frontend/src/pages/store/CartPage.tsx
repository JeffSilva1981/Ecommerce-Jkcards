import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Panel } from "../../components/Panel";
import { useCartStore } from "../../stores/cartStore";
import { formatCurrency } from "../../utils/currency";

export function CartPage() {
  const { items, increment, decrement, removeItem, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Carrinho vazio"
        description="Escolha alguns produtos na vitrine para montar seu pedido."
        action={
          <Link to="/produtos">
            <Button>Ver produtos</Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">Carrinho</h1>

        {items.map((item) => (
          <Panel key={item.productId} className="flex gap-4 p-4">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-md bg-white p-2">
              <img
                src={item.imgUrl}
                alt={item.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-white">{item.name}</h2>

              <p className="mt-1 text-sm text-slate-400">
                {formatCurrency(item.price)}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => decrement(item.productId)}
                  icon={<Minus size={16} />}
                >
                  Diminuir
                </Button>

                <span className="rounded-md border border-line px-3 py-2 text-sm font-semibold">
                  {item.quantity}
                </span>

                <Button
                  variant="secondary"
                  onClick={() => increment(item.productId)}
                  icon={<Plus size={16} />}
                >
                  Aumentar
                </Button>

                <Button
                  variant="danger"
                  onClick={() => removeItem(item.productId)}
                  icon={<Trash2 size={16} />}
                >
                  Remover
                </Button>
              </div>
            </div>

            <p className="hidden text-right font-bold text-gold sm:block">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </Panel>
        ))}
      </div>

      <Panel className="h-fit p-5">
        <h2 className="text-xl font-bold text-white">Resumo</h2>

        <div className="mt-5 space-y-3 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Itens</span>
            <span>{items.length}</span>
          </div>

          <div className="flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span>{formatCurrency(totalPrice())}</span>
          </div>
        </div>

        <Link to="/checkout" className="mt-5 block">
          <Button className="w-full">Finalizar pedido</Button>
        </Link>
      </Panel>
    </section>
  );
}