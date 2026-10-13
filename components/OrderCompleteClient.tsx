"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Home, FileText, Package, Truck } from "lucide-react";

export default function OrderCompleteClient() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderNumber = (params?.id as string) || "ORD-DEMO";
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userOrders = JSON.parse(localStorage.getItem("vitalcare_user_orders") || "[]");
        const found = userOrders.find((o: any) => o.id === orderNumber || o.orderNumber === orderNumber);
        if (found) {
          setOrderDetails(found);
        }
      } catch (e) {}
    }
  }, [orderNumber]);

  const amount = orderDetails
    ? orderDetails.amount || orderDetails.finalAmount
    : Number(searchParams.get("amount") || "0");

  const recipientName = orderDetails
    ? orderDetails.recipientName || orderDetails.customer
    : searchParams.get("name") || "고객";

  const recipientPhone = orderDetails
    ? orderDetails.recipientPhone
    : searchParams.get("phone") || "010-****-****";

  const shippingAddress = orderDetails
    ? orderDetails.shippingAddress
    : searchParams.get("address") || "배송지 기본 정보";

  const productName = orderDetails?.product || orderDetails?.productName;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 w-full shadow-sm text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
          ORDER SUCCESSFUL
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          주문이 정상적으로 완료되었습니다!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          주문해주신 상품을 안전하게 포장하여 신속하게 배송해 드리겠습니다.
        </p>
      </div>

      {/* 주문 요약 정보 박스 */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left text-xs space-y-3">
        <div className="flex justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">주문 번호</span>
          <span className="font-mono font-bold text-slate-900">{orderNumber}</span>
        </div>
        {productName && (
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">주문 상품</span>
            <span className="font-bold text-slate-900">{productName}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-500 font-medium">받는 분</span>
          <span className="font-bold text-slate-900">
            {recipientName} ({recipientPhone})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-medium">배송지</span>
          <span className="font-bold text-slate-900 text-right max-w-xs">
            {shippingAddress}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200">
          <span className="text-slate-500 font-medium">최종 결제 금액</span>
          <span className="text-base font-black text-emerald-700">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 버튼 액션 */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          href="/"
          className="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>홈으로 이동</span>
        </Link>

        <Link
          href="/mypage"
          className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>주문 내역 조회</span>
        </Link>
      </div>
    </div>
  );
}
