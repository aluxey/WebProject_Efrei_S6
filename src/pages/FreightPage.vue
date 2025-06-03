<template>
  <div class="container my-5">
    <NotReady />
    <h1 class="mb-4 text-center">Émissions – Intermodal Freight (Climatiq API)</h1>

    <div class="row">
      <!-- FORMULAIRE -->
      <div class="col-lg-6">
        <div class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Détails du trajet</h5>

          <!-- Origine (IATA) -->
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

          <!-- Destination (IATA) -->
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

          <!-- Mode de transport -->
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

          <!-- Poids du cargo -->
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

          <!-- Bouton Estimer CO₂ -->
          <button
            class="btn btn-primary w-100"
            :disabled="!canEstimate"
            @click="estimateIntermodal"
          >
            Estimer CO₂
          </button>

          <!-- Message d'erreur en bas du formulaire -->
          <p v-if="errorMessage" class="text-danger mt-3">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- AFFICHAGE DES RÉSULTATS -->
      <div class="col-lg-6">
        <div v-if="result" class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Résultats</h5>

          <!-- Distance totale -->
          <p class="mb-2">
            <strong>Distance totale :</strong>
            {{ result.distance_km.toFixed(2) }} km
          </p>

          <!-- Émissions totales -->
          <p class="mb-4">
            <strong>Émissions totales :</strong>
            {{ result.co2e_total.toFixed(2) }} kg CO₂e
          </p>

          <!-- Répartition par étape (leg) -->
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

          <!-- Méthode de calcul & notices -->
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

// —————————————————————————————————————————————————————————————
// 1) DONNÉES RÉACTIVES
// —————————————————————————————————————————————————————————————
const origin = ref('')           // IATA origine
const destination = ref('')      // IATA destination
const transportMode = ref('')    // 'air' | 'sea' | 'road' | 'rail'
const cargoWeight = ref(0)       // ex : 500
const weightUnit = ref('')       // 'kg' | 't'

const errorMessage = ref('')
const result = ref(null)         // sera l'objet renvoyé par l'API

// Active le bouton si tous les champs obligatoires sont remplis
const canEstimate = computed(() =>
  origin.value.trim() !== '' &&
  destination.value.trim() !== '' &&
  transportMode.value !== '' &&
  cargoWeight.value > 0 &&
  weightUnit.value !== ''
)

// —————————————————————————————————————————————————————————————
// 2) FONCTION D’ESTIMATION
// —————————————————————————————————————————————————————————————
async function estimateIntermodal() {
  errorMessage.value = ''
  result.value = null

  // Construire le payload selon la doc Climatiq Intermodal Freight v2
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

  // Afficher dans la console pour débogage (si besoin)
  console.group('🌿 Climatiq Intermodal Request → /freight/v2/intermodal')
  console.log('Authorization:', `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`)
  console.log('Payload:', JSON.stringify(payload, null, 2))
  console.groupEnd()

  try {
    // Appel POST à l’endpoint : https://api.climatiq.io/freight/v2/intermodal
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

    // Sauvegarder le résultat pour l’affichage
    result.value = response.data

    // (Optionnel) Log de la réponse
    console.group('✅ Climatiq Intermodal Response ← /freight/v2/intermodal')
    console.log(JSON.stringify(response.data, null, 2))
    console.groupEnd()

  } catch (err) {
    // Si l’API renvoie une erreur (400, 401, etc.), afficher un message
    if (err.response && err.response.data) {
      errorMessage.value = `Erreur Climatiq : ${err.response.data.error || 'Bad Request'}. Consultez la console pour le détail.`
      console.error('🛑 Climatiq Error Response →', err.response.data)
    } else {
      errorMessage.value = 'Erreur réseau ou inconnue : ' + err.message
      console.error(err)
    }
  }
}

// —————————————————————————————————————————————————————————————
// 3) FILTRE POUR METTRE LA PREMIÈRE LETTRE EN MAJUSCULE
// —————————————————————————————————————————————————————————————
const capitalize = (str) => {
  if (typeof str !== 'string' || !str.length) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// —————————————————————————————————————————————————————————————
// 4) FORMATER L’AFFICHAGE DE LA LOCATION
// —————————————————————————————————————————————————————————————
function formatLocation(locObj) {
  // Le format renvoyé par l’API est souvent { iata: 'XYZ' }
  if (locObj.iata) {
    return locObj.iata
  }
  // S’il y a d’autres champs (à adapter si besoin)
  if (locObj.query) {
    return locObj.query
  }
  return 'N/A'
}
</script>

<style scoped>
/* Pas de styles particuliers : toute la mise en page utilise Bootstrap 5 */
</style>
