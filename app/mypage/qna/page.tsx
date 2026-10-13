"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Plus, CheckCircle2, Pencil, Trash2, X, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";

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
  const { user } = useAuthStore();
  const [qnaList, setQnaList] = useState<QnaItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [category, setCategory] = useState("상품복용");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 로컬 스토리지에서 문의 내역 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vitalcare_user_qna");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setQnaList(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to load QnA list:", e);
      }
    }
  }, []);

  // 로컬 스토리지에 저장하는 헬퍼 함수
  const saveQnaList = (newList: QnaItem[]) => {
    setQnaList(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vitalcare_user_qna", JSON.stringify(newList));
      } catch (e) {
        console.error("Failed to save QnA list:", e);
      }
    }
  };

  // 신규 작성 폼 열기
  const handleOpenNewForm = () => {
    setEditingId(null);
    setCategory("상품복용");
    setTitle("");
    setContent("");
    setIsFormOpen(true);
  };

  // 수정 모달/폼 열기
  const handleOpenEditForm = (item: QnaItem) => {
    setEditingId(item.id);
    setCategory(item.category);
    setTitle(item.title);
    setContent(item.content);
    setIsFormOpen(true);
  };

  // 문의 작성 또는 수정 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해 주세요.");
      return;
    }

    if (editingId) {
      // 수정 모드
      const updatedList = qnaList.map((item) =>
        item.id === editingId
          ? {
              ...item,
              category,
              title: title.trim(),
              content: content.trim(),
              date: `${new Date().toISOString().slice(0, 10).replace(/-/g, ".")} (수정됨)`,
            }
          : item
      );
      saveQnaList(updatedList);
      setIsFormOpen(false);
      setEditingId(null);
      setTitle("");
      setContent("");
      alert("문의 내용이 성공적으로 수정되었습니다.");
    } else {
      // 신규 등록 모드
      const newItem: QnaItem = {
        id: `q-${Date.now()}`,
        category,
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
        isAnswered: false,
      };
      const updatedList = [newItem, ...qnaList];
      saveQnaList(updatedList);
      setIsFormOpen(false);
      setTitle("");
      setContent("");
      alert("1:1 맞춤 상담 문의가 접수되었습니다. 전문 상담사가 24시간 내 답변을 등록해 드립니다.");
    }
  };

  // 문의 삭제
  const handleDelete = (id: string, itemTitle: string) => {
    if (!confirm(`'${itemTitle}' 문의를 삭제하시겠습니까?`)) {
      return;
    }
    const updatedList = qnaList.filter((item) => item.id !== id);
    saveQnaList(updatedList);
    alert("문의가 삭제되었습니다.");
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
          onClick={handleOpenNewForm}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>새 문의 작성</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="font-bold text-slate-800 text-sm">
              {editingId ? "문의 내용 수정하기" : "새로운 문의 작성"}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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
              onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
            >
              {editingId ? "수정 완료" : "문의 등록"}
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
            <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                    {q.category}
                  </span>
                  <span className="text-slate-400">{q.date}</span>
                </div>

                {/* 수정 및 삭제 버튼군 */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditForm(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="문의 내용 수정"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>수정</span>
                  </button>
                  <button
                    onClick={() => handleDelete(q.id, q.title)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="문의 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{q.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{q.content}</p>

              {/* 영양사/상담사 답변 상태 */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs">
                {q.isAnswered ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    답변 완료
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    답변 대기중 (24시간 이내 전문 상담사가 답변드립니다)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
