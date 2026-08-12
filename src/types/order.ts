export type OrderStatus =
  | "new"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cash_on_delivery";

export type CustomerDetails = {
  name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  notes?: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  variantId?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
};
