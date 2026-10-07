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
        queryBuilder = queryBuilder.eq("category_slug", options.categorySlug);
      }

      const { data, error } = await queryBuilder;
      if (!error && data && data.length > 0) {
        return data as unknown as Product[];
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
