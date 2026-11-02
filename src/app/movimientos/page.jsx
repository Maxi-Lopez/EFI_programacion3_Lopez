import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";
import { getVentas, getCompras } from "@/lib/api";
import { Card, CardStat, CardGrid } from "@/components/Card";
import Cargando from "@/components/Cargando";

function formatearTotal(total) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(total || 0));
}

async function MovimientosContent() {
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
  let compras = [];
  let error = null;

  try {
    [ventas, compras] = await Promise.all([getVentas(), getCompras()]);
  } catch (err) {
    error = "No se pudieron cargar los movimientos. Intente nuevamente.";
  }

  const totalVentas = ventas.reduce((acc, v) => acc + (Number(v.total) || 0), 0);
  const totalCompras = compras.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
  const cantidadVentas = ventas.length;
  const cantidadCompras = compras.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink">Movimientos</h1>
        <p className="text-slate-500">Resumen de ventas y compras</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <CardGrid columns={2} className="mb-8">
        <Link
          href="/movimientos/ventas"
          className="block hover:scale-[1.02] transition-transform duration-200"
        >
          <CardStat
            label="Ventas"
            value={cantidadVentas}
            icon="💰"
            className="hover:shadow-lg transition-shadow"
          >
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Total: {formatearTotal(totalVentas)}
            </p>
          </CardStat>
        </Link>

        <Link
          href="/movimientos/compras"
          className="block hover:scale-[1.02] transition-transform duration-200"
        >
          <CardStat
            label="Compras"
            value={cantidadCompras}
            icon="🛒"
            className="hover:shadow-lg transition-shadow"
          >
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Total: {formatearTotal(totalCompras)}
            </p>
          </CardStat>
        </Link>
      </CardGrid>
    </div>
  );
}

export default function MovimientosPage() {
  return (
    <Suspense fallback={<Cargando />}>
      <MovimientosContent />
    </Suspense>
  );
}