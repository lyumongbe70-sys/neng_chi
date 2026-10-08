"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Plus, CheckCircle2 } from "lucide-react";

interface QnaItem {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
  isAnswered: boolean;
  answer?: string;
}

export default function MypageQnaPage() {
  const [qnaList, setQnaList] = useState<QnaItem[]>([]);
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
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
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
            <MessageSquare className="w-4 h-4 text-teal-600" />
            1:1 맞춤 상담 내역
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            전문 영양사와 1:1 건강기능식품 복용 및 상품 문의 내역입니다.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>새 문의 작성</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
          <div className="font-bold text-slate-800 text-sm">새로운 문의 작성</div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">문의 유형</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-600"
            >
              <option value="상품복용">상품 복용법 / 영양 상담</option>
              <option value="배송문의">배송 / 출고 문의</option>
              <option value="교환반품">교환 / 반품 / 취소</option>
              <option value="기타문의">기타 문의</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">제목</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">내용</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상세 내용을 입력해 주세요"
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white outline-none focus:border-emerald-600 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              문의 등록
            </button>
          </div>
        </form>
      )}

      {qnaList.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs space-y-2">
          <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">작성하신 상담 문의 내역이 없습니다.</p>
          <p className="text-slate-400">궁금하신 점이 있다면 언제든 1:1 문의를 남겨주세요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {qnaList.map((q) => (
            <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {q.category}
                </span>
                <span className="text-slate-400">{q.date}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{q.title}</h3>
              <p className="text-xs text-slate-600">{q.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
