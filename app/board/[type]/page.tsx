import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
import BoardViewerClient from "@/components/BoardViewerClient";
import { BoardType } from "@/types/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function generateStaticParams() {
  return [
    { type: "notice" },
    { type: "qna" },
    { type: "free" },
    { type: "reservation" },
  ];
}

interface BoardPageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { type: rawType } = await params;
  const upperType = rawType.toUpperCase() as BoardType;

  const validTypes: BoardType[] = ["NOTICE", "QNA", "FREE", "RESERVATION"];
  if (!validTypes.includes(upperType)) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-24 md:pb-16">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <BoardViewerClient type={upperType} />
      </main>

      <MobileTabBar />
    </div>
  );
}
