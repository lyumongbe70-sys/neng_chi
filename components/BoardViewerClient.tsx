"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  Users,
  Calendar,
  Lock,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  ChevronRight,
  Eye,
  MessageCircle,
} from "lucide-react";
import { BoardType } from "@/types/database";

interface BoardItem {
  id: string;
  type: BoardType;
  title: string;
  author: string;
  date: string;
  views: number;
  commentsCount?: number;
  isSecret?: boolean;
  isAnswered?: boolean;
  content: string;
}

const INITIAL_POSTS: Record<BoardType, BoardItem[]> = {
  NOTICE: [
    {
      id: "n-1",
      type: "NOTICE",
      title: "[공지] 추석 및 연휴 기간 배송 마감 일정 및 고객센터 운영 안내",
      author: "바이탈케어 관리자",
      date: "2026.10.05",
      views: 1420,
      content:
        "안녕하세요. 바이탈케어입니다. 연휴 기간 우체국 택배 마감은 10월 8일 오후 2시까지 입금 완료 건에 한하여 당일 출고됩니다. 이후 주문 건은 연휴 익일부터 순차 발송됩니다.",
    },
    {
      id: "n-2",
      type: "NOTICE",
      title: "[안내] 100억 생유산균 신바이오틱스 4중 특허 코팅 리뉴얼 출시",
      author: "연구개발팀",
      date: "2026.09.20",
      views: 980,
      content:
        "기존 제품 대비 장내 생존력을 35% 향상시킨 4중 특허 코팅 기술이 적용된 신바이오틱스가 정식 출시되었습니다.",
    },
  ],
  QNA: [
    {
      id: "q-1",
      type: "QNA",
      title: "오메가3 섭취 시 다른 비타민제와 함께 먹어도 문제없나요?",
      author: "이*진",
      date: "2026.10.06",
      views: 84,
      isSecret: false,
      isAnswered: true,
      content: "오메가3와 멀티비타민을 식후에 함께 복용 중인데 상호작용이 없는지 궁금합니다.",
    },
    {
      id: "q-2",
      type: "QNA",
      title: "비밀글입니다. (개인 복용 처방약 관련 상담)",
      author: "박*호",
      date: "2026.10.05",
      views: 12,
      isSecret: true,
      isAnswered: true,
      content: "비밀글 내용입니다.",
    },
  ],
  FREE: [
    {
      id: "f-1",
      type: "FREE",
      title: "[건강상식] 식후에 바로 비타민을 먹어야 속이 편한 이유!",
      author: "약사김선생",
      date: "2026.10.04",
      views: 520,
      commentsCount: 8,
      content:
        "지용성 비타민은 음식물 속 지방 성분과 함께 흡수될 때 흡수율이 최대 3배까지 올라갑니다. 공복 섭취는 피하세요!",
    },
    {
      id: "f-2",
      type: "FREE",
      title: "1+1 오메가3 한 달 복용 찐 후기 공유합니다 ㅎㅎ",
      author: "매일활력",
      date: "2026.10.02",
      views: 310,
      commentsCount: 5,
      content: "비린내 안 나는 게 제일 좋았고 아침 피로감이 많이 줄어들었어요 강추합니다.",
    },
  ],
  RESERVATION: [
    {
      id: "r-1",
      type: "RESERVATION",
      title: "[예약완료] 10월 12일 본사 연구소 1:1 맞춤 영양 상태 정밀 분석",
      author: "김*철",
      date: "2026.10.06",
      views: 4,
      isSecret: true,
      isAnswered: true,
      content: "10월 12일 14:00 방문 예약 확정되었습니다. (준비물: 신분증)",
    },
  ],
};

interface BoardViewerClientProps {
  type: BoardType;
}

export default function BoardViewerClient({ type }: BoardViewerClientProps) {
  const [posts, setPosts] = useState<BoardItem[]>(INITIAL_POSTS[type] || []);
  const [selectedPost, setSelectedPost] = useState<BoardItem | null>(null);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const getBoardTitle = () => {
    switch (type) {
      case "NOTICE":
        return { name: "공지사항", desc: "바이탈케어의 중요 공지와 배송 안내를 전해드립니다." };
      case "QNA":
        return { name: "질문과 답변 (Q&A)", desc: "영양제 복용법 및 상품 관련 질문을 남겨주세요." };
      case "FREE":
        return { name: "건강 상식 자유게시판", desc: "고객님들의 건강 꿀팁과 생생한 경험을 나눠보세요." };
      case "RESERVATION":
        return { name: "방문 상담 & 예약 확인", desc: "전문 영양 상담 및 연구소 체험 예약 현황을 조회합니다." };
    }
  };

  const info = getBoardTitle();

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BoardItem = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      title: newTitle,
      author: "홍길동",
      date: "2026.10.07",
      views: 1,
      isSecret,
      isAnswered: false,
      content: newContent,
      commentsCount: 0,
    };
    setPosts([newPost, ...posts]);
    setIsWriteOpen(false);
    setNewTitle("");
    setNewContent("");
    setIsSecret(false);
    alert("게시글이 성공적으로 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* 상단 타이틀 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{info.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{info.desc}</p>
        </div>

        {type !== "NOTICE" && (
          <button
            onClick={() => setIsWriteOpen(!isWriteOpen)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>글쓰기</span>
          </button>
        )}
      </div>

      {/* 새 글 작성 모달/폼 */}
      {isWriteOpen && (
        <form onSubmit={handleCreatePost} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">새 게시글 작성</h3>
          <div>
            <label className="font-bold text-slate-700 block mb-1">제목</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">내용</label>
            <textarea
              required
              rows={5}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="내용을 작성해주세요."
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
            />
          </div>

          {(type === "QNA" || type === "RESERVATION") && (
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                비밀글로 등록 (작성자와 관리자만 열람 가능)
              </span>
            </label>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWriteOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
            >
              등록하기
            </button>
          </div>
        </form>
      )}

      {/* 선택된 게시글 상세 뷰어 */}
      {selectedPost ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <button
            onClick={() => setSelectedPost(null)}
            className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline"
          >
            ← 목록으로 돌아가기
          </button>

          <div className="border-b pb-4 space-y-2">
            <h2 className="text-xl font-black text-slate-900">{selectedPost.title}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>작성자: {selectedPost.author}</span>
              <span>작성일: {selectedPost.date}</span>
              <span>조회수: {selectedPost.views}</span>
            </div>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line min-h-32">
            {selectedPost.content}
          </div>
        </div>
      ) : (
        /* 게시판 테이블 목록 */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="divide-y divide-slate-100">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  if (post.isSecret && post.author !== "홍길동") {
                    alert("비밀글은 작성자 및 관리자만 조회할 수 있습니다.");
                    return;
                  }
                  setSelectedPost(post);
                }}
                className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {post.isSecret && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> 비밀글
                      </span>
                    )}

                    {type === "QNA" && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          post.isAnswered
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {post.isAnswered ? "답변완료" : "답변대기"}
                      </span>
                    )}

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.views}
                    </span>
                    {post.commentsCount !== undefined && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <MessageCircle className="w-3 h-3" /> {post.commentsCount}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
