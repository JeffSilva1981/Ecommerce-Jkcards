import type { OrderStatus } from "./order";

export type DashboardStatusSummary = {
  status: OrderStatus;
  count: number;
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
};