import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return null;
  return createClient(supabaseUrl, anonKey);
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const { eventType, data } = event;

    console.log(`[Toss Webhook Received] eventType: ${eventType}`, data?.orderId);

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ received: true });
    }

    // 웹훅 수신 로그 기록
    try {
      await supabase.from("payment_logs").insert({
        order_id: data?.orderId || "unknown",
        payment_key: data?.paymentKey || null,
        event_type: `WEBHOOK_${eventType}`,
        amount: data?.totalAmount || 0,
        payload: event,
      });
    } catch (e) {
      console.warn("Webhook log save note:", e);
    }

    // 상태 이벤트별 DB 동기화
    if (eventType === "PAYMENT_STATUS_CHANGED") {
      const { status, paymentKey, orderId } = data;
      let newOrderStatus = "PAID";
      if (status === "CANCELED" || status === "PARTIAL_CANCELED") {
        newOrderStatus = "CANCELLED";
      } else if (status === "DONE") {
        newOrderStatus = "PAID";
      } else if (status === "WAITING_FOR_DEPOSIT") {
        newOrderStatus = "PAYMENT_PENDING";
      }

      await supabase
        .from("orders")
        .update({
          status: newOrderStatus,
          payment_key: paymentKey,
        })
        .or(`order_number.eq.${orderId},id.eq.${orderId}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
