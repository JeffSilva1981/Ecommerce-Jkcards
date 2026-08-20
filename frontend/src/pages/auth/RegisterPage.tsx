import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { Input } from "../../components/Input";
import {
  registerSchema,
  type RegisterSchema,
} from "../../schemas/authSchemas";

export function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      acceptTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login");
    },

    onError: (error) => {
      console.error(
        "Erro ao cadastrar:",
        error,
      );
    },
  });

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto grid min-h-[720px] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <ShieldCheck size={16} />
            Cadastro seguro
          </span>

          <h1 className="mt-6 max-w-lg text-5xl font-black leading-tight text-[#00102D]">
            Faça parte da comunidade JKCards.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
            Crie sua conta para comprar seus produtos favoritos e acompanhar
            todos os seus pedidos.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 size-2 shrink-0 rounded-full bg-sky-500" />

              <p className="text-sm leading-6 text-slate-600">
                Acompanhe seus pedidos em um único lugar.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 size-2 shrink-0 rounded-full bg-sky-500" />

              <p className="text-sm leading-6 text-slate-600">
                Finalize suas compras com mais facilidade.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 size-2 shrink-0 rounded-full bg-sky-500" />

              <p className="text-sm leading-6 text-slate-600">
                Seus dados são tratados com segurança.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-7 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Nova conta
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#00102D]">
              Criar cadastro
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Preencha seus dados para começar.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(
              (values) =>
                mutation.mutate({
                  name: values.name,
                  email: values.email,
                  password: values.password,
                  phone: values.phone,
                }),
            )}
          >
            <Input
              variant="light"
              label="Nome completo"
              autoComplete="name"
              placeholder="Digite seu nome"
              error={form.formState.errors.name?.message}
              {...form.register("name")}
            />

            <Input
              variant="light"
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                variant="light"
                label="Senha"
                type="password"
                autoComplete="new-password"
                placeholder="Digite sua senha"
                error={form.formState.errors.password?.message}
                {...form.register("password")}
              />

              <Input
                variant="light"
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                placeholder="Repita sua senha"
                error={form.formState.errors.confirmPassword?.message}
                {...form.register("confirmPassword")}
              />
            </div>

            <Input
              variant="light"
              label="Telefone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(15) 99999-9999"
              error={form.formState.errors.phone?.message}
              {...form.register("phone")}
            />

            <div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 transition hover:border-sky-300">
                <input
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 accent-sky-500"
                  {...form.register("acceptTerms")}
                />

                <span>
                  Li e aceito os{" "}

                  <Link
                    to="/termos-de-uso"
                    className="font-bold text-sky-600 hover:text-sky-700"
                  >
                    Termos de Uso
                  </Link>{" "}

                  e a{" "}

                  <Link
                    to="/privacidade"
                    className="font-bold text-sky-600 hover:text-sky-700"
                  >
                    Política de Privacidade
                  </Link>{" "}

                  da JKCards.
                </span>
              </label>

              {form.formState.errors.acceptTerms?.message ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {form.formState.errors.acceptTerms.message}
                </p>
              ) : null}
            </div>

            {mutation.isError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                Não foi possível criar a conta. Confira os dados e tente
                novamente.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              <UserPlus size={18} />

              {mutation.isPending
                ? "Criando conta..."
                : "Criar conta"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Já possui uma conta?{" "}

              <Link
                to="/login"
                className="font-bold text-sky-600 transition hover:text-sky-700"
              >
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}