import type { Category } from "./category";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  stockQuantity: number;
  expectedStockQuantity?: number;
  available: boolean;
  maxQuantityPerOrder: number | null;
  weight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
  categories: Category[];
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "name"
  | "price"
  | "imgUrl"
  | "stockQuantity"
  | "available"
  | "maxQuantityPerOrder"
>;

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  stockQuantity: number;
  expectedStockQuantity?: number;
  available: boolean;
  maxQuantityPerOrder: number | null;
  weight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
  categories: Array<Pick<Category, "id">>;
};