"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { crearArticulo } from "@/app/actions";

const campo =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-2 focus:outline-brand/30";

export default function AgregarArticulo() {
  const router = useRouter();
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const abrir = () => dialogRef.current?.showModal();
  const cerrar = () => dialogRef.current?.close();

  async function onSubmit(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = {
      nombre: String(d.get("nombre")).trim(),
      precio: Number(d.get("precio")),
      stock: Number(d.get("stock")),
      proveedor: Number(d.get("proveedor")),
    };

    setSaving(true);
    setError("");
    const r = await crearArticulo(body);
    setSaving(false);
    if (r?.error) {
      setError(r.error);
    } else {
      cerrar();
      router.refresh();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden="true">
          <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
        </svg>
        Agregar
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="titulo-agregar"
        onClose={() => {
          formRef.current?.reset();
          setError("");
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) cerrar(); // clic en el fondo
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-slate-800 shadow-2xl transition duration-200 backdrop:bg-ink/50 backdrop:backdrop-blur-sm open:starting:translate-y-2 open:starting:scale-95 open:starting:opacity-0"
      >
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div>
              <h2 id="titulo-agregar" className="font-display text-xl font-semibold text-ink">
                Agregar artículo
              </h2>
              <p className="mt-1 text-sm text-slate-500">Se suma al inventario al guardar.</p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-field hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-brand"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-5" aria-hidden="true">
                <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </div>

          <div className="grid gap-4 px-6 py-6">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Nombre
              <input name="nombre" required autoFocus placeholder="Ej: Teclado mecánico" className={campo} />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Precio
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                    $
                  </span>
                  <input
                    name="precio"
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="0"
                    className={`${campo} pl-7`}
                  />
                </div>
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                Stock
                <input name="stock" type="number" min="0" step="1" required placeholder="0" className={campo} />
              </label>
            </div>

            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Proveedor
              <input name="proveedor" type="number" min="1" step="1" required placeholder="ID del proveedor" className={campo} />
              <span className="text-xs font-normal text-slate-500">
                El número del proveedor. Tiene que existir en la base.
              </span>
            </label>
          </div>

          {error && (
            <p role="alert" className="mx-6 mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 rounded-b-2xl border-t border-line bg-field/60 px-6 py-4">
            <button
              type="button"
              onClick={cerrar}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-brand"
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar artículo"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
