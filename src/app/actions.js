"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL, ENDPOINTS, agregarListaDeseos, borrarListaDeseos } from "@/lib/api";
import { getToken, getTokenPayload } from "@/lib/auth";
import { loginSchema, registerSchema, productoSchema, proveedorSchema } from "@/schemas";

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

  const payloadBase64 = access.split(".")[1];
  let payload;
  try {
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    payload = JSON.parse(json);
  } catch {
    payload = {};
  }

  const username = payload.username || formData.get("username");
  const role = payload.role || "cliente";
  const is_staff = payload.is_staff || false;
  const user_id = payload.user_id || payload.sub;

  (await cookies()).set("user_data", JSON.stringify({
    username,
    role,
    is_staff,
    user_id,
  }), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return { success: true };
}

export async function registerAction(formData) {
  const rawData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    telefono: formData.get("telefono") || "",
    dni: formData.get("dni") || "",
  };

  console.log("Iniciando registro para:", rawData.username);

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    console.log(">>> Zod error details:", parsed.error.flatten().fieldErrors);
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const registerUrl = `${API_URL}/api/usuarios/cliente/`;
  console.log("Fetching to:", registerUrl);

  let res;
  try {
    res = await fetch(registerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch (fetchError) {
    console.error("Error de red en registro:", fetchError);
    return { error: "No se pudo conectar con la API (red)" };
  }

  console.log("Respuesta backend:", res.status, res.statusText);

  if (!res) return { error: "No se pudo conectar con la API" };
  if (res.status === 400) {
    const errorData = await res.json().catch(() => ({}));
    return { error: errorData.detail || "El usuario ya existe o datos inválidos" };
  }
  if (!res.ok) return { error: "Error del servidor" };

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

function parseOptionalNumber(value) {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

export async function crearProductoAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const categoriaRaw = formData.get("categoria");
  const marcaRaw = formData.get("marca");

  const rawData = {
    nombre: formData.get("nombre"),
    descripcion_corta: formData.get("descripcion") || "",
    precio_lista: Number(formData.get("precio")),
    stock_total: Number(formData.get("stock")),
    categoria: parseOptionalNumber(categoriaRaw),
    marca: parseOptionalNumber(marcaRaw),
    imagen: formData.get("imagen") || undefined,
    sku: formData.get("sku") || `SKU-${Date.now()}`,
  };

  console.log(">>> crearProductoAction rawData:", rawData);

  const parsed = productoSchema.safeParse({
    nombre: rawData.nombre,
    sku: rawData.sku,
    descripcion: rawData.descripcion_corta,
    precio: rawData.precio_lista,
    stock: rawData.stock_total,
    categoria: rawData.categoria,
    marca: rawData.marca,
    imagen: rawData.imagen,
  });
  console.log(">>> crearProductoAction Zod parsed:", parsed);
  if (!parsed.success) {
    console.log(">>> Zod error details:", parsed.error.flatten().fieldErrors);
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const res = await llamar(ENDPOINTS.write.catalogo.productos, { method: "POST", body: JSON.stringify(rawData) });
  console.log(">>> crearProductoAction API response:", res?.status, res?.ok);
  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      const text = await res.text().catch(() => "");
      return { detail: text || "Error desconocido del servidor" };
    });
    console.log(">>> Error del backend al crear producto:", errorData);
    if (res.status === 400 && errorData && typeof errorData === "object") {
      const fields = {};
      Object.entries(errorData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          let msg = messages[0];
          if (key === "sku" && typeof msg === "string" && msg.includes("already exists")) {
            msg = "Ya existe un producto con ese SKU";
          }
          fields[key] = [msg];
        }
      });
      if (Object.keys(fields).length > 0) {
        return { error: "Error de validación", fields };
      }
    }
    return { error: JSON.stringify(errorData) };
  }

  revalidatePath("/productos");
  return { success: true };
}

export async function editarProductoAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  console.log(">>> editarProductoAction recibido:", Object.fromEntries(formData.entries()));

  const id = formData.get("id");
  const categoriaRaw = formData.get("categoria");
  const marcaRaw = formData.get("marca");

  const rawData = {
    sku: formData.get("sku"),
    nombre: formData.get("nombre"),
    descripcion_corta: formData.get("descripcion") || "",
    precio_lista: Number(formData.get("precio")),
    stock_total: Number(formData.get("stock")),
    categoria: parseOptionalNumber(categoriaRaw),
    marca: parseOptionalNumber(marcaRaw),
    imagen: formData.get("imagen") || undefined,
  };

  const parsed = productoSchema.safeParse({
    nombre: rawData.nombre,
    sku: rawData.sku,
    descripcion: rawData.descripcion_corta,
    precio: rawData.precio_lista,
    stock: rawData.stock_total,
    categoria: rawData.categoria,
    marca: rawData.marca,
    imagen: rawData.imagen,
  });
  if (!parsed.success) {
    console.log(">>> Zod error details:", parsed.error.flatten().fieldErrors);
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const res = await llamar(`${ENDPOINTS.write.catalogo.productos}${id}/`, { method: "PUT", body: JSON.stringify(rawData) });
  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      const text = await res.text().catch(() => "");
      return { detail: text || "Error desconocido del servidor" };
    });
    console.log(">>> Error del backend al editar producto:", errorData);
    if (res.status === 400 && errorData && typeof errorData === "object") {
      const fields = {};
      Object.entries(errorData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          let msg = messages[0];
          if (key === "sku" && typeof msg === "string" && msg.includes("already exists")) {
            msg = "Ya existe un producto con ese SKU";
          }
          fields[key] = [msg];
        }
      });
      if (Object.keys(fields).length > 0) {
        return { error: "Error de validación", fields };
      }
    }
    return { error: JSON.stringify(errorData) };
  }

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

