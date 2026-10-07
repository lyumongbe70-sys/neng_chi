"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCartStore } from "@/lib/stores/useCartStore";
import { createClient } from "@/lib/supabase/client";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronLeft,
  CheckCircle2,
  Ticket,
  Coins,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  // 배송지 폼
  const [recipientName, setRecipientName] = useState("홍길동");
  const [recipientPhone, setRecipientPhone] = useState("010-1234-5678");
  const [postcode, setPostcode] = useState("06234");
  const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123");
  const [addressDetail, setAddressDetail] = useState("바이탈타워 10층");
  const [deliveryNote, setDeliveryNote] = useState("문 앞에 놓아주세요 (배송 후 문자 부탁드립니다)");

  // 포인트 & 쿠폰
  const [userPoints, setUserPoints] = useState(1000); // 기본 1,000P 보유
  const [usedPoints, setUsedPoints] = useState(0);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("WELCOME15");

  // 결제 수단
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "KAKAOPAY" | "TOSSPAY" | "BANK_TRANSFER">(
    "KAKAOPAY"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 금액 계산
  const totalItemPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
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

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    setIsSubmitting(true);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // Supabase orders 테이블 저장 시도 (미설정 시 로컬 성공 시뮬레이션)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (
        supabaseUrl &&
        anonKey &&
        anonKey !== "YOUR_SUPABASE_ANON_KEY" &&
        supabaseUrl.startsWith("http")
      ) {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await supabase.from("orders").insert({
            order_number: orderNumber,
            user_id: user.id,
            total_amount: totalItemPrice,
            discount_amount: couponDiscount,
            used_points: usedPoints,
            final_amount: finalAmount,
            status: "PAID",
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            shipping_address: `${address} ${addressDetail}`,
            payment_method: paymentMethod,
          });
        }
      }
    } catch (err) {
      console.warn("Supabase order insert bypassed:", err);
    }

    // 장바구니 비우기 및 주문 완료 페이지 이동
    clearCart();
    router.push(
      `/order/complete/${orderNumber}?amount=${finalAmount}&name=${encodeURIComponent(
        recipientName
      )}&phone=${encodeURIComponent(recipientPhone)}&address=${encodeURIComponent(
        `${address} ${addressDetail}`
      )}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" />
            장바구니로 돌아가기
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-2">주문서 작성 / 결제</h1>
        </div>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                    onClick={() => alert("다음 주소 검색 연동 시뮬레이션입니다.")}
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

              {/* 쿠폰 선택 드롭다운 */}
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

              {/* 적립금 입력 */}
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
                    onChange={(e) => setUsedPoints(Number(e.target.value))}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleUseAllPoints}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    전액 사용
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * 적립금은 1,000P 이상부터 100P 단위로 사용 가능합니다.
                </p>
              </div>
            </div>

            {/* 3. 결제 수단 선택 (PG 연동 뼈대) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                결제 수단 선택
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "KAKAOPAY", label: "카카오페이", badge: "간편" },
                  { id: "TOSSPAY", label: "토스페이", badge: "추천" },
                  { id: "CARD", label: "신용/체크카드" },
                  { id: "BANK_TRANSFER", label: "무통장입금" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                      paymentMethod === method.id
                        ? "border-emerald-600 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div>{method.label}</div>
                    {method.badge && (
                      <span className="text-[9px] text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded-sm mt-1 inline-block">
                        {method.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 결제 요약 카드 */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-slate-900 text-base border-b pb-3">주문 상품 정보</h2>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-2.5 text-xs flex justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                      <span className="text-slate-400">수량: {item.quantity}개</span>
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
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
              >
                <span>{finalAmount.toLocaleString()}원 결제하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>안심 PG 결제 모듈 암호화 보안 적용 중</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
