// context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  // Restore session on mount
  useEffect(() => {
    if (localStorage.getItem("userProfile")) return;
    localStorage.setItem("userProfile", JSON.stringify(defaultUser));
  }, []);

  const login = () => {
    const data = JSON.parse(localStorage.getItem("userProfile") || "{}");
    setUser(data);
  };

  const logout = () => {
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
