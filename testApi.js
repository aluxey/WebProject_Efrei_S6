// testApi.js
import path from 'path'
import dotenv from 'dotenv'
import axios from 'axios'

// 1. Charge votre fichier .env.development.local
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
})

// 2. Récupère la clé depuis process.env
const key = process.env.CLIMATIQ_API_KEY
if (!key) {
  console.error('❌ CLIMATIQ_API_KEY manquant dans .env.development.local')
  process.exit(1)
}

// 3. Prépare le payload d’exemple (UK grid residual mix)
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

// 4. Effectue la requête
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
