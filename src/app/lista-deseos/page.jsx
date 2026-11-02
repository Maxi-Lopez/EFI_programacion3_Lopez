import { getListaDeseos } from "@/lib/api";
import { Card, CardGrid } from "@/components/Card";
import Link from "next/link";

export const instant = false;

export default async function ListaDeseosPage() {
  const items = await getListaDeseos();
  const productos = items.map((item) => item.producto).filter(Boolean);

  if (productos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-semibold text-ink mb-4">Lista de Deseos</h1>
        <p className="text-slate-500 mb-8">No tienes productos en tu lista de deseos.</p>
        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Ir a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold text-ink mb-8 text-center">Lista de Deseos</h1>
      <CardGrid columns={4}>
        {productos.map((producto) => (
          <Card key={producto.id} variant="elevated">
            <div className="flex flex-col items-center gap-3">
              {producto.imagen && (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <Link
                href={`/productos/${producto.id}`}
                className="font-medium text-slate-900 dark:text-white line-clamp-1 text-center max-w-full"
              >
                {producto.nombre}
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                ${parseFloat(producto.precio_lista || producto.precio_oferta || producto.precio || "0").toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </CardGrid>
      <div className="mt-8 text-center">
        <Link
          href="/productos"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Volver a Productos
        </Link>
      </div>
    </div>
  );
}
