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
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
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
      <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-md items-center justify-center py-8">
        <Panel className="w-full p-6">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={28} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-white">
              Verifique seu e-mail
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {mutation.data.message}
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              O link será válido por 30 minutos. Confira
              também a caixa de spam ou lixo eletrônico.
            </p>

            <Link
              to="/login"
              className="mt-6 block"
            >
              <Button
                className="w-full"
                variant="secondary"
                icon={<ArrowLeft size={17} />}
              >
                Voltar para o login
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
            <Mail size={27} />
          </div>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-skysoft">
            Recuperação de senha
          </p>

          <h1 className="mt-3 text-3xl font-black text-white">
            Esqueceu sua senha?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Informe o e-mail cadastrado. Enviaremos um
            link para você criar uma nova senha.
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
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="seuemail@exemplo.com"
            error={
              form.formState.errors.email?.message
            }
            {...form.register("email")}
          />

          {mutation.isError ? (
            <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Não foi possível processar a solicitação.
              Tente novamente em alguns instantes.
            </p>
          ) : null}

          <Button
            className="w-full"
            icon={<Mail size={17} />}
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending
              ? "Enviando..."
              : "Enviar link de recuperação"}
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-skysoft transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </form>
      </Panel>
    </section>
  );
}