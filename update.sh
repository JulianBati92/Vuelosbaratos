#!/usr/bin/env bash
set -euo pipefail

# Muévete al directorio raíz del repo
cd "$(dirname "$0")"

# Asegurá estar en main
git fetch origin
git checkout main
git reset --hard origin/main

# 1) frontend/vite.config.js
cat > frontend/vite.config.js <<'EOV'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
EOV

# 2) frontend/.env.development
cat > frontend/.env.development <<'EOV'
VITE_API_URL=http://localhost:4000/api
EOV

# 3) frontend/src/services/api.js
mkdir -p frontend/src/services
cat > frontend/src/services/api.js <<'EOV'
const API_URL = import.meta.env.VITE_API_URL

/**
 * Realiza la búsqueda de vuelos en el backend
 * @param {{origin:string,destination:string,date:string}} params
 */
export async function searchFlights({ origin, destination, date }) {
  const res = await fetch(`${API_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, date })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al buscar vuelos')
  }
  return res.json()
}
EOV

# 4) backend/src/index.js
mkdir -p backend/src
cat > backend/src/index.js <<'EOV'
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const { Configuration, OpenAIApi } = require('openai')
const twilio = require('twilio')

// OpenAI
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}))

// Twilio WhatsApp
const whatsappClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Healthcheck
app.get('/', (req, res) => res.send('API running'))

// Búsqueda de vuelos + IA + WhatsApp
app.post('/api/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.body

    // 1) IA para IATA
    const prompt = `Convierte estos en códigos IATA: origen ${origin}, destino ${destination}, fecha ${date}.`
    const ia = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50
    })
    const [origCode, destCode] = ia.data.choices[0].text.trim().split(/\s+/)

    // 2) API vuelos (Tequila)
    const flights = await axios.get('https://tequila-api.kiwi.com/v2/search', {
      params: {
        fly_from: origCode,
        fly_to: destCode,
        date_from: date,
        date_to: date,
        limit: 5
      },
      headers: { apikey: process.env.TEQUILA_API_KEY }
    })

    // 3) Formatear
    const offersText = flights.data.data
      .map(f => `${f.route[0].fly_from}→${f.route[0].fly_to}: ${f.price} USD (Salida: ${f.route[0].local_departure})`)
      .join('\n')

    // 4) WhatsApp
    await whatsappClient.messages.create({
      from: process.env.TWILIO_FROM,  # 'whatsapp:+14155238886'
      to: process.env.TWILIO_TO,      # 'whatsapp:+549XXXXXXXXX'
      body: `✈️ Ofertas de vuelos:\n${offersText}`
    })

    res.json({ ok: true, offers: flights.data.data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
EOV

# 5) Commit & push
git add frontend/vite.config.js frontend/.env.development frontend/src/services/api.js backend/src/index.js
git commit -m "feat: proxy front, IA y WhatsApp en backend"

if git remote get-url origin >/dev/null 2>&1; then
  git push origin main
else
  echo "Remote 'origin' is not configured" >&2
  exit 1
fi
