"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Star,
  XCircle,
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

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-20261005-9012",
    date: "2026.10.05",
    status: "SHIPPING",
    statusText: "배송중",
    productName: "퓨어 알티지(rTG) 초임계 오메가-3 1000",
    price: 42000,
    quantity: 1,
    trackingNumber: "689234125432",
    shippingCompany: "우체국택배",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-20260928-4412",
    date: "2026.09.28",
    status: "DELIVERED",
    statusText: "배송완료",
    productName: "바이탈 올인원 고함량 활력 멀티비타민 & 미네랄 2000 (총 4개월분)",
    price: 68000,
    quantity: 2,
    trackingNumber: "689123849102",
    shippingCompany: "우체국택배",
  },
];

export default function MypageOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);

  // 단계별 카운트 계산
  const statusSteps = [
    { label: "입금대기", count: 0 },
    { label: "결제완료", count: 0 },
    { label: "배송준비", count: 0 },
    { label: "배송중", count: 1 },
    { label: "배송완료", count: 1 },
  ];

  const handleCancelOrder = (orderId: string) => {
    if (confirm("주문을 취소하시겠습니까?")) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      alert("주문이 정상적으로 취소되었습니다.");
    }
  };

  const handleRefund = (orderNumber: string) => {
    alert(`[${orderNumber}] 반품/환불 신청 접수가 완료되었습니다. 택배 기사님이 1~2일 내 방문 수거 예정입니다.`);
  };

  const handleConfirmPurchase = (orderNumber: string) => {
    alert(`[${orderNumber}] 구매가 확정되었습니다! 추가 적립금 300P가 지급되었습니다.`);
  };

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

      {/* 2. 주문/배송 내역 목록 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-base font-bold text-slate-900">최근 주문 내역</h2>
          <span className="text-xs text-slate-400">최근 3개월 기준</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            주문 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl border border-slate-200 space-y-4 bg-slate-50/50"
              >
                {/* 상단 주문 정보 헤더 */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">{order.date}</span>
                    <span className="text-slate-400">|</span>
                    <span className="font-mono text-slate-500">주문번호: {order.orderNumber}</span>
                  </div>

                  <span
                    className={`font-black px-2.5 py-0.5 rounded-full text-xs ${
                      order.status === "DELIVERED"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {order.statusText}
                  </span>
                </div>

                {/* 주문 품목 내용 */}
                <div className="flex items-start justify-between gap-4 pt-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {order.productName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {order.price.toLocaleString()}원 &nbsp;|&nbsp; 수량: {order.quantity}개
                    </p>
                    {order.trackingNumber && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {order.shippingCompany} {order.trackingNumber}
                        </span>
                        <a
                          href={`https://service.epost.go.kr/trace.RetrieveDomRcvNum.comm?sid1=${order.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline font-semibold flex items-center gap-0.5"
                        >
                          배송추적 <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 상태별 액션 버튼군 */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  {order.status === "PREPARING" && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                    >
                      주문 취소
                    </button>
                  )}

                  {order.status === "DELIVERED" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRefund(order.orderNumber)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold"
                      >
                        반품/환불 신청
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmPurchase(order.orderNumber)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                      >
                        구매확정 및 리뷰작성
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
