import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Save } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { getCategories } from "../../api/categoriesApi";
import { saveProduct } from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { PokemonCardSelector } from "../../components/PokemonCardSelector";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import { productSchema } from "../../schemas/productSchema";
import type { SelectedPokemonCard } from "../../types/pokemonCard";

type CardCondition = "NM" | "SP" | "MP" | "HP" | "D";

type CardType =
  | "Normal"
  | "Reverse"
  | "Foil"
  | "Full Art"
  | "Secreta"
  | "Ultra Rara"
  | "Promo";

type CardLanguage = "Português" | "Inglês" | "Japonês";

const cardFormSchema = productSchema.extend({
  available: z.boolean(),
  maxQuantityPerOrder: z
    .number()
    .int("O limite precisa ser um número inteiro.")
    .min(0, "O limite não pode ser negativo.")
    .max(2147483647, "O limite informado é muito alto."),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

const DEFAULT_CARD_PACKAGE = {
  weight: 0.05,
  width: 11,
  height: 2,
  length: 16,
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function createCardDescription(
  card: SelectedPokemonCard,
  condition: CardCondition,
  cardType: CardType,
  language: CardLanguage,
) {
  return [
    `Carta Pokémon: ${card.name}`,
    `Coleção: ${card.setName}`,
    `Número: ${card.localId}`,
    card.rarity ? `Raridade: ${card.rarity}` : null,
    `Condição: ${condition}`,
    `Tipo: ${cardType}`,
    `Idioma: ${language}`,
    card.illustrator
      ? `Ilustrador: ${card.illustrator}`
      : null,
    card.description
      ? `Descrição original: ${card.description}`
      : null,
    `ID do catálogo: ${card.externalId}`,
  ]
    .filter(Boolean)
    .join("\n");
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

  const field = normalizeText(`${fieldName}:`);
  const fieldIndex = lines.findIndex((line) =>
    normalizeText(line).startsWith(field),
  );

  if (fieldIndex >= 0) {
    lines[fieldIndex] = fieldLine;
    return lines.join("\n");
  }

  const catalogIndex = lines.findIndex((line) =>
    normalizeText(line).startsWith("id do catalogo:"),
  );

  if (catalogIndex >= 0) {
    lines.splice(catalogIndex, 0, fieldLine);
    return lines.join("\n");
  }

  return description.trim()
    ? `${description.trim()}\n${fieldLine}`
    : fieldLine;
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

  const [language, setLanguage] =
    useState<CardLanguage>("Português");

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      imgUrl: "",
      categoryId: 0,
      available: true,
      maxQuantityPerOrder: 0,
      ...DEFAULT_CARD_PACKAGE,
    },
  });

  const available = form.watch("available");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const cardCategory =
    categoriesQuery.data?.find((category) => {
      const name = normalizeText(category.name);
      return name === "carta" || name === "cartas";
    }) ?? null;

  useEffect(() => {
    form.setValue("categoryId", cardCategory?.id ?? 0, {
      shouldValidate: Boolean(cardCategory),
    });
  }, [cardCategory, form]);

  const mutation = useMutation({
    mutationFn: (values: CardFormValues) =>
      saveProduct({
        name: values.name,
        description: values.description,
        price: values.price,
        stockQuantity: values.stockQuantity,
        imgUrl: values.imgUrl,
        weight: values.weight,
        width: values.width,
        height: values.height,
        length: values.length,
        available: values.available,
        maxQuantityPerOrder:
          values.maxQuantityPerOrder === 0
            ? null
            : values.maxQuantityPerOrder,
        categories: [{ id: values.categoryId }],
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
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);

      alert("Carta cadastrada com sucesso.");
      navigate("/admin/cartas");
    },

    onError: (error) => {
      console.error("Erro ao cadastrar carta:", error);
      alert("Não foi possível cadastrar a carta.");
    },
  });

  function handleCardSelected(card: SelectedPokemonCard) {
    if (mutation.isPending) {
      return;
    }

    setSelectedCard(card);
    mutation.reset();

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
        language,
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
      form.setValue("categoryId", cardCategory.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  function updateDescriptionField(
    field: string,
    value: string,
  ) {
    form.setValue(
      "description",
      replaceDescriptionField(
        form.getValues("description"),
        field,
        value,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  function handleConditionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value as CardCondition;
    setCondition(value);
    updateDescriptionField("Condição", value);
  }

  function handleCardTypeChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value as CardType;
    setCardType(value);
    updateDescriptionField("Tipo", value);
  }

  function handleLanguageChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value as CardLanguage;
    setLanguage(value);
    updateDescriptionField("Idioma", value);
  }

  function handleSubmit(values: CardFormValues) {
    if (mutation.isPending) {
      return;
    }

    if (!selectedCard) {
      alert("Pesquise e selecione uma carta antes de salvar.");
      return;
    }

    if (!categoriesQuery.isSuccess || !cardCategory) {
      alert(
        'Carregue uma categoria chamada "Carta" ou "Cartas" antes de cadastrar.',
      );
      return;
    }

    let description = replaceDescriptionField(
      values.description,
      "Condição",
      condition,
    );

    description = replaceDescriptionField(
      description,
      "Tipo",
      cardType,
    );

    description = replaceDescriptionField(
      description,
      "Idioma",
      language,
    );

    // Valida novamente após atualizar os campos da descrição.
    const result = cardFormSchema.safeParse({
      ...values,
      description,
      categoryId: cardCategory.id,
      ...DEFAULT_CARD_PACKAGE,
    });

    if (!result.success) {
      const descriptionIssue = result.error.issues.find(
        (issue) => issue.path[0] === "description",
      );

      if (descriptionIssue) {
        form.setError(
          "description",
          {
            type: "manual",
            message: descriptionIssue.message,
          },
          { shouldFocus: true },
        );
      } else {
        alert(
          result.error.issues[0]?.message ??
            "Revise os dados antes de salvar.",
        );
      }

      return;
    }

    mutation.mutate(result.data);
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#00102D]">
          Nova carta Pokémon
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Pesquise no catálogo, selecione a carta e informe
          os dados comerciais.
        </p>
      </div>

      <PokemonCardSelector
        selectedCard={selectedCard}
        onSelect={handleCardSelected}
      />

      {selectedCard ? (
        <Panel
          id="card-sale-data"
          className="scroll-mt-28 p-5 sm:p-6"
        >
          <div>
            <h2 className="text-xl font-black text-[#00102D]">
              Dados para venda
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Informe a condição, o tipo, o idioma, o preço,
              o estoque e a disponibilidade.
            </p>
          </div>

          <form
            className="mt-6 space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <fieldset
              disabled={mutation.isPending}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome"
                  readOnly
                  className="bg-slate-50"
                  error={form.formState.errors.name?.message}
                  {...form.register("name")}
                />

                <Input
                  label="Categoria"
                  value={
                    cardCategory?.name ??
                    "Categoria Cartas não encontrada"
                  }
                  readOnly
                  className="bg-slate-50"
                  error={
                    form.formState.errors.categoryId?.message
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Select
                  label="Condição"
                  value={condition}
                  onChange={handleConditionChange}
                >
                  <option value="NM">NM — Near Mint</option>
                  <option value="SP">
                    SP — Slightly Played
                  </option>
                  <option value="MP">
                    MP — Moderately Played
                  </option>
                  <option value="HP">
                    HP — Heavily Played
                  </option>
                  <option value="D">D — Damaged</option>
                </Select>

                <Select
                  label="Tipo da carta"
                  value={cardType}
                  onChange={handleCardTypeChange}
                >
                  <option value="Normal">Normal</option>
                  <option value="Reverse">Reverse</option>
                  <option value="Foil">Foil</option>
                  <option value="Full Art">Full Art</option>
                  <option value="Secreta">Secreta</option>
                  <option value="Ultra Rara">
                    Ultra Rara
                  </option>
                  <option value="Promo">Promo</option>
                </Select>

                <Select
                  label="Idioma"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="Português">Português</option>
                  <option value="Inglês">Inglês</option>
                  <option value="Japonês">Japonês</option>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Preço"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  error={form.formState.errors.price?.message}
                  {...form.register("price")}
                />

                <Input
                  label="Estoque"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  error={
                    form.formState.errors.stockQuantity?.message
                  }
                  {...form.register("stockQuantity")}
                />
              </div>

              <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div>
                  <h2 className="font-bold text-[#00102D]">
                    Disponibilidade e limite de compra
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Defina quando a carta pode ser comprada
                    e a quantidade permitida por pedido.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    {...form.register("available")}
                  />

                  <span>
                    <span className="block text-sm font-semibold text-[#00102D]">
                      Disponível para os clientes
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {available
                        ? "A carta aparece na loja e pode ser comprada quando houver estoque."
                        : "A carta fica oculta na loja, mas continua no estoque e nos valores do dashboard."}
                    </span>
                  </span>
                </label>

                {form.formState.errors.available?.message ? (
                  <p className="text-sm text-red-700">
                    {form.formState.errors.available.message}
                  </p>
                ) : null}

                <div>
                  <Input
                    label="Quantidade máxima por pedido"
                    type="number"
                    min="0"
                    max="2147483647"
                    step="1"
                    error={
                      form.formState.errors.maxQuantityPerOrder
                        ?.message
                    }
                    {...form.register("maxQuantityPerOrder", {
                      setValueAs: (value) =>
                        value === "" ? 0 : Number(value),
                    })}
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Use 0 para não limitar. Exemplo: 1 permite
                    apenas uma unidade desta carta por
                    carrinho/pedido. O cliente pode comprar
                    novamente em outro pedido.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-sm font-semibold text-sky-800">
                  Embalagem calculada automaticamente
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  O peso e as dimensões serão calculados
                  conforme a quantidade de cartas
                  adicionadas ao pedido.
                </p>
              </div>

              <Textarea
                label="Descrição e observações"
                rows={13}
                error={
                  form.formState.errors.description?.message
                }
                {...form.register("description")}
              />

              <p className="-mt-3 text-xs leading-5 text-slate-500">
                Você pode alterar livremente a descrição
                e adicionar detalhes sobre riscos, bordas,
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
              <input
                type="hidden"
                {...form.register("weight")}
              />
              <input
                type="hidden"
                {...form.register("width")}
              />
              <input
                type="hidden"
                {...form.register("height")}
              />
              <input
                type="hidden"
                {...form.register("length")}
              />

              {selectedCard.imageUrl ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Imagem externa
                  </p>
                  <p className="mt-2 break-all text-sm text-slate-600">
                    {selectedCard.imageUrl}
                  </p>
                </div>
              ) : null}

              {form.formState.errors.imgUrl?.message ? (
                <p className="text-sm text-red-700">
                  {form.formState.errors.imgUrl.message}
                </p>
              ) : null}
            </fieldset>

            {categoriesQuery.isLoading ? (
              <p className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                Carregando a categoria da carta...
              </p>
            ) : null}

            {categoriesQuery.isError ? (
              <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p>Não foi possível carregar as categorias.</p>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={categoriesQuery.isFetching}
                  onClick={() => void categoriesQuery.refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : null}

            {categoriesQuery.isSuccess && !cardCategory ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                A categoria Carta ou Cartas não foi encontrada.
                Crie essa categoria antes de cadastrar a carta.
              </p>
            ) : null}

            {mutation.isError ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                Não foi possível salvar a carta.
              </p>
            ) : null}

            <div className="border-t border-slate-200 pt-5">
              <Button
                type="submit"
                icon={<Save size={17} />}
                className="w-full sm:w-auto"
                disabled={
                  mutation.isPending ||
                  !categoriesQuery.isSuccess ||
                  !cardCategory
                }
              >
                {mutation.isPending
                  ? "Salvando..."
                  : "Cadastrar carta"}
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </section>
  );
}