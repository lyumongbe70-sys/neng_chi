"use client";

import { useState } from "react";
import { MessageSquare, Plus, CheckCircle2, Clock } from "lucide-react";

interface QnaItem {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
  isAnswered: boolean;
  answer?: string;
}

const MOCK_QNA: QnaItem[] = [
  {
    id: "q-1",
    category: "배송문의",
    title: "1+1 오메가3 상품 배송 출발일 확인 부탁드립니다.",
    content: "어제 오후 1시에 결제했는데 오늘 바로 발송되는 건가요?",
    date: "2026.10.06",
    isAnswered: true,
    answer:
      "안녕하세요 고객님, 바이탈케어 영양팀입니다. 주문 건은 금일 오후 2시 우체국 택배로 정상 출고되었습니다. 송장번호 689234125432를 통해 배송 조회가 가능합니다. 감사합니다.",
  },
  {
    id: "q-2",
    category: "복용상담",
    title: "멀티비타민과 유산균을 같은 시간대에 복용해도 되나요?",
    content: "아침 식전에 유산균과 비타민을 한꺼번에 먹어도 무리가 없는지 궁금합니다.",
    date: "2026.10.04",
    isAnswered: true,
    answer:
      "고객님 반갑습니다. 유산균은 위산의 영향이 적은 아침 공복 미온수와 함께 섭취하시는 것을 권장드리며, 고함량 비타민은 공복 복용 시 일시적인 속 쓰림이 발생할 수 있으므로 아침 식사 직후 섭취하시는 것이 가장 이상적입니다.",
  },
];

export default function MypageQnaPage() {
  const [qnaList, setQnaList] = useState<QnaItem[]>(MOCK_QNA);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState("상품복용");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: QnaItem = {
      id: `q-${Date.now()}`,
      category,
      title,
      content,
      date: "2026.10.07",
      isAnswered: false,
    };
    setQnaList([newItem, ...qnaList]);
    setIsFormOpen(false);
    setTitle("");
    setContent("");
    alert("1:1 맞춤 상담 문의가 접수되었습니다. 전문 상담사가 24시간 내 답변을 등록해 드립니다.");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            1:1 맞춤 상담 문의 내역
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            전담 영양사와 고객센터 전문 상담원이 1:1로 맞춤 답변을 드립니다.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>새 문의 작성</span>
        </button>
      </div>

      {/* 새 문의 작성 폼 */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-800">1:1 문의 작성</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">문의 유형</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-white outline-none"
              >
                <option value="상품복용">영양제 복용법 / 성분 상담</option>
                <option value="배송문의">배송 / 주문 조회</option>
                <option value="취소반품">교환 / 반품 / 환불</option>
                <option value="기타">기타 문의</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">문의 제목</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
                className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">문의 내용</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="구체적인 문의 내용을 작성해주시면 더욱 정확한 안내가 가능합니다."
              className="w-full p-2 text-xs border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              문의 등록
            </button>
          </div>
        </form>
      )}

      {/* 문의 목록 아코디언 */}
      <div className="space-y-4">
        {qnaList.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-white">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                  {item.category}
                </span>
                <span className="text-slate-400">{item.date}</span>
              </div>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 ${
                  item.isAnswered
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.isAnswered ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    답변완료
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" />
                    답변대기
                  </>
                )}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>

            {item.answer && (
              <div className="mt-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1 text-emerald-800">
                  <span>바이탈케어 영양상담팀 답변</span>
                </p>
                <p className="leading-relaxed whitespace-pre-line text-emerald-900">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
