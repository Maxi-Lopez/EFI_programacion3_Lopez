# Nexusgamer - EFI Programacion 3

Sistema de gestion de inventario y ventas para tienda de computacion y gaming. Permite administrar productos, categorias, marcas, proveedores, compras, ventas y lista de deseos de usuarios, con autenticación basada en JWT y roles de administrador y cliente.

## Enlaces

- **API del Backend**: [URL_API_BACKEND]
- **Tablero Kanban**: [URL_TABLER0_KANBAN]

## Instalacion y ejecucion local

1. Clonar el repositorio:

```bash
git clone <URL_REPOSITORIO>
cd EFI_next-drf_Lopez
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno. Crear un archivo `.env.local` en la raiz del proyecto con el siguiente contenido:

```
NEXT_PUBLIC_API_URL=[URL_API_BACKEND]
```

4. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Ejecucion de pruebas

Para correr el suite de pruebas unitarias con Vitest y React Testing Library:

```bash
npm run test
```

## Capturas de pantalla

### Catalogo de productos

![Catalogo](./public/capturas/catalogo.png)

### Lista de deseos

![Lista de deseos](./public/capturas/deseos.png)

### Gestion de proveedores

![Proveedores](./public/capturas/proveedores.png)

### Movimientos (ventas y compras)

![Movimientos](./public/capturas/movimientos.png)

## Tecnologías utilizadas

- Next.js 16
- React 19
- Tailwind CSS v4
- React Hook Form
- Zod
- Vitest

## Integrantes del grupo

- [Nombre 1]
- [Nombre 2]
- [Nombre 3]
- [Nombre 4]

## Despliegue

- **Frontend**: Desplegado en Vercel. [URL_VERCEL]
- **Backend**: Desplegado en Render o Supabase. [URL_BACKEND_DESPLIEGUE]

Para desplegar el frontend en Vercel, conectar el repositorio de GitHub y configurar la variable de entorno `NEXT_PUBLIC_API_URL` con la URL del backend en produccion.

## Estructura del proyecto

```
src/
├── app/
│   ├── actions.js
│   ├── globals.css
│   ├── layout.js
│   ├── page.jsx
│   ├── login/
│   │   └── page.jsx
│   ├── productos/
│   │   ├── page.jsx
│   │   └── [id]/
│   │       └── page.jsx
│   ├── proveedores/
│   │   └── page.jsx
│   ├── movimientos/
│   │   ├── page.jsx
│   │   ├── ventas/
│   │   │   └── page.jsx
│   │   └── compras/
│   │       └── page.jsx
│   ├── lista-deseos/
│   │   └── page.jsx
│   └── sobre-nosotros/
│       └── page.jsx
├── components/
│   ├── Boton.jsx
│   ├── BotonDeseo.jsx
│   ├── BotonTema.jsx
│   ├── Card.jsx
│   ├── Cargando.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── ProductoForm.jsx
│   ├── ProductoActions.jsx
│   ├── ProveedorForm.jsx
│   ├── ProveedorActions.jsx
│   └── Sidebar.jsx
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── lib/
│   ├── api.js
│   ├── api-client.js
│   └── auth.js
├── schemas/
│   └── index.js
└── ...
```
