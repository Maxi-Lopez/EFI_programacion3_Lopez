"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BotonTema } from "@/components/BotonTema";
import { useSidebar } from "@/context/SidebarContext";

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin, isVendedor, loading } = useAuth();
  const { isOpen, toggleSidebar } = useSidebar();

  const navItems = [
    { href: "/productos", label: "Productos", icon: "📦" },
    { href: "/movimientos", label: "Movimientos", icon: "📊", admin: true },
    { href: "/proveedores", label: "Proveedores", icon: "🏢", admin: true },
    { href: "/lista-deseos", label: "Lista de Deseos", icon: "❤️", requiresAuth: true },
    { href: "/sobre-nosotros", label: "Sobre Nosotros", icon: "💬" },
  ];

  const filteredItems = navItems.filter((item) => {
    if (item.admin && !isAdmin) return false;
    if (item.requiresAuth && !user) return false;
    return true;
  });

  const handleNavClick = () => {
    toggleSidebar(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => toggleSidebar(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-label="Navegación principal"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/productos" className="text-xl font-bold text-primary" onClick={handleNavClick}>
              Nexusgamer
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              onClick={() => toggleSidebar(false)}
              aria-label="Cerrar menú"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }
                `}
                onClick={handleNavClick}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="text-center text-sm text-slate-500 py-2">Cargando...</div>
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <p className="px-3 text-xs text-slate-500 dark:text-slate-400">
                    👤 {user.username} <span className="font-bold text-brand">{isAdmin ? "(Administrador)" : isVendedor ? "(Vendedor)" : "(Cliente)"}</span>
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
                <>
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <span>🔐</span>
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 border-primary text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>📝</span>
                    Registrarse
                  </Link>
                </>
              )}

              <BotonTema />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}