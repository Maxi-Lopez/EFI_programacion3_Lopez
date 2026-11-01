"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

const campo =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-2 focus:outline-brand/30";

export default function LoginPage() {
  const [estado, accion, pendiente] = useActionState(login, null);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-field px-5">
      <form
        action={accion}
        className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm"
      >
        <h1 className="font-display text-2xl font-semibold text-ink">Iniciar sesión</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">Panel de inventario</p>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Usuario
            <input name="username" autoComplete="username" required autoFocus className={campo} />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Contraseña
            <input name="password" type="password" autoComplete="current-password" required className={campo} />
          </label>
        </div>

        {estado?.error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {estado.error}
          </p>
        )}

        <button
          disabled={pendiente}
          className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
        >
          {pendiente ? "Entrando..." : "Entrar"}
        </button>
        {pendiente && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Si la API estaba dormida, puede tardar hasta un minuto.
          </p>
        )}
      </form>
    </div>
  );
}
