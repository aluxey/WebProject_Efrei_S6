<template>
  <div class="container my-5">
    <NotReady />
    <h1 class="mb-4 text-center">Émissions – Intermodal Freight (Climatiq API)</h1>

    <div class="row">
      <div class="col-lg-6">
        <div class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Détails du trajet</h5>

          <div class="mb-3">
            <label for="origin" class="form-label">Origine (IATA)</label>
            <input
              id="origin"
              type="text"
              v-model.trim="origin"
              class="form-control"
              placeholder="Ex : CDG"
            />
          </div>

          <div class="mb-3">
            <label for="destination" class="form-label">Destination (IATA)</label>
            <input
              id="destination"
              type="text"
              v-model.trim="destination"
              class="form-control"
              placeholder="Ex : JFK"
            />
          </div>

          <div class="mb-3">
            <label for="mode" class="form-label">Mode de transport</label>
            <select
              id="mode"
              v-model="transportMode"
              class="form-select"
            >
              <option disabled value="">Sélectionnez…</option>
              <option value="air">Air</option>
              <option value="sea">Mer</option>
              <option value="road">Route</option>
              <option value="rail">Rail</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="weight" class="form-label">Poids du cargo</label>
            <div class="input-group">
              <input
                id="weight"
                type="number"
                v-model.number="cargoWeight"
                class="form-control"
                placeholder="Ex : 500"
                min="0"
              />
              <select
                v-model="weightUnit"
                class="form-select"
                style="max-width: 120px;"
              >
                <option disabled value="">Unités</option>
                <option value="kg">kg</option>
                <option value="t">t</option>
              </select>
            </div>
          </div>

          <button
            class="btn btn-primary w-100"
            :disabled="!canEstimate"
            @click="estimateIntermodal"
          >
            Estimer CO₂
          </button>

          <p v-if="errorMessage" class="text-danger mt-3">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <div class="col-lg-6">
        <div v-if="result" class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Résultats</h5>

          <p class="mb-2">
            <strong>Distance totale :</strong>
            {{ result.distance_km.toFixed(2) }} km
          </p>

          <p class="mb-4">
            <strong>Émissions totales :</strong>
            {{ result.co2e_total.toFixed(2) }} kg CO₂e
          </p>

          <h6 class="mb-2">Étapes du trajet :</h6>
          <ul class="list-group mb-3">
            <li
              v-for="(leg, index) in result.legs"
              :key="index"
              class="list-group-item"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <small class="text-muted">Leg {{ index + 1 }} ({{ leg.transport_mode | capitalize }})</small><br/>
                  <span>
                    {{ formatLocation(leg.from_location) }}
                    →
                    {{ formatLocation(leg.to_location) }}
                  </span>
                </div>
                <div class="text-end">
                  <span>{{ leg.co2e.toFixed(2) }} kg CO₂e</span><br/>
                  <small class="text-muted">{{ leg.distance_km.toFixed(1) }} km</small>
                </div>
              </div>
            </li>
          </ul>

          <small class="text-muted">
            Méthode : {{ result.co2e_calculation_method }}<br/>
            <template v-if="result.notices && result.notices.length">
              <strong>Notices :</strong>
              <ul class="ps-3 mb-0">
                <li v-for="(n, i) in result.notices" :key="i">{{ n }}</li>
              </ul>
            </template>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import NotReady from '@/components/NotReady.vue'

const origin = ref('')
const destination = ref('')
const transportMode = ref('')
const cargoWeight = ref(0)
const weightUnit = ref('')

const errorMessage = ref('')
const result = ref(null)

// Active le bouton si tous les champs obligatoires sont remplis
const canEstimate = computed(() =>
  origin.value.trim() !== '' &&
  destination.value.trim() !== '' &&
  transportMode.value !== '' &&
  cargoWeight.value > 0 &&
  weightUnit.value !== ''
)

async function estimateIntermodal() {
  errorMessage.value = ''
  result.value = null

  const payload = {
    route: [
      { location: { iata: origin.value.trim().toUpperCase() } },
      { transport_mode: transportMode.value },
      { location: { iata: destination.value.trim().toUpperCase() } },
    ],
    cargo: {
      weight: cargoWeight.value,
      weight_unit: weightUnit.value,
    },
  }

  console.group('🌿 Climatiq Intermodal Request → /freight/v2/intermodal')
  console.log('Authorization:', `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`)
  console.log('Payload:', JSON.stringify(payload, null, 2))
  console.groupEnd()

  try {
    const response = await axios.post(
      'https://api.climatiq.io/freight/v2/intermodal',
      payload,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    result.value = response.data
    console.group('✅ Climatiq Intermodal Response ← /freight/v2/intermodal')
    console.log(JSON.stringify(response.data, null, 2))
    console.groupEnd()

  } catch (err) {
    if (err.response && err.response.data) {
      errorMessage.value = `Erreur Climatiq : ${err.response.data.error || 'Bad Request'}. Consultez la console pour le détail.`
      console.error('🛑 Climatiq Error Response →', err.response.data)
    } else {
      errorMessage.value = 'Erreur réseau ou inconnue : ' + err.message
      console.error(err)
    }
  }
}

const capitalize = (str) => {
  if (typeof str !== 'string' || !str.length) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatLocation(locObj) {
  if (locObj.iata) {
    return locObj.iata
  }
  if (locObj.query) {
    return locObj.query
  }
  return 'N/A'
}
</script>

<style scoped>
</style>
