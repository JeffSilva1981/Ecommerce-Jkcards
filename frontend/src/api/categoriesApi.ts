import { apiClient, delay, isMockEnabled } from "./apiClient";
import { mockCategories } from "../mocks/data";
import type { Category } from "../types/category";

export async function getCategories() {
  if (isMockEnabled) {
    await delay();
    return mockCategories;
  }

  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(data: { name: string }) {
  if (isMockEnabled) {
    await delay();

    const newCategory: Category = {
      id: Math.floor(Math.random() * 10000),
      name: data.name,
    };

    return newCategory;
  }

  const response = await apiClient.post<Category>("/categories", data);
  return response.data;
}