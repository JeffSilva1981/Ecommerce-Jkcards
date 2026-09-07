import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categoriesApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
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

  async function refreshCategories() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      }),
    ]);
  }

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
      await refreshCategories();
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: refreshCategories,
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
    if (deleteMutation.isPending) {
      return;
    }

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
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#00102D]">
            Categorias
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organize as categorias dos produtos da loja.
          </p>
        </div>

        <Button
          type="button"
          icon={<Plus size={18} />}
          onClick={openCreateModal}
          disabled={deleteMutation.isPending}
        >
          Nova categoria
        </Button>
      </div>

      <Panel className="p-5 sm:p-6">
        {query.isLoading ? (
          <p className="text-sm text-slate-500">
            Carregando categorias...
          </p>
        ) : query.isError ? (
          <div className="space-y-4">
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              Não foi possível carregar as categorias.
            </p>

            <Button
              type="button"
              variant="secondary"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : query.data?.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <FolderTree size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#00102D]">
              Nenhuma categoria cadastrada
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Clique em Nova categoria para começar.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {query.data?.map((category) => {
              const isDeleting =
                deleteMutation.isPending &&
                deleteMutation.variables === category.id;

              return (
                <div
                  key={category.id}
                  className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
                      <FolderTree size={20} />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      #{category.id}
                    </span>
                  </div>

                  <p className="mt-4 break-words font-bold text-[#00102D]">
                    {category.name}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Button
                      type="button"
                      variant="secondary"
                      icon={<Pencil size={15} />}
                      onClick={() => openEditModal(category)}
                      disabled={deleteMutation.isPending}
                    >
                      Editar
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      icon={<Trash2 size={15} />}
                      onClick={() => handleDelete(category)}
                      disabled={deleteMutation.isPending}
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {deleteMutation.isError ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            Não foi possível excluir a categoria. Verifique
            se existem produtos vinculados a ela.
          </p>
        ) : null}
      </Panel>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            style={{ colorScheme: "light" }}
            onKeyDown={(event) => {
              if (
                event.key === "Escape" &&
                !saveMutation.isPending
              ) {
                closeModal();
              }

              if (event.key === "Tab") {
                const controls =
                  event.currentTarget.querySelectorAll<HTMLElement>(
                    'input:not([disabled]), button:not([disabled])',
                  );

                const first = controls[0];
                const last = controls[controls.length - 1];

                if (!first || !last) {
                  return;
                }

                if (
                  event.shiftKey &&
                  document.activeElement === first
                ) {
                  event.preventDefault();
                  last.focus();
                } else if (
                  !event.shiftKey &&
                  document.activeElement === last
                ) {
                  event.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <h2
              id="category-modal-title"
              className="text-xl font-black text-[#00102D]"
            >
              {editingCategory
                ? "Atualizar categoria"
                : "Nova categoria"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Informe o nome que será exibido na loja.
            </p>

            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
            >
              <Input
                id="category-name"
                label="Nome da categoria"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Boosters"
                autoFocus
                required
                disabled={saveMutation.isPending}
              />

              {saveMutation.isError ? (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  Não foi possível salvar a categoria.
                  Tente novamente.
                </p>
              ) : null}

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={saveMutation.isPending}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={!name.trim() || saveMutation.isPending}
                >
                  {saveMutation.isPending
                    ? "Salvando..."
                    : editingCategory
                      ? "Atualizar"
                      : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}