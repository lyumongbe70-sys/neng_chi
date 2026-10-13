"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCartStore } from "@/lib/stores/useCartStore";
import { useWishlistStore } from "@/lib/stores/useWishlistStore";
import { Star, ShoppingBag, CheckCircle2, Pill, ShieldCheck, Heart, CreditCard } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const [isAdded, setIsAdded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFavorited = isMounted ? isWishlisted(product.id) : false;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, {
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
    });
  };

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
      imageUrl: product.imageUrl,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  // 바로 주문하기 버튼 클릭 처리
  const handleDirectOrder = (e: React.MouseEvent) => {
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
      imageUrl: product.imageUrl,
    });

    router.push(`/order?productId=${product.id}`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col justify-between relative">
      <Link href={`/products/${product.id}`} className="block p-5 flex-1">
        {/* 상단 뱃지 및 카테고리 & 찜하기 버튼 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-slate-400">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5">
            {product.badge && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {product.badge}
              </span>
            )}
            {/* 찜하기(좋아요) 하트 버튼 */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                isFavorited
                  ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                  : "text-slate-300 hover:text-rose-500 hover:bg-slate-100"
              }`}
              title={isFavorited ? "찜 취소" : "찜하기"}
              aria-label="찜하기"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-current text-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* 제품 시각적 이미지 또는 심볼 아이콘 박스 */}
        <div className="w-full h-44 rounded-xl bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-2 mb-4 border border-slate-100 group-hover:scale-[1.02] transition-transform">
          {product.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-1"
              />
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-2">
                <Pill className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">{product.volume}</span>
            </>
          )}
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

      {/* 하단 가격 및 주문 / 장바구니 버튼 영역 */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
        <div className="min-w-0">
          {product.discountRate > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold text-rose-600">{product.discountRate}%</span>
              <span className="text-slate-400 line-through truncate">
                {product.originalPrice.toLocaleString()}원
              </span>
            </div>
          )}
          <div className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
            {product.price.toLocaleString()}
            <span className="text-xs font-semibold ml-0.5">원</span>
          </div>
        </div>

        {/* [주문] & [담기] 버튼 그룹 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* 바로 주문 버튼 */}
          <button
            type="button"
            onClick={handleDirectOrder}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer hover:shadow-md"
            title="바로 주문하기"
            aria-label="주문하기"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>주문</span>
          </button>

          {/* 장바구니 담기 버튼 */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
              isAdded
                ? "bg-emerald-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
            }`}
            aria-label="장바구니 담기"
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>담김</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>담기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
