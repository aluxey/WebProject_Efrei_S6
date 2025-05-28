<template>
  <div class="emission-form">
    <h2>Calculateur d'émissions de vol</h2>
    <form @submit.prevent="calculateEmissions">
      <div>
        <label for="origin">Origine (code IATA)</label>
        <input v-model="origin" id="origin" placeholder="Ex: CDG" required />
      </div>
      <div>
        <label for="destination">Destination (code IATA)</label>
        <input v-model="destination" id="destination" placeholder="Ex: JFK" required />
      </div>
      <button type="submit">Calculer</button>
    </form>

    <div v-if="loading">Calcul en cours...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="result">
      <p>Distance estimée : {{ result.distance }} km</p>
      <p>Émissions estimées : {{ result.co2e }} kg CO₂e</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const origin = ref('')
const destination = ref('')
const result = ref(null)
const error = ref('')
const loading = ref(false)

const calculateEmissions = async () => {
  loading.value = true
  error.value = ''
  result.value = null

  try {
    const response = await axios.post(
      'https://preview.api.climatiq.io/travel/v1-preview1/distance',
      {
        travel_mode: 'air',
        origin: { iata: origin.value.toUpperCase() },
        destination: { iata: destination.value.toUpperCase() }
      },
      {
        headers: {
          Authorization: 'Bearer VOTRE_CLE_API_ICI',
          'Content-Type': 'application/json'
        }
      }
    )

    const data = response.data
    result.value = {
      co2e: data.co2e,
      distance: data.distance
    }
  } catch (err) {
    error.value = 'Erreur lors du calcul : ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.emission-form {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
