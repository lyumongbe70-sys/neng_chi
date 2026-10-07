"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, User, Phone, ArrowRight, Gift } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
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
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
            },
          },
        });

        if (error) {
          alert(`회원가입 실패: ${error.message}`);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Supabase auth bypassed in demo:", e);
    }

    alert("회원가입이 완료되었습니다! 신규 가입 웰컴 적립금 1,000P가 지급되었습니다.");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 max-w-md w-full shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black mb-1">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              가입 즉시 1,000P 적립
            </div>
            <h1 className="text-2xl font-black text-slate-900">간편 회원가입</h1>
            <p className="text-xs text-slate-400">
              안전하고 믿을 수 있는 건강기능식품 전문 멤버십
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">이름</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">휴대폰 번호</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">이메일 계정</label>
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
                  placeholder="6자 이상 입력"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>{isLoading ? "가입 처리 중..." : "1,000P 받고 가입 완료"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 flex justify-center gap-2">
            <span>이미 회원이신가요?</span>
            <Link href="/login" className="text-emerald-700 font-bold hover:underline">
              로그인하기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
