import { apiClient } from "./apiClient";
import type { Category } from "../types/category";

export async function getCategories() {
  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(data: { name: string }) {
  const response = await apiClient.post<Category>("/categories", data);
  return response.data;
}