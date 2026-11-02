import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const productoSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(100),
  sku: z.string().min(1, "El SKU es obligatorio").max(100),
  descripcion: z.string().max(500).optional(),
  precio: z.number().min(0, "Precio debe ser positivo"),
  stock: z.number().int().min(0, "Stock no puede ser negativo"),
  categoria: z.number().int().positive("Categoría requerida"),
  marca: z.number().int().positive("Marca requerida"),
  imagen: z.string().url("URL inválida").optional().or(z.literal("")),
});