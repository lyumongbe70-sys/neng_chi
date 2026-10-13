"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  Package,
  Truck,
  Boxes,
  Receipt,
  Users,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminSidebarNav() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const navItems = [
    { tab: "overview", label: "대시보드 메인", href: "/admin", icon: LayoutDashboard },
    { tab: "products", label: "상품 관리", href: "/admin?tab=products", icon: Package },
    { tab: "orders", label: "주문 / 배송 관리", href: "/admin?tab=orders", icon: Truck },
    { tab: "inventory", label: "발주 / 재고 관리", href: "/admin?tab=inventory", icon: Boxes },
    { tab: "tax", label: "세무 / 증빙 관리", href: "/admin?tab=tax", icon: Receipt },
    { tab: "members", label: "회원 / 적립금 관리", href: "/admin?tab=members", icon: Users },
  ];

  return (
    <nav className="space-y-1 text-xs font-semibold text-slate-400">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.tab;
        return (
          <Link
            key={item.tab}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold transition-all ${
              isActive
                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-950/40"
                : "hover:bg-slate-800/80 hover:text-white text-slate-400"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
