import { Suspense } from "react";
import { getProductos, getCategorias, getMarcas, ENDPOINTS } from "@/lib/api";
import Cargando from "@/components/Cargando";

async function Contenido() {
  const [productos, categorias, marcas] = await Promise.all([
    getProductos().catch(() => []),
    getCategorias().catch(() => []),
    getMarcas().catch(() => []),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Productos</h1>
      <p className="mb-8 text-slate-500">Gestión de inventario</p>
      <div className="rounded-xl border border-line bg-white p-6 text-center text-slate-500">
        Próximamente: Tabla de productos con CRUD completo
        <pre className="mt-4 text-left text-xs bg-field p-4 rounded overflow-auto">
{JSON.stringify({ productos: productos.length, categorias: categorias.length, marcas: marcas.length }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <Contenido />
    </Suspense>
  );
}