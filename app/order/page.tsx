import { Suspense } from "react";
import OrderCheckoutClient from "@/components/OrderCheckoutClient";

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">주문 페이지를 준비 중입니다...</div>}>
      <OrderCheckoutClient />
    </Suspense>
  );
}
