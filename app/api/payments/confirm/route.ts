import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase 관리자/서비스 연결 (환경 변수 기반)
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }
  return createClient(supabaseUrl, anonKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      paymentKey,
      orderId,
      amount,
      orderInfo, // { items, recipientName, recipientPhone, shippingAddress, deliveryNote, paymentMethod }
    } = body;

    if (!paymentKey || !orderId || amount === undefined) {
      return NextResponse.json(
        { error: "결제 승인 필수 파라미터가 누락되었습니다." },
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

    // 1. 토스페이먼츠 공식 결제 승인 API 호출
    // Basic auth header: Base64(secretKey + ":")
    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");

    // 멱등성 헤더: 네트워크 재시도 시 중복 승인 방지
    const idempotencyKey = `confirm-${orderId}-${amount}`;

    const tossResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error("Toss confirm failed:", tossData);
      return NextResponse.json(
        {
          error: tossData.message || "토스 결제 승인 처리에 실패했습니다.",
          code: tossData.code,
        },
        { status: tossResponse.status }
      );
    }

    // 2. 승인 결과 검증: 토스 승인 금액과 결제 요청 금액 일치 확인
    if (tossData.totalAmount !== Number(amount)) {
      console.error(
        `Amount mismatch! Requested: ${amount}, Approved: ${tossData.totalAmount}`
      );
      // 보안 위협: 금액 불일치 시 자동 취소 요청 필요
      return NextResponse.json(
        { error: "결제 승인 금액이 일치하지 않아 처리가 중단되었습니다." },
        { status: 400 }
      );
    }

    // 3. Supabase DB에 주문 및 결제 상태 영구 저장
    const supabase = getSupabase();
    if (supabase) {
      try {
        const orderPayload = {
          order_number: orderId,
          user_id: orderInfo?.userId || "guest",
          product_name: tossData.orderName || orderInfo?.orderName || "건강기능식품",
          items: orderInfo?.items || [],
          total_amount: orderInfo?.totalItemPrice || tossData.totalAmount,
          discount_amount: orderInfo?.discountAmount || 0,
          used_points: orderInfo?.usedPoints || 0,
          final_amount: tossData.totalAmount,
          status: "PAID",
          recipient_name: orderInfo?.recipientName || "구매자",
          recipient_phone: orderInfo?.recipientPhone || "",
          shipping_address: orderInfo?.shippingAddress || "",
          delivery_note: orderInfo?.deliveryNote || "문 앞에 놓아주세요",
          payment_method: tossData.method || orderInfo?.paymentMethod || "카드",
          payment_key: paymentKey,
          paid_at: tossData.approvedAt || new Date().toISOString(),
          delivery_status: "PREPARING",
        };

        const { error: insErr } = await supabase.from("orders").insert(orderPayload);
        if (insErr) {
          console.warn("orders insert fallback to Order table:", insErr.message);
          await supabase.from("Order").insert(orderPayload);
        }

        // 결제 감사 로그 기록 (감사 추적용)
        try {
          await supabase.from("payment_logs").insert({
            order_id: orderId,
            payment_key: paymentKey,
            event_type: "CONFIRM_SUCCESS",
            amount: tossData.totalAmount,
            payload: {
              method: tossData.method,
              card: tossData.card || null,
              receipt: tossData.receipt || null,
              approvedAt: tossData.approvedAt,
            },
          });
        } catch (logErr) {
          console.warn("Payment log insert note:", logErr);
        }
      } catch (dbErr) {
        console.error("Supabase order save error:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      paymentKey,
      totalAmount: tossData.totalAmount,
      method: tossData.method,
      approvedAt: tossData.approvedAt,
      receiptUrl: tossData.receipt?.url,
      card: tossData.card,
    });
  } catch (err: any) {
    console.error("Payment confirm server error:", err);
    return NextResponse.json(
      { error: "결제 승인 처리 중 내부 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
