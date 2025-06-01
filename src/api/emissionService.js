import axios from 'axios';

const key = import.meta.env.VITE_CLIMATIQ_API_KEY;
const BASE_URL = 'https://api.climatiq.io';

/**
 * Fetch a flight‐based CO₂e estimate from Climatiq’s /travel/flights endpoint.
 *
 * @param {string} origin
 * @param {string} destination  –
 * @param {number} [passengers=1]
 * @param {string} [flightClass='economy']
 * @returns {Promise<number>}
 */
export async function estimateFlightEmission(
  origin,
  destination,
  passengers = 1,
  flightClass = 'economy'
) {
  if (!key) {
    throw new Error('Missing Climatiq API key (see console).');
  }

  try {
    const payload = {
      legs: [
        {
          from: origin,
          to:   destination,
          passengers,
          class: flightClass
        }
      ]
    };

    const response = await axios.post(
      `${BASE_URL}/travel/flights`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const body = response.data;

    if (body.data && typeof body.data.co2e === 'number') {
      return body.data.co2e;
    } else if (body.data && typeof body.data.emissions === 'number') {
      return body.data.emissions;
    } else if (typeof body.co2e === 'number') {
      return body.co2e;
    }

    throw new Error('Unexpected response shape from Climatiq.');
  } catch (error) {
    console.error('Error fetching flight emissions:', error);
    throw error;
  }
}
