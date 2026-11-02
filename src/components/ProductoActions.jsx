"use client";

import { useState } from "react";
import { Modal, ConfirmModal } from "@/components/Modal";
import { ProductoForm } from "@/components/ProductoForm";
import { borrarProductoAction } from "@/app/actions";
import { Boton } from "@/components/Boton";
import { useAuth } from "@/context/AuthContext";


export default function ProductoActions({ producto, categorias, marcas, mode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingData, setEditingData] = useState(producto);
  const { isAdmin } = useAuth();

  const handleOpenCreate = (e) => {
    e?.preventDefault();
    setTimeout(() => {
      setEditingData(null);
      setIsOpen(true);
    }, 10);
  };

  const handleOpenEdit = (data) => {
    setEditingData(data);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", editingData.id);
    const result = await borrarProductoAction(formData);
    if (result.success) {
      setDeleteOpen(false);
      window.location.reload();
    } else {
      alert(result.error || "Error al borrar");
    }
  };

  // Renderizar botón según modo
  const buttonContent = mode === "create" ? (
    <Boton onClick={handleOpenCreate}>
      Agregar Producto
    </Boton>
  ) : (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => handleOpenEdit(producto)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
        aria-label="Editar"
        title="Editar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => {
          setEditingData(producto);
          setDeleteOpen(true);
        }}
        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        aria-label="Borrar"
        title="Borrar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      {isAdmin && buttonContent}

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title={editingData ? "Editar Producto" : "Agregar Producto"} size="lg">
        <ProductoForm
          categorias={categorias}
          marcas={marcas}
          initialData={editingData}
          onSuccess={handleSuccess}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que quieres eliminar "${editingData?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </>
  );
}