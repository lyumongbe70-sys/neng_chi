import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/services/productService";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import MobileTabBar from "@/components/MobileTabBar";
import ProductDetailClient from "@/components/ProductDetailClient";
import { PRODUCTS } from "@/lib/data/mockProducts";
import { ChevronLeft } from "lucide-react";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ProductDetailContent({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* 브레드크럼 */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>
      </div>

      {/* 상세 인터랙티브 클라이언트 뷰어 */}
      <ProductDetailClient product={product} />
    </>
  );
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center text-xs text-slate-400">
              상품 정보를 불러오는 중입니다...
            </div>
          }
        >
          <ProductDetailContent params={params} />
        </Suspense>
      </main>

      <MobileTabBar />
    </div>
  );
}
