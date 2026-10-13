"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface BannerSlide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  desc: string;
  link: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  image?: string;
  imageAlt?: string;
}

const SLIDES: BannerSlide[] = [
  // 1. 첨부해주신 두뇌엔 닥터PS 맥스 슬라이드
  {
    id: 1,
    badge: "🧠 두뇌 건강 & 인지력 개선 집중 특가",
    title: "두뇌엔 닥터PS 맥스 & 닥터PS 70",
    highlight: "순도 80% 포스파티딜세린 300mg",
    desc: "서울대학교 연구진 개발 바이오 기술! 노화로 인해 저하된 인지력 개선에 도움을 주는 최고 순도 프리미엄 두뇌 영양제",
    link: "/#deal",
    bgGradient: "from-blue-950 via-slate-900 to-indigo-950",
    textColor: "text-white",
    accentColor: "text-sky-300",
    image: "/banner-brain-ps.png",
    imageAlt: "두뇌엔 닥터PS 맥스 포스파티딜세린",
  },
  // 2. 기존 슬라이드 1
  {
    id: 2,
    badge: "🔥 1+1 골드 타임특가",
    title: "활력 충전 멀티비타민 & rTG 오메가3",
    highlight: "최대 50% 1+1 혜택",
    desc: "바쁜 현대인을 위한 필수 기초 영양제 묶음 구성! 한정 수량 소진 시 조기 마감",
    link: "/#deal",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    textColor: "text-white",
    accentColor: "text-amber-300",
  },
  // 3. 기존 슬라이드 2
  {
    id: 3,
    badge: "🎁 신규 회원 웰컴 이벤트",
    title: "첫 구매 고객 전원 100% 혜택",
    highlight: "적립금 1,000P + 15% 쿠폰",
    desc: "지금 가입하고 식약처 인증 프리미엄 건강기능식품을 특별 할인가로 만나보세요.",
    link: "/signup",
    bgGradient: "from-teal-800 via-emerald-800 to-emerald-950",
    textColor: "text-white",
    accentColor: "text-emerald-300",
  },
  // 4. 기존 슬라이드 3
  {
    id: 4,
    badge: "🌿 장 건강 프로젝트",
    title: "100억 보장 생유산균 신바이오틱스",
    highlight: "2개월분 36,000원 특가",
    desc: "4중 특허 코팅으로 장 끝까지 살아가는 강력한 생존력! 당일 무료 배송 보장",
    link: "/#products",
    bgGradient: "from-slate-900 via-emerald-900 to-slate-900",
    textColor: "text-white",
    accentColor: "text-yellow-300",
  },
];

export default function MainSliderBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 5초 자동 롤링 (Fade 전환)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  // 모바일 스와이프 제스처 지원
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="메인 히어로 페이드 배너"
    >
      {/* 슬라이드 겹침(Stacking) 컨테이너: 모든 슬라이드가 겹쳐져 있고, 활성 슬라이드만 opacity-100으로 부드럽게 페이드인 */}
      <div className="relative w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = current === idx;
          return (
            <div
              key={slide.id}
              className={`w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${slide.bgGradient} transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "relative opacity-100 z-10 pointer-events-auto"
                  : "absolute inset-0 opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* 은은한 배경 오버레이 */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/40 pointer-events-none" />

              <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 relative z-10">
                {/* 왼쪽 텍스트 정보 */}
                <div
                  className={`space-y-4 max-w-2xl text-center md:text-left flex-1 transition-all duration-700 delay-100 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-bold border border-white/20 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {slide.badge}
                  </span>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                    {slide.title} <br />
                    <span className={slide.accentColor}>{slide.highlight}</span>
                  </h2>

                  <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium line-clamp-3">
                    {slide.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <span>지금 혜택 보러가기</span>
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                    </Link>

                    {slide.image && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-500/20 text-sky-200 border border-sky-400/30 text-xs font-bold backdrop-blur-sm">
                        <ShieldCheck className="w-4 h-4 text-sky-400" />
                        식약처 GMP 인증
                      </span>
                    )}
                  </div>
                </div>

                {/* 오른쪽 상품 이미지 영역 (페이드인과 함께 부드럽게 나타남) */}
                {slide.image ? (
                  <div
                    className={`relative shrink-0 flex items-center justify-center transition-all duration-700 delay-150 ${
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                  >
                    <div className="relative w-64 sm:w-80 md:w-96 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt || slide.title}
                        fill
                        sizes="(max-width: 768px) 256px, 384px"
                        priority={idx === 0}
                        className="object-cover object-center drop-shadow-2xl"
                      />
                      <div className="absolute top-3 right-3 bg-blue-600/90 text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
                        최고순도 80%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`hidden md:flex shrink-0 w-64 lg:w-72 aspect-square rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 flex-col justify-between shadow-2xl transition-all duration-700 delay-150 ${
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-black">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">VitalCare Exclusive</span>
                      <h3 className="text-xl font-black text-white mt-1 leading-snug">
                        건강한 일상의<br />시작, 바이탈케어
                      </h3>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-bold border-t border-white/10 pt-3 flex items-center justify-between">
                      <span>100% 식약처 인증</span>
                      <span>무료배송 혜택</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 좌우 네비게이션 버튼 & 인디케이터 (우측 하단) */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-xl">
        <button
          onClick={handlePrev}
          className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="이전 배너"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 도트 인디케이터 */}
        <div className="flex gap-1.5 items-center">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                current === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="다음 배너"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 현재 슬라이드 번호 / 전체 슬라이드 수 */}
        <span className="text-[11px] font-bold text-slate-300 pl-1 border-l border-white/20">
          {current + 1} / {SLIDES.length}
        </span>
      </div>
    </section>
  );
}
