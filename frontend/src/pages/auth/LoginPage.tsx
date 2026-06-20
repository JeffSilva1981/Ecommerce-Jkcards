import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { loginSchema, type LoginSchema } from "../../schemas/authSchemas";
import { useAuthStore } from "../../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@jkcards.com",
      password: "admin123",
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      setSession(token, user);
      navigate(from, { replace: true });
    },
  });

  return (
    <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-md items-center justify-center py-8">
      <Panel className="w-full p-6">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-skysoft">
            Acesso JKCards
          </p>

          <h1 className="mt-3 text-3xl font-black text-white">
            Entrar na conta
          </h1>
        </div>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Input
            label="Email"
            type="email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />

          <Input
            label="Senha"
            type="password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          {mutation.error ? (
            <p className="rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Credenciais invalidas ou API indisponivel.
            </p>
          ) : null}

          <Button
            className="w-full"
            icon={<LogIn size={17} />}
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-center text-sm text-slate-400">
            Ainda nao tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-skysoft">
              Criar cadastro
            </Link>
          </p>
        </form>
      </Panel>
    </section>
  );
}