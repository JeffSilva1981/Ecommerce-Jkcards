import type { OrderStatus } from "./order";

export type DashboardSummary = {
  ordersCount: number;
  grossRevenue: number;
  netRevenue: number;
  averageTicket: number;
  byStatus: Array<{
    status: OrderStatus;
    count: number;
  }>;
};

