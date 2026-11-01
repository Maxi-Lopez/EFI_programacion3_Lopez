import { Suspense } from "react";
import { getArticulos, getProveedores, ENDPOINTS } from "@/lib/api";
import DataTable, { ErrorBox } from "@/components/DataTable";
import Cargando from "@/components/Cargando";
import Stats from "@/components/Stats";
import AgregarArticulo from "@/components/AgregarArticulo";
import BorrarArticulo from "@/components/BorrarArticulo";

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const num = (v) => Number(v) || 0;

async function Contenido() {
  let articulos, proveedores;
  try {
    [articulos, proveedores] = await Promise.all([
      getArticulos(),
      getProveedores().catch(() => []),
    ]);
  } catch (e) {
    return <ErrorBox message={e.message} />;
  }

  const nombreProveedor = Object.fromEntries(proveedores.map((p) => [p.id, p.nombre]));
  const unidades = articulos.reduce((s, a) => s + num(a.stock), 0);
  const valor = articulos.reduce((s, a) => s + num(a.precio) * num(a.stock), 0);

  const columns = [
    { key: "nombre", label: "Nombre", render: (a) => <span className="font-medium text-ink">{a.nombre}</span> },
    {
      key: "proveedor",
      label: "Proveedor",
      render: (a) =>
        typeof a.proveedor === "object" && a.proveedor
          ? a.proveedor.nombre
          : nombreProveedor[a.proveedor] ?? `#${a.proveedor}`,
    },
    { key: "precio", label: "Precio", align: "right", render: (a) => pesos.format(num(a.precio)) },
    {
      key: "stock",
      label: "Stock",
      align: "right",
      render: (a) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            num(a.stock) === 0
              ? "bg-red-100 text-red-800"
              : num(a.stock) <= 5
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {num(a.stock)}
        </span>
      ),
    },
    {
      key: "timestamp",
      label: "Alta",
      align: "right",
      render: (a) => new Date(a.timestamp).toLocaleDateString("es-AR"),
    },
    {
      key: "acciones",
      label: "Acciones",
      align: "right",
      render: (a) => <BorrarArticulo id={a.id} nombre={a.nombre} endpoint={ENDPOINTS.articulos} />,
    },
  ];

  return (
    <>
      <Stats
        items={[
          { label: "Artículos", value: articulos.length },
          { label: "Unidades en stock", value: unidades },
          { label: "Valor del inventario", value: pesos.format(valor) },
        ]}
      />
      <DataTable columns={columns} rows={articulos} empty="Todavía no hay artículos. Agrega el primero." />
    </>
  );
}

export default function ArticulosPage() {
  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Artículos</h1>
          <p className="mt-1 text-slate-500">Lo que hay en stock.</p>
        </div>
        <AgregarArticulo endpoint={ENDPOINTS.articulos} />
      </div>
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>
    </>
  );
}
