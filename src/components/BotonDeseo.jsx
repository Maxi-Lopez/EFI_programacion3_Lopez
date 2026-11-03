"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export function BotonDeseo({ productoId }) {
  // 1. TODOS LOS HOOKS PRIMERO (sin condiciones)
  const { user, wishlist, toggleDeseo } = useAuth();
  const [loading, setLoading] = useState(false);

  // 2. El hook useCallback
  const handleClick = useCallback(async () => {
    setLoading(true);
    const result = await toggleDeseo(productoId);
    if (result?.error) {
      console.error("[BotonDeseo] Error:", result.error);
      alert("Error: " + result.error);
    }
    setLoading(false);
  }, [productoId, toggleDeseo]);

  // 3. AHORA SÍ, las condiciones (después de todos los hooks)
  if (!user) return null;

  const isFavorite = wishlist.some((item) => item.productoId === productoId);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
        isFavorite
          ? "text-red-500 bg-red-50 dark:bg-red-900/20"
          : "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isFavorite ? "Quitar de deseos" : "Agregar a deseos"}
      title={isFavorite ? "Quitar de deseos" : "Agregar a deseos"}
    >
      {isFavorite ? (
        <span className="text-red-500 text-xl font-bold" aria-hidden="true">❤️</span>
      ) : (
        <span className="text-slate-400 text-xl font-bold" aria-hidden="true">🤍</span>
      )}
    </button>
  );
}
