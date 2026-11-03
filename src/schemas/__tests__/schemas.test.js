import { describe, it, expect } from "vitest";
import { loginSchema, productoSchema } from "@/schemas";

describe("Zod Schemas", () => {
  describe("loginSchema", () => {
    it("valida username y password correctos", () => {
      const result = loginSchema.safeParse({ username: "admin", password: "123456" });
      expect(result.success).toBe(true);
    });

    it("rechaza username vacío", () => {
      const result = loginSchema.safeParse({ username: "", password: "123456" });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.username).toContain("El usuario es obligatorio");
    });

    it("rechaza password vacío", () => {
      const result = loginSchema.safeParse({ username: "admin", password: "" });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.password).toContain("La contraseña es obligatoria");
    });
  });

  describe("productoSchema", () => {
    it("valida producto completo con marca y categoria", () => {
      const result = productoSchema.safeParse({
        nombre: "RTX 4090",
        sku: "TEST-SKU-001",
        descripcion: "Tarjeta gráfica",
        precio: 199999,
        stock: 5,
        categoria: 1,
        marca: 2,
        imagen: "https://example.com/img.jpg",
      });
      expect(result.success).toBe(true);
    });

    it("rechaza producto sin nombre", () => {
      const result = productoSchema.safeParse({
        nombre: "",
        precio: 100,
        stock: 1,
        categoria: 1,
        marca: 1,
      });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.nombre).toContain("Mínimo 2 caracteres");
    });

    it("rechaza precio negativo", () => {
      const result = productoSchema.safeParse({
        nombre: "Test",
        precio: -10,
        stock: 1,
        categoria: 1,
        marca: 1,
      });
      expect(result.success).toBe(false);
      expect(result.error.flatten().fieldErrors.precio).toContain("Precio debe ser positivo");
    });
  });
});