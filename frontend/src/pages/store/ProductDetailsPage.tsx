import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../../api/productsApi";
import {
  getCartItemMaxQuantity,
  useCartStore,
} from "../../stores/cartStore";
import { formatCurrency } from "../../utils/currency";

type CartFeedback = {
  type: "success" | "error";
  message: string;
};

export function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);

  const validProductId =
    Number.isSafeInteger(productId) && productId > 0;

  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] =
    useState<CartFeedback | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const syncProduct = useCartStore((state) => state.syncProduct);

  const quantityInCart = useCartStore(
    (state) =>
      state.items.find(
        (item) => item.productId === productId,
      )?.quantity ?? 0,
  );

  const query = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: validProductId,
    retry: (failureCount, error) => {
      if (
        isAxiosError(error) &&
        error.response?.status === 404
      ) {
        return false;
      }

      return failureCount < 2;
    },
  });

  const product = query.data;

  const maximumQuantity = product
    ? getCartItemMaxQuantity(product)
    : 0;

  const remainingQuantity = Math.max(
    0,
    maximumQuantity - quantityInCart,
  );

  const selectedQuantity =
    remainingQuantity > 0
      ? Math.min(Math.max(1, quantity), remainingQuantity)
      : 0;

  useEffect(() => {
    setQuantity(1);
    setFeedback(null);
  }, [productId]);

  useEffect(() => {
    if (product && !query.isError) {
      syncProduct(product);
    }
  }, [product, query.isError, syncProduct]);

  if (validProductId && query.isLoading) {
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="h-[520px] animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-[520px] animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  const notFound =
    !validProductId ||
    (isAxiosError(query.error) &&
      query.error.response?.status === 404) ||
    (query.isSuccess && product?.available !== true);

  if (notFound || query.isError || !product) {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-[#00102D]">
              {notFound
                ? "Produto não encontrado ou indisponível"
                : "Não foi possível carregar o produto"}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              {notFound
                ? "Volte para a vitrine e escolha outro item."
                : "Tente novamente para consultar as informações atualizadas."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {!notFound ? (
                <button
                  type="button"
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:opacity-50"
                >
                  {query.isFetching
                    ? "Carregando..."
                    : "Tentar novamente"}
                </button>
              ) : null}

              <Link
                to="/produtos"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
              >
                <ArrowLeft size={18} />
                Ver produtos
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const stockQuantity = product.stockQuantity ?? 0;
  const isOutOfStock = stockQuantity <= 0;

  const validPrice =
    Number.isFinite(product.price) && product.price > 0;

  const canAdd =
    !query.isFetching &&
    validPrice &&
    selectedQuantity > 0;

  function handleDecrease() {
    setQuantity(Math.max(1, selectedQuantity - 1));
    setFeedback(null);
  }

  function handleIncrease() {
    setQuantity(
      Math.min(remainingQuantity, selectedQuantity + 1),
    );
    setFeedback(null);
  }

  function handleAddToCart() {
    if (!product || !canAdd) {
      return;
    }

    const added = addItem(product, selectedQuantity);

    if (!added) {
      setFeedback({
        type: "error",
        message:
          "Não foi possível adicionar essa quantidade. Confira o estoque, o limite por pedido e os itens já no carrinho.",
      });
      return;
    }

    setFeedback({
      type: "success",
      message: `${selectedQuantity} ${
        selectedQuantity === 1
          ? "unidade adicionada"
          : "unidades adicionadas"
      } ao carrinho.`,
    });

    setQuantity(1);
  }

  const addButtonLabel = query.isFetching
    ? "Atualizando produto..."
    : isOutOfStock
      ? "Esgotado"
      : !validPrice
        ? "Preço indisponível"
        : remainingQuantity === 0
          ? "Limite atingido no carrinho"
          : "Adicionar ao carrinho";

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
                {validPrice
                  ? formatCurrency(product.price)
                  : "Indisponível"}
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

            <div className="mt-6 space-y-2">
              {product.maxQuantityPerOrder != null ? (
                <p className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
                  Limite de {product.maxQuantityPerOrder}{" "}
                  {product.maxQuantityPerOrder === 1
                    ? "unidade"
                    : "unidades"}{" "}
                  deste produto por pedido.
                </p>
              ) : null}

              {quantityInCart > 0 ? (
                <p className="text-sm text-slate-600">
                  Você já tem{" "}
                  <strong>{quantityInCart}</strong>{" "}
                  {quantityInCart === 1
                    ? "unidade"
                    : "unidades"}{" "}
                  deste produto no carrinho.
                </p>
              ) : null}

              {quantityInCart > maximumQuantity ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  A quantidade no carrinho ultrapassa o estoque
                  ou o limite atual. Reduza a quantidade no carrinho
                  antes de finalizar.
                </p>
              ) : quantityInCart > 0 &&
                remainingQuantity === 0 &&
                !isOutOfStock ? (
                <p className="text-sm font-semibold text-amber-700">
                  Você já atingiu a quantidade máxima disponível
                  para este pedido.
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={!canAdd || selectedQuantity <= 1}
                  aria-label="Diminuir quantidade"
                  className="grid size-12 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-12 text-center font-bold text-slate-900">
                  {selectedQuantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={
                    !canAdd ||
                    selectedQuantity >= remainingQuantity
                  }
                  aria-label="Aumentar quantidade"
                  className="grid size-12 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                type="button"
                disabled={!canAdd}
                onClick={handleAddToCart}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                <ShoppingCart size={19} />
                {addButtonLabel}
              </button>
            </div>

            {feedback ? (
              <p
                role="status"
                className={`mt-4 rounded-xl border p-3 text-sm ${
                  feedback.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedback.message}
              </p>
            ) : null}

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