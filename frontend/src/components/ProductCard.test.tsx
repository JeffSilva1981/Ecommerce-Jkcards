import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";

const product = {
  id: 1,
  name: "Booster Eclipse Azul",
  price: 29.9,
  imgUrl: "https://example.com/card.jpg",
  stockQuantity: 10,
};

describe("ProductCard", () => {
  it("renders product data and triggers add action", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(
      <MemoryRouter>
        <ProductCard product={product} onAdd={onAdd} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Booster Eclipse Azul")).toBeInTheDocument();
    expect(screen.getByText("R$ 29,90")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    expect(onAdd).toHaveBeenCalledWith(product);
  });
});