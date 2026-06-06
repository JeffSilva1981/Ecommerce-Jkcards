import { apiClient, delay, isMockEnabled } from "./apiClient";
import { mockProducts } from "../mocks/data";
import type { Page } from "../types/page";
import type { Product, ProductFormData, ProductSummary } from "../types/product";

type ProductListParams = {
  name?: string;
  page?: number;
  size?: number;
};

function toPage(items: ProductSummary[], page = 0, size = 8): Page<ProductSummary> {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    totalElements: items.length,
    size,
    number: page,
  };
}

export async function getProducts(params: ProductListParams = {}) {
  if (isMockEnabled) {
    await delay();
    const term = params.name?.trim().toLowerCase();
    const filtered = term
      ? mockProducts.filter((product) => product.name.toLowerCase().includes(term))
      : mockProducts;
    return toPage(filtered, params.page, params.size);
  }

  const response = await apiClient.get<Page<ProductSummary>>("/products", {
    params,
  });
  return response.data;
}

export async function getProductById(id: number) {
  if (isMockEnabled) {
    await delay();
    const product = mockProducts.find((item) => item.id === id);
    if (!product) {
      throw new Error("Produto nao encontrado.");
    }
    return product;
  }

  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

export async function saveProduct(payload: ProductFormData, id?: number) {
  if (isMockEnabled) {
    await delay();
    return {
      id: id ?? Math.max(...mockProducts.map((item) => item.id)) + 1,
      ...payload,
      imgUrl: payload.imgUrl ?? "",
      categories: payload.categories.map((category) => ({
        id: category.id,
        name: `Categoria ${category.id}`,
      })),
    } satisfies Product;
  }

  if (id) {
    const response = await apiClient.put<Product>(`/products/${id}`, payload);
    return response.data;
  }

  const response = await apiClient.post<Product>("/products", payload);
  return response.data;
}

export async function deleteProduct(id: number) {
  if (isMockEnabled) {
    await delay();
    return;
  }

  await apiClient.delete(`/products/${id}`);
}

