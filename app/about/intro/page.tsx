import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Award, HeartHandshake, ChevronLeft, FlaskConical, Snowflake, Sparkles } from "lucide-react";

export default function AboutIntroPage() {
  const standards = [
    {
      num: "01",
      title: "식약처 품목제조신고 & GMP 우수제조시설",
      desc: "모든 완제품은 식품의약품안전처의 엄격한 기능성 인정 기준을 통과하며, 오염 없는 클린룸 GMP 시설에서 자동화 생산됩니다.",
      icon: <Award className="w-8 h-8 text-emerald-600" />,
    },
    {
      num: "02",
      title: "화학부형제 0% 클린 포뮬러",
      desc: "정제의 모양을 인위적으로 잡기 위한 스테아린산마그네슘, HPMC, 이산화규소 등 화학 첨가물을 일체 첨가하지 않습니다.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
    },
    {
      num: "03",
      title: "생체이용률 극대화 분자 배합",
      desc: "단순 함량 경쟁이 아닌, 몸 안에서 온전히 흡수되도록 rTG형 오메가3, 글루콘산 아연 등 생체 흡수율이 검증된 원료만을 처방합니다.",
      icon: <FlaskConical className="w-8 h-8 text-emerald-600" />,
    },
    {
      num: "04",
      title: "안심 콜드체인 & 특수 블리스터 패키징",
      desc: "산패와 유산균 사멸을 원천 차단하기 위해 온도·습도 제어 물류 센터와 산소 차단 전용 Alu-Alu 특수 포장을 적용합니다.",
      icon: <Snowflake className="w-8 h-8 text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-24 md:pb-16 space-y-12">
        <div className="mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* 브랜드 헤더 */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-emerald-700 tracking-widest uppercase">
            BRAND STORY
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            건강함(VitalCare) 쇼핑몰 소개
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            정직한 원료, 검증된 과학, 신뢰할 수 있는 품질 관리로 대한민국 건강기능식품의 새로운 기준을 세웁니다.
          </p>
        </div>

        {/* 4대 안전 기준 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 hover:border-emerald-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-50">{s.icon}</div>
                <span className="text-2xl font-black text-slate-200">{s.num}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
