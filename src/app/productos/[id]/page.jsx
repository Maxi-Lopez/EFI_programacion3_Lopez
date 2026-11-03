import { notFound } from "next";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Boton } from "@/components/Boton";
import { getProducto } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const instant = false;

export default async function ProductoPage({ params }) {
  const { id } = await params;
  const producto = await getProducto(id);

  if (!producto) {
    notFound();
  }

  const precio = parseFloat(producto.precio_lista || producto.precio_oferta || producto.precio || "0");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Detalle del Producto</h1>
        <Link href="/productos">
          <Boton variant="outline">Volver a Productos</Boton>
        </Link>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nombre</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{producto.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">SKU</p>
              <p className="font-mono text-slate-900 dark:text-white">{producto.sku}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Descripción</p>
              <p className="text-slate-600 dark:text-slate-300">{producto.descripcion_corta || producto.descripcion || "—"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Precio</p>
              <p className="text-2xl font-bold text-brand">
                ${precio.toLocaleString("es-AR")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stock</p>
              <p className="font-semibold text-slate-900 dark:text-white">{producto.stock_total ?? 0} unidades</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Categoría</p>
              <p className="font-semibold text-slate-900 dark:text-white">{producto.categoria?.nombre || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Marca</p>
              <p className="font-semibold text-slate-900 dark:text-white">{producto.marca?.nombre || "—"}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}