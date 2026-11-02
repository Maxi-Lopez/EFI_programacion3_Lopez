"use client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getTokenClient() {
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("access="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

async function requestClient(path, options = {}) {
  const token = await getTokenClient();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `La API respondió ${res.status} en ${path}`);
  }
  return res.json();
}

export const getProductosClient = async () => {
  const data = await requestClient("/api/catalogo/producto-get/");
  return Array.isArray(data) ? data : data.results || [];
};

export const agregarListaDeseos = (data) => requestClient("/api/usuarios/lista-deseos/", { method: "POST", body: JSON.stringify(data) });
export const borrarListaDeseos = (id) => requestClient(`/api/usuarios/lista-deseos/${id}/`, { method: "DELETE" });