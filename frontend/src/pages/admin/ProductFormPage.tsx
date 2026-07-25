import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import {
  getProductById,
  saveProduct,
  uploadProductImage,
} from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import {
  productSchema,
  type ProductSchema,
} from "../../schemas/productSchema";

export function ProductFormPage() {
  const { id } = useParams();
  const productId =
    id === "novo" || !id ? undefined : Number(id);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
    },
  });

  const imageUrl = form.watch("imgUrl");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const productQuery = useQuery({
    queryKey: ["product-form", productId],
    queryFn: () => getProductById(productId as number),
    enabled: Boolean(productId),
  });

  useEffect(() => {
    if (productQuery.data) {
      form.reset({
        name: productQuery.data.name,
        description: productQuery.data.description,
        price: productQuery.data.price,
        stockQuantity:
          productQuery.data.stockQuantity ?? 0,
        imgUrl: productQuery.data.imgUrl ?? "",
        categoryId:
          productQuery.data.categories[0]?.id ?? 1,
        weight: productQuery.data.weight ?? 0,
        width: productQuery.data.width ?? 0,
        height: productQuery.data.height ?? 0,
        length: productQuery.data.length ?? 0,
      });
    }
  }, [form, productQuery.data]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);

      const uploadedImageUrl =
        await uploadProductImage(file);

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
    mutationFn: (values: ProductSchema) =>
      saveProduct(
        {
          name: values.name,
          description: values.description,
          price: values.price,
          stockQuantity: values.stockQuantity,
          imgUrl: values.imgUrl,
          weight: values.weight,
          width: values.width,
          height: values.height,
          length: values.length,
          categories: [{ id: values.categoryId }],
        },
        productId
      ),

    onSuccess: () => {
      alert(
        productId
          ? "Produto atualizado com sucesso."
          : "Produto cadastrado com sucesso."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      navigate("/admin/produtos");
    },

    onError: () => {
      alert("Nao foi possivel salvar o produto.");
    },
  });

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {productId
            ? "Editar produto"
            : "Novo produto"}
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Cadastre as informacoes principais e as
          medidas do pacote para o calculo do frete.
        </p>
      </div>

      <Panel className="p-5">
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate(values)
          )}
        >
          <Input
            label="Nome"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />

          <Textarea
            label="Descricao"
            error={
              form.formState.errors.description?.message
            }
            {...form.register("description")}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Preco"
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
              error={
                form.formState.errors.categoryId?.message
              }
              {...form.register("categoryId")}
            >
              {categoriesQuery.data?.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="rounded-lg border border-line bg-ink/40 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
                <Package size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Pacote para envio
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Informe o peso e as medidas do produto
                  ja embalado para envio.
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
                error={
                  form.formState.errors.weight?.message
                }
                {...form.register("weight")}
              />

              <Input
                label="Largura (cm)"
                type="number"
                min="1"
                max="200"
                step="0.1"
                placeholder="Ex.: 20"
                error={
                  form.formState.errors.width?.message
                }
                {...form.register("width")}
              />

              <Input
                label="Altura (cm)"
                type="number"
                min="1"
                max="200"
                step="0.1"
                placeholder="Ex.: 10"
                error={
                  form.formState.errors.height?.message
                }
                {...form.register("height")}
              />

              <Input
                label="Comprimento (cm)"
                type="number"
                min="1"
                max="200"
                step="0.1"
                placeholder="Ex.: 30"
                error={
                  form.formState.errors.length?.message
                }
                {...form.register("length")}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Considere caixa, envelope, plastico bolha,
              protecao e demais materiais da embalagem.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-200">
              Imagem do produto
            </label>

            <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line bg-ink/70 px-4 text-center transition hover:border-skybrand hover:bg-skybrand/10">
              <span className="text-sm font-semibold text-skysoft">
                Clique para escolher uma imagem
              </span>

              <span className="mt-1 text-xs text-slate-400">
                PNG, JPG ou WEBP
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {uploadingImage ? (
              <p className="text-sm text-slate-400">
                Enviando imagem...
              </p>
            ) : null}

            <input
              type="hidden"
              {...form.register("imgUrl")}
            />

            {imageUrl ? (
              <div className="mt-3 flex h-56 w-56 items-center justify-center rounded-lg border border-line bg-white p-3">
                <img
                  src={imageUrl}
                  alt="Preview do produto"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : null}
          </div>

          {mutation.error ? (
            <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Nao foi possivel salvar o produto.
            </p>
          ) : null}

          <Button
            type="submit"
            icon={<Save size={17} />}
            disabled={
              mutation.isPending || uploadingImage
            }
          >
            {mutation.isPending
              ? "Salvando..."
              : "Salvar produto"}
          </Button>
        </form>
      </Panel>
    </section>
  );
}