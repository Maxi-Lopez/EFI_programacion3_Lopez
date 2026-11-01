import { Suspense } from "react";
import { getArticulos, getProveedores } from "@/lib/api";
import DataTable, { ErrorBox } from "@/components/DataTable";
import Cargando from "@/components/Cargando";
import Stats from "@/components/Stats";


async function Contenido() {
  let proveedores, articulos;
  try {
    [proveedores, articulos] = await Promise.all([
      getProveedores(),
      getArticulos().catch(() => []),
    ]);
  } catch (e) {
    return <ErrorBox message={e.message} />;
  }

  const idProveedor = (a) => (typeof a.proveedor === "object" && a.proveedor ? a.proveedor.id : a.proveedor);
  const cantidad = (id) => articulos.filter((a) => idProveedor(a) === id).length;
  const activos = proveedores.filter((p) => p.activo).length;

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre", render: (p) => <span className="font-medium text-ink">{p.nombre}</span> },
    { key: "telefono", label: "Teléfono" },
    {
      key: "activo",
      label: "Estado",
      render: (p) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            p.activo ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {p.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    { key: "articulos", label: "Artículos", align: "right", render: (p) => cantidad(p.id) },
  ];

  return (
    <>
      <Stats
        items={[
          { label: "Proveedores", value: proveedores.length },
          { label: "Activos", value: activos },
          { label: "Inactivos", value: proveedores.length - activos },
        ]}
      />
      <DataTable columns={columns} rows={proveedores} empty="Todavía no hay proveedores." />
    </>
  );
}

export default function ProveedoresPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-semibold text-ink">Proveedores</h1>
      <p className="mb-8 mt-1 text-slate-500">Quiénes te venden y cuántos artículos tiene cada uno.</p>
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>
    </>
  );
}
