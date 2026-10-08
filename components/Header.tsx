"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Flame,
  Truck,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useCartStore } from "@/lib/stores/useCartStore";
import { useWishlistStore } from "@/lib/stores/useWishlistStore";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import Logo from "@/components/Logo";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const POPULAR_KEYWORDS = [
  "활력 멀티비타민",
  "100억 생유산균",
  "초임계 rTG 오메가3",
  "가르시니아 다이어트",
  "프랑스산 밀크씨슬",
];

export default function Header({ searchQuery: controlledQuery, onSearchChange }: HeaderProps) {
  const router = useRouter();
  const { toggleCart, getTotalCount } = useCartStore();
  const { getCount: getWishlistCount } = useWishlistStore();

  const [localQuery, setLocalQuery] = useState(controlledQuery || "");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartCount = getTotalCount();
  const wishlistCount = getWishlistCount();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  useEffect(() => {
    if (controlledQuery !== undefined) {
      setLocalQuery(controlledQuery);
    }
  }, [controlledQuery]);

  // 바깥 클릭 시 연관검색어 팝오버 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (onSearchChange) {
      onSearchChange(localQuery);
    } else {
      router.push(`/?search=${encodeURIComponent(localQuery)}`);
    }
  };

  const handleSelectKeyword = (kw: string) => {
    setLocalQuery(kw);
    if (onSearchChange) onSearchChange(kw);
    setIsSearchFocused(false);
  };

  return (
    <>
      {/* 1. 상단 유틸리티 바 */}
      <div className="bg-slate-100 border-b border-slate-200 text-[11px] text-slate-500 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% 식약처 인증 기능성 원료 전문몰
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              50,000원 이상 무료배송
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            {user ? (
              <>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-700">{user.username}</span> 님 환영합니다!
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 ml-1">
                    {user.points ? `${user.points.toLocaleString()}P` : "1,000P"}
                  </span>
                </div>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-emerald-700 transition-colors">
                  로그인
                </Link>
                <span className="text-slate-300">|</span>
                <Link href="/signup" className="hover:text-emerald-700 transition-colors">
                  회원가입 (1,000P 증정)
                </Link>
              </>
            )}
            <span className="text-slate-300">|</span>
            <Link href="/board/notice" className="hover:text-emerald-700 transition-colors">
              고객센터
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/mypage" className="hover:text-emerald-700 transition-colors">
              주문배송조회
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/admin"
              className="text-emerald-800 font-bold hover:underline"
            >
              관리자 CMS
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 메인 헤더 영역 (GNMART 로고 + 쿠팡형 와이드 검색창 + 우측 퀵 아이콘) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
          {/* 모바일 햄버거 토글 */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-700 hover:text-emerald-600 rounded-lg"
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* 브랜드 로고 (Pinterest Nature 레퍼런스 엠블럼) */}
          <Logo />

          {/* 쿠팡형 중앙 와이드 검색창 */}
          <div
            ref={searchContainerRef}
            className="flex-1 max-w-2xl relative hidden sm:block"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center border-2 border-emerald-600 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-emerald-500/20"
            >
              {/* 카테고리 드롭다운 셀렉트 */}
              <div className="relative border-r border-slate-200 bg-slate-50">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3.5 pr-7 py-2.5 bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="전체">전체 카테고리</option>
                  <option value="비타민">비타민/미네랄</option>
                  <option value="유산균">유산균/장건강</option>
                  <option value="오메가3">오메가3/콜라겐</option>
                  <option value="다이어트">다이어트/이너뷰티</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 검색어 입력창 */}
              <input
                type="text"
                value={localQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                placeholder="찾으시는 영양성분이나 건강 고민을 검색해보세요!"
                className="flex-1 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              {/* 검색 버튼 */}
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 transition-colors flex items-center justify-center shrink-0"
                aria-label="검색"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* 실시간 연관검색어 / 인기검색어 팝오버 UI */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    실시간 급상승 건강 키워드
                  </span>
                  <span className="text-[10px] text-slate-400">오전 기준 업데이트</span>
                </div>
                <div className="space-y-1">
                  {POPULAR_KEYWORDS.map((kw, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectKeyword(kw)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-600 w-4">{idx + 1}</span>
                        <span className="font-medium">{kw}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">인기</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측 아이콘: 찜 목록(하트) + 장바구니(카운트 뱃지) + 마이페이지 */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* 찜 목록 */}
            <Link
              href="/mypage/wishlist"
              className="flex flex-col items-center justify-center p-2 text-slate-700 hover:text-rose-500 transition-colors relative group"
              title="찜 목록"
            >
              <div className="relative">
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-rose-500 hidden sm:block mt-0.5">
                찜목록
              </span>
            </Link>

            {/* 장바구니 */}
            <button
              type="button"
              onClick={toggleCart}
              className="flex flex-col items-center justify-center p-2 text-slate-700 hover:text-emerald-600 transition-colors relative group"
              aria-label="장바구니 열기"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-emerald-600 hidden sm:block mt-0.5">
                장바구니
              </span>
            </button>

            {/* 마이페이지 */}
            <Link
              href="/mypage"
              className="flex flex-col items-center justify-center p-2 text-slate-700 hover:text-emerald-600 transition-colors group"
              title="마이페이지"
            >
              <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-semibold text-slate-500 group-hover:text-emerald-600 hidden sm:block mt-0.5">
                마이페이지
              </span>
            </Link>
          </div>
        </div>

        {/* 모바일용 컴팩트 검색바 */}
        <div className="px-4 pb-3 sm:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border border-emerald-500 rounded-xl overflow-hidden bg-slate-50"
          >
            <input
              type="text"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="영양성분, 제품명 검색..."
              className="flex-1 px-3 py-2 text-xs bg-transparent outline-none"
            />
            <button type="submit" className="bg-emerald-600 text-white p-2">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3. 메인 GNB (GNMART 스타일 6대 메뉴바) */}
        <nav className="bg-emerald-800 text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm font-bold">
            <div className="flex items-center">
              {/* 전체 카테고리 메가메뉴 버튼 */}
              <div className="relative group">
                <button className="flex items-center gap-2 bg-emerald-900 px-5 py-3.5 hover:bg-emerald-950 transition-colors">
                  <Menu className="w-4 h-4 text-emerald-300" />
                  <span>전체 카테고리</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>
                {/* 메가메뉴 드롭다운 */}
                <div className="absolute top-full left-0 w-64 bg-white text-slate-800 shadow-2xl rounded-b-2xl border border-slate-200 py-3 hidden group-hover:block z-50">
                  <Link
                    href="/?category=vitamin"
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-xs font-semibold"
                  >
                    <span>비타민 / 미네랄</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <Link
                    href="/?category=probiotics"
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-xs font-semibold"
                  >
                    <span>유산균 / 장건강</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <Link
                    href="/?category=omega3-collagen"
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-xs font-semibold"
                  >
                    <span>오메가3 / 콜라겐</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <Link
                    href="/?category=diet"
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-xs font-semibold"
                  >
                    <span>다이어트 / 체지방</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* 쇼핑몰 소개 (드롭다운) */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-5 py-3.5 hover:bg-emerald-700/60 transition-colors">
                  <span>쇼핑몰 소개</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>
                <div className="absolute top-full left-0 w-44 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 py-2 hidden group-hover:block z-50">
                  <Link
                    href="/about/greeting"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    CEO 인사말
                  </Link>
                  <Link
                    href="/about/intro"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    건강함 쇼핑몰 소개
                  </Link>
                  <Link
                    href="/about/location"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    오시는 길
                  </Link>
                </div>
              </div>

              {/* 1+1 기획전 */}
              <Link
                href="/#one-plus-one"
                className="px-5 py-3.5 hover:bg-emerald-700/60 transition-colors flex items-center gap-1.5 text-amber-300"
              >
                <Sparkles className="w-4 h-4" />
                <span>1+1 기획전</span>
              </Link>

              {/* 베스트 / 타임특가 */}
              <Link
                href="/#deal"
                className="px-5 py-3.5 hover:bg-emerald-700/60 transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>베스트 / 타임특가</span>
              </Link>

              {/* 커뮤니티 (드롭다운) */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-5 py-3.5 hover:bg-emerald-700/60 transition-colors">
                  <span>커뮤니티</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>
                <div className="absolute top-full left-0 w-44 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 py-2 hidden group-hover:block z-50">
                  <Link
                    href="/board/qna"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    질문과 답변 (Q&A)
                  </Link>
                  <Link
                    href="/board/free"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    건강 상식 자유게시판
                  </Link>
                  <Link
                    href="/board/reservation"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    예약 확인 게시판
                  </Link>
                </div>
              </div>

              {/* 고객센터 (드롭다운) */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-5 py-3.5 hover:bg-emerald-700/60 transition-colors">
                  <span>고객센터</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>
                <div className="absolute top-full left-0 w-44 bg-white text-slate-800 shadow-xl rounded-b-xl border border-slate-200 py-2 hidden group-hover:block z-50">
                  <Link
                    href="/board/notice"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    공지사항
                  </Link>
                  <Link
                    href="/mypage/qna"
                    className="block px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold"
                  >
                    1:1 맞춤 문의
                  </Link>
                </div>
              </div>
            </div>

            {/* 당일 발송 보장 마크 */}
            <div className="text-xs text-emerald-200 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>오후 2시 전 결제 시 오늘 발송</span>
            </div>
          </div>
        </nav>
      </header>

      {/* 4. 모바일 좌측 햄버거 오프캔버스 메뉴 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 모바일 빠른 유저 정보 */}
              <div className="py-4 bg-emerald-50/70 -mx-6 px-6 border-b border-emerald-100 text-xs text-emerald-900">
                {user ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold">
                        <span className="text-emerald-700">{user.username}</span> 님
                      </p>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        {user.points ? `${user.points.toLocaleString()}P` : "1,000P"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href="/mypage"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                      >
                        마이페이지
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 font-bold"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold">회원가입하고 1,000P 받기</p>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                      >
                        로그인
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 font-bold"
                      >
                        회원가입
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 모바일 카테고리 & 페이지 메뉴 */}
              <div className="py-4 space-y-4 text-sm font-semibold text-slate-700">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    쇼핑 카테고리
                  </p>
                  <Link
                    href="/#one-plus-one"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-emerald-600 font-bold"
                  >
                    ✨ 1+1 특별 기획전
                  </Link>
                  <Link
                    href="/#deal"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-rose-600 font-bold"
                  >
                    🔥 골드 타임특가
                  </Link>
                  <Link
                    href="/?category=vitamin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-emerald-600"
                  >
                    비타민 / 미네랄
                  </Link>
                  <Link
                    href="/?category=probiotics"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-emerald-600"
                  >
                    유산균 / 장건강
                  </Link>
                  <Link
                    href="/?category=omega3-collagen"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-emerald-600"
                  >
                    오메가3 / 콜라겐
                  </Link>
                  <Link
                    href="/?category=diet"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600 hover:text-emerald-600"
                  >
                    다이어트 / 체지방
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    브랜드 & 커뮤니티
                  </p>
                  <Link
                    href="/about/greeting"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600"
                  >
                    CEO 인사말
                  </Link>
                  <Link
                    href="/about/intro"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600"
                  >
                    쇼핑몰 소개
                  </Link>
                  <Link
                    href="/about/location"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600"
                  >
                    오시는 길
                  </Link>
                  <Link
                    href="/board/qna"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600"
                  >
                    질문과 답변 (Q&A)
                  </Link>
                  <Link
                    href="/board/notice"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600"
                  >
                    공지사항
                  </Link>
                  <Link
                    href="/board/reservation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-1.5 text-slate-600"
                  >
                    예약 확인
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-400">
              <p>고객센터: 1588-0000</p>
              <p>평일 09:00 - 18:00 (점심 12-1시)</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
