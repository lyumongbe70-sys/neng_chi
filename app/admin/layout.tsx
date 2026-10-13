"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import Logo from "@/components/Logo";
import AdminSidebarNav from "@/components/AdminSidebarNav";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  ArrowRight,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, login, logout, isAdmin } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 빠른 관리자 권한 승인 (ID: admin / PW: admin)
  const handleQuickAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPasswordInput && adminPasswordInput !== "admin" && adminPasswordInput !== "admin1234") {
      setAdminAuthError("관리자 비밀번호가 일치하지 않습니다. (기본 비밀번호: admin)");
      return;
    }

    login({
      id: "admin_super",
      username: "admin",
      email: "admin@vitalcare.co.kr",
      points: 999999,
      role: "ADMIN",
    });
    setAdminAuthError("");
  };

  // 마운트 전에는 깜빡임 방지를 위해 로딩 화면 표시
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">관리자 보안 검증 중...</p>
        </div>
      </div>
    );
  }

  // 관리자 권한이 없는 경우 (비로그인 또는 일반 사용자) 보안 차단 화면 렌더링
  const authorized = isAdmin();

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 selection:bg-rose-500 selection:text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/80 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">관리자 권한 인증 필요</h1>
              <p className="text-xs text-slate-400 mt-1">
                관리자(ADMIN) 권한이 있는 계정으로 로그인해야 접근할 수 있습니다.
              </p>
            </div>
          </div>

          {user && (
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400">현재 로그인:</span>{" "}
                <strong className="text-slate-200">{user.username}</strong>
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                  {user.role || "일반회원"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <LogOut className="w-3 h-3" /> 로그아웃
              </button>
            </div>
          )}

          {adminAuthError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold">
              {adminAuthError}
            </div>
          )}

          {/* 원클릭 관리자 인증 폼 */}
          <form onSubmit={handleQuickAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                관리자 인증 비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="admin 또는 admin1234 입력"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                * 관리자 계정 초기 비밀번호는 <code className="text-emerald-400 font-mono">admin</code> 입니다.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>관리자(ADMIN) 권한으로 접속하기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminPasswordInput("admin");
                  login({
                    id: "admin_super",
                    username: "admin",
                    email: "admin@vitalcare.co.kr",
                    points: 999999,
                    role: "ADMIN",
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                원클릭 마스터 관리자 즉시 로그인
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>← 쇼핑몰 홈으로 돌아가기</span>
            </Link>
            <Link
              href="/login"
              className="text-emerald-400 hover:underline font-bold"
            >
              일반 로그인 페이지
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      {/* 관리자 사이드바 */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="px-2">
            <Logo variant="dark" href="/" />
          </div>

          <AdminSidebarNav />
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>최고 관리자 권한 인증됨 ({user?.username})</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors"
            >
              <span>쇼핑몰 사이트 보기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              title="로그아웃"
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 작업 영역 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">관리자 페이지</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              ADMIN ROLE
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">
              접속 계정:{" "}
              <strong className="text-emerald-400">
                {user?.email || "admin@vitalcare.co.kr"}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
