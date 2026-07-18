import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import { getProducts } from "../../api/productsApi";
import homeBanner from "../../assets/home-banner-desktop.png";
import { EmptyState } from "../../components/EmptyState";
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
  const parsedCategoryId = categoryIdParam
    ? Number(categoryIdParam)
    : undefined;

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

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
    scrollToTop();
  }

  if (categoriesQuery.isError) {
    return (
      <section className="space-y-8">
        <EmptyState
          title="Não foi possível carregar as categorias"
          description="Atualize a página e tente novamente."
        />
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-line/80 bg-white/5 shadow-inset">
        <img
          src={homeBanner}
          alt="JKCards - Pokémon TCG original"
          className="h-auto w-full object-contain sm:h-[240px] sm:object-cover lg:h-[320px]"
        />
      </div>

      <div>
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Somente itens disponíveis em estoque são exibidos.
        </p>
      </div>

      {categoriesQuery.isLoading || query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="shimmer h-72 rounded-xl border border-line/60 bg-white/5"
            />
          ))}
        </div>
      ) : null}

      {query.isError ? (
        <EmptyState
          title="Não foi possível carregar os produtos"
          description="Atualize a página e tente novamente."
        />
      ) : null}

      {query.data && query.data.content.length > 0 ? (
        <>
          <div className="grid animate-fade-in-up gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {query.data.content.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addItem}
              />
            ))}
          </div>

          <Pagination
            page={query.data.number}
            totalPages={query.data.totalPages}
            onChange={handlePageChange}
          />
        </>
      ) : null}

      {query.data && query.data.content.length === 0 ? (
        <EmptyState
          title="Nenhum produto disponível"
          description="Não encontramos produtos em estoque para os filtros selecionados."
        />
      ) : null}
    </section>
  );
}