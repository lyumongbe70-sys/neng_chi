"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const FAQ_PRESETS = [
  {
    q: "배송은 언제 시작되나요?",
    a: "평일 오후 2시 이전 결제 완료 건은 우체국 택배를 통해 당일 즉시 발송됩니다! 수도권 및 주요 도시는 익일 오전(또는 로켓 배송 기준 익일 오후) 수령 가능합니다.",
  },
  {
    q: "1+1 이벤트 혜택 적용 기준이 궁금해요.",
    a: "[1+1 기획] 태그가 표기된 제품은 장바구니에 1개만 담으셔도 본품 2개가 한 박스에 더블 패키지로 묶여 안전하게 배송됩니다.",
  },
  {
    q: "교환/반품/환불 절차는 어떻게 되나요?",
    a: "상품 수령 후 7일 이내 [마이페이지 > 최근 주문 내역]에서 간편하게 반품/환불 신청이 가능합니다. 미개봉 정품은 단순 변심 시에도 신속 수거 접수됩니다.",
  },
  {
    q: "내 체질에 맞는 영양제 추천받기",
    a: "피로 회복에는 '고함량 멀티비타민 & 밀크씨슬', 장과 면역 관리에는 '100억 신바이오틱스 생유산균', 혈행 및 눈 피로에는 '초임계 알티지 오메가3'를 최우선으로 권장드립니다!",
  },
];

export default function FloatingConsultWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      sender: "bot",
      text: "안녕하세요! 바이탈케어 AI 영양 케어 챗봇입니다. 🌿\n식약처 인증 영양제 복용법이나 배송에 대해 궁금하신 점을 선택하시거나 편하게 질문해주세요.",
      time: "방금 전",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // 챗봇 응답 시뮬레이션
    setTimeout(() => {
      let replyText =
        "문의해주신 내용을 전문 영양사팀 및 고객센터로 안전하게 전달하였습니다. 상세 상담을 원하시면 하단의 [카카오톡 1:1 상담]을 클릭하시면 상담원과 즉시 연결됩니다.";

      const matchedFaq = FAQ_PRESETS.find((faq) =>
        text.toLowerCase().includes(faq.q.substring(0, 4).toLowerCase())
      );
      if (matchedFaq) {
        replyText = matchedFaq.a;
      } else if (text.includes("추천") || text.includes("비타민") || text.includes("오메가")) {
        replyText =
          "고객님의 활력 증진을 위해 흡수율이 높은 '활력 데일리 멀티비타민'과 '초임계 rTG 오메가3' 조합을 추천드립니다! 현재 1+1 타임특가 행사 중입니다.";
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40 flex flex-col items-end gap-3 select-none">
      {/* 챗봇 대화창 UI */}
      {isOpen && (
        <div className="w-[90vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95 duration-200">
          {/* 챗봇 상단 헤더 */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">바이탈케어 스마트 챗봇</h3>
                <span className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  실시간 AI 영양 어드바이저 가동 중
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 대화 내역 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-3 leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs"
                  }`}
                >
                  {m.text}
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === "user" ? "text-emerald-200" : "text-slate-400"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {/* 빠른 FAQ 메뉴 버튼들 */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">
                💡 자주 묻는 질문 빠른 선택
              </span>
              {FAQ_PRESETS.map((faq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(faq.q)}
                  className="w-full text-left p-2 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 font-medium text-[11px] transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{faq.q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력창 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 내용을 입력하세요..."
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 transition-colors"
              aria-label="전송"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 우측 하단 플로팅 퀵 버튼 2종 */}
      <div className="flex items-center gap-2.5">
        {/* 1. 카카오톡 1:1 상담 바로가기 (외부 URL) */}
        <a
          href="https://pf.kakao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#FEE500] hover:bg-[#FADA0A] text-[#391B1B] text-xs font-bold shadow-lg transition-transform hover:scale-105"
          title="카카오톡 상담하기"
        >
          <span className="w-2 h-2 rounded-full bg-[#391B1B]" />
          <span>카톡 상담</span>
        </a>

        {/* 2. 스마트 챗봇 열기 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-700/30 transition-transform hover:scale-105 relative"
          aria-label="챗봇 열기"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
