"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { agregarListaDeseos, borrarListaDeseos } from "@/lib/api-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const loadUserRef = useRef(null);
  const loadWishlistRef = useRef(null);

  const loadUser = useCallback(async () => {
    try {
      const cookie = document.cookie.split("; ").find((c) => c.startsWith("user_data="));
      if (cookie) {
        const value = decodeURIComponent(cookie.split("=")[1]);
        setUser(JSON.parse(value));
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/usuarios/lista-deseos-get/");
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results ?? [];
        setWishlist(items.map((w) => w.producto_id ?? w.id).filter(Boolean));
      }
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    loadUserRef.current = loadUser;
    loadWishlistRef.current = loadWishlist;
  }, [loadUser, loadWishlist]);

  useEffect(() => {
    loadUserRef.current?.();
  }, []);

  useEffect(() => {
    if (user) loadWishlistRef.current?.();
  }, [user]);

  const login = useCallback(async (username, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const result = await fetch("/api/login", { method: "POST", body: formData }).then((r) => r.json());
    if (result.success) {
      await loadUserRef.current?.();
      router.push("/productos");
      router.refresh();
    }
    return result;
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    setWishlist([]);
    router.push("/login");
    router.refresh();
  }, [router]);

  const toggleDeseo = useCallback(async (productoId) => {
    if (!user) return { error: "Debes iniciar sesión" };
    const exists = wishlist.includes(productoId);
    let result;
    if (exists) {
      result = await borrarListaDeseos(productoId);
    } else {
      result = await agregarListaDeseos({ producto: productoId });
    }
    if (result.success) {
      setWishlist((prev) => (exists ? prev.filter((id) => id !== productoId) : [...prev, productoId]));
    }
    return result;
  }, [user, wishlist]);

  const value = {
    user,
    wishlist,
    loading,
    login,
    logout,
    toggleDeseo,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin" || user?.is_staff === true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}