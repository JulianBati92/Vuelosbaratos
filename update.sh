#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "No git repository found" >&2
  exit 1
fi

# Checkout main branch
if git show-ref --verify --quiet refs/heads/main; then
  git checkout main
else
  echo "Branch 'main' not found" >&2
  exit 1
fi

if ! git config remote.origin.url >/dev/null 2>&1; then
  echo "Remote 'origin' not configured" >&2
  exit 1
fi

cat > frontend/vite.config.js <<'EOT'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
EOT

cat > frontend/.env.development <<'EOT'
VITE_API_URL=/api
EOT

mkdir -p frontend/src/services
cat > frontend/src/services/api.js <<'EOT'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const getIAResponse = (prompt) =>
  api.post('/ia', { prompt })

export const sendWhatsApp = (to, body) =>
  api.post('/whatsapp', { to, body })

export default api
EOT

mkdir -p backend/src
cat > backend/src/index.js <<'EOT'
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { enviarNotificacion } = require('../notificacion')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/buscar', require('../routes/buscar'))

app.post('/api/ia', async (req, res) => {
  try {
    const { prompt } = req.body
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    )
    res.json(response.data)
  } catch (err) {
    console.error('Error en /api/ia:', err)
    res.status(500).json({ error: 'Error al generar respuesta IA' })
  }
})

app.post('/api/whatsapp', async (req, res) => {
  try {
    const { mensaje } = req.body
    await enviarNotificacion(mensaje)
    res.json({ status: 'ok' })
  } catch (err) {
    console.error('Error en /api/whatsapp:', err)
    res.status(500).json({ error: 'Error al enviar WhatsApp' })
  }
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
EOT

# Commit and push

git add frontend/vite.config.js frontend/.env.development frontend/src/services/api.js backend/src/index.js

git commit -m "feat: proxy front, IA y WhatsApp en backend"

git push origin main
