import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/productsApi";
import homeBanner from "../../assets/home-banner-desktop.png";
import { EmptyState } from "../../components/EmptyState";
import { Pagination } from "../../components/Pagination";
import { ProductCard } from "../../components/ProductCard";
import { useCartStore } from "../../stores/cartStore";

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const [page, setPage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const query = useQuery({
    queryKey: ["products", name, page],
    queryFn: () => getProducts({ name, page, size: 8 }),
  });

  const title = useMemo(
    () => (name ? `Resultados para "${name}"` : "Produtos em destaque"),
    [name],
  );

  useEffect(() => {
    setPage(0);
  }, [name]);

  function scrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    scrollToTop();
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
      </div>

      {query.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="shimmer h-72 rounded-xl border border-line/60 bg-white/5"
            />
          ))}
        </div>
      ) : null}

      {query.data && query.data.content.length > 0 ? (
        <>
          <div className="grid animate-fade-in-up gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {query.data.content.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addItem} />
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
          title="Nenhum produto encontrado"
          description="Tente ajustar a busca ou voltar para a vitrine completa."
        />
      ) : null}
    </section>
  );
}