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
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line/80 bg-panel-gradient shadow-inset transition-all duration-200 hover:-translate-y-1 hover:border-skybrand/60 hover:shadow-glow">
      <Link to={`/produtos/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
          <img
            src={product.imgUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-80" />
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
          onClick={() => onAdd(product)}
        >
          Adicionar
        </Button>
      </div>
    </article>
  );
}
