"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (
        supabaseUrl &&
        anonKey &&
        anonKey !== "YOUR_SUPABASE_ANON_KEY" &&
        supabaseUrl.startsWith("http")
      ) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert(`로그인 실패: ${error.message}`);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Supabase auth bypassed in demo:", e);
    }

    // 데모 로그인 처리
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
              健
            </div>
            <h1 className="text-2xl font-black text-slate-900">로그인</h1>
            <p className="text-xs text-slate-400">
              건강함 MALL에 오신 것을 환영합니다.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">이메일</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">비밀번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>{isLoading ? "로그인 중..." : "로그인"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 flex justify-center gap-2">
            <span>아직 회원이 아니신가요?</span>
            <Link href="/signup" className="text-emerald-700 font-bold hover:underline">
              회원가입 (1,000P 받기)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
