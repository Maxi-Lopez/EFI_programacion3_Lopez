"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin, loading } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

  const navItems = [
    { href: "/productos", label: "Productos", icon: "📦" },
    { href: "/categorias", label: "Categorías", icon: "📂", admin: true },
    { href: "/marcas", label: "Marcas", icon: "🏷️", admin: true },
    { href: "/ventas", label: "Ventas", icon: "💰", admin: true },
    { href: "/compras", label: "Compras", icon: "🛒", admin: true },
  ];

  const filteredItems = navItems.filter((item) => !item.admin || isAdmin);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 lg:translate-x-0">
      <div className="flex flex-col h-full">
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/productos" className="text-xl font-bold text-primary">
            Nexusgamer
          </Link>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Link de Lista de Deseos (Solo si está logueado) */}
          {user && (
            <Link
              href="/lista-deseos"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>❤️</span>
              Lista de Deseos
            </Link>
          )}
        </nav>

        {/* Footer del Sidebar (Auth + Tema) */}
        <div className="p-4 border-t border-border space-y-3">
          
          {/* Lógica de Sesión */}
          {loading ? (
            <div className="text-center text-sm text-slate-500 py-2">Cargando...</div>
          ) : user ? (
            <div>
              <p className="px-3 text-xs text-slate-500 dark:text-slate-400 mb-1">
                {user.username} {isAdmin && "(Admin)"}
              </p>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                <span>🚪</span>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <span>🔐</span>
              Iniciar Sesión
            </Link>
          )}

          {/* Toggle de Tema */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{theme === "light" ? "🌙" : "☀️"}</span>
              {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}