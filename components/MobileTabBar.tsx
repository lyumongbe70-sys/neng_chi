"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/stores/useCartStore";
import { useWishlistStore } from "@/lib/stores/useWishlistStore";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { toggleCart, getTotalCount } = useCartStore();
  const { getCount: getWishlistCount } = useWishlistStore();

  const cartCount = getTotalCount();
  const wishlistCount = getWishlistCount();

  const isHome = pathname === "/";
  const isWishlist = pathname.startsWith("/mypage/wishlist");
  const isMypage = pathname.startsWith("/mypage") && !isWishlist;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-4">
      <div className="flex items-center justify-around">
        {/* 홈 */}
        <Link
          href="/"
          className={`flex flex-col items-center py-1 transition-colors ${
            isHome ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">홈</span>
        </Link>

        {/* 카테고리 */}
        <Link
          href="/#categories"
          className="flex flex-col items-center py-1 text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">카테고리</span>
        </Link>

        {/* 찜 목록 */}
        <Link
          href="/mypage/wishlist"
          className={`flex flex-col items-center py-1 relative transition-colors ${
            isWishlist ? "text-rose-600 font-bold" : "text-slate-500"
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">찜</span>
        </Link>

        {/* 장바구니 */}
        <button
          type="button"
          onClick={toggleCart}
          className="flex flex-col items-center py-1 text-slate-500 relative hover:text-emerald-600 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">장바구니</span>
        </button>

        {/* 마이페이지 */}
        <Link
          href="/mypage"
          className={`flex flex-col items-center py-1 transition-colors ${
            isMypage ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">마이</span>
        </Link>
      </div>
    </nav>
  );
}
