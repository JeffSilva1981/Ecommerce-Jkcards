export type OrderStatus =
  | "WAITING_PAYMENT"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
  subTotal?: number;
};

export type Payment = {
  id: number;
  moment: string | null;
  checkoutUrl?: string;
  paymentStatus?: string;
};

export type Order = {
  id: number;
  moment: string;
  status: OrderStatus;
  client: {
    id: number;
    name: string;
  };
  payment?: Payment | null;
  items: OrderItem[];
  total: number;
};

export type CreateOrderPayload = {
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
};