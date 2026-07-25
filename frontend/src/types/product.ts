import type { Category } from "./category";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  stockQuantity: number;
  weight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
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
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  categories: Array<Pick<Category, "id">>;
};