"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/lib/stores/useCartStore";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] = useState<any>(null);

  const { clearCart } = useCartStore();

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setError("결제 승인에 필요한 파라미터가 유실되었습니다.");
      setIsLoading(false);
      return;
    }

    // 세션 스토리지에서 결제 사전 정보 복원
    let orderInfo: any = null;
    try {
      const stored = sessionStorage.getItem(`pending_order_${orderId}`);
      if (stored) {
        orderInfo = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Session order info read error:", e);
    }

    // 서버 승인 API 호출 (/api/payments/confirm)
    async function confirmPayment() {
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            orderInfo,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "토스 결제 승인에 실패했습니다.");
        }

        setConfirmResult(data);
        setIsLoading(false);

        // 로컬 스토리지 주문 목록에도 동기화
        if (typeof window !== "undefined") {
          try {
            const savedOrders = JSON.parse(
              localStorage.getItem("vitalcare_user_orders") || "[]"
            );
            const newOrder = {
              id: orderId,
              orderNumber: orderId,
              customer: orderInfo?.recipientName || "구매자",
              product: orderInfo?.orderName || "건강기능식품",
              amount: Number(amount),
              status: "PAID",
              statusText: "결제완료 (토스 공식승인)",
              date: new Date().toISOString().split("T")[0],
              createdAt: data.approvedAt || new Date().toISOString(),
              paymentKey,
              receiptUrl: data.receiptUrl,
              card: data.card,
              recipientName: orderInfo?.recipientName,
              recipientPhone: orderInfo?.recipientPhone,
              shippingAddress: orderInfo?.shippingAddress,
            };
            localStorage.setItem(
              "vitalcare_user_orders",
              JSON.stringify([newOrder, ...savedOrders])
            );

            // 관리자 주문 목록 동기화
            const adminOrders = JSON.parse(
              localStorage.getItem("vitalcare_admin_orders") || "[]"
            );
            localStorage.setItem(
              "vitalcare_admin_orders",
              JSON.stringify([
                {
                  id: orderId,
                  customer: orderInfo?.recipientName || "구매자",
                  product: orderInfo?.orderName || "건강기능식품",
                  amount: Number(amount),
                  status: "PAID",
                  statusText: "결제완료",
                  tracking: "",
                  carrier: "우체국택배",
                },
                ...adminOrders,
              ])
            );
          } catch (e) {
            console.warn("Local storage update warning:", e);
          }
        }

        // 장바구니 비우기 및 세션 정리
        clearCart();
        try {
          sessionStorage.removeItem(`pending_order_${orderId}`);
        } catch (e) {}

        // 잠시 후 최종 주문 완료 안내 화면으로 이동
        setTimeout(() => {
          router.replace(
            `/order/complete/${orderId}?amount=${amount}&name=${encodeURIComponent(
              orderInfo?.recipientName || "고객"
            )}&phone=${encodeURIComponent(
              orderInfo?.recipientPhone || ""
            )}&address=${encodeURIComponent(orderInfo?.shippingAddress || "")}`
          );
        }, 1500);
      } catch (err: any) {
        console.error("Payment confirmation failed:", err);
        setError(err.message || "결제 승인 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    }

    confirmPayment();
  }, [paymentKey, orderId, amount, clearCart, router]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 w-full max-w-lg shadow-sm text-center space-y-6">
      {isLoading ? (
        <div className="space-y-4 py-8">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <h2 className="text-xl font-black text-slate-900">
            결제 승인 및 주문을 안전하게 처리하고 있습니다...
          </h2>
          <p className="text-xs text-slate-500">
            토스페이먼츠 보안 서버와 주문 데이터를 검증 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      ) : error ? (
        <div className="space-y-4 py-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">결제 승인 실패</h2>
          <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-200">
            {error}
          </p>
          <div className="pt-4 flex gap-2 justify-center">
            <Link
              href="/order"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              다시 주문 시도
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            토스 결제 승인이 완료되었습니다!
          </h2>
          <p className="text-xs text-slate-500">
            주문 완료 화면으로 안전하게 자동 전환됩니다...
          </p>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense
          fallback={
            <div className="text-xs text-slate-400">결제 정보 검증 중...</div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
