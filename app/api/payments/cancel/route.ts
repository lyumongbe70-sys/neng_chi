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
    const body = await req.json();
    const { paymentKey, cancelReason = "고객 요청 취소" } = body;

    if (!paymentKey) {
      return NextResponse.json(
        { error: "취소할 결제 키(paymentKey)가 필요합니다." },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "서버에 결제 시크릿 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");
    const idempotencyKey = `cancel-${paymentKey}-${Date.now()}`;

    // 토스 공식 취소 API 호출
    const tossResponse = await fetch(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          cancelReason,
        }),
      }
    );

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error("Toss cancel failed:", tossData);
      return NextResponse.json(
        { error: tossData.message || "결제 취소 처리에 실패했습니다.", code: tossData.code },
        { status: tossResponse.status }
      );
    }

    // DB 주문 상태를 CANCELLED/REFUNDED로 업데이트
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from("orders")
          .update({
            status: "CANCELLED",
            cancel_reason: cancelReason,
          })
          .eq("payment_key", paymentKey);

        await supabase.from("payment_logs").insert({
          order_id: tossData.orderId,
          payment_key: paymentKey,
          event_type: "REFUND",
          amount: tossData.cancels?.[0]?.cancelAmount || tossData.totalAmount,
          payload: tossData,
        });
      } catch (dbErr) {
        console.warn("DB update after cancel error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "결제가 성공적으로 취소/환불되었습니다.",
      cancelData: tossData,
    });
  } catch (err: any) {
    console.error("Cancel API server error:", err);
    return NextResponse.json(
      { error: "결제 취소 처리 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
