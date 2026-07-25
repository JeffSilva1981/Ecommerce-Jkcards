import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingQuote } from "../types/shipping";

export type SelectedShipping = ShippingQuote & {
  destinationPostalCode: string;
  cartSignature: string;
};

type ShippingState = {
  selectedShipping: SelectedShipping | null;
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
        selectedShipping: null,

        selectShipping: (
          quote,
          destinationPostalCode,
          cartSignature
        ) =>
          set({
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