"use client";

import { useCartStore } from "@/lib/stores/useCartStore";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

const FREE_SHIPPING_THRESHOLD = 40000;
const SHIPPING_FEE = 3000;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalCount } =
    useCartStore();

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shipping = totalCount === 0 ? 0 : isFreeShipping ? 0 : SHIPPING_FEE;
  const finalPrice = totalPrice + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const progressPercent = Math.min(100, Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 배경 딤 처리 */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* 드로어 헤더 */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">장바구니</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {totalCount}개
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 무료 배송 프로그레스 바 */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-semibold">🎉 무료배송 혜택 적용 완료!</span>
                ) : (
                  <span>
                    <strong className="text-emerald-600 font-bold">
                      {remainingForFreeShipping.toLocaleString()}원
                    </strong>{" "}
                    추가 시 무료배송
                  </span>
                )}
              </div>
              <span className="text-slate-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 장바구니 아이템 리스트 */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-600">장바구니가 비어 있습니다.</p>
                <p className="text-xs text-slate-400 mt-1">
                  내 몸에 꼭 맞는 건강기능식품을 찾아 담아보세요.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  상품 둘러보기
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {item.dosage && (
                        <span className="text-[11px] font-medium text-emerald-600 block mb-0.5">
                          {item.dosage}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    {/* 수량 조절 버튼 */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="수량 감소"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="수량 증가"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 아이템 가격 */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 결제 요약 및 주문하기 버튼 */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>총 상품금액</span>
                  <span className="font-semibold text-slate-900">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>결제 예정 금액</span>
                  <span className="text-base text-emerald-600">{finalPrice.toLocaleString()}원</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert("주문 페이지로 이동합니다 (프로토타입 데모).");
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
                >
                  <span>{finalPrice.toLocaleString()}원 주문하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>안심 결제 및 정품 100% 보증</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
