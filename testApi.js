import path from 'path'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

const key = process.env.CLIMATIQ_API_KEY
if (!key) {
  console.error('❌ CLIMATIQ_API_KEY manquant dans .env.development.local')
  process.exit(1)
}

const payload = {
  emission_factor: {
    activity_id:  'electricity-supply_grid-source_supplier_mix',
    region:       'GB',
    data_version: '21'
  },
  parameters: {
    energy:      2700,
    energy_unit: 'kWh'
  }
}

console.log('➡️  Envoi du payload:', JSON.stringify(payload, null, 2))

try {
  const response = await axios.post(
    'https://api.climatiq.io/data/v1/estimate',
    payload,
    {
      headers: {
        Authorization: `Bearer ${key}`
      }
    }
  )
  console.log('✅  Réponse API:', response.data)
} catch (err) {
  if (err.response) {
    console.error(
      `❌  Erreur API (${err.response.status}):`,
      err.response.data
    )
  } else {
    console.error('❌  Erreur réseau:', err.message)
  }
}
