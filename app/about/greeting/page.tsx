import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";
import { Leaf, Award, HeartHandshake, ShieldCheck, ChevronLeft } from "lucide-react";

export default function CeoGreetingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-24 md:pb-16">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 shadow-sm space-y-10">
          <div className="text-center space-y-3 border-b pb-8">
            <span className="text-xs font-black text-emerald-700 tracking-widest uppercase">
              CEO GREETING
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              "내 가족에게 자신 있게 권할 수 있는 <br />
              정직한 영양제만을 만듭니다."
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              건강함(VitalCare) 대표이사 CEO 인사말
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-normal">
            <p>
              안녕하십니까. 건강함 MALL(VitalCare)을 찾아주신 고객 여러분께 진심으로 감사의 인사를 드립니다.
            </p>

            <p>
              현대 사회에서 건강기능식품은 단순한 기호식품을 넘어, 일상의 활력과 미래를 지키는 가장 중요한 습관이 되었습니다.
              그러나 시중에는 과도한 마케팅 문구와 출처를 알 수 없는 원료, 제조 공정 편의만을 위해 다량 투입된 화학부형제로 얼룩진 제품들이 넘쳐나고 있습니다.
            </p>

            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium space-y-2">
              <p className="font-bold text-emerald-900 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                우리의 변치 않는 3가지 약속
              </p>
              <p className="text-xs sm:text-sm">
                1. <strong>100% 식약처 인증 기능성 원료</strong>와 세계적 공인 원료사(DSM, IFOS 등)의 투명한 공급망만 고집합니다.
              </p>
              <p className="text-xs sm:text-sm">
                2. <strong>인위적 첨가물 0%</strong>: 이산화티타늄, 스테아린산마그네슘 등 화학부형제를 철저히 배제합니다.
              </p>
              <p className="text-xs sm:text-sm">
                3. <strong>가격 거품 배제</strong>: 본사 직영 유통으로 유통 마진을 걷어내고 고객의 건강권에 온전히 투자합니다.
              </p>
            </div>

            <p>
              '건강함'은 단순한 상품 판매를 넘어, 한 분 한 분의 생활 패턴과 영양 상태를 과학적으로 케어하는 평생 건강 파트너가 될 것을 약속드립니다. 고객 여러분의 가정에 늘 건강과 행복이 가득하기를 기원합니다.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold">주식회사 바이탈케어 대표이사</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">홍 길 동</p>
            </div>
            {/* 세련된 전자 서명 심볼 */}
            <div className="font-serif italic text-2xl font-black text-emerald-700 select-none tracking-widest border-b-2 border-emerald-600 pb-1">
              Gildong Hong
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
