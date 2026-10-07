"use client";

import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  Plus,
  Truck,
  CheckCircle2,
  Package,
  Receipt,
  FileSpreadsheet,
  Coins,
  Search,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "inventory" | "tax" | "members"
  >("overview");

  // 샘플 주문 상태 변경
  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "김*진",
      product: "퓨어 알티지 초임계 오메가3 1000",
      amount: 42000,
      status: "PAID",
      statusText: "결제완료",
      tracking: "",
      carrier: "우체국택배",
    },
    {
      id: "ORD-1002",
      customer: "이*수",
      product: "[1+1] 활력 데일리 멀티비타민 2000",
      amount: 34000,
      status: "SHIPPING",
      statusText: "배송중",
      tracking: "689234125432",
      carrier: "우체국택배",
    },
  ]);

  // 발주 / 재고 리스트
  const [inventoryList, setInventoryList] = useState([
    { name: "퓨어 알티지 초임계 오메가-3", stock: 12, safeStock: 50, needOrder: true },
    { name: "식물성 순수 MSM 2000 관절앤연골", stock: 18, safeStock: 40, needOrder: true },
    { name: "100억 생유산균 신바이오틱스", stock: 140, safeStock: 50, needOrder: false },
    { name: "활력 데일리 멀티비타민 & 미네랄", stock: 250, safeStock: 60, needOrder: false },
  ]);

  // 세무 증빙 신청 목록
  const [taxRequests, setTaxRequests] = useState([
    {
      id: "TAX-1",
      customer: "홍길동",
      type: "현금영수증(소득공제)",
      phone: "010-1234-5678",
      amount: 42000,
      status: "신청완료",
    },
    {
      id: "TAX-2",
      customer: "(주)건강한미래",
      type: "세금계산서(지출증빙)",
      phone: "123-45-67890",
      amount: 340000,
      status: "신청완료",
    },
  ]);

  // 회원 목록 & 적립금
  const [members, setMembers] = useState([
    { id: "m1", name: "홍길동", email: "hong@naver.com", points: 1000, role: "USER" },
    { id: "m2", name: "김철수", email: "kim@daum.net", points: 2500, role: "USER" },
    { id: "m3", name: "이영희", email: "lee@gmail.com", points: 500, role: "USER" },
  ]);

  // 신규 상품 등록 폼 상태
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProductTitle, setNewProductTitle] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [isOnePlusOne, setIsOnePlusOne] = useState(false);
  const [isDeal, setIsDeal] = useState(false);

  const handleUpdateOrderStatus = (orderId: string, nextStatus: string, nextStatusText: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: nextStatus, statusText: nextStatusText } : o
      )
    );
  };

  const handleApproveTax = (id: string) => {
    setTaxRequests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "국세청 승인완료" } : t))
    );
  };

  const handleAddPoints = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, points: m.points + 1000 } : m))
    );
    alert("적립금 1,000P가 수동 지급되었습니다.");
  };

  return (
    <div className="space-y-8">
      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { id: "overview", label: "대시보드 메인" },
          { id: "products", label: "상품 관리" },
          { id: "orders", label: "주문 / 배송 관리" },
          { id: "inventory", label: "발주 / 안전재고" },
          { id: "tax", label: "세무 / 현금영수증" },
          { id: "members", label: "회원 / 적립금" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white"
                : "bg-slate-800/60 text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. 대시보드 메인 (KPI 메트릭스) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>오늘 매출액</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </span>
              <p className="text-2xl font-black text-white">2,480,000원</p>
              <p className="text-[11px] text-emerald-400">전일 대비 +18.4% 상승</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>신규 주문</span>
                <ShoppingBag className="w-4 h-4 text-teal-400" />
              </span>
              <p className="text-2xl font-black text-white">48건</p>
              <p className="text-[11px] text-teal-300">결제완료 12건 즉시 배송 준비</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>품절 임박 (안전재고 미달)</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </span>
              <p className="text-2xl font-black text-amber-400">2건</p>
              <p className="text-[11px] text-slate-400">rTG 오메가3, MSM 관절</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>신규 가입 회원</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </span>
              <p className="text-2xl font-black text-white">24명</p>
              <p className="text-[11px] text-emerald-400">신규 가입 웰컴 1,000P 지급 완료</p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-200">배송 출고 현황 요약</h3>
            <p className="text-xs text-slate-400">
              오늘 오후 2시 우체국 택배 1차 픽업 완료 (총 36건 출고). 오후 5시 2차 픽업 예정.
            </p>
          </div>
        </div>
      )}

      {/* 2. 상품 관리 탭 */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-white">상품 카탈로그 관리</h3>
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>신규 상품 등록</span>
            </button>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">상품명</th>
                  <th className="p-3.5">판매가</th>
                  <th className="p-3.5">기획 혜택</th>
                  <th className="p-3.5">재고수량</th>
                  <th className="p-3.5">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                <tr>
                  <td className="p-3.5 font-bold">[1+1] 활력 데일리 멀티비타민 2000</td>
                  <td className="p-3.5">34,000원</td>
                  <td className="p-3.5 text-emerald-400 font-bold">1+1 기획전</td>
                  <td className="p-3.5">150개</td>
                  <td className="p-3.5 text-emerald-400 font-semibold">판매중</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold">100억 생유산균 신바이오틱스 데일리</td>
                  <td className="p-3.5">36,000원</td>
                  <td className="p-3.5 text-amber-400 font-bold">골드 타임특가</td>
                  <td className="p-3.5">200개</td>
                  <td className="p-3.5 text-emerald-400 font-semibold">판매중</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. 주문 / 배송 관리 탭 */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">주문 및 운송장 배송 관리</h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">주문번호</th>
                  <th className="p-3.5">주문자</th>
                  <th className="p-3.5">상품</th>
                  <th className="p-3.5">금액</th>
                  <th className="p-3.5">배송상태</th>
                  <th className="p-3.5">운송장 번호</th>
                  <th className="p-3.5 text-right">상태 변경</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-3.5 font-mono text-emerald-400">{o.id}</td>
                    <td className="p-3.5">{o.customer}</td>
                    <td className="p-3.5 font-bold">{o.product}</td>
                    <td className="p-3.5">{o.amount.toLocaleString()}원</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {o.statusText}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {o.tracking || "미입력 (배송대기)"}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {o.status === "PAID" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, "SHIPPING", "배송중")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          출고 완료
                        </button>
                      )}
                      {o.status === "SHIPPING" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, "DELIVERED", "배송완료")}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold text-[11px]"
                        >
                          배송완료 처리
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. 발주 / 안전재고 탭 */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">안전재고 모니터링 & 발주서 생성</h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">품목명</th>
                  <th className="p-3.5">현재 재고</th>
                  <th className="p-3.5">안전 재고 기준</th>
                  <th className="p-3.5">발주 필요 여부</th>
                  <th className="p-3.5 text-right">발주서 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {inventoryList.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3.5 font-bold">{item.name}</td>
                    <td className="p-3.5">{item.stock}개</td>
                    <td className="p-3.5">{item.safeStock}개</td>
                    <td className="p-3.5">
                      {item.needOrder ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          🚨 발주 필요
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300">
                          정상 보유
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {item.needOrder && (
                        <button
                          onClick={() => alert(`[${item.name}] 본사 발주서(500개)가 생성되었습니다.`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px]"
                        >
                          자동 발주서 생성
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. 세무 / 증빙 탭 */}
      {activeTab === "tax" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">현금영수증 및 세금계산서 신청 승인</h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">신청번호</th>
                  <th className="p-3.5">신청자</th>
                  <th className="p-3.5">증빙 유형</th>
                  <th className="p-3.5">식별 번호</th>
                  <th className="p-3.5">금액</th>
                  <th className="p-3.5">상태</th>
                  <th className="p-3.5 text-right">국세청 전송</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {taxRequests.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3.5 font-mono text-emerald-400">{t.id}</td>
                    <td className="p-3.5">{t.customer}</td>
                    <td className="p-3.5 font-bold">{t.type}</td>
                    <td className="p-3.5 font-mono text-slate-400">{t.phone}</td>
                    <td className="p-3.5">{t.amount.toLocaleString()}원</td>
                    <td className="p-3.5 text-emerald-400 font-bold">{t.status}</td>
                    <td className="p-3.5 text-right">
                      {t.status === "신청완료" && (
                        <button
                          onClick={() => handleApproveTax(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          승인 처리
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. 회원 관리 탭 */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">회원 목록 및 적립금 관리</h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">회원명</th>
                  <th className="p-3.5">이메일</th>
                  <th className="p-3.5">권한</th>
                  <th className="p-3.5">보유 적립금</th>
                  <th className="p-3.5 text-right">수동 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3.5 font-bold">{m.name}</td>
                    <td className="p-3.5 text-slate-400">{m.email}</td>
                    <td className="p-3.5 font-mono">{m.role}</td>
                    <td className="p-3.5 text-amber-300 font-black">
                      {m.points.toLocaleString()} P
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleAddPoints(m.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px]"
                      >
                        + 1,000P 지급
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 신규 상품 등록 모달 */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsNewProductModalOpen(false)}
          />
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 relative z-10 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">신규 건강기능식품 등록</h3>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">상품명</label>
              <input
                type="text"
                placeholder="예: [1+1] 루테인 지아잔틴 눈건강 맥스"
                value={newProductTitle}
                onChange={(e) => setNewProductTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">판매가 (원)</label>
              <input
                type="number"
                placeholder="32000"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isOnePlusOne}
                  onChange={(e) => setIsOnePlusOne(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span>1+1 정기 기획전 배지 부여</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={isDeal}
                  onChange={(e) => setIsDeal(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span>골드 타임특가(24시간 한정) 노출</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("신규 상품이 카탈로그에 등록되었습니다.");
                  setIsNewProductModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                상품 등록 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
