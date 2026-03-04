"use client";

import api from "@/lib/apiServer";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user on first load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/customer/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/customer/login", credentials);

    if (!res.data.success) {
      throw new Error(res.data.message);
    }

    setUser(res.data.user);

    return res.data;
  };

  const logout = async () => {
    await api.post("/customer/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};