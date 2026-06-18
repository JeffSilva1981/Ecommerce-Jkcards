import { apiClient } from "./apiClient";
import type { Page } from "../types/page";
import type { Product, ProductFormData, ProductSummary } from "../types/product";

type ProductListParams = {
  name?: string;
  page?: number;
  size?: number;
};

export async function getProducts(params: ProductListParams = {}) {
  const response = await apiClient.get<Page<ProductSummary>>("/products", {
    params,
  });

  return {
    content: response.data?.content ?? [],
    totalPages: response.data?.totalPages ?? 1,
    totalElements: response.data?.totalElements ?? 0,
    size: response.data?.size ?? (params.size ?? 8),
    number: response.data?.number ?? (params.page ?? 0),
  };
}

export async function getProductById(id: number) {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export async function saveProduct(payload: ProductFormData, id?: number) {
  if (id) {
    const response = await apiClient.put<Product>(
      `/products/${id}`,
      payload
    );
    return response.data;
  }

  const response = await apiClient.post<Product>(
    "/products",
    payload
  );

  return response.data;
}

export async function deleteProduct(id: number) {
  await apiClient.delete(`/products/${id}`);
}

export async function uploadProductImage(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post<string>(
    "/products/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}