import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

export interface WishlistProductInfo {
  name?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

export function getWishlistUserId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const session = localStorage.getItem("vitalcare_auth_session");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed?.state?.user?.id) {
        return parsed.state.user.id;
      }
    }
  } catch (e) {}

  let guestId = localStorage.getItem("vitalcare_guest_id");
  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("vitalcare_guest_id", guestId);
  }
  return guestId;
}

interface WishlistState {
  wishlistIds: string[];
  isLoading: boolean;
  isLoaded: boolean;
  toggleWishlist: (productId: string, productInfo?: WishlistProductInfo) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  getCount: () => number;
  fetchWishlistFromSupabase: () => Promise<void>;
  setWishlistIds: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      isLoading: false,
      isLoaded: false,

      setWishlistIds: (ids: string[]) => {
        set({ wishlistIds: ids });
      },

      toggleWishlist: async (productId: string, productInfo?: WishlistProductInfo) => {
        const currentIds = get().wishlistIds;
        const exists = currentIds.includes(productId);
        const nextIds = exists
          ? currentIds.filter((id) => id !== productId)
          : [...currentIds, productId];

        // 1. 즉시 UI 반영 (Optimistic Update)
        set({ wishlistIds: nextIds });

        // 2. Supabase 찜(wishlists) 테이블 연동
        try {
          const supabase = createClient();
          const userId = getWishlistUserId();

          if (exists) {
            // Supabase 테이블에서 삭제
            await supabase
              .from("wishlists")
              .delete()
              .eq("product_id", productId)
              .or(`user_id.eq.${userId},user_id.eq.guest`);
          } else {
            // Supabase 테이블에 상품 정보와 함께 저장
            const fullPayload = {
              user_id: userId,
              product_id: productId,
              product_name: productInfo?.name || "",
              product_price: productInfo?.price || 0,
              product_image: productInfo?.imageUrl || "",
              product_category: productInfo?.category || "",
            };

            const { error } = await supabase
              .from("wishlists")
              .upsert(fullPayload, { onConflict: "user_id,product_id" });

            if (error) {
              // 컬럼이 간소화된 테이블일 경우 기본 키 컬럼만으로 재시도
              await supabase
                .from("wishlists")
                .upsert(
                  { user_id: userId, product_id: productId },
                  { onConflict: "user_id,product_id" }
                );
            }
          }
        } catch (err) {
          console.warn("Supabase wishlists sync note:", err);
        }
      },

      isWishlisted: (productId: string) => {
        return get().wishlistIds.includes(productId);
      },

      getCount: () => {
        return get().wishlistIds.length;
      },

      fetchWishlistFromSupabase: async () => {
        try {
          set({ isLoading: true });
          const supabase = createClient();
          const userId = getWishlistUserId();

          const { data, error } = await supabase
            .from("wishlists")
            .select("product_id")
            .or(`user_id.eq.${userId},user_id.eq.guest`);

          if (!error && data && Array.isArray(data)) {
            const dbIds = data.map((item: any) => String(item.product_id));
            const merged = Array.from(new Set([...get().wishlistIds, ...dbIds]));
            set({ wishlistIds: merged, isLoaded: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (e) {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "vitalcare_user_wishlist",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          setTimeout(() => {
            state.fetchWishlistFromSupabase();
          }, 100);
        }
      },
    }
  )
);
