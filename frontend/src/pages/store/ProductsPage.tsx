import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/productsApi";
import { EmptyState } from "../../components/EmptyState";
import { Input } from "../../components/Input";
import { Pagination } from "../../components/Pagination";
import { ProductCard } from "../../components/ProductCard";
import { useDebounce } from "../../hooks/useDebounce";
import { useCartStore } from "../../stores/cartStore";

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialName = searchParams.get("name") ?? "";
  const [name, setName] = useState(initialName);
  const [page, setPage] = useState(0);
  const debouncedName = useDebounce(name);
  const addItem = useCartStore((state) => state.addItem);

  const query = useQuery({
    queryKey: ["products", debouncedName, page],
    queryFn: () => getProducts({ name: debouncedName, page, size: 8 }),
  });

  const title = useMemo(
    () => (debouncedName ? `Resultados para "${debouncedName}"` : "Produtos"),
    [debouncedName],
  );

  function handleSearch(value: string) {
    setName(value);
    setPage(0);
    setSearchParams(value ? { name: value } : {});
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Cards, decks, sleeves e acessorios com uma experiencia feita para compra rapida.
          </p>
        </div>

        <div className="w-full md:max-w-sm">
          <Input
            label="Buscar produto"
            value={name}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Booster, deck, sleeve..."
          />
        </div>
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
            onChange={setPage}
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