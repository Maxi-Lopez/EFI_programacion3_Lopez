"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions";

const items = [
  { href: "/articulos", label: "Artículos" },
  { href: "/proveedores", label: "Proveedores" },
];


export default function Sidebar() {
  const pathname = usePathname();
  const logueado = pathname !== "/login";

  return (
    <aside className="flex items-center gap-6 bg-ink px-5 py-3 text-white md:fixed md:inset-y-0 md:left-0 md:w-60 md:flex-col md:items-stretch md:gap-0 md:py-8">
      <p className="font-display text-xl font-semibold md:mb-10">Inventario</p>
      <nav className="flex gap-1 md:flex-col">
        {items.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white ${active ? "bg-white/15 text-white" : "text-white/65 hover:text-white"
                }`}
            >
              {label}
            </Link>
          );
        })}
        {logueado ? (
          <form action={logout}>
            <button className="text-sm text-white/65 hover:text-white focus-visible:outline-2 focus-visible:outline-white">
              Cerrar sesión
            </button>
          </form>
        ) : (
          <Link
            key={"/login"}
            href={"/login"}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white bg-white/15 text-white`}
          >
            {"login"}
          </Link>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-4 md:ml-0 md:mt-auto md:flex-col md:items-start md:gap-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/admin/`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-white/65 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
        >
          Admin de Django
        </a>
        <form action={logout}>
          <button className="text-sm text-white/65 hover:text-white focus-visible:outline-2 focus-visible:outline-white">
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
