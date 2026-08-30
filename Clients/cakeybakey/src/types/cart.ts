export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  variantId: string;
  size?: string;
  volumeMl?: number;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};
