"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Award,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  FileText,
  RotateCcw,
  Pill,
  Sparkles,
  Camera,
  X,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/lib/stores/useCartStore";
import { useWishlistStore } from "@/lib/stores/useWishlistStore";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"detail" | "reviews" | "qna" | "shipping">("detail");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const isFavorited = isWishlisted(product.id);
  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  // 갤러리 이미지 목록 (기본 3장)
  const galleryImages = [
    { label: "대표 썸네일", icon: <Pill className="w-16 h-16 text-emerald-600" /> },
    { label: "성분 라벨", icon: <FileText className="w-16 h-16 text-teal-600" /> },
    { label: "제조 GMP 인증", icon: <Award className="w-16 h-16 text-amber-500" /> },
  ];

  // 더미 리뷰 목록
  const sampleReviews = [
    {
      id: "r1",
      author: "김*진 (실구매자)",
      rating: 5,
      date: "2026.10.05",
      content:
        "야근이 잦아서 항상 피곤했는데, 복용 일주일 만에 아침에 일어나는 게 훨씬 가뿐해졌어요. 목넘김도 편하고 속 쓰림이 전혀 없네요!",
      helpful: 42,
    },
    {
      id: "r2",
      author: "이*수 (실구매자)",
      rating: 5,
      date: "2026.10.02",
      content:
        "1+1 혜택으로 부모님 댁에 하나 보내드리고 저도 먹고 있습니다. 식약처 인증이라 믿음이 가고 배송도 하루 만에 칼같이 도착했습니다.",
      helpful: 29,
    },
    {
      id: "r3",
      author: "박*원 (실구매자)",
      rating: 4,
      date: "2026.09.28",
      content:
        "다른 제품 먹을 땐 냄새 때문에 부담스러웠는데 이건 무향무취라 먹기 아주 좋습니다. 다 먹으면 재구매 의사 100%입니다.",
      helpful: 15,
    },
  ];

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
    openCart();
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
    router.push("/checkout");
  };

  return (
    <div className="space-y-12 pb-24 md:pb-12">
      {/* 1. 상단 2열 상품 메인 쇼케이스 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* 좌측: 썸네일 메인 이미지 뷰어 + 서브 갤러리 */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50 border border-slate-200 p-8 flex flex-col items-center justify-center relative shadow-xs">
            {product.badge && (
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md">
                {product.badge}
              </span>
            )}
            {product.isBest && (
              <span className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                BEST 1위
              </span>
            )}

            <div className="w-32 h-32 rounded-3xl bg-white shadow-lg flex items-center justify-center mb-4">
              {galleryImages[selectedImageIdx].icon}
            </div>

            <p className="text-sm font-bold text-slate-700">
              {galleryImages[selectedImageIdx].label}
            </p>
            <p className="text-xs text-slate-400 mt-1">{product.volume}</p>
          </div>

          {/* 서브 갤러리 썸네일 클릭 전환 */}
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIdx(idx)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  selectedImageIdx === idx
                    ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  {img.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-600">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 우측: 상품 구매 영역 (쿠팡형 빠른 배송 + 수량/옵션 + 결제 CTA) */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {product.category}
              </span>
              <span className="text-xs font-medium text-slate-400">
                제조사: {product.brand}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* 별점 및 리뷰 (클릭 시 리뷰 탭 이동) */}
            <div className="flex items-center gap-2 mt-3 text-sm">
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="font-black text-slate-900">{product.rating}</span>
                <span className="text-slate-500">
                  ({product.reviewCount.toLocaleString()}개 리뷰)
                </span>
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-bold text-xs">
                식약처 품목제조신고 완료
              </span>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-3">
            {product.discountRate > 0 && (
              <span className="text-2xl font-black text-rose-600">
                {product.discountRate}%
              </span>
            )}
            <div className="text-3xl font-black text-slate-900">
              {product.price.toLocaleString()}
              <span className="text-base font-bold ml-1">원</span>
            </div>
            {product.discountRate > 0 && (
              <span className="text-sm text-slate-400 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
            )}
          </div>

          {/* 쿠팡형 배송 안내 */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>로켓안심배송 | 오늘 밤 12시 전 주문 시 내일 도착 예정</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-6">
              우체국 택배로 안전하고 신속하게 발송되며, 50,000원 이상 주문 시 무료배송 혜택이 적용됩니다.
            </p>
          </div>

          {/* 섭취 가이드 요약 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>섭취 기준: <strong>{product.dosage}</strong></span>
          </div>

          {/* 수량 증감 카운터 및 실시간 총액 계산 */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">수량 선택</span>
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

            <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">총 상품금액</span>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  {totalPrice.toLocaleString()}
                </span>
                <span className="text-sm font-bold ml-1">원</span>
              </div>
            </div>
          </div>

          {/* 하단 버튼군: [찜하기] [장바구니 담기] [바로구매] */}
          <div className="flex items-center gap-3 pt-2">
            {/* 찜하기 버튼 */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-center transition-all ${
                isFavorited
                  ? "bg-rose-50 border-rose-300 text-rose-500"
                  : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
              }`}
              title="찜하기"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
            </button>

            {/* 장바구니 담기 */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-4 rounded-xl border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>장바구니</span>
            </button>

            {/* 바로구매 */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              <span>바로구매</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 상세 하단 4대 탭 네비게이션 */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* 탭 헤더 */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("detail")}
            className={`flex-1 py-4 text-center border-b-2 transition-colors ${
              activeTab === "detail"
                ? "border-emerald-600 text-emerald-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            상품 상세정보 / 성분 고시
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-4 text-center border-b-2 transition-colors ${
              activeTab === "reviews"
                ? "border-emerald-600 text-emerald-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            구매 후기 ({product.reviewCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("qna")}
            className={`flex-1 py-4 text-center border-b-2 transition-colors ${
              activeTab === "qna"
                ? "border-emerald-600 text-emerald-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Q&A 질문과 답변
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`flex-1 py-4 text-center border-b-2 transition-colors ${
              activeTab === "shipping"
                ? "border-emerald-600 text-emerald-700 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            배송 / 교환 / 반품 안내
          </button>
        </div>

        {/* 탭 컨텐츠 영역 */}
        <div className="p-6 sm:p-10">
          {/* TAB 1: 상세정보 / 성분 고시 */}
          {activeTab === "detail" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>영양 및 기능성 정보</span>
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="py-3 px-4">영양성분명</th>
                        <th className="py-3 px-4">함량</th>
                        <th className="py-3 px-4 text-right">1일 영양성분기준치</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {product.nutritionFacts.map((fact, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{fact.name}</td>
                          <td className="py-3 px-4">{fact.amount}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700">
                            {fact.dailyValuePercentage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">제품 특장점</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: 구매 후기 */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <div className="flex text-amber-400">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-3xl font-black text-slate-900">
                      {product.rating}
                    </span>
                    <span className="text-slate-400 text-sm">/ 5.0</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    전체 구매 고객의 98%가 이 상품에 만족했습니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  구매 후기 작성하기
                </button>
              </div>

              {/* 리뷰 목록 */}
              <div className="divide-y divide-slate-100">
                {sampleReviews.map((rev) => (
                  <div key={rev.id} className="py-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-bold text-slate-800">{rev.author}</span>
                      </div>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {rev.content}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      이 후기가 도움이 되었나요? (도움됨 {rev.helpful})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Q&A 질문과 답변 */}
          {activeTab === "qna" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">상품 Q&A 문의</h3>
                  <p className="text-xs text-slate-500">
                    상품 섭취방법이나 배송 등에 대해 문의해주시면 전문 영양사가 답변드립니다.
                  </p>
                </div>
                <Link
                  href="/board/qna"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  질문 작성하기
                </Link>
              </div>

              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>등록된 상품 질문이 없습니다. 첫 질문을 남겨보세요!</p>
              </div>
            </div>
          )}

          {/* TAB 4: 배송 / 교환 / 반품 안내 */}
          {activeTab === "shipping" && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  배송 안내
                </h4>
                <p>• 배송사: 우체국 택배 (전국 안전 배송)</p>
                <p>• 배송비: 3,000원 (50,000원 이상 결제 시 무료배송)</p>
                <p>• 당일 발송 기준: 평일 오후 2시 이전 결제 완료 건은 당일 출고됩니다.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  교환 및 반품 안내
                </h4>
                <p>• 상품 수령 후 7일 이내 교환/반품 신청이 가능합니다.</p>
                <p>• 포장이 훼손되어 상품가치가 상실된 경우 교환/반품이 제한될 수 있습니다.</p>
                <p>• 단순 변심에 의한 반품 배송비는 왕복 6,000원이 부과됩니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. 모바일 스크롤 고정 간편 구매 바 */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 flex items-center justify-between gap-3 shadow-xl">
        <div>
          <span className="text-[10px] text-slate-400 block">판매가</span>
          <span className="text-base font-black text-slate-900">
            {product.price.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current text-rose-500" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            구매하기
          </button>
        </div>
      </div>

      {/* 4. 리뷰 작성 모달 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">구매 후기 작성</h3>
              <button onClick={() => setIsReviewModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                별점 평가
              </label>
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className="p-1"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        num <= reviewRating ? "fill-current" : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                솔직한 후기를 남겨주세요
              </label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="복용감이나 느낀 점을 자유롭게 적어주세요 (최소 10자 이상)"
                rows={4}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                alert("리뷰가 정상적으로 등록되었습니다! (적립금 500P 지급)");
                setIsReviewModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              후기 등록 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
