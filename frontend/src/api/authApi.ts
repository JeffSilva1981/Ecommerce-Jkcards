import type {
  LoginCredentials,
  User,
} from "../types/user";
import {
  apiClient,
  publicApiClient,
} from "./apiClient";

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type PasswordResetResponse = {
  message: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export async function login(
  credentials: LoginCredentials,
) {
  const token =
    await publicApiClient.post<TokenResponse>(
      "/auth/login",
      {
        email: credentials.email,
        password: credentials.password,
      },
    );

  const me = await apiClient.get<User>(
    "/users/me",
    {
      headers: {
        Authorization:
          `Bearer ${token.data.access_token}`,
      },
    },
  );

  return {
    token: token.data.access_token,
    user: me.data,
  };
}

export async function registerUser(
  payload: RegisterPayload,
) {
  const response =
    await publicApiClient.post(
      "/auth/register",
      {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
      },
    );

  return response.data;
}

export async function requestPasswordReset(
  email: string,
) {
  const response =
    await publicApiClient.post<PasswordResetResponse>(
      "/auth/forgot-password",
      {
        email,
      },
    );

  return response.data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
) {
  const response =
    await publicApiClient.post<PasswordResetResponse>(
      "/auth/reset-password",
      {
        token: payload.token,
        password: payload.password,
      },
    );

  return response.data;
}