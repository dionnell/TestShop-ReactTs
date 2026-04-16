# TestShop

TestShop es una tienda online de demostración construida con React y TypeScript. La aplicación incluye una interfaz de usuario para clientes y un panel de administración para gestionar productos.

## Funcionalidades

- Página de catálogo de productos con filtros y búsqueda.
- Navegación por género y páginas de producto individuales.
- Página de detalle de producto con información y opciones de compra.
- Autenticación de usuarios con formularios de login y registro.
- Panel de administración para ver, crear y editar productos.
- Manejo de peticiones HTTP con Axios y estado remoto con React Query.
- Componentes reutilizables para botones, tarjetas, formularios y tablas.

## Tecnologías utilizadas

- **React 19**: biblioteca para construir la interfaz de usuario con componentes declarativos.
- **TypeScript**: añade tipado estático y mejora la calidad del código en React.
- **Vite**: herramienta de build rápida para desarrollo local y producción.
- **Tailwind CSS**: framework utilitario para estilos rápidos y responsivos.
- **React Router v7**: maneja rutas y navegación dentro de la aplicación.
- **React Hook Form**: gestiona formularios y validación con hooks.
- **@tanstack/react-query**: sincroniza y cachea datos remotos de forma eficiente.
- **Axios**: cliente HTTP para comunicar la app con APIs.
- **Zustand**: estado global ligero para compartir datos entre componentes.
- **Radix UI**: componentes accesibles y personalizables para la interfaz.
- **lucide-react**: iconos simples y elegantes para la UI.
- **sonner**: notificaciones y feedback visual en la aplicación.

## Estructura principal

- `src/shop`: páginas y componentes de la tienda.
- `src/admin`: páginas y componentes del panel de administración.
- `src/auth`: autenticación y rutas protegidas.
- `src/components`: elementos UI reutilizables.
- `src/api`: configuración de llamadas a API.
- `src/lib`: utilidades compartidas.

## Alojamiento 

La pagina se encuentra alojada en Netifly: [https://test-shop-react.netlify.app/](https://test-shop-react.netlify.app/)
La base de datos Postgress se encuentra en [Neon Serverless](https://neon.com/)
y el backend se encuentra en mi Github [TestShop-NestJs](https://github.com/dionnell/TestShop-NestJs) y se encuentra alojado en [render](https://render.com/)


## Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar en modo desarrollo:

```bash
npm run dev
```

3. Abrir la aplicación en el navegador en la URL que muestre Vite.

