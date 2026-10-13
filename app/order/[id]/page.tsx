import { Suspense } from "react";
import Header from "@/components/Header";
import OrderDetailClient from "@/components/OrderDetailClient";

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        <Suspense
          fallback={
            <div className="p-16 text-center text-xs text-slate-400">
              주문 상세 정보를 불러오는 중입니다...
            </div>
          }
        >
          <OrderDetailClient />
        </Suspense>
      </main>
    </div>
  );
}
