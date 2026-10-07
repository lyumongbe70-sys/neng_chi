"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/lib/stores/useCartStore";
import { Plus, Minus, ShoppingBag, Zap, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

interface ProductPurchaseSectionProps {
  product: Product;
}

export default function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity,
      dosage: product.dosage,
      volume: product.volume,
      category: product.category,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity,
      dosage: product.dosage,
      volume: product.volume,
      category: product.category,
    });
    openCart();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      {/* 수량 선택기 */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-700">주문 수량</span>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="수량 감소"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="수량 증가"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 총 결제 예정 금액 */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-500">총 상품금액</span>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">
            {totalPrice.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-slate-700 ml-1">원</span>
        </div>
      </div>

      {/* 배송 및 혜택 안내 */}
      <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs text-slate-600 border border-slate-100">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {totalPrice >= 40000 ? (
              <strong className="text-emerald-700 font-bold">무료배송 적용</strong>
            ) : (
              "배송비 3,000원 (40,000원 이상 구매 시 무료배송)"
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>오후 2시 이전 결제 완료 시 오늘 출발 (우체국 택배)</span>
        </div>
      </div>

      {/* 구매 버튼 그룹 */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isAdded
              ? "bg-emerald-700 text-white"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              장바구니 담김
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              장바구니 담기
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4" />
          바로 구매하기
        </button>
      </div>
    </div>
  );
}
