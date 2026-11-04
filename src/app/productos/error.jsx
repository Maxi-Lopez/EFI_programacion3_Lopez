"use client";

import { Boton } from "@/components/Boton";

export default function ProductosError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink">Error al cargar productos</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        {error?.message || "Ocurrió un error inesperado. La API podría estar dormida o hubo un problema de conexión."}
      </p>
      <div className="flex gap-3">
        <Boton variant="primary" onClick={reset}>
          Reintentar
        </Boton>
        <Boton variant="outline" asChild>
          <a href="/productos">Volver al catálogo</a>
        </Boton>
      </div>
    </div>
  );
}