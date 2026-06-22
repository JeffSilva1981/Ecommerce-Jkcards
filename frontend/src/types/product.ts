import type { Category } from "./category";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  stockQuantity: number;
  categories: Category[];
};

export type ProductSummary = Pick<
  Product,
  "id" | "name" | "price" | "imgUrl" | "stockQuantity"
>;

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  stockQuantity: number;
  categories: Array<Pick<Category, "id">>;
};