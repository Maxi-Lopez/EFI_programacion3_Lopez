# Bitácora - Nexusgamer (EFI Programación 3)

## Inicio del proyecto: 2026-10-31

### Fase 0+1 Completada (previa)
- Setup Next.js 16 + React 19 + Tailwind 4
- Auth JWT con cookies HttpOnly + user_data
- Server Actions: login, logout, crear/borrar producto
- RHF + Zod validación dual
- API client con paginación automática
- Tests: 9 passing (schemas + api)
- Estructura base: /login, /productos

---

### 2026-10-31 22:XX | Creación vitacora.md + memoria.md
- Acción: Documentación inicial
- Detalles: Crear ambos archivos de seguimiento
- Archivos: vitacora.md, memoria.md

### 2026-10-31 22:XX | Actualización api.js - Endpoints completos
- Acción: Refactor completo de src/lib/api.js
- Detalles: Estructura anidada read/write/auth, todos los endpoints Django, funciones CRUD para todos los recursos
- Archivos: src/lib/api.js

### 2026-11-01 00:XX | Fase 2 - AuthContext + ThemeContext + Sidebar + BotonDeseo
- Acción: Implementación completa Fase 2 (Auth + Theme + Sidebar)
- Detalles: AuthProvider lee cookie user_data, wishlist global, toggleDeseo; ThemeProvider con localStorage + data-theme; Sidebar con nav por rol + botón tema + logout
- Archivos: src/context/AuthContext.jsx, src/context/ThemeContext.jsx, src/components/Sidebar.jsx, src/components/BotonDeseo.jsx, src/app/layout.js, src/app/actions.js (agregar/quitar deseo), src/lib/api-client.js

### 2026-11-01 00:XX | Fase 3 - CRUD Productos + Componentes base (8/8)
- Acción: Implementación CRUD completo productos + 5 componentes reutilizables
- Detalles: Boton, Input, Card, Modal, ProductoForm (RHF+Zod); tabla en page.js con stats; Server Actions crear/editar/borrar con validación admin; Sidebar filtra por isAdmin
- Archivos: src/components/Boton.jsx, Input.jsx, Card.jsx, Modal.jsx, ProductoForm.jsx; src/app/productos/page.js, ProductoActions.jsx; src/app/actions.js (editarProductoAction, requireAdmin)

### 2026-11-01 00:XX | Arreglo tabla productos + ThemeContext + CSS variables
- Acción: Corrección campos backend (precio_lista, stock_total, categoria/marca anidados) + Theme toggle funcional
- Detalles: parseFloat precio, stock_total, categoria.marca anidados; ThemeContext con data-theme en <html>; globals.css variables :root + [data-theme="dark"]; Sidebar botón funcional
- Archivos: src/app/productos/page.js, src/context/ThemeContext.jsx, src/app/globals.css, src/components/Sidebar.jsx

### 2026-11-01 00:XX | Fin de jornada - Pendientes para mañana
- Acción: Resumen de estado actual
- Detalles: CRUD productos OK, tema OK. Pendiente: commit theme-fix en Git, Fase 4 (rutas Ventas, Compras, Proveedores, Categorías), tests finales
- Archivos: vitacora.md, memoria.md

[Futuras entradas en formato: YYYY-MM-DD HH:MM | Acción | Detalles | Archivos]