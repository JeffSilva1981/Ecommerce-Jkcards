import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory } from "../../api/categoriesApi";
import { Panel } from "../../components/Panel";

export function CategoriesAdminPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      console.log("Categoria criada com sucesso");

      queryClient.invalidateQueries({ queryKey: ["categories"] });

      setOpen(false);
      setName("");
    },

    onError: (error) => {
      console.log("Erro ao criar categoria:", error);
    },
  });

  function handleSave() {
    if (!name.trim()) {
      console.log("Nome vazio");
      return;
    }

    mutation.mutate({ name });
  }

  return (
    <section className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Categorias</h1>
          <p className="mt-2 text-sm text-slate-400">
            Gerenciamento de categorias do sistema
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-skybrand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Nova Categoria
        </button>
      </div>

      {/* LISTA */}
      <Panel className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {query.data?.map((category) => (
            <div
              key={category.id}
              className="rounded-md border border-line bg-white/5 p-4"
            >
              <p className="text-xs text-slate-500">#{category.id}</p>
              <p className="mt-1 font-semibold text-white">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-md bg-slate-900 p-5">
            <h2 className="text-lg font-semibold text-white">
              Nova Categoria
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da categoria"
              className="mt-4 w-full rounded-md border border-line bg-transparent p-2 text-white"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-line px-4 py-2 text-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={mutation.isPending}
                className="rounded-md bg-skybrand px-4 py-2 text-white disabled:opacity-50"
              >
                {mutation.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}