<template>
  <div class="container-fluid my-4">
    <h2 class="text-center mb-4">Calculateur CO₂ de vols</h2>

    <div class="row gx-4">
      <!-- Carte élargie -->
      <div class="col-lg-9">
        <FlightsMap />
      </div>

      <!-- Formulaire -->
      <div class="col-lg-3">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Sélection du vol</h5>

            <div class="mb-2">
              <label class="form-label">Départ</label>
              <select v-model="fromCode" class="form-select">
                <option disabled value="">— Choisir —</option>
                <option v-for="a in airports" :key="a.code" :value="a.code">
                  {{ a.name }}
                </option>
              </select>
            </div>

            <div class="mb-2">
              <label class="form-label">Arrivée</label>
              <select v-model="toCode" class="form-select">
                <option disabled value="">— Choisir —</option>
                <option v-for="a in airports" :key="a.code" :value="a.code">
                  {{ a.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Type d'avion</label>
              <select v-model="aircraft" class="form-select">
                <option>Court courrier (éco)</option>
                <option>Long courrier (éco)</option>
                <option>Long courrier (business)</option>
              </select>
            </div>

            <button
              class="btn btn-primary w-100"
              :disabled="!fromCode || !toCode"
              @click="estimateEmission"
            >
              Estimer CO₂
            </button>

            <div v-if="result" class="alert alert-info mt-3">
              <p class="mb-1">
                Distance : <strong>{{ distance.toFixed(1) }} km</strong><br/>
                Émissions : <strong>{{ result.co2e.toFixed(1) }} {{ result.co2e_unit }}</strong>
              </p>
              <small class="text-muted">{{ result.note }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FlightsMap from '@/components/FlightsMap.vue'

const airports = [
  { name: 'Atlanta (ATL)', code: 'ATL', lat: 33.6407, lon: -84.4277 },
  { name: 'Beijing (PEK)', code: 'PEK', lat: 40.0801, lon: 116.5846 },
  { name: 'Los Angeles (LAX)', code: 'LAX', lat: 33.9416, lon: -118.4085 },
  { name: 'Dubai (DXB)', code: 'DXB', lat: 25.2532, lon: 55.3657 },
  { name: 'Tokyo (HND)', code: 'HND', lat: 35.5494, lon: 139.7798 },
  { name: 'Chicago (ORD)', code: 'ORD', lat: 41.9742, lon: -87.9073 },
  { name: 'Heathrow (LHR)', code: 'LHR', lat: 51.4700, lon: -0.4543 },
  { name: 'Pudong (PVG)', code: 'PVG', lat: 31.1443, lon: 121.8083 },
  { name: 'CDG (Paris)', code: 'CDG', lat: 49.0097, lon: 2.5479 },
  { name: 'DFW (Dallas)', code: 'DFW', lat: 32.8998, lon: -97.0403 }
]

const fromCode = ref('')
const toCode   = ref('')
const aircraft = ref('Court courrier (éco)')
const result   = ref(null)
const distance = ref(0)

function haversine(a, b) {
  const [lat1, lon1] = a
  const [lat2, lon2] = b
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI/180
  const dLon = (lon2 - lon1) * Math.PI/180
  const c = Math.sin(dLat/2)**2
          + Math.cos(lat1 * Math.PI/180)
          * Math.cos(lat2 * Math.PI/180)
          * Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1-c))
}

function estimateEmission() {
  const from = airports.find(a => a.code === fromCode.value)
  const to   = airports.find(a => a.code === toCode.value)
  if (!from || !to) return

  const dist = haversine([from.lat, from.lon], [to.lat, to.lon])
  distance.value = dist
  result.value = {
    co2e: dist * 0.115,
    co2e_unit: 'kg',
    note: `Basé sur 0.115 kg CO₂e/km (${aircraft.value})`
  }
}
</script>

<style scoped>
</style>
