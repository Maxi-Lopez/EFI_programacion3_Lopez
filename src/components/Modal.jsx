"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Boton } from "./Boton";

export function Modal({ open, onClose, title, children, size = "md", className = "" }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previousActiveElement = useRef(null);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  const trapFocus = (e) => {
    const focusableElements = contentRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements?.length) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => contentRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`w-full ${sizes[size]} rounded-xl bg-white dark:bg-slate-800 shadow-xl transform transition-all`}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            {title && <h2 id="modal-title" className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", variant = "danger", loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">{message}</p>
        <div className="flex justify-end gap-3">
          <Boton variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Boton>
          <Boton variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Boton>
        </div>
      </div>
    </Modal>
  );
}