export async function crearCategoriaAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const nombre = formData.get("nombre");
  if (!nombre || !nombre.trim()) {
    return { error: "El nombre es requerido", fields: { nombre: ["El nombre es requerido"] } };
  }

  const res = await llamar(ENDPOINTS.write.catalogo.categorias, {
    method: "POST",
    body: JSON.stringify({ nombre: nombre.trim() }),
  });

  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      const text = await res.text().catch(() => "");
      return { detail: text || "Error desconocido del servidor" };
    });
    console.log(">>> Error del backend al crear categoría:", errorData);
    if (res.status === 400 && errorData && typeof errorData === "object") {
      const fields = {};
      Object.entries(errorData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fields[key] = [messages[0]];
        }
      });
      if (Object.keys(fields).length > 0) {
        return { error: "Error de validación", fields };
      }
    }
    return { error: JSON.stringify(errorData) };
  }

  const categoria = await res.json();
  revalidatePath("/productos");
  revalidatePath("/categorias");
  return { success: true, categoria };
}

export async function crearMarcaAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const nombre = formData.get("nombre");
  if (!nombre || !nombre.trim()) {
    return { error: "El nombre es requerido", fields: { nombre: ["El nombre es requerido"] } };
  }

  const res = await llamar(ENDPOINTS.write.catalogo.marcas, {
    method: "POST",
    body: JSON.stringify({ nombre: nombre.trim() }),
  });

  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      const text = await res.text().catch(() => "");
      return { detail: text || "Error desconocido del servidor" };
    });
    console.log(">>> Error del backend al crear marca:", errorData);
    if (res.status === 400 && errorData && typeof errorData === "object") {
      const fields = {};
      Object.entries(errorData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fields[key] = [messages[0]];
        }
      });
      if (Object.keys(fields).length > 0) {
        return { error: "Error de validación", fields };
      }
    }
    return { error: JSON.stringify(errorData) };
  }

  const marca = await res.json();
  revalidatePath("/productos");
  revalidatePath("/marcas");
  return { success: true, marca };
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

export async function crearProveedorAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    email: formData.get("email") || "",
    telefono: formData.get("telefono") || "",
  };

  const parsed = proveedorSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const res = await llamar(ENDPOINTS.write.proveedores.proveedores, { method: "POST", body: JSON.stringify(parsed.data) });
  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      const text = await res.text().catch(() => "");
      return { detail: text || "Error desconocido del servidor" };
    });
    if (res.status === 400 && errorData && typeof errorData === "object") {
      const fields = {};
      Object.entries(errorData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fields[key] = [messages[0]];
        }
      });
      if (Object.keys(fields).length > 0) {
        return { error: "Error de validación", fields };
      }
    }
    return { error: JSON.stringify(errorData) };
  }

  revalidatePath("/proveedores");
  return { success: true };
}

export async function editarProveedorAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = formData.get("id");
  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    email: formData.get("email") || "",
    telefono: formData.get("telefono") || "",
  };

  const parsed = proveedorSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors };
  }

  const res = await llamar(`${ENDPOINTS.write.proveedores.proveedores}${id}/`, { method: "PUT", body: JSON.stringify(parsed.data) });
  if (!res) return { error: "Sin conexión con la API" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok) {
    const errorData = await res.json().catch(async () => {
      const text = await res.text().catch(() => "");
      return { detail: text || "Error desconocido del servidor" };
    });
    if (res.status === 400 && errorData && typeof errorData === "object") {
      const fields = {};
      Object.entries(errorData).forEach(([key, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fields[key] = [messages[0]];
        }
      });
      if (Object.keys(fields).length > 0) {
        return { error: "Error de validación", fields };
      }
    }
    return { error: JSON.stringify(errorData) };
  }

  revalidatePath("/proveedores");
  return { success: true };
}

export async function borrarProveedorAction(formData) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = formData.get("id");
  const res = await llamar(`${ENDPOINTS.write.proveedores.proveedores}${id}/`, { method: "DELETE" });
  if (!res) return { error: "Sin conexión" };
  if (res.status === 401 || res.status === 403) return { error: "Sesión vencida" };
  if (!res.ok && res.status !== 404) return { error: "No se pudo borrar" };

  revalidatePath("/proveedores");
  return { success: true };
}