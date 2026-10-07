import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MessageSquare,
  Settings,
  Coins,
  Ticket,
  ChevronRight,
} from "lucide-react";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-24 md:pb-12">
        {/* 상단 회원 요약 카드 */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg shadow-emerald-950/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black">홍길동 님</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-400 text-slate-900">
                    그린 VIP 회원
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-1">
                  식약처 인증 프리미엄 건강 맞춤 케어 멤버십
                </p>
              </div>
            </div>

            {/* 적립금 & 쿠폰 바 */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <div className="pr-4 border-r border-white/20">
                <span className="text-xs text-emerald-200 flex items-center gap-1 font-medium">
                  <Coins className="w-3.5 h-3.5 text-amber-300" />
                  보유 적립금
                </span>
                <p className="text-lg font-black text-amber-300 mt-0.5">1,000 P</p>
              </div>
              <div>
                <span className="text-xs text-emerald-200 flex items-center gap-1 font-medium">
                  <Ticket className="w-3.5 h-3.5 text-teal-300" />
                  보유 쿠폰
                </span>
                <p className="text-lg font-black text-white mt-0.5">2 장</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2열 레이아웃: 사이드 메뉴 + 메인 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 사이드 내비게이션 바 */}
          <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-4 space-y-1 shadow-2xs">
            <Link
              href="/mypage"
              className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>주문 / 배송 조회</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link
              href="/mypage/wishlist"
              className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>찜한 상품 (Wishlist)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link
              href="/mypage/qna"
              className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>1:1 맞춤 상담 문의</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link
              href="/mypage/profile"
              className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>회원정보 / 배송지 관리</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          </aside>

          {/* 메인 작업 영역 */}
          <section className="lg:col-span-9">{children}</section>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
