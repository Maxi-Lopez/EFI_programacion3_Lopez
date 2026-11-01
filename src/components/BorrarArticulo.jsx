"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { borrarArticulo } from "@/app/actions";

export default function BorrarArticulo({ id, nombre }) {
  const router = useRouter();
  const [paso, setPaso] = useState("inicio"); 
  const [error, setError] = useState("");

  async function borrar() {
    setPaso("borrando");
    setError("");
    const r = await borrarArticulo(id);
    if (r?.error) {
      setError(r.error);
      setPaso("inicio");
    } else {
      router.refresh();
    }
  }

  if (paso === "borrando") return <span className="text-xs text-slate-500">Borrando...</span>;

  if (paso === "confirmar") {
    return (
      <span className="inline-flex items-center gap-3">
        <button
          type="button"
          onClick={borrar}
          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Sí, borrar
        </button>
        <button
          type="button"
          onClick={() => setPaso("inicio")}
          className="text-xs text-slate-500 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-brand"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      {error && (
        <span role="alert" className="text-xs text-red-700">
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={() => setPaso("confirmar")}
        aria-label={`Borrar ${nombre}`}
        className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-600"
      >
        Borrar
      </button>
    </span>
  );
}
