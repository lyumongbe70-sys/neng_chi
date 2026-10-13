import { createClient } from "@/lib/supabase/client";

export interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: "PAYMENT_PENDING" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED";
  statusText: string;
  productName: string;
  price: number;
  quantity: number;
  trackingNumber?: string;
  shippingCompany?: string;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
}

/**
 * Supabase의 orders/Order 테이블 및 로컬 스토리지에서 주문 내역을 영구 삭제합니다.
 */
export async function deleteOrder(orderNumber: string, orderId?: string): Promise<{ success: boolean; error?: string }> {
  const targetNumber = orderNumber || orderId || "";
  const targetId = orderId || orderNumber || "";

  if (!targetNumber && !targetId) {
    return { success: false, error: "주문 식별자가 유효하지 않습니다." };
  }

  const supabase = createClient();

  // 1. Supabase 'orders' 테이블에서 삭제 시도
  try {
    const { error: err1 } = await supabase
      .from("orders")
      .delete()
      .or(`order_number.eq.${targetNumber},id.eq.${targetId},order_number.eq.${targetId},id.eq.${targetNumber}`);

    if (err1) {
      console.warn("orders 테이블 삭제 알림:", err1.message);
    }
  } catch (e) {
    console.warn("orders 테이블 삭제 예외:", e);
  }

  // 2. 혹시 대소문자 구분을 위해 'Order' 테이블로 생성된 경우에도 삭제 시도
  try {
    const { error: err2 } = await supabase
      .from("Order")
      .delete()
      .or(`order_number.eq.${targetNumber},id.eq.${targetId},order_number.eq.${targetId},id.eq.${targetNumber}`);

    if (err2) {
      console.warn("Order 테이블 삭제 알림:", err2.message);
    }
  } catch (e) {
    console.warn("Order 테이블 삭제 예외:", e);
  }

  // 3. 로컬 스토리지 주문 목록(사용자 및 관리자)에서도 완전히 삭제
  if (typeof window !== "undefined") {
    try {
      const userOrders = JSON.parse(localStorage.getItem("vitalcare_user_orders") || "[]");
      const filteredUser = userOrders.filter(
        (o: any) =>
          o.id !== targetNumber &&
          o.id !== targetId &&
          o.orderNumber !== targetNumber &&
          o.orderNumber !== targetId &&
          o.order_number !== targetNumber &&
          o.order_number !== targetId
      );
      localStorage.setItem("vitalcare_user_orders", JSON.stringify(filteredUser));

      const adminOrders = JSON.parse(localStorage.getItem("vitalcare_admin_orders") || "[]");
      const filteredAdmin = adminOrders.filter(
        (o: any) =>
          o.id !== targetNumber &&
          o.id !== targetId &&
          o.orderNumber !== targetNumber &&
          o.orderNumber !== targetId
      );
      localStorage.setItem("vitalcare_admin_orders", JSON.stringify(filteredAdmin));
    } catch (e) {
      console.error("로컬 스토리지 주문 삭제 중 오류:", e);
    }
  }

  return { success: true };
}

/**
 * Supabase 및 로컬 스토리지에서 전체 주문 목록을 불러옵니다.
 */
export async function getOrders(): Promise<OrderItem[]> {
  try {
    const supabase = createClient();
    
    // 1. 'orders' 테이블 조회 시도
    let { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // 2. 없으면 'Order' 테이블 시도
    if (error || !data) {
      const res = await supabase
        .from("Order")
        .select("*")
        .order("created_at", { ascending: false });
      if (!res.error && res.data) {
        data = res.data;
        error = null;
      }
    }

    if (!error && data && data.length > 0) {
      return data.map((o: any) => ({
        id: String(o.id || o.order_number),
        orderNumber: o.order_number || o.id,
        date: o.created_at ? o.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        status: o.status || "PAID",
        statusText:
          o.status === "DELIVERED"
            ? "배송완료"
            : o.status === "SHIPPING"
            ? "배송중"
            : o.status === "PREPARING"
            ? "배송준비"
            : "결제완료",
        productName: o.product_name || o.recipient_name ? `주문 상품 (${o.recipient_name} 님)` : "주문 상품",
        price: Number(o.final_amount || o.total_amount || 0),
        quantity: 1,
        trackingNumber: o.tracking_number,
        shippingCompany: o.shipping_company || o.carrier || "우체국택배",
        recipientName: o.recipient_name,
        recipientPhone: o.recipient_phone,
        shippingAddress: o.shipping_address,
      }));
    }
  } catch (e) {
    console.warn("Supabase 주문 목록 조회 생략:", e);
  }

  // 로컬 스토리지 폴백
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("vitalcare_user_orders");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }

  return [];
}
