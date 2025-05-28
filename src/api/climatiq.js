import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.climatiq.io/data/v1',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

/**
 * 1) CPU-core-hours
 * @param {number} hours  Nombre d’heures de CPU
 */
export async function estimateCpu(hours) {
  const payload = {
    emission_factor: {
      activity_id: 'compute-instance-cloud_cpu_core_time',
      data_version: '2022'
    },
    parameters: {
      energy: hours,
      energy_unit: 'h'
    }
  }
  const { data } = await client.post('/estimate', payload)
  return data
}

/**
 * 2) RAM-GB-hours
 * @param {number} gbHours  Nombre de GB·heures de RAM
 */
export async function estimateRam(gbHours) {
  const payload = {
    emission_factor: {
      activity_id: 'compute-instance-cloud_memory_gb_hour',
      data_version: '2022'
    },
    parameters: {
      energy: gbHours,
      energy_unit: 'h*GB'
    }
  }
  const { data } = await client.post('/estimate', payload)
  return data
}

/**
 * 3) Stockage-GB-mois
 * @param {number} gbMonth  Nombre de GB·mois de stockage
 */
export async function estimateStorage(gbMonth) {
  const payload = {
    emission_factor: {
      activity_id: 'storage-cloud_block_storage_gb_month',
      data_version: '2022'
    },
    parameters: {
      energy: gbMonth,
      energy_unit: 'GB*mois'
    }
  }
  const { data } = await client.post('/estimate', payload)
  return data
}

/**
 * 4) Énergie mix UK (électricité)
 * @param {number} kwh  kWh consommés
 */
export async function estimateUkGrid(kwh) {
  const payload = {
    emission_factor: {
      activity_id: 'electricity-supply_grid-source_supplier_mix',
      region: 'GB',
      data_version: '2022'
    },
    parameters: {
      energy: kwh,
      energy_unit: 'kWh'
    }
  }
  const { data } = await client.post('/estimate', payload)
  return data
}
