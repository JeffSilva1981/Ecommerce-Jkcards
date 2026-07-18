import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUser, getUsers } from "../../api/usersApi";
import { Button } from "../../components/Button";
import { Panel } from "../../components/Panel";

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export function UsersAdminPage() {
  const queryClient = useQueryClient();
  const [deletingUserId, setDeletingUserId] =
    useState<number | null>(null);
  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      setDeletingUserId(null);
      setDeleteError(null);

      alert("Usuário excluído com sucesso.");
    },

    onError: (error) => {
      setDeletingUserId(null);

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const status = error.response?.status;
        const apiMessage =
          error.response?.data?.error ??
          error.response?.data?.message;

        console.error("Erro ao excluir usuário:", {
          status,
          data: error.response?.data,
          url: `${error.config?.baseURL ?? ""}${
            error.config?.url ?? ""
          }`,
        });

        if (status === 401) {
          setDeleteError(
            "Sua sessão expirou. Saia do sistema e entre novamente.",
          );
          return;
        }

        if (status === 403) {
          setDeleteError(
            "Você não possui permissão para excluir usuários.",
          );
          return;
        }

        if (status === 404) {
          setDeleteError(
            apiMessage ?? "O usuário não foi encontrado.",
          );
          return;
        }

        if (status === 409) {
          setDeleteError(
            apiMessage ??
              "O usuário não pode ser excluído porque possui vínculos ou é uma conta protegida.",
          );
          return;
        }

        setDeleteError(
          apiMessage ??
            `Não foi possível excluir o usuário${
              status ? ` (erro ${status})` : ""
            }.`,
        );

        return;
      }

      console.error("Erro inesperado ao excluir usuário:", error);

      setDeleteError(
        "Ocorreu um erro inesperado ao excluir o usuário.",
      );
    },

    onSettled: () => {
      setDeletingUserId(null);
    },
  });

  const users = query.data ?? [];

  function handleDeleteUser(id: number, name: string) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o usuário "${name}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setDeleteError(null);
    setDeletingUserId(id);
    deleteMutation.mutate(id);
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Usuários
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Lista de usuários cadastrados na plataforma.
        </p>
      </div>

      {deleteError ? (
        <div className="rounded-md border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {deleteError}
        </div>
      ) : null}

      <Panel className="overflow-hidden">
        {query.isLoading ? (
          <div className="p-5 text-sm text-slate-400">
            Carregando usuários...
          </div>
        ) : null}

        {query.isError ? (
          <div className="p-5 text-sm text-red-300">
            Não foi possível carregar os usuários.
          </div>
        ) : null}

        {!query.isLoading &&
        !query.isError &&
        users.length === 0 ? (
          <div className="p-5 text-sm text-slate-400">
            Nenhum usuário encontrado.
          </div>
        ) : null}

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-line bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Nascimento</th>
                  <th className="px-4 py-3">Perfis</th>
                  <th className="px-4 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isDeleting =
                    deleteMutation.isPending &&
                    deletingUserId === user.id;

                  return (
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

                      <td className="px-4 py-3 text-slate-300">
                        {user.email}
                      </td>

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
                            onClick={() =>
                              handleDeleteUser(
                                user.id,
                                user.name,
                              )
                            }
                          >
                            {isDeleting
                              ? "Excluindo..."
                              : "Excluir"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </Panel>
    </section>
  );
}