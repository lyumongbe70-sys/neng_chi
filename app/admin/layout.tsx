import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Truck,
  Boxes,
  Receipt,
  Users,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      {/* 관리자 사이드바 */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-600/30">
              健
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight block">
                VitalCare CMS
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold text-slate-400">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold hover:bg-emerald-600/30 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>대시보드 메인</span>
            </Link>
            <Link
              href="/admin?tab=products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>상품 관리</span>
            </Link>
            <Link
              href="/admin?tab=orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>주문 / 배송 관리</span>
            </Link>
            <Link
              href="/admin?tab=inventory"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Boxes className="w-4 h-4" />
              <span>발주 / 재고 관리</span>
            </Link>
            <Link
              href="/admin?tab=tax"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>세무 / 증빙 관리</span>
            </Link>
            <Link
              href="/admin?tab=members"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>회원 / 적립금 관리</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>최고 관리자 권한 인증됨</span>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
          >
            <span>쇼핑몰 사이트 보기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* 메인 작업 영역 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">통합 관리자 모드</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">
              접속 계정: <strong className="text-emerald-400">admin@vitalcare.co.kr</strong>
            </span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
