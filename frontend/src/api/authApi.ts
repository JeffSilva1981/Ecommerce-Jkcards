import { apiClient } from "./apiClient";
import type { LoginCredentials, User } from "../types/user";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export async function login(credentials: LoginCredentials) {
  const body = new URLSearchParams();
  body.set("grant_type", "password");
  body.set("username", credentials.email);
  body.set("password", credentials.password);

  const basic = btoa(
    `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
  );

  const token = await apiClient.post<TokenResponse>(
    "/oauth2/token",
    body,
    {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const me = await apiClient.get<User>("/users/me", {
    headers: {
      Authorization: `Bearer ${token.data.access_token}`,
    },
  });

  return {
    token: token.data.access_token,
    user: me.data,
  };
}

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export async function registerUser(payload: RegisterPayload) {
  const response = await apiClient.post("/auth/register", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
  });

  return response.data;
}