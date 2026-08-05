"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Set the token cookie for middleware redirects
      document.cookie = `token=${token}; path=/; max-age=604800`; // 7 days
      api.get("/auth/me")
        .then((data: any) => {
          if (data && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem("token");
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        })
        .finally(() => setIsLoading(false));
    } else {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    const data: any = await api.post("/auth/login", credentials);
    if (data.token) {
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=604800`;
      setUser(data.user);
      router.push("/dashboard");
    }
    return data;
  };

  const register = async (userData: any) => {
    const data: any = await api.post("/auth/register", userData);
    if (data.token) {
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=604800`;
      setUser(data.user);
      router.push("/dashboard");
    }
    return data;
  };

  const logout = async () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
