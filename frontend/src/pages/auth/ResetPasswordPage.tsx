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
import { Input } from "../../components/Input";
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
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle size={30} />
            </div>

            <h1 className="mt-5 text-3xl font-black text-[#00102D]">
              Link inválido
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              O link de recuperação não possui um token válido. Solicite um
              novo link para continuar.
            </p>

            <Link
              to="/esqueci-senha"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              Solicitar novo link
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (mutation.isSuccess) {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={30} />
            </div>

            <h1 className="mt-5 text-3xl font-black text-[#00102D]">
              Senha alterada
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {mutation.data.message}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Agora você já pode entrar utilizando sua nova senha.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              Entrar na minha conta
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto flex min-h-[620px] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-sky-100 text-sky-700">
              <KeyRound size={29} />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-wider text-sky-600">
              Nova senha
            </p>

            <h1 className="mt-3 text-3xl font-black text-[#00102D]">
              Redefinir senha
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Crie uma nova senha com pelo menos 8 caracteres.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(
              (values) => mutation.mutate(values),
            )}
          >
            <Input
              variant="light"
              label="Nova senha"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />

            <Input
              variant="light"
              label="Confirmar nova senha"
              type="password"
              autoComplete="new-password"
              placeholder="Digite novamente"
              error={form.formState.errors.confirmPassword?.message}
              {...form.register("confirmPassword")}
            />

            {mutation.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <p className="font-bold">
                  Não foi possível alterar a senha.
                </p>

                <p className="mt-1 text-xs leading-5 text-red-500">
                  O link pode estar inválido, expirado ou já ter sido utilizado.
                  Solicite um novo link de recuperação.
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              <KeyRound size={18} />

              {mutation.isPending
                ? "Alterando..."
                : "Salvar nova senha"}
            </button>

            {mutation.isError ? (
              <Link
                to="/esqueci-senha"
                className="block text-center text-sm font-bold text-sky-600 transition hover:text-sky-700"
              >
                Solicitar outro link
              </Link>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}