import { Suspense } from "react";
import { cookies } from "next/headers";
import { getProductos, getCategorias, getMarcas } from "@/lib/api";
import { Card, CardStat, CardGrid } from "@/components/Card";
import Link from "next/link";
import { BotonDeseo } from "@/components/BotonDeseo";
import ProductoActions from "@/components/ProductoActions";
import { Buscador } from "@/components/Buscador";

async function ProductosContent({ searchParams }) {
  const params = await searchParams;
  const filter = params?.filter;
  const searchQuery = params?.search || "";

  let productos = [];
  let categorias = [];
  let marcas = [];
  let errorCarga = null;

  try {
    const [prodData, catData, marData] = await Promise.all([
      getProductos(searchQuery),
      getCategorias(),
      getMarcas(),
    ]);
    productos = prodData;
    categorias = catData;
    marcas = marData;
  } catch (error) {
    console.error("Error cargando datos en el servidor:", error);
    errorCarga = error.message || "Error al conectar con el backend";
  }

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_data")?.value;

  let isAdmin = false;
  let isAuth = false;

  if (userCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userCookie));
      isAdmin = userData.role === "admin" || userData.is_staff === true;
      isAuth = !!userData.username;
    } catch (e) {
      console.error("Error parseando cookie:", e);
    }
  }

  const totalProductos = productos.length;
  const stockBajo = productos.filter((p) => p.stock_total > 0 && p.stock_total < 5).length;
  const sinStock = productos.filter((p) => p.stock_total === 0).length;
  const valorInventario = productos.reduce((acc, p) => {
    const precio = parseFloat(p.precio_lista || p.precio_oferta || p.precio || "0");
    return acc + precio * (p.stock_total || 0);
  }, 0);

  let productosFiltrados = productos;
  if (filter === "low-stock") {
    productosFiltrados = productos.filter((p) => p.stock_total > 0 && p.stock_total < 5);
  } else if (filter === "out-of-stock") {
    productosFiltrados = productos.filter((p) => p.stock_total === 0);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Productos</h1>
          <p className="text-slate-500">Gestión de inventario</p>
        </div>
        {isAdmin && <ProductoActions categorias={categorias} marcas={marcas} mode="create" />}
      </div>

      {errorCarga && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <p className="font-bold">Error al cargar los datos:</p>
          <p className="text-sm">{errorCarga}</p>
          <p className="text-xs mt-2">Verificá que el backend en Render esté despierto.</p>
        </div>
)}

      {isAdmin && (
        <div className="mb-8">
          <CardGrid columns={4}>
            <Link
              href="/productos"
              className={`block ${!filter ? "ring-2 ring-primary" : ""}`}
            >
              <CardStat label="Total Productos" value={totalProductos} icon="📦" />
            </Link>
            <Link
              href={filter === "low-stock" ? "/productos" : "/productos?filter=low-stock"}
              className={`block ${filter === "low-stock" ? "ring-2 ring-primary" : ""}`}
            >
              <CardStat label="Stock Bajo (<5)" value={stockBajo} icon="⚠️" />
            </Link>
            <Link
              href={filter === "out-of-stock" ? "/productos" : "/productos?filter=out-of-stock"}
              className={`block ${filter === "out-of-stock" ? "ring-2 ring-primary" : ""}`}
            >
              <CardStat label="Sin Stock" value={sinStock} icon="🚫" />
            </Link>
            <CardStat label="Valor Inventario" value={`$${valorInventario.toLocaleString()}`} icon="💰" />
          </CardGrid>
        </div>
      )}

      <Suspense fallback={<div className="mb-6 max-w-md animate-pulse"><div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" /></div>}>
        <Buscador initialSearch={searchQuery} className="mb-6" />
      </Suspense>

      {filter && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filter === "low-stock" && "Mostrando productos con stock bajo"}
            {filter === "out-of-stock" && "Mostrando productos sin stock"}
          </p>
          <Link href="/productos" className="text-sm text-primary hover:underline">
            Limpiar filtro
          </Link>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Producto</th>
                {isAuth && (
                  <th className="px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">Favorito</th>
                )}
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Categoría</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Marca</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Precio</th>
                <th className="px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">Stock</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : isAuth ? 6 : 5} className="px-4 py-12 text-center text-slate-500">
                    {errorCarga
                      ? "No se pudieron cargar los productos. Revisá el error de arriba."
                      : filter
                      ? `No hay productos ${filter === "low-stock" ? "con stock bajo" : "sin stock"}.`
                      : `No hay productos.${isAdmin ? " Haz clic en Agregar Producto para crear uno." : ""}`}
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((producto) => {
                  const precio = parseFloat(producto.precio_lista || producto.precio_oferta || producto.precio || "0");
                  const stock = producto.stock_total ?? 0;
                  return (
                    <tr key={producto.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {producto.imagen && (
                            <img src={producto.imagen} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div className="min-w-0">
                            <Link href={`/productos/${producto.id}`}>
                              <p className="font-medium text-slate-900 dark:text-white line-clamp-1 truncate max-w-[180px]">{producto.nombre}</p>
                            </Link>
                            {producto.descripcion_corta && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{producto.descripcion_corta}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {isAuth && (
                        <td className="px-4 py-4 text-center">
                          <BotonDeseo productoId={producto.id} />
                        </td>
                      )}

                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {producto.categoria?.nombre || "—"}
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {producto.marca?.nombre || "—"}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-900 dark:text-white">
                        ${precio.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stock === 0 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          stock < 5 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}>
                          {stock}
                        </span>
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-4 text-center">
                          <ProductoActions
                            producto={producto}
                            categorias={categorias}
                            marcas={marcas}
                            mode="edit"
                          />
                        </td>
                      )}
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

export default function ProductosPage({ searchParams }) {
  return <ProductosContent searchParams={searchParams} />;
}