import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Nome muito curto.")
    .max(100, "Nome muito longo."),

  description: z
    .string()
    .min(10, "Descricao muito curta.")
    .max(1500, "Descricao muito longa."),

  price: z.coerce
    .number()
    .positive("Preco precisa ser positivo."),

  stockQuantity: z.coerce
    .number()
    .int("Estoque precisa ser um numero inteiro.")
    .min(0, "Estoque nao pode ser negativo."),

  imgUrl: z
    .string()
    .url("Informe uma URL valida.")
    .or(z.literal("")),

  categoryId: z.coerce
    .number()
    .min(1, "Selecione uma categoria."),

  weight: z.coerce
    .number()
    .min(0.01, "O peso minimo e 0,01 kg.")
    .max(30, "O peso maximo permitido e 30 kg."),

  width: z.coerce
    .number()
    .min(1, "A largura minima e 1 cm.")
    .max(200, "A largura maxima e 200 cm."),

  height: z.coerce
    .number()
    .min(1, "A altura minima e 1 cm.")
    .max(200, "A altura maxima e 200 cm."),

  length: z.coerce
    .number()
    .min(1, "O comprimento minimo e 1 cm.")
    .max(200, "O comprimento maximo e 200 cm."),
});

export type ProductSchema = z.infer<typeof productSchema>;