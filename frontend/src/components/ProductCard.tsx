import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductSummary } from "../types/product";
import { formatCurrency } from "../utils/currency";
import { Button } from "./Button";

export function ProductCard({
  product,
  onAdd,
}: {
  product: ProductSummary;
  onAdd: (product: ProductSummary) => void;
}) {
  const stockQuantity = product.stockQuantity ?? 0;
  const isOutOfStock = stockQuantity === 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line/80 bg-panel-gradient shadow-inset transition-all duration-200 hover:-translate-y-1 hover:border-skybrand/60 hover:shadow-glow">
      <Link to={`/produtos/${product.id}`} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-3">
          <img
            src={product.imgUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex-1">
          <Link
            to={`/produtos/${product.id}`}
            className="line-clamp-2 text-base font-semibold leading-snug text-white transition hover:text-skysoft"
          >
            {product.name}
          </Link>

          <div className="mt-3">
            {isOutOfStock ? (
              <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs font-semibold text-red-200">
                Esgotado
              </span>
            ) : (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                {stockQuantity} em estoque
              </span>
            )}
          </div>

          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            Preco
          </p>

          <p className="text-2xl font-black text-gold">
            {formatCurrency(product.price)}
          </p>
        </div>

        <Button
          className="w-full"
          icon={<ShoppingCart size={17} />}
          disabled={isOutOfStock}
          onClick={() => onAdd(product)}
        >
          {isOutOfStock ? "Esgotado" : "Adicionar"}
        </Button>
      </div>
    </article>
  );
}