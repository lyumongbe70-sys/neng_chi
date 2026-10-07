"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCartStore } from "@/lib/stores/useCartStore";
import { Star, ShoppingBag, CheckCircle2, Pill, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      dosage: product.dosage,
      volume: product.volume,
      category: product.category,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between">
      <Link href={`/products/${product.id}`} className="block p-5 flex-1">
        {/* 상단 뱃지 및 카테고리 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-slate-400">
            {product.category}
          </span>
          {product.badge && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {product.badge}
            </span>
          )}
        </div>

        {/* 제품 시각적 심볼 아이콘 박스 */}
        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-emerald-50/50 via-slate-50 to-emerald-100/30 flex flex-col items-center justify-center p-4 mb-4 border border-slate-100 group-hover:scale-[1.02] transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-2">
            <Pill className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500">{product.volume}</span>
        </div>

        {/* 평점 및 리뷰 수 */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-800">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* 상품명 */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>

        {/* 한줄 요약 설명 */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        {/* 섭취 방법 팁 */}
        <div className="text-[11px] text-emerald-800 bg-emerald-50/70 px-2.5 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{product.dosage}</span>
        </div>
      </Link>

      {/* 하단 가격 및 장바구니 버튼 영역 */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div>
          {product.discountRate > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold text-rose-600">{product.discountRate}%</span>
              <span className="text-slate-400 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
            </div>
          )}
          <div className="text-lg font-extrabold text-slate-900">
            {product.price.toLocaleString()}
            <span className="text-xs font-semibold ml-0.5">원</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isAdded
              ? "bg-emerald-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
          }`}
          aria-label="장바구니 담기"
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              담김
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              담기
            </>
          )}
        </button>
      </div>
    </div>
  );
}
