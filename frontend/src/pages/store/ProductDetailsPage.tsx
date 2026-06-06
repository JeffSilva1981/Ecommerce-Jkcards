import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../api/productsApi";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Panel } from "../../components/Panel";
import { useCartStore } from "../../stores/cartStore";
import { formatCurrency } from "../../utils/currency";

export function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const query = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isFinite(productId),
  });

  if (query.isLoading) {
    return <div className="h-96 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!query.data) {
    return (
      <EmptyState
        title="Produto nao encontrado"
        description="Volte para a vitrine e escolha outro item."
        action={
          <Link to="/produtos">
            <Button>Ver produtos</Button>
          </Link>
        }
      />
    );
  }

  const product = query.data;

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="overflow-hidden rounded-lg border border-line bg-white/5">
        <img src={product.imgUrl} alt={product.name} className="h-full min-h-96 w-full object-cover" />
      </div>
      <Panel className="p-6">
        <div className="flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <span
              key={category.id}
              className="rounded-full border border-skybrand/30 bg-skybrand/10 px-3 py-1 text-xs font-semibold text-skysoft"
            >
              {category.name}
            </span>
          ))}
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white">{product.name}</h1>
        <p className="mt-4 text-slate-300">{product.description}</p>
        <p className="mt-6 text-3xl font-black text-gold">{formatCurrency(product.price)}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex h-11 items-center rounded-md border border-line bg-ink">
            <button
              className="grid size-11 place-items-center text-slate-200 hover:text-white"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Diminuir quantidade"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-10 text-center font-semibold">{quantity}</span>
            <button
              className="grid size-11 place-items-center text-slate-200 hover:text-white"
              onClick={() => setQuantity((value) => value + 1)}
              aria-label="Aumentar quantidade"
            >
              <Plus size={16} />
            </button>
          </div>
          <Button
            icon={<ShoppingCart size={18} />}
            onClick={() => addItem(product, quantity)}
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </Panel>
    </section>
  );
}

