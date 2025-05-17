// src/api/climatiq.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.climatiq.io/data/v1',
  headers: {
    // NB : sous Node/Vite, expose votre clé via process.env.CLIMATIQ_API_KEY
    Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`
  }
})

/**
 * Estime les émissions de CO₂ pour le mix électrique UK (exemple Climatiq).
 * @param {number} energy  quantité d’énergie
 * @param {string} unit    unité, ex: 'kWh'
 */
export async function estimateUkGridResidualMix(energy, unit = 'kWh') {
  const payload = {
    emission_factor: {
      activity_id:  'electricity-supply_grid-source_supplier_mix',
      region:       'GB',
      data_version: 'a6'
    },
    parameters: {
      energy:      energy,
      energy_unit: unit
    }
  }

  const { data } = await api.post('/estimate', payload)
  return data
}
