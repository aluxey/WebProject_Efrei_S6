<template>
  <div class="container-fluid my-5">
    <h1 class="text-center mb-4">Calculateur CO₂ du Cloud (Climatiq API)</h1>

    <div class="row gx-4">
      <div class="col-lg-8">
        <div class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Vos paramètres</h5>

          <div class="mb-3">
            <label class="form-label">CPU (heures de cœur)</label>
            <input
              type="number"
              v-model.number="cpuHours"
              class="form-control"
              placeholder="Ex : 10"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">RAM (GB-heure)</label>
            <input
              type="number"
              v-model.number="ramHours"
              class="form-control"
              placeholder="Ex : 20"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Stockage (GB-mois)</label>
            <input
              type="number"
              v-model.number="storageGbm"
              class="form-control"
              placeholder="Ex : 50"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Énergie (kWh)</label>
            <input
              type="number"
              v-model.number="energyKwh"
              class="form-control"
              placeholder="Ex : 100"
            />
          </div>

          <button
            class="btn btn-primary w-100"
            :disabled="!canEstimate"
            @click="estimateAPI"
          >
            Estimer CO₂
          </button>

          <p v-if="errorMessage" class="text-danger mt-3">
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- Résultats à droite -->
      <div class="col-lg-4">
        <div v-if="result" class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Résultats</h5>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item d-flex justify-content-between">
              CPU
              <span>{{ result.cpu.toFixed(4) }} kg</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              RAM
              <span>{{ result.ram.toFixed(4) }} kg</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              Stockage
              <span>{{ result.storage.toFixed(4) }} kg</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              Énergie
              <span>{{ result.energy.toFixed(4) }} kg</span>
            </li>
          </ul>
          <div class="d-flex justify-content-between align-items-center">
            <strong>Total</strong>
            <strong>{{ total.toFixed(4) }} kg CO₂e</strong>
          </div>
          <small class="text-muted mt-2 d-block">
            Estimations fournies par Climatiq API
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  estimateCpu,
  estimateRam,
  estimateStorage,
  estimateUkGrid,
} from '../api/climatiq'

const cpuHours = ref(0)
const ramHours = ref(0)
const storageGbm = ref(0)
const energyKwh = ref(0)

const result = ref(null)
const errorMessage = ref('')

const canEstimate = computed(
  () =>
    cpuHours.value > 0 &&
    ramHours.value > 0 &&
    storageGbm.value > 0 &&
    energyKwh.value > 0
)

const total = computed(() =>
  result.value
    ? result.value.cpu +
      result.value.ram +
      result.value.storage +
      result.value.energy
    : 0
)

async function estimateAPI() {
  errorMessage.value = ''
  result.value = null

  try {
    const [cpuRes, ramRes, storageRes, energyRes] = await Promise.all([
      estimateCpu(cpuHours.value),
      estimateRam(ramHours.value),
      estimateStorage(storageGbm.value),
      estimateUkGrid(energyKwh.value),
    ])

    result.value = {
      cpu: cpuRes.co2e || 0,
      ram: ramRes.co2e || 0,
      storage: storageRes.co2e || 0,
      energy: energyRes.co2e || 0,
    }
  } catch (err) {
    if (err.response && err.response.data) {
      errorMessage.value = `Erreur Climatiq : ${err.response.data.error_type || 'Bad Request'}. Vérifiez la console pour le payload exact.`
    } else {
      errorMessage.value = 'Erreur réseau ou inconnue : ' + err.message
    }
    console.error('Erreur lors de l’estimation Climatiq :', err)
  }
}
</script>

<style scoped>
</style>
