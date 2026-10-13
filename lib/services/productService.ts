import { Product } from "@/types/product";
import { PRODUCTS } from "@/lib/data/mockProducts";
import { createClient } from "@/lib/supabase/client";

/**
 * Service to fetch products from Supabase with graceful fallback to mock data.
 */
export async function getProducts(options?: {
  categorySlug?: string;
  query?: string;
  sort?: "popular" | "recent" | "price-asc" | "price-desc";
}): Promise<Product[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if real Supabase credentials are configured
    const isConfigured =
      supabaseUrl &&
      anonKey &&
      anonKey !== "YOUR_SUPABASE_ANON_KEY" &&
      supabaseUrl.startsWith("http");

    if (isConfigured) {
      const supabase = createClient();
      let queryBuilder = supabase.from("products").select("*");

      if (options?.categorySlug && options.categorySlug !== "all") {
        queryBuilder = queryBuilder.eq("categoryslug", options.categorySlug);
      }

      const { data, error } = await queryBuilder;
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
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
        })) as Product[];
      }
    }
  } catch (err) {
    console.warn("Supabase fetch failed or not configured, using fallback:", err);
  }

  // Graceful fallback to mock data
  let result = [...PRODUCTS];

  if (options?.categorySlug && options.categorySlug !== "all") {
    result = result.filter((p) => p.categorySlug === options.categorySlug);
  }

  if (options?.query && options.query.trim() !== "") {
    const q = options.query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (options?.sort) {
    switch (options.sort) {
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  }

  return result;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}
