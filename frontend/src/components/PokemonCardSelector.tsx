import {
  Check,
  ImageOff,
  LoaderCircle,
  Plus,
  Search,
} from "lucide-react";
import {
  type FormEvent,
  useState,
} from "react";
import {
  getPokemonCardThumbnail,
  POKEMON_CARDS_PAGE_SIZE,
  searchPokemonCards,
  selectPokemonCard,
} from "../api/pokemonCardsApi";
import type {
  PokemonCardSearchResult,
  SelectedPokemonCard,
} from "../types/pokemonCard";
import { Button } from "./Button";
import { Panel } from "./Panel";

type PokemonCardSelectorProps = {
  selectedCard: SelectedPokemonCard | null;
  onSelect: (card: SelectedPokemonCard) => void;
};

export function PokemonCardSelector({
  selectedCard,
  onSelect,
}: PokemonCardSelectorProps) {
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [results, setResults] =
    useState<PokemonCardSearchResult[]>([]);

  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectingId, setSelectingId] =
    useState<string | null>(null);

  const [hasSearched, setHasSearched] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedSearch = search.trim();

    if (normalizedSearch.length < 2) {
      setError("Digite pelo menos 2 caracteres para pesquisar.");
      return;
    }

    try {
      setSearching(true);
      setError(null);
      setHasSearched(true);
      setShowResults(true);
      setActiveSearch(normalizedSearch);
      setPage(1);

      const cards = await searchPokemonCards(
        normalizedSearch,
        1,
      );

      setResults(cards);
      setHasMore(cards.length === POKEMON_CARDS_PAGE_SIZE);
    } catch (requestError) {
      console.error("Erro ao pesquisar cartas:", requestError);

      setResults([]);
      setHasMore(false);
      setError("Não foi possível pesquisar as cartas agora.");
    } finally {
      setSearching(false);
    }
  }

  async function handleLoadMore() {
    if (
      loadingMore ||
      !hasMore ||
      !activeSearch
    ) {
      return;
    }

    const nextPage = page + 1;

    try {
      setLoadingMore(true);
      setError(null);

      const newCards = await searchPokemonCards(
        activeSearch,
        nextPage,
      );

      setResults((currentResults) => {
        const cardIds = new Set(
          currentResults.map((card) => card.id),
        );

        const uniqueNewCards = newCards.filter(
          (card) => !cardIds.has(card.id),
        );

        return [...currentResults, ...uniqueNewCards];
      });

      setPage(nextPage);
      setHasMore(
        newCards.length === POKEMON_CARDS_PAGE_SIZE,
      );
    } catch (requestError) {
      console.error(
        "Erro ao carregar mais cartas:",
        requestError,
      );

      setError("Não foi possível carregar mais cartas.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSelect(cardId: string) {
    try {
      setSelectingId(cardId);
      setError(null);

      const card = await selectPokemonCard(cardId);

      onSelect(card);

      setShowResults(false);
      setResults([]);
      setHasSearched(false);
      setHasMore(false);

      setTimeout(() => {
        document
          .getElementById("card-sale-data")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 150);
    } catch (requestError) {
      console.error("Erro ao carregar a carta:", requestError);

      setError(
        "Não foi possível carregar os detalhes da carta.",
      );
    } finally {
      setSelectingId(null);
    }
  }

  function handleChangeCard() {
    setShowResults(true);
    setHasSearched(false);
    setResults([]);
    setSearch("");
    setActiveSearch("");
    setPage(1);
    setHasMore(false);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <Panel className="p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-black text-[#00102D]">
            Buscar no catálogo Pokémon
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Pesquise pelo nome e carregue quantas
            versões forem necessárias.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <input
              aria-label="Nome da carta Pokémon"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Ex.: Pikachu, Charizard, Mew..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />

            <Search
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <Button
            type="submit"
            icon={
              searching ? (
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Search size={17} />
              )
            }
            disabled={searching || loadingMore}
          >
            {searching ? "Buscando..." : "Buscar"}
          </Button>
        </form>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}
      </Panel>

      {selectedCard ? (
        <Panel className="border-sky-200 bg-sky-50 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex h-64 w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 sm:w-48">
              {selectedCard.imageUrl ? (
                <img
                  src={selectedCard.imageUrl}
                  alt={selectedCard.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <ImageOff
                  size={32}
                  className="text-slate-400"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Check size={14} />
                Carta selecionada
              </div>

              <h3 className="mt-4 text-2xl font-black text-[#00102D]">
                {selectedCard.name}
              </h3>

              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">
                    Coleção
                  </dt>
                  <dd className="mt-1 font-semibold text-[#00102D]">
                    {selectedCard.setName}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    Número
                  </dt>
                  <dd className="mt-1 font-semibold text-[#00102D]">
                    {selectedCard.localId}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    Raridade
                  </dt>
                  <dd className="mt-1 font-semibold text-[#00102D]">
                    {selectedCard.rarity ?? "Não informada"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    ID externo
                  </dt>
                  <dd className="mt-1 break-all font-semibold text-[#00102D]">
                    {selectedCard.externalId}
                  </dd>
                </div>
              </dl>

              <Button
                type="button"
                variant="secondary"
                className="mt-5"
                onClick={handleChangeCard}
              >
                Escolher outra carta
              </Button>
            </div>
          </div>
        </Panel>
      ) : null}

      {hasSearched &&
      !searching &&
      showResults &&
      results.length === 0 &&
      !error ? (
        <Panel className="p-8 text-center">
          <p className="font-bold text-[#00102D]">
            Nenhuma carta encontrada
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Tente pesquisar outro nome.
          </p>
        </Panel>
      ) : null}

      {showResults && results.length > 0 ? (
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#00102D]">
                Resultados
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {results.length} carta(s) carregada(s).
              </p>
            </div>

            {hasMore ? (
              <p className="text-xs text-slate-500">
                Existem mais resultados disponíveis.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((card) => {
              const thumbnail =
                getPokemonCardThumbnail(card.image);

              const isSelecting = selectingId === card.id;

              return (
                <Panel
                  key={card.id}
                  className="flex flex-col overflow-hidden transition hover:border-sky-300 hover:shadow-md"
                >
                  <div className="flex h-64 items-center justify-center border-b border-slate-100 bg-slate-50 p-3">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={card.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageOff
                        size={32}
                        className="text-slate-400"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-bold text-[#00102D]">
                      {card.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Número: {card.localId}
                    </p>

                    <div className="mt-auto pt-4">
                      <Button
                        type="button"
                        className="w-full"
                        disabled={Boolean(selectingId)}
                        icon={
                          isSelecting ? (
                            <LoaderCircle
                              size={16}
                              className="animate-spin"
                            />
                          ) : undefined
                        }
                        onClick={() => handleSelect(card.id)}
                      >
                        {isSelecting
                          ? "Carregando..."
                          : "Selecionar"}
                      </Button>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>

          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="secondary"
                icon={
                  loadingMore ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Plus size={17} />
                  )
                }
                disabled={loadingMore || searching}
                onClick={handleLoadMore}
              >
                {loadingMore
                  ? "Carregando..."
                  : "Carregar mais cartas"}
              </Button>
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-slate-500">
              Todos os resultados foram carregados.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}