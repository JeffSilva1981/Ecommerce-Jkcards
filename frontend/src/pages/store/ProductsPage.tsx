import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import { getProducts } from "../../api/productsApi";
import { EmptyState } from "../../components/EmptyState";
import { HomeHero } from "../../components/HomeHero";
import { Pagination } from "../../components/Pagination";
import { ProductCard } from "../../components/ProductCard";
import { useCartStore } from "../../stores/cartStore";

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
  const parsedCategoryId = categoryIdParam ? Number(categoryIdParam) : undefined;

  const categoryId =
    parsedCategoryId !== undefined && Number.isFinite(parsedCategoryId)
      ? parsedCategoryId
      : undefined;

  const categoryName = searchParams.get("categoryName") ?? "";
  const [page, setPage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const cardCategory = useMemo(() => {
    return categoriesQuery.data?.find((category) => {
      const normalizedName = normalizeCategoryName(category.name);

      return normalizedName === "carta" || normalizedName === "cartas";
    });
  }, [categoriesQuery.data]);

  const excludeCategoryId =
    categoryId === undefined ? cardCategory?.id : undefined;

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
  }, [categoryId, name]);

  function scrollToProducts() {
    document.getElementById("produtos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handlePageChange(nextPage: number) {
    if (nextPage < 0) {
      return;
    }

    if (
      query.data &&
      query.data.totalPages > 0 &&
      nextPage >= query.data.totalPages
    ) {
      return;
    }

    setPage(nextPage);
    scrollToProducts();
  }

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
              Somente itens disponíveis em estoque são exibidos.
            </p>
          </div>

          {categoriesQuery.isLoading || query.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[390px] animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
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

          {categoriesQuery.isError ? (
            <EmptyState
              title="Não foi possível carregar as categorias"
              description="Verifique se o backend está funcionando e tente novamente."
            />
          ) : null}

          {query.isError ? (
            <EmptyState
              title="Não foi possível carregar os produtos"
              description="Atualize a página e tente novamente."
            />
          ) : null}

          {query.data && query.data.content.length > 0 ? (
            <>
              <div className="grid animate-fade-in-up gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {query.data.content.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addItem}
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

          {query.data && query.data.content.length === 0 ? (
            <EmptyState
              title="Nenhum produto disponível"
              description="Não encontramos produtos em estoque para os filtros selecionados."
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}