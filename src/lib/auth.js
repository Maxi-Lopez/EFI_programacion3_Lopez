import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getToken() {
  return (await cookies()).get("access")?.value;
}

export async function requireToken() {
  const token = await getToken();
  if (!token) redirect("/login");
  return token;
}

export function decodeJWT(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function getTokenPayload() {
  const token = await getToken();
  return decodeJWT(token);
}