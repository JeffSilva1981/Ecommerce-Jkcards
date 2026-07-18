import { apiClient } from "./apiClient";
import type { Category } from "../types/category";

export async function getCategories() {
  const response =
    await apiClient.get<Category[]>("/categories");

  return response.data;
}

export async function createCategory(data: {
  name: string;
}) {
  const response = await apiClient.post<Category>(
    "/categories",
    data,
  );

  return response.data;
}

export async function updateCategory(
  id: number,
  data: { name: string },
) {
  const response = await apiClient.put<Category>(
    `/categories/${id}`,
    data,
  );

  return response.data;
}

export async function deleteCategory(id: number) {
  await apiClient.delete(`/categories/${id}`);
}