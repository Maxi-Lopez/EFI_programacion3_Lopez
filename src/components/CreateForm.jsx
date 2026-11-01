"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-brand";

export default function CreateForm({ title, endpoint, fields }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {};

    for (const f of fields) {
      const value = data.get(f.name);
      if (f.type === "checkbox") body[f.name] = value === "on";
      else if (f.type === "number" || f.type === "select") body[f.name] = Number(value);
      else body[f.name] = value;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401 || res.status === 403) {
        setError("La API pide iniciar sesión para guardar (JWT).");
      } else if (!res.ok) {
        setError("No se pudo guardar. Revisa que los datos sean válidos.");
      } else {
        form.reset();
        router.refresh();
      }
    } catch {
      setError("No se pudo conectar con la API. Revisa la URL y CORS_ORIGINS.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="mb-6 rounded-xl border border-line bg-white">
      <summary className="cursor-pointer select-none px-5 py-3 text-sm font-medium text-brand focus-visible:outline-2 focus-visible:outline-brand">
        {title}
      </summary>
      <form onSubmit={onSubmit} autoComplete="off" className="grid gap-4 border-t border-line p-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className="flex flex-col gap-1 text-sm text-slate-600">
            {f.label}
            {f.type === "select" ? (
              <select name={f.name} required className={input}>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "checkbox" ? (
              <input name={f.name} type="checkbox" defaultChecked={f.defaultChecked} className="size-5 accent-brand" />
            ) : (
              <input name={f.name} type={f.type} required className={input} />
            )}
          </label>
        ))}
        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            disabled={saving}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </details>
  );
}
