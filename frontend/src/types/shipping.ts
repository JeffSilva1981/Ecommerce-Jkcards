export type ShippingQuoteItem = {
  productId: number;
  quantity: number;
};

export type ShippingQuoteRequest = {
  destinationPostalCode: string;
  items: ShippingQuoteItem[];
};

export type ShippingQuote = {
  serviceId: number;
  serviceName: string;
  carrier: string;
  carrierPicture?: string | null;
  price: number;
  deliveryDays: number;
};