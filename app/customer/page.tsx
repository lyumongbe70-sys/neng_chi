"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import {
  Headphones,
  HelpCircle,
  MessageSquare,
  Clock,
  Phone,
  FileQuestion,
  ChevronDown,
  Search,
  Plus,
  Send,
  Lock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  RotateCcw,
  CreditCard,
  UserCheck,
} from "lucide-react";

interface FaqItem {
  category: "주문/결제" | "배송" | "반품/교환" | "상품/복용";
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    category: "배송",
    question: "배송은 얼마나 걸리며 오늘 출발 시간은 언제인가요?",
    answer:
      "평일 오후 2시 이전 결제 완료 건에 한하여 우체국 택배를 통해 당일 즉시 발송됩니다. 배송은 발송일 기준 통상 1~2영업일 이내에 안전하게 수령하실 수 있습니다. (주말 및 공휴일 제외)",
  },
  {
    category: "주문/결제",
    question: "어떤 결제 수단을 지원하나요?",
    answer:
      "신용/체크카드(국내 전 카드사), 토스페이, 카카오페이 간편결제 및 실시간 계좌이체를 모두 안전하게 지원합니다. 토스페이먼츠 보안 암호화 결제창을 통해 안전하게 결제됩니다.",
  },
  {
    category: "주문/결제",
    question: "무료 배송 기준은 어떻게 되나요?",
    answer:
      "최종 결제 금액(할인 쿠폰 및 적립금 적용 후) 기준 50,000원 이상 구매 시 무료 배송 혜택이 적용됩니다. 50,000원 미만 주문 건의 기본 배송비는 3,000원입니다.",
  },
  {
    category: "반품/교환",
    question: "상품을 교환하거나 반품(환불)하고 싶어요.",
    answer:
      "상품 수령일로부터 7일 이내에 미개봉 상태인 경우 교환 및 반품이 가능합니다. 포장 훼손이나 개봉 후 섭취한 상품은 위생안전법상 교환/반품이 제한될 수 있으니 고객센터(1588-0000) 또는 1:1 Q&A로 문의해 주세요.",
  },
  {
    category: "상품/복용",
    question: "영양제 복용 시간과 다른 영양제와 함께 섭취해도 되나요?",
    answer:
      "비타민 B군과 멀티비타민은 활력 충전을 위해 아침 식후 섭취를 권장드리며, 오메가3와 루테인은 지용성이므로 점심 또는 저녁 식사 직후 섭취하시면 흡수율이 높아집니다. 특정 질환으로 복약 중이신 경우 의사·약사와 상담 후 섭취하시길 권장합니다.",
  },
];

interface QnaPost {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  isSecret: boolean;
  status: "WAITING" | "ANSWERED";
  content: string;
  answer?: string;
}

const INITIAL_QNA_POSTS: QnaPost[] = [
  {
    id: "QNA-104",
    category: "상품/복용",
    title: "오메가3와 종합비타민을 동시에 복용해도 문제없나요?",
    author: "김*진",
    date: "2026.10.12",
    isSecret: false,
    status: "ANSWERED",
    content: "두 제품을 점심 식사 후 한꺼번에 먹고 있는데 괜찮을까요?",
    answer:
      "안녕하세요, 바이탈케어 영양상담팀입니다. 종합비타민과 오메가3는 성분 충돌이 없으며, 오메가3의 기름 성분이 비타민의 흡수를 도와주므로 식후 함께 섭취하셔도 매우 좋습니다.",
  },
  {
    id: "QNA-103",
    category: "배송",
    title: "정기배송 날짜를 변경할 수 있나요?",
    author: "박*호",
    date: "2026.10.11",
    isSecret: false,
    status: "ANSWERED",
    content: "출장 일정이 잡혀서 다음 주 배송일을 3일 뒤로 미루고 싶습니다.",
    answer:
      "안녕하세요 고객님! 마이페이지 > 정기배송 관리에서 희망 배송일을 언제든지 1회 건너뛰기 또는 날짜 변경하실 수 있습니다. 추가 도움이 필요하시면 언제든 연락주세요.",
  },
  {
    id: "QNA-102",
    category: "주문/결제",
    title: "비밀글입니다. (법인 대량 구매 세금계산서 발행 문의)",
    author: "이*원",
    date: "2026.10.10",
    isSecret: true,
    status: "ANSWERED",
    content: "임직원 명절 선물로 100세트 구매 예정입니다. 세금계산서 발행 절차 안내 부탁드립니다.",
    answer: "고객님 사업자등록증 사본을 이메일로 접수해 주시면 담당자가 견적서 및 전자세금계산서를 즉시 발급해 드립니다.",
  },
  {
    id: "QNA-101",
    category: "반품/교환",
    title: "주문 상품 수량 변경 가능한가요?",
    author: "정*우",
    date: "2026.10.09",
    isSecret: false,
    status: "WAITING",
    content: "결제 완료 상태인데 수량을 1개에서 2개로 변경하고 싶습니다.",
  },
];

function CustomerCenterContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "faq" | "qna" | "consult" | null;

  const [activeTab, setActiveTab] = useState<"faq" | "qna" | "consult">(
    tabParam || "faq"
  );

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>("전체");
  const [faqSearch, setFaqSearch] = useState<string>("");

  // Q&A 게시판 상태
  const [qnaPosts, setQnaPosts] = useState<QnaPost[]>(INITIAL_QNA_POSTS);
  const [selectedPost, setSelectedPost] = useState<QnaPost | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Q&A 작성 폼
  const [newCategory, setNewCategory] = useState("상품/복용");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  // FAQ 필터링
  const filteredFaqs = FAQS.filter((f) => {
    const matchCat = faqCategory === "전체" || f.category === faqCategory;
    const matchSearch =
      faqSearch.trim() === "" ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateQna = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 문의 내용을 모두 입력해주세요.");
      return;
    }

    const newPost: QnaPost = {
      id: `QNA-${Date.now().toString().slice(-4)}`,
      category: newCategory,
      title: newTitle.trim(),
      author: "홍길동",
      date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
      isSecret,
      status: "WAITING",
      content: newContent.trim(),
    };

    setQnaPosts([newPost, ...qnaPosts]);
    setIsWriteModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setIsSecret(false);
    alert("질문이 성공적으로 등록되었습니다. 전문 영양사가 확인 후 신속하게 답변해 드립니다.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-24 md:pb-16 space-y-8">
        {/* 상단 히어로 배너 */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30">
              <Headphones className="w-3.5 h-3.5" />
              고객만족센터 & 전문 영양상담
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              무엇을 도와드릴까요?
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
              자주 묻는 질문(FAQ) 확인부터 1:1 맞춤 영양 상담 Q&A까지, 고객님의 건강한 일상을 위해 신속하게 답변해 드립니다.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-700/50 flex flex-wrap gap-6 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>고객센터: <strong className="text-white text-sm">1588-0000</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-300" />
              <span>운영시간: 평일 09:00 - 18:00 (점심 12:00 - 13:00)</span>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션: 자주 묻는 질문(FAQ) / 질문과 답변(Q&A) / 고객센터 안내 */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => {
              setActiveTab("faq");
              setSelectedPost(null);
            }}
            className={`flex-1 py-3.5 text-center text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "faq"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>자주 묻는 질문 (FAQ)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("qna");
              setSelectedPost(null);
            }}
            className={`flex-1 py-3.5 text-center text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "qna"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>질문과 답변 (Q&A 게시판)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("consult");
              setSelectedPost(null);
            }}
            className={`flex-1 py-3.5 text-center text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "consult"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>고객센터 안내</span>
          </button>
        </div>

        {/* 1. 자주 묻는 질문 (FAQ) 탭 */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            {/* 검색 및 카테고리 필터 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {["전체", "주문/결제", "배송", "반품/교환", "상품/복용"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      faqCategory === cat
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="궁금한 내용을 검색해보세요"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 아코디언 FAQ 목록 */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
              {filteredFaqs.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  검색 결과에 맞는 자주 묻는 질문이 없습니다.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="transition-colors">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0">
                            Q
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 shrink-0">
                            [{faq.category}]
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-emerald-600" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 bg-emerald-50/30 text-xs sm:text-sm text-slate-700 leading-relaxed flex gap-3">
                          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                            A
                          </span>
                          <div className="flex-1 pt-0.5">{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 2. 질문과 답변 (Q&A 게시판) 탭 */}
        {activeTab === "qna" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  1:1 건강 & 상품 Q&A 문의 ({qnaPosts.length}건)
                </h3>
                <p className="text-[11px] text-slate-400">
                  식약처 인증 영양 전문 연구팀이 1:1 맞춤형으로 성심성의껏 답변해 드립니다.
                </p>
              </div>

              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>질문 작성하기</span>
              </button>
            </div>

            {/* 상세 보기 또는 목록 */}
            {selectedPost ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  ← 질문 목록으로 돌아가기
                </button>

                <div className="border-b pb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {selectedPost.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        selectedPost.status === "ANSWERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {selectedPost.status === "ANSWERED" ? "답변완료" : "답변대기"}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {selectedPost.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>작성자: {selectedPost.author}</span>
                    <span>•</span>
                    <span>작성일시: {selectedPost.date}</span>
                    <span>•</span>
                    <span>문의번호: {selectedPost.id}</span>
                  </div>
                </div>

                {/* 질문 본문 */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900 mb-2">Q. 고객 문의 내용</p>
                  {selectedPost.content}
                </div>

                {/* 전문 답변 박스 */}
                {selectedPost.answer ? (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>바이탈케어 영양상담팀 공식 답변</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                      {selectedPost.answer}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>영양 연구팀에서 문의를 접수하여 답변을 작성하고 있습니다. (통상 24시간 이내 답변)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                  {qnaPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="p-5 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {post.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              post.status === "ANSWERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {post.status === "ANSWERED" ? "답변완료" : "답변대기"}
                          </span>
                          {post.isSecret && (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                              <Lock className="w-3 h-3" /> 비밀글
                            </span>
                          )}
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                            {post.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-emerald-600 shrink-0">
                        상세보기 →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. 고객센터 안내 탭 */}
        {activeTab === "consult" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">전화 상담 센터</h3>
              <p className="text-3xl font-black text-emerald-700 font-mono">1588-0000</p>
              <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <p>• 평일: 오전 09:00 ~ 오후 18:00</p>
                <p>• 점심시간: 오후 12:00 ~ 오후 13:00</p>
                <p>• 주말 및 공휴일: 휴무 (1:1 온라인 게시판 이용)</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">배송 및 반품 안내</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                우체국 택배 공식 제휴로 평일 오후 2시 이전 결제 건은 당일 출고를 보장합니다.
              </p>
              <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <p>• 기본 배송비: 3,000원 (50,000원 이상 무료)</p>
                <p>• 반품/교환 주소: 서울특별시 강남구 테헤란로 123 바이탈물류센터</p>
                <p>• 단순 변심 반품 시 왕복 택배비 6,000원 발생</p>
              </div>
            </div>
          </div>
        )}

        {/* 질문 작성 모달 */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                1:1 질문 작성하기
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                상품 복용법, 배송, 교환/환불 등 궁금하신 점을 작성해주세요.
              </p>

              <form onSubmit={handleCreateQna} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">문의 분류</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium bg-white"
                  >
                    <option value="상품/복용">상품 성분 및 복용법 상담</option>
                    <option value="주문/결제">주문 및 결제 확인</option>
                    <option value="배송">배송 일정 및 주소 변경</option>
                    <option value="반품/교환">반품 및 교환 신청</option>
                    <option value="기타">기타 일반 문의</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">제목</label>
                  <input
                    type="text"
                    required
                    placeholder="제목을 입력해주세요."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">문의 내용</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="문의하실 내용을 상세히 적어주시면 더욱 정확한 맞춤 상담이 가능합니다."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={isSecret}
                    onChange={(e) => setIsSecret(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    비밀글로 등록 (개인 건강/주문 정보 보호)
                  </span>
                </label>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    질문 등록하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <MobileTabBar />
    </div>
  );
}

export default function CustomerCenterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          고객센터를 불러오는 중입니다...
        </div>
      }
    >
      <CustomerCenterContent />
    </Suspense>
  );
}
