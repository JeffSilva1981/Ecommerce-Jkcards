import { apiClient, delay, isMockEnabled } from "./apiClient";
import { mockOrders } from "../mocks/data";
import type { CreateOrderPayload, Order, OrderStatus } from "../types/order";

export async function createOrder(payload: CreateOrderPayload) {
  if (isMockEnabled) {
    await delay();
    const items = payload.items.map((item) => ({
      productId: item.productId,
      name: `Produto ${item.productId}`,
      price: item.price,
      quantity: item.quantity,
      subTotal: item.price * item.quantity,
    }));
    const total = items.reduce((sum, item) => sum + item.subTotal, 0);
    return {
      id: Math.floor(Math.random() * 10000),
      moment: new Date().toISOString(),
      status: "WAITING_PAYMENT",
      client: { id: 1, name: "Cliente JKCards" },
      payment: null,
      items,
      total,
    } satisfies Order;
  }

  const response = await apiClient.post<Order>("/orders", payload);
  return response.data;
}

export async function getOrderById(id: number) {
  if (isMockEnabled) {
    await delay();
    const order = mockOrders.find((item) => item.id === id) ?? mockOrders[0];
    return order;
  }

  const response = await apiClient.get<Order>(`/orders/${id}`);
  return response.data;
}

export async function getMyOrders() {
  if (isMockEnabled) {
    await delay();
    return mockOrders;
  }

  const response = await apiClient.get<Order[]>("/orders/my");
  return response.data;
}

export async function getAdminOrders() {
  if (isMockEnabled) {
    await delay();
    return mockOrders;
  }

  const response = await apiClient.get<Order[]>("/orders");
  return response.data;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  if (isMockEnabled) {
    await delay();
    return {
      ...mockOrders.find((item) => item.id === id),
      status,
    };
  }

  const response = await apiClient.put<Order>(`/orders/${id}/status`, { status });
  return response.data;
}

