import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido."),

  password: z
    .string()
    .min(3, "Informe sua senha."),
});

export const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(3, "Informe seu nome."),

    phone: z
      .string()
      .trim()
      .min(8, "Informe seu telefone."),

    confirmPassword: z
      .string()
      .min(3, "Confirme sua senha."),

    acceptTerms: z
      .boolean()
      .refine(
        (value) => value === true,
        {
          message:
            "Você precisa aceitar os termos para criar a conta.",
        },
      ),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message:
        "As senhas precisam ser iguais.",
      path: ["confirmPassword"],
    },
  );

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        8,
        "A senha deve possuir pelo menos 8 caracteres.",
      )
      .max(
        72,
        "A senha deve possuir no máximo 72 caracteres.",
      ),

    confirmPassword: z
      .string()
      .min(1, "Confirme a nova senha."),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message:
        "As senhas precisam ser iguais.",
      path: ["confirmPassword"],
    },
  );

export type LoginSchema =
  z.infer<typeof loginSchema>;

export type RegisterSchema =
  z.infer<typeof registerSchema>;

export type ForgotPasswordSchema =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordSchema =
  z.infer<typeof resetPasswordSchema>;