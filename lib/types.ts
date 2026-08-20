export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  material: string | null;
  color: string | null;
  gender: "men" | "women" | "unisex" | null;
  stock_quantity: number | null;
  cost: number | null;
  is_featured: boolean;
  is_made_to_order: boolean;
  lead_time_days: number | null;
  is_active: boolean;
  images: ProductImage[];
  category?: Category;
};

export type Banner = {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
};

export type Address = {
  id: string;
  user_id: string;
  city: string;
  address_line: string;
  postal_code: string | null;
  is_default: boolean;
};

export type OrderStatus =
  | "new"
  | "awaiting_payment"
  | "paid"
  | "in_production"
  | "shipped"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  order_number: number;
  user_id: string;
  status: OrderStatus;
  total: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  delivery_city: string;
  delivery_address: string;
  comment: string | null;
  payment_id: string | null;
  created_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  customization: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  customization?: string;
};
