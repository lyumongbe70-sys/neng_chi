"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/lib/stores/useCartStore";

interface SpecialProduct {
  id: string;
  categorySpec: string;
  name: string;
  originalPrice: number;
  price: number;
  discountRate: number;
  rating: number;
  imageUrl: string;
  tags: { text: string; color: "rose" | "red" }[];
}

const SPECIAL_PRODUCTS: SpecialProduct[] = [
  {
    id: "sp-vitamin-c-1000",
    categorySpec: "비타민C | 1,000mg + 비타민D, 아연",
    name: "프리미엄 트리플 비타민C 1000",
    originalPrice: 48000,
    price: 19200,
    discountRate: 60,
    rating: 4.9,
    imageUrl: "/special-deal-1.png",
    tags: [
      { text: "신규 상품", color: "rose" },
      { text: "공구 진행 중", color: "red" },
    ],
  },
  {
    id: "sp-vitamin-b-complex",
    categorySpec: "비타민 B군 | 비타민 B1 50mg 외 7종",
    name: "메리트비 비타민B 콤플렉스",
    originalPrice: 59000,
    price: 11800,
    discountRate: 80,
    rating: 4.8,
    imageUrl: "/special-deal-2.png",
    tags: [{ text: "공구 진행 중", color: "red" }],
  },
  {
    id: "sp-vitamin-d-2000iu",
    categorySpec: "비타민D | 2,000IU",
    name: "종근당건강 비타민D 2000IU 1+1",
    originalPrice: 61937,
    price: 19200,
    discountRate: 69,
    rating: 4.9,
    imageUrl: "/special-deal-3.png",
    tags: [{ text: "공구 진행 중", color: "red" }],
  },
  {
    id: "sp-vitamin-e-complex",
    categorySpec: "비타민E | 400IU",
    name: "비타민E 콤플렉스",
    originalPrice: 88500,
    price: 17700,
    discountRate: 80,
    rating: 4.9,
    imageUrl: "/special-deal-4.png",
    tags: [
      { text: "신규 상품", color: "rose" },
      { text: "공구 진행 중", color: "red" },
    ],
  },
];

export default function OnePlusOneSection() {
  const { addItem } = useCartStore();

  return (
    <section id="one-plus-one" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black border border-rose-200 mb-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              특별 가격 공동구매 기획전
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              MD 엄선 특별 가격 &amp; 1+1 기획 특가전
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            인기 비타민 라인업 최대 80% 한정수량 특별 할인 찬스입니다.
          </p>
        </div>

        {/* 4분할 상품 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {SPECIAL_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* 썸네일 이미지 및 특별가격 뱃지 */}
                <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 좌측 상단 특별가격 톱니바퀴형 배지 */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-rose-600 text-white text-[11px] font-black leading-tight text-center shadow-md shadow-rose-600/30">
                      특별<br />가격
                    </span>
                  </div>
                </div>

                {/* 텍스트 정보 */}
                <div className="p-3 sm:p-4 space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-medium block truncate">
                    {prod.categorySpec}
                  </span>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                    {prod.name}
                  </h3>

                  {/* 원래 가격 */}
                  <div className="text-[11px] text-slate-400 line-through pt-1">
                    {prod.originalPrice.toLocaleString()}원
                  </div>

                  {/* 할인율 및 판매가 */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-black text-rose-600">
                      {prod.discountRate}%
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      {prod.price.toLocaleString()}원
                    </span>
                  </div>

                  {/* 신규 상품 / 공구 진행 중 태그 */}
                  <div className="flex flex-wrap items-center gap-1 pt-1.5">
                    {prod.tags.map((t, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          t.color === "rose"
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {t.text}
                      </span>
                    ))}
                  </div>

                  {/* 별점 */}
                  <div className="flex items-center gap-1 pt-1 text-xs">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">{prod.rating}</span>
                  </div>
                </div>
              </div>

              {/* 하단 담기 버튼 */}
              <div className="p-3 sm:p-4 pt-0">
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      originalPrice: prod.originalPrice,
                      quantity: 1,
                      volume: prod.categorySpec,
                    })
                  }
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>장바구니 담기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
