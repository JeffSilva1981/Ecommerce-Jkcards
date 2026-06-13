import { apiClient } from "./apiClient";
import type { CreateOrderPayload, Order, OrderStatus } from "../types/order";

export async function createOrder(payload: CreateOrderPayload) {
  const response = await apiClient.post<Order>("/orders", payload);
  return response.data;
}

export async function getOrderById(id: number) {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function getMyOrders() {
  try {
    const response = await apiClient.get("/orders/my");

    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    return response.data.content;
  } catch (error) {
    console.error("ERRO GET MY ORDERS:", error);
    throw error;
  }
}

export async function getAdminOrders() {
  const response = await apiClient.get<Order[]>("/orders");
  return response.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  const response = await apiClient.put<Order>(
    `/orders/${id}/status`,
    { status }
  );

  return response.data;
}