"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function BotonDeseo({ productoId, initialInWishlist = false }) {
  const { toggleDeseo, isLoggedIn } = useAuth();
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const result = await toggleDeseo(productoId);
    if (result.success) {
      setInWishlist(!inWishlist);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        inWishlist
          ? "text-red-500 bg-red-50 dark:bg-red-900/20"
          : "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={inWishlist ? "Quitar de deseos" : "Agregar a deseos"}
      title={inWishlist ? "Quitar de deseos" : "Agregar a deseos"}
    >
      <svg
        className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}