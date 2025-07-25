require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const { Configuration, OpenAIApi } = require('openai')
const twilio = require('twilio')

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}))

const whatsappClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.send('API running'))

app.post('/api/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.body
    const prompt = `Convierte estos en códigos IATA: origen ${origin}, destino ${destination}, fecha ${date}.`
    const ia = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50
    })
    const [origCode, destCode] = ia.data.choices[0].text.trim().split(/\s+/)

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

    const offersText = flights.data.data
      .map(f => `${f.route[0].fly_from}→${f.route[0].fly_to}: ${f.price} USD (Salida: ${f.route[0].local_departure})`)
      .join('\n')

    await whatsappClient.messages.create({
      from: process.env.TWILIO_FROM,
      to:   process.env.TWILIO_TO,
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
