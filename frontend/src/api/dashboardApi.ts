import { apiClient, delay, isMockEnabled } from "./apiClient";
import { mockDashboard } from "../mocks/data";
import type { DashboardSummary } from "../types/dashboard";

export async function getDashboardSummary() {
  if (isMockEnabled) {
    await delay();
    return mockDashboard;
  }

  const response = await apiClient.get<DashboardSummary>("/admin/dashboard");
  return response.data;
}

