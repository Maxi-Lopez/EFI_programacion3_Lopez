"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function BotonTema() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [clientMounted, setClientMounted] = useState(false);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  if (!mounted || !clientMounted) {
    return <div className="w-full h-[40px]"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
    >
      <span>{theme === "light" ? "🌙" : "☀️"}</span>
      {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
    </button>
  );
}
