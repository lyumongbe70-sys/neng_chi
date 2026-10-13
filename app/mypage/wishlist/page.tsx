"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore, getWishlistUserId } from "@/lib/stores/useWishlistStore";
import { useCartStore } from "@/lib/stores/useCartStore";
import { PRODUCTS as INITIAL_MOCK_PRODUCTS } from "@/lib/data/mockProducts";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import { Heart, ShoppingBag, Trash2, Pill, Loader2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, setWishlistIds, fetchWishlistFromSupabase } = useWishlistStore();
  const { addItem } = useCartStore();
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  const [dbWishlistItems, setDbWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadWishlistAndProducts = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const userId = getWishlistUserId();

        // 1. Supabase wishlists 테이블에서 찜 데이터 조회
        const { data: wishData, error: wishError } = await supabase
          .from("wishlists")
          .select("*")
          .or(`user_id.eq.${userId},user_id.eq.guest`);

        if (!wishError && wishData && wishData.length > 0) {
          if (isMounted) {
            setDbWishlistItems(wishData);
            const dbIds = wishData.map((w: any) => String(w.product_id));
            setWishlistIds(Array.from(new Set([...wishlistIds, ...dbIds])));
          }
        }

        // 2. Supabase products 테이블에서 최신 상품 목록 조회
        const { data: prodData, error: prodError } = await supabase
          .from("products")
          .select("*");

        if (!prodError && prodData && prodData.length > 0) {
          const mapped: Product[] = prodData.map((row: any) => ({
            id: String(row.id),
            name: row.name || "",
            category: row.category || "기초활력·비타민",
            categorySlug: row.categoryslug || row.categorySlug || "energy-vitamin",
            brand: row.brand || "바이탈케어 랩스",
            price: Number(row.price) || 0,
            originalPrice: Number(row.originalprice ?? row.originalPrice ?? row.price ?? 0),
            discountRate: Number(row.discountrate ?? row.discountRate ?? 0),
            rating: Number(row.rating ?? 5.0),
            reviewCount: Number(row.reviewcount ?? row.reviewCount ?? 0),
            dosage: row.dosage || "1일 1회, 1정을 충분한 물과 함께 섭취",
            volume: row.volume || "60정 (2개월분)",
            certifications: ["식약처 기능성 인정", "GMP 제조시설"],
            tags: ["건강기능식품", "식약처인증"],
            badge: row.badge || undefined,
            description: row.description || "",
            features: ["엄선된 프리미엄 원료", "과학적 맞춤 배합"],
            nutritionFacts: [],
            stock: Number(row.stock ?? 100),
            imageUrl: row.imageurl || row.imageUrl || "/product-doctor-ps.png",
          }));
          if (isMounted) {
            setAllProducts(mapped);
          }
        } else {
          // 로컬 스토리지 상품 정보 폴백
          if (typeof window !== "undefined") {
            const saved = localStorage.getItem("vitalcare_admin_products");
            if (saved) {
              try {
                if (isMounted) setAllProducts(JSON.parse(saved));
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.warn("찜 목록 불러오기 알림:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadWishlistAndProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // 찜한 상품 데이터 조합 (products 테이블 + wishlists 테이블 직접 저장된 메타데이터)
  const wishlistedProducts: Product[] = wishlistIds.map((id) => {
    // 1. 등록된 상품 리스트에서 찾기
    const found = allProducts.find((p) => p.id === id);
    if (found) return found;

    // 2. 만약 products에 없지만 wishlists 테이블에 product_name 등이 보관되어 있다면 복원
    const dbRow = dbWishlistItems.find((w) => String(w.product_id) === id);
    if (dbRow) {
      return {
        id,
        name: dbRow.product_name || `찜한 상품 (${id})`,
        category: dbRow.product_category || "건강기능식품",
        categorySlug: "energy-vitamin",
        brand: "바이탈케어",
        price: Number(dbRow.product_price) || 0,
        originalPrice: Number(dbRow.product_price) || 0,
        discountRate: 0,
        rating: 5.0,
        reviewCount: 0,
        dosage: "1일 1회 섭취",
        volume: "1개월분",
        certifications: [],
        tags: [],
        description: "",
        features: [],
        nutritionFacts: [],
        stock: 50,
        imageUrl: dbRow.product_image || "/product-doctor-ps.png",
      };
    }

    // 3. mock products에서 찾기
    const mockFound = INITIAL_MOCK_PRODUCTS.find((p) => p.id === id);
    if (mockFound) return mockFound;

    return {
      id,
      name: `상품 ${id}`,
      category: "건강기능식품",
      categorySlug: "energy-vitamin",
      brand: "바이탈케어",
      price: 0,
      originalPrice: 0,
      discountRate: 0,
      rating: 5.0,
      reviewCount: 0,
      dosage: "1일 1회",
      volume: "기본용량",
      certifications: [],
      tags: [],
      description: "",
      features: [],
      nutritionFacts: [],
      stock: 0,
      imageUrl: "/product-doctor-ps.png",
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            찜한 상품 목록
            <span className="text-emerald-700 bg-emerald-50 text-xs px-2.5 py-0.5 rounded-full font-black border border-emerald-200">
              {wishlistedProducts.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            관심있는 영양제를 찜해두고 간편하게 주문해보세요.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Supabase 클라우드 실시간 동기화됨
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">찜한 상품 목록을 불러오는 중입니다...</p>
        </div>
      ) : wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-400">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-700">찜한 상품이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">상품 카드 우측 상단의 하트 아이콘을 눌러 찜해보세요!</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <span>인기 영양제 둘러보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl border border-slate-200/90 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all bg-white group"
            >
              <div>
                {/* 상단 카테고리와 찜 해제 버튼 */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="찜 해제"
                    aria-label="찜 해제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 썸네일 이미지 */}
                <Link href={`/products/${product.id}`} className="block">
                  <div className="w-full h-36 rounded-xl bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-2 mb-3 border border-slate-100 group-hover:scale-[1.02] transition-transform">
                    {product.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-emerald-600">
                        <Pill className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-slate-400 mt-1">{product.volume}</p>
              </div>

              {/* 하단 가격 및 장바구니 담기 버튼 */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-base font-black text-slate-900">
                    {product.price.toLocaleString()}
                    <span className="text-xs font-semibold ml-0.5">원</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      quantity: 1,
                      dosage: product.dosage,
                      volume: product.volume,
                      category: product.category,
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>담기</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
