"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/stores/useWishlistStore";
import { useCartStore } from "@/lib/stores/useCartStore";
import { PRODUCTS } from "@/lib/data/mockProducts";
import { Heart, ShoppingBag, Trash2, Pill, ChevronRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          찜한 상품 목록 ({wishlistedProducts.length})
        </h2>
        <span className="text-xs text-slate-400">관심있는 영양제를 모아보세요</span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs space-y-3">
          <Heart className="w-10 h-10 text-slate-200 mx-auto" />
          <p className="font-semibold text-slate-600">찜한 상품이 없습니다.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            인기 상품 구경하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-all bg-white"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-emerald-700">
                    {product.category}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="찜 해제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 mt-2 leading-snug"
                >
                  {product.name}
                </Link>

                <p className="text-xs text-slate-400 mt-1">{product.volume}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-base font-black text-slate-900">
                  {product.price.toLocaleString()}원
                </span>

                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      quantity: 1,
                      dosage: product.dosage,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>담기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
