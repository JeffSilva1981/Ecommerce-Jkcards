import { apiClient } from "./apiClient";
import type { DashboardSummary } from "../types/dashboard";

export async function getDashboardSummary() {
  const response = await apiClient.get<DashboardSummary>("/dashboard");
  return response.data;
}