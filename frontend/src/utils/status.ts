import type { OrderStatus } from "../types/order";

export const statusLabels: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const statusClasses: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "border-gold/40 bg-gold/10 text-gold",
  PAID: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  SHIPPED: "border-skybrand/40 bg-skybrand/10 text-skysoft",
  DELIVERED: "border-white/30 bg-white/10 text-white",
  CANCELED: "border-red-400/40 bg-red-400/10 text-red-300",
};

