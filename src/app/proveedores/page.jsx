import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { getProveedores } from "@/lib/api";
import { Card } from "@/components/Card";
import { Boton } from "@/components/Boton";
import ProveedorActions from "@/components/ProveedorActions";
import Cargando from "@/components/Cargando";

function formatearCuit(cuit) {
  if (!cuit) return "";
  const limpio = cuit.replace(/\D/g, "");
  if (limpio.length === 11) {
    return `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`;
  }
  return cuit;
}

async function ProveedoresContent() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_data")?.value;
  let isAdmin = false;

  if (userCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userCookie));
      isAdmin = userData.role === "admin" || userData.is_staff === true;
    } catch { }
  }

  if (!isAdmin) redirect("/productos");

  let proveedores = [];
  let error = null;

  try {
    proveedores = await getProveedores();
  } catch (err) {
    error = "No se pudieron cargar los proveedores. Intente nuevamente.";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Proveedores</h1>
          <p className="text-slate-500">Listado de proveedores</p>
        </div>
        {isAdmin && <ProveedorActions mode="create" />}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">CUIT</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Email</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {proveedores.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-4 py-12 text-center text-slate-500">
                    No hay proveedores registrados.{isAdmin && " Haz clic en Agregar Proveedor para crear uno."}
                  </td>
                </tr>
              ) : (
                proveedores.map((prov) => (
                  <tr key={prov.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{prov.nombre || "—"}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{formatearCuit(prov.cuit) || "—"}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{prov.telefono || "—"}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{prov.email || "—"}</td>
                    {isAdmin && (
                      <td className="px-4 py-4 text-center">
                        <ProveedorActions proveedor={prov} mode="edit" />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function ProveedoresPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <ProveedoresContent />
    </Suspense>
  );
}