"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas";
import { registerAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "sonner";

const inputClass = "w-full rounded-lg border border-line bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-2 focus:outline-primary/30";

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      telefono: "",
      dni: "",
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);
    setApiError("");

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        formData.append(key, value);
      }
    });

    const result = await registerAction(formData);
    setIsSubmitting(false);

    if (result.error) {
      setApiError(result.error);
    } else {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-field px-5">
      <div className="absolute inset-0 bg-gradient-to-br from-field via-field to-primary/5 dark:from-field dark:via-field dark:to-primary/10" />
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-line bg-white/80 dark:bg-surface/80 backdrop-blur-sm p-8 shadow-sm"
      >
        <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Crear cuenta</h1>
        
        <p className="mb-6 mt-1 text-sm text-slate-500 dark:text-slate-400">Nexusgamer - Panel de administración</p>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre
            <input
              {...register("first_name")}
              type="text"
              autoComplete="given-name"
              required
              className={inputClass}
              aria-invalid={!!errors.first_name}
              disabled={isSubmitting}
            />
            {errors.first_name && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.first_name[0]}</p>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Apellido
            <input
              {...register("last_name")}
              type="text"
              autoComplete="family-name"
              required
              className={inputClass}
              aria-invalid={!!errors.last_name}
              disabled={isSubmitting}
            />
            {errors.last_name && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.last_name[0]}</p>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Usuario
            <input
              {...register("username")}
              type="text"
              autoComplete="username"
              required
              className={inputClass}
              aria-invalid={!!errors.username}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.username[0]}</p>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              aria-invalid={!!errors.email}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.email[0]}</p>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Contraseña
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
              aria-invalid={!!errors.password}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.password[0]}</p>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            Teléfono (opcional)
            <input
              {...register("telefono")}
              type="tel"
              autoComplete="tel"
              className={inputClass}
              aria-invalid={!!errors.telefono}
              disabled={isSubmitting}
            />
            {errors.telefono && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.telefono[0]}</p>
            )}
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            DNI (opcional)
            <input
              {...register("dni")}
              type="text"
              className={inputClass}
              aria-invalid={!!errors.dni}
              disabled={isSubmitting}
            />
            {errors.dni && (
              <p className="text-xs text-red-700 dark:text-red-400" role="alert">{errors.dni[0]}</p>
            )}
          </label>
        </div>

        {apiError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-800 dark:text-red-400">
            {apiError}
          </p>
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>

        {isSubmitting && (
          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            Si la API estaba dormida, puede tardar hasta un minuto.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          ¿Ya tienes cuenta? <Link href="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
        </p>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:underline">Cancelar</Link>
        </p>
      </form>
    </div>
  );
}