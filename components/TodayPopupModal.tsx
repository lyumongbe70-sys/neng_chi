"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Gift, Check, ArrowRight } from "lucide-react";

const POPUP_STORAGE_KEY = "vitalcare_hide_popup_until";

export default function TodayPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    try {
      const hideUntil = localStorage.getItem(POPUP_STORAGE_KEY);
      if (!hideUntil || new Date().getTime() > parseInt(hideUntil, 10)) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowToday) {
      const tomorrow = new Date().getTime() + 24 * 60 * 60 * 1000;
      try {
        localStorage.setItem(POPUP_STORAGE_KEY, tomorrow.toString());
      } catch (e) {
        console.error(e);
      }
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 딤 배경 */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* 팝업 모달 본체 */}
      <div className="relative bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* 상단 닫기 X 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          aria-label="팝업 닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 팝업 비주얼 영역 */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 text-white p-6 pt-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mx-auto mb-4 flex items-center justify-center border border-white/20 text-amber-300">
            <Gift className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[11px] font-black tracking-wide mb-2">
            SPECIAL WELCOME
          </span>

          <h3 className="text-xl font-black leading-tight mb-2">
            지금 가입하면 <br />
            <span className="text-amber-300">1,000P 적립금 즉시 증정!</span>
          </h3>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            식약처 인증 기능성 영양제 1+1 타임특가와 <br />
            추가 15% 웰컴 쿠폰팩을 놓치지 마세요.
          </p>
        </div>

        {/* 혜택 요약 및 버튼 */}
        <div className="p-5 space-y-3 bg-white">
          <Link
            href="/signup"
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <span>1,000P 받고 3초 가입하기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/#deal"
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
          >
            오늘의 1+1 골드특가 먼저 보기
          </Link>
        </div>

        {/* 하단 오늘 하루 보지 않기 바 */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.value === "true" || e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <span className="text-[11px] font-medium text-slate-500">
              오늘 하루 보지 않기
            </span>
          </label>

          <button
            onClick={handleClose}
            className="text-[11px] font-bold text-slate-700 hover:text-emerald-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
