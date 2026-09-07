import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getCartItemMaxQuantity,
  useCartStore,
} from "../stores/cartStore";
import type { ProductSummary } from "../types/product";
import { formatCurrency } from "../utils/currency";

type ProductCardProps = {
  product: ProductSummary;
  onAdd: (product: ProductSummary) => void;
};

export function ProductCard({
  product,
  onAdd,
}: ProductCardProps) {
  const quantityInCart = useCartStore(
    (state) =>
      state.items.find(
        (item) => item.productId === product.id,
      )?.quantity ?? 0,
  );

  if (product.available !== true) {
    return null;
  }

  const stockQuantity = product.stockQuantity ?? 0;
  const isOutOfStock = stockQuantity <= 0;

  const validPrice =
    Number.isFinite(product.price) && product.price > 0;

  const maximumQuantity = getCartItemMaxQuantity(product);
  const limitReached = quantityInCart >= maximumQuantity;

  const canAdd =
    !isOutOfStock &&
    validPrice &&
    !limitReached;

  function handleAdd() {
    // Consulta o estado atual também no clique.
    const currentQuantity =
      useCartStore.getState().items.find(
        (item) => item.productId === product.id,
      )?.quantity ?? 0;

    if (
      !canAdd ||
      currentQuantity >= maximumQuantity
    ) {
      return;
    }

    onAdd(product);
  }

  const buttonLabel = isOutOfStock
    ? "Esgotado"
    : !validPrice
      ? "Preço indisponível"
      : limitReached
        ? "Limite no carrinho atingido"
        : "Adicionar ao carrinho";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl">
      <Link
        to={`/produtos/${product.id}`}
        className="block"
      >
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50 p-5">
          {product.imgUrl ? (
            <img
              src={product.imgUrl}
              alt={product.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-400">
              Imagem indisponível
            </div>
          )}

          <div className="absolute left-3 top-3">
            {isOutOfStock ? (
              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                Esgotado
              </span>
            ) : (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Em estoque
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={`/produtos/${product.id}`}
          className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900 transition hover:text-sky-600"
        >
          {product.name}
        </Link>

        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Preço
        </p>

        <p className="mt-1 text-2xl font-black text-[#00102D]">
          {validPrice
            ? formatCurrency(product.price)
            : "Indisponível"}
        </p>

        {!isOutOfStock ? (
          <p className="mt-1 text-xs text-slate-500">
            {stockQuantity}{" "}
            {stockQuantity === 1
              ? "unidade disponível"
              : "unidades disponíveis"}
          </p>
        ) : (
          <p className="mt-1 text-xs text-red-500">
            Produto temporariamente indisponível
          </p>
        )}

        {product.maxQuantityPerOrder != null ? (
          <p className="mt-2 text-xs font-semibold text-sky-700">
            Máximo de {product.maxQuantityPerOrder}{" "}
            {product.maxQuantityPerOrder === 1
              ? "unidade"
              : "unidades"}{" "}
            por pedido.
          </p>
        ) : null}

        {quantityInCart > 0 ? (
          <p
            aria-live="polite"
            className="mt-2 text-xs text-slate-600"
          >
            No carrinho: {quantityInCart}{" "}
            {quantityInCart === 1
              ? "unidade"
              : "unidades"}.
          </p>
        ) : null}

        {quantityInCart > maximumQuantity ? (
          <p className="mt-2 text-xs font-semibold text-amber-700">
            Revise a quantidade no carrinho: ela ultrapassa
            o estoque ou o limite atual.
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            <ShoppingCart size={18} />
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}