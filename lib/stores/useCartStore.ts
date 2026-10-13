import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  dosage?: string;
  volume?: string;
  category?: string;
  imageUrl?: string;
}

export function getCartUserId(): string {
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

// Supabase에 실제 존재하는 장바구니 테이블만 지정하여 불필요한 404 요청 방지
const CART_TABLES = ["Shopping Cart", "shopping_carts"];

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  fetchCartFromSupabase: () => Promise<void>;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // 1. 장바구니 상품 추가 (로컬 및 Supabase Shopping Cart 테이블 동시 반영)
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        const newQuantity = existing ? existing.quantity + item.quantity : item.quantity;

        set((state) => {
          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return {
            isOpen: true,
            items: [...state.items, item],
          };
        });

        // Supabase Shopping Cart 테이블에 추가/업데이트
        (async () => {
          try {
            const supabase = createClient();
            const userId = getCartUserId();
            const payload = {
              user_id: userId,
              product_id: item.id,
              product_name: item.name,
              product_price: item.price,
              quantity: newQuantity,
              product_image: item.imageUrl || "",
              dosage: item.dosage || "",
            };

            for (const tbl of CART_TABLES) {
              try {
                const { error } = await supabase
                  .from(tbl)
                  .upsert(payload, { onConflict: "user_id,product_id" });
                if (!error) break;
              } catch (e) {}
            }
          } catch (err) {
            console.warn("Shopping Cart 테이블 추가 알림:", err);
          }
        })();
      },

      // 2. 장바구니 상품 개별 삭제 (Shopping Cart 테이블에서 해당 목록 영구 삭제)
      removeItem: (id) => {
        // 즉시 UI 및 로컬 스토리지 반영
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));

        // Supabase Shopping Cart 테이블에서 DELETE 실행
        (async () => {
          try {
            const supabase = createClient();
            const userId = getCartUserId();

            for (const tbl of CART_TABLES) {
              try {
                const { error } = await supabase
                  .from(tbl)
                  .delete()
                  .eq("product_id", id)
                  .or(`user_id.eq.${userId},user_id.eq.guest`);
                if (!error) break;
              } catch (e) {}
            }
          } catch (err) {
            console.warn("Shopping Cart 테이블 삭제 알림:", err);
          }
        })();
      },

      // 3. 수량 변경 (0 이하 시 삭제, 그 외는 수량 업데이트)
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));

        (async () => {
          try {
            const supabase = createClient();
            const userId = getCartUserId();
            const target = get().items.find((i) => i.id === id);
            if (!target) return;

            const payload = {
              user_id: userId,
              product_id: id,
              product_name: target.name,
              product_price: target.price,
              quantity,
              product_image: target.imageUrl || "",
              dosage: target.dosage || "",
            };

            for (const tbl of CART_TABLES) {
              try {
                const { error } = await supabase
                  .from(tbl)
                  .upsert(payload, { onConflict: "user_id,product_id" });
                if (!error) break;
              } catch (e) {}
            }
          } catch (err) {}
        })();
      },

      // 4. 장바구니 전체 비우기 (Shopping Cart 테이블 전체 삭제)
      clearCart: () => {
        set({ items: [] });

        (async () => {
          try {
            const supabase = createClient();
            const userId = getCartUserId();

            for (const tbl of CART_TABLES) {
              try {
                const { error } = await supabase
                  .from(tbl)
                  .delete()
                  .or(`user_id.eq.${userId},user_id.eq.guest`);
                if (!error) break;
              } catch (e) {}
            }
          } catch (err) {}
        })();
      },

      // 5. Supabase Shopping Cart 테이블에서 장바구니 목록 동기화
      fetchCartFromSupabase: async () => {
        try {
          const supabase = createClient();
          const userId = getCartUserId();

          for (const tbl of CART_TABLES) {
            try {
              const { data, error } = await supabase
                .from(tbl)
                .select("*")
                .or(`user_id.eq.${userId},user_id.eq.guest`);

              if (!error && data && data.length > 0) {
                const dbItems: CartItem[] = data.map((row: any) => ({
                  id: String(row.product_id || row.id),
                  name: row.product_name || "상품",
                  price: Number(row.product_price) || 0,
                  quantity: Number(row.quantity) || 1,
                  dosage: row.dosage,
                  imageUrl: row.product_image || row.imageurl || row.imageUrl,
                }));

                // 로컬 장바구니와 병합
                set((state) => {
                  const existingIds = new Set(state.items.map((i) => i.id));
                  const merged = [...state.items];
                  for (const item of dbItems) {
                    if (!existingIds.has(item.id)) {
                      merged.push(item);
                    }
                  }
                  return { items: merged };
                });
                break;
              }
            } catch (e) {}
          }
        } catch (err) {}
      },

      getTotalCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "vitalcare_user_cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          setTimeout(() => {
            state.fetchCartFromSupabase();
          }, 100);
        }
      },
    }
  )
);
