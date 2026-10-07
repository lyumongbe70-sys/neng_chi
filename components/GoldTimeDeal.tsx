"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Clock, Truck, ShieldCheck, ShoppingBag, Star, Zap } from "lucide-react";
import { useCartStore } from "@/lib/stores/useCartStore";

export default function GoldTimeDeal() {
  const { addItem } = useCartStore();

  // 자정까지 실시간 카운트다운 타이머
  const [timeLeft, setTimeLeft] = useState({
    hours: "11",
    minutes: "42",
    seconds: "18",
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const dealProduct = {
    id: "p-probiotics-01",
    name: "[타임특가] 100억 생유산균 신바이오틱스 데일리 프리미엄 2개월분",
    originalPrice: 52000,
    salePrice: 36000,
    discountRate: 31,
    rating: 4.95,
    reviewCount: 2410,
    soldPercent: 82,
    dosage: "1일 1회, 1캡슐 아침 공복 섭취",
  };

  const handleAddToCart = () => {
    addItem({
      id: dealProduct.id,
      name: dealProduct.name,
      price: dealProduct.salePrice,
      originalPrice: dealProduct.originalPrice,
      quantity: 1,
      dosage: dealProduct.dosage,
    });
  };

  return (
    <section id="deal" className="py-12 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 섹션 타이틀 & 카운트다운 타이머 바 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-black border border-rose-200 mb-2">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              쿠팡형 골드박스 타임특가
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              오늘 단 하루! 마감 임박 타임세일
            </h2>
          </div>

          {/* 실시간 HH:MM:SS 시계 */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-lg shadow-slate-900/10">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">남은 시간</span>
            <div className="flex items-center gap-1 font-mono font-black text-lg sm:text-xl text-amber-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg">{timeLeft.hours}</span>
              <span>:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg">{timeLeft.minutes}</span>
              <span>:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded-lg">{timeLeft.seconds}</span>
            </div>
          </div>
        </div>

        {/* 타임특가 상품 대형 쇼케이스 카드 */}
        <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-xl shadow-amber-900/5 p-6 sm:p-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 좌측: 상품 이미지 & 빠른배송 뱃지 */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-50/60 to-emerald-50/40 border border-slate-100 flex flex-col items-center justify-center p-8 relative">
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-md">
                  오늘만 31% 할인
                </span>
                <div className="w-28 h-28 rounded-3xl bg-white shadow-md flex items-center justify-center text-emerald-600 mb-3">
                  <Zap className="w-16 h-16" />
                </div>
                <span className="text-xs font-bold text-slate-600">60캡슐 (2개월분)</span>
                <span className="text-[11px] text-slate-400 mt-0.5">식약처 100억 보장 생유산균</span>
              </div>
            </div>

            {/* 우측: 상품 디테일 & 구매 바 */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                  로켓안심배송
                </span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  내일 오전 7시 전 도착 보장
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {dealProduct.name}
              </h3>

              {/* 평점 */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-extrabold text-slate-800">{dealProduct.rating}</span>
                <span className="text-slate-400">({dealProduct.reviewCount.toLocaleString()}개 리뷰)</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">유통기한 넉넉 18개월 이상</span>
              </div>

              {/* 가격 영역 */}
              <div className="pt-2">
                <div className="text-xs text-slate-400 line-through">
                  {dealProduct.originalPrice.toLocaleString()}원
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-600">
                    {dealProduct.discountRate}%
                  </span>
                  <span className="text-3xl font-black text-slate-900">
                    {dealProduct.salePrice.toLocaleString()}
                  </span>
                  <span className="text-base font-bold text-slate-800">원</span>
                </div>
              </div>

              {/* 잔여 수량 프로그레스 바 (쿠팡 스타일 긴박감) */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    현재 {dealProduct.soldPercent}% 소진 (마감 임박)
                  </span>
                  <span className="text-slate-400">한정수량 50개 남음</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${dealProduct.soldPercent}%` }}
                  />
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>특가로 바로 담기</span>
                </button>
                <Link
                  href={`/products/${dealProduct.id}`}
                  className="py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm text-center transition-colors"
                >
                  상세정보 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
