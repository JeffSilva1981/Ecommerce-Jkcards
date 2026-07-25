import type {
  ShippingQuote,
  ShippingQuoteRequest,
} from "../types/shipping";
import { apiClient } from "./apiClient";

type MelhorEnvioAuthorizationStatus = {
  authorized: boolean;
};

export async function calculateShippingQuotes(payload: ShippingQuoteRequest) {
  const response = await apiClient.post<ShippingQuote[]>(
    "/shipping/quotes",
    payload
  );

  return response.data ?? [];
}

export async function getMelhorEnvioAuthorizationStatus() {
  const response =
    await apiClient.get<MelhorEnvioAuthorizationStatus>(
      "/shipping/oauth/status"
    );

  return response.data;
}

export async function getMelhorEnvioAuthorizationUrl() {
  const response = await apiClient.get<string>(
    "/shipping/oauth/authorization-url",
    {
      headers: {
        Accept: "text/plain",
      },
    }
  );

  return response.data;
}