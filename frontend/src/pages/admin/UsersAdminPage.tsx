import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteUser, getUsers } from "../../api/usersApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";

export function UsersAdminPage() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert("Usuario excluido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      alert(
        "Nao foi possivel excluir o usuario. Ele pode estar relacionado a pedidos ou voce pode estar tentando excluir sua propria conta."
      );
    },
  });

  const users = query.data ?? [];

  function handleDeleteUser(id: number, name: string) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o usuario "${name}"? Essa acao nao pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(id);
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">Usuarios</h1>
        <p className="mt-2 text-sm text-slate-400">
          Lista de usuarios cadastrados na plataforma.
        </p>
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-line bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Nascimento</th>
                <th className="px-4 py-3">Perfis</th>
                <th className="px-4 py-3 text-right">Acoes</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    #{user.id}
                  </td>

                  <td className="px-4 py-3 font-semibold text-white">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-slate-300">{user.email}</td>

                  <td className="px-4 py-3 text-slate-300">
                    {user.phone ?? "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {user.birthDate ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className="rounded-full border border-skybrand/30 bg-skybrand/10 px-2 py-1 text-xs font-semibold text-skysoft"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Button
                        variant="danger"
                        icon={<Trash2 size={15} />}
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}