import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/categoriesApi";
import { Panel } from "../../components/Panel";

export function CategoriesAdminPage() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">Categorias</h1>
        <p className="mt-2 text-sm text-slate-400">
          O backend atual lista categorias; criar, editar e excluir entram quando o CRUD for exposto.
        </p>
      </div>
      <Panel className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {query.data?.map((category) => (
            <div key={category.id} className="rounded-md border border-line bg-white/5 p-4">
              <p className="text-xs text-slate-500">#{category.id}</p>
              <p className="mt-1 font-semibold text-white">{category.name}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

