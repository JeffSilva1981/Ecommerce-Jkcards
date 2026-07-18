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
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import {
  deleteProduct,
  getProducts,
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
  const [appliedSearch, setAppliedSearch] =
    useState("");
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

    queryFn: () =>
      getProducts({
        name: appliedSearch,
        categoryId: cardCategory?.id,
        page,
        size: PAGE_SIZE,
      }),

    enabled: Boolean(cardCategory),
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

      await queryClient.invalidateQueries({
        queryKey: ["admin-cards"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setDeletingCardId(null);

      alert("Carta excluída com sucesso.");
    },

    onError: (error) => {
      console.error(
        "Erro ao excluir carta:",
        error,
      );

      setDeletingCardId(null);

      alert(
        "Não foi possível excluir a carta.",
      );
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

  const cards =
    cardsQuery.data?.content ?? [];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Cartas Pokémon
          </h1>

          <p className="mt-2 text-sm text-slate-400">
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

      <Panel className="p-5">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar carta pelo nome..."
              className="h-11 w-full rounded-md border border-line bg-ink/70 px-4 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-skybrand focus:ring-2 focus:ring-skybrand/20"
            />

            <Search
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>

          <Button
            type="submit"
            icon={<Search size={17} />}
            disabled={cardsQuery.isFetching}
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
          <p className="mt-3 text-sm text-slate-400">
            Resultados para:{" "}
            <strong className="text-white">
              {appliedSearch}
            </strong>
          </p>
        ) : null}
      </Panel>

      {!categoriesQuery.isLoading &&
      !cardCategory ? (
        <p className="rounded-md border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
          A categoria Carta ou Cartas não foi encontrada.
          Crie essa categoria antes de cadastrar cartas.
        </p>
      ) : null}

      <Panel className="overflow-hidden">
        {categoriesQuery.isLoading ||
        cardsQuery.isLoading ? (
          <div className="p-6 text-sm text-slate-400">
            Carregando cartas...
          </div>
        ) : null}

        {categoriesQuery.isError ||
        cardsQuery.isError ? (
          <div className="p-6">
            <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Não foi possível carregar as cartas.
            </p>
          </div>
        ) : null}

        {cardCategory &&
        !cardsQuery.isLoading &&
        !cardsQuery.isError &&
        cards.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-white">
              Nenhuma carta encontrada
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Ajuste a busca ou cadastre uma nova carta.
            </p>
          </div>
        ) : null}

        {cards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-line bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3">
                    Carta
                  </th>

                  <th className="px-4 py-3">
                    Preço
                  </th>

                  <th className="px-4 py-3">
                    Estoque
                  </th>

                  <th className="px-4 py-3">
                    Imagem
                  </th>

                  <th className="px-4 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {cards.map((card) => {
                  const stockQuantity =
                    card.stockQuantity ?? 0;

                  const isOutOfStock =
                    stockQuantity === 0;

                  const isDeleting =
                    deleteMutation.isPending &&
                    deletingCardId === card.id;

                  return (
                    <tr
                      key={card.id}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {card.name}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gold">
                        {formatCurrency(card.price)}
                      </td>

                      <td className="px-4 py-3">
                        {isOutOfStock ? (
                          <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs font-semibold text-red-200">
                            Esgotada
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                            {stockQuantity} em estoque
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex h-16 w-12 items-center justify-center overflow-hidden rounded bg-white p-1">
                          {card.imgUrl ? (
                            <img
                              src={card.imgUrl}
                              alt={card.name}
                              loading="lazy"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              Sem imagem
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/produtos/${card.id}`}
                          >
                            <Button
                              variant="secondary"
                              icon={<Edit size={15} />}
                              disabled={
                                deleteMutation.isPending
                              }
                            >
                              Editar
                            </Button>
                          </Link>

                          <Button
                            variant="danger"
                            icon={<Trash2 size={15} />}
                            disabled={
                              deleteMutation.isPending
                            }
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

      {cardsQuery.data ? (
        <Pagination
          page={cardsQuery.data.number}
          totalPages={
            cardsQuery.data.totalPages
          }
          onChange={handlePageChange}
        />
      ) : null}
    </section>
  );
}