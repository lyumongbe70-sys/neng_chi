import { Suspense } from "react";
import Header from "@/components/Header";
import OrderCompleteClient from "@/components/OrderCompleteClient";

export default function OrderCompletePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 w-full flex flex-col items-center justify-center">
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs text-slate-400">
              주문 정보를 불러오는 중입니다...
            </div>
          }
        >
          <OrderCompleteClient />
        </Suspense>
      </main>
    </div>
  );
}
