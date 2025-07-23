VuelosBaratos
Aplicación simple para buscar ofertas de vuelos y paquetes. Incluye un backend Node.js con scrapers de ejemplo y un frontend React con Tailwind.

Requisitos
Node.js 16+

Instalación
bash
Copiar
Editar
# Instala todas las dependencias (frontend y backend)
npm install
Desarrollo
Para ejecutar en modo desarrollo es necesario correr el backend y el frontend por separado:

bash
Copiar
Editar
# Iniciar backend
cd backend
npm start
bash
Copiar
Editar
# En otra terminal iniciar frontend
cd frontend
npm run dev
El frontend está configurado para hacer proxy de /api hacia http://localhost:4000.

Ejecución en producción
Ejecutá el siguiente comando para compilar el frontend y arrancar el backend en modo producción:

bash
Copiar
Editar
npm start
Si ya tenés el frontend compilado y solo querés iniciar el servidor:

bash
Copiar
Editar
npm run start:prod
Despliegue en Vercel
Vercel usará el archivo vercel.json para construir el frontend con Vite y las funciones de la carpeta api.

Pasos:

bash
Copiar
Editar
npm install
npm run build
Esto generará la carpeta frontend/dist. El backend quedará accesible bajo /api y cualquier otra ruta servirá index.html gracias a la regla /.* ➜ /index.html.

Compilar
bash
Copiar
Editar
cd frontend
npm run build