import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nome muito curto.").max(100, "Nome muito longo."),
  description: z
    .string()
    .min(10, "Descricao muito curta.")
    .max(1500, "Descricao muito longa."),
  price: z.coerce.number().positive("Preco precisa ser positivo."),
  stockQuantity: z.coerce
    .number()
    .int("Estoque precisa ser um numero inteiro.")
    .min(0, "Estoque nao pode ser negativo."),
  imgUrl: z.string().url("Informe uma URL valida.").or(z.literal("")),
  categoryId: z.coerce.number().min(1, "Selecione uma categoria."),
});

export type ProductSchema = z.infer<typeof productSchema>;