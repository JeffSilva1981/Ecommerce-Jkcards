import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Save } from "lucide-react";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import { saveProduct } from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { PokemonCardSelector } from "../../components/PokemonCardSelector";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import {
  productSchema,
  type ProductSchema,
} from "../../schemas/productSchema";
import type { SelectedPokemonCard } from "../../types/pokemonCard";

type CardCondition =
  | "NM"
  | "SP"
  | "MP"
  | "HP"
  | "D";

type CardType =
  | "Normal"
  | "Reverse"
  | "Foil"
  | "Full Art"
  | "Secreta"
  | "Ultra Rara"
  | "Promo";

function normalizeCategoryName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function createCardDescription(
  card: SelectedPokemonCard,
  condition: CardCondition,
  cardType: CardType,
) {
  const details = [
    `Carta Pokémon: ${card.name}`,
    `Coleção: ${card.setName}`,
    `Número: ${card.localId}`,
    card.rarity
      ? `Raridade: ${card.rarity}`
      : null,
    `Condição: ${condition}`,
    `Tipo: ${cardType}`,
    card.illustrator
      ? `Ilustrador: ${card.illustrator}`
      : null,
    card.description
      ? `Descrição original: ${card.description}`
      : null,
    `ID do catálogo: ${card.externalId}`,
  ];

  return details.filter(Boolean).join("\n");
}

function replaceDescriptionField(
  description: string,
  fieldName: string,
  value: string,
) {
  const fieldLine = `${fieldName}: ${value}`;
  const lines = description
    .split("\n")
    .map((line) => line.trimEnd());

  const normalizedFieldName = normalizeCategoryName(
    `${fieldName}:`,
  );

  const fieldIndex = lines.findIndex((line) =>
    normalizeCategoryName(line).startsWith(
      normalizedFieldName,
    ),
  );

  if (fieldIndex >= 0) {
    lines[fieldIndex] = fieldLine;
    return lines.join("\n");
  }

  const catalogIdIndex = lines.findIndex((line) =>
    normalizeCategoryName(line).startsWith(
      "id do catalogo:",
    ),
  );

  if (catalogIdIndex >= 0) {
    lines.splice(
      catalogIdIndex,
      0,
      fieldLine,
    );

    return lines.join("\n");
  }

  if (!description.trim()) {
    return fieldLine;
  }

  return `${description.trim()}\n${fieldLine}`;
}

