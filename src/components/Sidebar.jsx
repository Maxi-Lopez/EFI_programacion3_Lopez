"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
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
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/productos" className="text-xl font-bold text-primary">
            Nexusgamer
          </Link>
        </div>

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

          {user && (
            <Link
              href="/lista-deseos"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>❤️</span>
              Lista de Deseos
            </Link>
          )}

          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/admin/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span>⚙️</span>
            Django Admin
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{theme === "light" ? "🌙" : "☀️"}</span>
              {theme === "light" ? "Modo Oscuro" : "Modo Claro"}
            </button>
          )}

          {user && (
            <div className="pt-2">
              <p className="px-3 text-xs text-slate-500 dark:text-slate-400">{user.username}</p>
              <form action={logout} className="mt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span>🚪</span>
                  Cerrar Sesión
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}