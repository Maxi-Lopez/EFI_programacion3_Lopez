import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Boton } from "@/components/Boton";
import { getProveedor } from "@/lib/api";

function formatearCuit(cuit) {
  if (!cuit) return "";
  const limpio = cuit.replace(/\D/g, "");
  if (limpio.length === 11) {
    return `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`;
  }
  return cuit;
}

export default async function ProveedorPage({ params }) {
  const { id } = await params;

  let proveedor;
  try {
    proveedor = await getProveedor(id);
  } catch (error) {
    notFound();
  }

  if (!proveedor) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Detalle del Proveedor</h1>
        <Link href="/proveedores">
          <Boton variant="outline">Volver a Proveedores</Boton>
        </Link>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Nombre</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{proveedor.nombre || "—"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">CUIT</p>
              <p className="font-mono text-slate-900 dark:text-white">{formatearCuit(proveedor.cuit) || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Teléfono</p>
              <p className="text-slate-900 dark:text-white">{proveedor.telefono || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-slate-900 dark:text-white">{proveedor.email || "—"}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}