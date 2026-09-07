import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Edit,
  PlusCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import {
  deleteProduct,
  getProductsAdmin,
} from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { Panel } from "../../components/Panel";
import { formatCurrency } from "../../utils/currency";

const PAGE_SIZE = 12;

function normalizeCategoryName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function CardsAdminPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);

  const [deletingCardId, setDeletingCardId] =
    useState<number | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const cardCategory =
    categoriesQuery.data?.find((category) => {
      const normalizedName = normalizeCategoryName(
        category.name,
      );

      return (
        normalizedName === "carta" ||
        normalizedName === "cartas"
      );
    }) ?? null;

  const cardsQuery = useQuery({
    queryKey: [
      "admin-cards",
      appliedSearch,
      cardCategory?.id,
      page,
    ],

    queryFn: () => {
      if (!cardCategory) {
        throw new Error("Categoria de cartas não encontrada.");
      }

      return getProductsAdmin({
        name: appliedSearch,
        categoryId: cardCategory.id,
        page,
        size: PAGE_SIZE,
      });
    },

    enabled:
      categoriesQuery.isSuccess && Boolean(cardCategory),
  });

  useEffect(() => {
    setPage(0);
  }, [appliedSearch, cardCategory?.id]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: async () => {
      if (
        cardsQuery.data?.content.length === 1 &&
        page > 0
      ) {
        setPage((currentPage) =>
          Math.max(currentPage - 1, 0),
        );
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-cards"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["store-products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      alert("Carta excluída com sucesso.");
    },

    onError: (error) => {
      console.error("Erro ao excluir carta:", error);
      alert("Não foi possível excluir a carta.");
    },

    onSettled: () => {
      setDeletingCardId(null);
    },
  });

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setAppliedSearch(search.trim());
    setPage(0);
  }

  function handleClearSearch() {
    setSearch("");
    setAppliedSearch("");
    setPage(0);
  }

  function handleDeleteCard(
    id: number,
    name: string,
  ) {
    if (deleteMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja realmente excluir a carta "${name}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingCardId(id);
    deleteMutation.mutate(id);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleRetry() {
    if (categoriesQuery.isError) {
      void categoriesQuery.refetch();
      return;
    }

    if (cardCategory) {
      void cardsQuery.refetch();
    }
  }

  const cards = cardsQuery.data?.content ?? [];

  const hasError =
    categoriesQuery.isError ||
    (Boolean(cardCategory) && cardsQuery.isError);

  const isLoading =
    categoriesQuery.isLoading ||
    (categoriesQuery.isSuccess &&
      Boolean(cardCategory) &&
      cardsQuery.isLoading);

  const canShowCards =
    categoriesQuery.isSuccess &&
    Boolean(cardCategory) &&
    cardsQuery.isSuccess &&
    !hasError;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#00102D]">
            Cartas Pokémon
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Gerencie somente as cartas cadastradas no
            estoque da loja.
          </p>
        </div>

        <Link to="/admin/cartas/nova">
          <Button
            icon={<PlusCircle size={17} />}
            className="w-full sm:w-auto"
          >
            Nova carta Pokémon
          </Button>
        </Link>
      </div>

      <Panel className="p-5 sm:p-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              aria-label="Buscar carta pelo nome"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar carta pelo nome..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />

            <Search
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <Button
            type="submit"
            icon={<Search size={17} />}
            disabled={
              cardsQuery.isFetching ||
              categoriesQuery.isFetching ||
              !cardCategory
            }
          >
            Buscar
          </Button>

          {appliedSearch ? (
            <Button
              type="button"
              variant="secondary"
              icon={<X size={17} />}
              onClick={handleClearSearch}
            >
              Limpar
            </Button>
          ) : null}
        </form>

        {appliedSearch ? (
          <p className="mt-3 text-sm text-slate-500">
            Resultados para:{" "}
            <strong className="text-[#00102D]">
              {appliedSearch}
            </strong>
          </p>
        ) : null}

        <p className="mt-4 text-sm leading-6 text-slate-500">
          Esta listagem inclui cartas disponíveis e ocultas.
          Cartas ocultas continuam no estoque e nos valores
          do dashboard. Use Editar para liberar a venda ou
          alterar o limite por pedido.
        </p>
      </Panel>

      {categoriesQuery.isSuccess && !cardCategory ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          A categoria Carta ou Cartas não foi encontrada.
          Crie essa categoria antes de cadastrar cartas.
        </p>
      ) : null}

      {isLoading || hasError || canShowCards ? (
        <Panel className="overflow-hidden">
          {isLoading && !hasError ? (
            <div className="p-6 text-sm text-slate-500">
              Carregando cartas...
            </div>
          ) : null}

          {hasError ? (
            <div className="space-y-4 p-6">
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                Não foi possível carregar as cartas.
              </p>

              <Button
                type="button"
                variant="secondary"
                onClick={handleRetry}
                disabled={
                  categoriesQuery.isFetching ||
                  cardsQuery.isFetching
                }
              >
                Tentar novamente
              </Button>
            </div>
          ) : null}

          {canShowCards && cards.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-bold text-[#00102D]">
                Nenhuma carta encontrada
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Ajuste a busca ou cadastre uma nova carta.
              </p>
            </div>
          ) : null}

          {canShowCards && cards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="px-4 py-4">
                      Carta
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Preço
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Estoque
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Disponibilidade
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Limite por pedido
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Imagem
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 text-right"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cards.map((card) => {
                    const stockQuantity =
                      card.stockQuantity ?? 0;

                    const isOutOfStock = stockQuantity <= 0;

                    const isDeleting =
                      deleteMutation.isPending &&
                      deletingCardId === card.id;

                    return (
                      <tr
                        key={card.id}
                        className="border-b border-slate-100 transition last:border-b-0 hover:bg-sky-50/50"
                      >
                        <td className="px-4 py-4 font-semibold text-[#00102D]">
                          {card.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-bold text-[#00102D]">
                          {formatCurrency(card.price)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {isOutOfStock ? (
                            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              Esgotada
                            </span>
                          ) : (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              {stockQuantity} em estoque
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          {card.available ? (
                            <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                              Disponível
                            </span>
                          ) : (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                              Oculta
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {card.maxQuantityPerOrder == null
                            ? "Sem limite"
                            : `${card.maxQuantityPerOrder} ${
                                card.maxQuantityPerOrder === 1
                                  ? "unidade"
                                  : "unidades"
                              }`}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex h-16 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                            {card.imgUrl ? (
                              <img
                                src={card.imgUrl}
                                alt={card.name}
                                loading="lazy"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <span className="text-center text-[10px] text-slate-400">
                                Sem imagem
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/produtos/${card.id}`}
                              aria-disabled={
                                deleteMutation.isPending
                              }
                              tabIndex={
                                deleteMutation.isPending
                                  ? -1
                                  : undefined
                              }
                              onClick={(event) => {
                                if (deleteMutation.isPending) {
                                  event.preventDefault();
                                }
                              }}
                            >
                              <Button
                                variant="secondary"
                                icon={<Edit size={15} />}
                                disabled={deleteMutation.isPending}
                              >
                                Editar
                              </Button>
                            </Link>

                            <Button
                              variant="danger"
                              icon={<Trash2 size={15} />}
                              disabled={deleteMutation.isPending}
                              onClick={() =>
                                handleDeleteCard(
                                  card.id,
                                  card.name,
                                )
                              }
                            >
                              {isDeleting
                                ? "Excluindo..."
                                : "Excluir"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </Panel>
      ) : null}

      {canShowCards && cardsQuery.data ? (
        <Pagination
          page={cardsQuery.data.number}
          totalPages={cardsQuery.data.totalPages}
          onChange={handlePageChange}
        />
      ) : null}
    </section>
  );
}