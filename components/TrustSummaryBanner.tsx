import { ShieldCheck, Truck, PackageCheck, RotateCcw } from "lucide-react";

export default function TrustSummaryBanner() {
  const guarantees = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "100% 식약처 정품 보장",
      desc: "공식 인가 정식 유통 경로, 가품 시 200% 보상",
    },
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: "5만원 이상 전 상품 무료배송",
      desc: "오후 2시 이전 결제 시 당일 안심 출고",
    },
    {
      icon: <PackageCheck className="w-6 h-6 text-emerald-600" />,
      title: "콜드체인 & 친환경 안심 포장",
      desc: "유산균 생존력 보호 전용 단열재 및 FSC 인증 완충재",
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-emerald-600" />,
      title: "섭취 전 단순 변심도 7일 내 무료 반품",
      desc: "소비자 안심 케어를 위한 간편 반품 프로세스",
    },
  ];

  return (
    <section className="bg-slate-100 py-10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guarantees.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3.5 shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
