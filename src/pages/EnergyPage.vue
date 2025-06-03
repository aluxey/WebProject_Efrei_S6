<!-- EnergyPage.vue -->
<template>
  <div class="container my-5">
    <h1 class="text-center mb-4">Calculateur Énergie (Climatiq API)</h1>

    <!-- NAVIGATION ENTRE SECTIONS -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'electricity' }"
          @click="activeTab = 'electricity'"
          type="button"
          role="tab"
        >
          Électricité
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'heat' }"
          @click="activeTab = 'heat'"
          type="button"
          role="tab"
        >
          Chaleur & Vapeur
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'fuel' }"
          @click="activeTab = 'fuel'"
          type="button"
          role="tab"
        >
          Combustible
        </button>
      </li>
    </ul>

    <!-- SECTION ÉLECTRICITÉ -->
    <div v-if="activeTab === 'electricity'">
      <div class="card shadow-sm p-4 mb-5">
        <h5 class="card-title mb-3">Estimation – Électricité</h5>

        <!-- Formulaire Électricité -->
        <div class="mb-3">
          <label for="elec-region" class="form-label">Région / Pays (IATA ou région ONS)</label>
          <input
            id="elec-region"
            type="text"
            v-model.trim="elecRegion"
            class="form-control"
            placeholder="Ex : GB, FR, US-CA"
          />
        </div>

        <div class="mb-3">
          <label for="elec-year" class="form-label">Année (facultatif)</label>
          <input
            id="elec-year"
            type="number"
            v-model.number="elecYear"
            class="form-control"
            placeholder="Ex : 2023"
            min="2000"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Quantité d’électricité consommée</label>
          <div class="input-group">
            <input
              type="number"
              v-model.number="elecAmount"
              class="form-control"
              placeholder="Ex : 5000"
              min="0"
            />
            <select v-model="elecUnit" class="form-select" style="max-width: 120px;">
              <option disabled value="">Unité</option>
              <option value="kWh">kWh</option>
              <option value="MWh">MWh</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label for="elec-source-set" class="form-label">Jeu de facteurs (“source_set”)</label>
          <select id="elec-source-set" v-model="elecSourceSet" class="form-select">
            <option disabled value="">Sélectionnez…</option>
            <option value="core">Core (gratuit)</option>
            <option value="iea">IEA (premium, si disponible)</option>
          </select>
        </div>

        <button
          class="btn btn-primary w-100"
          :disabled="!canEstimateElectricity"
          @click="estimateElectricity"
        >
          Estimer Électricité
        </button>

        <p v-if="elecError" class="text-danger mt-3">{{ elecError }}</p>
      </div>

      <!-- Résultats Électricité -->
      <div v-if="elecResult" class="card shadow-sm p-4">
        <h5 class="card-title mb-3">Résultats – Électricité</h5>

        <!-- Estimations “Location-based” -->
        <h6 class="mb-2">Méthode “Location” (Scope 2 location-based)</h6>
        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between">
            <span>Consommation (co2e)</span>
            <span>{{ elecResult.location.consumption.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Transmission & Distribution</span>
            <span>{{ elecResult.location.transmission_and_distribution.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Well-to-Tank</span>
            <span>{{ elecResult.location.well_to_tank.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>WTT of T&D</span>
            <span>{{ elecResult.location.well_to_tank_of_transmission_and_distribution.co2e.toFixed(2) }} kg</span>
          </li>
        </ul>

        <!-- Estimations “Market-based” -->
        <h6 class="mb-2">Méthode “Market” (Scope 2 market-based)</h6>
        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between">
            <span>Consommation (co2e)</span>
            <span>{{ elecResult.market.consumption.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Transmission & Distribution</span>
            <span>{{ elecResult.market.transmission_and_distribution.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Well-to-Tank</span>
            <span>{{ elecResult.market.well_to_tank.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>WTT of T&D</span>
            <span>{{ elecResult.market.well_to_tank_of_transmission_and_distribution.co2e.toFixed(2) }} kg</span>
          </li>
        </ul>

        <!-- Notices éventuelles -->
        <small class="text-muted">
          Méthode calcul : {{ elecResult.co2e_calculation_method }}<br />
          <template v-if="elecResult.notices && elecResult.notices.length">
            <strong>Notices :</strong>
            <ul class="ps-3 mb-0">
              <li v-for="(n, i) in elecResult.notices" :key="i">{{ n }}</li>
            </ul>
          </template>
        </small>
      </div>
    </div>

    <!-- SECTION CHALEUR & VAPEUR -->
    <div v-if="activeTab === 'heat'">
      <div class="card shadow-sm p-4 mb-5">
        <h5 class="card-title mb-3">Estimation – Chaleur & Vapeur</h5>

        <!-- Formulaire Chaleur -->
        <div class="mb-3">
          <label for="heat-region" class="form-label">Région / Pays</label>
          <input
            id="heat-region"
            type="text"
            v-model.trim="heatRegion"
            class="form-control"
            placeholder="Ex : FR, DE, US-CA"
          />
        </div>

        <div class="mb-3">
          <label for="heat-year" class="form-label">Année (facultatif)</label>
          <input
            id="heat-year"
            type="number"
            v-model.number="heatYear"
            class="form-control"
            placeholder="Ex : 2023"
            min="2000"
          />
        </div>

        <!-- Montant total de chaleur/vapeur -->
        <div class="mb-3">
          <label class="form-label">Quantité de chaleur/vapeur consommée</label>
          <div class="input-group">
            <input
              type="number"
              v-model.number="heatAmount"
              class="form-control"
              placeholder="Ex : 2000"
              min="0"
            />
            <select v-model="heatUnit" class="form-select" style="max-width: 120px;">
              <option disabled value="">Unité</option>
              <option value="kWh">kWh</option>
              <option value="GJ">GJ</option>
            </select>
          </div>
        </div>

        <button
          class="btn btn-primary w-100"
          :disabled="!canEstimateHeat"
          @click="estimateHeat"
        >
          Estimer Chaleur
        </button>

        <p v-if="heatError" class="text-danger mt-3">{{ heatError }}</p>
      </div>

      <!-- Résultats Chaleur -->
      <div v-if="heatResult" class="card shadow-sm p-4">
        <h5 class="card-title mb-3">Résultats – Chaleur & Vapeur</h5>

        <!-- Estimations (Energy Reporting Quad) -->
        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between">
            <span>Consommation (co2e)</span>
            <span>{{ heatResult.estimates.consumption.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Transmission & Distribution</span>
            <span>{{ heatResult.estimates.transmission_and_distribution.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Well-to-Tank</span>
            <span>{{ heatResult.estimates.well_to_tank.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>WTT of T&D</span>
            <span>{{ heatResult.estimates.well_to_tank_of_transmission_and_distribution.co2e.toFixed(2) }} kg</span>
          </li>
        </ul>

        <!-- Notices -->
        <small class="text-muted">
          Méthode calcul : {{ heatResult.co2e_calculation_method }}<br />
          <template v-if="heatResult.notices && heatResult.notices.length">
            <strong>Notices :</strong>
            <ul class="ps-3 mb-0">
              <li v-for="(n, i) in heatResult.notices" :key="i">{{ n }}</li>
            </ul>
          </template>
        </small>
      </div>
    </div>

    <!-- SECTION COMBUSTIBLE -->
    <div v-if="activeTab === 'fuel'">
      <div class="card shadow-sm p-4 mb-5">
        <h5 class="card-title mb-3">Estimation – Combustible</h5>

        <!-- Formulaire Combustible -->
        <div class="mb-3">
          <label for="fuel-type" class="form-label">Type de combustible</label>
          <input
            id="fuel-type"
            type="text"
            v-model.trim="fuelType"
            class="form-control"
            placeholder="Ex : gasoline_95, diesel"
          />
          <small class="form-text text-muted">
            Utilisez un fuel_type valide (voir la documentation des valeurs autorisées)
          </small>
        </div>

        <div class="mb-3">
          <label for="fuel-region" class="form-label">Région / Pays</label>
          <input
            id="fuel-region"
            type="text"
            v-model.trim="fuelRegion"
            class="form-control"
            placeholder="Ex : USA, FR"
          />
        </div>

        <div class="mb-3">
          <label for="fuel-year" class="form-label">Année (facultatif)</label>
          <input
            id="fuel-year"
            type="number"
            v-model.number="fuelYear"
            class="form-control"
            placeholder="Ex : 2023"
            min="2000"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Quantité de combustible consommée</label>
          <div class="input-group">
            <input
              type="number"
              v-model.number="fuelAmount"
              class="form-control"
              placeholder="Ex : 1000"
              min="0"
            />
            <select v-model="fuelUnit" class="form-select" style="max-width: 120px;">
              <option disabled value="">Unité</option>
              <option value="MJ">MJ</option>
              <option value="GJ">GJ</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <button
          class="btn btn-primary w-100"
          :disabled="!canEstimateFuel"
          @click="estimateFuel"
        >
          Estimer Combustible
        </button>

        <p v-if="fuelError" class="text-danger mt-3">{{ fuelError }}</p>
      </div>

      <!-- Résultats Combustible -->
      <div v-if="fuelResult" class="card shadow-sm p-4">
        <h5 class="card-title mb-3">Résultats – Combustible</h5>

        <ul class="list-group mb-4">
          <li class="list-group-item d-flex justify-content-between">
            <span>Combustion (co2e)</span>
            <span>{{ fuelResult.combustion.co2e.toFixed(2) }} kg</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Well-to-Tank (co2e)</span>
            <span>{{ fuelResult.well_to_tank?.co2e?.toFixed(2) ?? '–' }} kg</span>
          </li>
        </ul>

        <small class="text-muted">
          Méthode calcul : {{ fuelResult.co2e_calculation_method }}<br />
          <template v-if="fuelResult.notices && fuelResult.notices.length">
            <strong>Notices :</strong>
            <ul class="ps-3 mb-0">
              <li v-for="(n, i) in fuelResult.notices" :key="i">{{ n }}</li>
            </ul>
          </template>
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

// ──────────────────────────────────────────────────────────────────────────────
// 1) ONGLET ACTIF
// ──────────────────────────────────────────────────────────────────────────────
const activeTab = ref('electricity')

// ──────────────────────────────────────────────────────────────────────────────
// 2) ÉTAT RÉACTIF – ÉLECTRICITÉ
// ──────────────────────────────────────────────────────────────────────────────
const elecRegion = ref('')
const elecYear = ref(null)
const elecAmount = ref(0)
const elecUnit = ref('')        // 'kWh' | 'MWh'
const elecSourceSet = ref('')   // 'core' | 'iea'

const elecError = ref('')
const elecResult = ref(null)

// Valide que le formulaire électricité a les champs requis
const canEstimateElectricity = computed(() => {
  return (
    elecRegion.value.trim() !== '' &&
    elecAmount.value > 0 &&
    elecUnit.value !== '' &&
    elecSourceSet.value !== ''
  )
})

// ──────────────────────────────────────────────────────────────────────────────
// 3) ÉTAT RÉACTIF – CHALEUR & VAPEUR
// ──────────────────────────────────────────────────────────────────────────────
const heatRegion = ref('')
const heatYear = ref(null)
const heatAmount = ref(0)
const heatUnit = ref('')      // 'kWh' | 'GJ'

const heatError = ref('')
const heatResult = ref(null)

const canEstimateHeat = computed(() => {
  return (
    heatRegion.value.trim() !== '' &&
    heatAmount.value > 0 &&
    heatUnit.value !== ''
  )
})

// ──────────────────────────────────────────────────────────────────────────────
// 4) ÉTAT RÉACTIF – COMBUSTIBLE
// ──────────────────────────────────────────────────────────────────────────────
const fuelType = ref('')
const fuelRegion = ref('')
const fuelYear = ref(null)
const fuelAmount = ref(0)
const fuelUnit = ref('')     // 'MJ' | 'GJ' | 'kg'

const fuelError = ref('')
const fuelResult = ref(null)

const canEstimateFuel = computed(() => {
  return (
    fuelType.value.trim() !== '' &&
    fuelRegion.value.trim() !== '' &&
    fuelAmount.value > 0 &&
    fuelUnit.value !== ''
  )
})

// ──────────────────────────────────────────────────────────────────────────────
// 5) FONCTION – ESTIMER ÉLECTRICITÉ
// ──────────────────────────────────────────────────────────────────────────────
async function estimateElectricity() {
  elecError.value = ''
  elecResult.value = null

  // Construire le payload selon la doc Energy v1-preview1
  const payload = {
    region: elecRegion.value.trim(),
    amount: {
      energy: elecAmount.value,
      energy_unit: elecUnit.value,
    },
    source_set: elecSourceSet.value,
  }
  if (elecYear.value) {
    payload.year = elecYear.value
  }

  // Debugging
  console.group('🌿 Climatiq Électricité Request → /energy/v1-preview1/electricity')
  console.log('Authorization:', `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`)
  console.log('Payload:', JSON.stringify(payload, null, 2))
  console.groupEnd()

  try {
    const response = await axios.post(
      'https://preview.api.climatiq.io/energy/v1-preview1/electricity',
      payload,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    elecResult.value = response.data

    console.group('✅ Climatiq Électricité Response ← /energy/v1-preview1/electricity')
    console.log(JSON.stringify(response.data, null, 2))
    console.groupEnd()
  } catch (err) {
    if (err.response && err.response.data) {
      elecError.value = `Erreur : ${err.response.data.error || 'Bad Request'}. Voir la console pour détails.`
      console.error('🛑 Climatiq Électricité Error →', err.response.data)
    } else {
      elecError.value = 'Erreur réseau ou inconnue : ' + err.message
      console.error(err)
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 6) FONCTION – ESTIMER CHALEUR & VAPEUR
// ──────────────────────────────────────────────────────────────────────────────
async function estimateHeat() {
  heatError.value = ''
  heatResult.value = null

  const payload = {
    region: heatRegion.value.trim(),
    components: [
      {
        amount: {
          energy: heatAmount.value,
          energy_unit: heatUnit.value,
        },
      },
    ],
  }
  if (heatYear.value) {
    payload.year = heatYear.value
  }

  // Debugging
  console.group('🌿 Climatiq Chaleur Request → /energy/v1-preview1/heat')
  console.log('Authorization:', `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`)
  console.log('Payload:', JSON.stringify(payload, null, 2))
  console.groupEnd()

  try {
    const response = await axios.post(
      'https://preview.api.climatiq.io/energy/v1-preview1/heat',
      payload,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    heatResult.value = response.data

    console.group('✅ Climatiq Chaleur Response ← /energy/v1-preview1/heat')
    console.log(JSON.stringify(response.data, null, 2))
    console.groupEnd()
  } catch (err) {
    if (err.response && err.response.data) {
      heatError.value = `Erreur : ${err.response.data.error || 'Bad Request'}. Voir la console pour détails.`
      console.error('🛑 Climatiq Chaleur Error →', err.response.data)
    } else {
      heatError.value = 'Erreur réseau ou inconnue : ' + err.message
      console.error(err)
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 7) FONCTION – ESTIMER COMBUSTIBLE
// ──────────────────────────────────────────────────────────────────────────────
async function estimateFuel() {
  fuelError.value = ''
  fuelResult.value = null

  const payload = {
    fuel_type: fuelType.value.trim(),
    region: fuelRegion.value.trim(),
    amount: {
      energy: fuelAmount.value,
      energy_unit: fuelUnit.value,
    },
  }
  if (fuelYear.value) {
    payload.year = fuelYear.value
  }

  // Debugging
  console.group('🌿 Climatiq Combustible Request → /energy/v1-preview1/fuel')
  console.log('Authorization:', `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`)
  console.log('Payload:', JSON.stringify(payload, null, 2))
  console.groupEnd()

  try {
    const response = await axios.post(
      'https://preview.api.climatiq.io/energy/v1-preview1/fuel',
      payload,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    fuelResult.value = response.data

    console.group('✅ Climatiq Combustible Response ← /energy/v1-preview1/fuel')
    console.log(JSON.stringify(response.data, null, 2))
    console.groupEnd()
  } catch (err) {
    if (err.response && err.response.data) {
      fuelError.value = `Erreur : ${err.response.data.error || 'Bad Request'}. Voir la console pour détails.`
      console.error('🛑 Climatiq Combustible Error →', err.response.data)
    } else {
      fuelError.value = 'Erreur réseau ou inconnue : ' + err.message
      console.error(err)
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 8) FILTRE – PREMIÈRE LETTRE EN MAJUSCULE
// ──────────────────────────────────────────────────────────────────────────────
const capitalize = (str) => {
  if (typeof str !== 'string' || !str.length) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
/* On utilise Bootstrap 5 pour la mise en page */
/* Vous pouvez affiner si nécessaire */
.container {
  max-width: 960px;
}
.card {
  border-radius: 0.5rem;
}
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>
