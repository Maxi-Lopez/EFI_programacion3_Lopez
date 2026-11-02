"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proveedorSchema } from "@/schemas";
import { Boton } from "./Boton";
import { Input } from "./Input";
import { crearProveedorAction, editarProveedorAction } from "@/app/actions";

function formatearCuit(cuit) {
  if (!cuit) return "";
  const limpio = cuit.replace(/\D/g, "");
  if (limpio.length === 11) {
    return `${limpio.slice(0, 2)}-${limpio.slice(2, 10)}-${limpio.slice(10)}`;
  }
  return cuit;
}

export function ProveedorForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData;

  const getDefaultValues = (data) => {
    if (!data) {
      return {
        nombre: "",
        cuit: "",
        email: "",
        telefono: "",
      };
    }
    return {
      nombre: data.nombre || "",
      cuit: formatearCuit(data.cuit) || "",
      email: data.email || "",
      telefono: data.telefono || "",
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(proveedorSchema),
    defaultValues: getDefaultValues(initialData),
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre || "",
        cuit: formatearCuit(initialData.cuit) || "",
        email: initialData.email || "",
        telefono: initialData.telefono || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        formData.append(key, value);
      }
    });
    if (isEditing) formData.append("id", initialData.id);

    const action = isEditing ? editarProveedorAction : crearProveedorAction;
    const result = await action(formData);

    if (result.success) {
      onSuccess?.();
    } else if (result.fields) {
      Object.entries(result.fields).forEach(([field, messages]) => {
        if (messages?.[0]) {
          setError(field, { type: "server", message: messages[0] });
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
        placeholder="Ej: Proveedor SA"
        {...register("nombre")}
        required
      />

      <Input
        label="CUIT"
        error={errors.cuit?.message}
        placeholder="Ej: 30123456789"
        {...register("cuit")}
        required
      />

      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        placeholder="proveedor@ejemplo.com"
        {...register("email")}
      />

      <Input
        label="Teléfono"
        error={errors.telefono?.message}
        placeholder="Ej: +54 11 1234-5678"
        {...register("telefono")}
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