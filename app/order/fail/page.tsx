"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "PAY_PROCESS_FAILED";
  const message =
    searchParams.get("message") || "사용자에 의해 결제가 취소되었거나 처리되지 않았습니다.";
  const orderId = searchParams.get("orderId");

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 w-full max-w-lg shadow-sm text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-600/10">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div>
        <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
          PAYMENT FAILED
        </span>
        <h1 className="text-2xl font-black text-slate-900 mt-1">
          결제가 완료되지 않았습니다
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          카드 한도 초과, 잔액 부족 또는 사용자에 의한 결제창 취소일 수 있습니다.
        </p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-500">실패 사유</span>
          <span className="font-bold text-rose-600">{message}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">오류 코드</span>
          <span className="font-mono text-slate-700">{code}</span>
        </div>
        {orderId && (
          <div className="flex justify-between">
            <span className="text-slate-500">임시 주문 번호</span>
            <span className="font-mono text-slate-700">{orderId}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          href="/order"
          className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
        >
          <RotateCcw className="w-4 h-4" />
          다시 결제하기
        </Link>
        <Link
          href="/"
          className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Home className="w-4 h-4" />
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense
          fallback={
            <div className="text-xs text-slate-400">결제 실패 정보 확인 중...</div>
          }
        >
          <PaymentFailContent />
        </Suspense>
      </main>
    </div>
  );
}
