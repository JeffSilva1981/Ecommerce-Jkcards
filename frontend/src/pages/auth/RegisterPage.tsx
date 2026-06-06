import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { registerSchema, type RegisterSchema } from "../../schemas/authSchemas";

export function RegisterPage() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
  });

  return (
    <section className="mx-auto max-w-xl py-8">
      <Panel className="p-6">
        <h1 className="text-2xl font-bold text-white">Criar cadastro</h1>
        <p className="mt-2 text-sm text-slate-400">
          O backend ainda precisa expor `POST /users`; em mock, o cadastro simula sucesso.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Input label="Nome" error={form.formState.errors.name?.message} {...form.register("name")} />
          <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
          <Input label="Senha" type="password" error={form.formState.errors.password?.message} {...form.register("password")} />
          <Input
            label="Confirmar senha"
            type="password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
          {mutation.isSuccess ? (
            <p className="rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              Cadastro criado. Agora voce pode entrar.
            </p>
          ) : null}
          <Button className="w-full" icon={<UserPlus size={17} />} type="submit">
            Criar conta
          </Button>
          <Link to="/login" className="block text-center text-sm font-semibold text-skysoft">
            Voltar para login
          </Link>
        </form>
      </Panel>
    </section>
  );
}

