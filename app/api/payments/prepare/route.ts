import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/services/productService";

// 배송비 정책: 50,000원 이상 무료, 미만 3,000원
const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

interface OrderItemRequest {
  id: string;
  name: string;
  price?: number;
  quantity: number;
}

interface PrepareOrderRequest {
  items: OrderItemRequest[];
  couponCode?: string;
  usedPoints?: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  deliveryNote?: string;
  paymentMethod: "CARD" | "TOSSPAY" | "KAKAOPAY" | "TRANSFER";
}

export async function POST(req: NextRequest) {
  try {
    const body: PrepareOrderRequest = await req.json();
    const {
      items,
      couponCode,
      usedPoints = 0,
      recipientName,
      recipientPhone,
      shippingAddress,
      deliveryNote = "",
      paymentMethod,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "주문할 상품 목록이 비어있습니다." },
        { status: 400 }
      );
    }

    if (!recipientName || !recipientPhone || !shippingAddress) {
      return NextResponse.json(
        { error: "배송지 및 수령인 필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 1. 서버 기준 상품 가격 및 재고 재검증 (클라이언트 전달 금액 미신뢰)
    let computedTotalItemPrice = 0;
    const verifiedItems = [];

    for (const item of items) {
      const realProduct = await getProductById(item.id);
      if (!realProduct) {
        return NextResponse.json(
          { error: `존재하지 않는 상품입니다. (ID: ${item.id})` },
          { status: 400 }
        );
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      // 품절 검사
      if (typeof realProduct.stock === "number" && realProduct.stock < quantity) {
        return NextResponse.json(
          {
            error: `상품 [${realProduct.name}]의 재고가 부족합니다. (남은 수량: ${realProduct.stock}개)`,
          },
          { status: 400 }
        );
      }

      const itemPrice = realProduct.price;
      computedTotalItemPrice += itemPrice * quantity;

      verifiedItems.push({
        id: realProduct.id,
        name: realProduct.name,
        price: itemPrice,
        quantity,
      });
    }

    // 2. 서버 기준 배송비 계산
    const computedShippingFee =
      computedTotalItemPrice >= FREE_SHIPPING_THRESHOLD || computedTotalItemPrice === 0
        ? 0
        : SHIPPING_FEE;

    // 3. 서버 기준 쿠폰 할인 계산
    let computedDiscount = 0;
    if (couponCode === "WELCOME15") {
      computedDiscount = Math.round(computedTotalItemPrice * 0.15); // 15%
    } else if (couponCode === "FLAT3000") {
      computedDiscount = 3000;
    }

    // 4. 포인트 사용 검증
    const validUsedPoints = Math.max(0, Math.min(Number(usedPoints) || 0, computedTotalItemPrice + computedShippingFee - computedDiscount));

    // 5. 최종 결제 예정 금액 확정
    const computedFinalAmount = Math.max(
      0,
      computedTotalItemPrice + computedShippingFee - computedDiscount - validUsedPoints
    );

    // 6. 안전하고 고유한 주문 번호 생성 (예측 불가 난수 포함)
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `ORD-${Date.now()}-${randomSuffix}`;

    // 주문 상품 요약명
    const primaryItem = verifiedItems[0];
    const orderName =
      verifiedItems.length > 1
        ? `${primaryItem.name} 외 ${verifiedItems.length - 1}건`
        : primaryItem.name;

    return NextResponse.json({
      success: true,
      orderId,
      orderName,
      amount: computedFinalAmount,
      totalItemPrice: computedTotalItemPrice,
      shippingFee: computedShippingFee,
      discountAmount: computedDiscount,
      usedPoints: validUsedPoints,
      items: verifiedItems,
      recipientName,
      recipientPhone,
      shippingAddress,
      deliveryNote,
      paymentMethod,
    });
  } catch (err: any) {
    console.error("Order prepare error:", err);
    return NextResponse.json(
      { error: "주문 사전 생성 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
