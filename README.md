# VuelosBaratos

Aplicación simple para buscar ofertas de vuelos y paquetes. Incluye un backend Node.js con scrapers de ejemplo y un frontend React con Tailwind.

## Requisitos
- Node.js 16+

## Instalación
```bash
# Instala todas las dependencias (frontend y backend)
npm install
```

## Desarrollo
Para ejecutar en modo desarrollo es necesario correr el backend y el frontend por separado.

```bash
# Iniciar backend
cd backend
npm start

# En otra terminal iniciar frontend
cd frontend
npm run dev
```

El frontend está configurado para proxy `/api` hacia `http://localhost:4000`.

## Ejecución en producción

Ejecuta `npm start`. Este comando compila el frontend y a continuación arranca
el backend en modo producción:

```bash
npm start
```

Si ya tienes el frontend compilado y solo quieres iniciar el servidor puedes usar:

```bash
npm run start:prod
```

## Despliegue en Vercel
Vercel usará el archivo `vercel.json` para construir el frontend con Vite y las
funciones de la carpeta `api`. Ejecuta `npm install` y luego `npm run build` para
generar `frontend/dist`. El backend será accesible bajo `/api` y cualquier otra
ruta mostrará `index.html` gracias a la regla `/.*` ➜ `/index.html`.

## Compilar
```bash
cd frontend
npm run build
```
