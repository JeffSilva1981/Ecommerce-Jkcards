import { beforeEach, describe, expect, it } from "vitest";
import type { ProductSummary } from "../types/product";
import { useCartStore } from "./cartStore";

const product: ProductSummary = {
  id: 1,
  name: "Booster Teste",
  price: 25,
  imgUrl: "https://example.com/card.jpg",
  stockQuantity: 10,
  available: true,
  maxQuantityPerOrder: null,
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds products and calculates totals", () => {
    const added = useCartStore.getState().addItem(product, 2);

    expect(added).toBe(true);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().totalItems()).toBe(2);
    expect(useCartStore.getState().totalPrice()).toBe(50);
  });

  it("increments, decrements and removes products", () => {
    useCartStore.getState().addItem(product);

    const incremented = useCartStore
      .getState()
      .increment(product.id);

    expect(incremented).toBe(true);
    expect(useCartStore.getState().totalItems()).toBe(2);

    useCartStore.getState().decrement(product.id);

    expect(useCartStore.getState().totalItems()).toBe(1);

    useCartStore.getState().removeItem(product.id);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});