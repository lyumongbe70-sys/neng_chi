"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import { useCartStore } from "@/lib/stores/useCartStore";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Check,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [selectedIds, setSelectedIds] = useState<string[]>(items.map((i) => i.id));

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleToggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => removeItem(id));
    setSelectedIds([]);
  };

  // 선택된 상품 기준 계산
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const totalOriginalPrice = selectedItems.reduce(
    (sum, i) => sum + (i.originalPrice || i.price) * i.quantity,
    0
  );
  const totalSalePrice = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const discountAmount = totalOriginalPrice - totalSalePrice;
  const isFreeShipping = totalSalePrice >= FREE_SHIPPING_THRESHOLD || selectedItems.length === 0;
  const shippingFee = selectedItems.length === 0 ? 0 : isFreeShipping ? 0 : SHIPPING_FEE;
  const finalAmount = totalSalePrice + shippingFee;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-24 md:pb-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" />
            쇼핑 계속하기
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            장바구니 ({items.length})
          </h1>
          <div />
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 space-y-4 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-700">장바구니에 담긴 상품이 없습니다.</p>
            <p className="text-xs text-slate-400">
              식약처 인증 프리미엄 건강기능식품을 둘러보고 나에게 맞는 영양제를 담아보세요.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              베스트 상품 보러가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 좌측: 장바구니 상품 목록 & 선택 컨트롤 */}
            <div className="lg:col-span-8 space-y-4">
              {/* 상단 일괄 선택 바 */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleAll}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                  <span>
                    전체선택 ({selectedIds.length}/{items.length})
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleRemoveSelected}
                  disabled={selectedIds.length === 0}
                  className="text-slate-400 hover:text-rose-500 font-semibold disabled:opacity-40"
                >
                  선택삭제
                </button>
              </div>

              {/* 상품 리스트 */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleItem(item.id)}
                          className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 mt-1 cursor-pointer shrink-0"
                        />

                        <div className="flex-1">
                          {item.dosage && (
                            <span className="text-[11px] font-semibold text-emerald-700 block mb-0.5">
                              {item.dosage}
                            </span>
                          )}
                          <Link
                            href={`/products/${item.id}`}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors leading-snug block"
                          >
                            {item.name}
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {/* 수량 변경기 */}
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600"
                            aria-label="수량 감소"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600"
                            aria-label="수량 증가"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 금액 */}
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900">
                            {(item.price * item.quantity).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 우측: 결제 금액 요약 및 주문하기 버튼 */}
            <div className="lg:col-span-4 space-y-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
                <h2 className="font-bold text-slate-900 text-base">결제 예정 금액</h2>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>총 상품금액</span>
                    <span className="font-bold text-slate-900">
                      {totalOriginalPrice.toLocaleString()}원
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>상품 할인</span>
                      <span className="font-bold">
                        -{discountAmount.toLocaleString()}원
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      배송비
                    </span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
                    </span>
                  </div>

                  {!isFreeShipping && (
                    <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                      💡 {(FREE_SHIPPING_THRESHOLD - totalSalePrice).toLocaleString()}원 더 담으면 무료배송!
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                    <span>최종 결제 예상금액</span>
                    <span className="text-xl text-emerald-700">
                      {finalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedItems.length === 0}
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-40"
                >
                  <span>총 {selectedItems.length}개 상품 주문하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
                <p>• 50,000원 이상 주문 시 배송비 무료</p>
                <p>• 결제 단계에서 포인트/쿠폰을 적용할 수 있습니다.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileTabBar />
    </div>
  );
}
