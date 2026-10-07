"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

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
}

const SLIDES: BannerSlide[] = [
  {
    id: 1,
    badge: "🔥 1+1 골드 타임특가",
    title: "활력 충전 멀티비타민 & rTG 오메가3",
    highlight: "최대 50% 1+1 혜택",
    desc: "바쁜 현대인을 위한 필수 기초 영양제 묶음 구성! 한정 수량 소진 시 조기 마감",
    link: "/#deal",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    textColor: "text-white",
    accentColor: "text-amber-300",
  },
  {
    id: 2,
    badge: "🎁 신규 회원 웰컴 이벤트",
    title: "첫 구매 고객 전원 100% 혜택",
    highlight: "적립금 1,000P + 15% 쿠폰",
    desc: "지금 가입하고 식약처 인증 프리미엄 건강기능식품을 특별 할인가로 만나보세요.",
    link: "/signup",
    bgGradient: "from-teal-800 via-emerald-800 to-emerald-950",
    textColor: "text-white",
    accentColor: "text-emerald-300",
  },
  {
    id: 3,
    badge: "🌿 장 건강 프로젝트",
    title: "100억 보장 생유산균 신바이오틱스",
    highlight: "2개월분 36,000원 특가",
    desc: "4중 특허 코팅으로 장 끝까지 살아가는 강력한 생존력! 당일 무료 배송 보장",
    link: "/products/p-probiotics-01",
    bgGradient: "from-slate-900 via-emerald-900 to-slate-900",
    textColor: "text-white",
    accentColor: "text-yellow-300",
  },
];

export default function MainSliderBanner() {
  const [current, setCurrent] = useState(0);

  // 5초 자동 롤링
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden w-full select-none">
      <div
        className={`w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 ease-in-out`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              {slide.badge}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {slide.title} <br />
              <span className={slide.accentColor}>{slide.highlight}</span>
            </h2>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
              {slide.desc}
            </p>

            <div className="pt-2">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105"
              >
                <span>지금 혜택 보러가기</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </Link>
            </div>
          </div>

          {/* 슬라이더 인디케이터 및 좌우 이동 버튼 */}
          <div className="flex items-center gap-4 bg-black/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <button
              onClick={() =>
                setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
              }
              className="p-1 text-white/70 hover:text-white"
              aria-label="이전 배너"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    current === idx ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`슬라이드 ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
              className="p-1 text-white/70 hover:text-white"
              aria-label="다음 배너"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
