import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "../../schemas/authSchemas";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token")?.trim() ?? "";

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(
      resetPasswordSchema,
    ),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (
      values: ResetPasswordSchema,
    ) =>
      resetPassword({
        token,
        password: values.password,
      }),
  });

  if (!token) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-md items-center justify-center py-8">
        <Panel className="w-full p-6">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
              <AlertTriangle size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-white">
              Link inválido
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              O link de recuperação não possui um token
              válido. Solicite um novo link.
            </p>

            <Link
              to="/esqueci-senha"
              className="mt-6 block"
            >
              <Button className="w-full">
                Solicitar novo link
              </Button>
            </Link>
          </div>
        </Panel>
      </section>
    );
  }

  if (mutation.isSuccess) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-md items-center justify-center py-8">
        <Panel className="w-full p-6">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-white">
              Senha alterada
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {mutation.data.message}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Agora você já pode entrar utilizando sua
              nova senha.
            </p>

            <Link
              to="/login"
              className="mt-6 block"
            >
              <Button className="w-full">
                Entrar na minha conta
              </Button>
            </Link>
          </div>
        </Panel>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-md items-center justify-center py-8">
      <Panel className="w-full p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full border border-skybrand/30 bg-skybrand/10 text-skysoft">
            <KeyRound size={27} />
          </div>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-skysoft">
            Nova senha
          </p>

          <h1 className="mt-3 text-3xl font-black text-white">
            Redefinir senha
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Crie uma nova senha com pelo menos 8
            caracteres.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(
            (values) =>
              mutation.mutate(values),
          )}
        >
          <Input
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            error={
              form.formState.errors.password?.message
            }
            {...form.register("password")}
          />

          <Input
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            placeholder="Digite novamente"
            error={
              form.formState.errors
                .confirmPassword?.message
            }
            {...form.register(
              "confirmPassword",
            )}
          />

          {mutation.isError ? (
            <div className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              <p className="font-semibold">
                Não foi possível alterar a senha.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-200/80">
                O link pode estar inválido, expirado ou
                já ter sido utilizado. Solicite um novo
                link de recuperação.
              </p>
            </div>
          ) : null}

          <Button
            className="w-full"
            icon={<KeyRound size={17} />}
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending
              ? "Alterando..."
              : "Salvar nova senha"}
          </Button>

          {mutation.isError ? (
            <Link
              to="/esqueci-senha"
              className="block text-center text-sm font-semibold text-skysoft transition hover:text-white"
            >
              Solicitar outro link
            </Link>
          ) : null}
        </form>
      </Panel>
    </section>
  );
}