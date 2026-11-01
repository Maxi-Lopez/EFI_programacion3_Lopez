"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL, ENDPOINTS, agregarListaDeseos, borrarListaDeseos } from "@/lib/api";
import { getToken, getTokenPayload } from "@/lib/auth";
import { loginSchema, productoSchema } from "@/schemas";

async function requireAdmin() {
  const payload = await getTokenPayload();
  const isAdmin = payload?.role === "admin" || payload?.is_staff === true;
  if (!isAdmin) {
    return { error: "No autorizado: se requiere rol de administrador", status: 403 };
  }
  return null;
}

export async function loginAction(formData) {
  const rawData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  console.log("Iniciando login para:", rawData.username);

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const loginUrl = `${API_URL}${ENDPOINTS.write.auth.login}`;
  console.log("Fetching to:", loginUrl);

  let res;
  try {
    res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch (fetchError) {
    console.error("Error de red en login:", fetchError);
    return { error: "No se pudo conectar con la API (red)" };
  }

  console.log("Respuesta backend:", res.status, res.statusText);

  if (!res) return { error: "No se pudo conectar con la API" };
  if (res.status === 401) return { error: "Credenciales incorrectas" };
  if (!res.ok) return { error: "Error del servidor" };

  const { access } = await res.json();
  (await cookies()).set("access", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  const payload = access.split(".")[1];
  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    (await cookies()).set("user_data", JSON.stringify({ username: decoded.username, user_id: decoded.user_id, role: decoded.role, is_staff: decoded.is_staff }), {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
  } catch {
  }

  return { success: true };
}

export async function logoutAction() {
  (await cookies()).delete("access");
  (await cookies()).delete("user_data");
  redirect("/login");
}

async function llamar(path, opciones = {}) {
  const token = await getToken();
  return fetch(`${API_URL}${path}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  }).catch(() => null);
}

export async function crearProductoAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const rawData = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion") || "",
    precio: Number(formData.get("precio")),
    stock: Number(formData.get("stock")),
    categoria: Number(formData.get("categoria")),
    marca: Number(formData.get("marca")),
    imagen: formData.get("imagen") || undefined,
  };

  const parsed = productoSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const res = await llamar(ENDPOINTS.write.catalogo.productos, { method: "POST", body: JSON.stringify(parsed.data) });
  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) return { error: "No se pudo crear. Verifica categoría y marca." };

  revalidatePath("/productos");
  return { success: true };
}

export async function editarProductoAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = formData.get("id");
  const rawData = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion") || "",
    precio: Number(formData.get("precio")),
    stock: Number(formData.get("stock")),
    categoria: Number(formData.get("categoria")),
    marca: Number(formData.get("marca")),
    imagen: formData.get("imagen") || undefined,
  };

  const parsed = productoSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const res = await llamar(`${ENDPOINTS.write.catalogo.productos}${id}/`, { method: "PUT", body: JSON.stringify(parsed.data) });
  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) return { error: "No se pudo actualizar. Verifica categoría y marca." };

  revalidatePath("/productos");
  return { success: true };
}

export async function borrarProductoAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = formData.get("id");
  const res = await llamar(`${ENDPOINTS.write.catalogo.productos}${id}/`, { method: "DELETE" });
  if (!res) return { error: "Sin conexión" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok && res.status !== 404) return { error: "No se pudo borrar" };

  revalidatePath("/productos");
  return { success: true };
}

export async function agregarDeseoAction(productoId) {
  const res = await agregarListaDeseos({ producto: productoId });
  if (!res) return { error: "Sin conexión" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) return { error: "No se pudo agregar a deseos" };

  revalidatePath("/productos");
  revalidatePath("/lista-deseos");
  return { success: true };
}

export async function quitarDeseoAction(deseoId) {
  const res = await borrarListaDeseos(deseoId);
  if (!res) return { error: "Sin conexión" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok && res.status !== 404) return { error: "No se pudo quitar de deseos" };

  revalidatePath("/productos");
  revalidatePath("/lista-deseos");
  return { success: true };
}