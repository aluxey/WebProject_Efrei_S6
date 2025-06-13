<template>
  <div class="flights-page">
    <h2>Flight Emissions Calculator</h2>

    <FlightsMap
      v-model:origin="selectedOrigin"
      v-model:destination="selectedDestination"
    />

    <div class="selection-info" v-if="!selectedOrigin || !selectedDestination">
      <p>Please click on two airport markers on the map above.</p>
      <p>
        Selected:
        <strong>{{ selectedOrigin || '––' }} → {{ selectedDestination || '––' }}</strong>
      </p>
    </div>
    <div class="selection-info" v-else>
      <p>
        Selected Route:
        <strong>{{ selectedOrigin }} → {{ selectedDestination }}</strong>
      </p>
    </div>

    <form @submit.prevent="calculateEmission" class="emission-form">
      <label>
        Passengers:
        <input
          type="number"
          v-model.number="passengers"
          min="1"
          :disabled="!canEstimate || loading"
        />
      </label>

      <label>
        Class:
        <select v-model="flightClass" :disabled="!canEstimate || loading">
          <option value="economy">Economy</option>
          <option value="premium_economy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
      </label>

      <button
        type="submit"
        :disabled="!canEstimate || loading"
        class="estimate-button"
      >
        {{ loading ? 'Estimating …' : 'Estimate CO₂' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="emission !== null" class="result">
      Estimated CO₂ Emissions: <strong>{{ emission }} kg CO₂e</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FlightsMap from '@/components/FlightsMap.vue'
import { estimateFlightEmission } from '@/api/emissionService'

// Firestore & store
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

// --- Setup reactive state ---
const store = useUserStore()

const selectedOrigin      = ref('')
const selectedDestination = ref('')
const passengers          = ref(1)
const flightClass         = ref('economy')
const emission            = ref(null)
const loading             = ref(false)
const error               = ref(null)

// Computed helpers
const canEstimate = computed(() =>
  selectedOrigin.value !== '' && selectedDestination.value !== ''
)
const isLoggedIn = computed(() => store.isLoggedIn)
const uid        = computed(() => store.currentUser?.uid || null)

// --- Main method ---
async function calculateEmission() {
  error.value    = null
  emission.value = null
  loading.value  = true

  if (!isLoggedIn.value) {
    error.value   = 'Veuillez vous connecter pour enregistrer ce calcul.'
    loading.value = false
    return
  }

  try {
    // 1) Estimation
    const kgCO2 = await estimateFlightEmission(
      selectedOrigin.value.toUpperCase(),
      selectedDestination.value.toUpperCase(),
      passengers.value,
      flightClass.value
    )
    emission.value = Number(kgCO2.toFixed(2))

    // 2) Enregistrement Firestore
    await addDoc(
      collection(db, 'user', uid.value, 'consommation'),
      {
        userId:        uid.value,                 // pour le collectionGroup
        type:          'flight',
        origin:        selectedOrigin.value.toUpperCase(),
        destination:   selectedDestination.value.toUpperCase(),
        passengers:    passengers.value,
        flightClass:   flightClass.value,
        co2Kg:         emission.value,
        calculationAt: serverTimestamp()
      }
    )
  } catch (e) {
    console.error('Error saving flight emission:', e)
    if (e.code === 'permission-denied') {
      error.value = 'Permissions insuffisantes pour enregistrer ce calcul.'
    } else {
      error.value = 'Impossible d’estimer ou d’enregistrer l’émission.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.flights-page {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
</style>


<style scoped>
.flights-page {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

.selection-info {
  margin: 1rem 0;
  font-size: 1rem;
}

.emission-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.emission-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.estimate-button {
  align-self: flex-end;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
}

.error {
  color: #b00020;
  margin-top: 1rem;
}

.result {
  margin-top: 1rem;
  font-size: 1.1rem;
}
</style>
