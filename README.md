# TestShop

TestShop es una tienda online de demostración construida con React y TypeScript, con un backend en NestJS. La aplicación simula una tienda de ropa completa con flujo de compra real usando Transbank Webpay Plus en ambiente de integración.

## Funcionalidades

### Tienda (Cliente)
- **Catálogo de productos** con filtros por talla, precio y género, búsqueda por nombre y paginación.
- **Navegación por género** (Hombres, Mujeres, Niños) con páginas dedicadas.
- **Página de detalle de producto** con galería de imágenes, selección de talla, productos relacionados y zoom.
- **Carrito de compras** con control de cantidad, eliminación de items y resumen de compra.
- **Favoritos** para guardar productos de interés y gestionarlos desde el perfil.
- **Perfil de usuario** con edición de nombre, teléfono y dirección, y cambio de contraseña.
- **Historial de compras** con detalle de órdenes aprobadas e items comprados.
- **Pago con Transbank Webpay Plus** en ambiente de integración, con redirección a página de éxito o fallo según resultado.
- **Autenticación** con registro, login y verificación de sesión automática con JWT.
- **Reactivación automática de cuenta**: si un usuario con cuenta desactivada vuelve a iniciar sesión con sus credenciales correctas, su cuenta se reactiva automáticamente.
- **Registro con validación**: formulario de registro con react-hook-form, indicadores visuales de requisitos de contraseña (mayúscula, minúscula, número, mínimo 6 caracteres) y confirmación de contraseña.

### Panel de Administración
- **Dashboard** con métricas reales del negocio: total de usuarios, órdenes aprobadas, ingresos totales y productos en favoritos.
- **Gestión de productos**: ver, crear y editar con soporte para imágenes (drag & drop), tallas y etiquetas. Tabla responsive con filas colapsables en móvil.
- **Favoritos admin**: tabla con todos los productos y la cantidad de usuarios que los tienen en favoritos, ordenados de mayor a menor. Responsive con filas colapsables.
- **Gestión de usuarios**: tabla con todos los usuarios registrados, con opciones para editar datos, roles, estado y contraseña, y ver sus órdenes. Responsive con filas colapsables.
- **Gestión de órdenes**: tabla con todas las órdenes de la tienda con filtros por estado (aprobado, pendiente, fallido, cancelado), búsqueda por email o nombre, y paginación. Responsive con filas colapsables en móvil que muestran el detalle completo.
- **Cancelación de órdenes**: los administradores pueden cancelar órdenes con estado aprobado desde la tabla de órdenes, con confirmación mediante AlertDialog.
- **Modal de detalle de orden**: vista completa de una orden con sus items, precios e imágenes. Responsive.
- **Modal de órdenes por usuario**: historial de compras de un usuario específico con filtro por estado. Responsive.
- **Búsqueda contextual** en el header: busca en la sección activa (productos, favoritos, usuarios u órdenes).
- **Sidebar colapsable** visible solo en pantallas medianas y grandes.
- **Header responsive con menú desplegable**: en móvil muestra el logo y un menú hamburguesa con la misma navegación del sidebar, incluyendo datos del usuario al pie.

## Tecnologías utilizadas

### Frontend
- **React 19**: biblioteca para construir la interfaz de usuario con componentes declarativos.
- **TypeScript**: tipado estático para mayor calidad y mantenibilidad del código.
- **Vite**: herramienta de build ultrarrápida para desarrollo local y producción.
- **Tailwind CSS v4**: framework utilitario para estilos rápidos y responsivos.
- **React Router v7**: manejo de rutas con hash router, rutas protegidas por rol y rutas anidadas.
- **TanStack React Query v5**: sincronización y cacheo de datos remotos con soporte para mutations.
- **Zustand**: estado global liviano para autenticación y datos del usuario.
- **React Hook Form**: gestión de formularios con validación (registro, edición de perfil, cambio de contraseña, edición de usuarios admin).
- **Axios**: cliente HTTP con interceptores para manejo automático del token JWT.
- **Radix UI / shadcn**: componentes accesibles como diálogos, dropdowns, tablas, alertas y selects.
- **lucide-react**: iconos SVG simples y consistentes.
- **sonner**: notificaciones toast con soporte para colores y posición.

### Backend (NestJS) [Github Backend](https://github.com/dionnell/TestShop-NestJs)
- **NestJS**: framework Node.js para construir APIs REST escalables y modulares.
- **TypeORM + PostgreSQL**: ORM para manejo de entidades, relaciones y migraciones automáticas.
- **JWT + Passport**: autenticación stateless con guards por rol (user/admin).
- **transbank-sdk**: integración con Webpay Plus para procesamiento de pagos.
- **Multer**: manejo de subida de archivos para imágenes de productos.
- **Swagger**: documentación automática de la API disponible en `/api`.
- **bcrypt**: encriptación segura de contraseñas.

## Estructura principal

```
src/
├── shop/        # Páginas y componentes de la tienda (cliente)
├── admin/       # Páginas y componentes del panel de administración
├── auth/        # Autenticación, store Zustand y rutas protegidas
├── components/  # Elementos UI reutilizables (shadcn, paginación, etc.)
├── api/         # Configuración de Axios
├── interface/   # Tipos e interfaces TypeScript
└── lib/         # Utilidades compartidas
```

## Endpoints destacados del backend

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/auth/register` | Registro de usuario | Público |
| POST | `/auth/login` | Login (reactiva cuenta si estaba inactiva) | Público |
| PATCH | `/auth/profile` | Editar perfil | Usuario |
| PATCH | `/auth/change-password` | Cambiar contraseña | Usuario |
| GET | `/auth/users` | Listar usuarios con paginación y búsqueda | Admin |
| PATCH | `/auth/users/:id` | Editar usuario (roles, estado, contraseña) | Admin |
| GET | `/payments/admin/all` | Listar todas las órdenes con filtros | Admin |
| PATCH | `/payments/:id/cancel` | Cancelar orden aprobada | Admin |
| GET | `/payments/my-payments` | Historial de compras del usuario | Usuario |
| GET | `/favorites/admin/group` | Favoritos agrupados por producto | Admin |

## Alojamiento

> ⚠️ **Nota importante**: El backend está alojado en Render con un plan gratuito. Si lleva un tiempo sin recibir peticiones, puede tardar **hasta 1 minuto** en despertar antes de responder. Es normal que la primera carga sea lenta.

| Servicio | Plataforma | URL |
|----------|-----------|-----|
| Frontend | Netlify | [https://test-shop-react.netlify.app/](https://test-shop-react.netlify.app/) |
| Backend | Render | [TestShop-NestJs](https://github.com/dionnell/TestShop-NestJs) |
| Base de datos | Neon Serverless PostgreSQL | — |

### Credenciales de administrador

```
Usuario: test1@google.com
Contraseña: Abc123
```

### Credenciales de prueba para Transbank Webpay Plus

El pago utiliza el ambiente de **integración** de Transbank, por lo que no se realizan cobros reales.

**Tarjeta de crédito (aprobada):**

| Campo | Valor |
|-------|-------|
| Número | `4051 8856 0044 6623` |
| CVV | `123` |
| Fecha de expiración | Cualquiera futura, ej. `12/26` |
| RUT | `11.111.111-1` |
| Contraseña | `123` |

## Ejecución local

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` con la URL del backend:

```env
VITE_API_URL=http://localhost:3000/api
```

3. Iniciar en modo desarrollo:

```bash
npm run dev
```

4. Abrir la aplicación en la URL que muestre Vite (por defecto `http://localhost:5173`).