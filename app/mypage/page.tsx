"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Truck,
  CreditCard,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { deleteOrder, getOrders, OrderItem } from "@/lib/services/orderService";

export default function MypageOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
      setIsLoading(false);
    };

    load();
  }, [user]);

  // 주문 내역 삭제 (Supabase Order/orders 테이블 및 로컬 스토리지 동시 삭제)
  const handleDeleteOrder = async (orderNumber: string, orderId: string) => {
    const isConfirmed = window.confirm(
      `주문번호 [${orderNumber}] 내역을 삭제하시겠습니까?\n삭제하시면 Order 테이블과 화면에서 즉시 영구 삭제됩니다.`
    );
    if (!isConfirmed) return;

    setDeletingId(orderNumber);
    try {
      const res = await deleteOrder(orderNumber, orderId);
      if (res.success) {
        setOrders((prev) =>
          prev.filter((o) => o.orderNumber !== orderNumber && o.id !== orderId)
        );
        alert(`주문번호 [${orderNumber}] 내역이 Order 테이블 및 목록에서 삭제되었습니다.`);
      } else {
        alert("주문 내역 삭제에 실패했습니다: " + res.error);
      }
    } catch (err: any) {
      alert("주문 삭제 중 오류가 발생했습니다: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

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
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              최근 주문한 상품 목록 ({orders.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              주문 상세 확인 및 취소/삭제를 진행할 수 있습니다.
            </p>
          </div>
          <span className="text-xs text-slate-400">최근 3개월 기준</span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            <p>주문 내역을 불러오는 중입니다...</p>
          </div>
        ) : orders.length === 0 ? (
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
            {orders.map((order) => {
              const isDeleting = deletingId === order.orderNumber;

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-slate-200 space-y-4 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">{order.date}</span>
                      <span className="text-slate-400">|</span>
                      <Link
                        href={`/order/${order.orderNumber}`}
                        className="font-mono text-emerald-600 hover:text-emerald-700 hover:underline font-bold cursor-pointer"
                        title="주문서 및 배송 상세 정보 보기"
                      >
                        주문번호: {order.orderNumber}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black px-2.5 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">
                        {order.statusText}
                      </span>

                      {/* 주문 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.orderNumber, order.id)}
                        disabled={isDeleting}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer disabled:opacity-50"
                        title="주문 내역 삭제 (Order 테이블에서 삭제)"
                        aria-label="주문 내역 삭제"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>삭제 중...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-600">주문 삭제</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {order.productName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {order.price.toLocaleString()}원 &nbsp;|&nbsp; 수량: {order.quantity}개
                      </p>
                      {order.shippingCompany && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {order.shippingCompany} {order.trackingNumber ? `(${order.trackingNumber})` : ""}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/order/${order.orderNumber}`}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-bold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>주문 상세내용</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
