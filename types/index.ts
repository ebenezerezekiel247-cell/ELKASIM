export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  cloudinary_public_id: string | null;
  stock: number;
  featured: boolean;
  created_at: string;
};

export type CartItem = {
  product_id: string;
  quantity: number;
  product: Product;
};

export type WishlistItem = {
  product_id: string;
  product: Product;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "failed";

export type Order = {
  id: string;
  user_id: string;
  amount: number;
  status: OrderStatus;
  payment_reference: string | null;
  shipping_address: Address;
  created_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
};
