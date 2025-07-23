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

## Despliegue en Vercel
Vercel usará el archivo `vercel.json` para construir el frontend con Vite y las
funciones de la carpeta `api`. Ejecuta `npm install` y luego `npm run build` para
generar `frontend/dist`. El backend será accesible bajo `/api`.

## Compilar
```bash
cd frontend
npm run build
```
