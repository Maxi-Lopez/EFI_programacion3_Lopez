"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { agregarDeseoAction, quitarDeseoAction, getWishlistAction } from "@/app/actions";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]); // [{ id: wishlistItemId, productoId: productId }]
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
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error al leer la cookie:", error);
      setUser(null);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDeseo = useCallback(async (productoId) => {
    console.log("Toggle deseo:", productoId);
    if (!user) return { success: false };

    const existingItem = wishlist.find((item) => item.productoId === productoId);

    try {
      if (existingItem && existingItem.id) {
        const result = await quitarDeseoAction(existingItem.id);
        console.log("Resultado de la Server Action (quitar):", result);
        if (result.success) {
          setWishlist((prev) => prev.filter((item) => item.productoId !== productoId));
        }
        return result;
      } else if (existingItem && !existingItem.id) {
        // No tenemos el id del deseo, intentar obtenerlo del backend
        console.log("No hay id de deseo, buscando en backend...");
        const items = await getWishlistAction();
        const encontrado = items.find((item) => item.productoId === productoId);
        if (encontrado?.id) {
          setWishlist(items);
          const result = await quitarDeseoAction(encontrado.id);
          console.log("Resultado de la Server Action (quitar tras buscar):", result);
          if (result.success) {
            setWishlist((prev) => prev.filter((item) => item.productoId !== productoId));
          }
          return result;
        }
        console.log("No se encontró el deseo en el backend");
        return { success: false, error: "No se encontró el deseo para quitar" };
      } else {
        const result = await agregarDeseoAction(productoId);
        console.log("Resultado de la Server Action (agregar):", result);
        if (result.success && result.data) {
          setWishlist((prev) => [...prev, { id: result.data.id, productoId: result.data.productoId }]);
        }
        console.log("Nuevo estado wishlist:", wishlist);
        return result;
      }
    } catch (err) {
      console.error("Error toggleDeseo:", err);
      return { success: false };
    }
  }, [wishlist, user]);

  useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  useEffect(() => {
    let cancelled = false;

    // Limpiar inmediatamente el wishlist anterior
    setWishlist([]);

    if (user) {
      const cargarWishlist = async () => {
        try {
          const items = await getWishlistAction();

          // Evitar que una respuesta vieja sobrescriba el estado actual
          if (!cancelled) {
            setWishlist(items);
          }
        } catch (error) {
          console.error("Error al cargar wishlist:", error);

          if (!cancelled) {
            setWishlist([]);
          }
        }
      };

      cargarWishlist();
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Debug: log wishlist after any state change
  console.log("Wishlist en contexto:", wishlist);

  const logout = () => {
    document.cookie = "access=; path=/; max-age=0";
    document.cookie = "user_data=; path=/; max-age=0";

    setWishlist([]);
    setUser(null);

    window.location.href = "/productos";
  };

  const isAdmin = user?.role === "admin" || user?.is_staff === true;
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin, isLoggedIn, wishlist, toggleDeseo }}>
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
