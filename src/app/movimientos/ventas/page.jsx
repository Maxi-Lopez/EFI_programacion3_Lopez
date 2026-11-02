import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { getVentas } from "@/lib/api";
import { Card } from "@/components/Card";
import Cargando from "@/components/Cargando";

function formatearFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-AR");
}

function formatearTotal(total) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(total || 0));
}

async function VentasContent() {
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

  let ventas = [];
  let error = null;

  try {
    ventas = await getVentas();
  } catch (err) {
    error = "No se pudieron cargar las ventas. Intente nuevamente.";
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">Ventas</h1>
        <p className="text-slate-500">Listado de ventas realizadas</p>
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
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Fecha</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Cliente</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    No hay ventas registradas.
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => {
                  const fecha = venta.fecha ?? venta.created_at ?? venta.fecha_venta;
                  const cliente = venta.cliente;
                  const nombreCliente = cliente?.first_name || cliente?.nombre || cliente?.username || "—";
                  return (
                    <tr key={venta.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-4 font-medium">{venta.id}</td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {formatearFecha(fecha)}
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {nombreCliente}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-900 dark:text-white">
                        {formatearTotal(venta.total)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function VentasPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <VentasContent />
    </Suspense>
  );
}