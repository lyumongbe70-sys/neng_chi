"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserSession {
  id: string;
  username: string;
  email: string;
  points: number;
  role?: "ADMIN" | "USER";
}

interface AuthStore {
  user: UserSession | null;
  login: (user: UserSession) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      login: (user) => {
        // admin 아이디 또는 admin 이메일인 경우 ADMIN 권한 부여
        const isAdminUser =
          user.username === "admin" ||
          user.email.includes("admin") ||
          user.role === "ADMIN";

        const resolvedUser: UserSession = {
          ...user,
          role: isAdminUser ? "ADMIN" : user.role || "USER",
        };
        set({ user: resolvedUser });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("vitalcare_logged_in_user");
        }
        set({ user: null });
      },
      isAdmin: () => {
        const u = get().user;
        if (!u) return false;
        return (
          u.role === "ADMIN" ||
          u.username === "admin" ||
          u.email.includes("admin")
        );
      },
    }),
    {
      name: "vitalcare_auth_session",
    }
  )
);
