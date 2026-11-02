import { getToken } from "@/lib/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  return API_URL;
}

export const ENDPOINTS = {
  // Lectura (GET)
  read: {
    // Auth
    auth: {
      login: "/api/token/",
      refresh: "/api/token/refresh/",
    },
    // Usuarios
    usuarios: {
      clientes: "/api/usuarios/cliente-get/",
      vendedores: "/api/usuarios/vendedor-get/",
      listaDeseos: "/api/usuarios/lista-deseos-get/",
    },
    // Catálogo
    catalogo: {
      categorias: "/api/catalogo/categoria-get/",
      marcas: "/api/catalogo/marca-get/",
      productos: "/api/catalogo/producto-get/",
    },
    // Proveedores
    proveedores: {
      proveedores: "/api/proveedores/proveedor-get/",
    },
    // Compras y Ventas
    compras: {
      compras: "/api/compras/compra-list/",
    },
    ventas: {
      ventas: "/api/ventas/venta-get/",
    },
  },

  write: {
    // Auth
    auth: {
      login: "/api/token/",
      refresh: "/api/token/refresh/",
    },
    // Usuarios
    usuarios: {
      clientes: "/api/usuarios/cliente/",
      listaDeseos: "/api/usuarios/lista-deseos/",
      listaDeseosId: (id) => `/api/usuarios/lista-deseos/${id}/`,
    },
    // Catálogo
    catalogo: {
      categorias: "/api/catalogo/categoria/",
      categoriasId: (id) => `/api/catalogo/categoria/${id}/`,
      marcas: "/api/catalogo/marca/",
      marcasId: (id) => `/api/catalogo/marca/${id}/`,
      productos: "/api/catalogo/producto/",
      productosId: (id) => `/api/catalogo/producto/${id}/`,
    },
    // Proveedores
    proveedores: {
      proveedores: "/api/proveedores/proveedor/",
      proveedoresId: (id) => `/api/proveedores/proveedor/${id}/`,
    },
    // Compras y Ventas
    compras: {
      comprasId: (id) => `/api/compras/compra/${id}/`,
    },
    ventas: {
      ventasId: (id) => `/api/ventas/venta/${id}/`,
    },
  },
};

async function list(path) {
  const token = await getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  let page = 1;
  let all = [];
  while (true) {
    const res = await fetch(`${getApiUrl()}${path}?page=${page}`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${getApiUrl()}${path}`, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `La API respondió ${res.status} en ${path}`);
  }
  return res.json();
}


// Auth
export const getAuthLogin = () => ENDPOINTS.read.auth.login;
export const getAuthRefresh = () => ENDPOINTS.read.auth.refresh;

// Usuarios
export const getClientes = () => list(ENDPOINTS.read.usuarios.clientes);
export const getVendedores = () => list(ENDPOINTS.read.usuarios.vendedores);
export const getListaDeseos = () => list(ENDPOINTS.read.usuarios.listaDeseos);

// Catálogo
export const getCategorias = () => list(ENDPOINTS.read.catalogo.categorias);
export const getMarcas = () => list(ENDPOINTS.read.catalogo.marcas);
export const getProductos = () => list(ENDPOINTS.read.catalogo.productos);

// Proveedores
export const getProveedores = () => list(ENDPOINTS.read.proveedores.proveedores);

// Compras y Ventas
export const getCompras = () => list(ENDPOINTS.read.compras.compras);
export const getVentas = () => list(ENDPOINTS.read.ventas.ventas);


// Auth
export const postAuthLogin = (data) => request(ENDPOINTS.write.auth.login, { method: "POST", body: JSON.stringify(data) });
export const postAuthRefresh = (data) => request(ENDPOINTS.write.auth.refresh, { method: "POST", body: JSON.stringify(data) });

// Usuarios
export const crearCliente = (data) => request(ENDPOINTS.write.usuarios.clientes, { method: "POST", body: JSON.stringify(data) });
export const agregarListaDeseos = (data) => request(ENDPOINTS.write.usuarios.listaDeseos, { method: "POST", body: JSON.stringify(data) });
export const borrarListaDeseos = (id) => request(ENDPOINTS.write.usuarios.listaDeseosId(id), { method: "DELETE" });

// Catálogo - Categorías
export const crearCategoria = (data) => request(ENDPOINTS.write.catalogo.categorias, { method: "POST", body: JSON.stringify(data) });
export const editarCategoria = (id, data) => request(ENDPOINTS.write.catalogo.categoriasId(id), { method: "PUT", body: JSON.stringify(data) });
export const borrarCategoria = (id) => request(ENDPOINTS.write.catalogo.categoriasId(id), { method: "DELETE" });

// Catálogo - Marcas
export const crearMarca = (data) => request(ENDPOINTS.write.catalogo.marcas, { method: "POST", body: JSON.stringify(data) });
export const editarMarca = (id, data) => request(ENDPOINTS.write.catalogo.marcasId(id), { method: "PUT", body: JSON.stringify(data) });
export const borrarMarca = (id) => request(ENDPOINTS.write.catalogo.marcasId(id), { method: "DELETE" });

// Catálogo - Productos
export const crearProducto = (data) => request(ENDPOINTS.write.catalogo.productos, { method: "POST", body: JSON.stringify(data) });
export const editarProducto = (id, data) => request(ENDPOINTS.write.catalogo.productosId(id), { method: "PUT", body: JSON.stringify(data) });
export const borrarProducto = (id) => request(ENDPOINTS.write.catalogo.productosId(id), { method: "DELETE" });

// Proveedores
export const crearProveedor = (data) => request(ENDPOINTS.write.proveedores.proveedores, { method: "POST", body: JSON.stringify(data) });
export const editarProveedor = (id, data) => request(ENDPOINTS.write.proveedores.proveedoresId(id), { method: "PUT", body: JSON.stringify(data) });
export const borrarProveedor = (id) => request(ENDPOINTS.write.proveedores.proveedoresId(id), { method: "DELETE" });

// Compras
export const borrarCompra = (id) => request(ENDPOINTS.write.compras.comprasId(id), { method: "DELETE" });

// Ventas
export const borrarVenta = (id) => request(ENDPOINTS.write.ventas.ventasId(id), { method: "DELETE" });