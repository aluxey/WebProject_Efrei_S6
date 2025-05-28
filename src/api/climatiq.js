import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.climatiq.io/data/v1',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

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
