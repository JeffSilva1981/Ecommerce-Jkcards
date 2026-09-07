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

      console.error(
        "Erro inesperado ao excluir usuário:",
        error,
      );

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
    if (deleteMutation.isPending) {
      return;
    }

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
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#00102D]">
          Usuários
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Lista de usuários cadastrados na plataforma.
        </p>
      </div>

      {deleteError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {deleteError}
        </div>
      ) : null}

      <Panel className="overflow-hidden">
        {query.isLoading ? (
          <div className="p-6 text-sm text-slate-500">
            Carregando usuários...
          </div>
        ) : query.isError ? (
          <div className="space-y-4 p-6">
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              Não foi possível carregar os usuários.
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
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold text-[#00102D]">
              Nenhum usuário encontrado
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Os usuários cadastrados serão exibidos aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-4">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Nome
                  </th>
                  <th scope="col" className="px-4 py-4">
                    E-mail
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Telefone
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Nascimento
                  </th>
                  <th scope="col" className="px-4 py-4">
                    Perfis
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-right"
                  >
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
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-sky-50/50"
                    >
                      <td className="px-4 py-4 font-bold text-[#00102D]">
                        #{user.id}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#00102D]">
                        {user.name}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {user.email}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {user.phone ?? "-"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {user.birthDate ?? "-"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles?.map((role) => (
                            <span
                              key={role}
                              className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <Button
                            type="button"
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
        )}
      </Panel>
    </section>
  );
}