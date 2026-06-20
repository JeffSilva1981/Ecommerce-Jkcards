import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um email valido."),
  password: z.string().min(3, "Informe sua senha."),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(3, "Informe seu nome."),
    phone: z.string().min(8, "Informe seu telefone."),
    confirmPassword: z.string().min(3, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;