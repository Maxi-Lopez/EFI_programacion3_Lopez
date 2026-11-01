import { getToken } from "@/lib/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
  articulos: "/api/articulos/",
  proveedores: "/api/proveedor/",
};

async function list(path) {
  const token = await getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  let page = 1;
  let all = [];
  while (true) {
    const res = await fetch(`${API_URL}${path}?page=${page}`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data; 
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}

export const getArticulos = () => list(ENDPOINTS.articulos);
export const getProveedores = () => list(ENDPOINTS.proveedores);
