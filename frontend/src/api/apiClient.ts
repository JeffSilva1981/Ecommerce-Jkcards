import axios from "axios";
import { useAuthStore } from "../stores/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const isMockEnabled = import.meta.env.VITE_ENABLE_MOCKS !== "false";

export function delay(ms = 250) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

