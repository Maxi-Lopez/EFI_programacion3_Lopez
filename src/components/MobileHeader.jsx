"use client";

import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export function MobileHeader() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface border-b border-border lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          onClick={() => toggleSidebar(true)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="sidebar"
        >
          <MenuIcon />
        </button>
        <Link
          href="/productos"
          className="text-xl font-bold text-primary flex-shrink-0"
          aria-label="Nexusgamer - Inicio"
        >
          Nexusgamer
        </Link>
        <div className="w-10" />
      </div>
    </header>
  );
}