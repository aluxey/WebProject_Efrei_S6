import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.climatiq.io',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`, 
    'Content-Type': 'application/json',
  },
})


export async function estimateCpu(cpuCoreHours) {
  const path = '/data/v1/estimate'
  const payload = {
    emission_factor: {
      activity_id: 'cpu-provider_aws-region_eu_west_1',
      data_version: '22.22',
    },
    parameters: {
      number: cpuCoreHours,
      time: 1,
      time_unit: 'hour',
    },
  }
  try {
    const response = await client.post(path, payload)
    return response.data
  } catch (err) {
    throw err
  }
}

export async function estimateRam(gbHours) {
  const path = '/data/v1/estimate'
  const payload = {
    emission_factor: {
      activity_id: 'memory-provider_aws-region_eu_west_1',
      data_version: '22.22',
    },
    parameters: {
      data: gbHours,
      data_unit: 'GB',
      time: 1,
      time_unit: 'hour',
    },
  }
  try {
    const response = await client.post(path, payload)
    return response.data
  } catch (err) {
    throw err
  }
}

export async function estimateStorage(gbMonths) {
  const path = '/data/v1/estimate'
  const hoursPerMonth = 730 // average hours in one month
  const payload = {
    emission_factor: {
      activity_id: 'storage-provider_aws-region_eu_west_1-type_ssd',
      data_version: '22.22', // required by Climatiq for DataOverTime selectors
    },
    parameters: {
      data: gbMonths,
      data_unit: 'GB',
      time: hoursPerMonth,
      time_unit: 'hour',
    },
  }

  try {
    const response = await client.post(path, payload)
    return response.data
  } catch (err) {
    throw err
  }
}

export async function estimateUkGrid(kwh) {
  const path = '/data/v1/estimate'
  const payload = {
    emission_factor: {
      activity_id: 'electricity-supply_grid-source_total_supplier_mix',
      region: 'GB',
      data_version: '2022', // valid for UK grid
    },
    parameters: {
      energy: kwh,
      energy_unit: 'kWh',
    },
  }
  try {
    const response = await client.post(path, payload)
    return response.data
  } catch (err) {
    throw err
  }
}
