import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Product,
  ProductSummary,
} from "../types/product";

type CartProduct = Product | ProductSummary;

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imgUrl?: string;
  quantity: number;

  // Opcionais para aceitar carrinhos salvos antes da atualização.
  available?: boolean;
  stockQuantity?: number;
  maxQuantityPerOrder?: number | null;
};

type CartState = {
  items: CartItem[];
  addItem: (
    product: CartProduct,
    quantity?: number,
  ) => boolean;
  removeItem: (productId: number) => void;
  increment: (productId: number) => boolean;
  decrement: (productId: number) => void;
  syncProduct: (product: CartProduct) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

function normalizeStock(stock: number | undefined) {
  return Number.isSafeInteger(stock) && (stock ?? 0) >= 0
    ? (stock as number)
    : 0;
}

function normalizeLimit(
  limit: number | null | undefined,
): number | null {
  if (limit == null) {
    return null;
  }

  return Number.isSafeInteger(limit) && limit > 0
    ? limit
    : 0;
}

export function getCartItemMaxQuantity(
  item: Pick<
    CartItem,
    "available" | "stockQuantity" | "maxQuantityPerOrder"
  >,
) {
  if (item.available !== true) {
    return 0;
  }

  const stock = normalizeStock(item.stockQuantity);
  const limit = normalizeLimit(item.maxQuantityPerOrder);

  return limit === null
    ? stock
    : Math.min(stock, limit);
}

function getProductData(product: CartProduct) {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    imgUrl: product.imgUrl,
    available: product.available === true,
    stockQuantity: normalizeStock(product.stockQuantity),
    maxQuantityPerOrder: normalizeLimit(
      product.maxQuantityPerOrder,
    ),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        if (
          !Number.isSafeInteger(quantity) ||
          quantity <= 0 ||
          !Number.isSafeInteger(product.id) ||
          product.id <= 0 ||
          !Number.isFinite(product.price) ||
          product.price <= 0
        ) {
          return false;
        }

        const productData = getProductData(product);
        const maximum = getCartItemMaxQuantity(productData);

        // Atualiza os dados de um item que já está no carrinho.
        get().syncProduct(product);

        if (maximum <= 0) {
          return false;
        }

        const current = get().items.find(
          (item) => item.productId === product.id,
        );

        const nextQuantity =
          (current?.quantity ?? 0) + quantity;

        if (
          !Number.isSafeInteger(nextQuantity) ||
          nextQuantity > maximum
        ) {
          return false;
        }

        set((state) => ({
          items: current
            ? state.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...productData,
                      quantity: nextQuantity,
                    }
                  : item,
              )
            : [
                ...state.items,
                {
                  ...productData,
                  quantity,
                },
              ],
        }));

        return true;
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId,
          ),
        })),

      increment: (productId) => {
        const current = get().items.find(
          (item) => item.productId === productId,
        );

        if (!current) {
          return false;
        }

        const maximum = getCartItemMaxQuantity(current);
        const nextQuantity = current.quantity + 1;

        if (
          !Number.isSafeInteger(nextQuantity) ||
          nextQuantity > maximum
        ) {
          return false;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: nextQuantity }
              : item,
          ),
        }));

        return true;
      },

      decrement: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity: Math.max(0, item.quantity - 1),
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      syncProduct: (product) => {
        const productData = getProductData(product);

        // Mantém a quantidade para a tela informar eventuais
        // problemas, sem remover ou reduzir itens silenciosamente.
        set((state) => {
          if (
            !state.items.some(
              (item) => item.productId === product.id,
            )
          ) {
            return state;
          }

          return {
            items: state.items.map((item) =>
              item.productId === product.id
                ? {
                    ...item,
                    ...productData,
                  }
                : item,
            ),
          };
        });
      },

      clear: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "jkcards-cart",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);