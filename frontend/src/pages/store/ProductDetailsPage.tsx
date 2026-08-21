import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../api/productsApi";
import { EmptyState } from "../../components/EmptyState";
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
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="h-[520px] animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-[520px] animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EmptyState
            title="Produto não encontrado"
            description="Volte para a vitrine e escolha outro item."
            action={
              <Link
                to="/produtos"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
              >
                Ver produtos
              </Link>
            }
          />
        </div>
      </div>
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
    if (isOutOfStock) {
      return;
    }

    addItem(product, quantity);
  }

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          to="/produtos"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-sky-600"
        >
          <ArrowLeft size={18} />
          Voltar para os produtos
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="group flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:min-h-[520px]">
            {product.imgUrl ? (
              <img
                src={product.imgUrl}
                alt={product.name}
                className="max-h-[520px] max-w-full object-contain transition duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="text-sm font-medium text-slate-400">
                Imagem indisponível
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-[#00102D] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-5">
              {isOutOfStock ? (
                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-bold text-red-600">
                  Esgotado
                </span>
              ) : (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                  {stockQuantity} unidade
                  {stockQuantity === 1 ? "" : "s"} em estoque
                </span>
              )}
            </div>

            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preço
              </p>

              <p className="mt-1 text-4xl font-black text-[#00102D]">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-black text-[#00102D]">
                Descrição do produto
              </h2>

              <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={isOutOfStock || quantity <= 1}
                  aria-label="Diminuir quantidade"
                  className="grid size-12 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-12 text-center font-bold text-slate-900">
                  {isOutOfStock ? 0 : quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={isOutOfStock || quantity >= stockQuantity}
                  aria-label="Aumentar quantidade"
                  className="grid size-12 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                <ShoppingCart size={19} />
                {isOutOfStock ? "Esgotado" : "Adicionar ao carrinho"}
              </button>
            </div>

            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <ShieldCheck size={20} className="text-sky-600" />
                Compra segura
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <Truck size={20} className="text-sky-600" />
                Envio para todo o Brasil
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}