export function CardFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedCard, setSelectedCard] =
    useState<SelectedPokemonCard | null>(null);

  const [condition, setCondition] =
    useState<CardCondition>("NM");

  const [cardType, setCardType] =
    useState<CardType>("Normal");

  const [cardCategoryError, setCardCategoryError] =
    useState<string | null>(null);

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      imgUrl: "",
      categoryId: 0,
    },
  });

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

  useEffect(() => {
    if (!cardCategory) {
      return;
    }

    form.setValue(
      "categoryId",
      cardCategory.id,
      {
        shouldValidate: true,
      },
    );

    setCardCategoryError(null);
  }, [cardCategory, form]);

  const mutation = useMutation({
    mutationFn: (values: ProductSchema) =>
      saveProduct({
        name: values.name,
        description: values.description,
        price: values.price,
        stockQuantity: values.stockQuantity,
        imgUrl: values.imgUrl,
        categories: [
          {
            id: values.categoryId,
          },
        ],
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["admin-cards"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["store-products"],
        }),
      ]);

      alert("Carta cadastrada com sucesso.");

      navigate("/admin/cartas");
    },

    onError: (error) => {
      console.error(
        "Erro ao cadastrar carta:",
        error,
      );

      alert(
        "Não foi possível cadastrar a carta.",
      );
    },
  });

  function handleCardSelected(
    card: SelectedPokemonCard,
  ) {
    setSelectedCard(card);
    setCardCategoryError(null);

    form.setValue("name", card.name, {
      shouldValidate: true,
      shouldDirty: true,
    });

    form.setValue(
      "description",
      createCardDescription(
        card,
        condition,
        cardType,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    form.setValue("imgUrl", card.imageUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (cardCategory) {
      form.setValue(
        "categoryId",
        cardCategory.id,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }
  }

  function handleConditionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const newCondition =
      event.target.value as CardCondition;

    setCondition(newCondition);

    const currentDescription =
      form.getValues("description");

    form.setValue(
      "description",
      replaceDescriptionField(
        currentDescription,
        "Condição",
        newCondition,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  function handleCardTypeChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const newCardType =
      event.target.value as CardType;

    setCardType(newCardType);

    const currentDescription =
      form.getValues("description");

    form.setValue(
      "description",
      replaceDescriptionField(
        currentDescription,
        "Tipo",
        newCardType,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  function handleSubmit(values: ProductSchema) {
    setCardCategoryError(null);

    if (!selectedCard) {
      alert(
        "Pesquise e selecione uma carta antes de salvar.",
      );
      return;
    }

    if (!cardCategory) {
      setCardCategoryError(
        'Crie uma categoria chamada "Cartas" antes de cadastrar cartas.',
      );
      return;
    }

    const descriptionWithCondition =
      replaceDescriptionField(
        values.description,
        "Condição",
        condition,
      );

    const completeDescription =
      replaceDescriptionField(
        descriptionWithCondition,
        "Tipo",
        cardType,
      );

    mutation.mutate({
      ...values,
      description: completeDescription,
      categoryId: cardCategory.id,
    });
  }

  const priceError =
    form.formState.errors.price?.message;

  const stockError =
    form.formState.errors.stockQuantity?.message;

  const descriptionError =
    form.formState.errors.description?.message;

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Nova carta Pokémon
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Pesquise no catálogo, selecione a carta e
          informe os dados comerciais.
        </p>
      </div>

      <PokemonCardSelector
        selectedCard={selectedCard}
        onSelect={handleCardSelected}
      />

      {selectedCard ? (
        <Panel
          id="card-sale-data"
          className="scroll-mt-28 p-5"
        >
          <div>
            <h2 className="text-xl font-bold text-white">
              Dados para venda
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Informe a condição, o tipo, o preço, o
              estoque e as observações da carta.
            </p>
          </div>

          <form
            className="mt-5 space-y-5"
            onSubmit={form.handleSubmit(
              handleSubmit,
              (errors) => {
                console.error(
                  "Dados inválidos:",
                  errors,
                );
              },
            )}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nome"
                readOnly
                error={
                  form.formState.errors.name?.message
                }
                {...form.register("name")}
              />

              <Input
                label="Categoria"
                value={
                  cardCategory?.name ??
                  "Categoria Cartas não encontrada"
                }
                readOnly
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Condição"
                value={condition}
                onChange={handleConditionChange}
              >
                <option value="NM">
                  NM — Near Mint
                </option>

                <option value="SP">
                  SP — Slightly Played
                </option>

                <option value="MP">
                  MP — Moderately Played
                </option>

                <option value="HP">
                  HP — Heavily Played
                </option>

                <option value="D">
                  D — Damaged
                </option>
              </Select>

              <Select
                label="Tipo da carta"
                value={cardType}
                onChange={handleCardTypeChange}
              >
                <option value="Normal">
                  Normal
                </option>

                <option value="Reverse">
                  Reverse
                </option>

                <option value="Foil">
                  Foil
                </option>

                <option value="Full Art">
                  Full Art
                </option>

                <option value="Secreta">
                  Secreta
                </option>

                <option value="Ultra Rara">
                  Ultra Rara
                </option>

                <option value="Promo">
                  Promo
                </option>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Preço"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                error={priceError}
                {...form.register("price")}
              />

              <Input
                label="Estoque"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                error={stockError}
                {...form.register("stockQuantity")}
              />
            </div>

            <Textarea
              label="Descrição e observações"
              rows={12}
              error={descriptionError}
              {...form.register("description")}
            />

            <p className="-mt-3 text-xs text-slate-500">
              Você pode alterar livremente a descrição e
              adicionar detalhes sobre riscos, bordas,
              dobras ou outras marcas da carta.
            </p>

            <input
              type="hidden"
              {...form.register("imgUrl")}
            />

            <input
              type="hidden"
              {...form.register("categoryId")}
            />

            {selectedCard.imageUrl ? (
              <div className="rounded-lg border border-line bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Imagem externa
                </p>

                <p className="mt-2 break-all text-sm text-slate-300">
                  {selectedCard.imageUrl}
                </p>
              </div>
            ) : null}

            {categoriesQuery.isLoading ? (
              <p className="rounded-md border border-skybrand/30 bg-skybrand/10 p-3 text-sm text-skysoft">
                Carregando a categoria da carta...
              </p>
            ) : null}

            {categoriesQuery.isError ? (
              <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
                Não foi possível carregar as categorias.
              </p>
            ) : null}

            {!categoriesQuery.isLoading &&
            !cardCategory ? (
              <p className="rounded-md border border-yellow-400/30 bg-yellow-400/10 p-3 text-sm text-yellow-200">
                A categoria Carta ou Cartas não foi
                encontrada. Crie essa categoria antes de
                cadastrar a carta.
              </p>
            ) : null}

            {cardCategoryError ? (
              <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
                {cardCategoryError}
              </p>
            ) : null}

            {mutation.isError ? (
              <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
                Não foi possível salvar a carta.
              </p>
            ) : null}

            <Button
              type="submit"
              icon={<Save size={17} />}
              disabled={
                mutation.isPending ||
                categoriesQuery.isLoading ||
                !selectedCard
              }
            >
              {mutation.isPending
                ? "Salvando..."
                : "Cadastrar carta"}
            </Button>
          </form>
        </Panel>
      ) : null}
    </section>
  );
}