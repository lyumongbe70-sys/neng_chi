import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";
import { MapPin, Phone, Clock, Bus, Train, ChevronLeft, Navigation } from "lucide-react";

export default function AboutLocationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-24 md:pb-16 space-y-8">
        <div className="mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <div className="text-center space-y-2">
          <span className="text-xs font-black text-emerald-700 tracking-widest uppercase">
            LOCATION & CONTACT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            바이탈케어 본사 및 연구소 오시는 길
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            방문 상담 및 영양 케어 체험 센터를 운영하고 있습니다.
          </p>
        </div>

        {/* 지도 목업 뷰어 (Kakao/Naver 지도 레이아웃) */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-slate-100 via-slate-200 to-emerald-50 relative flex items-center justify-center p-6 text-center">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-200 max-w-sm space-y-2 animate-bounce duration-1000">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                (주)바이탈케어네트워크 본사
              </h3>
              <p className="text-xs text-slate-500">
                서울특별시 강남구 테헤란로 123 바이탈타워 10층
              </p>
            </div>
          </div>

          {/* 길안내 및 대중교통 상세 */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border-t border-slate-100">
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Train className="w-5 h-5 text-emerald-600" />
                지하철 이용 시
              </h4>
              <p className="leading-relaxed">
                • <strong>2호선 / 신분당선 강남역</strong> 1번 출구에서 도보 3분 (약 200m)
              </p>
              <p className="leading-relaxed">
                • <strong>2호선 역삼역</strong> 3번 출구에서 도보 7분 (약 500m)
              </p>

              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base pt-2">
                <Bus className="w-5 h-5 text-emerald-600" />
                버스 이용 시
              </h4>
              <p className="leading-relaxed">
                • <strong>강남역.역삼세무서 정류장 하차</strong>: 간선 146, 341, 360, 740 / 지선 3412
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 border-t md:border-t-0 md:border-l md:pl-8 border-slate-100">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <Clock className="w-5 h-5 text-emerald-600" />
                운영 시간 & 문의
              </h4>
              <p className="leading-relaxed">
                • 운영시간: 평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)
              </p>
              <p className="leading-relaxed">
                • 휴무일: 주말(토, 일) 및 공휴일 휴무
              </p>
              <p className="leading-relaxed">
                • 대표전화: 1588-0000 | 팩스: 02-1234-5678
              </p>
              <div className="pt-2">
                <a
                  href="https://map.kakao.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>카카오맵으로 길찾기</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileTabBar />
    </div>
  );
}
