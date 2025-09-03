// context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import {AxiosError, AxiosResponse} from "axios";

export type UserData = {
  username: string;
  email: string;
  avatar: string;
};

type AuthContextType = {
  user: UserData | null;
  login: () => void;
  logout: () => void;
  changeProfile: (profile: UserData) => void;
};

export const defaultUser: UserData = {
  username: "Guest User",
  email: "guest@example.com",
  avatar: ""
}

type APIResponse<T, M = unknown> = {
  data: T;
  message: string;
  code: string;
  meta?: M;
}

type LoginData = {
  access_token: string;
  refresh_token: string;
}

type APIError = APIResponse<null> & {error: string};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  // Restore session on mount
  useEffect(() => {
    if (localStorage.getItem("userProfile")) return;
    localStorage.setItem("userProfile", JSON.stringify(defaultUser));
  }, []);

  const login = async () => {
    try {
      const {data: {data: {access_token, refresh_token}}} = await api.post<'',AxiosResponse<APIResponse<LoginData>>, AxiosError<APIError>>("/api/v1/public/auth/login");
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      const data = JSON.parse(localStorage.getItem("userProfile") || "{}");
      setUser(data);
    } catch(e) {
      console.error(e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    // localStorage.removeItem("mockUser");
  };

  const changeProfile = (profile: UserData) => {
    setUser(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, changeProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
