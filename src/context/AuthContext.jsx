"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadUser = useCallback(() => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_data="));

      if (cookie) {
        const data = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al leer la cookie:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  const logout = async () => {
    document.cookie = "access=; path=/; max-age=0";
    document.cookie = "user_data=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/productos";
  };

  const isAdmin = user?.role === "admin" || user?.is_staff === true;

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}