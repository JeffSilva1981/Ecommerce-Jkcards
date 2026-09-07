import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import { getProducts } from "../../api/productsApi";
import { HomeHero } from "../../components/HomeHero";
import { Pagination } from "../../components/Pagination";
import { ProductCard } from "../../components/ProductCard";
import { useCartStore } from "../../stores/cartStore";
import type { ProductSummary } from "../../types/product";

type CartFeedback = {
  type: "success" | "error";
  message: string;
};

function normalizeCategoryName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function ProductsPage() {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name")?.trim() ?? "";
  const categoryIdParam = searchParams.get("categoryId");

  const parsedCategoryId = categoryIdParam
    ? Number(categoryIdParam)
    : undefined;

  const categoryId =
    parsedCategoryId !== undefined &&
    Number.isSafeInteger(parsedCategoryId) &&
    parsedCategoryId > 0
      ? parsedCategoryId
      : undefined;

  const [page, setPage] = useState(0);
  const [feedback, setFeedback] =
    useState<CartFeedback | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const cardCategory = useMemo(
    () =>
      categoriesQuery.data?.find((category) => {
        const normalizedName = normalizeCategoryName(
          category.name,
        );

        return (
          normalizedName === "carta" ||
          normalizedName === "cartas"
        );
      }),
    [categoriesQuery.data],
  );

  const categoryName =
    categoryId !== undefined
      ? categoriesQuery.data?.find(
          (category) => category.id === categoryId,
        )?.name ?? ""
      : "";

  const excludeCategoryId =
    categoryId === undefined
      ? cardCategory?.id
      : undefined;

  const query = useQuery({
    queryKey: [
      "store-products",
      name,
      categoryId,
      excludeCategoryId,
      page,
      true,
    ],

    queryFn: () =>
      getProducts({
        name,
        categoryId,
        excludeCategoryId,
        inStock: true,
        page,
        size: 8,
      }),

    enabled: categoriesQuery.isSuccess,
  });

  const title = useMemo(() => {
    if (name && categoryName) {
      return `Resultados para "${name}" em ${categoryName}`;
    }

    if (name) {
      return `Resultados para "${name}"`;
    }

    if (categoryName) {
      return `Produtos: ${categoryName}`;
    }

    return "Produtos em destaque";
  }, [categoryName, name]);

  useEffect(() => {
    setPage(0);
    setFeedback(null);
  }, [categoryId, name, excludeCategoryId]);

  function scrollToProducts() {
    document.getElementById("produtos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handlePageChange(nextPage: number) {
    if (
      !Number.isSafeInteger(nextPage) ||
      nextPage < 0
    ) {
      return;
    }

    if (
      query.data &&
      nextPage >= query.data.totalPages
    ) {
      return;
    }

    setPage(nextPage);
    setFeedback(null);
    scrollToProducts();
  }

  function handleAddProduct(product: ProductSummary) {
    const added = addItem(product, 1);

    setFeedback(
      added
        ? {
            type: "success",
            message: `${product.name}: uma unidade adicionada ao carrinho.`,
          }
        : {
            type: "error",
            message:
              `Não foi possível adicionar ${product.name}. ` +
              "Confira a disponibilidade, o estoque e o limite por pedido.",
          },
    );
  }

  function handleRetry() {
    if (categoriesQuery.isError) {
      void categoriesQuery.refetch();
      return;
    }

    void query.refetch();
  }

  const hasError =
    categoriesQuery.isError || query.isError;

  const isLoading =
    categoriesQuery.isLoading ||
    (categoriesQuery.isSuccess && query.isLoading);

  const canShowProducts =
    categoriesQuery.isSuccess &&
    query.isSuccess &&
    !hasError;

  const products = query.data?.content ?? [];

  return (
    <section>
      <HomeHero />

      <div className="relative left-1/2 w-screen -translate-x-1/2 border-t border-slate-200 bg-[#f4f7fb]">
        <div
          id="produtos"
          className="mx-auto max-w-7xl scroll-mt-56 px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="mb-8">
            <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Catálogo JKCards
            </span>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#00102D] md:text-4xl">
              {title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Somente produtos liberados para venda e com
              estoque são exibidos.
            </p>
          </div>

          {feedback ? (
            <div
              role="status"
              className={`mb-6 flex flex-col gap-3 rounded-xl border p-4 text-sm sm:flex-row sm:items-center sm:justify-between ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <p>{feedback.message}</p>

              <Link
                to="/carrinho"
                className="shrink-0 font-bold underline"
              >
                Ver carrinho
              </Link>
            </div>
          ) : null}

          {isLoading && !hasError ? (
            <div
              role="status"
              aria-label="Carregando produtos"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-[390px] animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-48 bg-slate-100" />

                  <div className="space-y-4 p-5">
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                    <div className="h-8 w-2/5 rounded bg-slate-200" />
                    <div className="h-11 w-full rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {hasError ? (
            <div
              role="alert"
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
            >
              <h3 className="text-xl font-black text-[#00102D]">
                {categoriesQuery.isError
                  ? "Não foi possível carregar as categorias"
                  : "Não foi possível carregar os produtos"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Tente novamente em alguns instantes.
              </p>

              <button
                type="button"
                disabled={
                  categoriesQuery.isFetching ||
                  query.isFetching
                }
                onClick={handleRetry}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          {canShowProducts && products.length > 0 ? (
            <>
              <div className="grid animate-fade-in-up gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddProduct}
                  />
                ))}
              </div>

              <div className="mt-10">
                <Pagination
                  page={query.data.number}
                  totalPages={query.data.totalPages}
                  onChange={handlePageChange}
                />
              </div>
            </>
          ) : null}

          {canShowProducts && products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-xl font-black text-[#00102D]">
                Nenhum produto disponível
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Não encontramos produtos disponíveis em
                estoque para os filtros selecionados.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}