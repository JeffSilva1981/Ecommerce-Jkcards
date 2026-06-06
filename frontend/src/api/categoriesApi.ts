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

