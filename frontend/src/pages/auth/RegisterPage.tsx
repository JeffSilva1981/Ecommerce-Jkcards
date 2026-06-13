import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import {
  registerSchema,
  type RegisterSchema,
} from "../../schemas/authSchemas";

export function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login");
    },

    onError: (error) => {
      console.error("Erro ao cadastrar:", error);
    },
  });

  return (
    <section className="mx-auto max-w-xl py-8">
      <Panel className="p-6">
        <h1 className="text-2xl font-bold text-white">
          Criar cadastro
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Crie sua conta para acessar a plataforma.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((values) =>
            mutation.mutate({
              name: values.name,
              email: values.email,
              password: values.password,
              phone: values.phone,
            })
          )}
        >
          <Input
            label="Nome"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />

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

          <Input
            label="Confirmar senha"
            type="password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />

          {/* NOVO CAMPO TELEFONE */}
          <Input
            label="Telefone"
            type="text"
            error={form.formState.errors.phone?.message}
            {...form.register("phone")}
          />

          <Button
            className="w-full"
            icon={<UserPlus size={17} />}
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Criando conta..."
              : "Criar conta"}
          </Button>

          <Link
            to="/login"
            className="block text-center text-sm font-semibold text-skysoft"
          >
            Voltar para login
          </Link>
        </form>
      </Panel>
    </section>
  );
}