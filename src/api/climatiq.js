import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.climatiq.io/data/v1',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

/**
 * @param {string} activityId   ex: 'electricity-supply-grid-source-residual_mix'
 * @param {number} amount       ex: 4200
 * @param {string} unitKey      'energy' ou 'distance'
 * @param {string} unit         'kwh' ou 'km'
 * @param {string} dataVersion  ex: '21' selon la doc (non pas 'latest')
 */
export async function calculateEmission() {
  const payload = {  }
  console.log('🍃 payload:', payload)
  try {
    const res = await api.post('/estimate', payload)
    return res.data
  } catch (err) {
    console.error('❌ Climatiq responded:', err.response?.status, err.response?.data)
    throw err
  }
}

// pour pouvoir tester en local seulement
if (import.meta.env.DEV) {
  window.calculateEmission = calculateEmission
}
