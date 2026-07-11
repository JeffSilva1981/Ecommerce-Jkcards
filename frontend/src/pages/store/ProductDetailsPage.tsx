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
  const stockQuantity = product.stockQuantity ?? 0;
  const isOutOfStock = stockQuantity === 0;

  function handleDecrease() {
    setQuantity((value) => Math.max(1, value - 1));
  }

  function handleIncrease() {
    setQuantity((value) => Math.min(stockQuantity, value + 1));
  }

  function handleAddToCart() {
    if (isOutOfStock) return;

    addItem(product, quantity);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="group flex min-h-96 items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-5">
        <img
          src={product.imgUrl}
          alt={product.name}
          className="max-h-[520px] max-w-full object-contain transition duration-500 group-hover:scale-110"
        />
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

        <h1 className="mt-5 text-3xl font-bold leading-tight text-white">
          {product.name}
        </h1>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-white">
            Descrição do produto
          </h2>

          <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-300">
            {product.description}
          </p>
        </div>

        <div className="mt-5">
          {isOutOfStock ? (
            <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-sm font-semibold text-red-200">
              Esgotado
            </span>
          ) : (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">
              {stockQuantity} em estoque
            </span>
          )}
        </div>

        <p className="mt-6 text-3xl font-black text-gold">
          {formatCurrency(product.price)}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex h-11 items-center rounded-md border border-line bg-ink">
            <button
              className="grid size-11 place-items-center text-slate-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleDecrease}
              disabled={isOutOfStock || quantity <= 1}
              aria-label="Diminuir quantidade"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-10 text-center font-semibold">
              {isOutOfStock ? 0 : quantity}
            </span>

            <button
              className="grid size-11 place-items-center text-slate-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleIncrease}
              disabled={isOutOfStock || quantity >= stockQuantity}
              aria-label="Aumentar quantidade"
            >
              <Plus size={16} />
            </button>
          </div>

          <Button
            icon={<ShoppingCart size={18} />}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? "Esgotado" : "Adicionar ao carrinho"}
          </Button>
        </div>
      </Panel>
    </section>
  );
}