"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { Lock, User, CheckCircle2, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  // 전통적인 아이디 & 비밀번호 폼 필드
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // 1. 유효성 검사
    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedUsername) {
      setErrorMessage("아이디를 입력해 주세요.");
      return;
    }

    if (trimmedUsername.length < 4) {
      setErrorMessage("아이디는 4자 이상 영문 또는 숫자 조합이어야 합니다.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const emailForAuth = trimmedUsername.includes("@")
        ? trimmedUsername
        : `${trimmedUsername}@vitalcare.mall`;

      // 2. Supabase Authentication (auth.users)에 직접 회원가입 전송
      const { data, error } = await supabase.auth.signUp({
        email: emailForAuth,
        password: password,
        options: {
          data: {
            username: trimmedUsername,
            display_name: trimmedUsername,
            name: trimmedUsername,
            points: 1000,
          },
        },
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.message.includes("User already registered")
        ) {
          setErrorMessage("이미 Supabase Authentication에 등록된 아이디(이메일)입니다. 다른 아이디를 입력해 주세요.");
        } else if (error.message.includes("rate limit")) {
          setErrorMessage("Supabase 이메일 요청 한도가 초과되었습니다. 잠시 후 다시 시도해 주세요.");
        } else {
          setErrorMessage(`Supabase 가입 오류: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      // 3. 로컬 저장소 및 전역 세션에 즉시 자동 로그인 반영
      const userSession = {
        id: data.user?.id || `user-${Date.now()}`,
        username: trimmedUsername,
        email: emailForAuth,
        points: 1000,
      };

      login(userSession);

      try {
        const storedUsersRaw = localStorage.getItem("vitalcare_registered_users");
        const storedUsers: any[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        storedUsers.push({
          ...userSession,
          password: password,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("vitalcare_registered_users", JSON.stringify(storedUsers));
      } catch (cacheErr) {
        console.warn("Local caching error:", cacheErr);
      }

      setSuccessMessage("회원가입이 완료되어 자동으로 로그인되었습니다! (1,000P 지급 완료)");

      // 1초 후 메인 홈 화면으로 이동 (헤더에 로그인 상태 즉시 반영)
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || "회원가입 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 max-w-md w-full shadow-lg shadow-slate-200/50 space-y-6">
          
          {/* 상단 로고 및 헤더 */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <Logo size="md" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">회원가입</h1>
            <p className="text-xs text-slate-500 font-medium">
              간단한 아이디와 비밀번호로 10초 만에 가입하세요!
            </p>
          </div>

          {/* 에러 메시지 알림 박스 */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 성공 메시지 알림 박스 */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 심플 가입 폼 */}
          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            {/* 1. 아이디 입력 */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>아이디</span>
                <span className="text-[11px] text-slate-400 font-normal">영문, 숫자 4자 이상</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="아이디를 입력하세요 (예: myid123)"
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 transition-all font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* 2. 비밀번호 입력 */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>비밀번호</span>
                <span className="text-[11px] text-slate-400 font-normal">최소 6자 이상</span>
              </label>
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

            {/* 3. 비밀번호 확인 */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">비밀번호 확인</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 transition-all font-medium text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* 4. 약관 동의 체크박스 */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <span className="text-slate-600 font-medium text-[11px] sm:text-xs">
                  [필수] 이용약관 및 개인정보 수집·이용에 동의합니다.
                </span>
              </label>
            </div>

            {/* 5. 회원가입 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Supabase에 계정 등록 중..." : "회원가입 완료"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 하단 로그인 링크 */}
          <div className="pt-2 text-center text-xs text-slate-500 flex justify-center items-center gap-2 border-t border-slate-100">
            <span>이미 아이디가 있으신가요?</span>
            <Link href="/login" className="text-emerald-700 font-black hover:underline">
              로그인하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
