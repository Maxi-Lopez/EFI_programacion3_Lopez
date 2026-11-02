"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema } from "@/schemas";
import { Boton } from "./Boton";
import { Input } from "./Input";
import { crearProductoAction, editarProductoAction } from "@/app/actions";

export function ProductoForm({ categorias = [], marcas = [], initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData;

  const getDefaultValues = (data) => {
    if (!data) {
      return {
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoria: "",
        marca: "",
        imagen: "",
        sku: "",
      };
    }
    return {
      nombre: data.nombre || "",
      descripcion: data.descripcion_corta || "",
      precio: data.precio_lista || 0,
      stock: data.stock_total || 0,
      categoria: data.categoria?.id?.toString() || "",
      marca: data.marca?.id?.toString() || "",
      imagen: data.imagen_url || "",
      sku: data.sku || "",
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productoSchema),
    defaultValues: getDefaultValues(initialData),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion_corta || "",
        precio: initialData.precio_lista || 0,
        stock: initialData.stock_total || 0,
        categoria: initialData.categoria?.id?.toString() || "",
        marca: initialData.marca?.id?.toString() || "",
        imagen: initialData.imagen_url || "",
        sku: initialData.sku || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    console.log(">>> ProductoForm onSubmit data:", data);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        formData.append(key, value);
      }
    });
    if (isEditing) formData.append("id", initialData.id);

    const action = isEditing ? editarProductoAction : crearProductoAction;
    const result = await action(formData);
    console.log(">>> ProductoForm Server Action result:", result);

    if (result.success) {
      onSuccess?.();
    } else if (result.fields) {
      Object.entries(result.fields).forEach(([field, messages]) => {
        if (messages?.[0]) {
          setValue(field, data[field], { shouldValidate: true });
        }
      });
    }
    return result;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nombre"
        error={errors.nombre?.message}
        placeholder="Ej: MacBook Pro 14"
        {...register("nombre")}
        required
      />

      <Input
        label="SKU"
        error={errors.sku?.message}
        placeholder="Ej: PROD-001"
        {...register("sku")}
        required
      />

      <Input
        label="Descripción"
        error={errors.descripcion?.message}
        placeholder="Descripción opcional"
        {...register("descripcion")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Precio"
          type="number"
          step="0.01"
          min="0"
          error={errors.precio?.message}
          placeholder="0.00"
          {...register("precio", { valueAsNumber: Number })}
          required
        />
        <Input
          label="Stock"
          type="number"
          min="0"
          step="1"
          error={errors.stock?.message}
          placeholder="0"
          {...register("stock", { valueAsNumber: Number })}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            {...register("categoria", { valueAsNumber: Number })}
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              ${errors.categoria ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-600"}
              dark:bg-slate-800 dark:text-slate-100`}
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}
          >
            <option value="" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}>Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors.categoria && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.categoria.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Marca <span className="text-red-500">*</span>
          </label>
          <select
            {...register("marca", { valueAsNumber: Number })}
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
              ${errors.marca ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-600"}
              dark:bg-slate-800 dark:text-slate-100`}
            style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}
          >
            <option value="" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}>Seleccionar marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id} style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)' }}>
                {marca.nombre}
              </option>
            ))}
          </select>
          {errors.marca && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.marca.message}</p>}
        </div>
      </div>

      <Input
        label="Imagen (URL)"
        type="url"
        error={errors.imagen?.message}
        placeholder="https://ejemplo.com/imagen.jpg"
        {...register("imagen")}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Boton type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Boton>
        <Boton type="submit" variant="primary" loading={isSubmitting}>
          {isEditing ? "Actualizar" : "Crear"}
        </Boton>
      </div>
    </form>
  );
}