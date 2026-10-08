"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Lock, User, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const trimmedUsername = username.trim().toLowerCase();

    try {
      // 1. 등록된 로컬 회원 DB에서 먼저 즉시 인증 확인
      const storedUsersRaw = localStorage.getItem("vitalcare_registered_users");
      const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const foundUser = storedUsers.find(
        (u) => u.username === trimmedUsername && u.password === password
      );

      if (foundUser) {
        // 로그인 상태 저장
        login({
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email || `${foundUser.username}@vitalcare.mall`,
          points: foundUser.points || 1000,
        });
        router.push("/");
        return;
      }

      // 2. Supabase 클라우드 인증 시도
      try {
        const supabase = createClient();
        const emailForAuth = trimmedUsername.includes("@")
          ? trimmedUsername
          : `${trimmedUsername}@vitalcare.mall`;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailForAuth,
          password: password,
        });

        if (!error && data.user) {
          login({
            id: data.user.id,
            username: trimmedUsername,
            email: emailForAuth,
            points: 1000,
          });
          router.push("/");
          return;
        }
      } catch (cloudErr) {
        console.warn("Supabase auth login check:", cloudErr);
      }

      // 일치하는 계정이 없는 경우
      setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
    } catch (err: any) {
      setErrorMessage(err?.message || "로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 max-w-md w-full shadow-lg shadow-slate-200/50 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <Logo size="md" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">로그인</h1>
            <p className="text-xs text-slate-500 font-medium">
              건강함 MALL에 오신 것을 환영합니다.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">아이디</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 transition-all font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">비밀번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 transition-all font-medium text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "로그인 중..." : "로그인"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 flex justify-center items-center gap-2 border-t border-slate-100">
            <span>아직 회원이 아니신가요?</span>
            <Link href="/signup" className="text-emerald-700 font-black hover:underline">
              회원가입하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
