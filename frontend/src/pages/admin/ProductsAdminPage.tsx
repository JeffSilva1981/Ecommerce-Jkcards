import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts } from "../../api/productsApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";
import { formatCurrency } from "../../utils/currency";

export function ProductsAdminPage() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts({ size: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Produtos</h1>
          <p className="mt-2 text-sm text-slate-400">
            Cadastro e manutencao do catalogo.
          </p>
        </div>

        <Link to="/admin/produtos/novo">
          <Button icon={<Plus size={17} />}>Novo produto</Button>
        </Link>
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-line bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Preco</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Imagem</th>
                <th className="px-4 py-3 text-right">Acoes</th>
              </tr>
            </thead>

            <tbody>
              {query.data?.content.map((product) => {
                const stockQuantity = product.stockQuantity ?? 0;
                const isOutOfStock = stockQuantity === 0;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {product.name}
                    </td>

                    <td className="px-4 py-3 text-gold">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="px-4 py-3">
                      {isOutOfStock ? (
                        <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2 py-1 text-xs font-semibold text-red-200">
                          Esgotado
                        </span>
                      ) : (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                          {stockQuantity} em estoque
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex size-12 items-center justify-center rounded bg-white p-1">
                        <img
                          src={product.imgUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/produtos/${product.id}`}>
                          <Button variant="secondary" icon={<Edit size={15} />}>
                            Editar
                          </Button>
                        </Link>

                        <Button
                          variant="danger"
                          icon={<Trash2 size={15} />}
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(product.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}