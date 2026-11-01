"use client";

import { useEffect, useState } from "react";

export default function Cargando() {
  const [seg, setSeg] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeg((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  let mensaje = "Cargando datos";
  if (seg >= 5) mensaje = "Despertando la API. La primera carga puede tardar hasta un minuto";
  if (seg >= 75) mensaje = "Está tardando más de lo normal. Si sigue así, recarga la página";

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 rounded-xl border border-line bg-white px-5 py-10 text-sm text-slate-500"
    >
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex size-full rounded-full bg-brand/60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-brand" />
      </span>
      <span>{mensaje}</span>
      {seg >= 2 && (
        <span aria-hidden="true" className="w-8 tabular-nums text-slate-400">
          {seg}s
        </span>
      )}
    </div>
  );
}
