import { create } from "zustand";

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: ["p-vitamin-01"],
  toggleWishlist: (productId: string) => {
    set((state) => {
      const exists = state.wishlistIds.includes(productId);
      return {
        wishlistIds: exists
          ? state.wishlistIds.filter((id) => id !== productId)
          : [...state.wishlistIds, productId],
      };
    });
  },
  isWishlisted: (productId: string) => {
    return get().wishlistIds.includes(productId);
  },
  getCount: () => get().wishlistIds.length,
}));
