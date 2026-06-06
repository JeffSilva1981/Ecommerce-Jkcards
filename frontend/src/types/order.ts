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

export type Order = {
  id: number;
  moment: string;
  status: OrderStatus;
  client: {
    id: number;
    name: string;
  };
  payment?: {
    id: number;
    moment: string;
  } | null;
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

