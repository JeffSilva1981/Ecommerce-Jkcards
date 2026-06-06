import { apiClient, delay, isMockEnabled } from "./apiClient";
import { mockUsers } from "../mocks/data";
import type { User } from "../types/user";

export async function getUsers() {
  if (isMockEnabled) {
    await delay();
    return mockUsers;
  }

  const response = await apiClient.get<User[]>("/users");
  return response.data;
}

