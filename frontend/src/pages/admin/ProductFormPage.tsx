import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Package, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { getCategories } from "../../api/categoriesApi";
import {
  getProductByIdAdmin,
  saveProduct,
  uploadProductImage,
} from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import { productSchema } from "../../schemas/productSchema";

const productFormSchema = productSchema.extend({
  available: z.boolean(),
  maxQuantityPerOrder: z
    .number()
    .int("O limite precisa ser um número inteiro.")
    .min(0, "O limite não pode ser negativo.")
    .max(2147483647, "O limite informado é muito alto."),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  stockQuantity: 0,
  imgUrl: "",
  categoryId: 1,
  weight: 0,
  width: 0,
  height: 0,
  length: 0,
  available: true,
  maxQuantityPerOrder: 0,
};

type LoadedProduct = {
  id: number;
  stockQuantity: number;
};

function getSaveErrorMessage(error: unknown) {
  if (isAxiosError<{ error?: string }>(error)) {
    if (error.response?.status === 409) {
      return (
        error.response.data?.error ??
        "O estoque foi alterado. Recarregue o produto antes de salvar."
      );
    }
  }

  return error instanceof Error && !isAxiosError(error)
    ? error.message
    : "Não foi possível salvar o produto.";
}

export function ProductFormPage() {
  const { id } = useParams();

  const productId =
    id === "novo" || !id ? undefined : Number(id);

  const invalidProductId =
    productId !== undefined &&
    (!Number.isSafeInteger(productId) || productId <= 0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadedProduct, setLoadedProduct] =
    useState<LoadedProduct | null>(null);

  const initializedProductId = useRef<number | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const imageUrl = form.watch("imgUrl");
  const available = form.watch("available");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const productQuery = useQuery({
    queryKey: ["product-form", productId],
    queryFn: () => getProductByIdAdmin(productId as number),
    enabled: productId !== undefined && !invalidProductId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Reinicia o formulário ao navegar para outro produto.
  useEffect(() => {
    initializedProductId.current = null;
    setLoadedProduct(null);
    form.reset(DEFAULT_VALUES);
  }, [productId, form]);

  useEffect(() => {
    const product = productQuery.data;

    if (
      productId === undefined ||
      !product ||
      product.id !== productId ||
      initializedProductId.current === productId
    ) {
      return;
    }

    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity ?? 0,
      imgUrl: product.imgUrl ?? "",
      categoryId: product.categories[0]?.id ?? 1,
      weight: product.weight ?? 0,
      width: product.width ?? 0,
      height: product.height ?? 0,
      length: product.length ?? 0,
      available: product.available,
      maxQuantityPerOrder: product.maxQuantityPerOrder ?? 0,
    });

    // Guarda o estoque correspondente ao formulário carregado.
    setLoadedProduct({
      id: product.id,
      stockQuantity: product.stockQuantity ?? 0,
    });

    initializedProductId.current = productId;
  }, [form, productId, productQuery.data]);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);

      const uploadedImageUrl = await uploadProductImage(file);

      form.setValue("imgUrl", uploadedImageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error("Erro ao enviar imagem", error);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (invalidProductId) {
        throw new Error("Identificador de produto inválido.");
      }

      if (
        productId !== undefined &&
        loadedProduct?.id !== productId
      ) {
        throw new Error(
          "Aguarde o carregamento do produto antes de salvar.",
        );
      }

      return saveProduct(
        {
          name: values.name,
          description: values.description,
          price: values.price,
          stockQuantity: values.stockQuantity,
          expectedStockQuantity:
            productId !== undefined
              ? loadedProduct?.stockQuantity
              : undefined,
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
        },
        productId,
      );
    },

    onSuccess: (savedProduct) => {
      alert(
        productId !== undefined
          ? "Produto atualizado com sucesso."
          : "Produto cadastrado com sucesso.",
      );

      void queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin-cards"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["store-products"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["product-form", savedProduct.id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      navigate("/admin/produtos");
    },

    onError: (error) => {
      alert(getSaveErrorMessage(error));
    },
  });

  const stockConflict =
    isAxiosError(mutation.error) &&
    mutation.error.response?.status === 409;

  const waitingForProduct =
    productId !== undefined &&
    loadedProduct?.id !== productId;

  const formDisabled =
    mutation.isPending ||
    uploadingImage ||
    waitingForProduct ||
    invalidProductId;

  const reloadProduct = () => {
    const confirmed = window.confirm(
      "Recarregar vai descartar as alterações não salvas. Deseja continuar?",
    );

    if (confirmed) {
      window.location.reload();
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#00102D]">
          {productId !== undefined
            ? "Editar produto"
            : "Novo produto"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Cadastre as informações principais, a disponibilidade
          e as medidas do pacote para o cálculo do frete.
        </p>
      </div>

      {invalidProductId ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Identificador de produto inválido.
        </p>
      ) : null}

      {productQuery.isError ? (
        <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>Não foi possível carregar o produto.</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void productQuery.refetch()}
          >
            Tentar novamente
          </Button>
        </div>
      ) : waitingForProduct && !invalidProductId ? (
        <p className="text-sm text-slate-500">
          Carregando produto...
        </p>
      ) : null}

      <Panel className="p-5 sm:p-6">
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate(values),
          )}
        >
          <fieldset
            disabled={formDisabled}
            className="space-y-6"
          >
            <Input
              label="Nome"
              error={form.formState.errors.name?.message}
              {...form.register("name")}
            />

            <Textarea
              label="Descrição"
              error={form.formState.errors.description?.message}
              {...form.register("description")}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Preço"
                type="number"
                min="0.01"
                step="0.01"
                error={form.formState.errors.price?.message}
                {...form.register("price")}
              />

              <Input
                label="Estoque"
                type="number"
                min="0"
                step="1"
                error={
                  form.formState.errors.stockQuantity?.message
                }
                {...form.register("stockQuantity")}
              />

              <Select
                label="Categoria"
                error={form.formState.errors.categoryId?.message}
                {...form.register("categoryId")}
              >
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div>
                <h2 className="font-bold text-[#00102D]">
                  Disponibilidade e limite de compra
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Defina quando o produto pode ser comprado
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
                      ? "O produto aparece na loja e pode ser comprado quando houver estoque."
                      : "O produto fica oculto na loja, mas continua no estoque e nos valores do dashboard."}
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
                  apenas uma unidade deste produto por
                  carrinho/pedido. O cliente pode comprar
                  novamente em outro pedido.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                  <Package size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-[#00102D]">
                    Pacote para envio
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Informe o peso e as medidas do produto
                    já embalado para envio.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                  label="Peso (kg)"
                  type="number"
                  min="0.01"
                  max="30"
                  step="0.01"
                  placeholder="Ex.: 0.50"
                  error={form.formState.errors.weight?.message}
                  {...form.register("weight")}
                />

                <Input
                  label="Largura (cm)"
                  type="number"
                  min="1"
                  max="200"
                  step="0.1"
                  placeholder="Ex.: 20"
                  error={form.formState.errors.width?.message}
                  {...form.register("width")}
                />

                <Input
                  label="Altura (cm)"
                  type="number"
                  min="1"
                  max="200"
                  step="0.1"
                  placeholder="Ex.: 10"
                  error={form.formState.errors.height?.message}
                  {...form.register("height")}
                />

                <Input
                  label="Comprimento (cm)"
                  type="number"
                  min="1"
                  max="200"
                  step="0.1"
                  placeholder="Ex.: 30"
                  error={form.formState.errors.length?.message}
                  {...form.register("length")}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Considere caixa, envelope, plástico bolha,
                proteção e demais materiais da embalagem.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">
                Imagem do produto
              </p>

              <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-sky-400 hover:bg-sky-50 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
                <span className="text-sm font-semibold text-sky-700">
                  Clique para escolher uma imagem
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG ou WEBP
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>

              {uploadingImage ? (
                <p className="text-sm text-slate-500">
                  Enviando imagem...
                </p>
              ) : null}

              <input
                type="hidden"
                {...form.register("imgUrl")}
              />

              {form.formState.errors.imgUrl?.message ? (
                <p className="text-sm text-red-700">
                  {form.formState.errors.imgUrl.message}
                </p>
              ) : null}

              {imageUrl ? (
                <div className="mt-3 flex h-56 w-56 max-w-full items-center justify-center rounded-xl border border-slate-200 bg-white p-3">
                  <img
                    src={imageUrl}
                    alt="Prévia do produto"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : null}
            </div>
          </fieldset>

          {mutation.error ? (
            <div
              role="alert"
              className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{getSaveErrorMessage(mutation.error)}</p>

              {stockConflict ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={reloadProduct}
                >
                  Recarregar produto
                </Button>
              ) : null}
            </div>
          ) : null}

          <div className="border-t border-slate-200 pt-5">
            <Button
              type="submit"
              icon={<Save size={17} />}
              disabled={formDisabled || stockConflict}
              className="w-full sm:w-auto"
            >
              {mutation.isPending
                ? "Salvando..."
                : "Salvar produto"}
            </Button>
          </div>
        </form>
      </Panel>
    </section>
  );
}