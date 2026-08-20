import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../api/authApi";
import { Input } from "../../components/Input";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "../../schemas/authSchemas";

export function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(
      forgotPasswordSchema,
    ),

    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (
      values: ForgotPasswordSchema,
    ) => requestPasswordReset(values.email),
  });

  if (mutation.isSuccess) {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={30} />
            </div>

            <h1 className="mt-5 text-3xl font-black text-[#00102D]">
              Verifique seu e-mail
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {mutation.data.message}
            </p>

            <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              O link será válido por 30 minutos. Confira também a caixa de spam
              ou lixo eletrônico.
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-sky-400 hover:text-sky-600"
            >
              <ArrowLeft size={17} />
              Voltar para o login
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
              <Mail size={29} />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-wider text-sky-600">
              Recuperação de senha
            </p>

            <h1 className="mt-3 text-3xl font-black text-[#00102D]">
              Esqueceu sua senha?
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Informe o e-mail cadastrado. Enviaremos um link para você criar
              uma nova senha.
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
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />

            {mutation.isError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                Não foi possível processar a solicitação. Tente novamente em
                alguns instantes.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              <Mail size={18} />

              {mutation.isPending
                ? "Enviando..."
                : "Enviar link de recuperação"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-bold text-sky-600 transition hover:text-sky-700"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}