import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "./cartStore";

const product = {
  id: 1,
  name: "Booster Teste",
  price: 25,
  imgUrl: "https://example.com/card.jpg",
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds products and calculates totals", () => {
    useCartStore.getState().addItem(product, 2);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().totalItems()).toBe(2);
    expect(useCartStore.getState().totalPrice()).toBe(50);
  });

  it("increments, decrements and removes products", () => {
    useCartStore.getState().addItem(product);
    useCartStore.getState().increment(product.id);
    useCartStore.getState().decrement(product.id);
    useCartStore.getState().removeItem(product.id);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

