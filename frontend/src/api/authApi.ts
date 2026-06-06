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

export async function login(credentials: LoginCredentials) {
  if (isMockEnabled) {
    await delay();
    const user = mockUsers.find((item) => item.email === credentials.email);
    if (!user || credentials.password.length < 3) {
      throw new Error("Credenciais invalidas.");
    }
    return {
      token: createMockToken(user),
      user,
    };
  }

  const body = new URLSearchParams();
  body.set("grant_type", "password");
  body.set("username", credentials.email);
  body.set("password", credentials.password);

  const clientId = import.meta.env.VITE_CLIENT_ID ?? "myclientid";
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET ?? "myclientsecret";
  const basic = btoa(`${clientId}:${clientSecret}`);

  const tokenResponse = await apiClient.post<TokenResponse>("/oauth2/token", body, {
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const meResponse = await apiClient.get<User>("/users/me", {
    headers: {
      Authorization: `Bearer ${tokenResponse.data.access_token}`,
    },
  });

  return {
    token: tokenResponse.data.access_token,
    user: meResponse.data,
  };
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

