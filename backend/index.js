require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const OpenAI = require('openai')
const twilio = require('twilio')

const openaiApiKey = process.env.OPENAI_API_KEY
let openai = null
if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey })
  console.log('OpenAI client initialised')
let openai = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
} else {
  console.warn('OpenAI API key not configured; IA features disabled')
}

const twilioConfigured =
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_FROM &&
  process.env.TWILIO_TO

let whatsappClient = null
if (twilioConfigured) {
  whatsappClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )
  console.log('Twilio client initialised')
} else {
  console.warn('Twilio credentials not fully configured; WhatsApp notifications disabled')
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.send('API running'))

function formatDate(date) {
  if (!date) return null
  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return null
  return `${day}/${month}/${year}`
}

async function resolveIata(term) {
  const searchTerm = term?.trim()
  if (!searchTerm) return null

  const upper = searchTerm.toUpperCase()

  const paramsBase = {
    term: searchTerm,
    active_only: true,
    limit: 1
  }

  if (/^[A-Z]{3}$/.test(upper)) {
    return upper
  }

  const attempts = ['city', 'airport']

  for (const locationType of attempts) {
    const { data } = await axios.get('https://tequila-api.kiwi.com/locations/query', {
      params: { ...paramsBase, location_types: locationType },
      headers: { apikey: process.env.TEQUILA_API_KEY }
    })

    const location = data.locations?.[0]
    const code = location?.id || location?.code
    if (code) return code
  }

  return null
}

async function buildSummary(flights) {
  if (!openai || !flights?.length) return null

  try {
    const bestFlights = flights
      .slice(0, 5)
      .map((flight, index) => {
        const firstLeg = flight.route?.[0]
        const lastLeg = flight.route?.[flight.route.length - 1]
        const originText = `${firstLeg?.cityFrom} (${firstLeg?.flyFrom})`
        const destinationText = `${lastLeg?.cityTo} (${lastLeg?.flyTo})`
        return `${index + 1}. ${originText} → ${destinationText} por USD ${flight.price} el ${firstLeg?.local_departure}`
      })
      .join('\n')

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente de viajes que resume resultados de vuelos de forma breve y en español.'
        },
        {
          role: 'user',
          content: `Resume estas opciones de vuelos destacando la más conveniente:\n${bestFlights}`
        }
      ],
      max_tokens: 120,
      temperature: 0.6
    })

    return completion.choices?.[0]?.message?.content?.trim() || null
  } catch (error) {
    console.error('Error generating AI summary', error.message)
    return null
  }
}

async function notifyWhatsapp(offers) {
  if (!whatsappClient || !offers?.length) return

  try {
    const topOffers = offers
      .slice(0, 3)
      .map((flight) => {
        const firstLeg = flight.route?.[0]
        const lastLeg = flight.route?.[flight.route.length - 1]
        return `${firstLeg?.cityFrom} → ${lastLeg?.cityTo}: USD ${flight.price} (${firstLeg?.local_departure})`
      })
      .join('\n')

    await whatsappClient.messages.create({
      from: process.env.TWILIO_FROM,
      to: process.env.TWILIO_TO,
      body: `✈️ Ofertas encontradas:\n${topOffers}`
    })
  } catch (error) {
    console.error('Error sending WhatsApp notification', error.message)
  }
}

app.post('/api/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.body

    if (!origin || !destination || !date) {
      return res.status(400).json({ ok: false, error: 'Faltan datos para la búsqueda' })
    }

    if (!process.env.TEQUILA_API_KEY) {
      return res.status(500).json({ ok: false, error: 'Tequila API key not configured' })
    }

    const formattedDate = formatDate(date)
    if (!formattedDate) {
      return res.status(400).json({ ok: false, error: 'Fecha inválida' })
    }

    let originCode = null
    let destinationCode = null

    try {
      originCode = await resolveIata(origin)
      destinationCode = await resolveIata(destination)
    } catch (error) {
      console.error('Error resolving IATA codes', error.message)
      return res.status(500).json({ ok: false, error: 'No se pudieron obtener códigos IATA' })
    }

    if (!originCode || !destinationCode) {
      return res.status(404).json({ ok: false, error: 'No encontramos aeropuertos para la búsqueda' })
    }
    if (!openai) {
      return res.status(500).json({ ok: false, error: 'OpenAI API key not configured' })
    }
    const prompt = `Convierte estos en códigos IATA: origen ${origin}, destino ${destination}, fecha ${date}.`
    const ia = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50
    })
    const [origCode, destCode] = ia.choices[0].text.trim().split(/\s+/)

    const flights = await axios.get('https://tequila-api.kiwi.com/v2/search', {
      params: {
        fly_from: originCode,
        fly_to: destinationCode,
        date_from: formattedDate,
        date_to: formattedDate,
        limit: 5,
        curr: 'USD',
        sort: 'price',
        locale: 'es'
      },
      headers: { apikey: process.env.TEQUILA_API_KEY }
    })

    const offers = flights.data?.data || []
    const summary = await buildSummary(offers)

    await notifyWhatsapp(offers)

    res.json({
      ok: true,
      offers,
      summary,
      origin: { term: origin, code: originCode },
      destination: { term: destination, code: destinationCode }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
