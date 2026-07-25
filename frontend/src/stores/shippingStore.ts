import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeliveryMethod } from "../types/order";
import type { ShippingQuote } from "../types/shipping";

export type SelectedShipping = ShippingQuote & {
  destinationPostalCode: string;
  cartSignature: string;
};

type ShippingState = {
  deliveryMethod: DeliveryMethod;
  selectedShipping: SelectedShipping | null;
  selectDeliveryMethod: (method: DeliveryMethod) => void;
  selectShipping: (
    quote: ShippingQuote,
    destinationPostalCode: string,
    cartSignature: string
  ) => void;
  clearShipping: () => void;
};

export const useShippingStore =
  create<ShippingState>()(
    persist(
      (set) => ({
        deliveryMethod: "SHIPPING",
        selectedShipping: null,

        selectDeliveryMethod: (method) =>
          set((state) => ({
            deliveryMethod: method,
            selectedShipping: method === "PICKUP"
              ? null
              : state.selectedShipping,
          })),

        selectShipping: (
          quote,
          destinationPostalCode,
          cartSignature
        ) =>
          set({
            deliveryMethod: "SHIPPING",
            selectedShipping: {
              ...quote,
              destinationPostalCode,
              cartSignature,
            },
          }),

        clearShipping: () =>
          set({
            selectedShipping: null,
          }),
      }),
      {
        name: "jkcards-shipping",
      }
    )
  );