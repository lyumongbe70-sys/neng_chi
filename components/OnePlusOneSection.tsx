"use client";

import Link from "next/link";
import { Sparkles, ShoppingBag, Star, CheckCircle2, Pill } from "lucide-react";
import { useCartStore } from "@/lib/stores/useCartStore";

const ONE_PLUS_ONE_PRODUCTS = [
  {
    id: "p-vitamin-01",
    name: "[1+1 기획] 활력 데일리 멀티비타민 미네랄 2000 (총 4개월분)",
    desc: "1박스 구매 시 1박스 추가 증정! 비타민 B군 8종 2000% 고함량 에너지",
    originalPrice: 68000,
    price: 34000,
    discountRate: 50,
    rating: 4.92,
    reviewCount: 1280,
    volume: "120정 (4개월분)",
    dosage: "1일 1회, 1정",
  },
  {
    id: "p-omega-01",
    name: "[1+1 기획] 초임계 알티지(rTG) 오메가3 1000 + 저분자 피쉬콜라겐",
    desc: "혈행·눈건강 오메가3와 탄력 충전 피쉬콜라겐 세트 더블 혜택",
    originalPrice: 84000,
    price: 42000,
    discountRate: 50,
    rating: 4.88,
    reviewCount: 890,
    volume: "120캡슐 (2개월분)",
    dosage: "1일 1회, 2캡슐",
  },
];

export default function OnePlusOneSection() {
  const { addItem } = useCartStore();

  return (
    <section id="one-plus-one" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              1+1 정기 기획전
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              하나 사면 하나 더! 더블 찬스 기획전
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            가족, 연인과 함께 건강을 나누는 스마트한 1+1 패키지입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ONE_PLUS_ONE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/30 via-white to-slate-50 p-6 flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden"
            >
              {/* 1+1 엠블럼 */}
              <div className="absolute top-4 right-4 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                1 + 1 혜택
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    더블 기획세트
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{prod.volume}</span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 my-3">
                  <Pill className="w-8 h-8" />
                </div>

                <Link
                  href={`/products/${prod.id}`}
                  className="font-black text-lg text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                >
                  {prod.name}
                </Link>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {prod.desc}
                </p>

                {/* 평점 */}
                <div className="flex items-center gap-1.5 mt-3 text-xs">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-extrabold text-slate-800">{prod.rating}</span>
                  <span className="text-slate-400">({prod.reviewCount.toLocaleString()}건)</span>
                </div>
              </div>

              {/* 가격 및 담기 버튼 */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">
                    {prod.originalPrice.toLocaleString()}원
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-rose-600">
                      {prod.discountRate}%
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {prod.price.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      originalPrice: prod.originalPrice,
                      quantity: 1,
                      dosage: prod.dosage,
                    })
                  }
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>1+1 장바구니 담기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
