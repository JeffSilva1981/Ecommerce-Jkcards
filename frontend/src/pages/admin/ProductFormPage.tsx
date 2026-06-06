import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../api/categoriesApi";
import { getProductById, saveProduct } from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { Select } from "../../components/Select";
import { Textarea } from "../../components/Textarea";
import { productSchema, type ProductSchema } from "../../schemas/productSchema";

export function ProductFormPage() {
  const { id } = useParams();
  const productId = id === "novo" || !id ? undefined : Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imgUrl: "",
      categoryId: 1,
    },
  });

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
        imgUrl: productQuery.data.imgUrl ?? "",
        categoryId: productQuery.data.categories[0]?.id ?? 1,
      });
    }
  }, [form, productQuery.data]);

  const mutation = useMutation({
    mutationFn: (values: ProductSchema) =>
      saveProduct(
        {
          name: values.name,
          description: values.description,
          price: values.price,
          imgUrl: values.imgUrl,
          categories: [{ id: values.categoryId }],
        },
        productId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/produtos");
    },
  });

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {productId ? "Editar produto" : "Novo produto"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Os campos seguem o contrato atual de `ProductDto`.
        </p>
      </div>

      <Panel className="p-5">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Input label="Nome" error={form.formState.errors.name?.message} {...form.register("name")} />
          <Textarea label="Descricao" error={form.formState.errors.description?.message} {...form.register("description")} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Preco" type="number" step="0.01" error={form.formState.errors.price?.message} {...form.register("price")} />
            <Select label="Categoria" error={form.formState.errors.categoryId?.message} {...form.register("categoryId")}>
              {categoriesQuery.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <Input label="URL da imagem" error={form.formState.errors.imgUrl?.message} {...form.register("imgUrl")} />
          {mutation.error ? (
            <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Nao foi possivel salvar o produto.
            </p>
          ) : null}
          <Button type="submit" icon={<Save size={17} />} disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar produto"}
          </Button>
        </form>
      </Panel>
    </section>
  );
}

