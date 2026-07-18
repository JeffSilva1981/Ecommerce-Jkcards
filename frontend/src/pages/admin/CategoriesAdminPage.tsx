import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categoriesApi";
import { Panel } from "../../components/Panel";
import type { Category } from "../../types/category";

export function CategoriesAdminPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const normalizedName = name.trim();

      if (editingCategory) {
        return updateCategory(editingCategory.id, {
          name: normalizedName,
        });
      }

      return createCategory({
        name: normalizedName,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  function openCreateModal() {
    saveMutation.reset();
    setEditingCategory(null);
    setName("");
    setOpen(true);
  }

  function openEditModal(category: Category) {
    saveMutation.reset();
    setEditingCategory(category);
    setName(category.name);
    setOpen(true);
  }

  function closeModal() {
    saveMutation.reset();
    setOpen(false);
    setEditingCategory(null);
    setName("");
  }

  function handleSave() {
    if (!name.trim() || saveMutation.isPending) {
      return;
    }

    saveMutation.mutate();
  }

  function handleDelete(category: Category) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a categoria "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.reset();
    deleteMutation.mutate(category.id);
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Categorias
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Gerenciamento de categorias do sistema
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-md bg-skybrand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Nova Categoria
        </button>
      </div>

      <Panel className="p-5">
        {query.isLoading ? (
          <p className="text-sm text-slate-400">
            Carregando categorias...
          </p>
        ) : null}

        {query.isError ? (
          <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
            Não foi possível carregar as categorias.
          </p>
        ) : null}

        {query.data?.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nenhuma categoria cadastrada.
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {query.data?.map((category) => (
            <div
              key={category.id}
              className="rounded-md border border-line bg-white/5 p-4"
            >
              <p className="text-xs text-slate-500">
                #{category.id}
              </p>

              <p className="mt-1 font-semibold text-white">
                {category.name}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(category)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-skybrand/60 hover:text-white disabled:opacity-50"
                >
                  <Pencil size={15} />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-400/20 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {deleteMutation.isError ? (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
            Não foi possível excluir a categoria. Verifique se existem
            produtos vinculados a ela.
          </p>
        ) : null}
      </Panel>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-md bg-slate-900 p-5">
            <h2 className="text-lg font-semibold text-white">
              {editingCategory
                ? "Atualizar categoria"
                : "Nova categoria"}
            </h2>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSave();
                }
              }}
              placeholder="Nome da categoria"
              autoFocus
              className="mt-4 w-full rounded-md border border-line bg-transparent p-2 text-white outline-none focus:border-skybrand"
            />

            {saveMutation.isError ? (
              <p className="mt-3 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
                Não foi possível salvar a categoria. Tente novamente.
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={saveMutation.isPending}
                className="rounded-md border border-line px-4 py-2 text-white disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  !name.trim() || saveMutation.isPending
                }
                className="rounded-md bg-skybrand px-4 py-2 text-white disabled:opacity-50"
              >
                {saveMutation.isPending
                  ? "Salvando..."
                  : editingCategory
                    ? "Atualizar"
                    : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}