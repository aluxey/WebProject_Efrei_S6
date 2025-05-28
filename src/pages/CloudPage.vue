<template>
  <div class="container-fluid my-5">
    <h1 class="text-center mb-4">Calculateur CO₂ du Cloud (DIY)</h1>

    <div class="row gx-4">
      <!-- Formulaire à gauche -->
      <div class="col-lg-8">
        <div class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Vos paramètres</h5>

          <div class="mb-3">
            <label class="form-label">CPU-core-hours</label>
            <input
              type="number"
              v-model.number="cpuHours"
              class="form-control"
              placeholder="Ex : 10"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">RAM GB-hours</label>
            <input
              type="number"
              v-model.number="ramHours"
              class="form-control"
              placeholder="Ex : 20"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Stockage GB-mois</label>
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
            @click="estimateDIY"
          >
            Estimer CO₂
          </button>
        </div>
      </div>

      <!-- Résultats à droite -->
      <div class="col-lg-4">
        <div v-if="result" class="card shadow-sm p-4">
          <h5 class="card-title mb-3">Résultats</h5>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item d-flex justify-content-between">
              CPU
              <span>{{ result.cpu.toFixed(2) }} kg</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              RAM
              <span>{{ result.ram.toFixed(2) }} kg</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              Stockage
              <span>{{ result.storage.toFixed(2) }} kg</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              Énergie
              <span>{{ result.energy.toFixed(2) }} kg</span>
            </li>
          </ul>
          <div class="d-flex justify-content-between align-items-center">
            <strong>Total</strong>
            <strong>{{ total.toFixed(2) }} kg CO₂e</strong>
          </div>
          <small class="text-muted mt-2 d-block">
            Facteurs utilisés : CPU =0.5, RAM =0.05, Stockage =0.02, Énergie UK =0.599 kg/kWh
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 🌱 Facteurs moyens (modifiable selon ta charte)
const FACTOR_CPU     = 0.5    // kg CO₂e par core-hour
const FACTOR_RAM     = 0.05   // kg CO₂e par GB-hour
const FACTOR_STORAGE = 0.02   // kg CO₂e par GB-mois
const FACTOR_ENERGY  = 0.599  // kg CO₂e par kWh (UK mix, ex.)

// Inputs
const cpuHours   = ref(0)
const ramHours   = ref(0)
const storageGbm = ref(0)
const energyKwh  = ref(0)

// Résultat
const result = ref(null)

// Disponible si toutes les valeurs >0
const canEstimate = computed(() =>
  cpuHours.value > 0 &&
  ramHours.value > 0 &&
  storageGbm.value > 0 &&
  energyKwh.value > 0
)

// Total
const total = computed(() =>
  result.value
    ? result.value.cpu
      + result.value.ram
      + result.value.storage
      + result.value.energy
    : 0
)

// Calcul DIY
function estimateDIY() {
  result.value = {
    cpu:     cpuHours.value   * FACTOR_CPU,
    ram:     ramHours.value   * FACTOR_RAM,
    storage: storageGbm.value * FACTOR_STORAGE,
    energy:  energyKwh.value  * FACTOR_ENERGY
  }
}
</script>

<style scoped>
/* Lexend global + Bootstrap déjà actifs */
</style>
