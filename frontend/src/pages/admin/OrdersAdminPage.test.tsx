import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { vi, it, expect, beforeEach } from "vitest";
import { OrdersAdminPage } from "./OrdersAdminPage";
import { getAdminOrders, deleteOrder } from "../../api/ordersApi";
vi.mock("../../api/ordersApi", () => ({ getAdminOrders: vi.fn(), deleteOrder: vi.fn(), updateOrderStatus: vi.fn() }));
const order = { id: 42, moment: "2026-09-20T12:00:00Z", status: "PAID" as const, client: { id: 1, name: "Maria" }, total: 100, items: [{ productId: 1, name: "Booster", quantity: 2, price: 50 }] };
function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}><MemoryRouter><OrdersAdminPage /></MemoryRouter></QueryClientProvider>);
}
beforeEach(() => { vi.resetAllMocks(); vi.mocked(getAdminOrders).mockResolvedValue({ content: [order], totalPages: 3, totalElements: 21, size: 10, number: 0 }); });
it("loads subsequent pages and resets pagination when applying server filters", async () => {
  const user = userEvent.setup(); setup();
  await screen.findByText("Pedido #42");
  await user.click(screen.getByText("Próxima"));
  await waitFor(() => expect(getAdminOrders).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, size: 10 })));
  await user.type(screen.getByLabelText("Cliente ou número do pedido"), "Maria");
  await user.selectOptions(screen.getByLabelText("Status do pedido"), "PAID");
  await user.click(screen.getByText("Aplicar filtros"));
  await waitFor(() => expect(getAdminOrders).toHaveBeenLastCalledWith(expect.objectContaining({ page: 0, search: "Maria", status: "PAID" })));
  await user.click(screen.getByText("Limpar filtros"));
  expect(screen.getByLabelText("Cliente ou número do pedido")).toHaveValue("");
});
it("shows inline items and preserves deletion confirmation", async () => {
  const user = userEvent.setup(); const confirm = vi.spyOn(window, "confirm").mockReturnValue(false); setup();
  await screen.findByText("Pedido #42");
  await user.click(screen.getByText(/Itens e entrega/));
  expect(screen.getByText("2 × Booster")).toBeVisible();
  await user.click(screen.getByText("Excluir"));
  expect(confirm).toHaveBeenCalled(); expect(deleteOrder).not.toHaveBeenCalled(); confirm.mockRestore();
});
it("returns to the preceding page when the final page becomes empty", async () => {
  vi.mocked(getAdminOrders).mockImplementation(async (params) => params?.page === 2
    ? { content: [], totalPages: 2, totalElements: 20, size: 10, number: 2 }
    : { content: [order], totalPages: 3, totalElements: 21, size: 10, number: params?.page ?? 0 });
  const user = userEvent.setup(); setup(); await screen.findByText("Pedido #42");
  await user.click(screen.getByLabelText("Ir para a página 3"));
  await waitFor(() => expect(getAdminOrders).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 })));
});
