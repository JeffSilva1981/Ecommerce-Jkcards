import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("shows friendly status label", () => {
    render(<StatusBadge status="WAITING_PAYMENT" />);

    expect(screen.getByText("Aguardando pagamento")).toBeInTheDocument();
  });
});

