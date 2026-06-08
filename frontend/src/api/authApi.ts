import { apiClient, delay, isMockEnabled } from "./apiClient";
import { mockUsers } from "../mocks/data";
import type { LoginCredentials, User } from "../types/user";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

function createMockToken(user: User) {
  const payload = btoa(
    JSON.stringify({
      username: user.email,
      authorities: user.roles,
    }),
  );
  return `mock.${payload}.token`;
}

export async function login(credentials) {
  console.log("CLIENT_ID =", import.meta.env.VITE_CLIENT_ID);
  console.log("CLIENT_SECRET =", import.meta.env.VITE_CLIENT_SECRET);

  const body = new URLSearchParams();
  body.set("grant_type", "password");
  body.set("username", credentials.email);
  body.set("password", credentials.password);

  const basic = btoa(
    `${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`
  );

  console.log("BASIC =", basic);

  try {
    const token = await apiClient.post("/oauth2/token", body, {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("TOKEN RESPONSE =", token.data);

    const me = await apiClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });

    console.log("ME RESPONSE =", me.data);

    return {
      token: token.data.access_token,
      user: me.data,
    };
  } catch (error: any) {
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    console.log("HEADERS:", error?.response?.headers);
    console.log("ERRO COMPLETO:", error);

    throw error;
  }
}

export async function registerUser(payload: LoginCredentials & { name: string }) {
  if (isMockEnabled) {
    await delay();
    return {
      id: 99,
      name: payload.name,
      email: payload.email,
      roles: ["ROLE_OPERATOR"],
    } satisfies User;
  }

  const response = await apiClient.post<User>("/users", payload);
  return response.data;
}

