import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";

type AuthState = {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAdmin: () => get().user?.roles.includes("ROLE_ADMIN") ?? false,
      isAuthenticated: () => Boolean(get().token && get().user),
    }),
    {
      name: "jkcards-auth",
    },
  ),
);

