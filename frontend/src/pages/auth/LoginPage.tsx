import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { login } from "../../api/authApi";
import { Input } from "../../components/Input";
import {
  loginSchema,
  type LoginSchema,
} from "../../schemas/authSchemas";
import { useAuthStore } from "../../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const setSession = useAuthStore(
    (state) => state.setSession,
  );

  const from =
    (
      location.state as {
        from?: string;
      } | null
    )?.from ?? "/";

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login,

    onSuccess: ({ token, user }) => {
      setSession(token, user);

      navigate(from, {
        replace: true,
      });
    },
  });

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto grid min-h-[650px] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <ShieldCheck size={16} />
            Ambiente seguro
          </span>

          <h1 className="mt-6 max-w-lg text-5xl font-black leading-tight text-[#00102D]">
            Bem-vindo de volta à JKCards.
          </h1>

          <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
            Acesse sua conta para acompanhar pedidos, finalizar compras e
            gerenciar seus dados.
          </p>

          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5">
            <p className="font-bold text-[#00102D]">
              Seus dados estão protegidos
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              A JKCards utiliza autenticação segura e não armazena sua senha em
              texto aberto.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-7 text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-sky-600">
              Acesso JKCards
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#00102D]">
              Entrar na conta
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Informe seu e-mail e sua senha para continuar.
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

            <div>
              <Input
                variant="light"
                label="Senha"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                error={form.formState.errors.password?.message}
                {...form.register("password")}
              />

              <div className="mt-2 text-right">
                <Link
                  to="/esqueci-senha"
                  className="text-sm font-bold text-sky-600 transition hover:text-sky-700"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </div>

            {mutation.isError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                Credenciais inválidas ou serviço temporariamente indisponível.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              <LogIn size={18} />

              {mutation.isPending
                ? "Entrando..."
                : "Entrar"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Ainda não tem conta?{" "}

              <Link
                to="/cadastro"
                className="font-bold text-sky-600 transition hover:text-sky-700"
              >
                Criar cadastro
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}