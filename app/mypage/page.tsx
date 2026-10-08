"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface OrderItem {
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
}

export default function MypageOrdersPage() {
  // 실제 주문 내역 (신규 가입 및 테스트 쇼핑몰 기준 빈 목록)
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // 진행 중인 주문 현황 단계별 카운트 (실제 주문 데이터 기준)
  const statusSteps = [
    { label: "입금대기", count: orders.filter((o) => o.status === "PAYMENT_PENDING").length },
    { label: "결제완료", count: orders.filter((o) => o.status === "PAID").length },
    { label: "배송준비", count: orders.filter((o) => o.status === "PREPARING").length },
    { label: "배송중", count: orders.filter((o) => o.status === "SHIPPING").length },
    { label: "배송완료", count: orders.filter((o) => o.status === "DELIVERED").length },
  ];

  return (
    <div className="space-y-6">
      {/* 1. 진행 중인 주문 현황 5단계 스텝 바 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-800 mb-5">진행 중인 주문 현황</h2>

        <div className="grid grid-cols-5 gap-2 text-center relative">
          {statusSteps.map((step, idx) => (
            <div key={idx} className="space-y-2 relative">
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center font-black text-lg transition-all ${
                  step.count > 0
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step.count}
              </div>
              <span
                className={`text-xs block font-bold ${
                  step.count > 0 ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 최근 주문 내역 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-base font-bold text-slate-900">최근 주문 내역</h2>
          <span className="text-xs text-slate-400">최근 3개월 기준</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-700">최근 주문하신 내역이 없습니다.</p>
            <p className="text-xs text-slate-400">
              안전하고 엄선된 프리미엄 건강기능식품을 만나보세요.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>상품 보러가기</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200 space-y-4 bg-slate-50/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{order.date}</span>
                    <span className="text-slate-400">|</span>
                    <span className="font-mono text-slate-500">주문번호: {order.orderNumber}</span>
                  </div>
                  <span className="font-black px-2.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">
                    {order.statusText}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 pt-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {order.productName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.price.toLocaleString()}원 &nbsp;|&nbsp; 수량: {order.quantity}개
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
