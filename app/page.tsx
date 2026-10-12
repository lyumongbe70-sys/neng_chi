"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import CartDrawer from "@/components/CartDrawer";
import MobileTabBar from "@/components/MobileTabBar";
import MainSliderBanner from "@/components/MainSliderBanner";
import TodayPopupModal from "@/components/TodayPopupModal";
import GoldTimeDeal from "@/components/GoldTimeDeal";
import OnePlusOneSection from "@/components/OnePlusOneSection";
import TrustSummaryBanner from "@/components/TrustSummaryBanner";
import FloatingConsultWidget from "@/components/FloatingConsultWidget";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/data/mockProducts";
import { CategorySlug } from "@/types/product";
import {
  ShieldCheck,
  Sparkles,
  Zap,
  HeartPulse,
  Shield,
  Activity,
  Leaf,
} from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc">("popular");

  // 필터링 및 정렬 처리
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (sortBy === "popular") {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const getCategoryIcon = (slug: CategorySlug) => {
    switch (slug) {
      case "energy-vitamin":
        return <Zap className="w-4 h-4" />;
      case "circulation-eye":
        return <HeartPulse className="w-4 h-4" />;
      case "liver-fatigue":
        return <Shield className="w-4 h-4" />;
      case "gut-probiotics":
        return <Sparkles className="w-4 h-4" />;
      case "joint-bone":
        return <Activity className="w-4 h-4" />;
      case "immunity":
        return <ShieldCheck className="w-4 h-4" />;
      default:
        return <Leaf className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-0">
      {/* 1. 네비게이션 헤더 (GNMART + 쿠팡형 검색바) */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* 2. 오늘 하루 보지 않기 팝업 모달 (24h localStorage) */}
      <TodayPopupModal />

      {/* 3. 장바구니 슬라이드 드로어 */}
      <CartDrawer />

      {/* 4. 메인 프로모션 슬라이더 배너 (1+1, 신규 1,000P) */}
      <MainSliderBanner />

      {/* 5. 안심 신뢰 보증 요약 배너 4종 */}
      <TrustSummaryBanner />

      {/* 6. 쿠팡형 골드 타임특가 (실시간 HH:MM:SS 카운트다운) */}
      <GoldTimeDeal />

      {/* 7. 1+1 정기 기획전 섹션 */}
      <OnePlusOneSection />

      {/* 8. 카테고리 필터 탭 네비게이션 */}
      <section id="categories" className="bg-white border-y border-slate-200 sticky top-16 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {getCategoryIcon(cat.slug)}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 메인 상품 카탈로그 리스트 */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* 상단 정렬 및 카운트 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>
                {CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "전체보기"}
              </span>
              <span className="text-sm font-bold text-emerald-600">
                ({filteredProducts.length}개)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchQuery ? `"${searchQuery}" 검색 결과` : "식약처 품목제조신고 완료 안심 라인업"}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs self-start sm:self-auto">
            <button
              onClick={() => setSortBy("popular")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                sortBy === "popular"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              인기순
            </button>
            <button
              onClick={() => setSortBy("price-asc")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                sortBy === "price-asc"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              낮은가격순
            </button>
            <button
              onClick={() => setSortBy("price-desc")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                sortBy === "price-desc"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              높은가격순
            </button>
          </div>
        </div>

        {/* 상품 그리드 */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 space-y-3">
            <p className="text-base font-bold text-slate-600">검색 조건에 맞는 상품이 없습니다.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              전체 상품 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* 10. 플로팅 고객상담 위젯 (카카오톡 바로가기 + AI 챗봇) */}
      <FloatingConsultWidget />

      {/* 11. 모바일 하단 고정 탭바 */}
      <MobileTabBar />

      {/* 12. 푸터 */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Logo variant="dark" />
            <div className="flex flex-wrap gap-5 text-xs text-slate-400 font-medium">
              <a href="/about/intro" className="hover:text-emerald-400">쇼핑몰 소개</a>
              <a href="/about/greeting" className="hover:text-emerald-400">CEO 인사말</a>
              <a href="/about/location" className="hover:text-emerald-400">오시는 길</a>
              <a href="/board/notice" className="hover:text-emerald-400">공지사항</a>
              <a href="/admin" className="text-emerald-500 font-bold hover:underline">관리자 페이지</a>
            </div>
          </div>

          <div className="space-y-1 text-slate-500 leading-relaxed pt-4 border-t border-slate-900">
            <p>상호명: (주)바이탈케어네트워크 | 대표자: 홍길동 | 사업자등록번호: 123-45-67890</p>
            <p>통신판매업신고: 제2026-서울강남-00123호 | 건강기능식품영업신고: 제2026-0123456호</p>
            <p>주소: 서울특별시 강남구 테헤란로 123 바이탈타워 10층 | 고객센터: 1588-0000 (평일 09:00 - 18:00)</p>
          </div>

          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-900/60">
            ※ 본 사이트에서 판매하는 모든 건강기능식품은 질병의 예방 및 치료를 위한 의약품이 아닙니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
