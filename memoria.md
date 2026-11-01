# Memoria del Proyecto - Nexusgamer

## Resumen Ejecutivo
E-commerce Next.js 16 + React 19 + Django DRF para gestión de productos, categorías, marcas, ventas, compras, usuarios y proveedores.

## Arquitectura Clave
- **Server Components** (data fetching) + **Server Actions** (mutaciones)
- **Cookies**: `access` (HttpOnly, JWT) + `user_data` (NO HttpOnly, para AuthContext)
- **Validación**: RHF + Zod cliente + Zod `safeParse()` servidor
- **AuthContext** + **ThemeContext** - estado global reactivo

## Comandos Esenciales
```bash
npm run dev      # Desarrollo
npm run test     # Tests (Vitest + RTL)
npm run lint     # ESLint
npm run build    # Build producción
```

## Estructura Importante
```
src/
├── app/
│   ├── actions.js              # Server Actions (login, logout, CRUD productos, wishlist)
│   ├── login/page.jsx          # Login RHF+Zod
│   ├── productos/
│   │   ├── page.js             # Server Component: tabla + stats + modals
│   │   └── ProductoActions.jsx # Client Component: edit/delete modals
│   └── layout.js               # Providers + Sidebar
├── lib/
│   ├── api.js                  # ENDPOINTS + paginación + funciones CRUD (Server)
│   ├── api-client.js           # Funciones API para Client Components (wishlist)
│   └── auth.js                 # getToken, requireToken, decodeJWT, getTokenPayload
├── schemas/index.js            # loginSchema, productoSchema
├── context/
│   ├── AuthContext.jsx         # user, wishlist, login, logout, toggleDeseo, isAdmin
│   └── ThemeContext.jsx        # theme, toggleTheme, mounted
└── components/
    ├── Cargando.jsx            # Loading con mensajes progresivos
    ├── Sidebar.jsx             # Nav por rol + theme toggle + logout
    ├── BotonDeseo.jsx          # Corazón wishlist
    ├── Boton.jsx               # Reutilizable (5 variants, 3 sizes)
    ├── Input.jsx               # RHF compatible (forwardRef)
    ├── Card.jsx                # Card, CardGrid, CardStat
    ├── Modal.jsx               # Portal + focus trap + ConfirmModal
    └── ProductoForm.jsx        # RHF+Zod crear/editar (selects categ/marca)
```

## Endpoints Django (requeridos)

### Auth
- `POST /api/token/` - JWT login
- `POST /api/token/refresh/` - Refresh token

### Usuarios
- `GET /api/usuarios/cliente-get/` - Listar clientes
- `POST /api/usuarios/cliente/` - Crear cliente
- `GET /api/usuarios/vendedor-get/` - Listar vendedores
- `GET /api/usuarios/lista-deseos-get/` - Listar wishlist
- `POST /api/usuarios/lista-deseos/` - Agregar a wishlist
- `DELETE /api/usuarios/lista-deseos/{id}/` - Quitar de wishlist

### Catálogo
- `GET /api/catalogo/categoria-get/` - Listar categorías
- `POST /api/catalogo/categoria/` - Crear categoría
- `PUT /api/catalogo/categoria/{id}/` - Editar categoría
- `DELETE /api/catalogo/categoria/{id}/` - Borrar categoría
- `GET /api/catalogo/marca-get/` - Listar marcas
- `POST /api/catalogo/marca/` - Crear marca
- `PUT /api/catalogo/marca/{id}/` - Editar marca
- `DELETE /api/catalogo/marca/{id}/` - Borrar marca
- `GET /api/catalogo/producto-get/` - Listar productos (anidado: categoria, marca)
- `POST /api/catalogo/producto/` - Crear producto
- `PUT /api/catalogo/producto/{id}/` - Editar producto
- `DELETE /api/catalogo/producto/{id}/` - Borrar producto

### Proveedores
- `GET /api/proveedores/proveedor-get/` - Listar proveedores
- `POST /api/proveedores/proveedor/` - Crear proveedor
- `PUT /api/proveedores/proveedor/{id}/` - Editar proveedor
- `DELETE /api/proveedores/proveedor/{id}/` - Borrar proveedor

### Compras y Ventas
- `GET /api/compras/compra-list/` - Listar compras (con proveedor y detalles anidados)
- `DELETE /api/compras/compra/{id}/` - Borrar compra
- `GET /api/ventas/venta-get/` - Listar ventas (con cliente anidado)
- `DELETE /api/ventas/venta/{id}/` - Borrar venta

## Config (.env.local)
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Estado Actual (Fin de jornada 2026-11-01)

### ✅ Completado
- **Fase 0+1**: Setup, Auth, API base, Login, Tests base
- **Fase 2**: AuthContext, ThemeContext, Sidebar, BotonDeseo, Layout integrado
- **Fase 3**: CRUD Productos completo (8/8 componentes), Roles (admin/cliente), Theme toggle funcional

### 🔄 Pendientes para mañana (Rama `feature/rutas-finales`)

| Tarea | Descripción | Archivos a crear/modificar |
|-------|-------------|---------------------------|
| **1. Commit theme-fix** | Crear rama `feature/theme-fix`, commit cambios ThemeContext + globals.css | `git checkout -b feature/theme-fix`, commit, merge a develop |
| **2. Rutas lectura simple** | 4 Server Components con tablas (sin CRUD, solo lista) | `src/app/ventas/page.js`, `src/app/compras/page.js`, `src/app/proveedores/page.js`, `src/app/categorias/page.js` |
| **3. Sidebar ocultar rutas** | Verificar que Ventas, Compras, Proveedores, Categorías se oculten si !isAdmin | `src/components/Sidebar.jsx` (ya filtrado por `admin: true`) |
| **4. Tests finales** | `npm run test` (9 passing), `npm run lint`, `npm run build` | Verificar todo pasa |

## Gotchas/Notas
- Tests de API mockean `getToken` de `@/lib/auth` (evita error `cookies()` outside request)
- Login usa `router.push` + `router.refresh()` (no `useActionState`)
- Tailwind v4 usa `@tailwindcss/postcss` (no tailwindcss/postcss)
- Next.js 16: Turbopack habilitado, cacheComponents experimental
- **Backend productos**: usa `precio_lista` (string), `stock_total`, `categoria`/`marca` anidados
- **Wishlist fetch**: Client Components usan `${API_URL}/api/...` directo (no Next.js API routes)

## Estructura de GitFlow
- Rama principal: `main`
- Rama de integración: `develop`
- Ramas de features: `feature/fase-0-1-setup-auth`, `feature/fase-2-auth-context`, `feature/fase-3-crud-productos`, `feature/theme-fix`, `feature/rutas-finales`
- Estrategia de commits: Usar mensajes descriptivos en minúsculas, sin prefijos rígidos (ej: "config inicial de next", "armo el login con rhf")