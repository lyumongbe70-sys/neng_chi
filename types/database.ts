export type UserRole = "USER" | "ADMIN";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProductItem {
  id: string;
  category_id: number | null;
  title: string;
  description: string | null;
  original_price: number;
  sale_price: number;
  stock_quantity: number;
  is_one_plus_one: boolean;
  is_deal: boolean;
  deal_end_at: string | null;
  badge_text: string | null;
  thumbnail_url: string | null;
  images: string[];
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartRecord {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: ProductItem;
}

export interface WishlistRecord {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: ProductItem;
}

export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAID"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REFUNDED";

export type PaymentMethod = "CARD" | "KAKAOPAY" | "TOSSPAY" | "BANK_TRANSFER";

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  discount_amount: number;
  used_points: number;
  final_amount: number;
  status: OrderStatus;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  tracking_number: string | null;
  shipping_company: string | null;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: ProductItem;
}

export type BoardType = "NOTICE" | "QNA" | "FREE" | "RESERVATION";

export interface BoardRecord {
  id: string;
  user_id: string;
  type: BoardType;
  title: string;
  content: string;
  is_secret: boolean;
  is_answered: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface ReviewRecord {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  content: string;
  images: string[];
  created_at: string;
  author_name?: string;
}

export interface PopupRecord {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}
