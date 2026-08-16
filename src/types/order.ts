export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod";

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
  volumeMl?: number;
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
