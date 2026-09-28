import type { CreateOrderPayload, Order, OrderStatus } from "../types/order";
import type { Page } from "../types/page";
import { apiClient } from "./apiClient";

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiClient.post<Order>("/orders", payload);
  return response.data;
}

export async function getOrderById(id: number) {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function getMyOrders() {
  const response = await apiClient.get<Page<Order>>("/orders/my");
  return response.data?.content ?? [];
}

export type AdminOrderFilters = {
  page: number;
  size: number;
  search?: string;
  status?: OrderStatus | "";
  from?: string;
  until?: string;
};

export async function getAdminOrders(params?: AdminOrderFilters) {
  const response = await apiClient.get<Page<Order>>("/orders", {
    params: { ...params, status: params?.status || undefined, sort: "id,desc" },
  });
  return response.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const response = await apiClient.put<Order>(
    `/orders/${id}/status`,
    { status }
  );

  return response.data;
}

export async function deleteOrder(id: number) {
  await apiClient.delete(`/orders/${id}`);
}
