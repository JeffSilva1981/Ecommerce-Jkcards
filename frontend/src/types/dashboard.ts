import type { OrderStatus } from "./order";

export type DashboardStatusSummary = {
  status: OrderStatus;
  count: number;
};

export type CategoryInventorySummary = {
  categoryId: number;
  categoryName: string;
  inventoryValue: number;
  stockUnits: number;
};

export type DashboardSummary = {
  ordersCount: number;
  grossRevenue: number;
  netRevenue: number;
  averageTicket: number;
  inventoryValue: number;
  productsCount: number;
  stockUnits: number;
  outOfStockProducts: number;
  waitingPaymentOrders: number;
  byStatus: DashboardStatusSummary[];
  inventoryByCategory: CategoryInventorySummary[];
};