import {
  apiClient,
  publicApiClient,
} from "./apiClient";
import type { Page } from "../types/page";
import type {
  Product,
  ProductFormData,
  ProductSummary,
} from "../types/product";

export type ProductListParams = {
  name?: string;
  categoryId?: number;
  excludeCategoryId?: number;
  inStock?: boolean;
  page?: number;
  size?: number;
};

function normalizeProductPage(
  data: Page<ProductSummary> | null | undefined,
  params: ProductListParams,
) {
  return {
    content: data?.content ?? [],
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
    size: data?.size ?? params.size ?? 8,
    number: data?.number ?? params.page ?? 0,
  };
}

export async function getProducts(
  params: ProductListParams = {},
) {
  const response = await publicApiClient.get<
    Page<ProductSummary>
  >("/products", {
    params,
  });

  return normalizeProductPage(response.data, params);
}

export async function getProductById(
  id: number,
) {
  const response = await publicApiClient.get<Product>(
    `/products/${id}`,
  );

  return response.data;
}

export async function getProductsAdmin(
  params: ProductListParams = {},
) {
  const response = await apiClient.get<
    Page<ProductSummary>
  >("/products/admin", {
    params,
  });

  return normalizeProductPage(response.data, params);
}

export async function getProductByIdAdmin(
  id: number,
) {
  const response = await apiClient.get<Product>(
    `/products/admin/${id}`,
  );

  return response.data;
}

export async function saveProduct(
  payload: ProductFormData,
  id?: number,
) {
  if (id !== undefined) {
    const response = await apiClient.put<Product>(
      `/products/${id}`,
      payload,
    );

    return response.data;
  }

  const response = await apiClient.post<Product>(
    "/products",
    payload,
  );

  return response.data;
}

export async function deleteProduct(
  id: number,
) {
  await apiClient.delete(`/products/${id}`);
}

export async function uploadProductImage(
  file: File,
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post<string>(
    "/products/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}