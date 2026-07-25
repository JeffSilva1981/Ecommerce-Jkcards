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

export type ShippingAddress = {
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type OrderShipping = {
  serviceId: number;
  serviceName: string;
  carrier: string;
  price: number;
  deliveryDays?: number | null;
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
  shippingAddress?: ShippingAddress | null;
  shipping?: OrderShipping | null;
  items: OrderItem[];
  productsTotal?: number;
  total: number;
};

export type CreateOrderPayload = {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  shipping: {
    serviceId: number;
  };
};