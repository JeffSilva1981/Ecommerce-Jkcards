import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/usersApi";
import { Panel } from "../../components/Panel";

export function UsersAdminPage() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = query.data?.content ?? query.data ?? [];

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">Usuarios</h1>
        <p className="mt-2 text-sm text-slate-400">
          Tela preparada para o CRUD admin de usuarios quando o backend liberar os endpoints.
        </p>
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Perfis</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {user.email}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {user.phone ?? "-"}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}