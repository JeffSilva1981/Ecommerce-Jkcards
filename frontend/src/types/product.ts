import type { Category } from "./category";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  categories: Category[];
};

export type ProductSummary = Pick<Product, "id" | "name" | "price" | "imgUrl">;

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  categories: Array<Pick<Category, "id">>;
};

