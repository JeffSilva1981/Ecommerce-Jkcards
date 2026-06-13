import { apiClient } from "./apiClient";
import type { User } from "../types/user";

export async function getUsers() {
  const response = await apiClient.get<{ content: User[] }>("/users");
  return response.data.content;
}