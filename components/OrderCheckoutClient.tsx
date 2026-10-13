"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useCartStore, CartItem } from "@/lib/stores/useCartStore";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTS as INITIAL_MOCK_PRODUCTS } from "@/lib/data/mockProducts";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  Ticket,
  Coins,
  ArrowRight,
  Pill,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export default function OrderCheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProductId = searchParams.get("productId");

  const { items: cartItems, clearCart, removeItem } = useCartStore();
  const { user: authUser } = useAuthStore();

  // 단독 주문 상품 처리 (directProductId가 있는 경우)
  const [directItem, setDirectItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (directProductId) {
      // 1. 장바구니에서 해당 상품 검색
      const foundInCart = cartItems.find((i) => i.id === directProductId);
      if (foundInCart) {
        setDirectItem(foundInCart);
        return;
      }

      // 2. Mock 또는 Supabase 상품 데이터에서 검색
      const foundMock = INITIAL_MOCK_PRODUCTS.find((p) => p.id === directProductId);
      if (foundMock) {
        setDirectItem({
          id: foundMock.id,
          name: foundMock.name,
          price: foundMock.price,
          originalPrice: foundMock.originalPrice,
          quantity: 1,
          dosage: foundMock.dosage,
          volume: foundMock.volume,
          category: foundMock.category,
          imageUrl: foundMock.imageUrl,
        });
      }
    }
  }, [directProductId, cartItems]);

  // 최종 주문 대상 아이템 목록
  const activeItems: CartItem[] = directItem ? [directItem] : cartItems;

  // 배송지 폼
  const [recipientName, setRecipientName] = useState(authUser?.username || "홍길동");
  const [recipientPhone, setRecipientPhone] = useState("010-1234-5678");
  const [postcode, setPostcode] = useState("06234");
  const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123");
  const [addressDetail, setAddressDetail] = useState("바이탈타워 10층");
  const [deliveryNote, setDeliveryNote] = useState("문 앞에 놓아주세요 (배송 후 문자 부탁드립니다)");

  // 포인트 & 쿠폰
  const [userPoints, setUserPoints] = useState(authUser?.points ?? 1000);
  const [usedPoints, setUsedPoints] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("WELCOME15");

  // 결제 수단
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "TOSSPAY" | "KAKAOPAY" | "TRANSFER">(
    "CARD"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 전자상거래 필수 약관 동의 상태
  const [agreeAll, setAgreeAll] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreePurchase, setAgreePurchase] = useState(true);
  const [agreeFinance, setAgreeFinance] = useState(true);

  const handleToggleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreePrivacy(checked);
    setAgreePurchase(checked);
    setAgreeFinance(checked);
  };

  // 금액 계산
  const totalItemPrice = activeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = totalItemPrice >= 50000 || totalItemPrice === 0 ? 0 : 3000;

  // 쿠폰 할인 계산
  let couponDiscount = 0;
  if (selectedCoupon === "WELCOME15") {
    couponDiscount = Math.round(totalItemPrice * 0.15); // 15% 할인
  } else if (selectedCoupon === "FLAT3000") {
    couponDiscount = 3000;
  }

  const finalAmount = Math.max(0, totalItemPrice + shippingFee - couponDiscount - usedPoints);

  const handleUseAllPoints = () => {
    const maxUsable = Math.min(userPoints, totalItemPrice + shippingFee - couponDiscount);
    if (maxUsable >= 1000) {
      setUsedPoints(maxUsable);
    } else {
      alert("포인트는 1,000P 이상부터 사용 가능합니다.");
    }
  };

  // 토스페이먼츠 공식 SDK 연동 결제 요청
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItems.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    if (!agreePrivacy || !agreePurchase || !agreeFinance) {
      alert("주문 진행을 위해 필수 약관에 동의해주세요.");
      return;
    }

    if (!recipientName || !recipientPhone || !address) {
      alert("수령인 및 배송지 정보를 빠짐없이 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 서버에 주문 사전 검증 및 고유 orderId 발급 요청 (/api/payments/prepare)
      const prepRes = await fetch("/api/payments/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: activeItems.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
          })),
          couponCode: selectedCoupon,
          usedPoints,
          recipientName,
          recipientPhone,
          shippingAddress: `${address} ${addressDetail}`.trim(),
          deliveryNote,
          paymentMethod,
        }),
      });

      const prepData = await prepRes.json();
      if (!prepRes.ok) {
        alert(prepData.error || "주문 사전 생성에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      const { orderId, orderName, amount: serverAmount } = prepData;

      // 2. 세션 스토리지에 주문 복원용 데이터 임시 보관
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `pending_order_${orderId}`,
          JSON.stringify({
            userId: authUser?.id || "guest",
            userEmail: authUser?.email || "user@vitalcare.co.kr",
            orderName,
            recipientName,
            recipientPhone,
            shippingAddress: `${address} ${addressDetail}`.trim(),
            deliveryNote,
            items: activeItems,
            totalItemPrice,
            discountAmount: couponDiscount,
            usedPoints,
            finalAmount: serverAmount,
            paymentMethod,
          })
        );
      }

      // 3. 토스페이먼츠 클라이언트 키 로드
      const clientKey =
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
        "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

      const origin = window.location.origin;
      const successUrl = `${origin}/order/success`;
      const failUrl = `${origin}/order/fail`;

      // 4. 공식 @tosspayments/payment-sdk 동적 로드 및 결제창 호출
      const { loadTossPayments } = await import("@tosspayments/payment-sdk");
      const tossPayments = await loadTossPayments(clientKey);

      // 휴대폰 번호 숫자만 추출 (예: 01012345678)
      const cleanPhone = recipientPhone.replace(/[^0-9]/g, "") || "01012345678";

      if (paymentMethod === "CARD") {
        await tossPayments.requestPayment("카드", {
          amount: serverAmount,
          orderId,
          orderName,
          customerName: recipientName,
          customerMobilePhone: cleanPhone,
          successUrl,
          failUrl,
        });
      } else if (paymentMethod === "TOSSPAY") {
        await tossPayments.requestPayment("토스페이", {
          amount: serverAmount,
          orderId,
          orderName,
          customerName: recipientName,
          customerMobilePhone: cleanPhone,
          successUrl,
          failUrl,
        });
      } else if (paymentMethod === "KAKAOPAY") {
        await tossPayments.requestPayment("카드", {
          amount: serverAmount,
          orderId,
          orderName,
          customerName: recipientName,
          customerMobilePhone: cleanPhone,
          successUrl,
          failUrl,
          flowMode: "DIRECT",
          easyPay: "KAKAOPAY",
        });
      } else {
        await tossPayments.requestPayment("계좌이체", {
          amount: serverAmount,
          orderId,
          orderName,
          customerName: recipientName,
          customerMobilePhone: cleanPhone,
          successUrl,
          failUrl,
        });
      }
    } catch (err: any) {
      console.error("Payment request error:", err);
      // 사용자가 창을 닫았거나 결제 취소 시
      if (err?.code !== "USER_CANCEL") {
        alert(err?.message || "결제 진행 중 오류가 발생했습니다.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={directItem ? "/" : "/cart"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {directItem ? "쇼핑 계속하기" : "장바구니로 돌아가기"}
          </Link>

          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
            Supabase Order 클라우드 연동됨
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-600" />
          <span>주문서 작성 / 결제</span>
        </h1>

        {activeItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 space-y-4 max-w-lg mx-auto shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-700">주문할 상품이 없습니다.</p>
            <p className="text-xs text-slate-400">원하시는 상품의 [주문] 또는 [담기] 버튼을 눌러주세요.</p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
            >
              상품 보러가기
            </Link>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 좌측 폼 영역 (배송지, 주문 상품, 쿠폰/포인트, 결제 수단) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. 배송지 정보 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  배송지 정보
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      수령인 이름
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      연락처
                    </label>
                    <input
                      type="tel"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    배송 주소
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      readOnly
                      value={postcode}
                      className="w-24 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => alert("기본 배송지로 자동 지정되었습니다.")}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
                    >
                      우편번호 검색
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 mb-2"
                  />
                  <input
                    type="text"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="상세주소를 입력해주세요"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    배송 요청사항
                  </label>
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* 2. 쿠폰 및 포인트 할인 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  쿠폰 및 적립금 적용
                </h2>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    할인 쿠폰 선택
                  </label>
                  <select
                    value={selectedCoupon}
                    onChange={(e) => setSelectedCoupon(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="WELCOME15">
                      🎉 [신규회원] 전 품목 15% 웰컴 할인 쿠폰 (-{couponDiscount.toLocaleString()}원)
                    </option>
                    <option value="FLAT3000">
                      🌿 [건강케어] 첫 구매 감사 3,000원 즉시 할인 쿠폰
                    </option>
                    <option value="NONE">쿠폰 적용 안 함</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      보유 적립금 사용
                    </label>
                    <span className="text-xs text-slate-500">
                      보유: <strong className="text-emerald-700">{userPoints.toLocaleString()}P</strong>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      max={userPoints}
                      value={usedPoints}
                      onChange={(e) => setUsedPoints(Number(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={handleUseAllPoints}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      전액사용
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. 결제 수단 선택 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  결제 수단 선택
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "CARD", label: "신용/체크카드", badge: "추천" },
                    { id: "TOSSPAY", label: "토스페이", badge: "간편" },
                    { id: "KAKAOPAY", label: "카카오페이", badge: "간편" },
                    { id: "TRANSFER", label: "계좌이체" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? "border-emerald-600 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-500/20"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div>{method.label}</div>
                      {method.badge && (
                        <span className="text-[9px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                          {method.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. 전자상거래 필수 약관 동의 */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <label className="text-sm font-black text-slate-900 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeAll}
                      onChange={(e) => handleToggleAgreeAll(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                    />
                    <span>주문 및 결제 필수 약관 전체 동의</span>
                  </label>
                  <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    전자금융거래법 준수
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <label className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreePurchase}
                        onChange={(e) => {
                          setAgreePurchase(e.target.checked);
                          if (!e.target.checked) setAgreeAll(false);
                        }}
                        className="w-3.5 h-3.5 text-emerald-600 accent-emerald-600"
                      />
                      <span>[필수] 주문 상품 및 결제 조건 확인 및 구매 동의</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">상세보기</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => {
                          setAgreePrivacy(e.target.checked);
                          if (!e.target.checked) setAgreeAll(false);
                        }}
                        className="w-3.5 h-3.5 text-emerald-600 accent-emerald-600"
                      />
                      <span>[필수] 개인정보 수집 및 제3자(배송/PG) 제공 동의</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">상세보기</span>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer hover:text-slate-900">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agreeFinance}
                        onChange={(e) => {
                          setAgreeFinance(e.target.checked);
                          if (!e.target.checked) setAgreeAll(false);
                        }}
                        className="w-3.5 h-3.5 text-emerald-600 accent-emerald-600"
                      />
                      <span>[필수] 토스페이먼츠 전자금융거래 기본약관 동의</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">상세보기</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 우측 결제 요약 카드 */}
            <div className="lg:col-span-5 space-y-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h2 className="font-bold text-slate-900 text-base border-b pb-3">주문 상품 정보</h2>

                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 space-y-2">
                  {activeItems.map((item) => (
                    <div key={item.id} className="pt-2 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0 relative overflow-hidden flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <Pill className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                          <span className="text-slate-400">수량: {item.quantity}개</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>총 상품금액</span>
                    <span className="font-bold text-slate-900">
                      {totalItemPrice.toLocaleString()}원
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>쿠폰 할인</span>
                      <span className="font-bold">-{couponDiscount.toLocaleString()}원</span>
                    </div>
                  )}

                  {usedPoints > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>적립금 사용</span>
                      <span className="font-bold">-{usedPoints.toLocaleString()}P</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>최종 결제 금액</span>
                    <span className="text-2xl text-emerald-700">
                      {finalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || activeItems.length === 0}
                  className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>주문 데이터 등록 중...</span>
                    </>
                  ) : (
                    <>
                      <span>{finalAmount.toLocaleString()}원 결제 및 주문완료</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supabase Order 테이블 실시간 등록 및 PG 암호화 보안 적용 중</span>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
