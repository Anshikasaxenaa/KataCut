"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import React, { createContext, useContext } from "react";

// For compatibility with the old AuthProvider, we can wrap SessionProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

// Hook wrapper for compatibility with the old `useAuth` if needed
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user || null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login: async (provider = "google", options?: any) => {
      return await signIn(provider, { callbackUrl: "/dashboard", ...options });
    },
    logout: async () => {
      await signOut({ callbackUrl: "/login" });
    },
  };
}
